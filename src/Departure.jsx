import React,{useEffect,useRef,useState} from 'react';
import ExteriorArt from './ExteriorArt.jsx';
import {sound} from './audio.js';
const captions=['Retracting antenna · disconnecting fuel line','Engines online','Leaving the surface','Following the signal'];
export default function Departure({onComplete,onClose}){
 const dialog=useRef(null),[stage,setStage]=useState(0),[ready,setReady]=useState(false),[error,setError]=useState(false);
 const complete=useRef(onComplete);complete.current=onComplete;
 useEffect(()=>{dialog.current.showModal();},[]);
 useEffect(()=>{
  if(!ready)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  sound('repair');
  const timers=[1,2,3].map((n)=>setTimeout(()=>setStage(n),reduced?n*300:n*2300));
  timers.push(setTimeout(()=>complete.current(),reduced?1400:10500));
  return()=>timers.forEach(clearTimeout);
 },[ready]);
 return <dialog ref={dialog} className="departure-dialog" aria-label="Ship departure" onCancel={e=>{e.preventDefault();onClose();}}>
 <div className={`departure-cinema departure-stage-${stage} ${ready?'departure-ready':' '}`}>
 <div className="departure-ground"><ExteriorArt cockpit={4} completed={4} seals antenna/></div>
 <img className="departure-flight" src="./scenes/departure-flight.webp" alt="The repaired supply ship lifting off with blue engine trails" onLoad={()=>setReady(true)} onError={()=>setError(true)}/>
 <div className="departure-ignition" aria-hidden="true"/>
 <div className="departure-heading"><span className="eyebrow">CHAPTER 01 / DEPARTURE</span><h2>To the stars.</h2><p role="status">{error?'Flight image unavailable. You can still complete the chapter.':ready?captions[stage]:'Preparing departure…'}</p></div>
 <div className="departure-controls"><button className="primary" onClick={onComplete}>Skip departure →</button><button onClick={onClose}>Back to ship</button></div>
 </div></dialog>;
}
