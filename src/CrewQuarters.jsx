import {useLanguage} from './i18n/Language.jsx';
import React, {useEffect,useRef,useState} from 'react';
import {crewRepairs,crewLogs} from './crewRepairs.js';
import {galleyRepairs,galleyLogs} from './galleyRepairs.js';
import {engineRepairs,engineLogs} from './engineRepairs.js';
import {airlockRepairs,airlockLogs} from './airlockRepairs.js';
import {navigationRepairs,navigationLogs} from './navigationRepairs.js';
import {exteriorRepairs,exteriorLogs,canRefuel} from './exteriorRepairs.js';
import Transmission from './Transmission.jsx';
import NavigationArt from './NavigationArt.jsx';
import RepairBubble from './RepairBubble.jsx';
import MiniGame from './MiniGame.jsx';
import {duckMusic,sound} from './audio.js';

export default function CrewQuarters({completed,onCompleted,onBack,onLog,room='crew',exteriorView=null,repairsUnlocked=true,engineCompleted=0,onNavigate,guided=false,nextScene,continueLabel,onContinue,canEnterCockpit=true,canEnterCorridor=true,canEnterShip=true,launchControl=null}) {
 const {t}=useLanguage();
  const exterior=room==='exterior',navigation=room==='navigation',airlock=room==='airlock',engine=room==='engine',galley=room==='galley', tasks=exterior?exteriorRepairs:navigation?navigationRepairs:airlock?airlockRepairs:engine?engineRepairs:galley?galleyRepairs:crewRepairs, logs=exterior?exteriorLogs:navigation?navigationLogs:airlock?airlockLogs:engine?engineLogs:galley?galleyLogs:crewLogs;
  const label=exterior?'Exterior':navigation?'Communications & navigation':airlock?'Airlock':engine?'Engine room':galley?'Galley & supplies':'Crew quarters';
  const [bubble,setBubble]=useState(null),[playing,setPlaying]=useState(null),[reveal,setReveal]=useState(null);
  const [loaded,setLoaded]=useState(false),[failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
  const [outside,setOutside]=useState(false);
  const scene=useRef(null),action=useRef(null);
  const finished=completed===tasks.length,current=tasks[completed];
  const fuelLocked=exterior&&current?.id==='exterior-refuel'&&!canRefuel(completed,engineCompleted);
  const roomScenes=exterior?['./scenes/exterior-portrait.webp','./scenes/exterior-cockpit-lit.webp','./scenes/exterior-hull.webp','./scenes/exterior-engines.webp','./scenes/exterior-gear.webp','./scenes/fuel-depot.webp','./scenes/fuel-depot-repaired.webp']:airlock?[0,1,2,4].map(i=>`./scenes/airlock-${i}.webp`):navigation?['./scenes/navigation-console.webp']:Array.from({length:tasks.length+1},(_,i)=>`./scenes/${room}-${i}.webp`);
  useEffect(()=>{let alive=true;setFailed(false);Promise.all(roomScenes.map(src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src=src;}))).then(()=>alive&&setLoaded(true)).catch(()=>alive&&setFailed(true));return()=>{alive=false;};},[attempt]);
  useEffect(()=>{duckMusic(Boolean(playing));return()=>duckMusic(false);},[playing]);
  function closeBubble(){setBubble(null);requestAnimationFrame(()=>action.current?.focus());}
  function win(repair=playing){if(!repairsUnlocked)return;if(repair.id==='exterior-refuel'&&!canRefuel(completed,engineCompleted))return;const next=tasks[completed]?.id===repair.id?completed+1:completed;if(next!==completed){onCompleted(next);setReveal(repair);sound('repair');}setPlaying(null);requestAnimationFrame(()=>action.current?.focus());}
  return <>
    <section ref={scene} className={`game crew ${airlock?'airlock-room':''} ${navigation?'navigation-room':''} ${outside?'exterior-reveal':''} ${bubble!==null?'story-open':''} ${reveal?'show-repair':''}`} aria-label={t(label)}>
      <div className="art" aria-hidden="true" data-crew-stage={room==='crew'?completed:undefined} data-room={room} data-room-stage={completed}>{t(!exterior&&roomScenes.map((src,i)=><img key={src} className="scene-image scene-layer" src={src} alt={t("")} style={{opacity:navigation||i===completed?1:0}}/>))}{t(exterior&&exteriorView)}{t(navigation&&!outside&&<NavigationArt completed={completed}/>)}{t(outside&&reveal?.exterior&&(exteriorView||<img className="scene-image scene-layer" src={reveal.exterior} alt={t("")} data-hull-reveal="true"/>))}<div className="shade"/></div>
      <div className="scene-top"><span className="eyebrow">{t("CHAPTER 01 / ")}{t(label.toUpperCase())}</span><h1>{t(finished?(exterior?'Standing ready.':navigation?'A course to follow.':airlock?'A ship with a skin.':engine?'Power to move forward.':galley?'A meal among the stars.':'A place to call home.'):(exterior?'Back into the sky.':navigation?'Find the signal.':airlock?'Safe from the cold.':engine?'Bring it back to life.':galley?'Supplies for the journey.':'Room to breathe.'))}</h1><p>{t(exterior?(finished?'Hull, engines and landing gear restored. Tanks filled.':'Restore the ship from the outside.'):(finished?'One room restored. A little closer to the stars.':'Restore this room, one system at a time.'))}</p></div>
      {t(loaded&&repairsUnlocked&&current&&!outside&&<button ref={action} className="hotspot repair-hotspot" style={{left:`${current.x}%`,top:`${current.y}%`}} disabled={fuelLocked} aria-label={t(`Inspect ${current.name}${fuelLocked?' — repair fuel system in engine room first':''}`)} onClick={()=>{setReveal(null);setBubble(completed);}}><span className="target">{t(current.icon)}</span><span className="hotspot-label">{t(fuelLocked?'Fuel system required':current.name)}</span></button>)}
      {t(exterior&&loaded&&!outside&&canEnterShip&&<button className="hotspot" style={{left:'51%',top:'55%'}} aria-label={t("Enter the ship")} onClick={()=>onNavigate('airlock')}><span className="target">{t("↗")}</span><span className="hotspot-label">{t("Enter the ship")}</span></button>)}
      {t(airlock&&loaded&&!outside&&<>
        {t(canEnterCockpit&&<button className="hotspot" style={{left:'29%',top:'52%'}} aria-label={t("Enter cockpit")} onClick={()=>onNavigate('cockpit')}><span className="target">{t("↗")}</span><span className="hotspot-label">{t("Cockpit")}</span></button>)}
        {t(canEnterCorridor&&<button className="hotspot airlock-corridor-door" style={{left:'83%',top:'37%'}} aria-label={t("Enter corridor")} onClick={()=>onNavigate('corridor')}><span className="target">{t("↗")}</span><span className="hotspot-label">{t("Corridor")}</span></button>)}
      </>)}
      {t(!reveal&&!outside&&launchControl)}
      {t(guided&&!reveal&&!outside&&!repairsUnlocked&&nextScene!==room&&!(exterior&&canEnterShip)&&!(airlock&&(canEnterCockpit||canEnterCorridor))&&<button className="hotspot chapter-next" style={{left:'50%',top:'62%'}} onClick={onContinue}><span className="target">{t("→")}</span><span className="hotspot-label">{t(continueLabel)}</span></button>)}
      <div className="scene-bottom scene-caption" role="status">{t(label.toUpperCase())}{t(" · ")}{t(completed)}{t("/")}{t(tasks.length)}<p>{t(!repairsUnlocked?continueLabel:fuelLocked?'Repair the fuel system in the engine room, then return to this pump.':finished?(guided?'Systems restored. Use the marked next step.':'Systems restored. Use the doors or the back control to explore.'):'Tap the highlighted device to repair it.')}</p></div>
      {t(reveal&&<div className="repair-reveal" role="region" aria-label={t("Repair completed")}><span className="eyebrow">{t(outside?'EXTERIOR / REPAIR COMPLETE':'REPAIR COMPLETE')}</span><h2>{t("✓ ")}{t(reveal.name)}</h2><p>{t(reveal.result)}</p>{t(reveal.id==='nav-receiver'&&<Transmission/>)}<button className="new-log" onClick={()=>onLog(logs.find(e=>e.repair===reveal.id).id)}>{t("New log entry ")}<span>{t("→")}</span></button><button className="primary" onClick={()=>{if(!guided&&reveal.exterior&&!outside){setOutside(true);return;}setOutside(false);setReveal(null);if(finished&&guided){onContinue();return;}if(finished&&!airlock&&!exterior)onBack();}}>{t(guided?(finished?continueLabel:'Continue repairs'):reveal.exterior&&!outside?'See your ship':finished&&!airlock&&!exterior?(navigation?'Return to cockpit':'Return to corridor'):'Continue repairs')} <span>{t("→")}</span></button></div>)}
      {t(!loaded&&<div className="loading" role="status">{t(failed?<><p>{t("The room could not be loaded.")}</p><button className="primary" onClick={()=>setAttempt(n=>n+1)}>{t("Try again")}</button></>:'Preparing the room…')}</div>)}
    {t(completed>0&&(!guided||repairsUnlocked)&&<details className="crew-replays scene-replays"><summary aria-label={t("Replay completed levels")}><span aria-hidden="true">{t("↻")}</span>{t(" Replay")}</summary>{t(tasks.slice(0,completed).map((r,i)=><button key={r.id} onClick={()=>{setOutside(false);setReveal(null);setBubble(i);}}>{t(r.name)}{t(" ↻")}</button>))}</details>)}
    </section>
    {t(bubble!==null&&<RepairBubble repair={tasks[bubble]} replay={bubble<completed} sceneRef={scene} onClose={closeBubble} onComplete={()=>{const repair=tasks[bubble];setBubble(null);win(repair);}} onPlay={()=>{setPlaying(tasks[bubble]);setBubble(null);}}/>)}
    {t(playing&&<MiniGame repair={playing} onWin={()=>win()} onQuit={()=>{setPlaying(null);requestAnimationFrame(()=>action.current?.focus());}}/>)}
  </>;
}
