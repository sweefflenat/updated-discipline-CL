import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// THE DISCIPLINED TRADER — ULTIMATE CONSOLIDATED VERSION
// Full Features + iPhone Scroll Fix + Google Sheets Sync
// ═══════════════════════════════════════════════════════════════════════════════

// 1. PASTE YOUR GOOGLE APPS SCRIPT URL HERE
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbz9yzwJprVZZu0lWfs7C99SIy627AVuIx3wtriFEr1b97WiXGtW7fxfylAZOSdF_KRUlg/exec";

const STORAGE_KEYS = {
  PRE_MARKET: 'disciplined_trader_premarket',
  POST_MARKET: 'disciplined_trader_postmarket'
};

// --- UTILITY: DATA SYNC & STORAGE ---

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

const syncToSheet = async (type, entry) => {
  if (!SHEET_API_URL || SHEET_API_URL.includes("PASTE_YOUR")) return;
  try {
    await fetch(`${SHEET_API_URL}?sheet=${type}`, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      body: JSON.stringify(entry)
    });
  } catch (error) {
    console.error("Sheet sync failed:", error);
  }
};

// --- STYLES: IPHONE SCROLL PATCHED ---

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

  :root {
    --ocean-1: #E3F6FC; --ocean-2: #C5EDF8; --ocean-3: #9EE2F5; --ocean-4: #75D4EF;
    --ocean-5: #4AC5E8; --ocean-deep: #2AA8D0; --white: #FFFFFF; --white-90: rgba(255, 255, 255, 0.9);
    --white-80: rgba(255, 255, 255, 0.8); --text-dark: #1E3A45; --text-mid: #4A7080;
    --text-light: #8AABB8; --text-muted: #B5CED8; --green: #4ECBA0; --green-soft: rgba(78, 203, 160, 0.15);
    --yellow: #F5B74E; --yellow-soft: rgba(245, 183, 78, 0.15); --red: #EF7B6C;
    --red-soft: rgba(239, 123, 108, 0.15); --shadow-soft: 0 8px 40px rgba(42, 168, 208, 0.12);
  }

  html { height: -webkit-fill-available; overflow-x: hidden; }
  
  body {
    font-family: 'Quicksand', 'Noto Sans TC', sans-serif;
    background: var(--ocean-1);
    min-height: 100vh;
    overflow-x: hidden;
    overflow-y: scroll !important;
    -webkit-overflow-scrolling: touch;
    position: relative;
  }
  
  #root { overflow: visible !important; height: auto !important; }

  .water-bg, .light-rays {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    z-index: -1; pointer-events: none !important;
    background: linear-gradient(165deg, var(--ocean-1) 0%, var(--ocean-5) 100%);
  }

  .water-bg::before, .water-bg::after {
    content: ''; position: absolute; border-radius: 45%;
    background: rgba(255, 255, 255, 0.08); animation: ripple 25s linear infinite;
  }
  .water-bg::before { width: 200%; height: 200%; top: -50%; left: -50%; }
  @keyframes ripple { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  .app { position: relative; z-index: 1; width: 100%; min-height: 100vh; padding-bottom: 200px; }
  .page { flex: 1; max-width: 420px; margin: 0 auto; padding: 20px; width: 100%; animation: fadeInUp 0.4s ease-out; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .card { background: var(--white-90); backdrop-filter: blur(20px); border-radius: 24px; padding: 22px; margin-bottom: 14px; box-shadow: var(--shadow-soft); border: 1px solid var(--white-80); }
  .card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-light); margin-bottom: 16px; letter-spacing: 0.15em; }
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-light); margin-bottom: 10px; }
  
  .form-input, .form-select, .form-textarea { 
    width: 100%; padding: 14px 16px; font-size: 16px; 
    font-family: inherit; font-weight: 500; color: var(--text-dark); background: var(--white); 
    border: 2px solid transparent; border-radius: 14px; outline: none; box-shadow: 0 2px 12px rgba(42, 168, 208, 0.06);
  }
  .form-textarea { resize: none; min-height: 90px; }
  
  .bottom-nav { position: fixed; bottom: 24px; left: 0; right: 0; z-index: 1000; display: flex; justify-content: center; pointer-events: none; }
  .bottom-nav-inner { 
    background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(24px); border-radius: 30px; 
    padding: 8px 12px; display: flex; gap: 4px; pointer-events: auto; box-shadow: 0 10px 40px rgba(42, 168, 208, 0.25);
  }
  .nav-item { display: flex; flex-direction: column; align-items: center; padding: 10px 18px; border-radius: 20px; border: none; background: transparent; cursor: pointer; min-width: 60px; }
  .nav-item.active { background: linear-gradient(135deg, var(--ocean-4), var(--ocean-5)); color: white; }
  .nav-label { font-size: 10px; font-weight: 600; margin-top: 3px; }

  .readiness-bar { height: 8px; background: rgba(42, 168, 208, 0.12); border-radius: 4px; margin: 14px 0 8px; overflow: hidden; }
  .readiness-fill { height: 100%; border-radius: 4px; transition: width 0.6s; }
  .readiness-value { font-size: 44px; font-weight: 700; text-align: center; }
  .btn-primary { width: 100%; padding: 18px; font-size: 16px; font-weight: 700; color: white; background: linear-gradient(135deg, var(--ocean-deep), var(--green)); border: none; border-radius: 18px; cursor: pointer; box-shadow: 0 6px 24px rgba(74, 197, 232, 0.35); }

  .metric-tile { background: var(--white-90); border-radius: 18px; padding: 14px 8px; text-align: center; border: 1px solid var(--white-80); }
  .metric-value { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
  .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
  .calendar-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 14px; position: relative; }
  .calendar-day.green-day { background: var(--green-soft); color: #1e6e3e; font-weight: 600; }
  .calendar-day.yellow-day { background: var(--yellow-soft); color: #7a4f00; }
  .calendar-day.red-day { background: var(--red-soft); color: #8b2a1d; }
  .chip { padding: 8px 12px; border-radius: 16px; font-size: 12px; cursor: pointer; border: 2px solid transparent; background: rgba(0,0,0,0.05); }
  .chip.selected { background: var(--red-soft); border-color: var(--red); color: #8b2a1d; }

  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .bottom-nav { padding-bottom: calc(16px + env(safe-area-inset-bottom)); }
    .app { padding-bottom: calc(140px + env(safe-area-inset-bottom)); }
  }
`;

// --- COMPONENTS: ICONS ---

const Icons = {
  Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Reflect: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
};

// --- PAGES ---

const PreMarketPage = ({ onSave }) => {
  const [masterFilter, setMasterFilter] = useState(false);
  const [trend, setTrend] = useState('Uptrend');
  const [cog, setCog] = useState('Clear');
  const [tickers, setTickers] = useState('');
  const [notes, setNotes] = useState('');

  const readiness = Math.round((( (trend === 'Uptrend' ? 2 : trend === 'Sideways' ? 1 : 0) + 2 + (cog === 'Clear' ? 2 : 1) ) / 6) * 100);

  const handleSave = () => {
    const data = loadData(STORAGE_KEYS.PRE_MARKET);
    const newEntry = { 
      date: new Date().toISOString().split('T')[0], 
      timestamp: new Date().toLocaleString(),
      readiness, tickers, notes 
    };
    data.push(newEntry);
    saveData(STORAGE_KEYS.PRE_MARKET, data);
    syncToSheet('PreMarket', newEntry);
    onSave('success', 'Plan locked and synced.');
  };

  return (
    <div className="page">
      <header style={{textAlign:'center', marginBottom: 20}}><h1 style={{fontSize: 26}}>Pre-Market Plan</h1></header>
      <div className="card">
        <div className="card-title">Master Filter</div>
        <div style={{display:'flex', gap: 12, alignItems:'center'}} onClick={() => setMasterFilter(!masterFilter)}>
           <div style={{width:24, height:24, border:'2px solid var(--ocean-5)', borderRadius: 6, background: masterFilter ? 'var(--ocean-5)' : 'transparent'}} />
           <span style={{fontSize: 14}}>I choose process over a single win today.</span>
        </div>
      </div>
      {masterFilter && (
        <>
          <div className="card">
            <div className="card-title">Readiness</div>
            <div className="form-group"><label className="form-label">Trend</label>
              <select className="form-select" value={trend} onChange={e => setTrend(e.target.value)}><option>Uptrend</option><option>Sideways</option><option>Downtrend</option></select>
            </div>
            <div className="form-group"><label className="form-label">Cognitive Load</label>
              <select className="form-select" value={cog} onChange={e => setCog(e.target.value)}><option>Clear</option><option>Neutral</option><option>Overwhelmed</option></select>
            </div>
            <div className="readiness-bar"><div className="readiness-fill" style={{width: `${readiness}%`, background: readiness > 60 ? 'var(--green)' : 'var(--yellow)'}} /></div>
            <div className="readiness-value">{readiness}%</div>
          </div>
          <div className="card">
            <input className="form-input" placeholder="Watchlist (e.g. NVDA)" value={tickers} onChange={e => setTickers(e.target.value)} style={{marginBottom: 10}} />
            <textarea className="form-textarea" placeholder="Entry rules..." value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={handleSave}>🔒 Lock in Plan</button>
        </>
      )}
    </div>
  );
};

const PostMarketPage = ({ onSave }) => {
  const [mood, setMood] = useState(3);
  const [followed, setFollowed] = useState(true);
  const [pnl, setPnl] = useState(0);
  const [violations, setViolations] = useState([]);
  
  const handleSave = () => {
    const data = loadData(STORAGE_KEYS.POST_MARKET);
    const newEntry = { 
      date: new Date().toISOString().split('T')[0], 
      timestamp: new Date().toLocaleString(),
      mood_score: mood, followed_plan: followed, pnl, violations: violations.join(', ')
    };
    data.push(newEntry);
    saveData(STORAGE_KEYS.POST_MARKET, data);
    syncToSheet('PostMarket', newEntry);
    onSave('success', 'Audit submitted and synced.');
  };

  const toggleV = (v) => setViolations(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  return (
    <div className="page">
      <header style={{textAlign:'center', marginBottom: 20}}><h1 style={{fontSize: 26}}>Post-Market Audit</h1></header>
      <div className="card"><div className="card-title">Mood</div>
        <input type="range" min="0" max="5" value={mood} onChange={e => setMood(parseInt(e.target.value))} style={{width:'100%'}} />
        <div style={{textAlign:'center', fontSize: 24, marginTop: 10}}>{mood >= 4 ? '😊' : '😐'}</div>
      </div>
      <div className="card"><div className="card-title">Execution</div>
        <div onClick={() => setFollowed(!followed)} style={{display:'flex', gap: 10, alignItems:'center', marginBottom: 15}}>
          <div style={{width: 20, height: 20, border:'2px solid var(--ocean-deep)', borderRadius: 4, background: followed ? 'var(--ocean-deep)' : 'transparent'}} />
          <span>Followed the plan?</span>
        </div>
        {!followed && (
          <div style={{display:'flex', flexWrap:'wrap', gap: 8}}>
            {['FOMO','Revenge','Boredom','Panic Sell'].map(v => (
              <div key={v} className={`chip ${violations.includes(v) ? 'selected' : ''}`} onClick={() => toggleV(v)}>{v}</div>
            ))}
          </div>
        )}
      </div>
      <div className="card">
        <input className="form-input" type="number" placeholder="Net P&L ($)" value={pnl} onChange={e => setPnl(e.target.value)} />
      </div>
      <button className="btn-primary" onClick={handleSave}>📥 Submit Audit</button>
    </div>
  );
};

const CalendarPage = () => {
  const data = loadData(STORAGE_KEYS.POST_MARKET);
  const total = data.length;
  const greens = data.filter(d => d.followed_plan && d.mood_score >= 4).length;

  return (
    <div className="page">
      <header style={{textAlign:'center', marginBottom: 20}}><h1 style={{fontSize: 26}}>History</h1></header>
      <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap: 10, marginBottom: 20}}>
        <div className="metric-tile"><div className="metric-value">{total}</div><div style={{fontSize: 9}}>SESSIONS</div></div>
        <div className="metric-tile"><div className="metric-value" style={{color:'var(--green)'}}>{greens}</div><div style={{fontSize: 9}}>GREEN DAYS</div></div>
      </div>
      <div className="card">
        <div className="calendar-grid">
          {Array.from({length: 31}).map((_, i) => {
            const dateStr = `2026-03-${String(i+1).padStart(2, '0')}`;
            const record = data.find(d => d.date === dateStr);
            let dayClass = record ? (record.followed_plan && record.mood_score >= 4 ? 'green-day' : 'red-day') : '';
            return <div key={i} className={`calendar-day ${dayClass}`}>{i+1}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [tab, setTab] = useState('plan');
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (type, message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="water-bg" />
      <div className={`toast ${toast.show ? 'show' : ''}`} style={{position:'fixed', top: 20, left:'50%', transform:'translateX(-50%)', background:'white', padding:'10px 20px', borderRadius:'10px', boxShadow:'0 5px 15px rgba(0,0,0,0.1)', zIndex: 2000}}>
        {toast.message}
      </div>
      <div className="app">
        {tab === 'plan' && <PreMarketPage onSave={showToast} />}
        {tab === 'audit' && <PostMarketPage onSave={showToast} />}
        {tab === 'calendar' && <CalendarPage />}
        
        <div className="bottom-nav">
          <div className="bottom-nav-inner">
            <button className={`nav-item ${tab === 'plan' ? 'active' : ''}`} onClick={() => setTab('plan')}>
              <span className="nav-icon"><Icons.Sun /></span><span className="nav-label">Plan</span>
            </button>
            <button className={`nav-item ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>
              <span className="nav-icon"><Icons.Reflect /></span><span className="nav-label">Audit</span>
            </button>
            <button className={`nav-item ${tab === 'calendar' ? 'active' : ''}`} onClick={() => setTab('calendar')}>
              <span className="nav-icon"><Icons.Calendar /></span><span className="nav-label">History</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
