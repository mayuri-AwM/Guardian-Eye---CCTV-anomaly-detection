"""
Video router — handles video upload and the full AI analysis pipeline.

Endpoints
---------
POST /api/video/upload-video   → save file, return saved path
POST /api/video/analyze        → run detection + classification, return results
"""

import os
import uuid
import shutil
import base64
import cv2
import numpy as np

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from config import UPLOAD_DIR, SEVERITY_MAP
from utils.frame_extractor import extract_frames, get_video_info
from models import get_detector, get_classifier

router = APIRouter()

os.makedirs(UPLOAD_DIR, exist_ok=True)


# ─── Upload ───────────────────────────────────────────────────────────────────

@router.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    """
    Save uploaded video to disk.
    Returns the saved path so the frontend can pass it to /analyze.
    """
    # Basic type check
    allowed_ext = {".mp4", ".avi", ".mov", ".mkv"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_ext:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")

    unique_name = f"{uuid.uuid4()}{ext}"
    file_path   = os.path.join(UPLOAD_DIR, unique_name)

    with open(file_path, "wb") as buf:
        shutil.copyfileobj(file.file, buf)

    return {
        "filename": file.filename,
        "status":   "saved",
        "path":     file_path,          # returned to frontend, sent back in /analyze
    }


# ─── Analyze ──────────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    path: str   # file path returned from /upload-video


@router.post("/analyze")
async def analyze_video(req: AnalyzeRequest):
    """
    Full AI pipeline:
      1. Extract frames from video
      2. Run YOLOv8 weapon detection on every frame
      3. Run LRCN crime classification on the frame sequence
      4. Combine results → severity level + alert message
    """
    if not os.path.exists(req.path):
        raise HTTPException(status_code=404, detail="Video file not found on server.")

    # ── 1. Video metadata ──────────────────────────────────────────────────
    try:
        info = get_video_info(req.path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cannot read video: {e}")

    # ── 2. Extract frames ──────────────────────────────────────────────────
    try:
        frames = extract_frames(req.path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Frame extraction failed: {e}")

    if len(frames) == 0:
        raise HTTPException(status_code=422, detail="No frames could be extracted.")

    # ── 3. Weapon detection ────────────────────────────────────────────────
    try:
        detector       = get_detector()
        detection_res  = detector.detect_frames(frames)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weapon detection failed: {e}")

    # ── 4. Crime classification ────────────────────────────────────────────
    try:
        classifier  = get_classifier()
        class_res   = classifier.classify(frames)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crime classification failed: {e}")

    # ── 5. Determine severity & alert ──────────────────────────────────────
    weapon      = detection_res["weapon_detected"]   # "gun" | "knife" | "none"
    crime       = class_res["crime_type"]            # e.g. "Fighting"
    key         = (weapon, crime)
    severity    = SEVERITY_MAP.get(key, _fallback_severity(weapon, crime))
    alert_msg   = _build_alert_message(weapon, crime, severity)

    # ── 6. Sample annotated frames for the frontend ────────────────────────
    preview_frames_b64 = _sample_preview_frames(frames, detection_res["all_detections"], detector)

    return JSONResponse({
        # Detection
        "weapon_detected":  weapon,
        "weapon_confidence": detection_res["max_confidence"],
        "best_frame_b64":   detection_res["best_frame_b64"],   # may be None

        # Classification
        "crime_type":        crime,
        "crime_confidence":  class_res["confidence"],
        "all_scores":        class_res["all_scores"],
        "is_anomaly":        class_res["is_anomaly"],

        # Alert
        "severity":          severity,
        "alert_message":     alert_msg,
        "preview_frames":    preview_frames_b64,   # list of b64 JPEGs

        # Meta
        "video_info":        info,
        "frames_analysed":   len(frames),
    })


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _fallback_severity(weapon: str, crime: str) -> str:
    if weapon == "gun":
        return "CRITICAL"
    if weapon == "knife":
        return "HIGH"
    if crime in ("Fighting", "Kidnapping", "Robbery"):
        return "HIGH"
    if crime in ("Burglary", "Shoplifting"):
        return "MEDIUM"
    return "LOW"


def _build_alert_message(weapon: str, crime: str, severity: str) -> str:
    weapon_part = f" with {weapon} detected" if weapon != "none" else ""
    return f"[{severity}] {crime} activity detected{weapon_part}. Immediate review recommended."


def _sample_preview_frames(
    frames: list,
    all_detections: list,
    detector,
    n: int = 4,
) -> list[str]:
    """
    Pick n evenly-spaced frames, draw boxes on any that had detections,
    return as base64-encoded JPEGs.
    """
    indices  = np.linspace(0, len(frames) - 1, n, dtype=int)
    previews = []

    for i in indices:
        frame = frames[i].copy()
        dets  = all_detections[i] if i < len(all_detections) else []

        # Re-draw boxes (already drawn in detect_frames but we need fresh copies)
        for d in dets:
            x1, y1, x2, y2 = d["bbox"]
            label = d["class"].upper()
            color = (0, 0, 255) if label == "GUN" else (0, 140, 255)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, f"{label} {d['confidence']:.0%}",
                        (x1, y1 - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        previews.append(detector._frame_to_b64(frame))

    return previews
