# 👁️ Guardian Eye
### AI-Powered CCTV Anomaly Detection System

---

## 🔍 Overview

Guardian Eye is an AI-powered CCTV surveillance system that transforms traditional passive monitoring into an intelligent real-time threat detection system.

Instead of relying on human operators, the system:
- Detects weapons using YOLOv8
- Classifies activities using Deep Learning (LRCN)
- Captures evidence frames
- Generates alerts instantly

---

## 🚨 Problem Statement

Traditional CCTV systems:
- Require continuous human monitoring
- Miss critical events due to fatigue
- Only provide post-incident analysis

Guardian Eye solves this by enabling:
👉 **Automated real-time anomaly detection**

---

## 🎯 Detected Classes

- Shooting
- Fighting
- Explosion
- Road Accidents
- Stealing
- Normal

---

## 🧠 AI Models Used

### 🔫 1. Object Detection — YOLOv8

- Detects:
  - Gun
  - Knife
- Provides:
  - Bounding box
  - Confidence score
  - Label

---

### 🧠 2. Crime Classification — LRCN Model

#### ✔ Architecture:
- CNN: **MobileNetV3 (Feature Extraction)**
- Sequence Model: **Bidirectional LSTM**
- Final Layer: Fully Connected Classifier

---

### 📊 Model Flow:

Input Video → Frames (20)  
MobileNetV3 → Spatial Features  
BiLSTM → Temporal Understanding  
Classifier → Crime Prediction  

---

### ❓ Why LRCN?

- CNN → understands **what is happening in each frame**
- LSTM → understands **how events change over time**

---

### ⚡ Why MobileNetV3?

- Lightweight + Fast
- Pretrained on ImageNet
- Good for low-quality CCTV footage

---

## ⚙️ Backend Workflow

1. Upload Video  
2. Extract Frames (OpenCV)  
3. Run YOLO Detection  
4. Run LRCN Classification  
5. Combine Results  
6. Calculate Severity  
7. Save Frame + Alert  

---

## 🏗️ System Architecture

Frontend (React)  
↓  
FastAPI Backend  
↓  
AI Pipeline  
↓  
MongoDB  
↓  
Alert System (Twilio)  

---

## 🛠️ Tech Stack

Frontend: React.js  
Backend: FastAPI  
AI: YOLOv8, PyTorch  
Database: MongoDB  
Tools: OpenCV, Twilio  

---

## 🔌 API Endpoints

POST /api/video/upload-video  
POST /api/video/analyze  

---

## 📸 Sample Output

Weapon: Gun  
Crime: Robbery  
Confidence: 0.91  
Severity: CRITICAL  

---

## 🚀 Key Features

- Real-time detection  
- Evidence capture  
- SMS alerts  
- Scalable backend  

---

## 💡 USP

Combines object detection + temporal understanding  
→ Context-aware surveillance system  

---

## 👩‍💻 Contributors

- Mayuri Raskar  
- Ishwari More  
