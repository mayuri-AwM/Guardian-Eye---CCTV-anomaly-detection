import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./logdash.css";

// ─── Upload constants ─────────────────────────────
const MOCK_RESULTS = {
  stats: {
    anomalies: 3,
    frames: 1200,
    confidence: 86,
    duration: "2:12",
    processingTime: "4.2s",
  },
  detections: [
    { id: 1, type: "Intrusion Detected", confidence: 97, timestamp: "00:04", severity: "critical", color: "#E24B4A" },
    { id: 2, type: "Loitering",          confidence: 84, timestamp: "00:41", severity: "warning",  color: "#EF9F27" },
    { id: 3, type: "Abandoned Object",   confidence: 76, timestamp: "01:18", severity: "warning",  color: "#EF9F27" },
  ],
  timeline: [
    { position: 3,  severity: "critical", label: "Intrusion",        time: "00:04" },
    { position: 31, severity: "warning",  label: "Loitering",        time: "00:41" },
    { position: 58, severity: "warning",  label: "Abandoned Object", time: "01:18" },
  ],
};

const DETECTION_MODES = ["All Anomalies", "Intrusion Only", "Violence / Fight", "Loitering", "Abandoned Object"];
const SENSITIVITIES   = ["Low", "Medium", "High", "Ultra"];
const FASTAPI_URL     = "http://localhost:8000";

const STATS = [
  { value: "7",    label: "Anomalies",  cls: "red"   },
  { value: "12",   label: "Videos",     cls: "blue"  },
  { value: "86%",  label: "Confidence", cls: "green" },
  { value: "4.2s", label: "Avg Time",   cls: ""      },
];

const HISTORY = [
  { name: "footage_01.mp4",       alerts: 3, status: "critical" },
  { name: "cam_feed_3.mp4",       alerts: 1, status: "warning"  },
  { name: "WIN_20251212_Pro.mp4", alerts: 0, status: "clear"    },
  { name: "test_clip_02.mp4",     alerts: 2, status: "warning"  },
];

const RECENT = [
  { id: 1, type: "Intrusion Detected", file: "footage_01.mp4",  time: "2 hrs ago", timestamp: "00:04", severity: "critical", confidence: 97, color: "#f85149" },
  { id: 2, type: "Loitering",          file: "cam_feed_3.mp4",  time: "5 hrs ago", timestamp: "00:41", severity: "warning",  confidence: 84, color: "#EF9F27" },
  { id: 3, type: "Abandoned Object",   file: "footage_01.mp4",  time: "2 hrs ago", timestamp: "01:18", severity: "warning",  confidence: 76, color: "#EF9F27" },
];

// ─── Helper ───────────────────────────────────────
const fmt = (bytes) =>
  bytes > 1024 * 1024
    ? (bytes / (1024 * 1024)).toFixed(1) + " MB"
    : (bytes / 1024).toFixed(0) + " KB";

// ─── Component ────────────────────────────────────
export default function Login_dash() {
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
  const [sensitivity, setSensitivity] = useState("High");
  const [mode, setMode]               = useState("All Anomalies");
  const [activeEvent, setActiveEvent] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [savedPath, setSavedPath]     = useState("");

  // ── Timeline tooltip state ────────────────────────
  const [activeTooltip, setActiveTooltip] = useState(null);

  const fileInputRef = useRef(null);
  const xhrRef       = useRef(null);
  const processTimer = useRef(null);

  // ── Logout ────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
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
    setActiveEvent(null);
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
    <div className="db-page">

      {/* ── Navbar ────────────────────────────────── */}
      <nav className="db-nav">
        <div className="db-logo">
          <div className="db-logo-dot" />
          Guardian Eye
        </div>
        <div className="db-nav-right">
       
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
          <h1 className="db-intro-title">Welcome back, {username}</h1>
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
              <div className="up-settings-grid">
                <div className="up-setting-group">
                  <label className="up-setting-label">Sensitivity</label>
                  <div className="up-chip-row">
                    {SENSITIVITIES.map((s) => (
                      <button key={s} className={`up-chip${sensitivity === s ? " active" : ""}`} onClick={() => setSensitivity(s)}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="up-setting-group">
                  <label className="up-setting-label">Detection Mode</label>
                  <select className="up-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                    {DETECTION_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
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
                <div className="up-scanner-label">YOLO v8 · {mode} · {sensitivity} sensitivity</div>
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
            <>
              <div className="up-stats-row">
                <div className="up-stat"><div className="up-stat-val up-stat-danger">{MOCK_RESULTS.stats.anomalies}</div><div className="up-stat-lbl">Anomalies Found</div></div>
                <div className="up-stat"><div className="up-stat-val">{MOCK_RESULTS.stats.frames.toLocaleString()}</div><div className="up-stat-lbl">Frames Scanned</div></div>
                <div className="up-stat"><div className="up-stat-val up-stat-success">{MOCK_RESULTS.stats.confidence}%</div><div className="up-stat-lbl">Avg Confidence</div></div>
                <div className="up-stat"><div className="up-stat-val">{MOCK_RESULTS.stats.duration}</div><div className="up-stat-lbl">Video Duration</div></div>
                <div className="up-stat"><div className="up-stat-val">{MOCK_RESULTS.stats.processingTime}</div><div className="up-stat-lbl">Processing Time</div></div>
              </div>
              <div className="up-results-grid">
                <div className="up-card up-video-card">
                  <div className="up-card-label">// Video Preview</div>
                  <div className="up-video-frame">
                    <div className="up-video-overlay">
                      {activeEvent && (
                        <div className="up-bbox" style={{ borderColor: activeEvent.color }}>
                          <span className="up-bbox-label" style={{ background: activeEvent.color }}>{activeEvent.type} {activeEvent.confidence}%</span>
                        </div>
                      )}
                      <div className="up-video-play">▶</div>
                      <div className="up-video-time">{activeEvent ? activeEvent.timestamp : "00:00"} / {MOCK_RESULTS.stats.duration}</div>
                    </div>
                  </div>
                  <div className="up-scrubber">
                    <div className="up-scrub-track">
                      {MOCK_RESULTS.timeline.map((ev, i) => (
                        <div key={i} className={`up-scrub-marker ${ev.severity}`} style={{ left: `${ev.position}%` }} title={`${ev.label} at ${ev.time}`} />
                      ))}
                      <div className="up-scrub-head" style={{ left: activeEvent ? `${MOCK_RESULTS.timeline.find(t => t.time === activeEvent.timestamp)?.position || 0}%` : "0%" }} />
                    </div>
                    <div className="up-scrub-times"><span>0:00</span><span>0:33</span><span>1:06</span><span>1:39</span><span>2:12</span></div>
                  </div>
                </div>
                <div className="up-card">
                  <div className="up-card-label">// Detected Anomalies</div>
                  <div className="up-detect-list">
                    {MOCK_RESULTS.detections.map((d) => (
                      <div key={d.id} className={`up-detect-item${activeEvent?.id === d.id ? " active" : ""}`} onClick={() => setActiveEvent(activeEvent?.id === d.id ? null : d)}>
                        <div className="up-detect-dot" style={{ background: d.color }} />
                        <div className="up-detect-info">
                          <div className="up-detect-type">{d.type}</div>
                          <div className="up-detect-time">at {d.timestamp}</div>
                        </div>
                        <div className="up-detect-right">
                          <div className={`up-conf-badge ${d.severity}`}>{d.confidence}%</div>
                          <div className="up-detect-arrow">→</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="up-card-label" style={{ marginTop: "1.2rem" }}>// Event Timeline</div>
                  <div className="up-timeline-bar">
                    <div className="up-tl-track">
                      {MOCK_RESULTS.timeline.map((ev, i) => (
                        <div key={i} className={`up-tl-marker ${ev.severity}`} style={{ left: `${ev.position}%` }} title={ev.time}
                          onClick={() => { const det = MOCK_RESULTS.detections.find(d => d.timestamp === ev.time); setActiveEvent(det || null); }}>
                          <div className="up-tl-tooltip">{ev.label}<br />{ev.time}</div>
                        </div>
                      ))}
                    </div>
                    <div className="up-tl-times"><span>0:00</span><span>1:06</span><span>2:12</span></div>
                  </div>
                </div>
              </div>
              <div className="up-export-bar">
                <div className="up-card-label" style={{ marginBottom: "0.8rem" }}>// Export &amp; Actions</div>
                <div className="up-export-btns">
                  <button className="up-btn-primary">Download Report (PDF)</button>
                  <button className="up-btn-secondary">Export JSON</button>
                  <button className="up-btn-secondary">Save to Dashboard</button>
                  <button className="up-btn-ghost" onClick={reset}>Upload New Video</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Recent Detections ─────────────────────── */}
        <div className="db-section-header">
          <div className="db-section-tag">Recent Detections</div>
          <p className="db-section-desc">Latest anomalies found across all your videos</p>
        </div>
        <div className="db-card">
          {RECENT.map((d) => (
            <div className="db-detect-item" key={d.id}>
              <div className="db-detect-dot" style={{ background: d.color }} />
              <div className="db-detect-info">
                <div className="db-detect-type">{d.type}</div>
                <div className="db-detect-meta">{d.file} · {d.time} · at {d.timestamp}</div>
              </div>
              <div className={`db-badge ${d.severity}`}>{d.confidence}%</div>
            </div>
          ))}
        </div>

        {/* ── Upload History ────────────────────────── */}
        <div className="db-section-header">
          <div className="db-section-tag">Upload History</div>
          <p className="db-section-desc">All videos you have analysed</p>
        </div>
        <div className="db-card" style={{ marginBottom: "3rem" }}>
          {HISTORY.map((h, i) => (
            <div className="db-history-item" key={i}>
              <div className="db-history-name">{h.name}</div>
              <div className="db-history-alerts">{h.alerts} alert{h.alerts !== 1 ? "s" : ""}</div>
              <div className={`db-badge ${h.status}`}>{h.status}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}