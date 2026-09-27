import ElysiumApproach from './ElysiumApproach.jsx';
import {canVisitAster,asterComplete} from './aster.js';
import {useLanguage} from './i18n/Language.jsx';
import GateTransit from './GateTransit.jsx';
import {gateReady,jumpLog} from './haven.js';
import React,{useRef,useState,useEffect} from 'react';
import MiniGame from './MiniGame.jsx';
import RepairBubble from './RepairBubble.jsx';
import {canInstallScanner} from './exploration.js';
import {destinations,completeDestination,systemCargo,havenLocated,havenLog} from './destinations.js';
import {duckMusic,sound} from './audio.js';

export default function Exploration({progress,onProgress,onNavigate,onLog}){
 const {t}=useLanguage();
 const {scene,scannerInstalled}=progress;
 const site=destinations[scene],done=site?(progress[site.key]??0):progress.mineCompleted;
 const tasks=site?.repairs??[],logs=site?.logs??[];
 const total=site?.repairs.length??6, orbit=site?.system??'system';
 const foundHaven=havenLocated(progress);
 const ref=useRef(null),[bubble,setBubble]=useState(null),[playing,setPlaying]=useState(null),[reveal,setReveal]=useState(null),[notice,setNotice]=useState(''),[crossing,setCrossing]=useState(false),[approaching,setApproaching]=useState(false);
 const cargo=systemCargo(progress);
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
 function install(){onProgress(current=>canInstallScanner(current)?{...current,scannerInstalled:true}:current);sound('repair');setNotice('Scanner upgraded. Two distant signals are now charted.');}
 return <>
  <section ref={ref} className={`game expedition ${site?'mine-site':'system-chart'} ${scene==='haven'?'haven-site':''} ${scene==='system2'?'aster-chart':scene==='system'?'kepler-chart':''}`} aria-label={t(site?site.title:scene==='system2'?'Aster Veil system':'System chart')}>
   {t(site?<>
    <div className={`mine-background mine-state-${done}`} style={{backgroundImage:`url(./scenes/${site.image}.webp)`}} aria-hidden="true"/>
    <div className="mine-restoration" aria-hidden="true">{t(site.clips.map((clip,i)=><img key={i} src={`./scenes/${site.image}-restored.webp`} alt={t("")} className="mine-restored-layer" data-restoration={i+1} style={{clipPath:done===total||site.restorationMasks?'none':clip,maskImage:done===total?'none':site.restorationMasks?.[i],WebkitMaskImage:done===total?'none':site.restorationMasks?.[i],opacity:done>i?1:0}}/>))}</div>
    {t(scene==='haven'&&done===total&&<div className="gate-aperture" aria-hidden="true"/>)}
    <div className="scene-top"><span className="eyebrow">{t(site.chapter??(site.system==='system2'?"CHAPTER 03 / ASTER VEIL":"CHAPTER 02 / KEPLER REACH"))}</span><h1>{t(site.title)}</h1><p>{t(done===total?site.complete:`${done}/${total} tasks · Follow the signal into the outpost.`)}</p></div>
    {t(!reveal&&tasks[done]&&<button className={`hotspot ${tasks[done].y>65?'hotspot-label-above':''}`} style={{left:`${tasks[done].x}%`,top:`calc(110px + (100% - 110px) * ${tasks[done].y/100})`}} onClick={()=>setBubble(done)}><span className="target">{t("✦")}</span><span className="hotspot-label">{t(tasks[done].name)}</span></button>)}
    {t(done>0&&!reveal&&<details className="scene-replays expedition-replays"><summary>{t("↻ Replay")}</summary>{t(tasks.slice(0,done).map((r,i)=><button key={r.id} onClick={()=>setBubble(i)}>{t(r.name)}</button>))}</details>)}
    {t(reveal?<div className="repair-reveal"><span className="eyebrow">{t("EXPEDITION TASK COMPLETE")}</span><h2>{t(reveal.name)}</h2><p>{t(reveal.result)}</p><button className="new-log" onClick={()=>onLog(logs.find(e=>e.repair===reveal.id).id)}>{t("New log entry →")}</button><button className="primary" onClick={()=>{setReveal(null);if(done===total&&scene!=='haven')onNavigate(orbit);}}>{t("Continue →")}</button></div>:<div className="scene-bottom scene-caption">{t(done===total?(scene==='haven'?<><button className="primary" onClick={()=>setCrossing(true)}>{t("Jump to Aster Veil →")}</button><p>{t(progress.jumpDone?'Registered route · travel is free':'Gate ready · no additional shipment required')}</p></>:<button className="primary" onClick={()=>onNavigate(orbit)}>{t(site.system==='elysium'?"Return to station →":"Return to orbit →")}</button>):<p>{t("Tap the marked equipment. Each restored system reveals the next step.")}</p>)}</div>)}
   </>:scene==='system2'?<>
    <div className="system-space" aria-hidden="true"><div className="system-sun"/><i className="orbit orbit-one"/><i className="orbit orbit-two"/><i className="orbit orbit-three"/></div>
    <div className="scene-top"><span className="eyebrow">{t("CHAPTER 03 / ASTER VEIL")}</span><h1>{t("A different sky.")}</h1><p>{t("The expedition crossed this way. Haven remains within reach.")}</p></div>
    <button className="planet-node origin-node return-gate-node" onClick={()=>onNavigate('haven')}><span className="planet gate-planet"/><strong>{t("Haven gate")}</strong><small>{t("Return to Kepler Reach · free")}</small></button>
    <button className="planet-node wreck-node" onClick={()=>onNavigate('buoy')}><img className="planet map-site-art buoy-planet" src="./scenes/map-aster-buoy.png" alt="" aria-hidden="true"/><strong>{t("Survey buoy")}</strong><small>{t("Explore")} · {progress.buoyCompleted??0}/3</small></button>
    <button className="planet-node mine-node" disabled={!canVisitAster(progress,'fracture')} onClick={()=>onNavigate('fracture')}><img className="planet map-site-art fractured-planet" src="./scenes/map-aster-moon.png" alt="" aria-hidden="true"/><strong>{t("Shattered moon")}</strong><small>{t(canVisitAster(progress,'fracture')?'Explore':'Restore the survey buoy first')} {canVisitAster(progress,'fracture')&&`· ${progress.fractureCompleted??0}/6`}</small></button>
    <button className="planet-node ice-node" disabled={!canVisitAster(progress,'verdant')} onClick={()=>onNavigate('verdant')}><img className="planet map-site-art garden-planet" src="./scenes/map-aster-garden.png" alt="" aria-hidden="true"/><strong>{t("Verdant world")}</strong><small>{t(canVisitAster(progress,'verdant')?'Explore':'Restore the survey buoy first')} {canVisitAster(progress,'verdant')&&`· ${progress.verdantCompleted??0}/6`}</small></button>
    <div className="expedition-console"><span className="eyebrow">{t(asterComplete(progress)?"TWO RECORDS / ONE PATTERN":"EXPEDITION / ASTER VEIL")}</span><p>{t(asterComplete(progress)?"Both records carry the same repeating pattern. The expedition followed its source beyond these worlds. Align the records to plot a safe route to Elysium.":progress.buoyCompleted===3?"Two outposts are accessible. Recover the living sample and mineral record in either order.":"Restore the survey buoy to recover the expedition routes.")}</p>{asterComplete(progress)&&<button className="primary" onClick={()=>progress.elysiumArrival===1?onNavigate('elysium'):setApproaching(true)}>{t(progress.elysiumArrival===1?"Visit Elysium →":progress.elysiumRouteCompleted===1?"Follow signal →":"Plot route to Elysium →")}</button>}<button className="primary" onClick={()=>onLog(jumpLog.id)}>{t("Read arrival log →")}</button></div>
   </>:<>
    <div className="system-space" aria-hidden="true"><div className="system-sun"/><i className="orbit orbit-one"/><i className="orbit orbit-two"/><i className="orbit orbit-three"/></div>
    <div className="scene-top"><span className="eyebrow">{t("CHAPTER 02 / SYSTEM CHART")}</span><h1>{t("Follow the echoes.")}</h1><p>{t(scannerInstalled?foundHaven?'Haven located. Both records tell the same story.':'Two expeditions. Choose which echo to follow.':'A changed beacon. An abandoned mine. Start there.')}</p></div>
    <button className="planet-node origin-node" onClick={()=>onNavigate('exterior')}><img className="planet map-site-art origin-planet" src="./scenes/map-kepler-origin.png" alt="" aria-hidden="true"/><strong>{t("Landing moon")}</strong><small>{t("Revisit your ship")}</small></button>
    <button className="planet-node mine-node" onClick={()=>onNavigate('mine')}><img className="planet map-site-art mine-planet" src="./scenes/map-kepler-mine.png" alt="" aria-hidden="true"/><strong>{t("Silent Mine")}</strong><small>{t(done===total?'Survey complete · revisit':`Explore · ${done}/6`)}</small></button>
    <button className={`planet-node ice-node ${scannerInstalled?'charted':'uncharted'}`} disabled={!scannerInstalled} onClick={()=>onNavigate('ice')}><img className="planet map-site-art ice-planet" src="./scenes/map-kepler-ice.png" alt="" aria-hidden="true"/><strong>{t(scannerInstalled?'Icebound relay':'Unknown signal')}</strong><small>{t(scannerInstalled?progress.iceCompleted===6?'Survey complete · revisit':`Explore · ${progress.iceCompleted??0}/6`:'Requires scanner upgrade')}</small></button>
    <button className={`planet-node wreck-node ${scannerInstalled?'charted':'uncharted'}`} disabled={!scannerInstalled} onClick={()=>onNavigate('wreck')}><img className="planet map-site-art wreck-planet" src="./scenes/map-kepler-wreck.png" alt="" aria-hidden="true"/><strong>{t(scannerInstalled?'Drifting archive':'Unknown signal')}</strong><small>{t(scannerInstalled?progress.wreckCompleted===6?'Survey complete · revisit':`Explore · ${progress.wreckCompleted??0}/6`:'Requires scanner upgrade')}</small></button>
    <div className="expedition-console"><span className="eyebrow">{t("SHIP CARGO / FIXED SHIPMENTS")}</span><div className="cargo-slots"><span>{t("▣ Material ")}<b>{t(cargo.materials)}</b></span><span>{t("◇ Data ")}<b>{t(cargo.data)}</b></span><span>{t("ϟ Energy ")}<b>{t(cargo.energy)}</b></span></div>
     {t(canInstallScanner(progress)?<><p>{t("Install the long-range scanner using 1 material shipment and 1 research archive.")}</p><button className="primary" onClick={install}>{t("Install scanner →")}</button></>:<p role="status">{t(notice|| (foundHaven?'Records compared. Supplies secured for the journey to Haven.':scannerInstalled?'Visit the ice relay and the drifting archive in either order. Recover both records to locate Haven.':'Complete the mine expedition to upgrade the ship scanner.'))}</p>)}
     {t(foundHaven&&<div className="haven-discovery"><strong>{t("✦ HAVEN LOCATED")}</strong><p>{t("Both bearings agree. The orbital refuge is waiting beyond the belt.")}</p><button className="primary" onClick={()=>onLog(havenLog.id)}>{t("Receive station signal →")}</button><button className="primary" onClick={()=>onNavigate('haven')}>{t(progress.havenCompleted===6?'Visit the jump gate':`Restore Haven · ${progress.havenCompleted??0}/6`)}{t(" →")}</button></div>)}
     <div className={`scanner-display ${scannerInstalled?'scanner-online':''}`} aria-label={t(scannerInstalled?'Upgraded scanner online':'Scanner awaiting upgrade')}><i/><i/><i/><span>{t("LONG-RANGE SCANNER · ")}{t(scannerInstalled?'ONLINE':'OFFLINE')}</span></div>
    </div>
   </>)}
  </section>
  {approaching&&asterComplete(progress)&&<ElysiumApproach progress={progress} onProgress={onProgress} sceneRef={ref} onClose={()=>setApproaching(false)}/>}
  {t(crossing&&gateReady(progress)&&<GateTransit onComplete={arrive} onCancel={()=>setCrossing(false)}/>)}
  {t(bubble!=null&&<RepairBubble repair={tasks[bubble]} replay={bubble<done} sceneRef={ref} onClose={()=>setBubble(null)} onComplete={()=>finish(tasks[bubble])} onPlay={()=>{setPlaying(tasks[bubble]);setBubble(null);}}/>)}
  {t(playing&&<MiniGame key={playing.id} repair={playing} onQuit={()=>setPlaying(null)} onWin={()=>finish(playing)}/>)}
 </>;
}
