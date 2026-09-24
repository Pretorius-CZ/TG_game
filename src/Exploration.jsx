import GateTransit from './GateTransit.jsx';
import {gateReady,jumpLog} from './haven.js';
import React,{useRef,useState,useEffect} from 'react';
import MiniGame from './MiniGame.jsx';
import RepairBubble from './RepairBubble.jsx';
import {canInstallScanner} from './exploration.js';
import {destinations,completeDestination,systemCargo,havenLocated,havenLog} from './destinations.js';
import {duckMusic,sound} from './audio.js';

export default function Exploration({progress,onProgress,onNavigate,onLog}){
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
  <section ref={ref} className={`game expedition ${site?'mine-site':'system-chart'} ${scene==='haven'?'haven-site':''} ${scene==='system2'?'aster-chart':''}`} aria-label={site?site.title:scene==='system2'?'Aster Veil system':'System chart'}>
   {site?<>
    <div className={`mine-background mine-state-${done}`} style={{backgroundImage:`url(./scenes/${site.image}.webp)`}} aria-hidden="true"/>
    <div className="mine-restoration" aria-hidden="true">{site.clips.map((clip,i)=><img key={i} src={`./scenes/${site.image}-restored.webp`} alt="" className="mine-restored-layer" data-restoration={i+1} style={{clipPath:done===6?'none':clip,opacity:done>i?1:0}}/>)}</div>
    {scene==='haven'&&done===6&&<div className="gate-aperture" aria-hidden="true"/>}
    <div className="scene-top"><span className="eyebrow">CHAPTER 02 / KEPLER REACH</span><h1>{site.title}</h1><p>{done===6?site.complete:`${done}/6 tasks · Follow the signal into the outpost.`}</p></div>
    {!reveal&&tasks[done]&&<button className="hotspot" style={{left:`${tasks[done].x}%`,top:`calc(110px + (100% - 110px) * ${tasks[done].y/100})`}} onClick={()=>setBubble(done)}><span className="target">✦</span><span className="hotspot-label">{tasks[done].name}</span></button>}
    {done>0&&!reveal&&<details className="scene-replays expedition-replays"><summary>↻ Replay</summary>{tasks.slice(0,done).map((r,i)=><button key={r.id} onClick={()=>setBubble(i)}>{r.name}</button>)}</details>}
    {reveal?<div className="repair-reveal"><span className="eyebrow">EXPEDITION TASK COMPLETE</span><h2>{reveal.name}</h2><p>{reveal.result}</p><button className="new-log" onClick={()=>onLog(logs.find(e=>e.repair===reveal.id).id)}>New log entry →</button><button className="primary" onClick={()=>{setReveal(null);if(done===6&&scene!=='haven')onNavigate('system');}}>Continue →</button></div>:<div className="scene-bottom scene-caption">{done===6?(scene==='haven'?<><button className="primary" onClick={()=>setCrossing(true)}>Jump to Aster Veil →</button><p>{progress.jumpDone?'Registered route · travel is free':'Gate ready · no additional shipment required'}</p></>:<button className="primary" onClick={()=>onNavigate('system')}>Return to orbit →</button>):<p>Tap the marked equipment. Each restored system reveals the next step.</p>}</div>}
   </>:scene==='system2'?<>
    <div className="system-space" aria-hidden="true"><div className="system-sun"/><i className="orbit orbit-one"/><i className="orbit orbit-two"/><i className="orbit orbit-three"/></div>
    <div className="scene-top"><span className="eyebrow">CHAPTER 03 / ASTER VEIL</span><h1>A different sky.</h1><p>The expedition crossed this way. Haven remains within reach.</p></div>
    <button className="planet-node origin-node return-gate-node" onClick={()=>onNavigate('haven')}><span className="planet gate-planet"/><strong>Haven gate</strong><small>Return to Kepler Reach · free</small></button>
    <div className="planet-node wreck-node"><span className="planet buoy-planet"/><strong>Survey buoy</strong><small>Expedition trace · coming next</small></div>
    <div className="planet-node mine-node"><span className="planet fractured-planet"/><strong>Shattered moon</strong><small>Survey pending · coming next</small></div>
    <div className="planet-node ice-node"><span className="planet garden-planet"/><strong>Verdant world</strong><small>Life signs · coming next</small></div>
    <div className="expedition-console"><span className="eyebrow">ROUTE REGISTERED / TWO-WAY PASSAGE</span><p>Your progress in both systems is safe. You can return to Haven and cross again without spending shipments or energy charges.</p><button className="primary" onClick={()=>onLog(jumpLog.id)}>Read arrival log →</button><p>Planetary missions in Aster Veil are coming next.</p></div>
   </>:<>
    <div className="system-space" aria-hidden="true"><div className="system-sun"/><i className="orbit orbit-one"/><i className="orbit orbit-two"/><i className="orbit orbit-three"/></div>
    <div className="scene-top"><span className="eyebrow">CHAPTER 02 / SYSTEM CHART</span><h1>Follow the echoes.</h1><p>{scannerInstalled?foundHaven?'Haven located. Both records tell the same story.':'Two expeditions. Choose which echo to follow.':'A changed beacon. An abandoned mine. Start there.'}</p></div>
    <button className="planet-node origin-node" onClick={()=>onNavigate('exterior')}><span className="planet origin-planet"/><strong>Landing moon</strong><small>Revisit your ship</small></button>
    <button className="planet-node mine-node" onClick={()=>onNavigate('mine')}><span className="planet mine-planet"/><strong>Silent Mine</strong><small>{done===6?'Survey complete · revisit':`Explore · ${done}/6`}</small></button>
    <button className={`planet-node ice-node ${scannerInstalled?'charted':'uncharted'}`} disabled={!scannerInstalled} onClick={()=>onNavigate('ice')}><span className="planet ice-planet"/><strong>{scannerInstalled?'Icebound relay':'Unknown signal'}</strong><small>{scannerInstalled?progress.iceCompleted===6?'Survey complete · revisit':`Explore · ${progress.iceCompleted??0}/6`:'Requires scanner upgrade'}</small></button>
    <button className={`planet-node wreck-node ${scannerInstalled?'charted':'uncharted'}`} disabled={!scannerInstalled} onClick={()=>onNavigate('wreck')}><span className="planet wreck-planet"/><strong>{scannerInstalled?'Drifting archive':'Unknown signal'}</strong><small>{scannerInstalled?progress.wreckCompleted===6?'Survey complete · revisit':`Explore · ${progress.wreckCompleted??0}/6`:'Requires scanner upgrade'}</small></button>
    <div className="expedition-console"><span className="eyebrow">SHIP CARGO / FIXED SHIPMENTS</span><div className="cargo-slots"><span>▣ Material <b>{cargo.materials}</b></span><span>◇ Data <b>{cargo.data}</b></span><span>ϟ Energy <b>{cargo.energy}</b></span></div>
     {canInstallScanner(progress)?<><p>Install the long-range scanner using 1 material shipment and 1 research archive.</p><button className="primary" onClick={install}>Install scanner →</button></>:<p role="status">{notice|| (foundHaven?'Records compared. Supplies secured for the journey to Haven.':scannerInstalled?'Visit the ice relay and the drifting archive in either order. Recover both records to locate Haven.':'Complete the mine expedition to upgrade the ship scanner.')}</p>}
     {foundHaven&&<div className="haven-discovery"><strong>✦ HAVEN LOCATED</strong><p>Both bearings agree. The orbital refuge is waiting beyond the belt.</p><button className="primary" onClick={()=>onLog(havenLog.id)}>Receive station signal →</button><button className="primary" onClick={()=>onNavigate('haven')}>{progress.havenCompleted===6?'Visit the jump gate':`Restore Haven · ${progress.havenCompleted??0}/6`} →</button></div>}
     <div className={`scanner-display ${scannerInstalled?'scanner-online':''}`} aria-label={scannerInstalled?'Upgraded scanner online':'Scanner awaiting upgrade'}><i/><i/><i/><span>LONG-RANGE SCANNER · {scannerInstalled?'ONLINE':'OFFLINE'}</span></div>
    </div>
   </>}
  </section>
  {crossing&&gateReady(progress)&&<GateTransit onComplete={arrive} onCancel={()=>setCrossing(false)}/>}
  {bubble!=null&&<RepairBubble repair={tasks[bubble]} replay={bubble<done} sceneRef={ref} onClose={()=>setBubble(null)} onComplete={()=>finish(tasks[bubble])} onPlay={()=>{setPlaying(tasks[bubble]);setBubble(null);}}/>}
  {playing&&<MiniGame key={playing.id} repair={playing} onQuit={()=>setPlaying(null)} onWin={()=>finish(playing)}/>}
 </>;
}
