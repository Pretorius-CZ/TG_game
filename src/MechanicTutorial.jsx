import React,{useEffect,useRef} from 'react';
import {tutorialTopics} from './tutorials.js';
import {android} from './platform.js';
export default function MechanicTutorial({topic,language,onNext,remaining}){
 const button=useRef(null);
 useEffect(()=>{button.current?.focus();},[topic]);
 const entry=tutorialTopics[topic], [title,text]=entry[language==='cs'?'cs':'en'];
 const body=android&&topic==='helpers'?text.replace(/ AD .*$/, ''):text;
 return <div className={'mechanic-tutorial tutorial-'+topic} role="dialog" aria-modal="true" aria-labelledby="mechanic-title" onKeyDown={e=>{if(e.key==='Tab'){e.preventDefault();button.current?.focus();}e.stopPropagation();}}>
  <section><span className="tutorial-symbol" aria-hidden="true">{entry.icon}</span><h3 id="mechanic-title">{title}</h3><p>{body}</p><button ref={button} className="primary" onClick={onNext}>{language==='cs'?'Rozumím':'Got it'}{remaining>1?' →':''}</button><small>{language==='cs'?'Přečtení nápovědy nespotřebuje tah ani energii.':'Reading this tip uses no moves or energy.'}</small></section>
 </div>;
}
