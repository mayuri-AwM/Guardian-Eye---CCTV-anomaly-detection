import os

# ── Model Paths ────────────────────────────────────────────────────────────────
# Update these paths to match where your model files are stored on your machine
YOLO_MODEL_PATH = r"D:\projects\edp\Guardian-Eye---CCTV-anomaly-detection\best.pt"
LRCN_MODEL_PATH   = r"D:\projects\edp\Guardian-Eye---CCTV-anomaly-detection\best_lrcn_model.h5"

# ── Detection Settings ─────────────────────────────────────────────────────────
YOLO_CONFIDENCE   = 0.45          # Min confidence for weapon detection
FRAME_INTERVAL    = 10            # Sample every Nth frame for detection
SEQUENCE_LENGTH   = 16            # Frames fed into LRCN classifier

# ── LRCN Input Shape ───────────────────────────────────────────────────────────
# ⚠️  Match these to what your model was trained on
LRCN_IMG_HEIGHT   = 64
LRCN_IMG_WIDTH    = 64

# ── Crime Classes ──────────────────────────────────────────────────────────────
# ⚠️  Order must match the output order of your LRCN model
CRIME_CLASSES = [
    "Normal",
    "Shoplifting",
    "Fighting",
    "Burglary",
    "Kidnapping",
    "Robbery",
]

# ── Weapon Classes ─────────────────────────────────────────────────────────────
# ⚠️  Match class indices from your data.yaml
WEAPON_CLASSES = {
    0: "knife",
    1: "gun",
}

# ── Severity Mapping ───────────────────────────────────────────────────────────
# Determine severity based on detected weapon and crime type
SEVERITY_MAP = {
    # (weapon, crime)  → severity
    ("gun",   "Normal"):      "CRITICAL",
    ("gun",   "Robbery"):     "CRITICAL",
    ("gun",   "Kidnapping"):  "CRITICAL",
    ("gun",   "Fighting"):    "CRITICAL",
    ("gun",   "Burglary"):    "CRITICAL",
    ("gun",   "Shoplifting"): "HIGH",
    ("knife", "Fighting"):    "HIGH",
    ("knife", "Robbery"):     "HIGH",
    ("knife", "Kidnapping"):  "CRITICAL",
    ("knife", "Normal"):      "HIGH",
    ("knife", "Burglary"):    "HIGH",
    ("knife", "Shoplifting"): "MEDIUM",
    ("none",  "Normal"):      "LOW",
    ("none",  "Shoplifting"): "MEDIUM",
    ("none",  "Fighting"):    "HIGH",
    ("none",  "Burglary"):    "MEDIUM",
    ("none",  "Kidnapping"):  "HIGH",
    ("none",  "Robbery"):     "HIGH",
}

# ── Upload Settings ────────────────────────────────────────────────────────────
UPLOAD_DIR   = "uploads"
MAX_FILE_MB  = 500
