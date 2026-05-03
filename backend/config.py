import os

# ── MODEL PATHS ─────────────────────────────
YOLO_MODEL_PATH = r"D:\projects\edp\Guardian-Eye---CCTV-anomaly-detection\models\best.pt"
LRCN_MODEL_PATH = r"D:\projects\edp\Guardian-Eye---CCTV-anomaly-detection\models\guardian_eye_pytorch_20260504_014000_acc0.4667.pth"

# ── SETTINGS ────────────────────────────────
YOLO_CONF = 0.4
FRAME_INTERVAL = 10
SEQ_LEN = 16
IMG_SIZE = 128

# ── CLASSES ────────────────────────────────
WEAPON_CLASSES = {
    0: "gun",
    1: "knife"
}

# FIX: These are the actual strings the LRCN classifier outputs (all lowercase).
# SEVERITY_MAP keys MUST match these exactly — any case mismatch returns "LOW".
CRIME_CLASSES = [
    'shooting', 'fighting', 'explosion',
    'roadaccidents', 'stealing', 'normal'
]

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ── TWILIO CONFIG ───────────────────────
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = "f4e9131fd6a8e5c7a82ab483edcb161f"
TWILIO_PHONE = "+16067052530"   # Twilio number
ALERT_PHONE = "+917666876382"  # Your phone

# ── Severity Mapping ─────────────────────────────────────────────────────────
#
# BUG FIXED: All crime keys are now lowercase to match CRIME_CLASSES output.
#
# Previously the keys used Title Case ("Fighting", "Normal", etc.) but the LRCN
# classifier returns lowercase strings ("fighting", "normal").  A dict lookup is
# case-sensitive, so EVERY lookup was silently missing and defaulting to "LOW".
#
# BUG FIXED: Added the 4 classes that exist in CRIME_CLASSES but were completely
# absent from the old map ("shooting", "explosion", "roadaccidents", "stealing").
# Those 4 classes always returned "LOW" regardless of weapon — now they are mapped.
#
SEVERITY_MAP = {
    # ── gun + crime ──────────────────────────────────────────────────────────
    ("gun",   "normal"):        "CRITICAL",
    ("gun",   "shooting"):      "CRITICAL",
    ("gun",   "fighting"):      "CRITICAL",
    ("gun",   "explosion"):     "CRITICAL",
    ("gun",   "roadaccidents"): "HIGH",
    ("gun",   "stealing"):      "HIGH",

    # ── knife + crime ────────────────────────────────────────────────────────
    ("knife", "fighting"):      "HIGH",
    ("knife", "shooting"):      "CRITICAL",
    ("knife", "normal"):        "HIGH",
    ("knife", "explosion"):     "HIGH",
    ("knife", "roadaccidents"): "MEDIUM",
    ("knife", "stealing"):      "HIGH",

    # ── no weapon + crime ────────────────────────────────────────────────────
    ("none",  "normal"):        "LOW",
    ("none",  "shooting"):      "CRITICAL",
    ("none",  "fighting"):      "HIGH",
    ("none",  "explosion"):     "HIGH",
    ("none",  "roadaccidents"): "MEDIUM",
    ("none",  "stealing"):      "MEDIUM",
}