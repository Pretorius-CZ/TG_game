import React,{useEffect,useRef,useState} from 'react';
import {helperTutorials} from './tutorials.js';
import {android} from './platform.js';
import {useLanguage} from './i18n/Language.jsx';
function Grid({cells,rows=3,charge}){
 return <span className="tutorial-grid" aria-hidden="true">{Array.from({length:rows*5},(_,i)=><span key={i} className={cells.includes(i)?'lit':''}>{i===12&&charge?charge:cells.includes(i)?'◆':''}</span>)}</span>;
}
function ChargeGuide({page}){
 const {msg}=useLanguage();
 const patterns=[['4 → Pulse',[5,6,7,8]],['T (5) → Pulse',[0,1,2,6,11]],['L (5) → Pulse',[0,5,10,11,12]],['5+ → Nova',[5,6,7,8,9]]];
 return page===0?<><p>{msg('help.chargeShapes')}</p><div className="tutorial-patterns">{patterns.map(([label,cells])=><figure key={label}><Grid cells={cells}/><figcaption>{label}</figcaption></figure>)}</div></>:<><p className="tutorial-tap">{msg('help.chargeUse')}</p><div className="tutorial-patterns"><figure><Grid rows={5} cells={[6,7,8,11,12,13,16,17,18]} charge="✹"/><figcaption>Pulse · 3×3</figcaption></figure><figure><Grid rows={5} cells={[2,7,10,11,12,13,14,17,22]} charge="✣"/><figcaption>{msg('help.novaArea')}</figcaption></figure></div><p>{msg('help.chain')}</p></>;
}
export default function MechanicTutorial({topic,onNext,remaining,onTopic,onClose,topics=[]}){
 const {msg}=useLanguage();
 const button=useRef(null),section=useRef(null);
 const [page,setPage]=useState(0),charge=['pulse','nova','charges'].includes(topic);
 useEffect(()=>{setPage(0);},[topic]);
 useEffect(()=>{section.current?.scrollTo({top:0});button.current?.focus({preventScroll:true});},[topic,page]);
 const title=msg(`help.${topic}.title`),text=msg(`help.${topic}.body`);
 function keyboard(e){
  e.stopPropagation();
  if(e.key==='Escape'){e.preventDefault();(onClose??onNext)();}
  if(e.key==='Tab'){
   const controls=[...section.current.querySelectorAll('button,select')],first=controls[0],last=controls.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
 }
 return <div className={'mechanic-tutorial tutorial-'+topic} role="dialog" aria-modal="true" aria-labelledby="mechanic-title" onKeyDown={keyboard}><section ref={section}><button className="tutorial-close" aria-label={msg('help.close')} onClick={onClose??onNext}>×</button>
 {onTopic&&<label className="tutorial-picker">{msg('help.topics')}<select value={topic} onChange={e=>onTopic(e.target.value)}>{[...new Set([topic,...topics])].map(id=><option key={id} value={id}>{msg(`help.${id}.title`)}</option>)}</select></label>}
 <h3 id="mechanic-title">{title}</h3>
 {charge?<><div className="tutorial-pages" role="group" aria-label={msg('help.page')}>{['help.create','help.use'].map((id,i)=><button key={id} aria-pressed={page===i} onClick={()=>setPage(i)}>{msg(id)}</button>)}</div><ChargeGuide page={page}/></>:<p>{android&&topic==='helpers'?msg('android.toolsHelp'):text}</p>}
 {helperTutorials.includes(topic)&&<p className="tutorial-tap">{msg('help.selectAgain')}</p>}
 <button ref={button} className="primary" onClick={charge&&page===0?()=>setPage(1):onNext}>{msg(charge&&page===0?'help.nextFire':remaining>1?'help.next':'help.back')}</button><small>{msg('help.free')}</small>
 </section></div>;
}
