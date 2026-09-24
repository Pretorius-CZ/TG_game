import {havenLogs,jumpLog,gateReady} from './haven.js';
import {iceLogs,wreckLogs,havenLog,havenLocated} from './destinations.js';
import Exploration from './Exploration.jsx';
import {mineLogs} from './exploration.js';
import Departure from './Departure.jsx';
import {departureLog} from './departure.js';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import useProgressSave,{initialProgress} from './useProgressSave.js';
import {AccountProvider,AccountButton,useAccount} from './Account.jsx';
import {mergeProgress} from './progressStorage.js';
import {finaleRepair} from './levelRules.js';
import {LivesProvider,LivesBar} from './Lives.jsx';
import MiniGame from './MiniGame';
import CorridorArt from './CorridorArt.jsx';
import CrewQuarters from './CrewQuarters.jsx';
import {crewLogs} from './crewRepairs.js';
import {galleyLogs} from './galleyRepairs.js';
import {engineLogs} from './engineRepairs.js';
import {airlockLogs} from './airlockRepairs.js';
import {navigationRepairs,navigationLogs,shipReadiness} from './navigationRepairs.js';
import ExteriorArt from './ExteriorArt.jsx';
import {exteriorLogs} from './exteriorRepairs.js';
import AudioControls from './AudioControls.jsx';
import { mountAudio, duckMusic, sound } from './audio.js';
import RepairBubble from './RepairBubble.jsx';
import ShipLog from './ShipLog.jsx';
import { logEntries, unlockedLogs } from './logEntries.js';
import { repairs, repairState, completeRepair } from './repairs';

const cockpitScenes = ['cockpit-portrait', 'cockpit-1-lights', 'cockpit-2-windows', 'cockpit-3-computer', 'cockpit-4-diagnostics'].map(name => `./scenes/${name}.webp`);
const exteriorScenes = ['./scenes/exterior-portrait.webp', './scenes/exterior-cockpit-lit.webp','./scenes/exterior-hull.webp','./scenes/exterior-sealed.webp'];
const airlockScenes = Array.from({length:5},(_,i)=>`./scenes/airlock-${i}.webp`);
const allScenes = [...cockpitScenes, ...exteriorScenes, ...airlockScenes, './scenes/corridor-dark.webp', './scenes/corridor-concept.webp'];

function SceneArt({inside,airlock,completed,airlockCompleted}) {
 const scenes=airlock?airlockScenes:cockpitScenes,index=airlock?airlockCompleted:completed;
 return <div className="art" aria-hidden="true">{scenes.map((src,i)=><img key={src} className="scene-image scene-layer" src={src} alt="" style={{opacity:i===index?1:0}}/>)}<div className="shade"/></div>;
}
function finishedRoomIds(cockpitRepairs) { return cockpitRepairs === repairs.length ? ['cockpit'] : []; }
function App() {
  useEffect(mountAudio, []);
  const {user}=useAccount();
  const [progress,setProgress]=useState(()=>initialProgress(user?.id));
  const saveStatus=useProgressSave(progress,setProgress);
  const [launching,setLaunching]=useState(false);
  const {mineCompleted,launchDone,finaleDone,scene,readIds,completed,crewCompleted,galleyCompleted,engineCompleted,airlockCompleted,exteriorCompleted,navigationCompleted}=progress;
  const setter=key=>value=>setProgress(previous=>({...previous,[key]:typeof value==='function'?value(previous[key]):value}));
  const setFinaleDone=setter('finaleDone'),setScene=setter('scene'),setReadIds=setter('readIds'),setCompleted=setter('completed'),setCrewCompleted=setter('crewCompleted'),setGalleyCompleted=setter('galleyCompleted'),setEngineCompleted=setter('engineCompleted'),setAirlockCompleted=setter('airlockCompleted'),setExteriorCompleted=setter('exteriorCompleted'),setNavigationCompleted=setter('navigationCompleted');
  const [mapOpen,setMapOpen]=useState(false);
  const mapDialog=useRef(null);
  useEffect(()=>{if(mapOpen)mapDialog.current?.showModal();},[mapOpen]);
  const [bubble, setBubble] = useState(null);
  const sceneRef = useRef(null);
  const [logView, setLogView] = useState(null);
  const logOpener = useRef(null);
  const [transition, setTransition] = useState(false);
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
  const exterior=scene==='exterior';
  const exploring=['system','mine','ice','wreck','haven','system2'].includes(scene);
  const readiness=shipReadiness({cockpit:completed,exterior:exteriorCompleted,'airlock-work':airlockCompleted,crew:crewCompleted,galley:galleyCompleted,engine:engineCompleted,navigation:navigationCompleted});
  const allSystemsReady=readiness.every(r=>r.ready);
  const nextSystem=readiness.find(r=>!r.ready);
  const allRoomsDone=crewCompleted===4&&galleyCompleted===4&&engineCompleted===5;
  const archive = [{...jumpLog,available:progress.jumpDone},...havenLogs.map((e,i)=>({...e,available:(progress.havenCompleted??0)>i})),{...havenLog,available:havenLocated(progress)},...iceLogs.map((e,i)=>({...e,available:(progress.iceCompleted??0)>i})),...wreckLogs.map((e,i)=>({...e,available:(progress.wreckCompleted??0)>i})),...mineLogs.map((e,i)=>({...e,available:launchDone&&mineCompleted>i})),{...departureLog,available:launchDone},...logEntries.map(e=>({...e,available:e.unlockAt<=completed})),...crewLogs.map(e=>({...e,available:e.unlockAt<=crewCompleted,unlockAt:e.unlockAt+4})),...galleyLogs.map(e=>({...e,available:e.unlockAt<=galleyCompleted,unlockAt:e.unlockAt+8})),...engineLogs.map(e=>({...e,available:e.unlockAt<=engineCompleted,unlockAt:e.unlockAt+12})),...airlockLogs.map(e=>({...e,available:e.unlockAt<=airlockCompleted,unlockAt:e.unlockAt+17})),...exteriorLogs.map(e=>({...e,available:e.unlockAt<=exteriorCompleted,unlockAt:e.unlockAt+24})),...navigationLogs.map(e=>({...e,available:e.unlockAt<=navigationCompleted,unlockAt:e.unlockAt+20}))];
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
    if(next==='airlock-work')next='airlock';
    if(['system','mine','ice','wreck','haven','system2'].includes(next)&&!launchDone)return;
    if(['ice','wreck'].includes(next)&&!progress.scannerInstalled)return;
    if(next==='haven'&&!havenLocated(progress))return;
    if(next==='system2'&&!(gateReady(progress)&&progress.jumpDone))return;
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
    <header className="masthead"><a className="brand" href="#" onClick={e => {e.preventDefault(); goTo(exploring?(scene==='system2'?'haven':scene!=='system'?'system':'cockpit'):navigation?'cockpit':airlockWork?'airlock':crew || galley || engine ? 'corridor' : inside || corridor ? 'airlock' : 'exterior');}}><span className="brand-mark">✦</span> TO THE STARS</a><AccountButton onRestart={saveStatus.resetGame} onImport={()=>setProgress(current=>mergeProgress(current,{...initialProgress(),resetRevision:current.resetRevision}))}/></header>
    <div className="play-area"><nav className="scene-tools" aria-label="Scene controls"><button aria-label="Go back" disabled={transition} onClick={()=>goTo(exploring?(scene==='system2'?'haven':scene!=='system'?'system':'cockpit'):navigation?'cockpit':airlockWork?'airlock':crew||galley||engine?'corridor':inside||corridor?'airlock':airlock?'exterior':'airlock')}>←</button><button aria-label="Open ship map" onClick={()=>setMapOpen(true)}>▦</button>{launchDone&&<button aria-label="Open system chart" onClick={()=>goTo('system')}>✦</button>}<button aria-label="Open ship log" onClick={e=>openLog(e)}>▤</button></nav><div className="scene-lives"><LivesBar/></div>
    {exploring?<Exploration key={scene} progress={progress} onProgress={setProgress} onNavigate={goTo} onLog={id=>setLogView({id})}/>:crew || galley || engine || airlock || airlockWork || navigation || exterior ? <CrewQuarters key={scene} room={airlock||airlockWork?'airlock':scene} repairsUnlocked={finished} engineCompleted={engineCompleted} onNavigate={goTo} completed={exterior?exteriorCompleted:navigation?navigationCompleted:airlock||airlockWork?airlockCompleted:engine?engineCompleted:galley?galleyCompleted:crewCompleted} onCompleted={exterior?setExteriorCompleted:navigation?setNavigationCompleted:airlock||airlockWork?setAirlockCompleted:engine?setEngineCompleted:galley?setGalleyCompleted:setCrewCompleted} onBack={()=>goTo(exploring?(scene==='system2'?'haven':scene!=='system'?'system':'cockpit'):navigation?'cockpit':airlockWork?'airlock':'corridor')} exteriorView={<ExteriorArt cockpit={completed} completed={exteriorCompleted} seals={airlockCompleted===3} antenna={navigationCompleted>0}/>} onLog={id=>setLogView({id})}/> : <>
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
      {loaded && !transition && !celebration && inside && current && <button ref={mainAction} className="hotspot repair-hotspot" style={{left:`${current.x}%`,top:`${current.y}%`}} aria-label={`Inspect ${current.name}`} onClick={openRepair}><span className="target">{current.icon}</span><span className="hotspot-label">{current.name}</span></button>}
      {inside&&finished&&loaded&&!transition&&<button className={`cockpit-navigation-console ${progress.scannerInstalled?'scanner-upgraded':''}`} aria-label="Open navigation console" onClick={()=>goTo('navigation')}><svg viewBox="0 0 140 80" aria-hidden="true"><path className="nav-orbit" d="M18 51Q47 3 115 28Q130 49 70 67Q32 75 18 51Z"/><path d="M27 53L57 34L90 45L117 22" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="27" cy="53" r="4"/><circle cx="57" cy="34" r="3"/><circle cx="90" cy="45" r="3"/><path d="M117 13L120 20L127 22L120 25L117 32L114 25L107 22L114 20Z"/></svg><strong>{progress.scannerInstalled?'LONG-RANGE SCANNER ↗':'NAVIGATION ↗'}</strong><small>{navigationCompleted===4?'COURSE VERIFIED':`TAP TO CONNECT · ${navigationCompleted}/4`}</small></button>}
      {celebration && inside && <div className="repair-reveal" role="region" aria-label="Repair completed">
        <span className="eyebrow">REPAIR COMPLETE</span>
        <h2>{`✓ ${celebration.name}`}</h2>
        <p role="status">{celebration.result}</p>
<button className="new-log" onClick={e => openLog(e, logEntries.find(entry => entry.repair === celebration.id)?.id)}><span>▤</span> {readIds.includes(logEntries.find(entry => entry.repair === celebration.id)?.id) ? 'Read ship log entry' : 'New log entry'} <span>→</span></button>
        <button className="primary" onClick={() => setCelebration(null)}>Continue <span>→</span></button>
      </div>}
      <div className="scene-bottom scene-caption" role="status">{corridor ? (finished?'Tap a doorway to explore.':'Restore the cockpit to unlock these doors.') : inside ? (finished ? (finaleDone?'Launch check complete. Chapter one restored.':allSystemsReady?'All systems ready. Activate the launch controls.':'Navigation console online. Explore the ship at your own pace.') : `${completed}/4 systems online · Tap the highlighted device.`) : 'Tap the hatch to board the ship.'}</div>
      {inside&&finaleDone&&!celebration&&<button className="hotspot" style={{left:'35%',top:'57%'}} onClick={()=>setLaunching(true)}><span className="target">✦</span><span className="hotspot-label">{launchDone?'Replay departure':'Launch'}</span></button>}
      {inside&&allSystemsReady&&!finaleDone&&!celebration&&<button className="hotspot" style={{left:'35%',top:'57%'}} aria-label="Start final launch challenge" onClick={()=>setPlaying(finaleRepair)}><span className="target">✦</span><span className="hotspot-label">Launch check · HARD</span></button>}
      <div className="curtain" aria-hidden="true"/>
      {!loaded && <div className="loading" role="status">{error ? <><p>The scene could not be loaded.</p><button className="primary" onClick={() => setAttempt(a => a + 1)}>Try again</button></> : 'Preparing the landing site…'}</div>}
    </section>
    </>}
    </div>
    {mapOpen&&<div className="ship-map-backdrop" onClick={()=>setMapOpen(false)}><dialog ref={mapDialog} className="ship-map" onCancel={()=>setMapOpen(false)} aria-label="Ship map" onClick={e=>e.stopPropagation()}><button className="close" autoFocus onClick={()=>setMapOpen(false)}>×</button><h2>Ship map</h2><div className="readiness-list">{readiness.map(r=><button key={r.id} disabled={r.id!=='cockpit'&&!finished} data-system={r.id} data-ready={r.ready} onClick={()=>{setMapOpen(false);goTo(r.id);}}><span>{r.ready?'✓':'○'} {r.name}</span><b>{r.completed}/{r.total}</b></button>)}</div><button className="primary" onClick={()=>{setMapOpen(false);goTo('exterior');}}>View ship</button></dialog></div>}
    {finaleDone&&!launching&&!exploring&&<section className="departure-invite"><span className="eyebrow">{launchDone?'CHAPTER ONE COMPLETE':'ALL SYSTEMS READY'}</span><h2>{launchDone?'Beyond the distress signal':'Your ship is ready to fly.'}</h2><p>{launchDone?'A changed beacon leads to an abandoned mine. Open the system chart to explore.':'Repairs complete. Tanks full. A voice among the stars is waiting.'}</p><button className="primary" onClick={()=>launchDone?goTo('system'):setLaunching(true)}>{launchDone?'Explore the system':'Launch'} →</button>{launchDone&&<button onClick={()=>setLogView({id:departureLog.id})}>Read departure log</button>}</section>}
    {launching&&<Departure onClose={()=>setLaunching(false)} onComplete={()=>{setProgress(current=>({...current,launchDone:true,scene:'system'}));setLaunching(false);setLogView({id:departureLog.id});}}/>}
    <AudioControls/>
    <footer><span>01 — A SHIP THAT WILL FLY AGAIN</span><span role="status">{saveStatus.local==='unavailable'?'Device saving unavailable':saveStatus.local==='unsupported'?'Save from a newer version — update the game':saveStatus.cloud==='saved'?'Progress saved online':saveStatus.cloud==='syncing'?'Syncing progress…':saveStatus.cloud==='offline'?'Cloud unavailable — saved locally; retrying':saveStatus.local==='saved'?'Progress saved on this device':saveStatus.local==='unsupported'?'Save from a newer version — update the game':'Saving unavailable — progress may be lost'}</span></footer>
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
    <span className="sr-only" role="status" aria-live="polite">{exploring ? 'Exploring the star system.' : corridor ? 'Inside the corridor. Emergency lighting only.' : airlock ? 'Inside the airlock.' : inside ? 'Inside the cockpit.' : 'Outside the damaged ship.'} {completed} of {repairs.length} cockpit repairs complete.</span>
  </main>;
}
createRoot(document.getElementById('root')).render(<LivesProvider><AccountProvider><App/></AccountProvider></LivesProvider>);
