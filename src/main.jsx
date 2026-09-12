import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import MiniGame from './MiniGame';
import { repairs, repairState, completeRepair } from './repairs';

const assets = { exterior: '/scenes/exterior-portrait.png', cockpit: '/scenes/cockpit-portrait.png' };

function CockpitEffects({ completed }) {
  return <div className={`cockpit-effects repairs-${completed}`} aria-hidden="true">
    <div className="ceiling-lamp lamp-left"/><div className="ceiling-lamp lamp-right"/>
    <svg className="window-damage" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M19 4 25 22 20 35 34 53 28 70 M25 22 42 17 50 24 M34 53 51 49 60 60 M83 5 76 23 84 38 72 49 M76 23 65 19"/>
    </svg>
    <div className="window-seal seal-left"/><div className="window-seal seal-right"/>
    <div className="computer-display"><span>SYS / ONLINE</span><i/><i/><i/><b>▰ ▰ ▰</b></div>
    <div className="diagnostic-display diagnostic-left"><i/><i/><i/></div>
    <div className="diagnostic-display diagnostic-right"><span>SCAN</span><b>◎</b></div>
  </div>;
}

function App() {
  const [scene, setScene] = useState('exterior');
  const [transition, setTransition] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [playing, setPlaying] = useState(null);
  const [inspected, setInspected] = useState(0);
  const [showList, setShowList] = useState(false);
  const [celebration, setCelebration] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const busy = useRef(false);
  const timers = useRef([]);
  const dialog = useRef(null);
  const mainAction = useRef(null);
  const opener = useRef(null);
  const inside = scene === 'cockpit';
  const finished = completed === repairs.length;
  const current = repairs[completed];
  const detail = repairs[inspected];
  const detailState = repairState(inspected, completed);

  useEffect(() => {
    let alive = true;
    setError(false);
    Promise.all(Object.values(assets).map(src => new Promise((resolve, reject) => {
      const image = new Image(); image.onload = resolve; image.onerror = reject; image.src = src;
    }))).then(() => alive && setLoaded(true)).catch(() => alive && setError(true));
    return () => { alive = false; };
  }, [attempt]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function goTo(next) {
    if (busy.current || next === scene) return;
    busy.current = true; setTransition(true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timers.current.push(setTimeout(() => setScene(next), reduced ? 0 : 320));
    timers.current.push(setTimeout(() => {
      busy.current = false; setTransition(false); mainAction.current?.focus({ preventScroll: true });
    }, reduced ? 20 : 700));
  }
  function openRepair(event, index = Math.min(completed, repairs.length - 1), list = false) {
    opener.current = event.currentTarget; setInspected(index); setShowList(list); dialog.current.showModal();
  }
  function closeRepair() { dialog.current.close(); }
  function finishLesson() {
    const repair = playing;
    setPlaying(null);
    if (repairs[completed]?.id === repair.id) {
      setCompleted(count => completeRepair(count, repair.id));
      setCelebration(repair);
      timers.current.push(setTimeout(() => setCelebration(null), 5000));
    }
    mainAction.current?.focus();
  }

  return <main className="shell">
    <header className="masthead"><a className="brand" href="#" onClick={e => {e.preventDefault(); goTo('exterior');}}><span className="brand-mark">✦</span> TO THE STARS</a><span className="prototype">PLAYABLE PROTOTYPE <i/></span></header>
    <section className={`game ${inside ? 'inside' : 'outside'} ${completed > 0 ? 'powered' : ''} ${transition ? 'travel' : ''}`} aria-label="Chapter one: the damaged ship" aria-busy={transition}>
      <div className="art" aria-hidden="true"><img className="scene-image" src={assets[scene]} alt=""/><div className="shade"/><div className="power-light"/></div>
      {inside && <CockpitEffects completed={completed}/>}
      <div className="scene-top"><div><span className="eyebrow">CHAPTER 01 / STAGE 01 — COCKPIT</span><h1>{inside ? finished ? 'A cockpit reborn.' : 'One system at a time.' : 'A new beginning.'}</h1><p>{inside ? finished ? 'The ship still needs you. The hull is next.' : 'Small repairs. A little closer to the stars.' : 'Your journey to the stars starts here.'}</p></div><div className="location"><span className="location-icon">◎</span>{inside ? 'COCKPIT' : 'LANDING SITE'}</div></div>
      {loaded && !transition && !inside && <button className="hotspot hatch" aria-label="Enter the ship" onClick={() => goTo('cockpit')}><span className="target">↗</span><span className="hotspot-label">Enter the ship</span></button>}
      {loaded && !transition && inside && current && <button className="hotspot repair-hotspot" style={{left:`${current.x}%`,top:`${current.y}%`}} aria-label={`Inspect ${current.name}`} onClick={openRepair}><span className="target">{current.icon}</span><span className="hotspot-label">{current.name}</span></button>}
      {celebration && inside && <div className="repair-toast" key={celebration.id} role="status"><span>✓ {celebration.name}</span><p>{celebration.result}</p></div>}
      <div className="scene-bottom"><div className="status"><span className={`status-dot ${completed > 0 ? 'on' : ''}`}/>{finished ? 'COCKPIT RESTORED · SHIP STILL GROUNDED' : `COCKPIT SYSTEMS ${completed} / ${repairs.length} ONLINE`}</div><div className="mission"><div className="mission-icon">{finished ? '✓' : current.icon}</div><div className="mission-copy"><span className="eyebrow">{finished ? 'STAGE 01 COMPLETE' : `REPAIR ${completed + 1} OF ${repairs.length}`}</span><h2>{finished ? 'Next: the damaged hull' : inside ? current.name : 'Restore the cockpit'}</h2><p>{finished ? 'Next stage is not playable yet. Explore your restored cockpit.' : inside ? current.objective : 'Four systems to repair before moving on to the rest of the ship.'}</p></div><button ref={mainAction} className="primary" disabled={!loaded || transition} onClick={inside ? e => openRepair(e, Math.min(completed, repairs.length - 1), finished) : () => goTo('cockpit')}>{inside ? finished ? 'Review repairs' : 'Inspect repair' : 'Continue repairs'} <span>→</span></button></div></div>
      <div className="curtain" aria-hidden="true"/>
      {!loaded && <div className="loading" role="status">{error ? <><p>The scene could not be loaded.</p><button className="primary" onClick={() => setAttempt(a => a + 1)}>Try again</button></> : 'Preparing the landing site…'}</div>}
    </section>
    <nav className="scene-nav" aria-label="Ship view"><button disabled={transition || !loaded} aria-current={!inside ? 'page' : undefined} onClick={() => goTo('exterior')}><span>◇</span> Exterior</button><span className="nav-line"/><button disabled={transition || !loaded} aria-current={inside ? 'page' : undefined} onClick={() => goTo('cockpit')}><span>⌘</span> Cockpit</button><button className="repairs-button" disabled={transition || !loaded} onClick={e => openRepair(e, 0, true)} aria-label="View cockpit repairs">REPAIRS <b>{completed} / {repairs.length}</b></button></nav>
    <footer><span>01 — A SHIP THAT WILL FLY AGAIN</span><span>Prototype · progress is not saved</span></footer>
    <dialog ref={dialog} aria-labelledby="repair-title" onClose={() => opener.current?.focus()} onClick={e => {if(e.target === dialog.current) closeRepair();}}><div className="repair-panel"><button className="close" aria-label="Close" onClick={closeRepair}>×</button><span className="eyebrow">CHAPTER 01 / COCKPIT</span>
      {showList ? <><h2 id="repair-title">Four steps to life.</h2><p>Repair these systems in order. This is just the first stage of restoring the whole ship.</p><ol className="repair-list">{repairs.map((repair, i) => <li key={repair.id}><button onClick={() => {setInspected(i);setShowList(false);}}><span className={`repair-badge ${repairState(i,completed)}`}>{i < completed ? '✓' : i + 1}</span><span><strong>{repair.name}</strong><small>{repairState(i,completed) === 'complete' ? 'Restored · view or replay' : i === completed ? 'Ready to repair' : `Requires ${repairs[i - 1].name.toLowerCase()}`}</small></span><span>→</span></button></li>)}</ol><div className="demo-note">After the cockpit: hull, living quarters, supplies, navigation, fuel and engines. Departure comes at the end of the ship chapter.</div></> : <>
        <div className="repair-symbol">{detail.icon}</div><h2 id="repair-title">{detail.name}</h2><p>{detailState === 'complete' ? detail.result : detail.description}</p>
        <div className="demo-note"><strong>{detailState === 'locked' ? 'Not available yet' : detailState === 'complete' ? 'System restored' : detail.lesson}</strong><br/>{detailState === 'locked' ? `First restore ${repairs[inspected - 1].name.toLowerCase()}.` : detail.objective}<br/>No boosters. No time or move limit.</div>
        {detailState !== 'locked' && <button className="primary" onClick={() => {closeRepair(); if (!inside) setScene('cockpit'); setPlaying(detail);}}>{detailState === 'complete' ? 'Replay lesson' : 'Play'} <span>→</span></button>}
        <button className="all-repairs" onClick={() => setShowList(true)}>View all cockpit repairs</button>
      </>}
    </div></dialog>
    {playing && <MiniGame key={playing.id} repair={playing} onQuit={() => {setPlaying(null); mainAction.current?.focus();}} onWin={finishLesson}/>}
    <span className="sr-only" role="status" aria-live="polite">{inside ? 'Inside the cockpit.' : 'Outside the damaged ship.'} {completed} of {repairs.length} cockpit repairs complete.</span>
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);