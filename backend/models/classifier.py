"""
Crime classifier using the trained LRCN model (best_lrcn_model.h5).
Classifies a sequence of frames into one of the crime categories.
"""

import numpy as np
import cv2
import base64
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import InputLayer
from tensorflow.keras.mixed_precision import Policy

from config import (
    LRCN_MODEL_PATH,
    CRIME_CLASSES,
    SEQUENCE_LENGTH,
    LRCN_IMG_HEIGHT,
    LRCN_IMG_WIDTH,
)

# ─────────────────────────────────────────────────────────────
# 🔥 FIX 1: Patch for old models using 'batch_shape'
# This handles the transition from Keras 2 to Keras 3
# ─────────────────────────────────────────────────────────────
_original_init = InputLayer.__init__

def patched_init(self, *args, **kwargs):
    if "batch_shape" in kwargs:
        kwargs["batch_input_shape"] = kwargs.pop("batch_shape")
    _original_init(self, *args, **kwargs)

InputLayer.__init__ = patched_init
# ─────────────────────────────────────────────────────────────


class CrimeClassifier:
    def __init__(self):
        print(f"[Classifier] Loading LRCN model from: {LRCN_MODEL_PATH}")

        try:
            # 🔥 FIX 2: Added DTypePolicy to custom_objects
            # This solves the "Unknown layer: DTypePolicy" or serialization error.
            self.model = load_model(
                LRCN_MODEL_PATH,
                compile=False,
                custom_objects={
                    "DTypePolicy": Policy,
                    "InputLayer": InputLayer
                }
            )
        except Exception as e:
            print(f"[Classifier] Error loading model: {e}")
            raise e

        self.sequence_length = SEQUENCE_LENGTH
        self.img_h           = LRCN_IMG_HEIGHT
        self.img_w           = LRCN_IMG_WIDTH

        # Verify input shape
        if hasattr(self.model, 'input_shape'):
            print(f"[Classifier] Model input shape : {self.model.input_shape}")
        
        print(f"[Classifier] LRCN model ready  ✓")

    # ── Pre-processing ────────────────────────────────────────
    def _preprocess(self, frames: list[np.ndarray]) -> np.ndarray:
        """
        Resize, normalise, and select SEQUENCE_LENGTH evenly-spaced frames.
        Returns ndarray of shape (1, SEQUENCE_LENGTH, H, W, 3).
        """
        n = len(frames)
        if n == 0:
            raise ValueError("No frames provided to classifier.")

        # Evenly-spaced indices across available frames
        indices  = np.linspace(0, n - 1, self.sequence_length, dtype=int)
        selected = [frames[i] for i in indices]

        processed = []
        for f in selected:
            resized    = cv2.resize(f, (self.img_w, self.img_h))
            rgb        = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
            normalised = rgb.astype(np.float32) / 255.0
            processed.append(normalised)

        # (1, seq, H, W, 3)
        return np.expand_dims(np.array(processed), axis=0)

    # ── Inference ─────────────────────────────────────────────
    def classify(self, frames: list[np.ndarray]) -> dict:
        """
        Classify a list of BGR frames.
        """
        input_data  = self._preprocess(frames)

        predictions = self.model.predict(input_data, verbose=0)[0]

        num_classes = min(len(predictions), len(CRIME_CLASSES))
        predictions = predictions[:num_classes]

        # Apply Softmax if the model outputs raw logits
        if predictions.max() > 1.0 or predictions.min() < 0.0:
            predictions = tf.nn.softmax(predictions).numpy()

        class_idx  = int(np.argmax(predictions))
        crime_type = CRIME_CLASSES[class_idx]
        confidence = float(predictions[class_idx])

        all_scores = {
            CRIME_CLASSES[i]: round(float(predictions[i]), 4)
            for i in range(num_classes)
        }

        return {
            "crime_type": crime_type,
            "confidence": round(confidence, 3),
            "all_scores": all_scores,
            "is_anomaly": crime_type != "Normal",
        }

    # ── Utility ───────────────────────────────────────────────
    @staticmethod
    def frame_to_b64(frame: np.ndarray) -> str:
        _, buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
        return base64.b64encode(buf).decode("utf-8")