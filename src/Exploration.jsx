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
 const foundHaven=havenLocated(progress);
 const ref=useRef(null),[bubble,setBubble]=useState(null),[playing,setPlaying]=useState(null),[reveal,setReveal]=useState(null),[notice,setNotice]=useState(''),[crossing,setCrossing]=useState(false);
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
  <section ref={ref} className={`game expedition ${site?'mine-site':'system-chart'} ${scene==='haven'?'haven-site':''} ${scene==='system2'?'aster-chart':''}`} aria-label={t(site?site.title:scene==='system2'?'Aster Veil system':'System chart')}>
   {t(site?<>
    <div className={`mine-background mine-state-${done}`} style={{backgroundImage:`url(./scenes/${site.image}.webp)`}} aria-hidden="true"/>
    <div className="mine-restoration" aria-hidden="true">{t(site.clips.map((clip,i)=><img key={i} src={`./scenes/${site.image}-restored.webp`} alt={t("")} className="mine-restored-layer" data-restoration={i+1} style={{clipPath:done===6?'none':clip,opacity:done>i?1:0}}/>))}</div>
    {t(scene==='haven'&&done===6&&<div className="gate-aperture" aria-hidden="true"/>)}
    <div className="scene-top"><span className="eyebrow">{t("CHAPTER 02 / KEPLER REACH")}</span><h1>{t(site.title)}</h1><p>{t(done===6?site.complete:`${done}/6 tasks · Follow the signal into the outpost.`)}</p></div>
    {t(!reveal&&tasks[done]&&<button className="hotspot" style={{left:`${tasks[done].x}%`,top:`calc(110px + (100% - 110px) * ${tasks[done].y/100})`}} onClick={()=>setBubble(done)}><span className="target">{t("✦")}</span><span className="hotspot-label">{t(tasks[done].name)}</span></button>)}
    {t(done>0&&!reveal&&<details className="scene-replays expedition-replays"><summary>{t("↻ Replay")}</summary>{t(tasks.slice(0,done).map((r,i)=><button key={r.id} onClick={()=>setBubble(i)}>{t(r.name)}</button>))}</details>)}
    {t(reveal?<div className="repair-reveal"><span className="eyebrow">{t("EXPEDITION TASK COMPLETE")}</span><h2>{t(reveal.name)}</h2><p>{t(reveal.result)}</p><button className="new-log" onClick={()=>onLog(logs.find(e=>e.repair===reveal.id).id)}>{t("New log entry →")}</button><button className="primary" onClick={()=>{setReveal(null);if(done===6&&scene!=='haven')onNavigate('system');}}>{t("Continue →")}</button></div>:<div className="scene-bottom scene-caption">{t(done===6?(scene==='haven'?<><button className="primary" onClick={()=>setCrossing(true)}>{t("Jump to Aster Veil →")}</button><p>{t(progress.jumpDone?'Registered route · travel is free':'Gate ready · no additional shipment required')}</p></>:<button className="primary" onClick={()=>onNavigate('system')}>{t("Return to orbit →")}</button>):<p>{t("Tap the marked equipment. Each restored system reveals the next step.")}</p>)}</div>)}
   </>:scene==='system2'?<>
    <div className="system-space" aria-hidden="true"><div className="system-sun"/><i className="orbit orbit-one"/><i className="orbit orbit-two"/><i className="orbit orbit-three"/></div>
    <div className="scene-top"><span className="eyebrow">{t("CHAPTER 03 / ASTER VEIL")}</span><h1>{t("A different sky.")}</h1><p>{t("The expedition crossed this way. Haven remains within reach.")}</p></div>
    <button className="planet-node origin-node return-gate-node" onClick={()=>onNavigate('haven')}><span className="planet gate-planet"/><strong>{t("Haven gate")}</strong><small>{t("Return to Kepler Reach · free")}</small></button>
    <div className="planet-node wreck-node"><span className="planet buoy-planet"/><strong>{t("Survey buoy")}</strong><small>{t("Expedition trace · coming next")}</small></div>
    <div className="planet-node mine-node"><span className="planet fractured-planet"/><strong>{t("Shattered moon")}</strong><small>{t("Survey pending · coming next")}</small></div>
    <div className="planet-node ice-node"><span className="planet garden-planet"/><strong>{t("Verdant world")}</strong><small>{t("Life signs · coming next")}</small></div>
    <div className="expedition-console"><span className="eyebrow">{t("ROUTE REGISTERED / TWO-WAY PASSAGE")}</span><p>{t("Your progress in both systems is safe. You can return to Haven and cross again without spending shipments or energy charges.")}</p><button className="primary" onClick={()=>onLog(jumpLog.id)}>{t("Read arrival log →")}</button><p>{t("Planetary missions in Aster Veil are coming next.")}</p></div>
   </>:<>
    <div className="system-space" aria-hidden="true"><div className="system-sun"/><i className="orbit orbit-one"/><i className="orbit orbit-two"/><i className="orbit orbit-three"/></div>
    <div className="scene-top"><span className="eyebrow">{t("CHAPTER 02 / SYSTEM CHART")}</span><h1>{t("Follow the echoes.")}</h1><p>{t(scannerInstalled?foundHaven?'Haven located. Both records tell the same story.':'Two expeditions. Choose which echo to follow.':'A changed beacon. An abandoned mine. Start there.')}</p></div>
    <button className="planet-node origin-node" onClick={()=>onNavigate('exterior')}><span className="planet origin-planet"/><strong>{t("Landing moon")}</strong><small>{t("Revisit your ship")}</small></button>
    <button className="planet-node mine-node" onClick={()=>onNavigate('mine')}><span className="planet mine-planet"/><strong>{t("Silent Mine")}</strong><small>{t(done===6?'Survey complete · revisit':`Explore · ${done}/6`)}</small></button>
    <button className={`planet-node ice-node ${scannerInstalled?'charted':'uncharted'}`} disabled={!scannerInstalled} onClick={()=>onNavigate('ice')}><span className="planet ice-planet"/><strong>{t(scannerInstalled?'Icebound relay':'Unknown signal')}</strong><small>{t(scannerInstalled?progress.iceCompleted===6?'Survey complete · revisit':`Explore · ${progress.iceCompleted??0}/6`:'Requires scanner upgrade')}</small></button>
    <button className={`planet-node wreck-node ${scannerInstalled?'charted':'uncharted'}`} disabled={!scannerInstalled} onClick={()=>onNavigate('wreck')}><span className="planet wreck-planet"/><strong>{t(scannerInstalled?'Drifting archive':'Unknown signal')}</strong><small>{t(scannerInstalled?progress.wreckCompleted===6?'Survey complete · revisit':`Explore · ${progress.wreckCompleted??0}/6`:'Requires scanner upgrade')}</small></button>
    <div className="expedition-console"><span className="eyebrow">{t("SHIP CARGO / FIXED SHIPMENTS")}</span><div className="cargo-slots"><span>{t("▣ Material ")}<b>{t(cargo.materials)}</b></span><span>{t("◇ Data ")}<b>{t(cargo.data)}</b></span><span>{t("ϟ Energy ")}<b>{t(cargo.energy)}</b></span></div>
     {t(canInstallScanner(progress)?<><p>{t("Install the long-range scanner using 1 material shipment and 1 research archive.")}</p><button className="primary" onClick={install}>{t("Install scanner →")}</button></>:<p role="status">{t(notice|| (foundHaven?'Records compared. Supplies secured for the journey to Haven.':scannerInstalled?'Visit the ice relay and the drifting archive in either order. Recover both records to locate Haven.':'Complete the mine expedition to upgrade the ship scanner.'))}</p>)}
     {t(foundHaven&&<div className="haven-discovery"><strong>{t("✦ HAVEN LOCATED")}</strong><p>{t("Both bearings agree. The orbital refuge is waiting beyond the belt.")}</p><button className="primary" onClick={()=>onLog(havenLog.id)}>{t("Receive station signal →")}</button><button className="primary" onClick={()=>onNavigate('haven')}>{t(progress.havenCompleted===6?'Visit the jump gate':`Restore Haven · ${progress.havenCompleted??0}/6`)}{t(" →")}</button></div>)}
     <div className={`scanner-display ${scannerInstalled?'scanner-online':''}`} aria-label={t(scannerInstalled?'Upgraded scanner online':'Scanner awaiting upgrade')}><i/><i/><i/><span>{t("LONG-RANGE SCANNER · ")}{t(scannerInstalled?'ONLINE':'OFFLINE')}</span></div>
    </div>
   </>)}
  </section>
  {t(crossing&&gateReady(progress)&&<GateTransit onComplete={arrive} onCancel={()=>setCrossing(false)}/>)}
  {t(bubble!=null&&<RepairBubble repair={tasks[bubble]} replay={bubble<done} sceneRef={ref} onClose={()=>setBubble(null)} onComplete={()=>finish(tasks[bubble])} onPlay={()=>{setPlaying(tasks[bubble]);setBubble(null);}}/>)}
  {t(playing&&<MiniGame key={playing.id} repair={playing} onQuit={()=>setPlaying(null)} onWin={()=>finish(playing)}/>)}
 </>;
}
