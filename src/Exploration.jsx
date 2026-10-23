import {chaptersFor} from './chapters.js';
import ArchiveArt from './ArchiveArt.jsx';
import SignalArt from './SignalArt.jsx';
import Stars from './Stars.jsx';
import CompletedRepairs from './CompletedRepairs.jsx';
import {completeAsterJump} from './asterJumpStory.js';
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

export default function Exploration({progress,onProgress,onNavigate,onLog,onEncounter,onJumpStory,onContinueStory,onReplayStory,storyGoal}){
 const {t,language}=useLanguage();
 const {scene,scannerInstalled}=progress;
 const isArchive=scene.startsWith('archive-');
 const site=destinations[scene],done=site?(progress[site.key]??0):progress.mineCompleted;
 const chapter=chaptersFor(progress).find(c=>c.sections.some(s=>s.scene===scene));
 const tasks=site?.repairs??[],logs=site?.logs??[];
 const total=site?.repairs.length??6, orbit=site?.system??'system';
 const ref=useRef(null),[bubble,setBubble]=useState(null),[playing,setPlaying]=useState(null),[reveal,setReveal]=useState(null),[crossing,setCrossing]=useState(false),[approaching,setApproaching]=useState(false);
 useEffect(()=>{duckMusic(Boolean(playing));return()=>duckMusic(false);},[playing]);
 useEffect(()=>{if(scene==='night-sanctuary'&&done===5&&!progress.caretakerMet&&!reveal)onEncounter?.();},[scene,done,progress.caretakerMet,reveal]);
 useEffect(()=>{
  const open=e=>{if(e.detail.scene!==scene)return;const i=tasks.findIndex(r=>r.id===e.detail.id);if(i<0||i!==done)return;setReveal(null);setBubble(i);};
  window.addEventListener('journey-repair',open);return()=>window.removeEventListener('journey-repair',open);
 },[scene,done]);
 function finish(repair){
  setPlaying(null);setBubble(null);
  onProgress(current=>({...current,[site.key]:completeDestination(current[site.key]??0,repair.id,tasks)}));
  if(tasks[done]?.id===repair.id){setReveal(repair);sound('repair');}
 }
 function arrive(){
  const firstCrossing=gateReady(progress)&&!progress.jumpDone;
  onProgress(completeAsterJump);
  if(firstCrossing)onJumpStory?.();
  setCrossing(false);
 }
 function install(){onProgress(current=>canInstallScanner(current)?{...current,scannerInstalled:true}:current);sound('repair');}
 if(!site)return <><SystemChart progress={progress} onNavigate={onNavigate} onInstall={install} onApproach={()=>setApproaching(true)} sceneRef={ref}/>{approaching&&asterComplete(progress)&&<ElysiumApproach progress={progress} onProgress={onProgress} sceneRef={ref} onClose={()=>setApproaching(false)}/>}</>;
 return <>
  <section ref={ref} className={`game expedition ${isArchive?'archive-site':site?.art==='signal'?`signal-site ${scene==='signal-station'&&done===total?'signal-finished':''}`:''} ${site?'mine-site':'system-chart'} ${site?.system==='rift'?'rift-site':''} ${site?.dimInitial?'rift-dim':''} ${scene==='refuge-medical'?'refuge-medical-site':(scene.startsWith('archive-')||['return-corridor','refuge-arrival'].includes(scene))?'return-corridor-site':''} ${scene==='haven'?'haven-site':''} ${scene==='system2'?'aster-chart':scene==='system'?'kepler-chart':''}`} aria-label={t(site?site.title:scene==='system2'?'Aster Veil system':'System chart')}>
   {t(site?<>
    <div className={`mine-background mine-state-${done}`} style={{backgroundImage:`url(./scenes/${site.image}.webp)`}} aria-hidden="true"/>
    <div className="mine-restoration" aria-hidden="true">{t(site.clips.map((clip,i)=><img key={i} src={`./scenes/${site.restoredImage??site.image+'-restored'}.webp`} alt={t("")} className="mine-restored-layer" data-restoration={i+1} style={{clipPath:done===total||site.restorationMasks?'none':clip,maskImage:done===total?'none':site.restorationMasks?.[i],WebkitMaskImage:done===total?'none':site.restorationMasks?.[i],opacity:done>i?1:0}}/>))}</div>
    {site.art==='archive'&&<ArchiveArt scene={scene} completed={done} repairs={tasks}/>}
    {site.art==='signal'&&<SignalArt scene={scene} completed={done} repairs={tasks}/>}
    {scene==='beyond-rift'&&<GardenArt completed={done}/>}
    {t(scene==='haven'&&done===total&&<div className="gate-aperture" aria-hidden="true"/>)}
    <div className="scene-top"><span className="eyebrow">{t(chapter?`CHAPTER ${String(chapter.number).padStart(2,'0')} / ${language==='cs'?chapter.cs.toUpperCase():chapter.en.toUpperCase()}`:site.chapter??(site.system==='system2'?"CHAPTER 03 / ASTER VEIL":"CHAPTER 02 / KEPLER REACH"))}</span><h1>{t(site.title)}</h1><p>{done===total?t(site.complete):site.system==='rift'?<>{done}/{total} · {t(scene==='beyond-rift'?'Awaken one system at a time':'Follow the echo')}</>:t(`${done}/${total} tasks · Follow the signal into the outpost.`)}</p></div>
    {!reveal&&(done===total?<CompletedRepairs repairs={tasks} onReplay={repair=>setBubble(tasks.indexOf(repair))}/>:tasks.slice(0,Math.min(done+1,total)).map((r,i)=><button key={r.id} data-repair-id={r.id} className={`hotspot ${i<done?'completed-hotspot':''} ${r.y>65?'hotspot-label-above':''}`} style={{left:`${r.x}%`,top:`calc(${site.hotspotOffset??110}px + (100% - ${site.hotspotOffset??110}px) * ${r.y/100})`}} title={t(r.name)} aria-label={t(r.name)} onClick={()=>setBubble(i)}><span className="target" aria-hidden="true">{i<done?'✓':'✦'}</span><span className="hotspot-label">{t(r.name)}{i<done&&<Stars id={r.id}/>}</span></button>))}
    {t(reveal?<div className="repair-reveal"><span className="eyebrow">{t("EXPEDITION TASK COMPLETE")}</span><h2>{t(reveal.name)}</h2><p>{t(reveal.result)}</p><button className="new-log" onClick={()=>onLog(logs.find(e=>e.repair===reveal.id).id)}>{t("New log entry →")}</button><button className="primary" onClick={()=>{setReveal(null);if(!isArchive){if(done<total)setBubble(done);else onContinueStory();}}}>{isArchive?(language==='cs'?'Prohlédnout opravu →':'View repair →'):done<total?(language==='cs'?'Další oprava →':'Next repair →'):(storyGoal?.kind==='end'?(language==='cs'?'Zavřít výsledek opravy':'Close repair result'):(language==='cs'?'Pokračovat v příběhu →':'Continue the story →'))}</button></div>:isArchive?<nav className="archive-navigation" aria-label={language==='cs'?'Průchody archivem':'Archive passages'}><button onClick={()=>onNavigate(orbit)}>← {t(destinations[orbit]?.title??'The Refuge')}</button>{site.nextScene&&<button disabled={done<total} onClick={()=>onNavigate(site.nextScene)}>{t(destinations[site.nextScene].title)} {done<total?'◇':'→'}</button>}</nav>:done===total?<div className="scene-bottom scene-caption">{scene==='signal-station'&&done===total&&<div><p className="signal-milestone">{language==='cs'?'200 · Odpověď doručena. Posádka je v bezpečí.':'200 · Answer delivered. The crew is safe.'}</p><button className="primary" onClick={()=>onReplayStory?.('signal-delivered-200')}>{language==='cs'?'Přehrát závěr příběhu':'Replay the story ending'}</button></div>}{t((scene==='haven'?<><button data-journey-action="gate" className={progress.jumpDone?'keep-playing':'primary'} onClick={()=>setCrossing(true)}>{progress.jumpDone?(language==='cs'?'Znovu navštívit Aster Veil →':'Revisit Aster Veil →'):t("Jump to Aster Veil →")}</button><p>{t(progress.jumpDone?'Registered route · travel is free':'Gate ready · no additional shipment required')}</p></>:<>{storyGoal?.kind!=='end'&&<button className="primary" onClick={onContinueStory}>{language==='cs'?'Pokračovat v příběhu →':'Continue the story →'}</button>}<button className="keep-playing" onClick={()=>onNavigate(orbit)}>{language==='cs'?'Prohlédnout předchozí oblast →':'Visit the previous area →'}</button></>))}</div>:null)}
   </>:null)}
  </section>
  {approaching&&asterComplete(progress)&&<ElysiumApproach progress={progress} onProgress={onProgress} sceneRef={ref} onClose={()=>setApproaching(false)}/>}
  {t(crossing&&gateReady(progress)&&<GateTransit onComplete={arrive} onCancel={()=>setCrossing(false)}/>)}
  {t(bubble!=null&&<RepairBubble repair={tasks[bubble]} replay={bubble<done} sceneRef={ref} onClose={()=>setBubble(null)} onComplete={()=>finish(tasks[bubble])} onPlay={()=>{setPlaying(tasks[bubble]);setBubble(null);}}/>)}
  {t(playing&&<MiniGame key={playing.id} repair={playing} onQuit={()=>setPlaying(null)} onWin={()=>finish(playing)}/>)}
 </>;
}
