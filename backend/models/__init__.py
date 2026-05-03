# backend/models/__init__.py

from .detector  import WeaponDetector
from .classifier import CrimeClassifier

# Singletons — loaded once at startup, reused for every request
detector   = WeaponDetector()
classifier = CrimeClassifier()

def get_detector():
    return detector

def get_classifier():
    return classifier