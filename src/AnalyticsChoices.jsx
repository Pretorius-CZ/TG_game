import React,{useEffect,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {analyticsChoice,setAnalyticsChoice} from './analyticsPrivacy.js';
import {deleteBrowserAnalytics,pendingAnalyticsDeletions,retryAnalyticsDeletion} from './analyticsDeletion.js';
export default function AnalyticsChoices(){
 const {language}=useLanguage(),cs=language==='cs';
 const [choice,setChoice]=useState(analyticsChoice),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>{const update=()=>setChoice(analyticsChoice());window.addEventListener('analytics-choice-changed',update);return()=>window.removeEventListener('analytics-choice-changed',update);},[]);
 function choose(state){try{setAnalyticsChoice(state);setMessage('');}catch{setMessage(cs?'Volbu se nepodařilo uložit. Zkontroluj povolení úložiště prohlížeče.':'Could not save your choice. Check browser storage permissions.');}}
 async function erase(){setBusy(true);setMessage('');try{await deleteBrowserAnalytics();setMessage(cs?'Statistiky tohoto prohlížeče byly smazány. Postup zůstává zachovaný.':'Statistics for this browser were deleted. Your progress is unchanged.');}catch{setMessage(cs?'Sběr je vypnutý. Výmaz na serveru se zatím nepodařil; žádost zůstává uložená pro opakování.':'Collection is off. Server deletion has not succeeded yet; the request is saved for retry.');}finally{setBusy(false);}}
 async function retry(){setBusy(true);try{await retryAnalyticsDeletion();setMessage(cs?'Výmaz na serveru byl dokončen.':'Server deletion completed.');}catch{setMessage(cs?'Serverový výmaz stále čeká. Zkus to později.':'Server deletion is still pending. Try again later.');}finally{setBusy(false);}}
 return <section className="analytics-choices" aria-label={cs?'Herní statistiky':'Gameplay statistics'}>
  <h3>{cs?'Pomoz zlepšovat hru':'Help improve the game'}</h3>
  <p>{cs?'Dobrovolně povol statistiky obtížnosti a návštěv: výsledky, tahy, použitou pomoc, aktivitu, zařízení, kampaň a zemi. Supabase je přijímá pod náhodným ID prohlížeče, bez jména a e-mailu. Pro zemi kontaktujeme country.is, které obdrží IP adresu.':'Optionally share difficulty and visit statistics: results, moves, help used, activity, device, campaign and country. Supabase receives them under a random browser ID, without your name or email. Country lookup contacts country.is, which receives your IP address.'}</p>
  <p>{cs?'Volbu můžeš kdykoli změnit. Odmítnutí neomezuje hraní ani odměny. Podrobnosti najdeš v ochraně soukromí.':'You can change your choice anytime. Refusing does not limit play or rewards. See Privacy for details.'}</p>
  <p role="status">{cs?'Statistiky: ':'Statistics: '}{choice==='granted'?(cs?'zapnuté':'on'):choice==='denied'?(cs?'vypnuté':'off'):(cs?'vypnuté — zatím bez volby':'off — no choice yet')}</p>
  <div className="analytics-choice-actions"><button disabled={busy||choice==='granted'} onClick={()=>choose('granted')}>{cs?'Povolit statistiky':'Allow statistics'}</button><button disabled={busy||choice==='denied'} onClick={()=>choose('denied')}>{cs?'Nepovolit statistiky':'Do not allow statistics'}</button></div>
  <button disabled={busy} onClick={erase}>{cs?'Vypnout a smazat moje statistiky':'Turn off and delete my statistics'}</button>
  {pendingAnalyticsDeletions().length>0&&<button disabled={busy} onClick={retry}>{cs?'Zopakovat serverový výmaz':'Retry server deletion'}</button>}
  {message&&<p role="status">{message}</p>}
 </section>;
}
