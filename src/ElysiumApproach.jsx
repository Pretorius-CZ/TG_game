import React,{useEffect,useRef,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import RepairBubble from './RepairBubble.jsx';
import MiniGame from './MiniGame.jsx';
import {elysiumRoute} from './elysium.js';
import {asterComplete} from './aster.js';
import ElysiumArrival from './ElysiumArrival.jsx';
import {completeElysiumArrival} from './elysiumArrivalStory.js';
import {duckMusic} from './audio.js';

function Ready({onPlay,onClose}){
 const {t}=useLanguage(),ref=useRef(null);
 useEffect(()=>{ref.current.showModal();},[]);
 return <dialog ref={ref} className="repair-bubble elysium-ready" aria-label={t('Approach route ready')} onCancel={e=>{e.preventDefault();onClose();}}><div className="bubble-inner"><h2>{t('Approach route ready')}</h2><p>{t('The records agree. A vast station waits beyond the dust cloud.')}</p><button className="primary" onClick={onPlay}>{t('Follow signal →')}</button><button onClick={onClose}>{t('Close')}</button></div></dialog>;
}
export default function ElysiumApproach({progress,onProgress,sceneRef,onClose}){
 const [playing,setPlaying]=useState(false),[flying,setFlying]=useState(false);
 useEffect(()=>{duckMusic(playing);return()=>duckMusic(false);},[playing]);
 const win=()=>{setPlaying(false);onProgress(p=>asterComplete(p)?{...p,elysiumRouteCompleted:1}:p);};
 const arrive=()=>{onProgress(completeElysiumArrival);onClose();};
 if(flying)return <ElysiumArrival onFinish={arrive}/>;
 if(progress.elysiumRouteCompleted===1)return <Ready onPlay={()=>setFlying(true)} onClose={onClose}/>;
 if(playing)return <MiniGame repair={elysiumRoute} onQuit={()=>setPlaying(false)} onWin={win}/>;
 return <RepairBubble repair={elysiumRoute} sceneRef={sceneRef} onClose={onClose} onPlay={()=>setPlaying(true)} onComplete={win}/>;
}
