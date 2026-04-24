"""
Guardian Eye — FastAPI backend entry point.

Run:
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import video

app = FastAPI(
    title="Guardian Eye API",
    description="CCTV crime and weapon detection backend",
    version="1.0.0",
)

# Allow the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
# /upload-video and /analyze live directly under root to match the existing frontend
app.include_router(video.router, prefix="/api/video", tags=["video"])

# Also expose /upload-video at root level (matches the existing frontend XHR call)
app.include_router(video.router, tags=["video-compat"])


@app.get("/", tags=["health"])
def health():
    return {"status": "Guardian Eye API running"}


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok", "version": "1.0.0"}
