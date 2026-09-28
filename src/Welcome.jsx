import React,{useEffect,useRef,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import AudioControls from './AudioControls.jsx';
import './Welcome.css';
const scenes=[
 ['signal',"That signal should not exist. It belonged to an expedition that never returned."],
 ['emergency','Then the emergency system took control.'],
 ['aftermath',"I'm alive. The ship is barely holding together. And the signal is still there."]
];
export default function Welcome({hasProgress,seen,onFinish,settings,onChapters}){
 const {t,language,setLanguage}=useLanguage();
 const [step,setStep]=useState(null),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[retry,setRetry]=useState(0);
 const next=useRef(null),finish=useRef(onFinish);finish.current=onFinish;
 const intro=step!==null,art=scenes[step??0][0];
 useEffect(()=>{setReady(false);setFailed(false);const image=new Image();let live=true;image.onload=()=>live&&setReady(true);image.onerror=()=>live&&setFailed(true);image.src=`./intro/${art}.webp`;return()=>{live=false;};},[art,retry]);
 useEffect(()=>{if(!intro||!ready)return;next.current?.focus({preventScroll:true});let elapsed=0;const timer=setInterval(()=>{if(document.hidden)return;elapsed+=250;if(elapsed>=7000){clearInterval(timer);if(step===2)finish.current();else setStep(s=>s+1);}},250);return()=>clearInterval(timer);},[step,ready]);
 function advance(){if(step===2)onFinish();else setStep(s=>s+1);}
 return <main className={`welcome ${intro?'welcome-intro':''}`} aria-label="Beyond the Signal">
  <img key={art} className={`welcome-art ${ready?'ready':''}`} src={`./intro/${art}.webp`} alt=""/>
  <div className="welcome-shade"/>
  {intro?<>
   <button className="intro-skip" onClick={onFinish}>{t('Skip intro')}</button>
   <div className="intro-caption" key={step}>
    <div className="intro-dots" aria-label={`${step+1} / 3`}>{scenes.map((_,i)=><i key={i} className={i===step?'active':''}/>)}</div>
    <p aria-live="polite">{t(scenes[step][1])}</p>
    <button ref={next} className="welcome-play" onClick={advance}>{t(step===2?'Begin repairs':'Next')}</button>
   </div>
  </>:<>
   <h1 className="welcome-title">BEYOND<span>THE SIGNAL</span></h1>
   <div className="welcome-menu">
    <button className="welcome-play" onClick={()=>hasProgress||seen?onFinish():setStep(0)}>{t(hasProgress||seen?'CONTINUE':'PLAY')}</button>
    {hasProgress&&<button className="welcome-secondary" onClick={onChapters}>{t('Chapters')}</button>}
    <button className="welcome-replay" onClick={()=>setStep(0)}>{t('Watch intro')}</button>
    <div className="welcome-settings">{settings}<label><span aria-hidden="true">◎ </span><select aria-label={t('Language')} value={language} onChange={e=>setLanguage(e.target.value)}><option value="en">EN</option><option value="cs">CZ</option></select></label><AudioControls/></div>
   </div>
  </>}
  {!ready&&<div className="intro-loading" role="status">{t(failed?'The scene could not be loaded.':'Loading…')}{failed&&<button onClick={()=>setRetry(n=>n+1)}>{t('Try again')}</button>}</div>}
 </main>;
}
