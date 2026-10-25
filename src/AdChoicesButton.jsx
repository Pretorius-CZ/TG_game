import React,{useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {showAdConsent} from './consentUI.js';
import {pauseForAd} from './audio.js';
export default function AdChoicesButton(){
 const {msg}=useLanguage();
 const [busy,setBusy]=useState(false),[result,setResult]=useState(null);
 return <div className="ad-choices-control"><button disabled={busy} onClick={async()=>{
  setBusy(true);setResult(null);try{setResult(await showAdConsent(true,{pause:pauseForAd,loadingText:msg('consent.loading')}));}finally{setBusy(false);}
 }}>{msg("ui.AdChoicesButton.advertising-privacy-choices")}</button>
 {busy&&<p role="status">{msg("ui.AdChoicesButton.opening-advertising-choices")}</p>}
 {result&&<p role="status">{msg(result==='unavailable'?'consent.unavailable':result==='not-required'?'consent.not-required':'consent.received')}</p>}
 </div>;
}
