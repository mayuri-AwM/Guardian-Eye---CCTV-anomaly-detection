"""
Lazy singleton loader for ML models.
Models are loaded once on first use and reused across requests.
"""

from functools import lru_cache
from models.detector   import WeaponDetector
from models.classifier import CrimeClassifier


@lru_cache(maxsize=1)
def get_detector() -> WeaponDetector:
    return WeaponDetector()


@lru_cache(maxsize=1)
def get_classifier() -> CrimeClassifier:
    return CrimeClassifier()
