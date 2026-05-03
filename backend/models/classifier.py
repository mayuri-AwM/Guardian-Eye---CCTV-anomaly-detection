"""
backend/models/classifier.py
Loads the .pth checkpoint using LRCN_MODEL_PATH from config.py.
"""

import numpy as np
import cv2
import torch
import torch.nn as nn
import torchvision.models as tv_models
from typing import List, Dict

from config import LRCN_MODEL_PATH, CRIME_CLASSES, SEQ_LEN, IMG_SIZE


# ── 1.  Model definition ───────────────────────────────────────────────────────
#        Must exactly match Cell 16 of guardian_eye_pytorch_v2.ipynb

class LRCNModel(nn.Module):
    def __init__(self, num_classes: int, seq_len: int, img_size: int):
        super().__init__()
        self.seq_len = seq_len

        backbone          = tv_models.mobilenet_v3_small(weights=None)
        self.cnn          = backbone.features
        self.pool         = nn.AdaptiveAvgPool2d(1)
        self.cnn_out_size = 576

        self.lstm = nn.LSTM(
            input_size    = self.cnn_out_size,
            hidden_size   = 256,
            num_layers    = 2,
            batch_first   = True,
            dropout       = 0.4,
            bidirectional = True,
        )

        lstm_out = 256 * 2  # 512
        self.classifier = nn.Sequential(
            nn.LayerNorm(lstm_out),
            nn.Linear(lstm_out, 256),
            nn.GELU(),
            nn.Dropout(0.4),
            nn.Linear(256, 128),
            nn.GELU(),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, S, C, H, W = x.shape
        x = x.view(B * S, C, H, W)
        x = self.cnn(x)
        x = self.pool(x)
        x = x.view(B * S, -1)
        x = x.view(B, S, -1)
        x, _ = self.lstm(x)
        x = x[:, -1, :]
        return self.classifier(x)


# ── 2.  Preprocessing helpers ─────────────────────────────────────────────────

def _apply_clahe(frame_bgr: np.ndarray) -> np.ndarray:
    lab     = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe   = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l       = clahe.apply(l)
    return cv2.cvtColor(cv2.merge([l, a, b]), cv2.COLOR_LAB2BGR)


def _apply_sharpen(frame_bgr: np.ndarray) -> np.ndarray:
    blur = cv2.GaussianBlur(frame_bgr, (0, 0), 3)
    return cv2.addWeighted(frame_bgr, 1.5, blur, -0.5, 0)


def _preprocess_frame(frame_bgr: np.ndarray) -> np.ndarray:
    """CLAHE + sharpen + BGR->RGB. Input must be uint8."""
    frame = _apply_clahe(frame_bgr)
    frame = _apply_sharpen(frame)
    return cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)


# ── 3.  CrimeClassifier ───────────────────────────────────────────────────────

class CrimeClassifier:
    """
    Loads LRCN_MODEL_PATH from config and exposes .classify(frames).
    frames: list of BGR uint8 numpy arrays from frame_extractor.py
    """

    def __init__(self):
        self.device   = "cuda" if torch.cuda.is_available() else "cpu"
        self.classes  = CRIME_CLASSES   # from config.py
        self.seq_len  = SEQ_LEN         # from config.py  (16)
        self.img_size = IMG_SIZE        # from config.py  (128)

        print(f"[CrimeClassifier] Loading on {self.device}")
        print(f"[CrimeClassifier] Path: {LRCN_MODEL_PATH}")

        ckpt = torch.load(LRCN_MODEL_PATH, map_location=self.device)

        # Read seq_len / img_size / classes from checkpoint if present;
        # fall back to config.py values so old checkpoints still work.
        if "config" in ckpt:
            cfg           = ckpt["config"]
            self.seq_len  = cfg.get("seq_len",      self.seq_len)
            self.img_size = cfg.get("img_h",         self.img_size)
            self.classes  = cfg.get("classes_list",  self.classes)

        self.model = LRCNModel(
            num_classes = len(self.classes),
            seq_len     = self.seq_len,
            img_size    = self.img_size,
        ).to(self.device)

        self.model.load_state_dict(ckpt["model_state"])
        self.model.eval()

        print(f"[CrimeClassifier] Ready — seq_len={self.seq_len}  "
              f"img_size={self.img_size}  classes={self.classes}")

    # ── Public method called by video.py ──────────────────────────────────────

    def classify(self, frames: List[np.ndarray]) -> Dict:
        """
        frames: list of BGR uint8 arrays from cv2.VideoCapture / frame_extractor.
        Returns dict with keys: prediction, crime, crime_type, confidence,
                                all_probabilities
        """
        if not frames:
            return self._empty_result()

        processed = []
        for f in frames:
            # Accept both uint8 and float32 [0,1]
            if f.dtype != np.uint8:
                f = (np.clip(f, 0, 1) * 255).astype(np.uint8)

            f = _preprocess_frame(f)    # BGR uint8 -> RGB uint8

            f = cv2.resize(f, (self.img_size, self.img_size),
                           interpolation=cv2.INTER_LANCZOS4)
            processed.append(f.astype(np.float32) / 255.0)

        # Pad or trim to exactly seq_len
        while len(processed) < self.seq_len:
            processed.append(processed[-1].copy())
        processed = processed[:self.seq_len]

        # Build tensor  (1, S, 3, H, W)
        x = np.stack(processed)                        # (S, H, W, 3)
        x = torch.from_numpy(x).permute(0, 3, 1, 2)   # (S, 3, H, W)
        x = x.unsqueeze(0).to(self.device)             # (1, S, 3, H, W)

        with torch.no_grad():
            logits = self.model(x)
            probs  = torch.softmax(logits, dim=1)[0].cpu().numpy()

        pred_idx   = int(probs.argmax())
        pred_class = self.classes[pred_idx]
        confidence = float(probs[pred_idx])

        return {
            "prediction":        pred_class,
            "crime":             pred_class,   # video.py: .get("crime")
            "crime_type":        pred_class,   # video.py: .get("crime_type")
            "confidence":        round(confidence, 4),
            "all_probabilities": {
                c: round(float(p), 4)
                for c, p in zip(self.classes, probs)
            },
        }

    def _empty_result(self) -> Dict:
        return {
            "prediction":        "normal",
            "crime":             "normal",
            "crime_type":        "normal",
            "confidence":        0.0,
            "all_probabilities": {c: 0.0 for c in self.classes},
        }