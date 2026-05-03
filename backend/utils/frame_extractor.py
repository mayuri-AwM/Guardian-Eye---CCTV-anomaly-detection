import cv2
import numpy as np
from config import FRAME_INTERVAL, IMG_SIZE

def extract_frames(video_path):
    cap = cv2.VideoCapture(video_path)
    frames = []

    count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if count % FRAME_INTERVAL == 0:
            frames.append(frame)

        count += 1

    cap.release()

    return frames