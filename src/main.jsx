import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import {finaleRepair} from './levelRules.js';
import {LivesProvider,LivesBar} from './Lives.jsx';
import MiniGame from './MiniGame';
import CorridorArt from './CorridorArt.jsx';
import CrewQuarters from './CrewQuarters.jsx';
import {crewLogs} from './crewRepairs.js';
import {galleyLogs} from './galleyRepairs.js';
import {engineLogs} from './engineRepairs.js';
import {airlockLogs,exteriorStage} from './airlockRepairs.js';
import {navigationRepairs,navigationLogs,shipReadiness} from './navigationRepairs.js';
import {Antenna} from './NavigationArt.jsx';
import AudioControls from './AudioControls.jsx';
import { mountAudio, duckMusic, sound } from './audio.js';
import RepairBubble from './RepairBubble.jsx';
import ShipLog from './ShipLog.jsx';
import { logEntries, unlockedLogs } from './logEntries.js';
import { repairs, repairState, completeRepair } from './repairs';

const cockpitScenes = ['cockpit-portrait', 'cockpit-1-lights', 'cockpit-2-windows', 'cockpit-3-computer', 'cockpit-4-diagnostics'].map(name => `/scenes/${name}.webp`);
const exteriorScenes = ['/scenes/exterior-portrait.webp', '/scenes/exterior-cockpit-lit.webp','/scenes/exterior-hull.webp','/scenes/exterior-sealed.webp'];
const airlockScenes = Array.from({length:5},(_,i)=>`/scenes/airlock-${i}.webp`);
const allScenes = [...cockpitScenes, ...exteriorScenes, ...airlockScenes, '/scenes/corridor-dark.webp', '/scenes/corridor-concept.webp'];

function SceneArt({ inside, airlock, completed, airlockCompleted, navigationCompleted=0 }) {
  const scenes = airlock ? airlockScenes : inside ? cockpitScenes : exteriorScenes;
  const index = airlock ? airlockCompleted : inside ? completed : exteriorStage(completed,airlockCompleted);
  return <div className="art" aria-hidden="true" data-visual-stage={index}>
    {scenes.map((src, i) => <img key={src} className="scene-image scene-layer" src={src} alt="" style={{opacity: i === index ? 1 : 0}}/>)}
    {!inside&&!airlock&&<Antenna deployed={navigationCompleted>0}/>}
    <div className="shade"/>
  </div>;
}
function finishedRoomIds(cockpitRepairs) { return cockpitRepairs === repairs.length ? ['cockpit'] : []; }
function App() {
  useEffect(mountAudio, []);
  const [mapOpen,setMapOpen]=useState(false);
  const mapDialog=useRef(null);
  useEffect(()=>{if(mapOpen)mapDialog.current?.showModal();},[mapOpen]);
  const [finaleDone,setFinaleDone]=useState(false);
  const [scene, setScene] = useState('exterior');
  const [bubble, setBubble] = useState(null);
  const sceneRef = useRef(null);
  const [logView, setLogView] = useState(null);
  const [readIds, setReadIds] = useState([]);
  const logOpener = useRef(null);
  const [transition, setTransition] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [crewCompleted, setCrewCompleted] = useState(0);
  const [galleyCompleted,setGalleyCompleted]=useState(0);
  const [engineCompleted,setEngineCompleted]=useState(0);
  const [airlockCompleted,setAirlockCompleted]=useState(0);
  const [navigationCompleted,setNavigationCompleted]=useState(0);
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
  const corridor = scene === 'corridor';
  const crew = scene === 'crew';
  const galley = scene === 'galley';
  const engine = scene === 'engine';
  const airlockWork=scene==='airlock-work';
  const navigation=scene==='navigation';
  const readiness=shipReadiness({cockpit:completed,'airlock-work':airlockCompleted,crew:crewCompleted,galley:galleyCompleted,engine:engineCompleted,navigation:navigationCompleted});
  const allSystemsReady=readiness.every(r=>r.ready);
  const nextSystem=readiness.find(r=>!r.ready);
  const allRoomsDone=crewCompleted===4&&galleyCompleted===4&&engineCompleted===5;
  const archive = [...logEntries.map(e=>({...e,available:e.unlockAt<=completed})),...crewLogs.map(e=>({...e,available:e.unlockAt<=crewCompleted,unlockAt:e.unlockAt+4})),...galleyLogs.map(e=>({...e,available:e.unlockAt<=galleyCompleted,unlockAt:e.unlockAt+8})),...engineLogs.map(e=>({...e,available:e.unlockAt<=engineCompleted,unlockAt:e.unlockAt+12})),...airlockLogs.map(e=>({...e,available:e.unlockAt<=airlockCompleted,unlockAt:e.unlockAt+17})),...navigationLogs.map(e=>({...e,available:e.unlockAt<=navigationCompleted,unlockAt:e.unlockAt+21}))];
  // Each room owns its completion; corridor lighting never follows total repair count.
  const completedRoomIds = [...finishedRoomIds(completed),...(crewCompleted===4?['crew-quarters']:[]),...(galleyCompleted===4?['galley']:[]),...(engineCompleted===5?['engine-room']:[])];
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
    if (busy.current || next === scene || (['crew','galley','engine','airlock-work','navigation'].includes(next) && completed<repairs.length)) return;
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
  function finishLesson(repair = playing) {
    setPlaying(null);
    if (repairs[completed]?.id === repair.id) {
      setCompleted(count => completeRepair(count, repair.id));
      setCelebration(repair); sound('repair');
    }
    mainAction.current?.focus();
  }

  return <main className="shell">
    <header className="masthead"><a className="brand" href="#" onClick={e => {e.preventDefault(); goTo(navigation?'cockpit':airlockWork?'airlock':crew || galley || engine ? 'corridor' : inside || corridor ? 'airlock' : 'exterior');}}><span className="brand-mark">✦</span> TO THE STARS</a><span className="prototype">PLAYABLE PROTOTYPE <i/></span></header>
    <div className="play-area"><nav className="scene-tools" aria-label="Scene controls"><button aria-label="Go back" disabled={transition} onClick={()=>goTo(navigation?'cockpit':airlockWork?'airlock':crew||galley||engine?'corridor':inside||corridor?'airlock':airlock?'exterior':'airlock')}>←</button><button aria-label="Open ship map" onClick={()=>setMapOpen(true)}>▦</button><button aria-label="Open ship log" onClick={e=>openLog(e)}>▤</button></nav><div className="scene-lives"><LivesBar/></div>
    {crew || galley || engine || airlockWork || navigation ? <CrewQuarters key={scene} room={airlockWork?'airlock':scene} completed={navigation?navigationCompleted:airlockWork?airlockCompleted:engine?engineCompleted:galley?galleyCompleted:crewCompleted} onCompleted={navigation?setNavigationCompleted:airlockWork?setAirlockCompleted:engine?setEngineCompleted:galley?setGalleyCompleted:setCrewCompleted} onBack={()=>goTo(navigation?'cockpit':airlockWork?'airlock':'corridor')} exteriorView={<div data-hull-reveal="true"><img className="scene-image scene-layer" src={exteriorScenes[exteriorStage(completed,airlockCompleted)]} alt=""/><Antenna deployed={navigationCompleted>0}/></div>} onLog={id=>setLogView({id})}/> : <>
    <section ref={sceneRef} className={`game ${bubble != null ? 'story-open' : ''} ${corridor ? 'corridor' : airlock ? 'airlock' : inside ? 'inside' : 'outside'} ${celebration ? 'show-repair' : ''} ${transition ? 'travel' : ''}`} aria-label="Chapter one: the damaged ship" aria-busy={transition}>
      {corridor ? <CorridorArt completedRoomIds={completedRoomIds}/> : <SceneArt inside={inside} airlock={airlock} completed={completed} airlockCompleted={airlockCompleted} navigationCompleted={navigationCompleted}/>}
      {completed >= 2 && !airlock && !corridor && <div className={`ridge-lights ${inside ? 'ridge-inside' : 'ridge-outside'}`} aria-hidden="true"><i/><i/><i/><i/><i/></div>}

      <div className="scene-top"><div><span className="eyebrow">{corridor ? 'CHAPTER 01 / INNER DECK' : airlock ? 'CHAPTER 01 / SHIP ACCESS' : 'CHAPTER 01 / STAGE 01 — COCKPIT'}</span><h1>{corridor ? allRoomsDone ? 'Light through the ship.' : crewCompleted===4 || galleyCompleted===4 || engineCompleted===5 ? 'A little more light.' : 'Quiet for now.' : airlock ? 'Welcome aboard.' : inside ? finished ? 'A cockpit reborn.' : 'One system at a time.' : 'A new beginning.'}</h1><p>{corridor ? 'Each restored room brings a little light.' : airlock ? 'One doorway. A whole ship to restore.' : inside ? finished ? 'The ship still needs you. Choose your next repair.' : 'Small repairs. A little closer to the stars.' : 'Your journey to the stars starts here.'}</p></div><div className="location"><span className="location-icon">◎</span>{corridor ? 'CORRIDOR' : airlock ? 'AIRLOCK' : inside ? 'COCKPIT' : 'LANDING SITE'}</div></div>
      {loaded && !transition && corridor && finished && <button className="hotspot crew-door" style={{left:'18%',top:'37%'}} aria-label="Enter crew quarters" onClick={()=>goTo('crew')}><span className="target">↗</span><span className="hotspot-label">Crew quarters</span></button>}
      {loaded && !transition && corridor && finished && <button className="hotspot crew-door" style={{left:'82%',top:'37%'}} aria-label="Enter galley" onClick={()=>goTo('galley')}><span className="target">↗</span><span className="hotspot-label">Galley</span></button>}
      {loaded && !transition && corridor && finished && <button className="hotspot crew-door engine-door" style={{left:'50%',top:'37%'}} aria-label="Enter engine room" onClick={()=>goTo('engine')}><span className="target">↗</span><span className="hotspot-label">Engine room</span></button>}
      {loaded && !transition && scene === 'exterior' && <button className="hotspot hatch" aria-label="Enter the ship" onClick={() => goTo('airlock')}><span className="target">↗</span><span className="hotspot-label">Enter the ship</span></button>}
      {loaded && !transition && airlock && <button className="hotspot" style={{left:'29%',top:'38%'}} aria-label="Enter cockpit" onClick={()=>goTo('cockpit')}><span className="target">↗</span><span className="hotspot-label">Cockpit</span></button>}
      {loaded && !transition && airlock && <button className="hotspot airlock-corridor-door" style={{left:'83%',top:'37%'}} aria-label="Enter corridor" onClick={()=>goTo('corridor')}><span className="target">↗</span><span className="hotspot-label">Corridor</span></button>}
      {loaded && !transition && !celebration && inside && current && <button className="hotspot repair-hotspot" style={{left:`${current.x}%`,top:`${current.y}%`}} aria-label={`Inspect ${current.name}`} onClick={openRepair}><span className="target">{current.icon}</span><span className="hotspot-label">{current.name}</span></button>}
      {inside&&finished&&loaded&&!transition&&<button className="cockpit-navigation-console" aria-label="Open navigation console" onClick={()=>goTo('navigation')}><svg viewBox="0 0 140 80" aria-hidden="true"><path className="nav-orbit" d="M18 51Q47 3 115 28Q130 49 70 67Q32 75 18 51Z"/><path d="M27 53L57 34L90 45L117 22" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="27" cy="53" r="4"/><circle cx="57" cy="34" r="3"/><circle cx="90" cy="45" r="3"/><path d="M117 13L120 20L127 22L120 25L117 32L114 25L107 22L114 20Z"/></svg><strong>NAVIGATION ↗</strong><small>{navigationCompleted===4?'COURSE VERIFIED':`TAP TO CONNECT · ${navigationCompleted}/4`}</small></button>}
      {celebration && inside && <div className="repair-reveal" role="region" aria-label="Repair completed">
        <span className="eyebrow">REPAIR COMPLETE</span>
        <h2>{`✓ ${celebration.name}`}</h2>
        <p role="status">{celebration.result}</p>
<button className="new-log" onClick={e => openLog(e, logEntries.find(entry => entry.repair === celebration.id)?.id)}><span>▤</span> {readIds.includes(logEntries.find(entry => entry.repair === celebration.id)?.id) ? 'Read ship log entry' : 'New log entry'} <span>→</span></button>
        <button className="primary" onClick={() => {setCelebration(null);if(finished) goTo('airlock');}}>{finished ? 'Return to airlock' : 'Continue repairs'} <span>→</span></button>
      </div>}
      {corridor ? <div className="scene-bottom corridor-summary"><span className="eyebrow">{allRoomsDone?'CORRIDOR LIGHTING RESTORED':'ROOM LIGHTS FOLLOW REPAIRS'}</span><p>{allRoomsDone?(allSystemsReady?'All ship systems are restored. Return to the cockpit.':'Living areas and engines are restored. Check remaining systems in the cockpit.'):'Door lights return when each room is restored. Main lights return after all three.'}</p><div className="room-directory"><button className="crew-entry" disabled={!finished || transition} onClick={()=>goTo('crew')}>Crew quarters <small>{crewCompleted===4?'Restored · visit':finished?'Ready to repair →':'Restore the cockpit first'}</small></button><button className="crew-entry" disabled={!finished || transition} onClick={()=>goTo('galley')}>Galley &amp; supplies <small>{galleyCompleted===4?'Restored · visit':finished?'Ready to repair →':'Restore the cockpit first'}</small></button><button className="crew-entry" disabled={!finished || transition} onClick={()=>goTo('engine')}>Engine room <small>{engineCompleted===5?'Restored · visit':finished?'Ready to repair →':'Restore the cockpit first'}</small></button></div><button ref={mainAction} className="primary" disabled={transition} onClick={()=>goTo('airlock')}>Back to airlock <span>←</span></button></div> : airlock ? <div className="scene-bottom"><div className="mission"><div className="mission-copy"><span className="eyebrow">AIRLOCK &amp; HULL · {airlockCompleted} / 4</span><h2>Your way through the ship</h2><p>{finished ? 'Choose airlock repairs or explore the rooms beyond the corridor.' : 'Start in the cockpit. The other compartments will follow.'}</p></div><button ref={mainAction} className="primary" disabled={!loaded || transition} onClick={()=>goTo('cockpit')}>Enter cockpit <span>→</span></button></div><button className="corridor-entry" disabled={!loaded || transition || !finished} onClick={()=>goTo('airlock-work')}><span>{airlockCompleted===4?'Airlock & hull restored':'Repair airlock & hull'}</span><small>{finished?`${airlockCompleted} / 4 repairs · Inspect →`:'Restore the cockpit first'}</small></button><button className="corridor-entry" disabled={!loaded || transition} onClick={()=>goTo('corridor')}><span>Explore corridor</span><small>Crew quarters · Galley · Engine room →</small></button></div> : inside&&finished ? <div className="scene-bottom cockpit-next"><div className="status">NAVIGATION {navigationCompleted}/4 · SHIP {readiness.reduce((n,r)=>n+r.completed,0)}/25</div><div className="mission"><div className="mission-copy"><span className="eyebrow">{navigationCompleted<4?'COMMUNICATIONS & NAVIGATION':'DEPARTURE CHECK'}</span><h2>{navigationCompleted<4?navigationRepairs[navigationCompleted].name:allSystemsReady?'Ready for the stars.':'Course set. Finish the ship.'}</h2><p>{navigationCompleted<4?navigationRepairs[navigationCompleted].objective:allSystemsReady?(finaleDone?'Launch check complete. Chapter one restored.':'Final challenge: clear the frozen launch relays.'):`Still needed: ${readiness.filter(r=>!r.ready).map(r=>r.name).join(', ')}.`}</p></div><button ref={mainAction} className="primary" disabled={!loaded||transition} onClick={()=>{if(allSystemsReady&&!finaleDone)setPlaying(finaleRepair);else goTo(navigationCompleted<4?'navigation':nextSystem?.id??'navigation');}}>{navigationCompleted<4?'Open navigation':nextSystem?`Continue: ${nextSystem.name}`:finaleDone?'Review course':'Final challenge · HARD'} <span>→</span></button></div></div> : <div className="scene-bottom"><div className="status"><span className={`status-dot ${completed > 0 ? 'on' : ''}`}/>{finished ? 'COCKPIT RESTORED · SHIP STILL GROUNDED' : `COCKPIT SYSTEMS ${completed} / ${repairs.length} ONLINE`}</div><div className="mission"><div className="mission-icon">{finished ? '✓' : current.icon}</div><div className="mission-copy"><span className="eyebrow">{finished ? 'STAGE 01 COMPLETE' : `REPAIR ${completed + 1} OF ${repairs.length}`}</span><h2>{finished ? (airlockCompleted===4?'Hull secured. Keep exploring.':'Next: the damaged hull') : inside ? current.name : 'Restore the cockpit'}</h2><p>{finished ? 'Return to the airlock. Repair its systems or choose a room in the corridor.' : inside ? current.objective : 'Four systems to repair before moving on to the rest of the ship.'}</p></div><button ref={mainAction} className="primary" disabled={!loaded || transition} onClick={inside && !finished ? e => openRepair(e, completed) : () => goTo('airlock')}>{inside ? finished ? 'Return to airlock' : 'Inspect repair' : 'Enter the ship'} <span>→</span></button></div></div>}
      <div className="curtain" aria-hidden="true"/>
      {!loaded && <div className="loading" role="status">{error ? <><p>The scene could not be loaded.</p><button className="primary" onClick={() => setAttempt(a => a + 1)}>Try again</button></> : 'Preparing the landing site…'}</div>}
    </section>
    </>}
    </div>
    {mapOpen&&<div className="ship-map-backdrop" onClick={()=>setMapOpen(false)}><dialog ref={mapDialog} className="ship-map" onCancel={()=>setMapOpen(false)} aria-label="Ship map" onClick={e=>e.stopPropagation()}><button className="close" autoFocus onClick={()=>setMapOpen(false)}>×</button><h2>Ship map</h2><div className="readiness-list">{readiness.map(r=><button key={r.id} disabled={r.id!=='cockpit'&&!finished} data-system={r.id} data-ready={r.ready} onClick={()=>{setMapOpen(false);goTo(r.id);}}><span>{r.ready?'✓':'○'} {r.name}</span><b>{r.completed}/{r.total}</b></button>)}</div><button className="primary" onClick={()=>{setMapOpen(false);goTo('exterior');}}>View ship</button></dialog></div>}
    <AudioControls/>
    <footer><span>01 — A SHIP THAT WILL FLY AGAIN</span><span>Prototype · progress is not saved</span></footer>
    <dialog ref={dialog} aria-labelledby="repair-title" onClose={() => opener.current?.focus()} onClick={e => {if(e.target === dialog.current) closeRepair();}}><div className="repair-panel"><button className="close" aria-label="Close" onClick={closeRepair}>×</button><span className="eyebrow">CHAPTER 01 / COCKPIT</span>
      {showList ? <><h2 id="repair-title">Four steps to life.</h2><p>Repair these systems in order. This is just the first stage of restoring the whole ship.</p><ol className="repair-list">{repairs.map((repair, i) => <li key={repair.id}><button onClick={e => openRepair(e, i)}><span className={`repair-badge ${repairState(i,completed)}`}>{i < completed ? '✓' : i + 1}</span><span><strong>{repair.name}</strong><small>{repairState(i,completed) === 'complete' ? 'Restored · view or replay' : i === completed ? 'Ready to repair' : `Requires ${repairs[i - 1].name.toLowerCase()}`}</small></span><span>→</span></button></li>)}</ol><div className="demo-note">After the cockpit: hull, living quarters, supplies, navigation, fuel and engines. Departure comes at the end of the ship chapter.</div></> : <>
        <div className="repair-symbol">{detail.icon}</div><h2 id="repair-title">{detail.name}</h2><p>{detailState === 'complete' ? detail.result : detail.description}</p>
        <div className="demo-note"><strong>{detailState === 'locked' ? 'Not available yet' : detailState === 'complete' ? 'System restored' : detail.lesson}</strong><br/>{detailState === 'locked' ? `First restore ${repairs[inspected - 1].name.toLowerCase()}.` : detail.objective}<br/>No boosters. Valid swaps use one move.</div>
        {detailState !== 'locked' && <button className="primary" onClick={() => {closeRepair(); if (!inside) setScene('cockpit'); setPlaying(detail);}}>{detailState === 'complete' ? 'Replay lesson' : 'Play'} <span>→</span></button>}
        <button className="all-repairs" onClick={() => setShowList(true)}>View all cockpit repairs</button>
      </>}
    </div></dialog>
    {bubble != null && <RepairBubble repair={repairs[bubble]} replay={bubble < completed} sceneRef={sceneRef} onComplete={()=>{const repair=repairs[bubble];setBubble(null);finishLesson(repair);}} onClose={() => {setBubble(null);requestAnimationFrame(() => {if(opener.current?.isConnected && !opener.current.closest('dialog:not([open])')) opener.current.focus();else mainAction.current?.focus();});}} onPlay={() => {setPlaying(repairs[bubble]);setBubble(null);}}/>}
    {logView && <ShipLog entries={archive} completed={completed} readIds={readIds} initialId={logView.id} onRead={id => setReadIds(ids => ids.includes(id) ? ids : [...ids, id])} onClose={closeLog}/>}
    {playing && <MiniGame key={playing.id} repair={playing} onQuit={() => {setPlaying(null); mainAction.current?.focus();}} onWin={()=>{if(playing.id===finaleRepair.id){if(allSystemsReady){setFinaleDone(true);setPlaying(null);sound('repair');}}else finishLesson();}}/>}
    <span className="sr-only" role="status" aria-live="polite">{corridor ? 'Inside the corridor. Emergency lighting only.' : airlock ? 'Inside the airlock.' : inside ? 'Inside the cockpit.' : 'Outside the damaged ship.'} {completed} of {repairs.length} cockpit repairs complete.</span>
  </main>;
}
createRoot(document.getElementById('root')).render(<LivesProvider><App/></LivesProvider>);
