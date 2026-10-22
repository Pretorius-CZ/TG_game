import React,{useEffect,useRef,useState} from 'react';
import {tutorialTopics,helperTutorials} from './tutorials.js';
import {android} from './platform.js';
import {useLanguage} from './i18n/Language.jsx';
function Grid({cells,rows=3,charge}){
 return <span className="tutorial-grid" aria-hidden="true">{Array.from({length:rows*5},(_,i)=><span key={i} className={cells.includes(i)?'lit':''}>{i===12&&charge?charge:cells.includes(i)?'◆':''}</span>)}</span>;
}
function ChargeGuide({cs,page}){
 const patterns=[['4 → Pulse',[5,6,7,8]],['T (5) → Pulse',[0,1,2,6,11]],['L (5) → Pulse',[0,5,10,11,12]],['5+ → Nova',[5,6,7,8,9]]];
 return page===0?<><p>{cs?'Spoj stejné kameny podle obrázku. Na jejich místě vznikne nálož.':'Match identical tiles in one of these shapes to create a charge.'}</p><div className="tutorial-patterns">{patterns.map(([label,cells])=><figure key={label}><Grid cells={cells}/><figcaption>{label}</figcaption></figure>)}</div></>:<><p className="tutorial-tap">{cs?'Klepni na nálož: odpálení stojí 1 tah. Nálož nelze přesouvat.':'Tap a charge to fire it for 1 move. Charges cannot be moved.'}</p><div className="tutorial-patterns"><figure><Grid rows={5} cells={[6,7,8,11,12,13,16,17,18]} charge="✹"/><figcaption>Pulse · 3×3</figcaption></figure><figure><Grid rows={5} cells={[2,7,10,11,12,13,14,17,22]} charge="✣"/><figcaption>{cs?'Nova · řádek + sloupec':'Nova · row + column'}</figcaption></figure></div><p>{cs?'Výbuchy rozbíjejí i kryty. Zasažené nálože vybuchnou zdarma.':'Blasts also break covers. Any charges hit explode for free.'}</p></>;
}
export default function MechanicTutorial({topic,language,onNext,remaining,onTopic,onClose,topics=[]}){
 const {msg}=useLanguage();
 const button=useRef(null),section=useRef(null),cs=language==='cs';
 const [page,setPage]=useState(0),charge=['pulse','nova','charges'].includes(topic);
 useEffect(()=>{setPage(0);},[topic]);
 useEffect(()=>{section.current?.scrollTo({top:0});button.current?.focus({preventScroll:true});},[topic,page]);
 const entry=tutorialTopics[topic], [title,text]=entry[cs?'cs':'en'];
 function keyboard(e){
  e.stopPropagation();
  if(e.key==='Escape'){e.preventDefault();(onClose??onNext)();}
  if(e.key==='Tab'){
   const controls=[...section.current.querySelectorAll('button,select')],first=controls[0],last=controls.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
 }
 return <div className={'mechanic-tutorial tutorial-'+topic} role="dialog" aria-modal="true" aria-labelledby="mechanic-title" onKeyDown={keyboard}><section ref={section}><button className="tutorial-close" aria-label={cs?'Zavřít nápovědu':'Close help'} onClick={onClose??onNext}>×</button>
 {onTopic&&<label className="tutorial-picker">{cs?'Přehled nápovědy':'Help topics'}<select value={topic} onChange={e=>onTopic(e.target.value)}>{[...new Set([topic,...topics])].map(id=><option key={id} value={id}>{tutorialTopics[id][cs?'cs':'en'][0]}</option>)}</select></label>}
 <h3 id="mechanic-title">{title}</h3>
 {charge?<><div className="tutorial-pages" role="group" aria-label={cs?'Část nápovědy':'Help page'}>{[cs?'1 · Vytvoření':'1 · Create',cs?'2 · Použití':'2 · Use'].map((label,i)=><button key={i} aria-pressed={page===i} onClick={()=>setPage(i)}>{label}</button>)}</div><ChargeGuide cs={cs} page={page}/></>:<p>{android&&topic==='helpers'?msg('android.toolsHelp'):text}</p>}
 {helperTutorials.includes(topic)&&<p className="tutorial-tap">{cs?'Po zavření vyber pomůcku znovu. Teď se nic nespotřebuje.':'Select the tool again after closing this tip. Nothing is spent now.'}</p>}
 <button ref={button} className="primary" onClick={charge&&page===0?()=>setPage(1):onNext}>{charge&&page===0?(cs?'Dále · jak odpálit':'Next · how to fire'):remaining>1?(cs?'Rozumím · další':'Got it · next'):(cs?'Rozumím · zpět do hry':'Got it · back to game')}</button><small>{cs?'Čtení nápovědy je zdarma.':'Reading help is free.'}</small>
 </section></div>;
}
