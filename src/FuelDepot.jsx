import {useLanguage} from './i18n/Language.jsx';
import React,{useEffect,useRef,useState} from 'react';
export default function FuelDepot({fueled}){
 const {t}=useLanguage();
 const previous=useRef(fueled),[transferring,setTransferring]=useState(false);
 useEffect(()=>{if(fueled&&!previous.current)setTransferring(true);previous.current=fueled;},[fueled]);
 useEffect(()=>{if(!transferring)return;const timer=setTimeout(()=>setTransferring(false),6000);return()=>clearTimeout(timer);},[transferring]);
 return <div className={`fuel-depot ${fueled?'fueled':''} ${transferring?'transferring':''}`} data-fueled={fueled}>
  <svg viewBox="0 0 941 1672" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path className="fuel-hose" d="M700 1210 C620 1280 487 1120 559 953"/>{t(fueled&&<path className="fuel-flow" d="M700 1210 C620 1280 487 1120 559 953"/>)}</svg>
  <img src={fueled?'./scenes/fuel-depot-repaired.webp':'./scenes/fuel-depot.webp'} alt={t("")}/>
  {t(fueled&&<span className="fuel-indicator">{t(transferring?'FUEL TRANSFER':'TANKS FULL')}</span>)}
 </div>;
}
