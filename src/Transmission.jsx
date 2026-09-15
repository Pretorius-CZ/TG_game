import React,{useEffect,useState} from 'react';

export default function Transmission(){
 const [received,setReceived]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{if(received)return;const timer=setTimeout(()=>setReceived(true),2200);return()=>clearTimeout(timer);},[received]);
 return <div className="transmission">
  <small>OUTGOING</small><p>Repeat this code: SEVEN FOUR.</p>
  <div aria-live="polite" aria-atomic="true"><small>{received?'INCOMING · LIVE':'LISTENING…'}</small><p>{received?<>SEVEN FOUR. We hear you.<br/>Follow the beacon.</>:'Waiting for a reply…'}</p></div>
  {!received&&<button className="transmission-skip" onClick={()=>setReceived(true)}>Show reply →</button>}
 </div>;
}
