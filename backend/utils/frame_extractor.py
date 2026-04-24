"""
Utility functions for extracting frames from video files.
"""

import cv2
import numpy as np
from config import FRAME_INTERVAL


def get_video_info(video_path: str) -> dict:
    """Return basic metadata for a video file."""
    cap  = cv2.VideoCapture(video_path)
    fps  = cap.get(cv2.CAP_PROP_FPS)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    cap.release()

    return {
        "fps":              round(fps, 2),
        "total_frames":     total,
        "width":            int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
        "height":           int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
        "duration_seconds": round(total / fps, 2) if fps > 0 else 0,
    }


def extract_frames(
    video_path: str,
    interval: int = FRAME_INTERVAL,
    max_frames: int = 300,
) -> list[np.ndarray]:
    """
    Extract every `interval`-th frame from the video.

    Parameters
    ----------
    video_path : str
    interval   : sample every Nth frame
    max_frames : hard cap to avoid OOM on long videos

    Returns
    -------
    list of BGR numpy arrays
    """
    cap    = cv2.VideoCapture(video_path)
    frames = []
    idx    = 0

    if not cap.isOpened():
        raise ValueError(f"Cannot open video: {video_path}")

    while len(frames) < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
        if idx % interval == 0:
            frames.append(frame)
        idx += 1

    cap.release()
    print(f"[FrameExtractor] Extracted {len(frames)} frames (interval={interval})")
    return frames
