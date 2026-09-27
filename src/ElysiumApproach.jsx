import React,{useEffect,useRef,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import RepairBubble from './RepairBubble.jsx';
import MiniGame from './MiniGame.jsx';
import {elysiumRoute} from './elysium.js';
import {asterComplete} from './aster.js';
import {duckMusic} from './audio.js';

function Approach({onComplete,onCancel}){
 const {t}=useLanguage(),dialog=useRef(null),finish=useRef(onComplete),ended=useRef(false);
 finish.current=onComplete;
 const arrive=()=>{if(!ended.current){ended.current=true;finish.current();}};
 useEffect(()=>{
  dialog.current.showModal();
  const timer=setTimeout(arrive,matchMedia('(prefers-reduced-motion: reduce)').matches?1200:8000);
  return()=>clearTimeout(timer);
 },[]);
 return <dialog ref={dialog} className="transit-dialog elysium-transit" aria-label={t('Approaching Elysium')} onCancel={e=>{e.preventDefault();onCancel();}}>
  <div className="transit-cinema"><img className="elysium-emerging" src="./scenes/elysium.webp" alt=""/><div className="elysium-dust" aria-hidden="true"/>
   <div className="transit-copy"><span className="eyebrow">ASTER VEIL → ELYSIUM</span><h2>{t('A city beyond the dust')}</h2><p>{t('Our ship is a speck beside its silent docks.')}</p></div>
   <div className="transit-actions"><button className="primary" onClick={arrive}>{t('Enter Elysium →')}</button><button onClick={onCancel}>{t('Return to Aster Veil')}</button></div>
  </div>
 </dialog>;
}
function Ready({onPlay,onClose}){
 const {t}=useLanguage(),ref=useRef(null);
 useEffect(()=>{ref.current.showModal();},[]);
 return <dialog ref={ref} className="repair-bubble elysium-ready" aria-label={t('Approach route ready')} onCancel={e=>{e.preventDefault();onClose();}}><div className="bubble-inner"><h2>{t('Approach route ready')}</h2><p>{t('The records agree. A vast station waits beyond the dust cloud.')}</p><button className="primary" onClick={onPlay}>{t('Follow signal →')}</button><button onClick={onClose}>{t('Close')}</button></div></dialog>;
}
export default function ElysiumApproach({progress,onProgress,sceneRef,onClose}){
 const [playing,setPlaying]=useState(false),[flying,setFlying]=useState(false);
 useEffect(()=>{duckMusic(playing);return()=>duckMusic(false);},[playing]);
 const win=()=>{setPlaying(false);onProgress(p=>asterComplete(p)?{...p,elysiumRouteCompleted:1}:p);};
 const arrive=()=>{onProgress(p=>asterComplete(p)&&p.elysiumRouteCompleted===1?{...p,elysiumArrival:1,scene:'elysium'}:p);onClose();};
 if(flying)return <Approach onComplete={arrive} onCancel={()=>setFlying(false)}/>;
 if(progress.elysiumRouteCompleted===1)return <Ready onPlay={()=>setFlying(true)} onClose={onClose}/>;
 if(playing)return <MiniGame repair={elysiumRoute} onQuit={()=>setPlaying(false)} onWin={win}/>;
 return <RepairBubble repair={elysiumRoute} sceneRef={sceneRef} onClose={onClose} onPlay={()=>setPlaying(true)} onComplete={win}/>;
}
