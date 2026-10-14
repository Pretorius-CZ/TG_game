import React,{useEffect,useRef} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {destinationName} from './journey.js';
import './journey.css';
export default function JourneyGuide({goal,scene,chapter,onContinue,onChapters}){
 const {language,t}=useLanguage(),cs=language==='cs',index=cs?1:0;
 const ref=useRef(null),label=cs?'Aktuální příběhový úkol':'Current story objective';
 useEffect(()=>{ref.current.open=false;},[scene,goal.repair?.id,goal.kind]);
 function close(){ref.current.open=false;}
 return <details ref={ref} className="journey-guide" onKeyDown={e=>{if(e.key==='Escape'){close();ref.current.querySelector('summary').focus();}}}>
 <summary aria-label={label} title={label}>➤</summary><aside className="journey-panel" aria-label={label}>
 <small>{chapter&&<>{chapter.number} · {cs?chapter.cs:chapter.en} / </>}{cs?'Místo: ':'Location: '}{t(destinationName(scene))}{scene!==goal.scene&&goal.kind!=='choice'&&<span> · {cs?'Prohlížení / návrat':'Visiting / returning'}</span>}</small>
 <p>{goal.purpose[index]}</p>
 {goal.kind==='choice'?<><small>{cs?'Potřebujeme obě stopy. Zvol další expedici:':'Both records are needed. Choose your next expedition:'}</small><div>{goal.choices.map(s=><button key={s} onClick={()=>{close();onContinue(s);}}>{t(destinationName(s))} →</button>)}</div></>:goal.kind==='end'?<button onClick={()=>{close();onChapters();}}>{cs?'Kapitoly a opakování':'Chapters and replays'}</button>:<button onClick={()=>{close();onContinue();}}>{goal.kind==='repair'?(cs?'Další úkol: ':'Next task: ')+t(goal.repair.name):goal.label[index]} →</button>}
 </aside></details>;
}
