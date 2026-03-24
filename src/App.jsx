import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// THE DISCIPLINED TRADER — A Serene Trading Journal
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEYS = {
  PRE_MARKET: 'disciplined_trader_premarket',
  POST_MARKET: 'disciplined_trader_postmarket'
};

const loadData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  :root {
    --ocean-1: #E3F6FC;
    --ocean-2: #C5EDF8;
    --ocean-3: #9EE2F5;
    --ocean-4: #75D4EF;
    --ocean-5: #4AC5E8;
    --ocean-deep: #2AA8D0;
    --white: #FFFFFF;
    --white-90: rgba(255, 255, 255, 0.9);
    --white-80: rgba(255, 255, 255, 0.8);
    --white-60: rgba(255, 255, 255, 0.6);
    --text-dark: #1E3A45;
    --text-mid: #4A7080;
    --text-light: #8AABB8;
    --text-muted: #B5CED8;
    --green: #4ECBA0;
    --green-soft: rgba(78, 203, 160, 0.15);
    --yellow: #F5B74E;
    --yellow-soft: rgba(245, 183, 78, 0.15);
    --red: #EF7B6C;
    --red-soft: rgba(239, 123, 108, 0.15);
    --shadow-soft: 0 8px 40px rgba(42, 168, 208, 0.12);
    --shadow-medium: 0 12px 50px rgba(42, 168, 208, 0.18);
  }

  html {
    font-family: 'Quicksand', 'Noto Sans TC', -apple-system, sans-serif;
    background: linear-gradient(165deg, 
      var(--ocean-1) 0%, 
      var(--ocean-2) 20%, 
      var(--ocean-3) 45%, 
      var(--ocean-4) 70%, 
      var(--ocean-5) 100%);
    background-attachment: fixed;
    min-height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  body {
    font-family: inherit;
    min-height: 100%;
    overflow-x: hidden;
    overflow-y: visible;
    -webkit-overflow-scrolling: touch;
  }

  #root {
    min-height: 100vh;
    overflow: visible;
  }

  .water-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .water-bg::before,
  .water-bg::after {
    content: '';
    position: absolute;
    border-radius: 45%;
    background: rgba(255, 255, 255, 0.05);
    animation: ripple 20s linear infinite;
  }

  .water-bg::before { width: 200%; height: 200%; top: -50%; left: -50%; animation-duration: 25s; }
  .water-bg::after { width: 180%; height: 180%; top: -40%; left: -40%; animation-duration: 30s; animation-direction: reverse; }

  @keyframes ripple {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .light-rays {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(ellipse at 30% -20%, rgba(255,255,255,0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 10%, rgba(255,255,255,0.18) 0%, transparent 40%);
  }

  .app {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-bottom: 140px;
  }

  .page {
    flex: 1;
    max-width: 420px;
    margin: 0 auto;
    padding: 20px 20px 24px;
    width: 100%;
    animation: fadeInUp 0.4s ease-out;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .header { text-align: center; padding: 16px 0 24px; }
  .header-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-light); margin-bottom: 8px; }
  .header-title { font-size: 26px; font-weight: 700; color: var(--text-dark); letter-spacing: -0.5px; margin-bottom: 6px; }
  .header-date { font-size: 14px; color: var(--text-light); font-weight: 500; }

  .card {
    background: var(--white-90);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 22px;
    margin-bottom: 14px;
    box-shadow: var(--shadow-soft);
    border: 1px solid var(--white-80);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card-title { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-light); margin-bottom: 16px; }
  .form-group { margin-bottom: 18px; }
  .form-group:last-child { margin-bottom: 0; }
  .form-label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-light); margin-bottom: 10px; }

  .form-input, .form-select, .form-textarea {
    width: 100%; padding: 14px 16px; font-size: 15px; font-family: inherit; font-weight: 500;
    color: var(--text-dark); background: var(--white); border: 2px solid transparent; border-radius: 14px;
    outline: none; transition: all 0.25s ease; box-shadow: 0 2px 12px rgba(42, 168, 208, 0.06);
  }

  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--ocean-4); box-shadow: 0 4px 20px rgba(74, 197, 232, 0.15); }
  .form-textarea { resize: none; min-height: 90px; line-height: 1.6; }
  .form-select {
    cursor: pointer; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238AABB8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center; background-size: 18px; padding-right: 42px;
  }

  .toggle-group { display: flex; align-items: center; gap: 14px; padding: 12px 0; }
  .toggle { position: relative; width: 52px; height: 30px; background: var(--text-muted); border-radius: 15px; cursor: pointer; transition: all 0.3s ease; flex-shrink: 0; }
  .toggle.active { background: linear-gradient(135deg, var(--ocean-5), var(--green)); }
  .toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; background: var(--white); border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .toggle.active::after { transform: translateX(22px); }
  .toggle-label { font-size: 14px; font-weight: 500; color: var(--text-dark); line-height: 1.4; }

  .slider-container { padding: 8px 0; }
  .slider-track { position: relative; height: 8px; background: rgba(42, 168, 208, 0.15); border-radius: 4px; margin: 16px 0; cursor: pointer; }
  .slider-fill { position: absolute; left: 0; top: 0; height: 100%; border-radius: 4px; transition: width 0.15s ease; }
  .slider-thumb { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 26px; height: 26px; background: var(--white); border-radius: 50%; box-shadow: 0 2px 12px rgba(42, 168, 208, 0.3); cursor: grab; transition: box-shadow 0.2s ease; }
  .slider-labels { display: flex; justify-content: space-between; font-size: 10px; color: var(--text-light); margin-top: 8px; }

  .mood-display { display: flex; align-items: center; gap: 16px; padding: 8px 0; }
  .mood-circle { width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; flex-shrink: 0; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
  .mood-circle.good { background: var(--green-soft); color: var(--green); }
  .mood-circle.neutral { background: var(--yellow-soft); color: var(--yellow); }
  .mood-circle.bad { background: var(--red-soft); color: var(--red); }
  .mood-text h4 { font-size: 16px; font-weight: 600; color: var(--text-dark); margin-bottom: 4px; }
  .mood-text p { font-size: 13px; color: var(--text-light); }

  .readiness { text-align: center; padding: 12px 0; }
  .readiness-value { font-size: 44px; font-weight: 700; line-height: 1; margin-bottom: 6px; }
  .readiness-label { font-size: 13px; color: var(--text-light); font-weight: 500; }
  .readiness-bar { height: 8px; background: rgba(42, 168, 208, 0.12); border-radius: 4px; margin: 14px 0 8px; overflow: hidden; }
  .readiness-fill { height: 100%; border-radius: 4px; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }

  .alert { border-radius: 16px; padding: 14px 16px; font-size: 13px; font-weight: 500; line-height: 1.5; margin: 12px 0; display: flex; align-items: flex-start; gap: 10px; }
  .alert-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; font-weight: 700; }
  .alert-blue { background: rgba(74, 197, 232, 0.12); color: #1a6b8a; }
  .alert-green { background: var(--green-soft); color: #1e6e3e; }
  .alert-yellow { background: var(--yellow-soft); color: #7a4f00; }
  .alert-red { background: var(--red-soft); color: #8b2a1d; }

  .master-filter { padding: 22px; border-radius: 20px; text-align: center; margin: 14px 0; }
  .master-filter.locked { background: var(--red-soft); border: 1px solid rgba(239, 123, 108, 0.25); }
  .master-filter.unlocked { background: var(--green-soft); border: 1px solid rgba(78, 203, 160, 0.25); }
  .master-filter-icon { width: 48px; height: 48px; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; }
  .master-filter.locked .master-filter-icon { background: rgba(239, 123, 108, 0.2); color: #8b2a1d; }
  .master-filter.unlocked .master-filter-icon { background: rgba(78, 203, 160, 0.2); color: #1e6e3e; }
  .master-filter-text { font-size: 14px; font-weight: 500; line-height: 1.5; }
  .master-filter.locked .master-filter-text { color: #8b2a1d; }
  .master-filter.unlocked .master-filter-text { color: #1e6e3e; }

  .btn-primary {
    width: 100%; padding: 16px 28px; font-size: 15px; font-family: inherit; font-weight: 700;
    color: var(--white); background: linear-gradient(135deg, var(--ocean-5) 0%, var(--green) 100%);
    border: none; border-radius: 18px; cursor: pointer; box-shadow: 0 6px 24px rgba(74, 197, 232, 0.35);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-top: 8px;
    letter-spacing: 0.02em;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(74, 197, 232, 0.45); }
  .btn-primary:active { transform: translateY(0); }

  .streak-card { background: linear-gradient(135deg, var(--white) 0%, var(--ocean-1) 100%); border-radius: 24px; padding: 22px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-soft); border: 1px solid var(--white-80); }
  .streak-label { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-light); margin-bottom: 12px; }
  .streak-dots { display: flex; gap: 6px; margin-bottom: 10px; }
  .streak-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; transition: all 0.3s ease; }
  .streak-dot.filled { background: var(--green); color: var(--white); box-shadow: 0 3px 12px rgba(78, 203, 160, 0.4); }
  .streak-dot.empty { background: rgba(42, 168, 208, 0.12); color: var(--text-muted); }
  .streak-message { font-size: 12px; font-weight: 600; color: var(--text-mid); }
  .streak-number { text-align: center; }
  .streak-value { font-size: 48px; font-weight: 700; line-height: 1; background: linear-gradient(135deg, var(--ocean-deep), var(--green)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .streak-sublabel { font-size: 11px; color: var(--text-light); margin-top: 4px; }

  .metrics-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px; }
  .metric-tile { background: var(--white-90); backdrop-filter: blur(16px); border-radius: 18px; padding: 14px 8px; text-align: center; box-shadow: var(--shadow-soft); border: 1px solid var(--white-80); }
  .metric-value { font-size: 24px; font-weight: 700; line-height: 1; margin-bottom: 4px; }
  .metric-value.blue { color: var(--ocean-deep); }
  .metric-value.green { color: var(--green); }
  .metric-value.yellow { color: var(--yellow); }
  .metric-value.red { color: var(--red); }
  .metric-label { font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-light); }

  .compliance-bar { display: flex; align-items: center; gap: 12px; margin: 16px 0; padding: 0 4px; }
  .compliance-track { flex: 1; height: 10px; background: rgba(42, 168, 208, 0.12); border-radius: 5px; overflow: hidden; }
  .compliance-fill { height: 100%; border-radius: 5px; transition: width 0.6s ease; }
  .compliance-value { font-size: 20px; font-weight: 700; min-width: 55px; }
  .compliance-label { font-size: 11px; color: var(--text-light); }

  .calendar-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; padding: 0 4px; }
  .calendar-title { font-size: 18px; font-weight: 700; color: var(--text-dark); }
  .calendar-btn { width: 38px; height: 38px; border-radius: 50%; background: var(--white-80); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: var(--ocean-deep); transition: all 0.25s ease; box-shadow: 0 2px 8px rgba(42, 168, 208, 0.1); }
  .calendar-btn:hover { background: var(--ocean-deep); color: var(--white); transform: scale(1.05); }
  .calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 6px; }
  .calendar-weekday { text-align: center; font-size: 11px; font-weight: 600; color: var(--text-light); padding: 8px 0; }
  .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
  .calendar-day { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 50%; font-size: 14px; font-weight: 500; color: var(--text-dark); position: relative; cursor: pointer; transition: all 0.2s ease; }
  .calendar-day:hover { background: rgba(42, 168, 208, 0.08); }
  .calendar-day.other-month { color: var(--text-muted); opacity: 0.5; }
  .calendar-day.today { border: 2px solid var(--ocean-4); font-weight: 700; color: var(--ocean-deep); }
  .calendar-day.green-day { background: var(--green-soft); color: #1e6e3e; font-weight: 600; }
  .calendar-day.yellow-day { background: var(--yellow-soft); color: #7a4f00; }
  .calendar-day.red-day { background: var(--red-soft); color: #8b2a1d; }
  .calendar-day-dot { width: 4px; height: 4px; border-radius: 50%; position: absolute; bottom: 5px; }
  .calendar-day-dot.green { background: var(--green); }
  .calendar-day-dot.yellow { background: var(--yellow); }
  .calendar-day-dot.red { background: var(--red); }

  .calendar-legend { display: flex; justify-content: center; gap: 16px; margin-top: 16px; flex-wrap: wrap; }
  .legend-item { display: flex; align-items: center; gap: 5px; font-size: 10px; color: var(--text-light); font-weight: 500; }
  .legend-dot { width: 10px; height: 10px; border-radius: 3px; }
  .legend-dot.green { background: var(--green-soft); border: 1px solid var(--green); }
  .legend-dot.yellow { background: var(--yellow-soft); border: 1px solid var(--yellow); }
  .legend-dot.red { background: var(--red-soft); border: 1px solid var(--red); }

  .coach-box { background: linear-gradient(135deg, var(--ocean-1) 0%, var(--ocean-2) 100%); border-radius: 20px; padding: 22px; margin-top: 16px; border: 1px solid rgba(42, 168, 208, 0.2); }
  .coach-title { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ocean-deep); margin-bottom: 12px; }
  .coach-text { font-size: 13px; line-height: 1.7; color: var(--text-dark); }

  .plan-display { background: var(--white); border-radius: 18px; padding: 18px; }
  .plan-field { margin-bottom: 14px; }
  .plan-field:last-child { margin-bottom: 0; }
  .plan-field-label { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; }
  .plan-field-value { font-size: 14px; color: var(--text-dark); font-weight: 500; }
  .plan-field-value.accent { color: var(--ocean-deep); font-weight: 700; }
  .plan-field-value.mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 13px; letter-spacing: 0.02em; }

  .empty-state { text-align: center; padding: 40px 20px; }
  .empty-state-icon { width: 64px; height: 64px; border-radius: 50%; background: rgba(42, 168, 208, 0.1); margin: 0 auto 14px; display: flex; align-items: center; justify-content: center; }
  .empty-state-icon svg { width: 28px; height: 28px; stroke: var(--text-light); }
  .empty-state-text { font-size: 14px; color: var(--text-light); line-height: 1.6; }

  .chips-container { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .chip { padding: 8px 14px; border-radius: 16px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; border: 2px solid transparent; }
  .chip.unselected { background: rgba(42, 168, 208, 0.08); color: var(--text-mid); }
  .chip.selected { background: rgba(239, 123, 108, 0.15); color: #8b2a1d; border-color: var(--red); }
  .chip:hover { transform: scale(1.02); }

  .date-picker { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 8px 0; margin-bottom: 4px; }
  .date-display { font-size: 14px; font-weight: 600; color: var(--text-dark); padding: 10px 18px; background: var(--white-90); border-radius: 12px; box-shadow: 0 2px 8px rgba(42, 168, 208, 0.08); }
  .date-btn { width: 34px; height: 34px; border-radius: 50%; background: var(--white-80); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--ocean-deep); transition: all 0.2s ease; }
  .date-btn:hover { background: var(--ocean-deep); color: var(--white); }

  .history-list { margin-top: 10px; }
  .history-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(42, 168, 208, 0.08); }
  .history-item:last-child { border-bottom: none; }
  .history-date { font-size: 13px; font-weight: 600; color: var(--text-dark); }
  .history-meta { display: flex; align-items: center; gap: 12px; }
  .history-mood { font-size: 12px; color: var(--text-light); }
  .history-status { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
  .history-status.yes { background: var(--green-soft); color: var(--green); }
  .history-status.no { background: var(--red-soft); color: var(--red); }

  .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; display: flex; justify-content: center; padding: 10px 16px 24px; pointer-events: none; }
  .bottom-nav-inner { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-radius: 28px; padding: 8px 12px; display: flex; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 8px 40px rgba(42, 168, 208, 0.25), 0 2px 8px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8); pointer-events: auto; max-width: 300px; width: 100%; border: 1px solid rgba(255, 255, 255, 0.6); }
  .nav-item { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 20px; border-radius: 20px; background: transparent; border: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit; min-width: 68px; position: relative; }
  .nav-item:hover { background: rgba(42, 168, 208, 0.08); }
  .nav-item.active { background: linear-gradient(135deg, var(--ocean-4) 0%, var(--ocean-5) 100%); box-shadow: 0 4px 16px rgba(74, 197, 232, 0.4); transform: translateY(-1px); }
  .nav-item.center { background: linear-gradient(135deg, var(--ocean-5) 0%, var(--green) 100%); padding: 14px 22px; margin: -4px 2px; box-shadow: 0 6px 24px rgba(74, 197, 232, 0.45); }
  .nav-item.center:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(74, 197, 232, 0.5); }
  .nav-item.center .nav-label { color: var(--white); }
  .nav-icon { margin-bottom: 4px; }
  .nav-icon svg { width: 22px; height: 22px; transition: transform 0.3s ease; }
  .nav-item:hover .nav-icon svg { transform: scale(1.1); }
  .nav-item .nav-icon svg { stroke: var(--text-light); }
  .nav-item.active .nav-icon svg, .nav-item.center .nav-icon svg { stroke: var(--white); }
  .nav-label { font-size: 10px; font-weight: 600; color: var(--text-light); letter-spacing: 0.02em; }
  .nav-item.active .nav-label { color: var(--white); }

  .toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: var(--white); padding: 14px 24px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); font-size: 14px; font-weight: 600; z-index: 2000; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; gap: 10px; }
  .toast.show { transform: translateX(-50%) translateY(0); }
  .toast.success { border-left: 4px solid var(--green); }
  .toast.warning { border-left: 4px solid var(--yellow); }
  .toast.error { border-left: 4px solid var(--red); }
  .toast-icon { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
  .toast.success .toast-icon { background: var(--green-soft); color: var(--green); }
  .toast.warning .toast-icon { background: var(--yellow-soft); color: var(--yellow); }
  .toast.error .toast-icon { background: var(--red-soft); color: var(--red); }

  @media (max-width: 380px) {
    .page { padding: 16px 14px 20px; }
    .header-title { font-size: 24px; }
    .card { padding: 18px; border-radius: 20px; }
    .metrics-row { gap: 6px; }
    .metric-tile { padding: 12px 6px; }
    .metric-value { font-size: 20px; }
    .streak-value { font-size: 40px; }
    .bottom-nav-inner { padding: 6px 10px; gap: 2px; }
    .nav-item { padding: 8px 14px; min-width: 58px; }
    .nav-item.center { padding: 12px 18px; }
    .nav-icon svg { width: 20px; height: 20px; }
    .nav-label { font-size: 9px; }
  }

  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .bottom-nav { padding-bottom: calc(16px + env(safe-area-inset-bottom)); }
    .app { padding-bottom: calc(140px + env(safe-area-inset-bottom)); }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════════════════════

const Icons = {
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Reflect: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4"/>
      <path d="M12 8h.01"/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

const formatShortDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const calculateReadiness = (trend, breadth, traction, cognitive) => {
  const trendScore = { 'Uptrend': 2, 'Sideways': 1, 'Downtrend': 0 }[trend] || 0;
  const breadthScore = { 'Good': 2, 'Neutral': 1, 'Poor': 0 }[breadth] || 0;
  const cogScore = { 'Clear': 2, 'Neutral': 1, 'Overwhelmed': 0 }[cognitive] || 0;
  return Math.round(((trendScore + breadthScore + traction + cogScore) / 9) * 100);
};

const getReadinessColor = (pct) => {
  if (pct >= 70) return 'var(--green)';
  if (pct >= 45) return 'var(--yellow)';
  return 'var(--red)';
};

const getReadinessStatus = (pct) => {
  if (pct >= 70) return 'Good to go';
  if (pct >= 45) return 'Proceed with caution';
  return 'Consider sitting out';
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const Toast = ({ message, type, show }) => (
  <div className={`toast ${type} ${show ? 'show' : ''}`}>
    <span className="toast-icon">{type === 'success' ? '✓' : type === 'warning' ? '!' : '×'}</span>
    {message}
  </div>
);

const Slider = ({ value, onChange, min = 0, max = 5 }) => {
  const pct = ((value - min) / (max - min)) * 100;
  const color = value >= 4 ? 'var(--green)' : value >= 2 ? 'var(--yellow)' : 'var(--red)';
  
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onChange(Math.round(pct * (max - min) + min));
  };
  
  return (
    <div className="slider-container">
      <div className="slider-track" onClick={handleClick}>
        <div className="slider-fill" style={{ width: `${pct}%`, background: color }} />
        <div className="slider-thumb" style={{ left: `${pct}%` }} />
      </div>
      <div className="slider-labels">
        <span>Panic / FOMO</span>
        <span>Clinical flow</span>
      </div>
    </div>
  );
};

const Toggle = ({ value, onChange, label }) => (
  <div className="toggle-group">
    <div className={`toggle ${value ? 'active' : ''}`} onClick={() => onChange(!value)} />
    <span className="toggle-label">{label}</span>
  </div>
);

const DatePicker = ({ value, onChange }) => (
  <div className="date-picker">
    <button className="date-btn" onClick={() => {
      const d = new Date(value);
      d.setDate(d.getDate() - 1);
      onChange(d.toISOString().split('T')[0]);
    }}>‹</button>
    <div className="date-display">{formatShortDate(value)}</div>
    <button className="date-btn" onClick={() => {
      const d = new Date(value);
      d.setDate(d.getDate() + 1);
      onChange(d.toISOString().split('T')[0]);
    }}>›</button>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════════════════════

const PreMarketPage = ({ onSave }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [masterFilter, setMasterFilter] = useState(false);
  const [indexTrend, setIndexTrend] = useState('Uptrend');
  const [marketBreadth, setMarketBreadth] = useState('Good');
  const [traction, setTraction] = useState(2);
  const [cognitiveLoad, setCognitiveLoad] = useState('Clear');
  const [planAction, setPlanAction] = useState('Buying');
  const [planTickers, setPlanTickers] = useState('');
  const [planNotes, setPlanNotes] = useState('');

  const readiness = calculateReadiness(indexTrend, marketBreadth, traction, cognitiveLoad);
  const readinessColor = getReadinessColor(readiness);

  const handleSave = () => {
    const data = loadData(STORAGE_KEYS.PRE_MARKET);
    const newEntry = {
      date: selectedDate,
      timestamp: new Date().toISOString(),
      masterFilter: true,
      indexTrend,
      marketBreadth,
      traction,
      cognitiveLoad,
      readinessScore: readiness,
      planAction,
      planTickers,
      planNotes
    };
    
    const existingIndex = data.findIndex(d => d.date === selectedDate);
    if (existingIndex >= 0) {
      data[existingIndex] = newEntry;
    } else {
      data.push(newEntry);
    }
    
    saveData(STORAGE_KEYS.PRE_MARKET, data);
    onSave('success', `Plan locked for ${formatShortDate(selectedDate)}`);
  };

  return (
    <div className="page" key="premarket">
      <div className="header">
        <div className="header-eyebrow">Morning Ritual</div>
        <h1 className="header-title">Pre-market Plan</h1>
      </div>

      <DatePicker value={selectedDate} onChange={setSelectedDate} />
      <div className="header-date" style={{ textAlign: 'center', marginBottom: 16 }}>
        {formatDate(selectedDate)}
      </div>

      <div className="card">
        <div className="card-title">Master Filter</div>
        <Toggle 
          value={masterFilter} 
          onChange={setMasterFilter}
          label="I choose a Profit Factor > 3 over a single $10,000 win today."
        />
      </div>

      {!masterFilter ? (
        <div className="master-filter locked">
          <div className="master-filter-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="master-filter-text">
            Acknowledge the master filter to unlock your plan.<br />
            <small style={{ opacity: 0.8 }}>This is your first act of discipline today.</small>
          </div>
        </div>
      ) : (
        <>
          <div className="master-filter unlocked">
            <div className="master-filter-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="master-filter-text">
              Mindset locked in — trading the process, not the outcome.
            </div>
          </div>

          <div className="card">
            <div className="card-title">Market Conditions</div>
            <div className="form-group">
              <label className="form-label">Index Trend</label>
              <select className="form-select" value={indexTrend} onChange={e => setIndexTrend(e.target.value)}>
                <option>Uptrend</option>
                <option>Sideways</option>
                <option>Downtrend</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Market Breadth</label>
              <select className="form-select" value={marketBreadth} onChange={e => setMarketBreadth(e.target.value)}>
                <option>Good</option>
                <option>Neutral</option>
                <option>Poor</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Traction (Winners in last 3)</label>
              <select className="form-select" value={traction} onChange={e => setTraction(Number(e.target.value))}>
                <option value={0}>0 / 3 winners</option>
                <option value={1}>1 / 3 winners</option>
                <option value={2}>2 / 3 winners</option>
                <option value={3}>3 / 3 winners</option>
              </select>
            </div>
            {traction <= 1 && (
              <div className="alert alert-yellow">
                <span className="alert-icon">!</span>
                <span>Low traction — consider reducing size or stepping aside.</span>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-title">Mental State</div>
            <div className="form-group">
              <label className="form-label">Cognitive Load</label>
              <select className="form-select" value={cognitiveLoad} onChange={e => setCognitiveLoad(e.target.value)}>
                <option>Clear</option>
                <option>Neutral</option>
                <option>Overwhelmed</option>
              </select>
            </div>
            {cognitiveLoad === 'Overwhelmed' && (
              <div className="alert alert-yellow">
                <span className="alert-icon">!</span>
                <span>Minimize exposure — a stressed mind cannot execute.</span>
              </div>
            )}

            <div className="readiness">
              <div className="readiness-bar">
                <div className="readiness-fill" style={{ width: `${readiness}%`, background: readinessColor }} />
              </div>
              <div className="readiness-value" style={{ color: readinessColor }}>{readiness}%</div>
              <div className="readiness-label">{getReadinessStatus(readiness)}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Today's Battle Plan</div>
            <div className="form-group">
              <label className="form-label">Primary Action</label>
              <select className="form-select" value={planAction} onChange={e => setPlanAction(e.target.value)}>
                <option>Buying</option>
                <option>Selling</option>
                <option>Moving stops</option>
                <option>Watching only</option>
                <option>Mixed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tickers</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. NVDA, CRDO, ARM"
                value={planTickers}
                onChange={e => setPlanTickers(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Plan Notes</label>
              <textarea 
                className="form-textarea"
                placeholder="VCP breakouts only. Max 2% risk per trade..."
                value={planNotes}
                onChange={e => setPlanNotes(e.target.value)}
              />
            </div>
          </div>

          <button className="btn-primary" onClick={handleSave}>
            Lock in today's plan
          </button>
        </>
      )}
    </div>
  );
};

const PostMarketPage = ({ onSave }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [actualAction, setActualAction] = useState('Buying');
  const [actualTickers, setActualTickers] = useState('');
  const [actualNotes, setActualNotes] = useState('');
  const [mood, setMood] = useState(3);
  const [violations, setViolations] = useState([]);
  const [followedPlan, setFollowedPlan] = useState(true);
  const [tradeCount, setTradeCount] = useState(0);
  const [coachNote, setCoachNote] = useState('');

  const violationOptions = [
    'FOMO trade', 'Revenge trade', 'Boredom trade', 'Panic sell',
    'Oversized position', 'Ignored stop-loss', 'Chased entry', 'Other'
  ];

  const moodLabels = {
    0: { text: 'Full panic / FOMO', class: 'bad' },
    1: { text: 'Reactive / fear-driven', class: 'bad' },
    2: { text: 'Uneasy / emotional', class: 'bad' },
    3: { text: 'Neutral / slightly uneasy', class: 'neutral' },
    4: { text: 'Calm / focused', class: 'good' },
    5: { text: 'Clinical / flow state', class: 'good' },
  };

  const toggleViolation = (v) => {
    if (violations.includes(v)) {
      setViolations(violations.filter(x => x !== v));
    } else {
      setViolations([...violations, v]);
    }
  };

  const preMarketData = loadData(STORAGE_KEYS.PRE_MARKET);
  const todayPlan = preMarketData.find(d => d.date === selectedDate);

  const handleSave = () => {
    const data = loadData(STORAGE_KEYS.POST_MARKET);
    const newEntry = {
      date: selectedDate,
      timestamp: new Date().toISOString(),
      actualAction,
      actualTickers,
      actualNotes,
      mood_score: mood,
      violations: violations.join(', '),
      followed_plan: followedPlan,
      tradeCount,
      coachNote
    };
    
    const existingIndex = data.findIndex(d => d.date === selectedDate);
    if (existingIndex >= 0) {
      data[existingIndex] = newEntry;
    } else {
      data.push(newEntry);
    }
    
    saveData(STORAGE_KEYS.POST_MARKET, data);
    
    const dayType = followedPlan && mood >= 4 ? 'GREEN' : followedPlan ? 'YELLOW' : 'RED';
    const toastType = dayType === 'GREEN' ? 'success' : dayType === 'YELLOW' ? 'warning' : 'error';
    onSave(toastType, `${dayType} DAY logged`);
  };

  return (
    <div className="page" key="postmarket">
      <div className="header">
        <div className="header-eyebrow">Evening Reflection</div>
        <h1 className="header-title">Post-market Audit</h1>
      </div>

      <DatePicker value={selectedDate} onChange={setSelectedDate} />
      <div className="header-date" style={{ textAlign: 'center', marginBottom: 16 }}>
        {formatDate(selectedDate)}
      </div>

      <div className="card">
        <div className="card-title">The Plan</div>
        {todayPlan ? (
          <div className="plan-display">
            <div className="plan-field">
              <div className="plan-field-label">Action</div>
              <div className="plan-field-value accent">{todayPlan.planAction}</div>
            </div>
            <div className="plan-field">
              <div className="plan-field-label">Tickers</div>
              <div className="plan-field-value mono">{todayPlan.planTickers || '—'}</div>
            </div>
            <div className="plan-field">
              <div className="plan-field-label">Readiness</div>
              <div className="plan-field-value" style={{ fontSize: 20, fontWeight: 700, color: getReadinessColor(todayPlan.readinessScore) }}>
                {todayPlan.readinessScore}%
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div className="empty-state-text">No plan for {formatShortDate(selectedDate)}</div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Actual Execution</div>
        <div className="form-group">
          <label className="form-label">What did you do?</label>
          <select className="form-select" value={actualAction} onChange={e => setActualAction(e.target.value)}>
            <option>Buying</option>
            <option>Selling</option>
            <option>Moving stops</option>
            <option>Watching only</option>
            <option>Mixed</option>
            <option>Over-traded</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Tickers Traded</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. NVDA, AMD"
            value={actualTickers}
            onChange={e => setActualTickers(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea 
            className="form-textarea"
            placeholder="What happened? Be honest."
            value={actualNotes}
            onChange={e => setActualNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Emotional State</div>
        <div className="form-group">
          <label className="form-label">Mood (0 → 5)</label>
          <Slider value={mood} onChange={setMood} />
        </div>
        <div className="mood-display">
          <div className={`mood-circle ${moodLabels[mood].class}`}>{mood}</div>
          <div className="mood-text">
            <h4>{moodLabels[mood].text}</h4>
            <p>Mood score {mood} / 5</p>
          </div>
        </div>

        {mood <= 3 && (
          <div className="form-group" style={{ marginTop: 14 }}>
            <label className="form-label">Rule Violations</label>
            <div className="chips-container">
              {violationOptions.map(v => (
                <div 
                  key={v}
                  className={`chip ${violations.includes(v) ? 'selected' : 'unselected'}`}
                  onClick={() => toggleViolation(v)}
                >
                  {v}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Plan Compliance</div>
        <Toggle 
          value={followedPlan}
          onChange={setFollowedPlan}
          label="Followed the pre-market plan?"
        />
        
        {followedPlan && mood >= 4 && (
          <div className="alert alert-green">
            <span className="alert-icon">✓</span>
            <span>Green day — process followed, mind clear.</span>
          </div>
        )}
        {followedPlan && mood < 4 && (
          <div className="alert alert-yellow">
            <span className="alert-icon">•</span>
            <span>Rules followed but felt uneasy.</span>
          </div>
        )}
        {!followedPlan && (
          <div className="alert alert-red">
            <span className="alert-icon">×</span>
            <span>Plan not followed. Diagnose why.</span>
          </div>
        )}

        <div className="form-group" style={{ marginTop: 14 }}>
          <label className="form-label">Number of Trades</label>
          <input 
            type="number" 
            className="form-input" 
            value={tradeCount}
            onChange={e => setTradeCount(Number(e.target.value))}
            min={0}
            style={{ width: '100px' }}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Coach's Journal</div>
        <textarea 
          className="form-textarea"
          placeholder="One honest sentence about today..."
          value={coachNote}
          onChange={e => setCoachNote(e.target.value)}
        />
      </div>

      <button className="btn-primary" onClick={handleSave}>
        Submit audit
      </button>
    </div>
  );
};

const CalendarPage = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  
  const today = new Date();
  const data = loadData(STORAGE_KEYS.POST_MARKET);

  const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;
  for (const d of sortedData) {
    if (d.followed_plan && d.mood_score >= 4) streak++;
    else break;
  }

  const total = data.length;
  const greens = data.filter(d => d.followed_plan && d.mood_score >= 4).length;
  const yellows = data.filter(d => d.followed_plan && d.mood_score < 4).length;
  const reds = data.filter(d => !d.followed_plan).length;
  const complianceRate = total > 0 ? Math.round(((greens + yellows) / total) * 100) : 0;
  const complianceColor = complianceRate >= 80 ? 'var(--green)' : complianceRate >= 60 ? 'var(--yellow)' : 'var(--red)';

  const dayMap = {};
  data.forEach(d => {
    dayMap[d.date] = d;
  });

  const firstDay = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startPad = (firstDay.getDay() + 7) % 7;
  
  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  const calendarDays = [];
  
  const prevMonth = new Date(currentYear, currentMonth, 0);
  for (let i = startPad - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonth.getDate() - i, type: 'other' });
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === d;
    const record = dayMap[dateStr];
    
    let dayClass = '';
    let dotClass = '';
    if (record) {
      if (record.followed_plan && record.mood_score >= 4) {
        dayClass = 'green-day';
        dotClass = 'green';
      } else if (record.followed_plan) {
        dayClass = 'yellow-day';
        dotClass = 'yellow';
      } else {
        dayClass = 'red-day';
        dotClass = 'red';
      }
    }
    
    calendarDays.push({ day: d, type: 'current', isToday, dayClass, dotClass, dateStr });
  }
  
  const remaining = 7 - (calendarDays.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      calendarDays.push({ day: i, type: 'other' });
    }
  }

  const prevMonth2 = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="page" key="calendar">
      <div className="header">
        <div className="header-eyebrow">Behavioral Fingerprint</div>
        <h1 className="header-title">Calendar</h1>
      </div>

      <div className="streak-card">
        <div>
          <div className="streak-label">Probation Streak</div>
          <div className="streak-dots">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className={`streak-dot ${i < streak ? 'filled' : 'empty'}`}>
                {i < streak ? '✓' : i + 1}
              </div>
            ))}
          </div>
          <div className="streak-message" style={{ color: streak >= 3 ? 'var(--green)' : 'var(--text-mid)' }}>
            {streak === 0 ? 'Start your streak' :
             streak < 3 ? `${streak} / 5 — building` :
             streak < 5 ? `${streak} / 5 — in the zone` :
             'Full streak achieved'}
          </div>
        </div>
        <div className="streak-number">
          <div className="streak-value">{streak}</div>
          <div className="streak-sublabel">/ 5 days</div>
        </div>
      </div>

      <div className="metrics-row">
        <div className="metric-tile">
          <div className="metric-value blue">{total}</div>
          <div className="metric-label">Sessions</div>
        </div>
        <div className="metric-tile">
          <div className="metric-value green">{greens}</div>
          <div className="metric-label">Green</div>
        </div>
        <div className="metric-tile">
          <div className="metric-value yellow">{yellows}</div>
          <div className="metric-label">Yellow</div>
        </div>
        <div className="metric-tile">
          <div className="metric-value red">{reds}</div>
          <div className="metric-label">Red</div>
        </div>
      </div>

      {total > 0 && (
        <div className="compliance-bar">
          <div className="compliance-track">
            <div className="compliance-fill" style={{ width: `${complianceRate}%`, background: complianceColor }} />
          </div>
          <div className="compliance-value" style={{ color: complianceColor }}>{complianceRate}%</div>
          <div className="compliance-label">compliance</div>
        </div>
      )}

      <div className="card">
        <div className="calendar-nav">
          <button className="calendar-btn" onClick={prevMonth2}>‹</button>
          <div className="calendar-title">{monthName}</div>
          <button className="calendar-btn" onClick={nextMonth}>›</button>
        </div>

        <div className="calendar-weekdays">
          {weekdays.map(d => (
            <div key={d} className="calendar-weekday">{d}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map((cell, i) => (
            <div 
              key={i} 
              className={`calendar-day ${cell.type === 'other' ? 'other-month' : ''} ${cell.isToday ? 'today' : ''} ${cell.dayClass || ''}`}
            >
              {cell.day}
              {cell.dotClass && <span className={`calendar-day-dot ${cell.dotClass}`} />}
            </div>
          ))}
        </div>

        <div className="calendar-legend">
          <div className="legend-item"><span className="legend-dot green" /> Green</div>
          <div className="legend-item"><span className="legend-dot yellow" /> Yellow</div>
          <div className="legend-item"><span className="legend-dot red" /> Red</div>
        </div>
      </div>

      {total >= 3 && (
        <div className="coach-box">
          <div className="coach-title">Coach Insight</div>
          <div className="coach-text">
            Over <strong>{total} sessions</strong>, your compliance is <strong style={{ color: complianceColor }}>{complianceRate}%</strong>.
            {reds > 0 && (
              <> You broke your plan on <strong style={{ color: 'var(--red)' }}>{Math.round((reds / total) * 100)}%</strong> of days.</>
            )}
          </div>
        </div>
      )}

      {total > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-title">Recent Sessions</div>
          <div className="history-list">
            {sortedData.slice(0, 5).map(d => (
              <div key={d.date} className="history-item">
                <span className="history-date">{formatShortDate(d.date)}</span>
                <div className="history-meta">
                  <span className="history-mood">Mood: {d.mood_score}</span>
                  <span className={`history-status ${d.followed_plan ? 'yes' : 'no'}`}>
                    {d.followed_plan ? '✓' : '×'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [currentPage, setCurrentPage] = useState('premarket');
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  return (
    <>
      <style>{styles}</style>
      
      <div className="water-bg" />
      <div className="light-rays" />
      
      <Toast {...toast} />
      
      <div className="app">
        {currentPage === 'premarket' && <PreMarketPage onSave={showToast} />}
        {currentPage === 'postmarket' && <PostMarketPage onSave={showToast} />}
        {currentPage === 'calendar' && <CalendarPage />}

        <div className="bottom-nav">
          <div className="bottom-nav-inner">
            <button 
              className={`nav-item ${currentPage === 'premarket' ? 'active' : ''}`}
              onClick={() => setCurrentPage('premarket')}
            >
              <span className="nav-icon"><Icons.Sun /></span>
              <span className="nav-label">Plan</span>
            </button>
            <button 
              className={`nav-item center ${currentPage === 'postmarket' ? 'active' : ''}`}
              onClick={() => setCurrentPage('postmarket')}
            >
              <span className="nav-icon"><Icons.Reflect /></span>
              <span className="nav-label">Audit</span>
            </button>
            <button 
              className={`nav-item ${currentPage === 'calendar' ? 'active' : ''}`}
              onClick={() => setCurrentPage('calendar')}
            >
              <span className="nav-icon"><Icons.Calendar /></span>
              <span className="nav-label">Calendar</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
