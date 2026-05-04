from fastapi import FastAPI
from routers import video
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Guardian Eye API",
    description="AI CCTV Anomaly Detection Backend",
    version="1.0.0"
)

# ✅ CORS (important for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 change later to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include routes
app.include_router(video.router, prefix="/api/video", tags=["Video"])

# ✅ Root endpoint (for testing deployment)
@app.get("/")
def root():
    return {"message": "Guardian Eye Backend Running 🚀"}

# ✅ Health check (Render uses this sometimes)
@app.get("/health")
def health():
    return {"status": "ok"}