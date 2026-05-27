/**
 * inject_portfolio_complete.cjs
 * 
 * Black & White monochrome portfolio injection.
 * All content driven by localStorage('portfolio_settings') set from /admin.
 * Uses marker comments to prevent duplicate injections.
 */
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, 'index.html');
let html = fs.readFileSync(HTML_PATH, 'utf8');

// Strip prior injections
html = html.replace(/<!-- PORTFOLIO_INJECT_HEAD_START -->[\s\S]*?<!-- PORTFOLIO_INJECT_HEAD_END -->\s*/g, '');
html = html.replace(/<!-- PORTFOLIO_INJECT_BODY_START -->[\s\S]*?<!-- PORTFOLIO_INJECT_BODY_END -->\s*/g, '');

// ═══════════════════════════════════════════════════════════════════════
// HEAD INJECTION
// ═══════════════════════════════════════════════════════════════════════
const headInject = `<!-- PORTFOLIO_INJECT_HEAD_START -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
/* ══════════════════════════════════════════════════════════════
   BLACK & WHITE MONOCHROME THEME VARIABLES
   ══════════════════════════════════════════════════════════════ */

:root {
  --bg-primary: #000000;
  --bg-primary-rgb: 0, 0, 0;
  --bg-secondary: #0a0a0a;
  --bg-card: #111111;
  --bg-card-hover: #161616;
  --bg-input: #0d0d0d;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-muted: #666666;
  --border: #1a1a1a;
  --border-hover: #333333;
  --accent: #ffffff;
  --accent-dim: #888888;
  --terminal-bg: #050505;
  --terminal-prompt: #ffffff;
  --terminal-text: #cccccc;
  --terminal-accent: #ffffff;
  --term-green: #00ff88;
  --term-cyan: #00e5ff;
  --term-yellow: #ffd600;
  --term-red: #ff4057;
  --term-magenta: #e040fb;
  --term-blue: #448aff;
  --term-orange: #ff9100;
  --term-dim: #555555;
  --term-white: #ffffff;
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-primary-rgb: 255, 255, 255;
  --bg-secondary: #f5f5f5;
  --bg-card: #fafafa;
  --bg-card-hover: #f0f0f0;
  --bg-input: #f5f5f5;
  --text-primary: #000000;
  --text-secondary: #555555;
  --text-muted: #999999;
  --border: #e5e5e5;
  --border-hover: #cccccc;
  --accent: #000000;
  --accent-dim: #666666;
  --terminal-bg: #0a0a0a;
  --terminal-prompt: #ffffff;
  --terminal-text: #cccccc;
  --terminal-accent: #ffffff;
}

/* ══ GLOBAL RESET & OVERRIDES ══ */
body {
  background-color: var(--bg-primary) !important;
  color: var(--text-primary) !important;
  margin: 0;
  padding: 0;
}

/* Hide Framer watermark but display the main container */
#__framer-badge-container, #framer-badge-container {
  display: none !important;
}

/* Hide original Framer tickers and dotted lines in '#main' */
[data-framer-name="Ticker"], [data-framer-name="Dotted Line"] {
  display: none !important;
}

/* Hide the custom monochrome hero section */
#pf-hero {
  display: none !important;
}

#portfolio-root { 
  font-family: 'Inter', -apple-system, sans-serif;
  background: var(--bg-primary); 
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding-top: 0px; /* Reset padding since we have full page main hero */
}
#portfolio-root *, #portfolio-root *::before, #portfolio-root *::after { box-sizing: border-box; }
.font-outfit { font-family: 'Outfit', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

/* ═══ SLEEK MONOCHROME DASHED LOOP TICKER ═══ */
#pf-custom-ticker {
  width: 100%;
  border-top: 1px dashed var(--border);
  border-bottom: 1px dashed var(--border);
  padding: 18px 0;
  background: var(--bg-primary);
  overflow: hidden;
  position: relative;
}
.ticker-wrap {
  width: 100%;
  overflow: hidden;
}
.ticker-items {
  display: inline-flex;
  white-space: nowrap;
  animation: ticker-loop 30s linear infinite;
  align-items: center;
}
.ticker-items span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-secondary);
  padding: 0 40px;
}
.ticker-items .ticker-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border-hover);
  padding: 0;
  display: inline-block;
  flex-shrink: 0;
}
@keyframes ticker-loop {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}

/* ══ STICKY NAVBAR ══ */
#pf-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background: rgba(var(--bg-primary-rgb), 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 9999;
  display: flex;
  align-items: center;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease;
}
/* Navbar is always visible over the hero and all sections */
.pf-nav-container {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pf-nav-logo {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-primary);
  text-decoration: none;
}
.pf-nav-links {
  display: flex;
  gap: 24px;
}
.pf-nav-links a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}
.pf-nav-links a:hover {
  color: var(--text-primary);
}
@media (max-width: 768px) {
  .pf-nav-container { padding: 0 20px; }
  .pf-nav-links { gap: 14px; }
  .pf-nav-links a { font-size: 9px; }
}

/* ══ SECTIONS ══ */
.pf-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 32px;
  scroll-margin-top: 64px; /* offset navbar */
}
@media (max-width: 768px) { .pf-section { padding: 48px 20px; } }

/* ══ DIVIDER ══ */
.pf-divider {
  width: 100%;
  height: 1px;
  background: var(--border);
  max-width: 1000px;
  margin: 0 auto;
}

/* ══ SECTION LABEL ══ */
.pf-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.pf-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

/* ══ BUTTONS ══ */
.pf-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-radius: 6px;
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.1em; cursor: pointer; border: none;
  transition: all 0.2s ease;
  text-decoration: none; font-family: 'Inter', sans-serif;
}
.pf-btn-white {
  background: var(--text-primary); color: var(--bg-primary);
}
.pf-btn-white:hover { opacity: 0.85; transform: translateY(-1px); }
.pf-btn-outline {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-primary);
}
.pf-btn-outline:hover {
  border-color: var(--text-primary);
  background: rgba(255,255,255,0.04);
}

/* ══ SKILL BARS ══ */
.pf-skill-track {
  width: 100%; height: 3px; border-radius: 99px;
  background: var(--border); overflow: hidden;
}
.pf-skill-fill {
  height: 100%; border-radius: 99px;
  background: var(--text-primary);
  transition: width 1s cubic-bezier(0.16,1,0.3,1);
}

/* ══ PROJECT CARDS ══ */
.pf-project {
  background: var(--card-bg) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid var(--card-border) !important;
  border-radius: 12px;
  padding: 28px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.pf-project:hover {
  background: var(--card-bg) !important;
  border-color: var(--card-border-hover) !important;
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}
.pf-tag {
  display: inline-block; padding: 3px 8px; border-radius: 4px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
  border: 1px solid var(--border); color: var(--text-secondary);
  margin: 0 4px 4px 0;
}

/* ══ TIMELINE ══ */
.pf-tl-item {
  position: relative; padding-left: 28px; padding-bottom: 24px;
  border-left: 1px solid var(--border);
}
.pf-tl-item:last-child { padding-bottom: 0; border-left-color: transparent; }
.pf-tl-item::before {
  content: ''; position: absolute; left: -4px; top: 32px;
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--text-primary); border: 2px solid var(--bg-primary);
  z-index: 10;
}

/* ══ TERMINAL ══ */
#sandbox-terminal {
  background: var(--terminal-bg);
  border: 1px solid var(--border);
  border-radius: 12px; overflow: hidden;
}
#term-bar {
  padding: 10px 16px; display: flex; align-items: center; gap: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
}
#term-bar .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
#term-out {
  padding: 16px 20px; min-height: 200px; max-height: 320px;
  overflow-y: auto; font-family: 'JetBrains Mono', monospace;
  font-size: 12px; line-height: 1.8; color: var(--terminal-text);
  white-space: pre-wrap; word-break: break-word;
}
#term-out .t-green { color: var(--term-green); }
#term-out .t-cyan { color: var(--term-cyan); }
#term-out .t-yellow { color: var(--term-yellow); }
#term-out .t-red { color: var(--term-red); }
#term-out .t-magenta { color: var(--term-magenta); }
#term-out .t-blue { color: var(--term-blue); }
#term-out .t-orange { color: var(--term-orange); }
#term-out .t-dim { color: var(--term-dim); }
#term-out .t-white { color: var(--term-white); font-weight: 700; }
#term-out .t-bold { font-weight: 700; }
#term-out::-webkit-scrollbar { width: 4px; }
#term-out::-webkit-scrollbar-track { background: transparent; }
#term-out::-webkit-scrollbar-thumb { background: #222; border-radius: 99px; }
#term-in-line {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-top: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.3);
}
#term-input {
  background: transparent; border: none; outline: none;
  color: #fff; font-family: 'JetBrains Mono', monospace;
  font-size: 12px; flex: 1; caret-color: var(--term-green);
}



/* ══ MATRIX ══ */
#matrix-cvs {
  position: fixed; top:0; left:0; width:100vw; height:100vh;
  z-index: 99999; pointer-events:none;
  opacity:0; transition: opacity 0.3s;
}
#matrix-cvs.on { opacity:1; }

/* ══ ADMIN LINK ══ */
.pf-admin-link {
  position: fixed; bottom: 24px; left: 24px; z-index: 9999;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.15em; color: var(--text-muted);
  text-decoration: none; opacity: 0.4;
  transition: opacity 0.2s;
}
.pf-admin-link:hover { opacity: 1; color: var(--text-primary); }

/* ══ RESPONSIVE ══ */
@media (max-width: 768px) {
  .pf-grid-2 { grid-template-columns: 1fr !important; }
  .pf-about-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
}

/* ═══ SCROLL PROGRESS & HIDE SCROLLBARS ═══ */
::-webkit-scrollbar {
  display: none !important;
}
html {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}
#pf-scroll-progress {
  position: fixed;
  right: 0;
  top: 0;
  width: 3px;
  height: 0%;
  background: var(--text-primary);
  z-index: 100000;
  pointer-events: none;
  opacity: 0.8;
  transition: height 0.05s linear;
}

/* ═══ GLASSMORPHISM CARDS ═══ */
:root {
  --card-bg: rgba(17, 17, 17, 0.45);
  --card-border: rgba(255, 255, 255, 0.08);
  --card-border-hover: rgba(255, 255, 255, 0.16);
}
[data-theme="light"] {
  --card-bg: rgba(250, 250, 250, 0.45);
  --card-border: rgba(0, 0, 0, 0.08);
  --card-border-hover: rgba(0, 0, 0, 0.16);
}
.pf-glass-card {
  background: var(--card-bg) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid var(--card-border) !important;
  border-radius: 12px;
  padding: 28px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.pf-glass-card:hover {
  border-color: var(--card-border-hover) !important;
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

/* ═══ CUSTOM MOUSE CURSOR ═══ */
body, a, button, input, select, textarea, [role="button"], .pf-btn, .pf-project, .pf-glass-card {
  cursor: none !important;
}
#pf-cursor-dot {
  width: 6px;
  height: 6px;
  background: #ffffff;
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  transform: translate3d(-50%, -50%, 0);
  pointer-events: none;
  z-index: 100001;
  mix-blend-mode: difference;
}
#pf-cursor-ring {
  width: 32px;
  height: 32px;
  border: 1.5px solid #ffffff;
  background: transparent;
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  transform: translate3d(-50%, -50%, 0);
  pointer-events: none;
  z-index: 100001;
  mix-blend-mode: difference;
  transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
              height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
              background-color 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
              border-color 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
              border-radius 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.pf-cursor-hover #pf-cursor-ring {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.8);
}
.pf-cursor-terminal #pf-cursor-ring {
  width: 12px;
  height: 20px;
  border-radius: 2px;
  background: #ffffff;
  border: none;
  animation: pf-cursor-blink 1s infinite step-end;
}
.pf-cursor-terminal #pf-cursor-dot {
  opacity: 0;
}
@keyframes pf-cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Touch Devices Override */
.pf-touch, .pf-touch * {
  cursor: auto !important;
}
.pf-touch #pf-cursor-dot, .pf-touch #pf-cursor-ring {
  display: none !important;
}

/* ═══ TERMINAL NAVBAR LINK MICRO-INTERACTION ═══ */
.pf-nav-terminal-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.pf-terminal-prompt-bg {
  position: absolute;
  left: -38px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--text-primary);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform: translateX(-6px);
  white-space: nowrap;
}
.pf-nav-terminal-wrapper:hover .pf-terminal-prompt-bg {
  opacity: 0.25;
  transform: translateX(0);
}

/* Hide original static wireframe */
#1u5oe39 {
  display: none !important;
}
[data-framer-name="Hero"] .framer-1u5oe39-container {
  display: none !important;
}

/* Dynamic Interactive Waves Canvas */
#pf-interactive-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  pointer-events: none;
  opacity: 0.65;
}

/* ═══ HERO BACKGROUND RUNNING TEXT ═══ */
/* Injected into Framer's native 'Background Content' layer (z-index:2, position:absolute inset:0) */
#main [data-framer-name="Background Content"] {
  z-index: 5 !important;
  pointer-events: none !important;
}
.pf-hero-bg-text-container {
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  flex-shrink: 0;
}
.pf-hero-bg-text {
  display: inline-block;
  font-family: 'Outfit', 'Averia Serif Libre', sans-serif;
  font-size: clamp(100px, 14vw, 200px);
  font-weight: 900;
  text-transform: uppercase;
  color: var(--text-primary);
  opacity: 0.08;
  letter-spacing: 0.05em;
  animation: hero-bg-loop 45s linear infinite;
  white-space: nowrap;
  line-height: 1;
  user-select: none;
  padding-bottom: 12px;
}
@keyframes hero-bg-loop {
  0% { transform: translate3d(-50%, 0, 0); }
  100% { transform: translate3d(0, 0, 0); }
}
</style>
<!-- PORTFOLIO_INJECT_HEAD_END -->`;

// ═══════════════════════════════════════════════════════════════════════
// BODY INJECTION
// ═══════════════════════════════════════════════════════════════════════
const bodyInject = `<!-- PORTFOLIO_INJECT_BODY_START -->

<nav id="pf-navbar">
  <div class="pf-nav-container">
    <a href="#main" class="pf-nav-logo font-outfit" id="pf-nav-logo">PORTFOLIO</a>
    <div class="pf-nav-links">
      <a href="#pf-about">About</a>
      <a href="#pf-projects-section">Projects</a>
      <a href="#pf-timeline-section">Experience</a>
      <a href="#pf-contact-section">Contact</a>
      <div class="pf-nav-terminal-wrapper">
        <span class="pf-terminal-prompt-bg">C:\\&gt;&nbsp;_</span>
        <a href="#pf-terminal-section" id="pf-nav-terminal-link">Terminal</a>
      </div>
    </div>
  </div>
</nav>


<a href="/admin/" class="pf-admin-link">⚙ Admin</a>
<canvas id="matrix-cvs"></canvas>
<div id="pf-scroll-progress"></div>
<div id="pf-cursor-dot"></div>
<div id="pf-cursor-ring"></div>

<div id="portfolio-root">

  <!-- Sleek dashed-line looping ticker -->
  <div id="pf-custom-ticker">
    <div class="ticker-wrap">
      <div class="ticker-items">
        <span>WebGL Simulation</span>
        <span class="ticker-dot"></span>
        <span>Embedded IoT Networks</span>
        <span class="ticker-dot"></span>
        <span>Creative Technologist</span>
        <span class="ticker-dot"></span>
        <span>Interactive Architectures</span>
        <span class="ticker-dot"></span>
        <span>WebGL Simulation</span>
        <span class="ticker-dot"></span>
        <span>Embedded IoT Networks</span>
        <span class="ticker-dot"></span>
        <span>Creative Technologist</span>
        <span class="ticker-dot"></span>
        <span>Interactive Architectures</span>
        <span class="ticker-dot"></span>
      </div>
    </div>
  </div>

  <!-- ═══ HERO ═══ -->
  <section id="pf-hero" class="pf-section" style="text-align:center; padding-top:140px; padding-bottom:60px;">
    <div class="pf-label" style="justify-content:center;">
      <span id="pf-subtitle"></span>
    </div>
    <h1 id="pf-name" class="font-outfit" style="font-size:clamp(3rem,8vw,6rem); font-weight:900; line-height:0.95; margin:0; letter-spacing:-0.03em;"></h1>
    <p id="pf-pitch" style="max-width:560px; margin:28px auto 0; font-size:14px; line-height:1.8; color:var(--text-secondary);"></p>
    <div style="display:flex; gap:10px; justify-content:center; margin-top:36px; flex-wrap:wrap;">
      <a id="pf-btn-github" href="#" target="_blank" class="pf-btn pf-btn-white">GitHub ↗</a>
      <a id="pf-btn-linkedin" href="#" target="_blank" class="pf-btn pf-btn-outline">LinkedIn</a>
      <a id="pf-btn-email" href="#" class="pf-btn pf-btn-outline">Contact</a>
    </div>
  </section>

  <div class="pf-divider"></div>

  <!-- ═══ ABOUT ═══ -->
  <section id="pf-about" class="pf-section">
    <div class="pf-label">About</div>
    <div class="pf-about-grid" style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:24px;">
      <div class="pf-glass-card">
        <p id="pf-bio1" style="font-size:14px; line-height:1.9; color:var(--text-secondary); margin:0 0 20px;"></p>
        <p id="pf-bio2" style="font-size:14px; line-height:1.9; color:var(--text-secondary); margin:0;"></p>
      </div>
      <div class="pf-glass-card" style="display:flex; flex-direction:column; gap:24px; justify-content:center;">
        <div>
          <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--text-secondary);">Frontend / WebGL</span>
            <span id="pf-s1v" class="font-mono" style="font-size:10px; font-weight:700;"></span>
          </div>
          <div class="pf-skill-track"><div id="pf-s1b" class="pf-skill-fill" style="width:0%"></div></div>
        </div>
        <div>
          <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--text-secondary);">Backend / Web3</span>
            <span id="pf-s2v" class="font-mono" style="font-size:10px; font-weight:700;"></span>
          </div>
          <div class="pf-skill-track"><div id="pf-s2b" class="pf-skill-fill" style="width:0%"></div></div>
        </div>
        <div>
          <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--text-secondary);">Hardware / IoT</span>
            <span id="pf-s3v" class="font-mono" style="font-size:10px; font-weight:700;"></span>
          </div>
          <div class="pf-skill-track"><div id="pf-s3b" class="pf-skill-fill" style="width:0%"></div></div>
        </div>
      </div>
    </div>
  </section>

  <div class="pf-divider"></div>

  <!-- ═══ PROJECTS ═══ -->
  <section id="pf-projects-section" class="pf-section">
    <div class="pf-label">Projects</div>
    <div id="pf-projects" class="pf-grid-2" style="display:grid; grid-template-columns:repeat(2,1fr); gap:20px;"></div>
  </section>

  <div class="pf-divider"></div>

  <!-- ═══ EXPERIENCE ═══ -->
  <section id="pf-timeline-section" class="pf-section">
    <div class="pf-label">Experience</div>
    <div id="pf-timeline"></div>
  </section>

  <div class="pf-divider"></div>

  <!-- ═══ CONTACT ═══ -->
  <section id="pf-contact-section" class="pf-section" style="text-align:center;">
    <div class="pf-label" style="justify-content:center;"><span>Contact</span></div>
    <p style="font-size:14px; color:var(--text-secondary); margin:0 0 28px;">Get in touch for collaborations or just to say hello.</p>
    <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
      <a id="pf-c-email" href="#" class="pf-btn pf-btn-white">✉ Email</a>
      <a id="pf-c-github" href="#" target="_blank" class="pf-btn pf-btn-outline">GitHub</a>
      <a id="pf-c-linkedin" href="#" target="_blank" class="pf-btn pf-btn-outline">LinkedIn</a>
    </div>
  </section>

  <div class="pf-divider"></div>

  <!-- ═══ TERMINAL ═══ -->
  <section id="pf-terminal-section" class="pf-section" style="padding-bottom:120px;">
    <div class="pf-label">Terminal</div>
    <p style="font-size:12px; color:var(--text-muted); margin:0 0 20px;">Interactive shell — type <span class="font-mono" style="color:var(--text-primary);">help</span> for commands</p>
    <div id="sandbox-terminal">
      <div id="term-bar">
        <span class="dot" style="background:#ff5f56;"></span>
        <span class="dot" style="background:#ffbd2e;"></span>
        <span class="dot" style="background:#27c93f;"></span>
        <span id="pf-term-header-title" class="font-mono" style="font-size:10px; color:var(--text-muted); margin-left:8px;">TERMINAL</span>
      </div>
      <div id="term-out"></div>
      <div id="term-in-line">
        <span class="font-mono" style="color:var(--term-green); font-size:12px; font-weight:700; user-select:none;">❯</span>
        <input type="text" id="term-input" placeholder="Type a command..." autocomplete="off" spellcheck="false" />
      </div>
    </div>
  </section>

  <!-- ═══ FOOTER ═══ -->
  <footer style="text-align:center; padding:32px 20px 48px; border-top:1px solid var(--border);">
    <p class="font-mono" style="font-size:10px; color:var(--text-muted); letter-spacing:0.08em;">
      Built by <span id="pf-footer" style="color:var(--text-primary);"></span> · 2026
    </p>
  </footer>
</div>

<script>
(function(){
  'use strict';

  /* ═══ DEFAULTS (mirrors admin/index.html) ═══ */
  var DEF = {
    name: "UDIT PRATAP",
    title: "Creative Technologist / UI & IoT Engineer",
    heroBgText: "WEBGL SIMULATION // EMBEDDED IOT NETWORKS // CREATIVE TECHNOLOGIST // INTERACTIVE ARCHITECTURES",
    pitch: "Developing high-fidelity interactive architectures, custom canvas WebGL simulations, and robust embedded IoT networks where low-level engineering meets visual high art.",
    bio1: "My engineering philosophy bridges two worlds: visual design excellence and low-level hardware-software performance. I thrive on bringing complex visual animations to life with spring physics and fluid math, and building responsive, low-latency applications that respond instantly to touch, gesture, and telemetry streams.",
    bio2: "Whether orchestrating thousands of active nodes inside an interactive outline canvas editor, mapping out real-time telemetry streams over MQTT/WebSockets, or soldering customized ESP32 microcontrollers to automate physical space nodes, I am driven by the pursuit of bulletproof, pixel-perfect, and ultra-high performance user environments.",
    skill1: "92", skill2: "84", skill3: "89",
    email: "iamudt19@gmail.com",
    github: "https://github.com/Iamudt19",
    linkedin: "https://linkedin.com",
    projects: [
      {prefix:"/01 · EDITOR TOOLBOX",title:"Chaptr",desc:"A premium collaborative markdown editor and screenplay outline sandbox facilitating structured creative drafts without distractions.",tags:"React, Next.js, Slate.js, Tailwind",img:"",codeLink:"https://github.com/Iamudt19/Chaptr",demoLink:"https://github.com/Iamudt19/Chaptr"},
      {prefix:"/02 · AGENT ORCHESTRATION",title:"Antigravity AI",desc:"An agentic workspace visualization dashboard orchestrating background nodes, running parallel sandboxed developer tasks, and tracking multi-agent pipelines.",tags:"Node.js, WebSockets, Tailwind, Docker",img:"",codeLink:"",demoLink:""},
      {prefix:"/03 · LOW-LATENCY GRAPHICS",title:"Chronos Timeline",desc:"Low-latency audio waveform scheduler and frame sequencer. Supports custom envelope nodes, high-frequency render triggers, and real-time interactive canvas controls.",tags:"TypeScript, Canvas API, Web Audio",img:"",codeLink:"",demoLink:""},
      {prefix:"/04 · CYBER-PHYSICAL SYSTEM",title:"Aether IoT Node",desc:"Futuristic real-time MQTT dashboard for embedded sensor clusters. Automatically plots ambient data curves, tracks hardware state buffers, and sends fast relay control pulses.",tags:"C/C++ (ESP32), MQTT, WebSockets, Canvas API",img:"",codeLink:"",demoLink:""}
    ],
    timeline: [
      {period:"2025 - PRESENT",title:"Lead Interactive Engineer",company:"Chaptr outline editor",color:"#ffffff",bullets:"Architected optimized canvas viewport rendering queues, elevating editor speeds by 40%.\\nPioneered flexible CSS theme variables for absolute obsidian-level modes."},
      {period:"2024 - 2025",title:"WebGL & Creative Technologist",company:"Self-Employed / Freelance",color:"#888888",bullets:"Built dynamic landing pages integrating custom responsive shaders, fluid masks, and spring physics.\\nDesigned high-frequency telemetry visualizer feeds using sub-15ms WebSockets channels."},
      {period:"2023 - 2024",title:"Embedded Systems IoT Winner",company:"SmartLabs Hackathon Node",color:"#555555",bullets:"Designed and soldered low-level ESP32 microcontrollers configured with secure MQTT telemetry channels.\\nDeployed an ultra-low energy environmental sensor array, maintaining 99.9% telemetry stream uptime."}
    ]
  };

  function load() {
    try { var r = localStorage.getItem('portfolio_settings'); if(r) return JSON.parse(r); } catch(e){}
    return DEF;
  }

  /* ═══ RENDER ═══ */
  function render() {
    var d = load();
    var $ = function(id){ return document.getElementById(id); };

    // Hero & Footer
    $('pf-subtitle').textContent = d.title || DEF.title;
    $('pf-name').textContent = d.name || DEF.name;
    $('pf-pitch').textContent = d.pitch || DEF.pitch;
    $('pf-btn-github').href = d.github || DEF.github;
    $('pf-btn-linkedin').href = d.linkedin || DEF.linkedin;
    $('pf-btn-email').href = 'mailto:' + (d.email || DEF.email);
    $('pf-footer').textContent = d.name || DEF.name;

    // Navbar
    $('pf-nav-logo').textContent = d.name || DEF.name;

    // Terminal header dynamic title
    var shortName = (d.name || DEF.name).toUpperCase().replace(/\\s+/g, '_');
    $('pf-term-header-title').textContent = shortName + '_TERMINAL_V1.2';

    // About
    $('pf-bio1').textContent = d.bio1 || DEF.bio1;
    $('pf-bio2').textContent = d.bio2 || DEF.bio2;

    // Skills
    var s1 = d.skill1 || DEF.skill1, s2 = d.skill2 || DEF.skill2, s3 = d.skill3 || DEF.skill3;
    $('pf-s1v').textContent = s1 + '%';
    $('pf-s2v').textContent = s2 + '%';
    $('pf-s3v').textContent = s3 + '%';
    setTimeout(function(){
      $('pf-s1b').style.width = s1 + '%';
      $('pf-s2b').style.width = s2 + '%';
      $('pf-s3b').style.width = s3 + '%';
    }, 200);

    // Contact
    $('pf-c-email').href = 'mailto:' + (d.email || DEF.email);
    $('pf-c-email').textContent = '✉ ' + (d.email || DEF.email);
    $('pf-c-github').href = d.github || DEF.github;
    $('pf-c-linkedin').href = d.linkedin || DEF.linkedin;

    // Projects
    var pg = $('pf-projects'); pg.innerHTML = '';
    var projs = d.projects && d.projects.length ? d.projects : DEF.projects;
    projs.forEach(function(p){
      var c = document.createElement('div'); c.className = 'pf-project';
      var links = '';
      if(p.codeLink && p.codeLink !== '#') links += '<a href="'+p.codeLink+'" target="_blank" class="pf-btn pf-btn-outline" style="padding:7px 14px;font-size:10px;">Code ↗</a>';
      if(p.demoLink && p.demoLink !== '#') links += '<a href="'+p.demoLink+'" target="_blank" class="pf-btn pf-btn-white" style="padding:7px 14px;font-size:10px;">Demo ↗</a>';
      var tags = (p.tags||'').split(',').filter(function(t){return t.trim();}).map(function(t){return '<span class="pf-tag">'+t.trim()+'</span>';}).join('');
      c.innerHTML =
        '<p class="font-mono" style="font-size:9px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.15em;margin:0 0 10px;">'+(p.prefix||'')+'</p>'+
        '<h3 class="font-outfit" style="font-size:22px;font-weight:800;margin:0 0 10px;color:var(--text-primary);">'+p.title+'</h3>'+
        '<p style="font-size:13px;line-height:1.7;color:var(--text-secondary);margin:0 0 14px;">'+(p.desc||'')+'</p>'+
        '<div style="margin-bottom:14px;">'+tags+'</div>'+
        '<div style="display:flex;gap:8px;">'+links+'</div>';
      pg.appendChild(c);
    });

    // Timeline
    var tl = $('pf-timeline'); tl.innerHTML = '';
    var items = d.timeline && d.timeline.length ? d.timeline : DEF.timeline;
    items.forEach(function(t){
      var el = document.createElement('div'); el.className = 'pf-tl-item';
      var bul = (t.bullets||'').split('\\n').filter(function(b){return b.trim();}).map(function(b){return '<li style="font-size:13px;line-height:1.7;color:var(--text-secondary);margin-bottom:4px;">'+b.trim()+'</li>';}).join('');
      el.innerHTML =
        '<div class="pf-glass-card" style="margin-left:12px; padding:22px 28px;">'+
        '  <span class="font-mono" style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.12em;">'+(t.period||'')+'</span>'+
        '  <h4 class="font-outfit" style="font-size:17px;font-weight:800;margin:6px 0 2px;color:var(--text-primary);"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;background:'+(t.color||'#fff')+'"></span>'+t.title+'</h4>'+
        '  <p style="font-size:12px;color:var(--text-muted);margin:0 0 10px;">'+(t.company||'')+'</p>'+
        '  <ul style="padding-left:16px;margin:0;">'+bul+'</ul>'+
        '</div>';
      tl.appendChild(el);
    });
  }

  /* ═══ THEME ═══ */
  function initTheme(){
    var saved = localStorage.getItem('portfolio_theme');
    if(saved === 'light'){
      document.documentElement.setAttribute('data-theme','light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function initTerminal(){
    var out = document.getElementById('term-out');
    var inp = document.getElementById('term-input');
    if(!out || !inp) return;

    var hist = [], hIdx = -1;
    var d = load();

    function pr(h){ out.innerHTML += h + '\\n'; out.scrollTop = out.scrollHeight; }
    /* Color helpers using CSS classes */
    function c(text, cls){ return '<span class="'+cls+'">'+text+'</span>'; }
    function ln(t, cls){ pr(c(t, cls || 't-dim')); }

    var shortName = (d.name || DEF.name).toUpperCase().replace(/\\s+/g, '_');
    pr(c('┌──────────────────────────────────────┐', 't-dim'));
    pr(c('│ ', 't-dim') + c(shortName + '_TERMINAL', 't-green t-bold') + c(' v1.2', 't-cyan') + c(Array(Math.max(1, 35 - shortName.length - 14)).join(' ') + '│', 't-dim'));
    pr(c('└──────────────────────────────────────┘', 't-dim'));
    pr(c('  Interactive shell ready. Type ', 't-dim') + c('help', 't-yellow') + c(' for commands.', 't-dim'));
    pr('');

    var cmds = {
      help: function(){
        pr(c('  Available commands:', 't-cyan t-bold'));
        pr('');
        pr('  ' + c('help', 't-yellow') + c('       show this list', 't-dim'));
        pr('  ' + c('about', 't-yellow') + c('      who am I', 't-dim'));
        pr('  ' + c('skills', 't-yellow') + c('     tech stack', 't-dim'));
        pr('  ' + c('projects', 't-yellow') + c('   featured work', 't-dim'));
        pr('  ' + c('contact', 't-yellow') + c('    email / github / linkedin', 't-dim'));
        pr('  ' + c('whoami', 't-yellow') + c('     identity tagline', 't-dim'));
        pr('  ' + c('resume', 't-yellow') + c('     download link', 't-dim'));
        pr('  ' + c('matrix', 't-magenta') + c('     easter egg 🐰', 't-dim'));
        pr('  ' + c('theme', 't-yellow') + c('      toggle dark/light', 't-dim'));
        pr('  ' + c('clear', 't-yellow') + c('      clear output', 't-dim'));
        pr('');
      },
      about: function(){
        pr(c('  ┌─ ABOUT ─────────────────────────────', 't-dim'));
        pr(c('  │', 't-dim'));
        pr(c('  │ ', 't-dim') + c(d.name||DEF.name, 't-green t-bold'));
        pr(c('  │ ', 't-dim') + c(d.title||DEF.title, 't-cyan'));
        pr(c('  │', 't-dim'));
        pr(c('  │ ', 't-dim') + c((d.bio1||DEF.bio1).substring(0,120)+'...', 't-dim'));
        pr(c('  │', 't-dim'));
        pr(c('  └─────────────────────────────────────', 't-dim'));
      },
      skills: function(){
        pr(c('  ┌─ SKILLS ────────────────────────────', 't-dim'));
        var s1=d.skill1||DEF.skill1, s2=d.skill2||DEF.skill2, s3=d.skill3||DEF.skill3;
        function bar(label,val,color){
          var filled = Math.round(val/5);
          var empty = 20 - filled;
          var barStr = Array(filled+1).join('█') + Array(empty+1).join('░');
          pr(c('  │ ', 't-dim') + c(label, 't-white') + c(' ' + barStr + ' ', color) + c(val+'%', 't-white'));
        }
        bar('Frontend / WebGL ', s1, 't-green');
        bar('Backend / Web3   ', s2, 't-cyan');
        bar('Hardware / IoT   ', s3, 't-orange');
        pr(c('  └─────────────────────────────────────', 't-dim'));
      },
      projects: function(){
        pr(c('  ┌─ PROJECTS ──────────────────────────', 't-dim'));
        var projs = d.projects || DEF.projects;
        projs.forEach(function(p,i){
          pr(c('  │', 't-dim'));
          pr(c('  │ ', 't-dim') + c('[' + (i+1) + '] ', 't-yellow') + c(p.title, 't-green t-bold'));
          pr(c('  │     ', 't-dim') + c((p.desc||'').substring(0,85), 't-dim'));
          if(p.codeLink && p.codeLink!=='#') pr(c('  │     ', 't-dim') + c('⮡ code: ', 't-cyan') + c(p.codeLink, 't-blue'));
          if(p.demoLink && p.demoLink!=='#') pr(c('  │     ', 't-dim') + c('⮡ demo: ', 't-cyan') + c(p.demoLink, 't-blue'));
        });
        pr(c('  │', 't-dim'));
        pr(c('  └─────────────────────────────────────', 't-dim'));
      },
      contact: function(){
        pr(c('  ┌─ CONTACT ───────────────────────────', 't-dim'));
        pr(c('  │', 't-dim'));
        pr(c('  │ ', 't-dim') + c('✉  email    ', 't-yellow') + c(d.email||DEF.email, 't-green'));
        pr(c('  │ ', 't-dim') + c('⚡ github   ', 't-yellow') + c(d.github||DEF.github, 't-cyan'));
        pr(c('  │ ', 't-dim') + c('🔗 linkedin ', 't-yellow') + c(d.linkedin||DEF.linkedin, 't-blue'));
        pr(c('  │', 't-dim'));
        pr(c('  └─────────────────────────────────────', 't-dim'));
      },
      whoami: function(){
        pr(c('  ' + (d.name||DEF.name), 't-green t-bold') + c(' — ', 't-dim') + c(d.title||DEF.title, 't-cyan'));
      },
      resume: function(){
        pr(c('  ⚠ ', 't-yellow') + c('Resume URL not configured. Set it in the ', 't-dim') + c('admin panel', 't-cyan') + c('.', 't-dim'));
      },
      theme: function(){
        var isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if(isLight){
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('portfolio_theme','dark');
          pr(c('  ✓ ', 't-green') + c('Switched to ', 't-white') + c('dark mode', 't-cyan'));
        } else {
          document.documentElement.setAttribute('data-theme','light');
          localStorage.setItem('portfolio_theme','light');
          pr(c('  ✓ ', 't-green') + c('Switched to ', 't-white') + c('light mode', 't-cyan'));
        }
      },
      matrix: function(){
        pr(c('  ⚡ Initiating matrix rain...', 't-magenta'));
        matrixRain();
      },
      clear: function(){ out.innerHTML = ''; }
    };

    inp.addEventListener('keydown', function(e){
      if(e.key==='Enter'){
        var raw = inp.value.trim(); inp.value='';
        if(!raw) return;
        hist.unshift(raw); hIdx = -1;
        pr(c('❯ ', 't-green t-bold') + c(raw, 't-white'));
        var cmd = raw.toLowerCase().split(' ')[0];
        if(cmds[cmd]) cmds[cmd]();
        else pr(c('  ✗ ', 't-red') + c('command not found: ', 't-dim') + c(cmd, 't-red') + c('. type ', 't-dim') + c('help', 't-yellow'));
      } else if(e.key==='ArrowUp'){
        e.preventDefault();
        if(hIdx < hist.length-1){ hIdx++; inp.value=hist[hIdx]; }
      } else if(e.key==='ArrowDown'){
        e.preventDefault();
        if(hIdx>0){ hIdx--; inp.value=hist[hIdx]; } else { hIdx=-1; inp.value=''; }
      } else if(e.key==='Tab'){
        e.preventDefault();
        var p = inp.value.toLowerCase();
        var m = Object.keys(cmds).filter(function(c2){return c2.startsWith(p);});
        if(m.length===1) inp.value=m[0];
        else if(m.length>1) pr(c('  '+m.join('  '), 't-dim'));
      }
    });
  }

  /* ═══ MATRIX RAIN ═══ */
  function matrixRain(){
    var cvs = document.getElementById('matrix-cvs');
    if(!cvs) return;
    var ctx = cvs.getContext('2d');
    cvs.width = window.innerWidth; cvs.height = window.innerHeight;
    cvs.classList.add('on');
    var cols = Math.floor(cvs.width/14), drops = [];
    for(var i=0;i<cols;i++) drops[i]=1;
    var chars = '01アイウエオカキクケコ';
    var frames = 0;
    function draw(){
      ctx.fillStyle='rgba(0,0,0,0.05)'; ctx.fillRect(0,0,cvs.width,cvs.height);
      ctx.font='12px monospace';
      for(var i=0;i<drops.length;i++){
        /* Green gradient: bright head, dimmer trail */
        var headY = drops[i]*14;
        ctx.fillStyle='#00ff88';
        var ch=chars[Math.floor(Math.random()*chars.length)];
        ctx.fillText(ch,i*14,headY);
        /* Dim previous character */
        if(drops[i]>1){
          ctx.fillStyle='rgba(0,255,136,0.4)';
          var ch2=chars[Math.floor(Math.random()*chars.length)];
          ctx.fillText(ch2,i*14,headY-14);
        }
        if(drops[i]*14>cvs.height && Math.random()>0.975) drops[i]=0;
        drops[i]++;
      }
      frames++;
      if(frames<200) requestAnimationFrame(draw);
      else { cvs.classList.remove('on'); ctx.clearRect(0,0,cvs.width,cvs.height); }
    }
    draw();
  }

  /* ═══ SMOOTH SCROLL FOR NAVBAR LINKS ═══ */
  function initSmoothScroll(){
    document.querySelectorAll('#pf-navbar a').forEach(function(anchor){
      anchor.addEventListener('click', function(e){
        var targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
          e.preventDefault();
          var el = document.querySelector(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  /* ═══ HERO BACKGROUND RUNNING TEXT ═══ */
  function initHeroBgText(){
    var d = load();
    var text = (d.heroBgText || DEF.heroBgText).toUpperCase();
    /* Repeat text 4x so the 50% translate loops are seamless at any viewport */
    var repeatedText = text + '   ·   ' + text + '   ·   ' + text + '   ·   ' + text + '   ·   ';

    function injectBgText(){
      /* Target Framer's native 'Background Content' div — it is already:
         position: absolute; inset: 0; z-index: 2; display: flex; align-items: center
         This sits correctly between the bg image (z1) and the WebGL canvas (z3) */
      var bgLayer = document.querySelector('#main [data-framer-name="Background Content"]');
      if(!bgLayer) return false;
      /* Only inject once */
      if(document.getElementById('pf-hero-bg-text-el')) return true;

      /* Wipe any existing Framer ticker DOM so our text is the only content */
      bgLayer.innerHTML = '';

      var container = document.createElement('div');
      container.className = 'pf-hero-bg-text-container';
      container.id = 'pf-hero-bg-text-el';

      var textEl = document.createElement('div');
      textEl.className = 'pf-hero-bg-text';
      textEl.textContent = repeatedText;

      container.appendChild(textEl);
      bgLayer.appendChild(container);
      return true;
    }

    /* Try immediately; Framer SSR may have already painted the Background Content div */
    if(!injectBgText()){
      var observer = new MutationObserver(function(){
        if(injectBgText()) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(function(){ observer.disconnect(); }, 15000);
    }
  }

  /* ═══ SCROLL PROGRESS ═══ */
  function initScrollProgress(){
    var bar = document.getElementById('pf-scroll-progress');
    if(!bar) return;
    function update() {
      var h = document.documentElement;
      var sh = h.scrollHeight || document.body.scrollHeight;
      var st = h.scrollTop || document.body.scrollTop;
      var ch = h.clientHeight;
      var pct = (st / (sh - ch)) * 100;
      bar.style.height = Math.max(0, Math.min(100, pct)) + '%';
    }
    window.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    update();
  }

  /* ═══ CUSTOM MOUSE CURSOR ═══ */
  function initCustomCursor(){
    var dot = document.getElementById('pf-cursor-dot');
    var ring = document.getElementById('pf-cursor-ring');
    if(!dot || !ring) return;

    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      document.body.classList.add('pf-touch');
      return;
    }

    var mx = 0, my = 0;
    var rx = 0, ry = 0;

    window.addEventListener('mousemove', function(e){
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px, ' + my + 'px, 0) translate3d(-50%, -50%, 0)';
    });

    function loop() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = 'translate3d(' + rx + 'px, ' + ry + 'px, 0) translate3d(-50%, -50%, 0)';
      requestAnimationFrame(loop);
    }
    loop();

    var hovers = 'a, button, .pf-btn, .pf-project, .pf-glass-card, #sandbox-terminal, input, textarea';
    
    function addHoverListeners() {
      document.querySelectorAll(hovers).forEach(function(el){
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = 'true';

        el.addEventListener('mouseenter', function(){
          document.body.classList.add('pf-cursor-hover');
        });
        el.addEventListener('mouseleave', function(){
          document.body.classList.remove('pf-cursor-hover');
        });
      });

      var termLink = document.getElementById('pf-nav-terminal-link');
      if (termLink && !termLink.dataset.termCursorBound) {
        termLink.dataset.termCursorBound = 'true';
        termLink.addEventListener('mouseenter', function(){
          document.body.classList.add('pf-cursor-terminal');
        });
        termLink.addEventListener('mouseleave', function(){
          document.body.classList.remove('pf-cursor-terminal');
        });
      }
    }

    addHoverListeners();
    var observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ═══ INTERACTIVE TOPOGRAPHIC WAVES CANVAS ═══ */
  function initInteractiveCanvas(){
    var bgLayer = document.querySelector('#main [data-framer-name="Background Content"]');
    if(!bgLayer) {
      var obs = new MutationObserver(function(){
        var layer = document.querySelector('#main [data-framer-name="Background Content"]');
        if (layer) {
          obs.disconnect();
          setupCanvas(layer);
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
      setTimeout(function(){ obs.disconnect(); }, 15000);
      return;
    }
    setupCanvas(bgLayer);

    function setupCanvas(container) {
      if (document.getElementById('pf-interactive-canvas')) return;

      var canvas = document.createElement('canvas');
      canvas.id = 'pf-interactive-canvas';
      container.insertBefore(canvas, container.firstChild);

      var ctx = canvas.getContext('2d');
      var width = canvas.width = container.clientWidth || window.innerWidth;
      var height = canvas.height = container.clientHeight || window.innerHeight;

      function resize() {
        width = canvas.width = container.clientWidth || window.innerWidth;
        height = canvas.height = container.clientHeight || window.innerHeight;
      }
      window.addEventListener('resize', resize);

      var mx = -1000, my = -1000;

      window.addEventListener('mousemove', function(e){
        var rect = canvas.getBoundingClientRect();
        mx = e.clientX - rect.left;
        my = e.clientY - rect.top;
      });

      window.addEventListener('mouseleave', function(){
        mx = -1000;
        my = -1000;
      });

      var lineCount = 10;
      var pointsPerLine = 15;
      var lines = [];

      for(var i = 0; i < lineCount; i++) {
        var points = [];
        var yBase = (height / (lineCount + 1)) * (i + 1);
        for(var j = 0; j < pointsPerLine; j++) {
          var x = (width / (pointsPerLine - 1)) * j;
          points.push({
            x: x, y: yBase, ox: x, oy: yBase, vx: 0, vy: 0
          });
        }
        lines.push({
          points: points,
          speed: 0.001 + (i * 0.0003),
          amplitude: 15 + (i * 3.5),
          phase: i * Math.PI / 4
        });
      }

      var time = 0;
      function animate() {
        time += 1;
        ctx.clearRect(0, 0, width, height);

        var textPrimary = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
        ctx.strokeStyle = textPrimary === '#000000' || textPrimary === 'rgb(0, 0, 0)' || textPrimary === 'black'
          ? 'rgba(0, 0, 0, 0.06)' 
          : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.2;

        for(var i = 0; i < lines.length; i++) {
          var line = lines[i];
          var pts = line.points;

          ctx.beginPath();
          for(var j = 0; j < pts.length; j++) {
            var pt = pts[j];
            var waveY = pt.oy + Math.sin(time * line.speed + (pt.ox * 0.003) + line.phase) * line.amplitude;

            var dx = mx - pt.x;
            var dy = my - waveY;
            var dist = Math.sqrt(dx*dx + dy*dy);
            var tx = pt.ox;
            var ty = waveY;

            if (dist < 250) {
              var force = (250 - dist) / 250;
              var angle = Math.atan2(dy, dx);
              tx = pt.ox - Math.cos(angle) * force * 70;
              ty = waveY - Math.sin(angle) * force * 50;
            }

            var tension = 0.08;
            var damping = 0.85;

            var ax = (tx - pt.x) * tension;
            var ay = (ty - pt.y) * tension;

            pt.vx = (pt.vx + ax) * damping;
            pt.vy = (pt.vy + ay) * damping;

            pt.x += pt.vx;
            pt.y += pt.vy;

            if (j === 0) {
              ctx.moveTo(pt.x, pt.y);
            } else {
              var prev = pts[j - 1];
              var cx = (prev.x + pt.x) / 2;
              var cy = (prev.y + pt.y) / 2;
              ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
            }
          }
          var last = pts[pts.length - 1];
          ctx.lineTo(last.x, last.y);
          ctx.stroke();
        }

        requestAnimationFrame(animate);
      }

      animate();
    }
  }

  /* ═══ INIT ═══ */
  document.addEventListener('DOMContentLoaded', function(){
    render();
    initTheme();
    initTerminal();
    initSmoothScroll();
    initHeroBgText();
    initScrollProgress();
    initCustomCursor();
    initInteractiveCanvas();
  });
</script>
<!-- PORTFOLIO_INJECT_BODY_END -->`;

// ═══════════════════════════════════════════════════════════════════════
// INJECT INTO HTML
// ═══════════════════════════════════════════════════════════════════════
html = html.replace('</head>', headInject + '\n</head>');

if (html.includes('</body>')) {
  // Find last </body>
  const idx = html.lastIndexOf('</body>');
  html = html.substring(0, idx) + bodyInject + '\n</body>' + html.substring(idx + 7);
} else {
  html = html.replace('</html>', bodyInject + '\n</html>');
}

fs.writeFileSync(HTML_PATH, html, 'utf8');
console.log('Done. Size:', html.length, 'bytes');
console.log('HEAD marker:', html.includes('PORTFOLIO_INJECT_HEAD_START'));
console.log('BODY marker:', html.includes('PORTFOLIO_INJECT_BODY_START'));
