import {useLanguage} from './i18n/Language.jsx';
import React,{useEffect,useState} from 'react';

export default function Transmission(){
 const {t}=useLanguage();
 const [received,setReceived]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{if(received)return;const timer=setTimeout(()=>setReceived(true),2200);return()=>clearTimeout(timer);},[received]);
 return <div className="transmission">
  <small>{t("OUTGOING")}</small><p>{t("Repeat this code: SEVEN FOUR.")}</p>
  <div aria-live="polite" aria-atomic="true"><small>{t(received?'INCOMING · LIVE':'LISTENING…')}</small><p>{t(received?<>{t("SEVEN FOUR. We hear you.")}<br/>{t("Follow the beacon.")}</>:'Waiting for a reply…')}</p></div>
  {t(!received&&<button className="transmission-skip" onClick={()=>setReceived(true)}>{t("Show reply →")}</button>)}
 </div>;
}
