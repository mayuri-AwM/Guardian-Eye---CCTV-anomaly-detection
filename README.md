<div align="center">

# 👁️ Guardian Eye
### AI-Powered CCTV Anomaly Detection System

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-FF6B35?style=for-the-badge)](https://ultralytics.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-Academic-green?style=for-the-badge)](LICENSE)

<br/>

> **Automated CCTV surveillance powered by Computer Vision and Deep Learning.**  
> Detects weapons, classifies crimes, captures evidence, and alerts owners — instantly.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Backend Workflow](#-backend-workflow)
- [Folder Structure](#-folder-structure)
- [Database Schema](#-database-schema)
- [Installation](#-installation)
- [Application Routes](#-application-routes)
- [Future Roadmap](#-future-roadmap)
- [Contributors](#-contributors)

---

## 🔍 Overview

Traditional CCTV systems require **continuous human monitoring** — exhausting, costly, and error-prone. **Guardian Eye** automates surveillance by:

- 📹 Analyzing CCTV video frames using AI models
- 🔫 Detecting weapons with **YOLOv8 object detection**
- 🧠 Classifying suspicious activities with a deep learning model
- 📸 Capturing the exact frame where an anomaly occurs
- 🚨 Generating instant alerts for CCTV owners
- 📊 Displaying evidence on a secure web dashboard

> **Result:** Reduced manual monitoring load and significantly improved security response time.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📤 **Video Upload** | Upload CCTV recordings for automated AI analysis |
| 🔫 **Weapon Detection** | YOLOv8 detects guns, knives, sticks with bounding boxes & confidence scores |
| 🧠 **Crime Classification** | Deep learning model classifies 6 activity types |
| 📸 **Evidence Capture** | Automatically saves the exact anomaly frame |
| 🚨 **Instant Alerts** | Email notifications dispatched on anomaly detection |
| 📊 **Dashboard** | Secure web interface showing all alerts and incidents |
| 🔐 **Authentication** | Secure login and signup system |
| 🔌 **Scalable Architecture** | Designed for future real-time RTSP camera streaming |

### 🚨 Detected Crime Categories

| Category | Status |
|---|---|
| 🟠 Abuse | ✅ Supported |
| 🔴 Explosion | ✅ Supported |
| 🟡 Fighting | ✅ Supported |
| 🟣 Robbery | ✅ Supported |
| 🔵 Stealing | ✅ Supported |
| 🟢 Normal Activity | ✅ Supported |

---

## 🏗️ System Architecture

```
┌─────────────────────────────┐
│        React Frontend       │
│  Dashboard · Auth · Alerts  │
└──────────────┬──────────────┘
               │ REST API
               ▼
┌─────────────────────────────┐
│       FastAPI Backend       │
│  Routes · Services · Schemas│
└──────────────┬──────────────┘
               │ Video Processing Pipeline
               ▼
┌──────────────────────────────────────┐
│           AI Engine                  │
│  ┌────────────────────────────────┐  │
│  │  Frame Extraction  (OpenCV)    │  │
│  ├────────────────────────────────┤  │
│  │  Weapon Detection  (YOLOv8)    │  │
│  ├────────────────────────────────┤  │
│  │  Crime Classification (DL)     │  │
│  ├────────────────────────────────┤  │
│  │  Alert Generation              │  │
│  └────────────────────────────────┘  │
└──────────────┬───────────────────────┘
               ▼
┌─────────────────────────────┐
│     PostgreSQL Database     │
│  Users · Videos · Alerts    │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│     Notification Service    │
│  SMTP Email · Push (future) │
└─────────────────────────────┘
```

---

## 🛠️ Tech Stack

<details>
<summary><b>🖥️ Frontend</b></summary>

| Technology | Purpose |
|---|---|
| React.js | UI Framework |
| HTML5 / CSS3 | Markup & Styling |
| Bootstrap | Responsive Components |
| React Router | Client-side Routing |

</details>

<details>
<summary><b>⚙️ Backend</b></summary>

| Technology | Purpose |
|---|---|
| Python | Core Language |
| FastAPI | REST API Framework |
| Pydantic | Data Validation |
| Uvicorn | ASGI Server |
| Redis | Task Queue Broker |
| Celery / RQ | Background Processing |

</details>

<details>
<summary><b>🤖 AI / Machine Learning</b></summary>

| Technology | Purpose |
|---|---|
| Ultralytics YOLOv8 | Weapon Object Detection |
| PyTorch | Crime Classification Model |
| TensorFlow | Deep Learning Support |
| OpenCV | Frame Extraction |

</details>

<details>
<summary><b>🗄️ Database & Storage</b></summary>

| Technology | Purpose |
|---|---|
| PostgreSQL | Primary Database |
| SQLAlchemy ORM | Database Abstraction |
| Local Storage | Media Files (MVP) |
| AWS S3 | Media Files (Future) |

</details>

<details>
<summary><b>🐳 DevOps & Notifications</b></summary>

| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container Orchestration |
| SMTP | Email Alerts (MVP) |
| Firebase | Push Notifications (Future) |

</details>

---

## ⚙️ Backend Workflow

```
Step 1 → Video Upload        POST /upload-video
Step 2 → Frame Extraction    OpenCV decomposes video → frame_1.jpg, frame_2.jpg ...
Step 3 → Weapon Detection    YOLOv8 → BBox + Confidence + Label
Step 4 → Crime Classification Deep Learning → Abuse / Fighting / Robbery / ...
Step 5 → Anomaly Detection   If class ≠ Normal → trigger alert
Step 6 → Alert Generation    Store crime_type, timestamp, frame, confidence
Step 7 → Notification        Email dispatched to CCTV owner
```

### 🔎 Weapon Detection Output Example
```
Detected:   Gun
BBox:       [x1: 342, y1: 198, x2: 410, y2: 276]
Confidence: 0.94
Label:      firearm
```

### 🚨 Alert Generation Example
```
Crime:      Fighting
Confidence: 0.91
Timestamp:  00:02:13
Frame:      frame_125.jpg
Video:      cctv_feed_03.mp4
```

---

## 📁 Folder Structure

<details>
<summary><b>📦 Backend Structure</b></summary>

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
│   │   └── migrations/
│
│   └── utils/
│       ├── logger.py
│       └── helpers.py
│
└── requirements.txt
```

</details>

<details>
<summary><b>🌐 Frontend Structure</b></summary>

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
│   │   ├── Signup.js
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

</details>

---

## 🗄️ Database Schema

<details>
<summary><b>View Schema</b></summary>

**Users**
```sql
id            INT          PRIMARY KEY
email         VARCHAR      NOT NULL UNIQUE
password_hash TEXT         NOT NULL
created_at    TIMESTAMP    DEFAULT NOW()
```

**Videos**
```sql
id            INT          PRIMARY KEY
user_id       INT          FOREIGN KEY → Users(id)
video_path    TEXT         NOT NULL
upload_time   TIMESTAMP    DEFAULT NOW()
status        VARCHAR      DEFAULT 'pending'
```

**Alerts**
```sql
id            INT          PRIMARY KEY
video_id      INT          FOREIGN KEY → Videos(id)
crime_type    VARCHAR      NOT NULL
frame_path    TEXT         NOT NULL
timestamp     VARCHAR      NOT NULL
confidence    FLOAT        NOT NULL
```

</details>

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/guardian-eye.git
```

### 2. Frontend Setup

```bash
cd guardian-eye
npm install
npm start
```

> 🌐 App runs at: `http://localhost:3000`

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate — Windows
venv\Scripts\activate

# Activate — Linux / Mac
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload
```

> 🔌 API runs at: `http://localhost:8000`  
> 📄 API Docs at: `http://localhost:8000/docs`

---

## 🗺️ Application Routes

| Route | Description |
|---|---|
| `/` | Landing Page |
| `/login` | Login Page |
| `/signup` | Signup / Register |
| `/dashboard` | CCTV Monitoring Dashboard |
| `/about` | About the Project |
| `/contact` | Contact Page |

---

## 🔮 Future Roadmap

- [ ] 📡 Real-time CCTV camera streaming (RTSP)
- [ ] 🎥 Multi-camera monitoring
- [ ] 🧑 Face recognition for suspects
- [ ] 🔥 Fire and smoke detection
- [ ] 👥 Crowd behavior detection
- [ ] 📱 Mobile application alerts
- [ ] ☁️ Cloud deployment with Kubernetes
- [ ] 🔐 Role-based access control
- [ ] 🧪 AI model training dashboard
- [ ] 💬 SMS alert integration
- [ ] 🪣 AWS S3 media storage

### 🔌 RTSP Hardware Integration (Planned)

```
CCTV Camera
     ↓  RTSP Stream
Frame Extractor
     ↓
AI Detection Engine   ← YOLOv8 + Crime Classifier
     ↓
Alert System          ← Email · Push · SMS
```

---

## 👩‍💻 Contributors

<table>
  <tr>
    <td align="center">
      <b>Mayuri Raskar</b><br/>
      <sub>Department of Computer Engineering</sub><br/>
      <sub>Marathwada Mitramandal's Institute of Technology, Pune</sub>
    </td>
    <td align="center">
      <b>Ishwari More</b><br/>
      <sub>Department of Computer Engineering</sub><br/>
      <sub>Marathwada Mitramandal's Institute of Technology, Pune</sub>
    </td>
  </tr>
</table>

---

<div align="center">

**📄 This project is developed for academic and research purposes.**

*Marathwada Mitramandal's Institute of Technology · Pune · Department of Computer Engineering*

</div>
