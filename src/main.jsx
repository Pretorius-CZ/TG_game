import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import MiniGame from './MiniGame';
import AudioControls from './AudioControls.jsx';
import { mountAudio, duckMusic, sound } from './audio.js';
import RepairBubble from './RepairBubble.jsx';
import ShipLog from './ShipLog.jsx';
import { logEntries, unlockedLogs } from './logEntries.js';
import { repairs, repairState, completeRepair } from './repairs';

const cockpitScenes = ['cockpit-portrait', 'cockpit-1-lights', 'cockpit-2-windows', 'cockpit-3-computer', 'cockpit-4-diagnostics'].map(name => `/scenes/${name}.webp`);
const exteriorScenes = ['/scenes/exterior-portrait.webp', '/scenes/exterior-cockpit-lit.webp'];
const airlockScenes = ['/scenes/airlock-0-damaged.webp'];
const allScenes = [...cockpitScenes, ...exteriorScenes, ...airlockScenes];

function SceneArt({ inside, airlock, completed }) {
  const scenes = airlock ? airlockScenes : inside ? cockpitScenes : exteriorScenes;
  const index = airlock ? 0 : inside ? completed : completed === repairs.length ? 1 : 0;
  return <div className="art" aria-hidden="true" data-visual-stage={index}>
    {scenes.map((src, i) => <img key={src} className="scene-image scene-layer" src={src} alt="" style={{opacity: i === index ? 1 : 0}}/>)}
    <div className="shade"/>
  </div>;
}
function App() {
  useEffect(mountAudio, []);
  const [scene, setScene] = useState('exterior');
  const [bubble, setBubble] = useState(null);
  const sceneRef = useRef(null);
  const [logView, setLogView] = useState(null);
  const [readIds, setReadIds] = useState([]);
  const logOpener = useRef(null);
  const [transition, setTransition] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [playing, setPlaying] = useState(null);
  useEffect(() => { duckMusic(Boolean(playing)); }, [playing]);
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
  const airlock = scene === 'airlock';
  const finished = completed === repairs.length;
  const current = repairs[completed];
  const detail = repairs[inspected];
  const detailState = repairState(inspected, completed);

  useEffect(() => {
    let alive = true;
    setError(false);
    Promise.all(allScenes.map(src => new Promise((resolve, reject) => {
      const image = new Image(); image.onload = resolve; image.onerror = reject; image.src = src;
    }))).then(() => alive && setLoaded(true)).catch(() => alive && setError(true));
    return () => { alive = false; };
  }, [attempt]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function goTo(next) {
    if (busy.current || next === scene) return;
    setCelebration(null); busy.current = true; setTransition(true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timers.current.push(setTimeout(() => setScene(next), reduced ? 0 : 320));
    timers.current.push(setTimeout(() => {
      busy.current = false; setTransition(false); mainAction.current?.focus({ preventScroll: true });
    }, reduced ? 20 : 700));
  }
  function openRepair(event, index = Math.min(completed, repairs.length - 1), list = false) {
    opener.current = event.currentTarget;
    if (!list && repairState(index, completed) !== 'locked') {
      dialog.current.close(); setCelebration(null); setScene('cockpit'); setBubble(index); return;
    }
    setInspected(index); setShowList(list); dialog.current.showModal();
  }
  function openLog(event, id = null) { logOpener.current = event.currentTarget; setLogView({ id }); }
  function closeLog() { setLogView(null); logOpener.current?.focus(); }
  function closeRepair() { dialog.current.close(); }
  function finishLesson() {
    const repair = playing;
    setPlaying(null);
    if (repairs[completed]?.id === repair.id) {
      setCompleted(count => completeRepair(count, repair.id));
      setCelebration(repair); sound('repair');
    }
    mainAction.current?.focus();
  }

  return <main className="shell">
    <header className="masthead"><a className="brand" href="#" onClick={e => {e.preventDefault(); goTo(inside ? 'airlock' : 'exterior');}}><span className="brand-mark">✦</span> TO THE STARS</a><span className="prototype">PLAYABLE PROTOTYPE <i/></span></header>
    <section ref={sceneRef} className={`game ${bubble != null ? 'story-open' : ''} ${airlock ? 'airlock' : inside ? 'inside' : 'outside'} ${celebration ? 'show-repair' : ''} ${transition ? 'travel' : ''}`} aria-label="Chapter one: the damaged ship" aria-busy={transition}>
      <SceneArt inside={inside} airlock={airlock} completed={completed}/>
      {completed >= 2 && !airlock && <div className={`ridge-lights ${inside ? 'ridge-inside' : 'ridge-outside'}`} aria-hidden="true"><i/><i/><i/><i/><i/></div>}

      <div className="scene-top"><div><span className="eyebrow">{airlock ? 'CHAPTER 01 / SHIP ACCESS' : 'CHAPTER 01 / STAGE 01 — COCKPIT'}</span><h1>{airlock ? 'Welcome aboard.' : inside ? finished ? 'A cockpit reborn.' : 'One system at a time.' : 'A new beginning.'}</h1><p>{airlock ? 'One doorway. A whole ship to restore.' : inside ? finished ? 'The ship still needs you. The hull is next.' : 'Small repairs. A little closer to the stars.' : 'Your journey to the stars starts here.'}</p></div><div className="location"><span className="location-icon">◎</span>{airlock ? 'AIRLOCK' : inside ? 'COCKPIT' : 'LANDING SITE'}</div></div>
      {loaded && !transition && scene === 'exterior' && <button className="hotspot hatch" aria-label="Enter the ship" onClick={() => goTo('airlock')}><span className="target">↗</span><span className="hotspot-label">Enter the ship</span></button>}
      {loaded && !transition && airlock && <button className="hotspot" style={{left:'29%',top:'38%'}} aria-label="Enter cockpit" onClick={()=>goTo('cockpit')}><span className="target">↗</span><span className="hotspot-label">Cockpit</span></button>}
      {loaded && !transition && !celebration && inside && current && <button className="hotspot repair-hotspot" style={{left:`${current.x}%`,top:`${current.y}%`}} aria-label={`Inspect ${current.name}`} onClick={openRepair}><span className="target">{current.icon}</span><span className="hotspot-label">{current.name}</span></button>}
      {celebration && inside && <div className="repair-reveal" role="region" aria-label="Repair completed">
        <span className="eyebrow">REPAIR COMPLETE</span>
        <h2>{`✓ ${celebration.name}`}</h2>
        <p role="status">{celebration.result}</p>
<button className="new-log" onClick={e => openLog(e, logEntries.find(entry => entry.repair === celebration.id)?.id)}><span>▤</span> {readIds.includes(logEntries.find(entry => entry.repair === celebration.id)?.id) ? 'Read ship log entry' : 'New log entry'} <span>→</span></button>
        <button className="primary" onClick={() => {setCelebration(null);if(finished) goTo('airlock');}}>{finished ? 'Return to airlock' : 'Continue repairs'} <span>→</span></button>
      </div>}
      {airlock ? <div className="scene-bottom"><div className="mission"><div className="mission-copy"><span className="eyebrow">SHIP DIRECTORY</span><h2>Your way through the ship</h2><p>{finished ? 'Cockpit restored. Airlock repairs are coming next.' : 'Start in the cockpit. The other compartments will follow.'}</p></div><button ref={mainAction} className="primary" disabled={!loaded || transition} onClick={()=>goTo('cockpit')}>Enter cockpit <span>→</span></button></div><div className="room-directory">{['Crew quarters','Galley & supplies','Engine room'].map(name=><div key={name}><span>{name}</span><small>Locked · coming later</small></div>)}</div></div> : <div className="scene-bottom"><div className="status"><span className={`status-dot ${completed > 0 ? 'on' : ''}`}/>{finished ? 'COCKPIT RESTORED · SHIP STILL GROUNDED' : `COCKPIT SYSTEMS ${completed} / ${repairs.length} ONLINE`}</div><div className="mission"><div className="mission-icon">{finished ? '✓' : current.icon}</div><div className="mission-copy"><span className="eyebrow">{finished ? 'STAGE 01 COMPLETE' : `REPAIR ${completed + 1} OF ${repairs.length}`}</span><h2>{finished ? 'Next: the damaged hull' : inside ? current.name : 'Restore the cockpit'}</h2><p>{finished ? 'Next stage is not playable yet. Explore your restored cockpit.' : inside ? current.objective : 'Four systems to repair before moving on to the rest of the ship.'}</p></div><button ref={mainAction} className="primary" disabled={!loaded || transition} onClick={inside ? e => openRepair(e, Math.min(completed, repairs.length - 1), finished) : () => goTo('airlock')}>{inside ? finished ? 'Review repairs' : 'Inspect repair' : 'Enter the ship'} <span>→</span></button></div></div>}
      <div className="curtain" aria-hidden="true"/>
      {!loaded && <div className="loading" role="status">{error ? <><p>The scene could not be loaded.</p><button className="primary" onClick={() => setAttempt(a => a + 1)}>Try again</button></> : 'Preparing the landing site…'}</div>}
    </section>
    <nav className="scene-nav" aria-label="Ship view"><button disabled={transition || !loaded} onClick={()=>goTo(inside ? 'airlock' : airlock ? 'exterior' : 'airlock')}>{inside ? '← Airlock' : airlock ? '← Exterior' : 'Enter airlock →'}</button><span className="nav-line"/><span className="nav-location">{airlock ? 'Airlock' : inside ? 'Cockpit' : 'Exterior'}</span>{inside && <button className="repairs-button" disabled={transition || !loaded} onClick={e => openRepair(e, 0, true)} aria-label="View cockpit repairs">REPAIRS <b>{completed} / {repairs.length}</b></button>}</nav>
    <button className="ship-log-button" onClick={e => openLog(e)} disabled={transition || !loaded}><span>▤ Ship log</span><span>{unlockedLogs(completed).filter(entry => !readIds.includes(entry.id)).length ? `${unlockedLogs(completed).filter(entry => !readIds.includes(entry.id)).length} unread` : 'Open archive'} →</span></button>
    <AudioControls/>
    <footer><span>01 — A SHIP THAT WILL FLY AGAIN</span><span>Prototype · progress is not saved</span></footer>
    <dialog ref={dialog} aria-labelledby="repair-title" onClose={() => opener.current?.focus()} onClick={e => {if(e.target === dialog.current) closeRepair();}}><div className="repair-panel"><button className="close" aria-label="Close" onClick={closeRepair}>×</button><span className="eyebrow">CHAPTER 01 / COCKPIT</span>
      {showList ? <><h2 id="repair-title">Four steps to life.</h2><p>Repair these systems in order. This is just the first stage of restoring the whole ship.</p><ol className="repair-list">{repairs.map((repair, i) => <li key={repair.id}><button onClick={e => openRepair(e, i)}><span className={`repair-badge ${repairState(i,completed)}`}>{i < completed ? '✓' : i + 1}</span><span><strong>{repair.name}</strong><small>{repairState(i,completed) === 'complete' ? 'Restored · view or replay' : i === completed ? 'Ready to repair' : `Requires ${repairs[i - 1].name.toLowerCase()}`}</small></span><span>→</span></button></li>)}</ol><div className="demo-note">After the cockpit: hull, living quarters, supplies, navigation, fuel and engines. Departure comes at the end of the ship chapter.</div></> : <>
        <div className="repair-symbol">{detail.icon}</div><h2 id="repair-title">{detail.name}</h2><p>{detailState === 'complete' ? detail.result : detail.description}</p>
        <div className="demo-note"><strong>{detailState === 'locked' ? 'Not available yet' : detailState === 'complete' ? 'System restored' : detail.lesson}</strong><br/>{detailState === 'locked' ? `First restore ${repairs[inspected - 1].name.toLowerCase()}.` : detail.objective}<br/>No boosters. No time or move limit.</div>
        {detailState !== 'locked' && <button className="primary" onClick={() => {closeRepair(); if (!inside) setScene('cockpit'); setPlaying(detail);}}>{detailState === 'complete' ? 'Replay lesson' : 'Play'} <span>→</span></button>}
        <button className="all-repairs" onClick={() => setShowList(true)}>View all cockpit repairs</button>
      </>}
    </div></dialog>
    {bubble != null && <RepairBubble repair={repairs[bubble]} replay={bubble < completed} sceneRef={sceneRef} onClose={() => {setBubble(null);requestAnimationFrame(() => {if(opener.current?.isConnected && !opener.current.closest('dialog:not([open])')) opener.current.focus();else mainAction.current?.focus();});}} onPlay={() => {setPlaying(repairs[bubble]);setBubble(null);}}/>}
    {logView && <ShipLog completed={completed} readIds={readIds} initialId={logView.id} onRead={id => setReadIds(ids => ids.includes(id) ? ids : [...ids, id])} onClose={closeLog}/>}
    {playing && <MiniGame key={playing.id} repair={playing} onQuit={() => {setPlaying(null); mainAction.current?.focus();}} onWin={finishLesson}/>}
    <span className="sr-only" role="status" aria-live="polite">{airlock ? 'Inside the airlock.' : inside ? 'Inside the cockpit.' : 'Outside the damaged ship.'} {completed} of {repairs.length} cockpit repairs complete.</span>
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);