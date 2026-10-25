import React,{useEffect,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {analyticsChoice,setAnalyticsChoice} from './analyticsPrivacy.js';
import {deleteBrowserAnalytics,pendingAnalyticsDeletions,retryAnalyticsDeletion} from './analyticsDeletion.js';
export default function AnalyticsChoices(){
 const {msg}=useLanguage();
 const [choice,setChoice]=useState(analyticsChoice),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>{const update=()=>setChoice(analyticsChoice());window.addEventListener('analytics-choice-changed',update);return()=>window.removeEventListener('analytics-choice-changed',update);},[]);
 function choose(state){try{setAnalyticsChoice(state);setMessage('');}catch{setMessage(msg("ui.AnalyticsChoices.could-not-save-your-choice-check-browser-storage-permissions"));}}
 async function erase(){setBusy(true);setMessage('');try{await deleteBrowserAnalytics();setMessage(msg("ui.AnalyticsChoices.statistics-for-this-browser-were-deleted-your-progress-is"));}catch{setMessage(msg("ui.AnalyticsChoices.collection-is-off-server-deletion-has-not-succeeded-yet"));}finally{setBusy(false);}}
 async function retry(){setBusy(true);try{await retryAnalyticsDeletion();setMessage(msg("ui.AnalyticsChoices.server-deletion-completed"));}catch{setMessage(msg("ui.AnalyticsChoices.server-deletion-is-still-pending-try-again-later"));}finally{setBusy(false);}}
 return <section className="analytics-choices" aria-label={msg("ui.AnalyticsChoices.gameplay-statistics")}>
  <h3>{msg("ui.AnalyticsChoices.help-improve-the-game")}</h3>
  <p>{msg("ui.AnalyticsChoices.optionally-share-difficulty-and-visit-statistics-results-moves-help")}</p>
  <p>{msg("ui.AnalyticsChoices.you-can-change-your-choice-anytime-refusing-does-not")}</p>
  <p role="status">{msg("ui.AnalyticsChoices.statistics")}{choice==='granted'?(msg("ui.AnalyticsChoices.on")):choice==='denied'?(msg("ui.AnalyticsChoices.off")):(msg("ui.AnalyticsChoices.off-no-choice-yet"))}</p>
  <div className="analytics-choice-actions"><button disabled={busy||choice==='granted'} onClick={()=>choose('granted')}>{msg("ui.AnalyticsChoices.allow-statistics")}</button><button disabled={busy||choice==='denied'} onClick={()=>choose('denied')}>{msg("ui.AnalyticsChoices.do-not-allow-statistics")}</button></div>
  <button disabled={busy} onClick={erase}>{msg("ui.AnalyticsChoices.turn-off-and-delete-my-statistics")}</button>
  {pendingAnalyticsDeletions().length>0&&<button disabled={busy} onClick={retry}>{msg("ui.AnalyticsChoices.retry-server-deletion")}</button>}
  {message&&<p role="status">{message}</p>}
 </section>;
}
