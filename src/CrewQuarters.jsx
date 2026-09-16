import React, {useEffect,useRef,useState} from 'react';
import {crewRepairs,crewLogs} from './crewRepairs.js';
import {galleyRepairs,galleyLogs} from './galleyRepairs.js';
import {engineRepairs,engineLogs} from './engineRepairs.js';
import {airlockRepairs,airlockLogs} from './airlockRepairs.js';
import {navigationRepairs,navigationLogs} from './navigationRepairs.js';
import Transmission from './Transmission.jsx';
import NavigationArt from './NavigationArt.jsx';
import RepairBubble from './RepairBubble.jsx';
import MiniGame from './MiniGame.jsx';
import {duckMusic,sound} from './audio.js';

export default function CrewQuarters({completed,onCompleted,onBack,onLog,room='crew',exteriorView=null}) {
  const navigation=room==='navigation',airlock=room==='airlock',engine=room==='engine',galley=room==='galley', tasks=navigation?navigationRepairs:airlock?airlockRepairs:engine?engineRepairs:galley?galleyRepairs:crewRepairs, logs=navigation?navigationLogs:airlock?airlockLogs:engine?engineLogs:galley?galleyLogs:crewLogs;
  const label=navigation?'Communications & navigation':airlock?'Airlock & hull':engine?'Engine room':galley?'Galley & supplies':'Crew quarters';
  const [bubble,setBubble]=useState(null),[playing,setPlaying]=useState(null),[reveal,setReveal]=useState(null);
  const [loaded,setLoaded]=useState(false),[failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
  const [outside,setOutside]=useState(false);
  const scene=useRef(null),action=useRef(null);
  const finished=completed===tasks.length,current=tasks[completed];
  const roomScenes=navigation?['./scenes/navigation-console.webp']:Array.from({length:tasks.length+1},(_,i)=>`./scenes/${room}-${i}.webp`);
  useEffect(()=>{let alive=true;setFailed(false);Promise.all(roomScenes.map(src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src=src;}))).then(()=>alive&&setLoaded(true)).catch(()=>alive&&setFailed(true));return()=>{alive=false;};},[attempt]);
  useEffect(()=>{duckMusic(Boolean(playing));return()=>duckMusic(false);},[playing]);
  function closeBubble(){setBubble(null);requestAnimationFrame(()=>action.current?.focus());}
  function win(repair=playing){const next=tasks[completed]?.id===repair.id?completed+1:completed;if(next!==completed){onCompleted(next);setReveal(repair);sound('repair');}setPlaying(null);requestAnimationFrame(()=>action.current?.focus());}
  return <>
    <section ref={scene} className={`game crew ${navigation?'navigation-room':''} ${outside?'exterior-reveal':''} ${bubble!==null?'story-open':''} ${reveal?'show-repair':''}`} aria-label={label}>
      <div className="art" aria-hidden="true" data-crew-stage={room==='crew'?completed:undefined} data-room={room} data-room-stage={completed}>{roomScenes.map((src,i)=><img key={src} className="scene-image scene-layer" src={src} alt="" style={{opacity:navigation||i===completed?1:0}}/>)}{navigation&&!outside&&<NavigationArt completed={completed}/>}{outside&&reveal?.exterior&&(exteriorView||<img className="scene-image scene-layer" src={reveal.exterior} alt="" data-hull-reveal="true"/>)}<div className="shade"/></div>
      <div className="scene-top"><span className="eyebrow">CHAPTER 01 / {label.toUpperCase()}</span><h1>{finished?(navigation?'A course to follow.':airlock?'A ship with a skin.':engine?'Power to move forward.':galley?'A meal among the stars.':'A place to call home.'):(navigation?'Find the signal.':airlock?'Safe from the cold.':engine?'Bring it back to life.':galley?'Supplies for the journey.':'Room to breathe.')}</h1><p>{finished?'One room restored. A little closer to the stars.':'Restore this room, one system at a time.'}</p></div>
      {loaded&&current&&!reveal&&<button className="hotspot repair-hotspot" style={{left:`${current.x}%`,top:`${current.y}%`}} aria-label={`Inspect ${current.name}`} onClick={()=>setBubble(completed)}><span className="target">{current.icon}</span><span className="hotspot-label">{current.name}</span></button>}
      <div className="scene-bottom"><div className="status">{label.toUpperCase()} {completed} / {tasks.length} RESTORED</div><div className="mission"><div className="mission-copy"><h2>{finished?'This room is ready':current.name}</h2><p>{finished?navigation?'Return to the cockpit to check all ship systems.':airlock?'The hull is secured. Choose your next room.':`See the ${engine?'red':galley?'amber':'cyan'} doorway in the corridor.`:current.objective}</p></div><button ref={action} className="primary" disabled={!loaded} onClick={()=>finished?onBack():setBubble(completed)}>{finished?(navigation?'Back to cockpit':airlock?'Return to airlock':'Return to corridor'):'Inspect repair'} <span>→</span></button></div></div>
      {reveal&&<div className="repair-reveal" role="region" aria-label="Repair completed"><span className="eyebrow">{outside?'EXTERIOR / REPAIR COMPLETE':'REPAIR COMPLETE'}</span><h2>✓ {reveal.name}</h2><p>{reveal.result}</p>{reveal.id==='nav-receiver'&&<Transmission/>}<button className="new-log" onClick={()=>onLog(logs.find(e=>e.repair===reveal.id).id)}>New log entry <span>→</span></button><button className="primary" onClick={()=>{if(reveal.exterior&&!outside){setOutside(true);return;}setOutside(false);setReveal(null);if(finished)onBack();}}>{reveal.exterior&&!outside?'See your ship':finished?(navigation?'Back to cockpit':airlock?'Return to airlock':'See the corridor'):'Continue repairs'} <span>→</span></button></div>}
      {!loaded&&<div className="loading" role="status">{failed?<><p>The room could not be loaded.</p><button className="primary" onClick={()=>setAttempt(n=>n+1)}>Try again</button></>:'Preparing the room…'}</div>}
    {completed>0&&<details className="crew-replays scene-replays"><summary>↻</summary>{tasks.slice(0,completed).map((r,i)=><button key={r.id} onClick={()=>{setOutside(false);setReveal(null);setBubble(i);}}>{r.name} ↻</button>)}</details>}
    </section>
    {bubble!==null&&<RepairBubble repair={tasks[bubble]} replay={bubble<completed} sceneRef={scene} onClose={closeBubble} onComplete={()=>{const repair=tasks[bubble];setBubble(null);win(repair);}} onPlay={()=>{setPlaying(tasks[bubble]);setBubble(null);}}/>}
    {playing&&<MiniGame repair={playing} onWin={()=>win()} onQuit={()=>{setPlaying(null);requestAnimationFrame(()=>action.current?.focus());}}/>}
  </>;
}
