import React,{useEffect,useRef,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {analyticsChoice,setAnalyticsChoice} from './analyticsPrivacy.js';
import {crazyGames} from './platform.js';
import './firstRunAnalytics.css';
import {releasedLocales} from './i18n/locales.js';

export default function FirstRunAnalytics(){
 const {msg,language,setLanguage,availableLocales=releasedLocales}=useLanguage();
 const [choice,setChoice]=useState(analyticsChoice),[error,setError]=useState(false),[dismissed,setDismissed]=useState(false);
 const dialog=useRef(null),heading=useRef(null);
 const visible=!crazyGames&&choice==='unknown'&&!dismissed;
 useEffect(()=>{const update=()=>setChoice(analyticsChoice());window.addEventListener('analytics-choice-changed',update);return()=>window.removeEventListener('analytics-choice-changed',update);},[]);
 useEffect(()=>{
  if(!visible)return;
  const node=dialog.current,opener=document.activeElement;node.showModal();heading.current?.focus();
  return()=>{node.close();if(opener?.isConnected)opener.focus({preventScroll:true});};
 },[visible]);
 function choose(state){try{setAnalyticsChoice(state);setError(false);}catch{setError(true);}}
 if(!visible)return null;
 return <dialog ref={dialog} className="analytics-first-run" aria-labelledby="analytics-first-title" aria-describedby="analytics-first-copy analytics-first-choice" onCancel={event=>{event.preventDefault();choose('denied');}}>
  <div className="analytics-first-languages" role="group" aria-label="Language / Jazyk">{availableLocales.map(locale=><button key={locale.code} lang={locale.code} aria-pressed={language===locale.code} onClick={()=>setLanguage(locale.code)}>{locale.short}</button>)}</div>
  <h2 id="analytics-first-title" ref={heading} tabIndex={-1}>{msg("ui.FirstRunAnalytics.help-us-improve-the-game")}</h2>
  <p id="analytics-first-copy">{msg("ui.FirstRunAnalytics.share-results-moves-help-used-visits-device-and-campaigns")}</p>
  <p id="analytics-first-choice">{msg("ui.FirstRunAnalytics.your-choice-is-remembered-and-can-be-changed-in")}</p>
  <p><a href={import.meta.env.MODE==='itch'?'https://playbeyondthesignal.com/privacy.html':'./privacy.html'} target="_blank" rel="noopener">{msg("ui.FirstRunAnalytics.privacy-details")}</a></p>
  <div className="analytics-first-actions"><button onClick={()=>choose('granted')}>{msg("ui.FirstRunAnalytics.allow-statistics")}</button><button onClick={()=>choose('denied')}>{msg("ui.FirstRunAnalytics.no-thanks")}</button></div>
  {error&&<div role="alert"><p>{msg("ui.FirstRunAnalytics.could-not-save-your-choice-check-browser-storage")}</p><button onClick={()=>setDismissed(true)}>{msg("ui.FirstRunAnalytics.continue-without-statistics")}</button></div>}
 </dialog>;
}
