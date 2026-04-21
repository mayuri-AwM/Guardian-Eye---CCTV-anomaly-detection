import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./logdash.css";
import Contactuser from "./Contactuser";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import Footer from "./Footer-dash";

const FASTAPI_URL     = "http://localhost:8000";

const STATS = [
  { value: "7",    label: "Anomalies",  cls: "red"   },
  { value: "12",   label: "Videos",     cls: "blue"  },
  { value: "86%",  label: "Confidence", cls: "green" },
  { value: "4.2s", label: "Avg Time",   cls: ""      },
];



// ─── Helper ───────────────────────────────────────
const fmt = (bytes) =>
  bytes > 1024 * 1024
    ? (bytes / (1024 * 1024)).toFixed(1) + " MB"
    : (bytes / 1024).toFixed(0) + " KB";

// ─── Component ────────────────────────────────────
export default function Login_dash() {
  const [name, setName] = useState("");

useEffect(() => {

  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
console.log("Auth user:", user);
    if (user) {

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
console.log("Doc exists:", docSnap.exists()); // check if doc found
      console.log("Doc data:", docSnap.data());
      if (docSnap.exists()) {
        setName(docSnap.data().name.split(" ")[0]);
      }

    }

  });

  return () => unsubscribe();

}, []);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const initials = username.slice(0, 2).toUpperCase();

  // ── Upload state ─────────────────────────────────
  const [stage, setStage]             = useState("idle");
  const [file, setFile]               = useState(null);
  const [uploadPct, setUploadPct]     = useState(0);
  const [processPct, setProcessPct]   = useState(0);
  const [frameCount, setFrameCount]   = useState(0);
  const [dragOver, setDragOver]       = useState(false);
  

  // const [activeEvent, setActiveEvent] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [savedPath, setSavedPath]     = useState("");



  const fileInputRef = useRef(null);
  const xhrRef       = useRef(null);
  const processTimer = useRef(null);

  // ── Logout ────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  // ── Reset upload ──────────────────────────────────
  const reset = () => {
    if (xhrRef.current) xhrRef.current.abort();
    clearInterval(processTimer.current);
    setStage("idle");
    setFile(null);
    setUploadPct(0);
    setProcessPct(0);
    setFrameCount(0);

    setUploadError("");
    setSavedPath("");
  };

  // ── Accept file ───────────────────────────────────
  const acceptFile = useCallback((f) => {
    if (!f) return;
    const allowed = ["video/mp4", "video/avi", "video/quicktime", "video/x-msvideo", "video/x-matroska"];
    if (!allowed.includes(f.type) && !f.name.match(/\.(mp4|avi|mov|mkv)$/i)) {
      setUploadError("Unsupported file type. Please upload MP4, AVI, MOV or MKV.");
      return;
    }
    if (f.size > 500 * 1024 * 1024) {
      setUploadError("File too large. Maximum size is 500 MB.");
      return;
    }
    setUploadError("");
    setFile(f);
    setStage("uploading");
    setUploadPct(0);

    const formData = new FormData();
    formData.append("file", f);
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadPct(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        setSavedPath(res.path || "");
        setUploadPct(100);
        setTimeout(() => setStage("settings"), 400);
      } else {
        setUploadError(`Upload failed (${xhr.status}). Is FastAPI running?`);
        setStage("idle");
      }
    };

    xhr.onerror = () => {
      setUploadError("Cannot connect to server. Make sure FastAPI is running on port 8000.");
      setStage("idle");
    };

    xhr.open("POST", `${FASTAPI_URL}/upload-video`);
    xhr.send(formData);
  }, []);

  const onDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = ()  => setDragOver(false);
  const onDrop      = (e) => { e.preventDefault(); setDragOver(false); acceptFile(e.dataTransfer.files[0]); };
  const onFileInput = (e) => acceptFile(e.target.files[0]);
  const cancelUpload = () => { if (xhrRef.current) xhrRef.current.abort(); reset(); };

  const startAnalysis = () => {
    setStage("processing");
    setProcessPct(0);
    setFrameCount(0);
    let pct = 0;
    processTimer.current = setInterval(() => {
      pct += Math.random() * 3 + 1;
      if (pct >= 100) {
        pct = 100;
        clearInterval(processTimer.current);
        setTimeout(() => setStage("results"), 500);
      }
      setProcessPct(Math.min(Math.round(pct), 100));
      setFrameCount(Math.round((pct / 100) * 1200));
    }, 120);
  };

  return (
    <div>
    <div className="db-page">

      {/* ── Navbar ────────────────────────────────── */}
      <nav className="db-nav">
        <div className="db-logo">
          <div className="db-logo-dot" />
          Guardian Eye
        </div>
        <div className="db-nav-right">
        <ul className="navbar-nav ms-auto">

              <a href="#contact" className="nav-link">Contact Us</a>
              </ul>
          <div className="db-avatar">{initials}</div>
          <button className="db-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="db-content">

        {/* ── Intro ─────────────────────────────────── */}
        <div className="db-intro">
          <div className="db-badge">
            <div className="db-badge-dot" />
            DETECTION ENGINE READY
          </div>
          <h1 className="db-intro-title">Welcome back,{name}</h1>
          <p className="db-intro-sub">
            // Upload your CCTV footage below to run AI anomaly detection · Results appear instantly
          </p>
        </div>

        {/* ── Stats ─────────────────────────────────── */}
        <div className="db-stats-row">
          {STATS.map((s) => (
            <div className="db-stat" key={s.label}>
              <div className={`db-stat-val ${s.cls}`}>{s.value}</div>
              <div className="db-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Video Detection Section ───────────────── */}
        <div className="db-section-header">
          <div className="db-section-tag">Video Detection</div>
          <p className="db-section-desc">Upload footage and run YOLO v8 anomaly detection</p>
        </div>

        <div className="db-upload-wrap">

          {/* ══ IDLE ══════════════════════════════════ */}
          {stage === "idle" && (
            <>
              <div
                className={`up-dropzone${dragOver ? " dragover" : ""}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input ref={fileInputRef} type="file" accept="video/*" onChange={onFileInput} className="up-file-input" />
                <div className="up-drop-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                </div>
                <div className="up-drop-title">Drag &amp; drop your video here</div>
                <div className="up-drop-sub">or click to browse files</div>
                <div className="up-formats">
                  <span className="up-fmt-tag">MP4</span>
                  <span className="up-fmt-tag">AVI</span>
                  <span className="up-fmt-tag">MOV</span>
                  <span className="up-fmt-tag">MKV</span>
                  <span className="up-fmt-sep">·</span>
                  <span className="up-fmt-limit">Max 500 MB</span>
                </div>
              </div>
              {uploadError && (
                <div className="up-error-banner">
                  <span>✕</span><span>{uploadError}</span>
                </div>
              )}
            </>
          )}

          {/* ══ UPLOADING ══════════════════════════════ */}
          {stage === "uploading" && (
            <div className="up-card">
              <div className="up-card-label">// Uploading to server</div>
              <div className="up-file-row">
                <div className="up-file-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <polyline points="9 15 12 12 15 15" />
                  </svg>
                </div>
                <div className="up-file-info">
                  <div className="up-file-name">{file?.name}</div>
                  <div className="up-file-size">{fmt(file?.size || 0)}</div>
                </div>
                <div className="up-file-pct">{uploadPct}%</div>
              </div>
              <div className="up-progress-track">
                <div className="up-progress-fill" style={{ width: `${uploadPct}%` }} />
              </div>
              <div className="up-upload-status">
                {uploadPct < 100 ? `Uploading... ${uploadPct}% complete` : "✓ Upload complete — preparing settings..."}
              </div>
              <button className="up-btn-ghost" onClick={cancelUpload}>Cancel</button>
            </div>
          )}

          {/* ══ SETTINGS ══════════════════════════════ */}
          {stage === "settings" && (
            <div className="up-card">
              <div className="up-card-label">// File saved — configure detection</div>
              <div className="up-file-ready">
                <div className="up-ready-dot" />
                <span className="up-ready-name">{file?.name}</span>
                <span className="up-ready-size">{fmt(file?.size || 0)}</span>
              </div>
              {savedPath && (
                <div className="up-saved-path">
                  <span className="up-saved-label">Saved to:</span>
                  <span className="up-saved-val">{savedPath}</span>
                </div>
              )}
             
                
              <div className="up-action-row">
                <button className="up-btn-primary" onClick={startAnalysis}>Run AI Analysis →</button>
                <button className="up-btn-ghost" onClick={reset}>Upload Different File</button>
              </div>
            </div>
          )}

          {/* ══ PROCESSING ════════════════════════════ */}
          {stage === "processing" && (
            <div className="up-card up-processing-card">
              <div className="up-card-label">// Analysing footage</div>
              <div className="up-scanner">
                <div className="up-scanner-line" />
                <div className="up-scanner-grid">
                  {[...Array(16)].map((_, i) => <div key={i} className="up-scanner-cell" />)}
                </div>
                
              </div>
              <div className="up-proc-row">
                <span className="up-proc-frame">Frame {frameCount.toLocaleString()} / 1,200</span>
                <span className="up-proc-pct">{processPct}%</span>
              </div>
              <div className="up-progress-track">
                <div className="up-progress-fill" style={{ width: `${processPct}%` }} />
              </div>
              <button className="up-btn-ghost" style={{ marginTop: "1rem" }} onClick={reset}>Cancel Analysis</button>
            </div>
          )}

         {/* ══ RESULTS ═══════════════════════════════ */}

{stage === "results" && (
  <div className="up-card" style={{ textAlign: "center", padding: "3rem" }}>
    <h2 style={{ color: "#fff" }}>Results</h2>
  </div>
)}
        </div>

       
      </div>
      </div>
      <div id="contact" style={{ margin: 0, padding: 0, display: 'block' }}>
      <Contactuser/>
      </div>
 <div id="footerdash" style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
<Footer/>
</div>
  </div>  
  );
}