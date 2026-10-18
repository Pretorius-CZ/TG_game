import React,{useEffect,useRef,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {pauseForAd} from './audio.js';
import {createRewardedPlacement,loadGoogleTestAds,suspendGameDialogs} from './googleH5Ads.js';

export default function GoogleRewardAd({offer,close}){
 const {language}=useLanguage(),cs=language==='cs',dialog=useRef(null),placement=useRef(null),alive=useRef(true),claiming=useRef(false),verified=useRef(false);
 const [phase,setPhase]=useState(offer.mode==='disabled'?'unavailable':'loading'),[show,setShow]=useState(null);
 async function claim(){
  if(!verified.current||claiming.current)return;claiming.current=true;setPhase('claiming');
  try{if(await offer.grant()===false)throw Error();if(alive.current)close();}
  catch{if(alive.current)setPhase('claim-error');}finally{claiming.current=false;}
 }
 useEffect(()=>{
  alive.current=true;const opener=document.activeElement;
  dialog.current.showModal();dialog.current.querySelector('button:not(:disabled)')?.focus();
  let resume;
  if(offer.mode==='test')loadGoogleTestAds().then(adBreak=>{
   if(!alive.current)return;
   placement.current=createRewardedPlacement({adBreak,onReady:fn=>{setShow(()=>fn);setPhase('ready');},
    onPause:()=>{resume=suspendGameDialogs();pauseForAd(true);},
    onResume:()=>{resume?.();resume=null;pauseForAd(false);}
   });
   placement.current.result.then(result=>{
    if(!alive.current)return;
    if(result.viewed){verified.current=true;void claim();}
    else setPhase(result.status==='dismissed'?'dismissed':'unavailable');
   });
  }).catch(()=>{if(alive.current)setPhase('unavailable');});
  return()=>{alive.current=false;placement.current?.cancel();resume?.();pauseForAd(false);if(opener?.isConnected)opener.focus();};
 },[]);
 const messages=cs?{
  loading:'Připravuji testovací reklamu…',ready:'Je připravená testovací reklama Googlu. Nevytváří reklamní výnos.',
  showing:'Probíhá testovací reklama…',unavailable:'Reklama teď není dostupná. Nic se nespotřebovalo a hra zůstává zachovaná.',
  dismissed:'Reklama nebyla dokončená. Odměna nebyla přidělena.',claiming:'Ukládám odměnu…','claim-error':'Odměnu se nepodařilo uložit. Zkus uložení znovu bez další reklamy.'
 }:{loading:'Preparing a test ad…',ready:'A Google test ad is ready. It does not generate advertising revenue.',
  showing:'Test ad in progress…',unavailable:'No ad is available right now. Nothing was spent and your game is preserved.',
  dismissed:'The ad was not completed. No reward was granted.',claiming:'Saving your reward…','claim-error':'Your reward could not be saved. Retry saving without watching another ad.'};
 return <dialog ref={dialog} className="reward-ad" data-ad-mode={offer.mode} aria-labelledby="google-reward-title" onCancel={e=>{e.preventDefault();if(!['showing','claiming'].includes(phase))close();}}>
  <span className="eyebrow">{offer.mode==='test'?'GOOGLE · TEST MODE':cs?'REKLAMY NEDOSTUPNÉ':'ADS UNAVAILABLE'}</span>
  <h2 id="google-reward-title">{cs?'Odměna za reklamu':'Rewarded ad'}</h2><p>{offer.reward}</p>
  <p role="status">{messages[phase]}</p>
  {phase==='ready'&&<button className="primary" onClick={()=>{setPhase('showing');show();}}>{cs?'Spustit testovací reklamu':'Watch test ad'}</button>}
  {phase==='claim-error'&&<button className="primary" onClick={claim}>{cs?'Znovu uložit odměnu':'Retry saving reward'}</button>}
  <button disabled={['showing','claiming'].includes(phase)} onClick={close}>{cs?'Zpět do hry':'Back to game'}</button>
 </dialog>;
}
