from ultralytics import YOLO
import cv2
from config import YOLO_MODEL_PATH, YOLO_CONF, WEAPON_CLASSES

class WeaponDetector:
    def __init__(self):
        self.model = YOLO(YOLO_MODEL_PATH)

    def detect(self, frame):
        results = self.model(frame, conf=YOLO_CONF)

        detections = []
        annotated = frame.copy()

        for r in results:
            for box in r.boxes:
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                x1, y1, x2, y2 = map(int, box.xyxy[0])

                label = WEAPON_CLASSES.get(cls, "unknown")

                detections.append({
                    "class": label,
                    "confidence": conf
                })

                cv2.rectangle(annotated, (x1,y1),(x2,y2),(0,0,255),2)
                cv2.putText(annotated, label, (x1,y1-10),
                            cv2.FONT_HERSHEY_SIMPLEX,0.6,(255,255,255),2)

        return detections, annotated