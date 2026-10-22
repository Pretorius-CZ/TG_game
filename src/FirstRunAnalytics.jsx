import React,{useEffect,useRef,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {analyticsChoice,setAnalyticsChoice} from './analyticsPrivacy.js';
import {crazyGames} from './platform.js';
import './firstRunAnalytics.css';
import {releasedLocales} from './i18n/locales.js';

export default function FirstRunAnalytics(){
 const {language,setLanguage}=useLanguage(),cs=language==='cs';
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
  <div className="analytics-first-languages" role="group" aria-label="Language / Jazyk">{releasedLocales.map(locale=><button key={locale.code} lang={locale.code} aria-pressed={language===locale.code} onClick={()=>setLanguage(locale.code)}>{locale.short}</button>)}</div>
  <h2 id="analytics-first-title" ref={heading} tabIndex={-1}>{cs?'Pomůžeš nám vyladit hru?':'Help us improve the game?'}</h2>
  <p id="analytics-first-copy">{cs?'Povol odesílání výsledků, tahů, použité pomoci, návštěv, zařízení a kampaní do Supabase pod náhodným ID prohlížeče, bez jména a e-mailu. Zemi zjišťuje country.is, které obdrží IP adresu.':'Share results, moves, help used, visits, device and campaigns with Supabase under a random browser ID, without your name or email. Country lookup uses country.is, which receives your IP address.'}</p>
  <p id="analytics-first-choice">{cs?'Volba se zapamatuje a jde změnit v nastavení. Odmítnutí neomezuje hraní ani odměny.':'Your choice is remembered and can be changed in Settings. Refusing does not limit play or rewards.'}</p>
  <p><a href={import.meta.env.MODE==='itch'?'https://playbeyondthesignal.com/privacy.html':'./privacy.html'} target="_blank" rel="noopener">{cs?'Podrobnosti o soukromí':'Privacy details'}</a></p>
  <div className="analytics-first-actions"><button onClick={()=>choose('granted')}>{cs?'Povolit statistiky':'Allow statistics'}</button><button onClick={()=>choose('denied')}>{cs?'Ne, děkuji':'No, thanks'}</button></div>
  {error&&<div role="alert"><p>{cs?'Volbu nelze uložit. Zkontroluj úložiště prohlížeče.':'Could not save your choice. Check browser storage.'}</p><button onClick={()=>setDismissed(true)}>{cs?'Pokračovat bez statistik':'Continue without statistics'}</button></div>}
 </dialog>;
}
