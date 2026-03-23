import React from "react";
import "./working.css";

export default function Working() {
  return (
    <div className="work-container">

      <h1 className="title">How it Works</h1>
        <p className="para">From camera feed to actionable alert in four seamless steps.</p>
      <div className="steps">

        <div className="step-card">
          <h4 className="step-no">Step 01</h4>
          <h2>Upload Video or Connect Camera</h2>
          <p>
            Users can either upload a recorded CCTV video file or connect
            a live camera feed to the system for real-time monitoring.
          </p>
        </div>

        <div className="arrow">↓</div>

        <div className="step-card">
          <h4 className="step-no">Step 02</h4>
          <h2>AI Model Analyzes Video Frames</h2>
          <p>
            Our deep learning model processes each video frame using
            advanced computer vision techniques to detect abnormal
            activities.
          </p>
        </div>

        <div className="arrow">↓</div>

        <div className="step-card">
          <h4 className="step-no">Step 03</h4>
          <h2>Anomaly Detection</h2>
          <p>
            The system identifies unusual behavior patterns and flags
            potential security threats instantly.
          </p>
        </div>

        <div className="arrow">↓</div>

        <div className="step-card">
          <h4 className="step-no">Step 04</h4>
          <h2>Real-Time Alerts</h2>
          <p>
            Security teams receive instant alerts and notifications so
            they can respond quickly to suspicious activity.
          </p>
        </div>

      </div>
    </div>
  );
}