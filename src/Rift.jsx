import RiftStory from './RiftStory.jsx';
import React,{useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {riftOrder,riftDestinations,riftReady,canVisitRift,crossRift,riftArrivalLog} from './rift.js';
import RiftTransit from './RiftTransit.jsx';
import './rift.css';

export default function Rift({progress,onProgress,onNavigate,onLog}){
 const {t}=useLanguage(),[crossing,setCrossing]=useState(false),[story,setStory]=useState(false);
 const beyond=progress.scene==='beyond-rift',ready=riftReady(progress);
 return <>
  <section className={`game rift-chart ${beyond?'rift-arrival':''}`} aria-label={t(beyond?'Beyond the Rift':'The Rift')}>
   <img className="rift-chart-art" src={`./scenes/${beyond?'rift-beyond':ready?'rift-beacons-restored':'rift-beacons'}.webp`} alt=""/>
   <div className="rift-shade"/>
   <div className="scene-top"><span className="eyebrow">{t(beyond?'CHAPTER 05 COMPLETE':'CHAPTER 05 / THE RIFT')}</span><h1>{t(beyond?'A world waiting to wake.':'An echo beyond the chart.')}</h1><p>{t(beyond?'Return beacon online':'Trace the impossible signal. Keep a way home.')}</p></div>
   {!beyond&&<div className="rift-route" aria-label={t('EXPEDITION ROUTE')}>
    {riftOrder.map((id,i)=>{const site=riftDestinations[id],open=canVisitRift(progress,id),done=progress[site.key]??0;return <button key={id} disabled={!open} className={`rift-stop ${done===4?'rift-stop-done':''}`} onClick={()=>onNavigate(id)}>
     <img src={`./scenes/${site.image}${done===4?'-restored':''}.webp`} alt=""/><span><small>0{i+1} · {done}/4</small><strong>{t(site.title)}</strong>{!open&&<small>{t('Complete the previous expedition first')}</small>}</span><b aria-hidden="true">{done===4?'✓':open?'↗':'◇'}</b>
    </button>})}
   </div>}
   <div className="rift-footer">
    {!beyond&&progress.riftCrossed===1&&<button className="primary" onClick={()=>onNavigate("beyond-rift")}>{t("Explore the living ring →")} · {progress.gardenCompleted??0}/6</button>}
    <p>{t(beyond?'The return link is secure. Exploration of the great ring comes next.':ready?'Passage secured. Cross when you are ready.':'Complete each site to reveal the next bearing.')}</p>
    {beyond?<><button className="primary" onClick={()=>onLog(riftArrivalLog.id)}>{t('Read the first impression →')}</button><button className="keep-playing" onClick={()=>onNavigate('rift')}>{t('Return to the expedition chart →')}</button></>:ready&&<button className="primary" onClick={()=>progress.riftCrossed===1?setCrossing(true):setStory(true)}>{t('Cross the Rift →')}</button>}
    <button className="keep-playing" onClick={()=>onNavigate('elysium')}>{t('Return to Elysium →')}</button>
   </div>
  </section>
  {story&&ready&&<RiftStory onFinish={()=>{setStory(false);setCrossing(true);}}/>}
  {crossing&&ready&&<RiftTransit onCancel={()=>setCrossing(false)} onComplete={()=>{setCrossing(false);onProgress(p=>crossRift(p));}}/>}
 </>;
}
