from fastapi import APIRouter, UploadFile, File
import os
import uuid
import cv2
import base64
from db import alerts_collection
from datetime import datetime
from config import UPLOAD_DIR, SEVERITY_MAP
from utils.alert import send_alert
from utils.frame_extractor import extract_frames
from models import get_detector, get_classifier

router = APIRouter()


# ── UPLOAD ─────────────────────────────────────────────────────────────────
@router.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}_{file.filename}"
    path = os.path.join(UPLOAD_DIR, filename)

    with open(path, "wb") as f:
        f.write(await file.read())

    return {"path": path}


# ── ANALYZE ────────────────────────────────────────────────────────────────
@router.post("/analyze")
async def analyze(data: dict):
    video_path = data["path"]

    # Extract frames
    frames = extract_frames(video_path)

    detector   = get_detector()
    classifier = get_classifier()

    best_frame = None
    best_conf  = 0.0
    weapon     = "none"

    # ── Weapon Detection ──────────────────────────────────────────────────
    for frame in frames:
        detections, annotated = detector.detect(frame)

        for d in detections:
            if d["confidence"] > best_conf:
                best_conf  = d["confidence"]
                weapon     = d["class"]
                best_frame = annotated

    # ── Crime Classification ───────────────────────────────────────────────
    crime_result = classifier.classify(frames)

    # BUG FIXED: The old code used crime_result["crime"] on line 53 but then
    # crime_result["crime_type"] in the return block — one of the two always
    # crashes with a KeyError.  We now read the crime label once using .get()
    # with a fallback so it works regardless of which key the classifier uses.
    crime = (
        crime_result.get("crime_type")
        or crime_result.get("crime")
        or "normal"
    ).lower()   # normalise to lowercase to match SEVERITY_MAP keys

    crime_confidence = crime_result.get("confidence", 0.0)

    # ── Severity Mapping ──────────────────────────────────────────────────
    # BUG FIXED: Severity was computed TWICE (lines 57 and 73 in the original).
    # The first computation drove alert sending; the second overwrote it for the
    # response.  They used different crime variables so they could disagree —
    # e.g. alert fires at HIGH but response returns LOW (or vice-versa).
    # Now there is exactly ONE severity computation, used for both.
    severity = SEVERITY_MAP.get((weapon, crime), "LOW")

    # ── Send Alert ────────────────────────────────────────────────────────
    alert_sent = False
    if severity in ["HIGH", "CRITICAL"]:
        send_alert(weapon, crime, severity)
        alert_sent = True

    # ── Save Best Frame + encode as base64 ────────────────────────────────
    # BUG FIXED: The old code saved the annotated frame to disk and returned its
    # filesystem path (e.g. "uploads/result_abc.jpg").  A browser cannot load a
    # server-side file path as an <img> src.  We now also encode the frame as a
    # base64 string and include it in the JSON response so the frontend can
    # render it directly with:  src={`data:image/jpeg;base64,${best_frame_b64}`}
    output_path    = None
    best_frame_b64 = None

    if best_frame is not None:
        output_filename = f"result_{uuid.uuid4()}.jpg"
        output_path     = os.path.join(UPLOAD_DIR, output_filename)
        cv2.imwrite(output_path, best_frame)

        # Encode the saved file to base64 for the frontend
        with open(output_path, "rb") as img_file:
            best_frame_b64 = base64.b64encode(img_file.read()).decode("utf-8")

        # ── Save to MongoDB ─────────────────────────────────────────
    alert_message = f"{crime.upper()} detected with {weapon.upper()} (Severity: {severity})"

    alerts_collection.insert_one({
        "video_path": video_path,
        "frame_path": output_path,
        "weapon": weapon,
        "weapon_confidence": best_conf,
        "crime": crime,
        "crime_confidence": crime_confidence,
        "severity": severity,
        "alert_sent": alert_sent,
        "alert_message": alert_message,
        "timestamp": datetime.now()
    })

    # ── Response ──────────────────────────────────────────────────────────
    return {
    "weapon": weapon,
    "weapon_confidence": best_conf,
    "crime": crime,
    "crime_confidence": crime_confidence,
    "severity": severity,
    "frame_path": output_path,
    "best_frame_b64": best_frame_b64,
    "alert_sent": alert_sent,
    "alert_message": alert_message
}


