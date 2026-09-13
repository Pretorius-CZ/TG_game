import React, {useEffect,useRef,useState} from 'react';
import {crewRepairs,crewLogs,completeCrewRepair} from './crewRepairs.js';
import RepairBubble from './RepairBubble.jsx';
import MiniGame from './MiniGame.jsx';
import {duckMusic,sound} from './audio.js';

export default function CrewQuarters({completed,onCompleted,onBack,onLog}) {
  const [bubble,setBubble]=useState(null),[playing,setPlaying]=useState(null),[reveal,setReveal]=useState(null);
  const [loaded,setLoaded]=useState(false),[failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
  const scene=useRef(null),action=useRef(null);
  const finished=completed===crewRepairs.length,current=crewRepairs[completed];
  useEffect(()=>{let alive=true;setFailed(false);Promise.all(Array.from({length:5},(_,i)=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src=`/scenes/crew-${i}.webp`;}))).then(()=>alive&&setLoaded(true)).catch(()=>alive&&setFailed(true));return()=>{alive=false;};},[attempt]);
  useEffect(()=>{duckMusic(Boolean(playing));return()=>duckMusic(false);},[playing]);
  function closeBubble(){setBubble(null);requestAnimationFrame(()=>action.current?.focus());}
  function win(){const next=completeCrewRepair(completed,playing.id);if(next!==completed){onCompleted(next);setReveal(playing);sound('repair');}setPlaying(null);requestAnimationFrame(()=>action.current?.focus());}
  return <>
    <section ref={scene} className={`game crew ${bubble!==null?'story-open':''} ${reveal?'show-repair':''}`} aria-label="Crew quarters">
      <div className="art" aria-hidden="true" data-crew-stage={completed}>{Array.from({length:5},(_,i)=><img key={i} className="scene-image scene-layer" src={`/scenes/crew-${i}.webp`} alt="" style={{opacity:i===completed?1:0}}/>)}<div className="shade"/></div>
      <div className="scene-top"><span className="eyebrow">CHAPTER 01 / CREW QUARTERS</span><h1>{finished?'A place to call home.':'Room to breathe.'}</h1><p>{finished?'A little comfort, a little closer to the stars.':'Restore the cabin, one system at a time.'}</p></div>
      {loaded&&current&&!reveal&&<button className="hotspot repair-hotspot" style={{left:`${current.x}%`,top:`${current.y}%`}} aria-label={`Inspect ${current.name}`} onClick={()=>setBubble(completed)}><span className="target">{current.icon}</span><span className="hotspot-label">{current.name}</span></button>}
      <div className="scene-bottom"><div className="status">CREW QUARTERS {completed} / 4 RESTORED</div><div className="mission"><div className="mission-copy"><h2>{finished?'Your cabin is ready':current.name}</h2><p>{finished?'See the cyan doorway in the corridor. The other rooms still need work.':current.objective}</p></div><button ref={action} className="primary" disabled={!loaded} onClick={()=>finished?onBack():setBubble(completed)}>{finished?'Return to corridor':'Inspect repair'} <span>→</span></button></div></div>
      {reveal&&<div className="repair-reveal" role="region" aria-label="Repair completed"><span className="eyebrow">REPAIR COMPLETE</span><h2>✓ {reveal.name}</h2><p>{reveal.result}</p><button className="new-log" onClick={()=>onLog(crewLogs.find(e=>e.repair===reveal.id).id)}>New log entry <span>→</span></button><button className="primary" onClick={()=>{setReveal(null);if(finished)onBack();}}>{finished?'See the corridor':'Continue repairs'} <span>→</span></button></div>}
      {!loaded&&<div className="loading" role="status">{failed?<><p>The cabin could not be loaded.</p><button className="primary" onClick={()=>setAttempt(n=>n+1)}>Try again</button></>:'Preparing the crew quarters…'}</div>}
    </section>
    <nav className="scene-nav" aria-label="Crew quarters navigation"><button onClick={onBack}>← Corridor</button><span className="nav-location">Crew quarters</span></nav>
    {completed>0&&<details className="crew-replays"><summary>Completed repairs · replay lessons</summary>{crewRepairs.slice(0,completed).map((r,i)=><button key={r.id} onClick={()=>{setReveal(null);setBubble(i);}}>{r.name} ↻</button>)}</details>}
    {bubble!==null&&<RepairBubble repair={crewRepairs[bubble]} replay={bubble<completed} sceneRef={scene} onClose={closeBubble} onPlay={()=>{setPlaying(crewRepairs[bubble]);setBubble(null);}}/>}
    {playing&&<MiniGame repair={playing} onWin={win} onQuit={()=>{setPlaying(null);requestAnimationFrame(()=>action.current?.focus());}}/>}
  </>;
}
