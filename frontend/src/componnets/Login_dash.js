import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./logdash.css";
import Contactuser from "./Contactuser";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import Footer from "./Footer-dash";

const FASTAPI_URL = "http://localhost:8000";

// ─── Severity config ───────────────────────────────────────────────────────
const SEVERITY_CONFIG = {
  CRITICAL: { color: "#ff2d55", bg: "rgba(255,45,85,0.12)",   icon: "🚨", label: "CRITICAL" },
  HIGH:     { color: "#ff6b00", bg: "rgba(255,107,0,0.12)",   icon: "🔴", label: "HIGH"     },
  MEDIUM:   { color: "#f5a623", bg: "rgba(245,166,35,0.12)",  icon: "🟠", label: "MEDIUM"   },
  LOW:      { color: "#4cd964", bg: "rgba(76,217,100,0.12)",  icon: "🟡", label: "LOW"      },
};

const CRIME_COLORS = {
  Normal:       "#4cd964",
  normal:       "#4cd964",
  Shoplifting:  "#f5a623",
  shoplifting:  "#f5a623",
  Fighting:     "#ff6b00",
  fighting:     "#ff6b00",
  Burglary:     "#ff6b00",
  burglary:     "#ff6b00",
  Kidnapping:   "#ff2d55",
  kidnapping:   "#ff2d55",
  Robbery:      "#ff2d55",
  robbery:      "#ff2d55",
  shooting:     "#ff2d55",
  explosion:    "#ff6b00",
  roadaccidents:"#f5a623",
  stealing:     "#f5a623",
};

// ─── Helper ────────────────────────────────────────────────────────────────
const fmt = (bytes) =>
  bytes > 1024 * 1024
    ? (bytes / (1024 * 1024)).toFixed(1) + " MB"
    : (bytes / 1024).toFixed(0) + " KB";

const capitalize = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

// ─── Component ────────────────────────────────────────────────────────────
export default function Login_dash() {
  const [name, setName] = useState("");

  // ── Session stats (dynamic) ───────────────────────────────────────────────
  const [sessionStats, setSessionStats] = useState({
    anomalies: 0,
    videos: 0,
    avgConfidence: null,   // null → not yet computed
    avgTime: null,         // null → not yet computed
  });
  const confAccum  = useRef([]);   // accumulates crime_confidence per analysis
  const timeAccum  = useRef([]);   // accumulates elapsed ms per analysis

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef  = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setName(docSnap.data().name.split(" ")[0]);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();
  const username  = localStorage.getItem("username") || "User";
  const initials  = username.slice(0, 2).toUpperCase();

  // ── Upload / pipeline state ──────────────────────────────────────────────
  const [stage,       setStage]       = useState("idle");
  const [file,        setFile]        = useState(null);
  const [videoObjectURL, setVideoObjectURL] = useState(null); // for <video> preview
  const [uploadPct,   setUploadPct]   = useState(0);
  const [dragOver,    setDragOver]    = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [savedPath,   setSavedPath]   = useState("");
  const [analyzing,   setAnalyzing]   = useState(false);
  const [analyzeErr,  setAnalyzeErr]  = useState("");

  // ── Results state ────────────────────────────────────────────────────────
  const [results, setResults] = useState(null);
  const [activeFrame, setActiveFrame] = useState(0);

  const fileInputRef = useRef(null);
  const xhrRef       = useRef(null);
  const startTimeRef = useRef(null);

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const reset = () => {
    if (xhrRef.current) xhrRef.current.abort();
    if (videoObjectURL) URL.revokeObjectURL(videoObjectURL);
    setStage("idle");
    setFile(null);
    setVideoObjectURL(null);
    setUploadPct(0);
    setUploadError("");
    setSavedPath("");
    setAnalyzing(false);
    setAnalyzeErr("");
    setResults(null);
    setActiveFrame(0);
  };

  // ── File accept ────────────────────────────────────────────────────────────
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
    setVideoObjectURL(URL.createObjectURL(f)); // 🎥 create preview URL
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

    xhr.open("POST", `${FASTAPI_URL}/api/video/upload-video`);
    xhr.send(formData);
  }, [videoObjectURL]);

  const onDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = ()  => setDragOver(false);
  const onDrop      = (e) => { e.preventDefault(); setDragOver(false); acceptFile(e.dataTransfer.files[0]); };
  const onFileInput = (e) => acceptFile(e.target.files[0]);
  const cancelUpload = () => { if (xhrRef.current) xhrRef.current.abort(); reset(); };

  // ── Start real AI analysis ─────────────────────────────────────────────────
  const startAnalysis = async () => {
    setStage("processing");
    setAnalyzing(true);
    setAnalyzeErr("");
    setResults(null);
    startTimeRef.current = Date.now();

    try {
      const res = await fetch(`${FASTAPI_URL}/api/video/analyze`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ path: savedPath }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(err.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      const elapsed = (Date.now() - startTimeRef.current) / 1000;

      // ── Normalise backend field names ──────────────────────────────
      // Backend returns: weapon, weapon_confidence, crime, crime_confidence, severity, frame_path
      // Frontend expects: weapon_detected, crime_type — so we normalise here
      const normalised = {
        ...data,
        weapon_detected:   data.weapon   ?? data.weapon_detected  ?? "none",
        crime_type:        data.crime    ?? data.crime_type        ?? "Unknown",
        weapon_confidence: data.weapon_confidence ?? 0,
        crime_confidence:  data.crime_confidence  ?? 0,
        severity:          data.severity           ?? "LOW",
        frame_path:        data.frame_path         ?? null,
        // optional extended fields (absent in basic backend — handled gracefully)
        all_scores:        data.all_scores         ?? null,
        preview_frames:    data.preview_frames     ?? null,
        best_frame_b64:    data.best_frame_b64     ?? null,
        video_info:        data.video_info         ?? null,
        frames_analysed:   data.frames_analysed    ?? null,
      };

      // ── Update session stats ────────────────────────────────────────
      const isAnomaly = normalised.crime_type.toLowerCase() !== "normal";
      confAccum.current.push(normalised.crime_confidence);
      timeAccum.current.push(elapsed);
      const avgConf = confAccum.current.reduce((a, b) => a + b, 0) / confAccum.current.length;
      const avgTime = timeAccum.current.reduce((a, b) => a + b, 0) / timeAccum.current.length;

      setSessionStats((prev) => ({
        anomalies:     prev.anomalies + (isAnomaly ? 1 : 0),
        videos:        prev.videos + 1,
        avgConfidence: avgConf,
        avgTime:       avgTime,
      }));

      setResults(normalised);
      setActiveFrame(0);
      setStage("results");
    } catch (e) {
      setAnalyzeErr(e.message || "Analysis failed. Check server logs.");
      setStage("settings");
    } finally {
      setAnalyzing(false);
    }
  };

  // ── Derived values from results ────────────────────────────────────────────
  const sev      = results ? (SEVERITY_CONFIG[results.severity] || SEVERITY_CONFIG.LOW) : null;
  const crimeCol = results ? (CRIME_COLORS[results.crime_type] || "#fff") : "#fff";

  // ── Build dynamic stats row ────────────────────────────────────────────────
  const STATS = [
    {
      value: sessionStats.anomalies.toString(),
      label: "Anomalies",
      cls: sessionStats.anomalies > 0 ? "red" : "",
    },
    {
      value: sessionStats.videos.toString(),
      label: "Videos",
      cls: "blue",
    },
    {
      value: sessionStats.avgConfidence !== null
        ? `${(sessionStats.avgConfidence * 100).toFixed(0)}%`
        : "—",
      label: "Confidence",
      cls: "green",
    },
    {
      value: sessionStats.avgTime !== null
        ? `${sessionStats.avgTime.toFixed(1)}s`
        : "—",
      label: "Avg Time",
      cls: "",
    },
  ];

  // ── Generate alert message from data ──────────────────────────────────────
  const buildAlertMsg = (r) => {
    if (!r) return "";
    const weapon = r.weapon_detected !== "none"
      ? `${capitalize(r.weapon_detected)} detected`
      : "No weapon detected";
    return `${weapon} · Activity: ${capitalize(r.crime_type)} · Severity: ${r.severity}`;
  };

  return (
    <div>
      <div className="db-page">

        {/* ── Navbar ──────────────────────────────────────────────────────── */}
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
            <button className="db-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        <div className="db-content">

          {/* ── Intro ───────────────────────────────────────────────────────── */}
          <div className="db-intro">
            <div className="db-badge">
              <div className="db-badge-dot" />
              DETECTION ENGINE READY
            </div>
            <h1 className="db-intro-title">Welcome back, {name}</h1>
            <p className="db-intro-sub">
              // Upload your CCTV footage below to run AI anomaly detection · Results appear instantly
            </p>
          </div>

          {/* ── Stats (dynamic) ─────────────────────────────────────────────── */}
          <div className="db-stats-row">
            {STATS.map((s) => (
              <div className="db-stat" key={s.label}>
                <div className={`db-stat-val ${s.cls}`}>{s.value}</div>
                <div className="db-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Section header ──────────────────────────────────────────────── */}
          <div className="db-section-header">
            <div className="db-section-tag">Video Detection</div>
            <p className="db-section-desc">Upload footage and run YOLO v8 anomaly detection</p>
          </div>

          <div className="db-upload-wrap">

            {/* ══ IDLE ════════════════════════════════════════════════════════ */}
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

            {/* ══ UPLOADING ════════════════════════════════════════════════════ */}
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

            {/* ══ SETTINGS ═════════════════════════════════════════════════════ */}
            {stage === "settings" && (
              <div className="up-card">
                <div className="up-card-label">// File saved — ready for analysis</div>
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

                {/* 🎥 Video preview */}
                {videoObjectURL && (
                  <div style={{ marginBottom: "1.4rem" }}>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.1em", marginBottom: "0.6rem", fontFamily: "'Share Tech Mono', monospace" }}>
                      VIDEO PREVIEW
                    </div>
                    <video
                      src={videoObjectURL}
                      controls
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        border: "0.5px solid #30363d",
                        background: "#0d1117",
                        maxHeight: "240px",
                      }}
                    />
                  </div>
                )}

                {analyzeErr && (
                  <div className="up-error-banner" style={{ marginTop: "1rem" }}>
                    <span>✕</span><span>{analyzeErr}</span>
                  </div>
                )}
                <div className="up-analysis-info" style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginTop: "1rem",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.7,
                }}>
                  <div>🔍 YOLOv8 — weapon detection (knife / gun)</div>
                  <div>🧠 LRCN — crime classification (6 classes)</div>
                  <div>⚡ Results include severity level + annotated frames</div>
                </div>
                <div className="up-action-row" style={{ marginTop: "1.2rem" }}>
                  <button className="up-btn-primary" onClick={startAnalysis} disabled={analyzing}>
                    {analyzing ? "Analysing…" : "Run AI Analysis →"}
                  </button>
                  <button className="up-btn-ghost" onClick={reset}>Upload Different File</button>
                </div>
              </div>
            )}

            {/* ══ PROCESSING ═══════════════════════════════════════════════════ */}
            {stage === "processing" && (
              <div className="up-card up-processing-card">
                <div className="up-card-label">// Running AI pipeline</div>

                {/* 🎥 Live video card with detection overlay */}
                {videoObjectURL && (
                  <div style={{ position: "relative", marginBottom: "1.4rem", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(88,166,255,0.3)" }}>
                    <video
                      src={videoObjectURL}
                      autoPlay
                      muted
                      loop
                      style={{ width: "100%", display: "block", maxHeight: "260px", objectFit: "cover" }}
                    />
                    {/* Scanning overlay */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(180deg, transparent 0%, rgba(88,166,255,0.08) 50%, transparent 100%)",
                      animation: "up-scan 2s linear infinite",
                      pointerEvents: "none",
                    }} />
                    {/* LIVE badge */}
                    <div style={{
                      position: "absolute", top: "10px", left: "10px",
                      background: "rgba(255,45,85,0.85)", color: "#fff",
                      fontFamily: "'Share Tech Mono', monospace", fontSize: "10px",
                      padding: "3px 9px", borderRadius: "4px", letterSpacing: "0.1em",
                      display: "flex", alignItems: "center", gap: "5px",
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block", animation: "db-pulse 1s infinite" }} />
                      ANALYZING
                    </div>
                    {/* Corner brackets */}
                    {[["top:6px","left:6px","borderTop","borderLeft"],
                      ["top:6px","right:6px","borderTop","borderRight"],
                      ["bottom:6px","left:6px","borderBottom","borderLeft"],
                      ["bottom:6px","right:6px","borderBottom","borderRight"]].map(([t,l,b1,b2], i) => (
                      <div key={i} style={{
                        position: "absolute",
                        [t.split(":")[0]]: t.split(":")[1],
                        [l.split(":")[0]]: l.split(":")[1],
                        width: 18, height: 18,
                        [b1]: "2px solid #58a6ff",
                        [b2]: "2px solid #58a6ff",
                      }} />
                    ))}
                  </div>
                )}

                <div className="up-scanner">
                  <div className="up-scanner-line" />
                  <div className="up-scanner-grid">
                    {[...Array(16)].map((_, i) => <div key={i} className="up-scanner-cell" />)}
                  </div>
                </div>
                <div style={{ textAlign: "center", marginTop: "1.2rem", color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
                  <div style={{ marginBottom: "0.4rem" }}>⚙ Extracting frames…</div>
                  <div style={{ marginBottom: "0.4rem" }}>🔍 Running YOLOv8 weapon detection…</div>
                  <div>🧠 Running LRCN crime classification…</div>
                </div>
                <button className="up-btn-ghost" style={{ marginTop: "1.5rem" }} onClick={reset}>
                  Cancel
                </button>
              </div>
            )}

            {/* ══ RESULTS ══════════════════════════════════════════════════════ */}
            {stage === "results" && results && (
              <div className="up-card" style={{ padding: "0", overflow: "hidden" }}>

                {/* Alert banner */}
                <div style={{
                  background: sev.bg,
                  borderBottom: `2px solid ${sev.color}`,
                  padding: "1.2rem 1.6rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}>
                  <span style={{ fontSize: "2rem" }}>{sev.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: sev.color,
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      letterSpacing: "0.12em",
                      marginBottom: "0.2rem",
                    }}>
                      SEVERITY — {sev.label}
                    </div>
                    <div style={{ color: "#fff", fontSize: "0.9rem", lineHeight: 1.4 }}>
                      {buildAlertMsg(results)}
                    </div>
                  </div>
                </div>

                <div style={{ padding: "1.6rem" }}>

                  {/* 🎥 Video replay with detection result overlay */}
                  {videoObjectURL && (
                    <div style={{ marginBottom: "1.6rem" }}>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.1em", marginBottom: "0.6rem", fontFamily: "'Share Tech Mono', monospace" }}>
                        VIDEO — LIVE DETECTION REPLAY
                      </div>
                      <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", border: `1px solid ${sev.color}44` }}>
                        <video
                          src={videoObjectURL}
                          controls
                          style={{ width: "100%", display: "block", maxHeight: "300px", objectFit: "cover" }}
                        />
                        {/* Severity badge overlay */}
                        <div style={{
                          position: "absolute", top: "10px", right: "10px",
                          background: sev.bg,
                          border: `1px solid ${sev.color}`,
                          color: sev.color,
                          fontFamily: "'Share Tech Mono', monospace", fontSize: "11px",
                          padding: "4px 10px", borderRadius: "5px", letterSpacing: "0.1em",
                        }}>
                          {sev.icon} {sev.label}
                        </div>
                        {/* Weapon badge if detected */}
                        {results.weapon_detected !== "none" && (
                          <div style={{
                            position: "absolute", top: "10px", left: "10px",
                            background: "rgba(255,45,85,0.85)", color: "#fff",
                            fontFamily: "'Share Tech Mono', monospace", fontSize: "10px",
                            padding: "3px 9px", borderRadius: "4px", letterSpacing: "0.08em",
                          }}>
                            🔫 {capitalize(results.weapon_detected)} DETECTED
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Two-column: Weapon + Crime */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>

                    {/* Weapon detection card */}
                    <div style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "10px",
                      padding: "1rem 1.2rem",
                    }}>
                      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                        WEAPON DETECTION
                      </div>
                      <div style={{
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: results.weapon_detected === "none" ? "#4cd964"
                             : results.weapon_detected === "gun"  ? "#ff2d55"
                             : "#ff6b00",
                        textTransform: "uppercase",
                        marginBottom: "0.3rem",
                      }}>
                        {results.weapon_detected === "none" ? "None Detected" : results.weapon_detected}
                      </div>
                      {results.weapon_detected !== "none" && results.weapon_confidence > 0 && (
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>
                          Confidence: {(results.weapon_confidence * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>

                    {/* Crime classification card */}
                    <div style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "10px",
                      padding: "1rem 1.2rem",
                    }}>
                      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                        CRIME CLASSIFICATION
                      </div>
                      <div style={{
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: crimeCol,
                        marginBottom: "0.3rem",
                      }}>
                        {capitalize(results.crime_type)}
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>
                        Confidence: {(results.crime_confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Class probability bars — only if backend sends all_scores */}
                  {results.all_scores && (
                    <div style={{ marginBottom: "1.5rem" }}>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.1em", marginBottom: "0.8rem" }}>
                        CLASS PROBABILITIES
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {Object.entries(results.all_scores)
                          .sort(([, a], [, b]) => b - a)
                          .map(([label, score]) => (
                          <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                            <div style={{ width: "90px", fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", flexShrink: 0 }}>
                              {capitalize(label)}
                            </div>
                            <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                              <div style={{
                                height: "100%",
                                width: `${(score * 100).toFixed(1)}%`,
                                background: CRIME_COLORS[label] || "#4cd964",
                                borderRadius: "3px",
                                transition: "width 0.8s ease",
                              }} />
                            </div>
                            <div style={{ width: "42px", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textAlign: "right", flexShrink: 0 }}>
                              {(score * 100).toFixed(1)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Annotated frame previews — only if backend sends preview_frames */}
                  {results.preview_frames && results.preview_frames.length > 0 && (
                    <div style={{ marginBottom: "1.5rem" }}>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.1em", marginBottom: "0.8rem" }}>
                        DETECTION FRAMES
                      </div>
                      <div style={{ borderRadius: "10px", overflow: "hidden", marginBottom: "0.6rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <img
                          src={`data:image/jpeg;base64,${results.preview_frames[activeFrame]}`}
                          alt={`Frame ${activeFrame + 1}`}
                          style={{ width: "100%", display: "block" }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {results.preview_frames.map((f, i) => (
                          <div
                            key={i}
                            onClick={() => setActiveFrame(i)}
                            style={{
                              flex: 1,
                              borderRadius: "6px",
                              overflow: "hidden",
                              cursor: "pointer",
                              border: i === activeFrame ? `2px solid ${sev.color}` : "2px solid transparent",
                              opacity: i === activeFrame ? 1 : 0.55,
                              transition: "all 0.2s",
                            }}
                          >
                            <img
                              src={`data:image/jpeg;base64,${f}`}
                              alt={`Thumb ${i + 1}`}
                              style={{ width: "100%", display: "block" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Best detection frame (if backend sends best_frame_b64) */}
                  {results.best_frame_b64 && (
                    <div style={{ marginBottom: "1.5rem" }}>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.1em", marginBottom: "0.8rem" }}>
                        BEST WEAPON DETECTION FRAME
                      </div>
                      <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid ${sev.color}44` }}>
                        <img
                          src={`data:image/jpeg;base64,${results.best_frame_b64}`}
                          alt="Best detection"
                          style={{ width: "100%", display: "block" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Video meta — only if backend sends video_info */}
                  {results.video_info && (
                    <div style={{
                      display: "flex",
                      gap: "1.5rem",
                      padding: "0.8rem 1rem",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: "1.2rem",
                    }}>
                      <span>⏱ {results.video_info.duration_seconds}s</span>
                      <span>📽 {results.video_info.fps} fps</span>
                      {results.frames_analysed && <span>🖼 {results.frames_analysed} frames analysed</span>}
                      <span>📐 {results.video_info.width}×{results.video_info.height}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="up-action-row">
                    <button className="up-btn-primary" onClick={reset}>
                      Analyse Another Video
                    </button>
                    {results.best_frame_b64 && (
                      <button
                        className="up-btn-ghost"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href     = `data:image/jpeg;base64,${results.best_frame_b64}`;
                          a.download = "detection_frame.jpg";
                          a.click();
                        }}
                      >
                        Download Frame
                      </button>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="contact" style={{ margin: 0, padding: 0, display: "block" }}>
        <Contactuser />
      </div>
      <div id="footerdash" style={{ margin: 0, padding: 0, overflow: "hidden" }}>
        <Footer />
      </div>
    </div>
  );
}