
---

# Guardian Eye – AI CCTV Anomaly Detection System

Guardian Eye is an **AI-powered CCTV surveillance web application** that automatically detects suspicious activities from surveillance videos and alerts the CCTV owner with evidence frames.

The system uses **Computer Vision and Deep Learning** to detect weapons and classify crime activities such as **fighting, robbery, abuse, stealing, or explosions** from CCTV footage.

The architecture is **modular and scalable**, allowing the system to evolve from **uploaded video analysis (MVP)** to **real-time CCTV camera monitoring**.

---

# Project Overview

Traditional CCTV systems require **continuous human monitoring**.

Guardian Eye automates surveillance by:

• Analyzing CCTV video frames using AI models
• Detecting abnormal activities automatically
• Capturing the frame where the anomaly occurs
• Generating alerts for the CCTV owner
• Displaying alerts and evidence on a web dashboard

This helps **reduce manual monitoring and improves security response time**.

---

# Key Features

• Upload CCTV videos for automated analysis
• Weapon detection using **YOLOv8 object detection**
• AI classification of suspicious activities
• Detect crimes such as:

* Abuse
* Explosion
* Fighting
* Robbery
* Stealing
* Normal Activity

• Automatic anomaly detection from video frames
• Capture and store evidence frame of the incident
• Instant alerts for CCTV owners
• Dashboard showing alerts and detected frames
• Secure login and authentication system
• Scalable architecture for future real-time CCTV streaming

---

# System Architecture

```
React Frontend
       │
       │ REST API
       ▼
FastAPI Backend
       │
       │ Video Processing Pipeline
       │
       ├── Frame Extraction (OpenCV)
       ├── Weapon Detection (YOLOv8)
       ├── Crime Classification Model
       └── Alert Generation
       │
       ▼
PostgreSQL Database
       │
       ▼
Notification Service
```

---

# Tech Stack

## Frontend

React.js
HTML5
CSS3
Bootstrap
React Router

## Backend

Python
FastAPI
Pydantic
Uvicorn

## AI / Machine Learning

PyTorch
TensorFlow
Ultralytics YOLOv8
OpenCV

## Database

PostgreSQL
SQLAlchemy ORM

## Task Processing

Redis
Celery / RQ

## Storage

Local Storage (MVP)
AWS S3 (future)

## Notifications

SMTP Email Alerts
Firebase Push Notifications (future)

## DevOps

Docker
Docker Compose

---

# Backend Folder Structure

```
backend/
│
├── app/
│   ├── main.py
│   ├── config.py
│   ├── dependencies.py
│
│   ├── routes/
│   │   ├── upload.py
│   │   ├── alerts.py
│   │   └── auth.py
│
│   ├── models/
│   │   ├── user.py
│   │   ├── video.py
│   │   └── alert.py
│
│   ├── schemas/
│   │   ├── user_schema.py
│   │   ├── video_schema.py
│   │   └── alert_schema.py
│
│   ├── services/
│   │   ├── video_processor.py
│   │   ├── alert_service.py
│   │   └── notification_service.py
│
│   ├── ai_engine/
│   │   ├── weapon_detection.py
│   │   ├── crime_classification.py
│   │   └── frame_extractor.py
│
│   ├── database/
│   │   ├── connection.py
│   │   └── migrations
│
│   └── utils/
│       ├── logger.py
│       └── helpers.py
│
└── requirements.txt
```

---

# Frontend Folder Structure

```
guardian-eye/
│
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── Dash.js
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   │── Signup.js
│   │   ├── Navbar.js
│   │   ├── About.js
│   │   └── Contact.js
│
│   ├── photos/
│   │   └── bg.webp
│
│   ├── styles/
│   │   └── dash.css
│
│   ├── App.js
│   └── index.js
│
├── package.json
└── README.md
```

---

# Backend Workflow

## 1 Video Upload

The CCTV owner uploads a video.

API Endpoint:

```
POST /upload-video
```

The backend stores the video and sends it to the **processing queue**.

---

## 2 Frame Extraction

Using **OpenCV**, the video is converted into frames.

Example:

```
video.mp4
   ↓
frame_1.jpg
frame_2.jpg
frame_3.jpg
```

---

## 3 Weapon Detection

Each frame is analyzed using **YOLOv8 object detection**.

Detected objects:

• Gun
• Knife
• Stick
• Suspicious weapons

Output:

• Bounding Box
• Confidence Score
• Object Label

---

## 4 Crime Classification

A deep learning model classifies activities into:

• Abuse
• Explosion
• Fighting
• Robbery
• Stealing
• Normal

The model analyzes **scene context and motion patterns**.

---

## 5 Anomaly Detection

If the predicted class is not **Normal**, the system triggers an anomaly.

```
Crime Detected
      ↓
Frame Captured
      ↓
Alert Generated
```

---

## 6 Alert Generation

The backend stores:

• Crime type
• Timestamp
• Evidence frame
• Video reference
• Confidence score

Example:

```
Crime: Fighting
Confidence: 0.91
Time: 00:02:13
Frame: frame_125.jpg
```

---

## 7 Notification Service

When an anomaly is detected, the system sends alerts.

Notification methods:

• Email alerts (MVP)
• Push notifications (future)
• SMS alerts (future)

---

# Database Schema

### Users

```
id
email
password_hash
created_at
```

### Videos

```
id
user_id
video_path
upload_time
status
```

### Alerts

```
id
video_id
crime_type
frame_path
timestamp
confidence
```

---

# Installation Guide

## Clone Repository

```
git clone https://github.com/your-repo/guardian-eye.git
```

---

## Frontend Setup

```
cd guardian-eye
npm install
npm start
```

App runs at:

```
http://localhost:3000
```

---

## Backend Setup

```
cd backend
```

Create virtual environment:

```
python -m venv venv
```

Activate environment

Windows

```
venv\Scripts\activate
```

Linux / Mac

```
source venv/bin/activate
```

Install dependencies

```
pip install -r requirements.txt
```

Run server

```
uvicorn app.main:app --reload
```

Backend API:

```
http://localhost:8000
```

API Docs:

```
http://localhost:8000/docs
```

---

# Application Routes

| Route      | Description               |
| ---------- | ------------------------- |
| /          | Landing Page              |
| /login     | Login Page                |
| /signup    | Signup Page               |
| /dashboard | CCTV Monitoring Dashboard |
| /about     | About Project             |
| /contact   | Contact Page              |

---

# Future Improvements

Planned enhancements:

• Real-time CCTV camera streaming (RTSP)
• Multi-camera monitoring
• Face recognition for suspects
• Fire and smoke detection
• Crowd behavior detection
• Mobile application alerts
• Cloud deployment with Kubernetes
• Role-based access control
• AI model training dashboard

---

# Future CCTV Hardware Integration

The system can evolve into **real-time surveillance** using RTSP streams.

```
CCTV Camera
     ↓
RTSP Stream
     ↓
Frame Extractor
     ↓
AI Detection
     ↓
Alert System
```

---

# Contributors

Mayuri Raskar
Ishwari More

Department of Computer Engineering
Marathwada Mitramandal’s Institute of Technology, Pune

---

# License

This project is developed for **academic and research purposes**.

---

If you want, I can also give you a **🔥 GitHub-level professional README (with badges, architecture diagram, screenshots, and demo GIF)** which makes the project look **much stronger for placements and resume**.
