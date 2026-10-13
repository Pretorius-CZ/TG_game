import React,{useEffect,useRef} from 'react';
import {tutorialTopics,helperTutorials} from './tutorials.js';
function Grid({cells,rows=3,charge}){
 return <span className="tutorial-grid" aria-hidden="true">{Array.from({length:rows*5},(_,i)=><span key={i} className={cells.includes(i)?'lit':''}>{i===12&&charge?charge:cells.includes(i)?'◆':''}</span>)}</span>;
}
function ChargeGuide({cs}){
 const patterns=[['4 → Pulse',[5,6,7,8]],['T (5) → Pulse',[0,1,2,6,11]],['L (5) → Pulse',[0,5,10,11,12]],['5 → Nova',[5,6,7,8,9]]];
 return <><div className="tutorial-patterns">{patterns.map(([label,cells])=><figure key={label}><Grid cells={cells}/><figcaption>{label}</figcaption></figure>)}</div><p className="tutorial-tap">{cs?'Na nálož klepni — nelze ji přesouvat. Odpálení stojí 1 tah.':'Tap the charge — it cannot be moved. Activation costs 1 move.'}</p><div className="tutorial-patterns"><figure><Grid rows={5} cells={[6,7,8,11,12,13,16,17,18]} charge="✹"/><figcaption>Pulse · 3×3</figcaption></figure><figure><Grid rows={5} cells={[2,7,10,11,12,13,14,17,22]} charge="✣"/><figcaption>{cs?'Nova · řádek + sloupec':'Nova · row + column'}</figcaption></figure></div></>;
}
export default function MechanicTutorial({topic,language,onNext,remaining,onTopic,onClose,topics=[]}){
 const button=useRef(null),section=useRef(null),cs=language==='cs';
 useEffect(()=>{section.current?.scrollTo({top:0});button.current?.focus({preventScroll:true});},[topic]);
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
 <h3 id="mechanic-title">{title}</h3><p>{text}</p>
 {['pulse','nova','charges'].includes(topic)&&<ChargeGuide cs={cs}/>}
 {helperTutorials.includes(topic)&&<p className="tutorial-tap">{cs?'Zavři nápovědu a vyber pomůcku znovu, až ji budeš chtít použít. Teď se nic nespotřebuje.':'Close this tip and select the tool again when you want to use it. Nothing is spent now.'}</p>}
 <button ref={button} className="primary" onClick={onNext}>{remaining>1?(cs?'Rozumím · další':'Got it · next'):(cs?'Rozumím · zpět do hry':'Got it · back to game')}</button><small>{cs?'Nápověda nespotřebuje tah, energii ani pomůcku.':'Reading help uses no moves, energy or tools.'}</small>
 </section></div>;
}
