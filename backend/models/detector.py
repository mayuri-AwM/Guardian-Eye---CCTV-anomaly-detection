"""
Weapon detector using YOLOv8 (.pt model)
Detects knives and guns in video frames
"""

import cv2
import base64
import numpy as np
from ultralytics import YOLO
from config import YOLO_MODEL_PATH, YOLO_CONFIDENCE, WEAPON_CLASSES

# Bounding box colors
BOX_COLORS = {
    "pistol": (0, 0, 255),     # Red
    "knife":  (0, 140, 255),   # Orange
}
DEFAULT_COLOR = (0, 255, 0)


class WeaponDetector:
    def __init__(self):
        print(f"[Detector] Loading YOLO model from: {YOLO_MODEL_PATH}")

        # ✅ CORRECT WAY TO LOAD YOLO
        self.model = YOLO(YOLO_MODEL_PATH)

        self.conf = YOLO_CONFIDENCE
        print("[Detector] YOLO model ready ✓")

    # ── Single frame detection ─────────────────────────────
    def detect_frame(self, frame: np.ndarray):
        results = self.model.predict(
            source=frame,
            conf=self.conf,
            verbose=False
        )

        detections = []
        annotated = frame.copy()

        for r in results:
            if r.boxes is None:
                continue

            for box in r.boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                x1, y1, x2, y2 = map(int, box.xyxy[0])

                label = WEAPON_CLASSES.get(cls_id, f"class_{cls_id}")
                color = BOX_COLORS.get(label, DEFAULT_COLOR)

                detections.append({
                    "class": label,
                    "confidence": round(conf, 3),
                    "bbox": [x1, y1, x2, y2],
                })

                # Draw box
                cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)

                # Label text
                tag = f"{label.upper()} {conf:.0%}"
                (tw, th), _ = cv2.getTextSize(tag, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)

                cv2.rectangle(annotated, (x1, y1 - th - 8), (x1 + tw + 5, y1), color, -1)

                cv2.putText(
                    annotated,
                    tag,
                    (x1 + 2, y1 - 4),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (255, 255, 255),
                    2,
                )

        return detections, annotated

    # ── Multiple frames detection ─────────────────────────────
    def detect_frames(self, frames: list[np.ndarray]):
        best_conf = 0.0
        best_frame_ann = None
        weapon_detected = "none"
        all_detections = []

        for frame in frames:
            dets, annotated = self.detect_frame(frame)
            all_detections.append(dets)

            for d in dets:
                if d["confidence"] > best_conf:
                    best_conf = d["confidence"]
                    weapon_detected = d["class"]
                    best_frame_ann = annotated

        best_frame_b64 = (
            self._frame_to_b64(best_frame_ann)
            if best_frame_ann is not None
            else None
        )

        return {
            "weapon_detected": weapon_detected,
            "max_confidence": round(best_conf, 3),
            "best_frame_b64": best_frame_b64,
            "all_detections": all_detections,
        }

    # ── Convert frame to base64 ─────────────────────────────
    @staticmethod
    def _frame_to_b64(frame: np.ndarray):
        _, buf = cv2.imencode(".jpg", frame)
        return base64.b64encode(buf).decode("utf-8")