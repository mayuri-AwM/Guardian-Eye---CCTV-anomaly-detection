<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Guardian Eye – README</title>
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow:wght@300;400;600;700;900&family=Barlow+Condensed:wght@700;900&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #060a0f;
    --surface: #0b1118;
    --surface2: #101820;
    --border: #1a2a3a;
    --accent: #00e5ff;
    --accent2: #ff4444;
    --accent3: #00ff88;
    --text: #c8d8e8;
    --text-dim: #5a7a9a;
    --mono: 'Share Tech Mono', monospace;
    --sans: 'Barlow', sans-serif;
    --condensed: 'Barlow Condensed', sans-serif;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    font-size: 15px;
    line-height: 1.7;
    overflow-x: hidden;
  }

  /* Scanline overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.015) 2px, rgba(0,229,255,0.015) 4px);
    pointer-events: none;
    z-index: 9999;
  }

  /* ── HEADER ── */
  header {
    position: relative;
    padding: 80px 40px 60px;
    border-bottom: 1px solid var(--border);
    overflow: hidden;
    background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,229,255,0.07) 0%, transparent 70%);
  }

  .header-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: 40px;
    max-width: 1100px;
    margin: 0 auto;
  }

  .eye-logo {
    width: 64px; height: 64px;
    margin-bottom: 20px;
    animation: pulse-eye 3s ease-in-out infinite;
  }

  @keyframes pulse-eye {
    0%,100% { filter: drop-shadow(0 0 8px var(--accent)); }
    50% { filter: drop-shadow(0 0 20px var(--accent)) drop-shadow(0 0 40px rgba(0,229,255,0.4)); }
  }

  .project-label {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  h1 {
    font-family: var(--condensed);
    font-size: clamp(52px, 8vw, 96px);
    font-weight: 900;
    line-height: 0.9;
    letter-spacing: -2px;
    color: #fff;
    text-shadow: 0 0 60px rgba(0,229,255,0.3);
  }

  h1 span { color: var(--accent); }

  .tagline {
    margin-top: 18px;
    font-size: 17px;
    font-weight: 300;
    color: var(--text-dim);
    max-width: 560px;
    line-height: 1.6;
  }

  .header-badges {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-end;
  }

  .badge {
    font-family: var(--mono);
    font-size: 11px;
    padding: 6px 14px;
    border: 1px solid;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .badge-blue { border-color: var(--accent); color: var(--accent); background: rgba(0,229,255,0.05); }
  .badge-green { border-color: var(--accent3); color: var(--accent3); background: rgba(0,255,136,0.05); }
  .badge-red { border-color: var(--accent2); color: var(--accent2); background: rgba(255,68,68,0.05); }

  /* ── NAV ── */
  nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(6,10,15,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 40px;
  }

  .nav-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .nav-inner::-webkit-scrollbar { display: none; }

  .nav-tab {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    padding: 16px 20px;
    cursor: pointer;
    border: none;
    background: none;
    white-space: nowrap;
    border-bottom: 2px solid transparent;
    transition: color 0.2s, border-color 0.2s;
  }

  .nav-tab:hover, .nav-tab.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
  }

  /* ── MAIN LAYOUT ── */
  main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 40px 100px;
  }

  .section {
    padding: 64px 0 32px;
    border-bottom: 1px solid var(--border);
    display: none;
    animation: fade-in 0.3s ease;
  }

  .section.active { display: block; }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── SECTION HEADERS ── */
  .section-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 40px;
  }

  .section-num {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--accent);
    border: 1px solid rgba(0,229,255,0.3);
    padding: 4px 10px;
    letter-spacing: 2px;
  }

  h2 {
    font-family: var(--condensed);
    font-size: 38px;
    font-weight: 900;
    letter-spacing: -0.5px;
    color: #fff;
  }

  h3 {
    font-family: var(--condensed);
    font-size: 22px;
    font-weight: 700;
    color: var(--accent);
    margin: 32px 0 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  p { margin-bottom: 16px; color: var(--text); }

  /* ── OVERVIEW GRID ── */
  .overview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 40px;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent);
  }

  .stat-card.red::before { background: var(--accent2); }
  .stat-card.green::before { background: var(--accent3); }

  .stat-num {
    font-family: var(--condensed);
    font-size: 48px;
    font-weight: 900;
    color: var(--accent);
    line-height: 1;
  }

  .stat-card.red .stat-num { color: var(--accent2); }
  .stat-card.green .stat-num { color: var(--accent3); }

  .stat-label {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 6px;
  }

  /* ── FEATURES ── */
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }

  .feature-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 24px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
    transition: border-color 0.2s, background 0.2s;
    cursor: default;
  }

  .feature-card:hover {
    border-color: rgba(0,229,255,0.4);
    background: var(--surface2);
  }

  .feature-icon {
    font-size: 24px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .feature-title {
    font-family: var(--condensed);
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }

  .feature-desc {
    font-size: 13px;
    color: var(--text-dim);
    line-height: 1.5;
    margin: 0;
  }

  /* ── CRIME TAGS ── */
  .crime-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 20px 0;
  }

  .crime-tag {
    font-family: var(--mono);
    font-size: 12px;
    padding: 8px 16px;
    border: 1px solid;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: default;
    transition: all 0.2s;
  }

  .crime-tag:hover { transform: translateY(-2px); }

  .ct-abuse { border-color: #ff6b35; color: #ff6b35; background: rgba(255,107,53,0.06); }
  .ct-explosion { border-color: #ff4444; color: #ff4444; background: rgba(255,68,68,0.06); }
  .ct-fighting { border-color: #ffaa00; color: #ffaa00; background: rgba(255,170,0,0.06); }
  .ct-robbery { border-color: #cc44ff; color: #cc44ff; background: rgba(204,68,255,0.06); }
  .ct-stealing { border-color: #4488ff; color: #4488ff; background: rgba(68,136,255,0.06); }
  .ct-normal { border-color: var(--accent3); color: var(--accent3); background: rgba(0,255,136,0.06); }

  /* ── ARCHITECTURE ── */
  .arch-diagram {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 32px;
    margin: 24px 0;
    font-family: var(--mono);
    font-size: 13px;
    line-height: 2;
    color: var(--text-dim);
    overflow-x: auto;
  }

  .arch-layer {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 20px;
    border: 1px solid var(--border);
    margin: 8px 0;
    background: var(--surface2);
    transition: border-color 0.2s;
    cursor: default;
  }

  .arch-layer:hover { border-color: var(--accent); }

  .arch-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent);
    flex-shrink: 0;
  }

  .arch-dot.red { background: var(--accent2); box-shadow: 0 0 6px var(--accent2); }
  .arch-dot.green { background: var(--accent3); box-shadow: 0 0 6px var(--accent3); }
  .arch-dot.yellow { background: #ffaa00; box-shadow: 0 0 6px #ffaa00; }

  .arch-name {
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #fff;
    flex: 1;
  }

  .arch-tech {
    font-size: 11px;
    color: var(--text-dim);
  }

  .arch-arrow {
    text-align: center;
    color: var(--accent);
    font-size: 18px;
    margin: 4px 0;
    padding-left: 20px;
  }

  /* ── TECH STACK ── */
  .tech-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .tech-tab {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 8px 16px;
    border: 1px solid var(--border);
    background: none;
    color: var(--text-dim);
    cursor: pointer;
    transition: all 0.2s;
  }

  .tech-tab:hover, .tech-tab.active {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(0,229,255,0.05);
  }

  .tech-panel { display: none; }
  .tech-panel.active { display: block; animation: fade-in 0.2s ease; }

  .tech-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .tech-pill {
    font-family: var(--mono);
    font-size: 12px;
    padding: 8px 18px;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    transition: all 0.2s;
    cursor: default;
  }

  .tech-pill:hover {
    border-color: rgba(0,229,255,0.4);
    color: var(--accent);
  }

  /* ── CODE BLOCKS ── */
  .code-block {
    background: #020608;
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    padding: 20px 24px;
    font-family: var(--mono);
    font-size: 13px;
    line-height: 1.8;
    color: #8fbccc;
    overflow-x: auto;
    margin: 16px 0;
    position: relative;
  }

  .code-block .comment { color: #3a5a6a; }
  .code-block .keyword { color: var(--accent); }
  .code-block .string { color: var(--accent3); }
  .code-block .path { color: #cc9944; }

  .copy-btn {
    position: absolute;
    top: 12px; right: 12px;
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 1px;
    padding: 4px 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text-dim);
    cursor: pointer;
    transition: all 0.2s;
  }

  .copy-btn:hover { border-color: var(--accent); color: var(--accent); }

  /* ── FOLDER TREE ── */
  .folder-tree {
    background: #020608;
    border: 1px solid var(--border);
    padding: 24px;
    font-family: var(--mono);
    font-size: 13px;
    line-height: 2;
    overflow-x: auto;
  }

  .tree-dir { color: var(--accent); }
  .tree-file { color: #8fbccc; }
  .tree-line { color: #1a3a4a; }

  /* ── WORKFLOW STEPS ── */
  .workflow-steps {
    display: grid;
    gap: 0;
    position: relative;
  }

  .workflow-steps::before {
    content: '';
    position: absolute;
    left: 24px;
    top: 48px;
    bottom: 48px;
    width: 1px;
    background: linear-gradient(to bottom, var(--accent), rgba(0,229,255,0.1));
  }

  .workflow-step {
    display: flex;
    gap: 24px;
    padding: 24px 0;
    align-items: flex-start;
    cursor: default;
  }

  .step-num {
    width: 48px; height: 48px;
    border: 2px solid var(--accent);
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--mono);
    font-size: 16px;
    font-weight: bold;
    color: var(--accent);
    flex-shrink: 0;
    z-index: 1;
    transition: all 0.2s;
  }

  .workflow-step:hover .step-num {
    background: rgba(0,229,255,0.1);
    box-shadow: 0 0 20px rgba(0,229,255,0.3);
  }

  .step-content { flex: 1; padding-top: 8px; }

  .step-title {
    font-family: var(--condensed);
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }

  .step-detail {
    font-size: 14px;
    color: var(--text-dim);
    margin: 0;
  }

  /* ── DB SCHEMA ── */
  .schema-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin: 24px 0;
  }

  .schema-table {
    background: var(--surface);
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .schema-table-header {
    background: rgba(0,229,255,0.08);
    border-bottom: 1px solid var(--border);
    padding: 12px 16px;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--accent);
  }

  .schema-field {
    padding: 10px 16px;
    border-bottom: 1px solid rgba(26,42,58,0.5);
    font-family: var(--mono);
    font-size: 12px;
    color: var(--text-dim);
    display: flex;
    justify-content: space-between;
  }

  .schema-field:last-child { border-bottom: none; }
  .schema-field .field-name { color: var(--text); }
  .schema-field .field-type { color: #4488ff; }

  /* ── ROUTES TABLE ── */
  .routes-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--mono);
    font-size: 13px;
    margin: 24px 0;
  }

  .routes-table th {
    background: rgba(0,229,255,0.06);
    border: 1px solid var(--border);
    padding: 12px 20px;
    text-align: left;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--accent);
  }

  .routes-table td {
    border: 1px solid var(--border);
    padding: 12px 20px;
    color: var(--text-dim);
    transition: background 0.15s;
  }

  .routes-table tr:hover td { background: var(--surface2); }

  .routes-table td:first-child {
    color: var(--accent3);
    font-weight: bold;
  }

  /* ── INSTALL STEPS ── */
  .install-step {
    margin: 24px 0;
    border: 1px solid var(--border);
  }

  .install-step-header {
    background: var(--surface);
    padding: 12px 20px;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--accent);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .install-step-header::before {
    content: '▶';
    font-size: 8px;
  }

  /* ── FUTURE GRID ── */
  .future-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin: 24px 0;
  }

  .future-item {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 16px 20px;
    font-size: 13px;
    color: var(--text-dim);
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s;
    cursor: default;
  }

  .future-item:hover {
    border-color: rgba(0,255,136,0.4);
    color: var(--accent3);
    background: rgba(0,255,136,0.03);
  }

  .future-item::before {
    content: '◈';
    color: var(--accent3);
    font-size: 10px;
    flex-shrink: 0;
  }

  /* ── CONTRIBUTORS ── */
  .contributors {
    display: flex;
    gap: 20px;
    margin: 24px 0;
  }

  .contributor-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 28px 32px;
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .contributor-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(to right, var(--accent), transparent);
  }

  .contributor-name {
    font-family: var(--condensed);
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 6px;
  }

  .contributor-dept {
    font-size: 13px;
    color: var(--text-dim);
  }

  .contributor-inst {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 1px;
    margin-top: 12px;
  }

  /* ── FOOTER ── */
  footer {
    border-top: 1px solid var(--border);
    padding: 40px;
    text-align: center;
  }

  .footer-inner {
    max-width: 1100px;
    margin: 0 auto;
  }

  .footer-logo {
    font-family: var(--condensed);
    font-size: 28px;
    font-weight: 900;
    color: var(--accent);
    letter-spacing: 2px;
    margin-bottom: 12px;
  }

  .footer-note {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 2px;
  }

  /* Alert demo */
  .alert-demo {
    background: rgba(255,68,68,0.05);
    border: 1px solid rgba(255,68,68,0.3);
    padding: 20px 24px;
    margin: 20px 0;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .alert-dot {
    width: 12px; height: 12px;
    border-radius: 50%;
    background: var(--accent2);
    box-shadow: 0 0 10px var(--accent2);
    flex-shrink: 0;
    animation: blink 1.2s ease-in-out infinite;
  }

  @keyframes blink {
    0%,100% { opacity: 1; }
    50% { opacity: 0.2; }
  }

  .alert-info { font-family: var(--mono); font-size: 12px; }
  .alert-crime { color: var(--accent2); font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
  .alert-meta { color: var(--text-dim); }

  /* Responsive */
  @media (max-width: 768px) {
    header, nav, main { padding-left: 20px; padding-right: 20px; }
    .header-grid { grid-template-columns: 1fr; }
    .header-badges { flex-direction: row; align-items: flex-start; }
    .overview-grid, .schema-grid, .future-grid { grid-template-columns: 1fr; }
    .feature-grid { grid-template-columns: 1fr; }
    .contributors { flex-direction: column; }
    h1 { font-size: 52px; }
  }
</style>
</head>
<body>

<!-- HEADER -->
<header>
  <div class="header-grid">
    <div>
      <svg class="eye-logo" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="32" rx="30" ry="18" stroke="#00e5ff" stroke-width="2"/>
        <circle cx="32" cy="32" r="10" stroke="#00e5ff" stroke-width="2"/>
        <circle cx="32" cy="32" r="4" fill="#00e5ff"/>
        <line x1="2" y1="32" x2="14" y2="32" stroke="#00e5ff" stroke-width="1.5"/>
        <line x1="50" y1="32" x2="62" y2="32" stroke="#00e5ff" stroke-width="1.5"/>
        <circle cx="32" cy="10" r="2" fill="rgba(0,229,255,0.3)"/>
        <circle cx="32" cy="54" r="2" fill="rgba(0,229,255,0.3)"/>
        <line x1="8" y1="14" x2="18" y2="22" stroke="rgba(0,229,255,0.3)" stroke-width="1"/>
        <line x1="56" y1="14" x2="46" y2="22" stroke="rgba(0,229,255,0.3)" stroke-width="1"/>
      </svg>
      <div class="project-label">AI-Powered Surveillance System</div>
      <h1>GUARDIAN<br><span>EYE</span></h1>
      <p class="tagline">Automated CCTV anomaly detection using Computer Vision and Deep Learning — detecting threats before they escalate.</p>
    </div>
    <div class="header-badges">
      <span class="badge badge-blue">YOLOv8</span>
      <span class="badge badge-green">FastAPI</span>
      <span class="badge badge-blue">PyTorch</span>
      <span class="badge badge-red">Academic Project</span>
      <span class="badge badge-green">MIT · Pune</span>
    </div>
  </div>
</header>

<!-- NAV -->
<nav>
  <div class="nav-inner">
    <button class="nav-tab active" onclick="showSection('overview')">Overview</button>
    <button class="nav-tab" onclick="showSection('features')">Features</button>
    <button class="nav-tab" onclick="showSection('architecture')">Architecture</button>
    <button class="nav-tab" onclick="showSection('techstack')">Tech Stack</button>
    <button class="nav-tab" onclick="showSection('workflow')">Workflow</button>
    <button class="nav-tab" onclick="showSection('structure')">Structure</button>
    <button class="nav-tab" onclick="showSection('database')">Database</button>
    <button class="nav-tab" onclick="showSection('install')">Installation</button>
    <button class="nav-tab" onclick="showSection('routes')">Routes</button>
    <button class="nav-tab" onclick="showSection('future')">Roadmap</button>
    <button class="nav-tab" onclick="showSection('team')">Team</button>
  </div>
</nav>

<main>

  <!-- ── OVERVIEW ── -->
  <section id="overview" class="section active">
    <div class="section-header">
      <span class="section-num">01</span>
      <h2>Overview</h2>
    </div>

    <div class="overview-grid">
      <div class="stat-card">
        <div class="stat-num">6</div>
        <div class="stat-label">Crime Categories</div>
      </div>
      <div class="stat-card red">
        <div class="stat-num">YOLOv8</div>
        <div class="stat-label">Weapon Detection</div>
      </div>
      <div class="stat-card green">
        <div class="stat-num">RT</div>
        <div class="stat-label">Alert Generation</div>
      </div>
    </div>

    <p>Traditional CCTV systems require <strong style="color:#fff">continuous human monitoring</strong> — an error-prone, expensive, and exhausting task. Guardian Eye automates surveillance by using AI to do the watching, so humans can focus on responding.</p>

    <p>The system analyzes uploaded CCTV footage frame-by-frame, detects weapons using YOLOv8 object detection, classifies suspicious activities using a deep learning model, captures evidence frames, and dispatches instant alerts to CCTV owners.</p>

    <div class="alert-demo">
      <div class="alert-dot"></div>
      <div class="alert-info">
        <div class="alert-crime">⚠ Anomaly Detected — Fighting</div>
        <div class="alert-meta">Confidence: 0.91 &nbsp;|&nbsp; Timestamp: 00:02:13 &nbsp;|&nbsp; Frame: frame_125.jpg</div>
      </div>
    </div>

    <p>The architecture is <strong style="color:#fff">modular and scalable</strong>, beginning from uploaded video analysis (MVP) and designed to evolve toward real-time CCTV stream monitoring via RTSP.</p>
  </section>

  <!-- ── FEATURES ── -->
  <section id="features" class="section">
    <div class="section-header">
      <span class="section-num">02</span>
      <h2>Key Features</h2>
    </div>

    <div class="feature-grid">
      <div class="feature-card">
        <div class="feature-icon">📹</div>
        <div>
          <div class="feature-title">Video Upload & Processing</div>
          <p class="feature-desc">Upload CCTV recordings for automated frame-by-frame AI analysis via a clean web dashboard.</p>
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🔫</div>
        <div>
          <div class="feature-title">Weapon Detection</div>
          <p class="feature-desc">YOLOv8-powered detection of guns, knives, sticks, and suspicious objects with bounding boxes and confidence scores.</p>
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🧠</div>
        <div>
          <div class="feature-title">Crime Classification</div>
          <p class="feature-desc">Deep learning model classifies scenes into crime categories by analyzing scene context and motion patterns.</p>
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📸</div>
        <div>
          <div class="feature-title">Evidence Capture</div>
          <p class="feature-desc">Automatically captures and stores the exact frame where an anomaly occurs as evidence.</p>
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🚨</div>
        <div>
          <div class="feature-title">Instant Alerts</div>
          <p class="feature-desc">Email notifications sent immediately when anomalies are detected, with crime type, confidence, and timestamp.</p>
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <div>
          <div class="feature-title">Monitoring Dashboard</div>
          <p class="feature-desc">Secure web dashboard displaying alerts, evidence frames, and incident history for CCTV owners.</p>
        </div>
      </div>
    </div>

    <h3>Detected Crime Types</h3>
    <div class="crime-tags">
      <span class="crime-tag ct-abuse">Abuse</span>
      <span class="crime-tag ct-explosion">Explosion</span>
      <span class="crime-tag ct-fighting">Fighting</span>
      <span class="crime-tag ct-robbery">Robbery</span>
      <span class="crime-tag ct-stealing">Stealing</span>
      <span class="crime-tag ct-normal">Normal</span>
    </div>
  </section>

  <!-- ── ARCHITECTURE ── -->
  <section id="architecture" class="section">
    <div class="section-header">
      <span class="section-num">03</span>
      <h2>System Architecture</h2>
    </div>

    <div class="arch-layer">
      <div class="arch-dot"></div>
      <div class="arch-name">React Frontend</div>
      <div class="arch-tech">User Interface · Dashboard · Authentication</div>
    </div>
    <div class="arch-arrow">↓ REST API</div>
    <div class="arch-layer">
      <div class="arch-dot yellow"></div>
      <div class="arch-name">FastAPI Backend</div>
      <div class="arch-tech">Routes · Services · Schemas · Auth</div>
    </div>
    <div class="arch-arrow">↓ Video Processing Pipeline</div>
    <div style="border-left: 2px solid var(--border); margin-left: 24px; padding-left: 24px;">
      <div class="arch-layer">
        <div class="arch-dot"></div>
        <div class="arch-name">Frame Extraction</div>
        <div class="arch-tech">OpenCV</div>
      </div>
      <div class="arch-layer">
        <div class="arch-dot red"></div>
        <div class="arch-name">Weapon Detection</div>
        <div class="arch-tech">YOLOv8 · Bounding Boxes · Confidence</div>
      </div>
      <div class="arch-layer">
        <div class="arch-dot red"></div>
        <div class="arch-name">Crime Classification</div>
        <div class="arch-tech">PyTorch · TensorFlow · Scene Context</div>
      </div>
      <div class="arch-layer">
        <div class="arch-dot yellow"></div>
        <div class="arch-name">Alert Generation</div>
        <div class="arch-tech">Crime Type · Timestamp · Frame Path</div>
      </div>
    </div>
    <div class="arch-arrow">↓</div>
    <div class="arch-layer">
      <div class="arch-dot green"></div>
      <div class="arch-name">PostgreSQL Database</div>
      <div class="arch-tech">SQLAlchemy ORM · Users · Videos · Alerts</div>
    </div>
    <div class="arch-arrow">↓</div>
    <div class="arch-layer">
      <div class="arch-dot green"></div>
      <div class="arch-name">Notification Service</div>
      <div class="arch-tech">SMTP Email · Firebase Push (future)</div>
    </div>
  </section>

  <!-- ── TECH STACK ── -->
  <section id="techstack" class="section">
    <div class="section-header">
      <span class="section-num">04</span>
      <h2>Tech Stack</h2>
    </div>

    <div class="tech-tabs">
      <button class="tech-tab active" onclick="showTech('frontend')">Frontend</button>
      <button class="tech-tab" onclick="showTech('backend')">Backend</button>
      <button class="tech-tab" onclick="showTech('ai')">AI / ML</button>
      <button class="tech-tab" onclick="showTech('db')">Database</button>
      <button class="tech-tab" onclick="showTech('devops')">DevOps</button>
      <button class="tech-tab" onclick="showTech('notif')">Notifications</button>
    </div>

    <div id="tech-frontend" class="tech-panel active">
      <div class="tech-pills">
        <span class="tech-pill">React.js</span>
        <span class="tech-pill">HTML5</span>
        <span class="tech-pill">CSS3</span>
        <span class="tech-pill">Bootstrap</span>
        <span class="tech-pill">React Router</span>
      </div>
    </div>
    <div id="tech-backend" class="tech-panel">
      <div class="tech-pills">
        <span class="tech-pill">Python</span>
        <span class="tech-pill">FastAPI</span>
        <span class="tech-pill">Pydantic</span>
        <span class="tech-pill">Uvicorn</span>
        <span class="tech-pill">Redis</span>
        <span class="tech-pill">Celery / RQ</span>
      </div>
    </div>
    <div id="tech-ai" class="tech-panel">
      <div class="tech-pills">
        <span class="tech-pill">PyTorch</span>
        <span class="tech-pill">TensorFlow</span>
        <span class="tech-pill">Ultralytics YOLOv8</span>
        <span class="tech-pill">OpenCV</span>
      </div>
    </div>
    <div id="tech-db" class="tech-panel">
      <div class="tech-pills">
        <span class="tech-pill">PostgreSQL</span>
        <span class="tech-pill">SQLAlchemy ORM</span>
        <span class="tech-pill">Local Storage (MVP)</span>
        <span class="tech-pill">AWS S3 (future)</span>
      </div>
    </div>
    <div id="tech-devops" class="tech-panel">
      <div class="tech-pills">
        <span class="tech-pill">Docker</span>
        <span class="tech-pill">Docker Compose</span>
      </div>
    </div>
    <div id="tech-notif" class="tech-panel">
      <div class="tech-pills">
        <span class="tech-pill">SMTP Email Alerts</span>
        <span class="tech-pill">Firebase Push (future)</span>
        <span class="tech-pill">SMS Alerts (future)</span>
      </div>
    </div>
  </section>

  <!-- ── WORKFLOW ── -->
  <section id="workflow" class="section">
    <div class="section-header">
      <span class="section-num">05</span>
      <h2>Backend Workflow</h2>
    </div>

    <div class="workflow-steps">
      <div class="workflow-step">
        <div class="step-num">01</div>
        <div class="step-content">
          <div class="step-title">Video Upload</div>
          <p class="step-detail">CCTV owner uploads footage via the dashboard. The backend stores the video and queues it for processing via <code style="color:var(--accent);font-family:var(--mono)">POST /upload-video</code>.</p>
        </div>
      </div>
      <div class="workflow-step">
        <div class="step-num">02</div>
        <div class="step-content">
          <div class="step-title">Frame Extraction</div>
          <p class="step-detail">OpenCV decomposes the video into individual frames: <code style="color:var(--accent3);font-family:var(--mono)">frame_1.jpg, frame_2.jpg, frame_3.jpg…</code></p>
        </div>
      </div>
      <div class="workflow-step">
        <div class="step-num">03</div>
        <div class="step-content">
          <div class="step-title">Weapon Detection</div>
          <p class="step-detail">Each frame is analyzed by YOLOv8. Detected objects (gun, knife, stick) are returned with bounding boxes, confidence scores, and labels.</p>
        </div>
      </div>
      <div class="workflow-step">
        <div class="step-num">04</div>
        <div class="step-content">
          <div class="step-title">Crime Classification</div>
          <p class="step-detail">A deep learning model classifies the scene into one of six categories: Abuse, Explosion, Fighting, Robbery, Stealing, or Normal — analyzing scene context and motion patterns.</p>
        </div>
      </div>
      <div class="workflow-step">
        <div class="step-num">05</div>
        <div class="step-content">
          <div class="step-title">Anomaly Detection</div>
          <p class="step-detail">If the predicted class is not <strong style="color:var(--accent3)">Normal</strong>, an anomaly is triggered. The evidence frame is captured and the alert pipeline fires.</p>
        </div>
      </div>
      <div class="workflow-step">
        <div class="step-num">06</div>
        <div class="step-content">
          <div class="step-title">Alert Generation</div>
          <p class="step-detail">Crime type, confidence score, timestamp, evidence frame, and video reference are stored in the database and displayed on the dashboard.</p>
        </div>
      </div>
      <div class="workflow-step">
        <div class="step-num">07</div>
        <div class="step-content">
          <div class="step-title">Notification Dispatch</div>
          <p class="step-detail">Email alert is immediately sent to the CCTV owner with incident details. Future: push notifications and SMS.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ── STRUCTURE ── -->
  <section id="structure" class="section">
    <div class="section-header">
      <span class="section-num">06</span>
      <h2>Folder Structure</h2>
    </div>

    <h3>Backend</h3>
    <div class="folder-tree">
<span class="tree-dir">backend/</span>
<span class="tree-line">│</span>
├── <span class="tree-dir">app/</span>
<span class="tree-line">│   ├── </span><span class="tree-file">main.py</span>
<span class="tree-line">│   ├── </span><span class="tree-file">config.py</span>
<span class="tree-line">│   ├── </span><span class="tree-file">dependencies.py</span>
<span class="tree-line">│   │</span>
<span class="tree-line">│   ├── </span><span class="tree-dir">routes/</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">upload.py</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">alerts.py</span>
<span class="tree-line">│   │   └── </span><span class="tree-file">auth.py</span>
<span class="tree-line">│   │</span>
<span class="tree-line">│   ├── </span><span class="tree-dir">models/</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">user.py</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">video.py</span>
<span class="tree-line">│   │   └── </span><span class="tree-file">alert.py</span>
<span class="tree-line">│   │</span>
<span class="tree-line">│   ├── </span><span class="tree-dir">schemas/</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">user_schema.py</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">video_schema.py</span>
<span class="tree-line">│   │   └── </span><span class="tree-file">alert_schema.py</span>
<span class="tree-line">│   │</span>
<span class="tree-line">│   ├── </span><span class="tree-dir">services/</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">video_processor.py</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">alert_service.py</span>
<span class="tree-line">│   │   └── </span><span class="tree-file">notification_service.py</span>
<span class="tree-line">│   │</span>
<span class="tree-line">│   ├── </span><span class="tree-dir">ai_engine/</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">weapon_detection.py</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">crime_classification.py</span>
<span class="tree-line">│   │   └── </span><span class="tree-file">frame_extractor.py</span>
<span class="tree-line">│   │</span>
<span class="tree-line">│   ├── </span><span class="tree-dir">database/</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">connection.py</span>
<span class="tree-line">│   │   └── </span><span class="tree-dir">migrations/</span>
<span class="tree-line">│   │</span>
<span class="tree-line">│   └── </span><span class="tree-dir">utils/</span>
<span class="tree-line">│       ├── </span><span class="tree-file">logger.py</span>
<span class="tree-line">│       └── </span><span class="tree-file">helpers.py</span>
<span class="tree-line">│</span>
└── <span class="tree-file">requirements.txt</span>
    </div>

    <h3>Frontend</h3>
    <div class="folder-tree">
<span class="tree-dir">guardian-eye/</span>
<span class="tree-line">│</span>
├── <span class="tree-dir">public/</span>
<span class="tree-line">│   └── </span><span class="tree-file">index.html</span>
<span class="tree-line">│</span>
├── <span class="tree-dir">src/</span>
<span class="tree-line">│   ├── </span><span class="tree-dir">components/</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">Dash.js</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">Dashboard.js</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">Login.js</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">Signup.js</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">Navbar.js</span>
<span class="tree-line">│   │   ├── </span><span class="tree-file">About.js</span>
<span class="tree-line">│   │   └── </span><span class="tree-file">Contact.js</span>
<span class="tree-line">│   │</span>
<span class="tree-line">│   ├── </span><span class="tree-dir">photos/</span>
<span class="tree-line">│   │   └── </span><span class="tree-file">bg.webp</span>
<span class="tree-line">│   │</span>
<span class="tree-line">│   ├── </span><span class="tree-dir">styles/</span>
<span class="tree-line">│   │   └── </span><span class="tree-file">dash.css</span>
<span class="tree-line">│   │</span>
<span class="tree-line">│   ├── </span><span class="tree-file">App.js</span>
<span class="tree-line">│   └── </span><span class="tree-file">index.js</span>
<span class="tree-line">│</span>
├── <span class="tree-file">package.json</span>
└── <span class="tree-file">README.md</span>
    </div>
  </section>

  <!-- ── DATABASE ── -->
  <section id="database" class="section">
    <div class="section-header">
      <span class="section-num">07</span>
      <h2>Database Schema</h2>
    </div>

    <div class="schema-grid">
      <div class="schema-table">
        <div class="schema-table-header">Users</div>
        <div class="schema-field"><span class="field-name">id</span><span class="field-type">INT PK</span></div>
        <div class="schema-field"><span class="field-name">email</span><span class="field-type">VARCHAR</span></div>
        <div class="schema-field"><span class="field-name">password_hash</span><span class="field-type">TEXT</span></div>
        <div class="schema-field"><span class="field-name">created_at</span><span class="field-type">TIMESTAMP</span></div>
      </div>
      <div class="schema-table">
        <div class="schema-table-header">Videos</div>
        <div class="schema-field"><span class="field-name">id</span><span class="field-type">INT PK</span></div>
        <div class="schema-field"><span class="field-name">user_id</span><span class="field-type">FK → Users</span></div>
        <div class="schema-field"><span class="field-name">video_path</span><span class="field-type">TEXT</span></div>
        <div class="schema-field"><span class="field-name">upload_time</span><span class="field-type">TIMESTAMP</span></div>
        <div class="schema-field"><span class="field-name">status</span><span class="field-type">VARCHAR</span></div>
      </div>
      <div class="schema-table">
        <div class="schema-table-header">Alerts</div>
        <div class="schema-field"><span class="field-name">id</span><span class="field-type">INT PK</span></div>
        <div class="schema-field"><span class="field-name">video_id</span><span class="field-type">FK → Videos</span></div>
        <div class="schema-field"><span class="field-name">crime_type</span><span class="field-type">VARCHAR</span></div>
        <div class="schema-field"><span class="field-name">frame_path</span><span class="field-type">TEXT</span></div>
        <div class="schema-field"><span class="field-name">timestamp</span><span class="field-type">VARCHAR</span></div>
        <div class="schema-field"><span class="field-name">confidence</span><span class="field-type">FLOAT</span></div>
      </div>
    </div>
  </section>

  <!-- ── INSTALLATION ── -->
  <section id="install" class="section">
    <div class="section-header">
      <span class="section-num">08</span>
      <h2>Installation</h2>
    </div>

    <div class="install-step">
      <div class="install-step-header">Step 1 — Clone Repository</div>
      <div class="code-block">
        <button class="copy-btn" onclick="copyCode(this)">COPY</button>
git clone https://github.com/your-repo/guardian-eye.git
      </div>
    </div>

    <div class="install-step">
      <div class="install-step-header">Step 2 — Frontend Setup</div>
      <div class="code-block">
        <button class="copy-btn" onclick="copyCode(this)">COPY</button>
cd guardian-eye
npm install
npm start

<span class="comment"># App runs at → http://localhost:3000</span>
      </div>
    </div>

    <div class="install-step">
      <div class="install-step-header">Step 3 — Backend Setup</div>
      <div class="code-block">
        <button class="copy-btn" onclick="copyCode(this)">COPY</button>
cd backend

<span class="comment"># Create virtual environment</span>
python -m venv venv

<span class="comment"># Activate — Windows</span>
venv\Scripts\activate

<span class="comment"># Activate — Linux / Mac</span>
source venv/bin/activate

<span class="comment"># Install dependencies</span>
pip install -r requirements.txt

<span class="comment"># Run server</span>
uvicorn app.main:app --reload
      </div>
    </div>

    <div class="install-step">
      <div class="install-step-header">Access Points</div>
      <div class="code-block">
<span class="keyword">Frontend    </span>→  <span class="string">http://localhost:3000</span>
<span class="keyword">Backend API </span>→  <span class="string">http://localhost:8000</span>
<span class="keyword">API Docs    </span>→  <span class="string">http://localhost:8000/docs</span>
      </div>
    </div>
  </section>

  <!-- ── ROUTES ── -->
  <section id="routes" class="section">
    <div class="section-header">
      <span class="section-num">09</span>
      <h2>Application Routes</h2>
    </div>

    <table class="routes-table">
      <thead>
        <tr>
          <th>Route</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>/</td><td>Landing Page</td></tr>
        <tr><td>/login</td><td>Login Page</td></tr>
        <tr><td>/signup</td><td>Signup Page</td></tr>
        <tr><td>/dashboard</td><td>CCTV Monitoring Dashboard</td></tr>
        <tr><td>/about</td><td>About Project</td></tr>
        <tr><td>/contact</td><td>Contact Page</td></tr>
      </tbody>
    </table>

    <h3>API Endpoint</h3>
    <div class="code-block">
<span class="keyword">POST</span>  <span class="path">/upload-video</span>    <span class="comment">— Upload CCTV video for processing</span>
<span class="keyword">GET</span>   <span class="path">/alerts</span>          <span class="comment">— Retrieve all alerts for user</span>
<span class="keyword">POST</span>  <span class="path">/auth/login</span>      <span class="comment">— User authentication</span>
<span class="keyword">POST</span>  <span class="path">/auth/signup</span>     <span class="comment">— New user registration</span>
    </div>
  </section>

  <!-- ── FUTURE ── -->
  <section id="future" class="section">
    <div class="section-header">
      <span class="section-num">10</span>
      <h2>Roadmap</h2>
    </div>

    <p>Guardian Eye is designed to evolve. Planned enhancements span real-time hardware integration, expanded AI capabilities, and cloud-scale deployment.</p>

    <div class="future-grid">
      <div class="future-item">Real-time CCTV Streaming (RTSP)</div>
      <div class="future-item">Multi-camera Monitoring</div>
      <div class="future-item">Face Recognition for Suspects</div>
      <div class="future-item">Fire &amp; Smoke Detection</div>
      <div class="future-item">Crowd Behavior Detection</div>
      <div class="future-item">Mobile Application Alerts</div>
      <div class="future-item">Cloud Deployment (Kubernetes)</div>
      <div class="future-item">Role-based Access Control</div>
      <div class="future-item">AI Model Training Dashboard</div>
      <div class="future-item">SMS Alert Integration</div>
      <div class="future-item">AWS S3 Media Storage</div>
      <div class="future-item">Firebase Push Notifications</div>
    </div>

    <h3>RTSP Hardware Integration</h3>
    <div class="arch-layer" style="margin: 8px 0;">
      <div class="arch-dot"></div>
      <div class="arch-name">CCTV Camera</div>
      <div class="arch-tech">Hardware source</div>
    </div>
    <div class="arch-arrow">↓ RTSP Stream</div>
    <div class="arch-layer" style="margin: 8px 0;">
      <div class="arch-dot yellow"></div>
      <div class="arch-name">Frame Extractor</div>
      <div class="arch-tech">Real-time frame buffer</div>
    </div>
    <div class="arch-arrow">↓</div>
    <div class="arch-layer" style="margin: 8px 0;">
      <div class="arch-dot red"></div>
      <div class="arch-name">AI Detection Engine</div>
      <div class="arch-tech">YOLOv8 + Classification</div>
    </div>
    <div class="arch-arrow">↓</div>
    <div class="arch-layer" style="margin: 8px 0;">
      <div class="arch-dot green"></div>
      <div class="arch-name">Alert System</div>
      <div class="arch-tech">Instant multi-channel notifications</div>
    </div>
  </section>

  <!-- ── TEAM ── -->
  <section id="team" class="section">
    <div class="section-header">
      <span class="section-num">11</span>
      <h2>Contributors</h2>
    </div>

    <div class="contributors">
      <div class="contributor-card">
        <div class="contributor-name">Mayuri Raskar</div>
        <div class="contributor-dept">Department of Computer Engineering</div>
        <div class="contributor-inst">Marathwada Mitramandal's Institute of Technology · Pune</div>
      </div>
      <div class="contributor-card">
        <div class="contributor-name">Ishwari More</div>
        <div class="contributor-dept">Department of Computer Engineering</div>
        <div class="contributor-inst">Marathwada Mitramandal's Institute of Technology · Pune</div>
      </div>
    </div>

    <div style="margin-top: 32px; padding: 24px; border: 1px solid var(--border); background: var(--surface);">
      <div style="font-family:var(--mono); font-size: 11px; color: var(--accent); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 10px;">License</div>
      <p style="font-size: 14px; color: var(--text-dim); margin: 0;">This project is developed for <strong style="color:#fff">academic and research purposes</strong>. All rights reserved by the contributors and Marathwada Mitramandal's Institute of Technology, Pune.</p>
    </div>
  </section>

</main>

<footer>
  <div class="footer-inner">
    <div class="footer-logo">GUARDIAN EYE</div>
    <div class="footer-note">AI-Powered CCTV Anomaly Detection · MMIT Pune · Academic Project</div>
  </div>
</footer>

<script>
  function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showTech(id) {
    document.querySelectorAll('.tech-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tech-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tech-' + id).classList.add('active');
    event.target.classList.add('active');
  }

  function copyCode(btn) {
    const block = btn.parentElement;
    const text = block.innerText.replace('COPY\n', '').replace('COPIED!\n', '').trim();
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = 'COPIED!';
      btn.style.color = 'var(--accent3)';
      btn.style.borderColor = 'var(--accent3)';
      setTimeout(() => {
        btn.textContent = 'COPY';
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 2000);
    });
  }
</script>
</body>
</html>