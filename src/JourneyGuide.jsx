import React from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {destinationName} from './journey.js';
import './journey.css';
export default function JourneyGuide({goal,scene,chapter,onContinue,onChapters}){
 const {language,t}=useLanguage(),cs=language==='cs',index=cs?1:0;
 return <aside className="journey-guide" aria-label={cs?'Aktuální příběhový úkol':'Current story objective'}>
 <small>{chapter&&<>{chapter.number} · {cs?chapter.cs:chapter.en} / </>}{cs?'Místo: ':'Location: '}{t(destinationName(scene))}{scene!==goal.scene&&goal.kind!=='choice'&&<span> · {cs?'Prohlížení / návrat':'Visiting / returning'}</span>}</small>
 <p>{goal.purpose[index]}</p>
 {goal.kind==='choice'?<><small>{cs?'Potřebujeme obě stopy. Zvol další expedici:':'Both records are needed. Choose your next expedition:'}</small><div>{goal.choices.map(s=><button key={s} onClick={()=>onContinue(s)}>{t(destinationName(s))} →</button>)}</div></>:goal.kind==='end'?<button onClick={onChapters}>{cs?'Kapitoly a opakování':'Chapters and replays'}</button>:<button onClick={()=>onContinue()}>{goal.kind==='repair'?(cs?'Další úkol: ':'Next task: ')+t(goal.repair.name):goal.label[index]} →</button>}
 </aside>;
}
