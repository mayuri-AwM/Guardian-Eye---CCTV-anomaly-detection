import { useState } from "react";
import "./about.css";


const STATS = [
  { value: "99.2%", label: "Detection Accuracy" },
  { value: "<200ms", label: "Alert Latency" },
  { value: "24/7", label: "System Uptime" },
  { value: "50+", label: "Camera Support" },
];

const STEPS = [
  {
    icon: "📹",
    title: "Live Camera Feed",
    desc: "Continuous video streams are ingested in real-time from IP cameras, DVRs, or NVR systems.",
  },
  {
    icon: "🧠",
    title: "AI Anomaly Detection",
    desc: "Our deep learning model analyses every frame, detecting unusual behaviour, motion patterns, and objects.",
  },
  {
    icon: "🚨",
    title: "Instant Alert",
    desc: "Security teams are notified within milliseconds via dashboard alerts, email, or webhook integrations.",
  },
];


const TEAM = [
  { initials: "MR", name: "Mayuri Raskar",  color: "blue"   },
  { initials: "IM", name: "Ishwari More",   color: "teal"   },
    
];

const VALUES = [
  { icon: "🔒", title: "Privacy First",   desc: "All processing is on-device. No raw footage leaves your premises." },
  { icon: "⚡", title: "Real-time",       desc: "Sub-200ms detection pipeline built for zero-lag response." },
  { icon: "🎯", title: "Precision",       desc: "Trained on 2M+ annotated frames to minimise false positives." },
  { icon: "🔓", title: "Open Core",       desc: "Core detection engine is open source. Audit it, extend it, own it." },
];




export default function About() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="ab-page">


      <section className="ab-hero">
        <div className="ab-hero-inner">
          <div className="ab-badge">
            <div className="ab-pulse-dot" />
            GUARDIAN EYE — ABOUT US
          </div>
          <h1 className="ab-hero-title">We See What<br />Others Miss</h1>
          <p className="ab-hero-sub">
            Guardian Eye is an AI-powered CCTV anomaly detection platform built to
            make security smarter, faster, and more reliable — without compromising
            on privacy.
          </p>
        </div>
        <div className="ab-hero-grid">
          {[...Array(80)].map((_, i) => <div key={i} className="ab-grid-cell" />)}
        </div>
      </section>

      {/* ── Mission ────────────────────────────────── */}
      <section className="ab-section ab-mission">
        <div className="ab-section-label">// Our Mission</div>
        <div className="ab-mission-body">
          <h2 className="ab-mission-title">
            Turning passive surveillance into<br />
            <span className="ab-accent">intelligent threat detection.</span>
          </h2>
          <p className="ab-mission-text">
            Traditional CCTV systems record everything but understand nothing. We
            built Guardian Eye to bridge that gap — using deep learning to
            automatically identify anomalies, flag threats, and alert security
            teams before incidents escalate. Our goal is to make enterprise-grade
            AI security accessible to every organisation, large or small.
          </p>
        </div>
      </section>

  
      <section className="ab-stats-bar">
        {STATS.map((s) => (
          <div className="ab-stat" key={s.label}>
            <div className="ab-stat-value">{s.value}</div>
            <div className="ab-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

    
      <section className="ab-section">
        <div className="ab-section-label">// How It Works</div>
        <div className="ab-steps">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`ab-step${activeStep === i ? " active" : ""}`}
              onClick={() => setActiveStep(i)}
            >
              <div className="ab-step-num">0{i + 1}</div>
              <div className="ab-step-icon">{step.icon}</div>
              <div className="ab-step-title">{step.title}</div>
              <div className="ab-step-desc">{step.desc}</div>
              {i < STEPS.length - 1 && <div className="ab-step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="ab-section ab-dark-section">
        <div className="ab-section-label-div">// Core Values</div>
        <div className="ab-values-grid">

          {VALUES.map((v) => (
            <div className="ab-value-card" key={v.title}>
              <div className="ab-value-icon">{v.icon}</div>
              <div className="ab-value-title">{v.title}</div>
              <div className="ab-value-desc">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>


      


      <section className="ab-section ab-dark-section">
    
        <div className="ab-section-label-div">// The Team</div>
        <div className="ab-team-grid">
          {TEAM.map((m) => (
            <div className="ab-team-card" key={m.name}>
              <div className={`ab-avatar ab-avatar-${m.color}`}>{m.initials}</div>
              <div className="ab-team-name">{m.name}</div>
              </div>
           
          ))}
        </div>
        
      </section>


      

    </div>
  );
}