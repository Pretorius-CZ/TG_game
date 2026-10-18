import React,{useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {showAdConsent,consentFeedback} from './consentUI.js';
import {pauseForAd} from './audio.js';
export default function AdChoicesButton(){
 const {language}=useLanguage(),cs=language==='cs';
 const [busy,setBusy]=useState(false),[result,setResult]=useState(null);
 return <div className="ad-choices-control"><button disabled={busy} onClick={async()=>{
  setBusy(true);setResult(null);try{setResult(await showAdConsent(true,{pause:pauseForAd}));}finally{setBusy(false);}
 }}>{cs?'Změnit reklamní souhlasy':'Advertising privacy choices'}</button>
 {busy&&<p role="status">{cs?'Otevírám reklamní volby…':'Opening advertising choices…'}</p>}
 {result&&<p role="status">{consentFeedback(result,cs)}</p>}
 </div>;
}
