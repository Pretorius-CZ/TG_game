import GardenArt from './GardenArt.jsx';
import SystemChart from './SystemChart.jsx';
import ElysiumApproach from './ElysiumApproach.jsx';
import {canVisitAster,asterComplete} from './aster.js';
import {useLanguage} from './i18n/Language.jsx';
import GateTransit from './GateTransit.jsx';
import {gateReady,jumpLog} from './haven.js';
import React,{useRef,useState,useEffect} from 'react';
import MiniGame from './MiniGame.jsx';
import RepairBubble from './RepairBubble.jsx';
import {canInstallScanner} from './exploration.js';
import {destinations,completeDestination} from './destinations.js';
import {duckMusic,sound} from './audio.js';

export default function Exploration({progress,onProgress,onNavigate,onLog}){
 const {t}=useLanguage();
 const {scene,scannerInstalled}=progress;
 const site=destinations[scene],done=site?(progress[site.key]??0):progress.mineCompleted;
 const tasks=site?.repairs??[],logs=site?.logs??[];
 const total=site?.repairs.length??6, orbit=site?.system??'system';
 const ref=useRef(null),[bubble,setBubble]=useState(null),[playing,setPlaying]=useState(null),[reveal,setReveal]=useState(null),[crossing,setCrossing]=useState(false),[approaching,setApproaching]=useState(false);
 useEffect(()=>{duckMusic(Boolean(playing));return()=>duckMusic(false);},[playing]);
 function finish(repair){
  setPlaying(null);setBubble(null);
  onProgress(current=>({...current,[site.key]:completeDestination(current[site.key]??0,repair.id,tasks)}));
  if(tasks[done]?.id===repair.id){setReveal(repair);sound('repair');}
 }
 function arrive(){
  onProgress(current=>gateReady(current)?{...current,jumpDone:true,scene:'system2'}:current);
  setCrossing(false);
 }
 function install(){onProgress(current=>canInstallScanner(current)?{...current,scannerInstalled:true}:current);sound('repair');}
 if(!site)return <><SystemChart progress={progress} onNavigate={onNavigate} onInstall={install} onApproach={()=>setApproaching(true)} sceneRef={ref}/>{approaching&&asterComplete(progress)&&<ElysiumApproach progress={progress} onProgress={onProgress} sceneRef={ref} onClose={()=>setApproaching(false)}/>}</>;
 return <>
  <section ref={ref} className={`game expedition ${site?'mine-site':'system-chart'} ${site?.system==='rift'?'rift-site':''} ${site?.dimInitial?'rift-dim':''} ${scene==='haven'?'haven-site':''} ${scene==='system2'?'aster-chart':scene==='system'?'kepler-chart':''}`} aria-label={t(site?site.title:scene==='system2'?'Aster Veil system':'System chart')}>
   {t(site?<>
    <div className={`mine-background mine-state-${done}`} style={{backgroundImage:`url(./scenes/${site.image}.webp)`}} aria-hidden="true"/>
    <div className="mine-restoration" aria-hidden="true">{t(site.clips.map((clip,i)=><img key={i} src={`./scenes/${site.restoredImage??site.image+'-restored'}.webp`} alt={t("")} className="mine-restored-layer" data-restoration={i+1} style={{clipPath:done===total||site.restorationMasks?'none':clip,maskImage:done===total?'none':site.restorationMasks?.[i],WebkitMaskImage:done===total?'none':site.restorationMasks?.[i],opacity:done>i?1:0}}/>))}</div>
    {scene==='beyond-rift'&&<GardenArt completed={done}/>}
    {t(scene==='haven'&&done===total&&<div className="gate-aperture" aria-hidden="true"/>)}
    <div className="scene-top"><span className="eyebrow">{t(site.chapter??(site.system==='system2'?"CHAPTER 03 / ASTER VEIL":"CHAPTER 02 / KEPLER REACH"))}</span><h1>{t(site.title)}</h1><p>{done===total?t(site.complete):site.system==='rift'?<>{done}/{total} · {t(scene==='beyond-rift'?'Awaken one system at a time':'Follow the echo')}</>:t(`${done}/${total} tasks · Follow the signal into the outpost.`)}</p></div>
    {t(!reveal&&tasks[done]&&<button className={`hotspot ${tasks[done].y>65?'hotspot-label-above':''}`} style={{left:`${tasks[done].x}%`,top:`calc(${site.hotspotOffset??110}px + (100% - ${site.hotspotOffset??110}px) * ${tasks[done].y/100})`}} onClick={()=>setBubble(done)}><span className="target">{t("✦")}</span><span className="hotspot-label">{t(tasks[done].name)}</span></button>)}
    {t(done>0&&!reveal&&<details className="scene-replays expedition-replays"><summary>{t("↻ Replay")}</summary>{t(tasks.slice(0,done).map((r,i)=><button key={r.id} onClick={()=>setBubble(i)}>{t(r.name)}</button>))}</details>)}
    {t(reveal?<div className="repair-reveal"><span className="eyebrow">{t("EXPEDITION TASK COMPLETE")}</span><h2>{t(reveal.name)}</h2><p>{t(reveal.result)}</p><button className="new-log" onClick={()=>onLog(logs.find(e=>e.repair===reveal.id).id)}>{t("New log entry →")}</button><button className="primary" onClick={()=>{setReveal(null);if(site.nextScene&&done===total){onNavigate(site.nextScene);return;}if(scene==="fading-relay"&&done===total){onNavigate("night-glade");return;}if(scene==="elysium-research"&&done===total){onNavigate("fading-relay");return;}if(scene==="beyond-rift"&&done===total){onNavigate("elysium-research");return;}if(done===total&&scene!=='haven')onNavigate(orbit);}}>{t("Continue →")}</button></div>:done===total?<div className="scene-bottom scene-caption">{t((scene==='haven'?<><button className="primary" onClick={()=>setCrossing(true)}>{t("Jump to Aster Veil →")}</button><p>{t(progress.jumpDone?'Registered route · travel is free':'Gate ready · no additional shipment required')}</p></>:<button className="primary" onClick={()=>onNavigate(site.nextScene??(scene==='fading-relay'?'night-glade':scene==='elysium-research'?'fading-relay':scene==='beyond-rift'?'elysium-research':orbit))}>{t(site.nextLabel??(scene==='fading-relay'?'Descend to the night garden →':scene==='night-grove'?'Return to the landing glade →':scene==='night-glade'?'Return to the relay →':scene==='elysium-research'?'Travel to the silent relay →':scene==='beyond-rift'?'Return to Elysium · Research →':site.system==='rift'?"Return to the expedition chart →":site.system==='elysium'?"Return to station →":"Return to orbit →"))}</button>))}</div>:null)}
   </>:null)}
  </section>
  {approaching&&asterComplete(progress)&&<ElysiumApproach progress={progress} onProgress={onProgress} sceneRef={ref} onClose={()=>setApproaching(false)}/>}
  {t(crossing&&gateReady(progress)&&<GateTransit onComplete={arrive} onCancel={()=>setCrossing(false)}/>)}
  {t(bubble!=null&&<RepairBubble repair={tasks[bubble]} replay={bubble<done} sceneRef={ref} onClose={()=>setBubble(null)} onComplete={()=>finish(tasks[bubble])} onPlay={()=>{setPlaying(tasks[bubble]);setBubble(null);}}/>)}
  {t(playing&&<MiniGame key={playing.id} repair={playing} onQuit={()=>setPlaying(null)} onWin={()=>finish(playing)}/>)}
 </>;
}
