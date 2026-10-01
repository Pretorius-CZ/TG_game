import React,{useEffect,useRef,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {caretakerPanels} from './caretakerStory.js';
import './caretakerEncounter.css';

export default function CaretakerEncounter({onFinish}){
 const {t}=useLanguage();
 const [step,setStep]=useState(0),[failed,setFailed]=useState(false);
 const dialog=useRef(null),next=useRef(null),pointer=useRef(null),finished=useRef(false);
 const panel=caretakerPanels[step];
 function finish(){if(finished.current)return;finished.current=true;onFinish();}
 function advance(){if(step===caretakerPanels.length-1)finish();else setStep(s=>s+1);}
 useEffect(()=>{const opener=document.activeElement;dialog.current.showModal();return()=>{if(opener?.isConnected)opener.focus({preventScroll:true});};},[]);
 useEffect(()=>{setFailed(false);next.current?.focus({preventScroll:true});},[step]);
 return <dialog className="caretaker-comic" ref={dialog} aria-label={t('Caretaker encounter')} onCancel={e=>{e.preventDefault();finish();}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();advance();}if(e.key==='ArrowLeft'){e.preventDefault();setStep(s=>Math.max(0,s-1));}}}>
  <div className="caretaker-panel" onPointerDown={e=>{if(e.target.closest('button'))return;pointer.current={x:e.clientX,y:e.clientY};}} onPointerUp={e=>{const start=pointer.current;pointer.current=null;if(!start||Math.abs(e.clientY-start.y)>60)return;const dx=e.clientX-start.x;if(dx< -50)advance();else if(dx>50)setStep(s=>Math.max(0,s-1));}} onPointerCancel={()=>{pointer.current=null;}}>
   <img key={panel.image} src={`./scenes/${panel.image}.webp`} alt="" onError={()=>setFailed(true)} draggable={false}/>
   <button className="comic-skip" onClick={finish}>{t('Skip story')}</button>
   <div className="comic-caption">
    <span className="eyebrow">{t('CHAPTER 08 / THE NIGHT GARDEN')} · {step+1}/3</span>
    <h2>{t(panel.title)}</h2><p aria-live="polite">{t(panel.caption)}</p>
    {failed&&<p role="alert">{t('Illustration could not load. You can still continue or skip.')}</p>}
    <div className="comic-pagination" aria-label={`${step+1}/3`}>{caretakerPanels.map((p,i)=><button key={p.image} aria-label={`${t(i<step?'Previous panel':'Next panel')} ${i+1}`} aria-current={step===i?'step':undefined} onClick={()=>setStep(i)}><span/></button>)}</div>
    <button ref={next} className="primary" onClick={advance}>{t(step===2?'Coordinates saved':'Next')} →</button>
   </div>
  </div>
 </dialog>;
}
