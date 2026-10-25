import React,{useEffect,useRef} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {destinationName} from './journey.js';
import './journey.css';
export default function JourneyGuide({goal,scene,chapter,onContinue,onChapters}){
 const {msg,t,dataText}=useLanguage();
 const ref=useRef(null),label=msg("ui.JourneyGuide.current-story-objective");
 useEffect(()=>{ref.current.open=false;},[scene,goal.repair?.id,goal.kind]);
 function close(){ref.current.open=false;}
 return <details ref={ref} className="journey-guide" data-journey-kind={goal.kind} onKeyDown={e=>{if(e.key==='Escape'){close();ref.current.querySelector('summary').focus();}}}>
 <summary aria-label={label} title={label}>➤</summary><aside className="journey-panel" aria-label={label}>
 <small>{chapter&&<>{chapter.number} · {dataText(chapter)} / </>}{msg("ui.JourneyGuide.location")}{t(destinationName(scene))}{scene!==goal.scene&&goal.kind!=='choice'&&<span> · {msg("ui.JourneyGuide.visiting-returning")}</span>}</small>
 <p>{dataText(goal.purpose)}</p>
 {goal.kind==='choice'?<><small>{msg("ui.JourneyGuide.both-records-are-needed-choose-your-next-expedition")}</small><div>{goal.choices.map(s=><button key={s} onClick={()=>{close();onContinue(s);}}>{t(destinationName(s))} →</button>)}</div></>:goal.kind==='end'?<button onClick={()=>{close();onChapters();}}>{msg("ui.JourneyGuide.chapters-and-replays")}</button>:<button onClick={()=>{close();onContinue();}}>{goal.kind==='repair'?(msg("ui.JourneyGuide.next-task"))+t(goal.repair.name):dataText(goal.label)} →</button>}
 </aside></details>;
}
