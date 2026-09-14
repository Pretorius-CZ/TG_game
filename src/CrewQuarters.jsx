import React, {useEffect,useRef,useState} from 'react';
import {crewRepairs,crewLogs} from './crewRepairs.js';
import {galleyRepairs,galleyLogs} from './galleyRepairs.js';
import {engineRepairs,engineLogs} from './engineRepairs.js';
import RepairBubble from './RepairBubble.jsx';
import MiniGame from './MiniGame.jsx';
import {duckMusic,sound} from './audio.js';

export default function CrewQuarters({completed,onCompleted,onBack,onLog,room='crew'}) {
  const engine=room==='engine',galley=room==='galley', tasks=engine?engineRepairs:galley?galleyRepairs:crewRepairs, logs=engine?engineLogs:galley?galleyLogs:crewLogs;
  const label=engine?'Engine room':galley?'Galley & supplies':'Crew quarters';
  const [bubble,setBubble]=useState(null),[playing,setPlaying]=useState(null),[reveal,setReveal]=useState(null);
  const [loaded,setLoaded]=useState(false),[failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
  const scene=useRef(null),action=useRef(null);
  const finished=completed===tasks.length,current=tasks[completed];
  useEffect(()=>{let alive=true;setFailed(false);Promise.all(Array.from({length:tasks.length+1},(_,i)=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src=`/scenes/${room}-${i}.webp`;}))).then(()=>alive&&setLoaded(true)).catch(()=>alive&&setFailed(true));return()=>{alive=false;};},[attempt]);
  useEffect(()=>{duckMusic(Boolean(playing));return()=>duckMusic(false);},[playing]);
  function closeBubble(){setBubble(null);requestAnimationFrame(()=>action.current?.focus());}
  function win(){const next=tasks[completed]?.id===playing.id?completed+1:completed;if(next!==completed){onCompleted(next);setReveal(playing);sound('repair');}setPlaying(null);requestAnimationFrame(()=>action.current?.focus());}
  return <>
    <section ref={scene} className={`game crew ${bubble!==null?'story-open':''} ${reveal?'show-repair':''}`} aria-label={label}>
      <div className="art" aria-hidden="true" data-crew-stage={room==='crew'?completed:undefined} data-room={room} data-room-stage={completed}>{Array.from({length:tasks.length+1},(_,i)=><img key={i} className="scene-image scene-layer" src={`/scenes/${room}-${i}.webp`} alt="" style={{opacity:i===completed?1:0}}/>)}<div className="shade"/></div>
      <div className="scene-top"><span className="eyebrow">CHAPTER 01 / {label.toUpperCase()}</span><h1>{finished?(engine?'Power to move forward.':galley?'A meal among the stars.':'A place to call home.'):(engine?'Bring it back to life.':galley?'Supplies for the journey.':'Room to breathe.')}</h1><p>{finished?'One room restored. A little closer to the stars.':'Restore this room, one system at a time.'}</p></div>
      {loaded&&current&&!reveal&&<button className="hotspot repair-hotspot" style={{left:`${current.x}%`,top:`${current.y}%`}} aria-label={`Inspect ${current.name}`} onClick={()=>setBubble(completed)}><span className="target">{current.icon}</span><span className="hotspot-label">{current.name}</span></button>}
      <div className="scene-bottom"><div className="status">{label.toUpperCase()} {completed} / {tasks.length} RESTORED</div><div className="mission"><div className="mission-copy"><h2>{finished?'This room is ready':current.name}</h2><p>{finished?`See the ${engine?'red':galley?'amber':'cyan'} doorway in the corridor.`:current.objective}</p></div><button ref={action} className="primary" disabled={!loaded} onClick={()=>finished?onBack():setBubble(completed)}>{finished?'Return to corridor':'Inspect repair'} <span>→</span></button></div></div>
      {reveal&&<div className="repair-reveal" role="region" aria-label="Repair completed"><span className="eyebrow">REPAIR COMPLETE</span><h2>✓ {reveal.name}</h2><p>{reveal.result}</p><button className="new-log" onClick={()=>onLog(logs.find(e=>e.repair===reveal.id).id)}>New log entry <span>→</span></button><button className="primary" onClick={()=>{setReveal(null);if(finished)onBack();}}>{finished?'See the corridor':'Continue repairs'} <span>→</span></button></div>}
      {!loaded&&<div className="loading" role="status">{failed?<><p>The room could not be loaded.</p><button className="primary" onClick={()=>setAttempt(n=>n+1)}>Try again</button></>:'Preparing the room…'}</div>}
    </section>
    <nav className="scene-nav" aria-label={`${label} navigation`}><button onClick={onBack}>← Corridor</button><span className="nav-location">{label}</span></nav>
    {completed>0&&<details className="crew-replays"><summary>Completed repairs · replay lessons</summary>{tasks.slice(0,completed).map((r,i)=><button key={r.id} onClick={()=>{setReveal(null);setBubble(i);}}>{r.name} ↻</button>)}</details>}
    {bubble!==null&&<RepairBubble repair={tasks[bubble]} replay={bubble<completed} sceneRef={scene} onClose={closeBubble} onPlay={()=>{setPlaying(tasks[bubble]);setBubble(null);}}/>}
    {playing&&<MiniGame repair={playing} onWin={win} onQuit={()=>{setPlaying(null);requestAnimationFrame(()=>action.current?.focus());}}/>}
  </>;
}
