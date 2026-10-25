import React,{useEffect,useRef,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {pauseForAd} from './audio.js';
import {createRewardedPlacement,loadGoogleTestAds,suspendGameDialogs} from './googleH5Ads.js';
import {getAdConsent,consentAllowsAds} from './adConsent.js';
import {showAdConsent} from './consentUI.js';

export default function GoogleRewardAd({offer,close}){
 const {msg}=useLanguage(),dialog=useRef(null),placement=useRef(null),alive=useRef(true),claiming=useRef(false),verified=useRef(false);
 const [phase,setPhase]=useState(offer.mode==='disabled'?'unavailable':'loading'),[show,setShow]=useState(null);
 const [issue,setIssue]=useState(offer.mode==='disabled'?'disabled':null);
 async function claim(){
  if(!verified.current||claiming.current)return;claiming.current=true;setPhase('claiming');
  try{if(await offer.grant()===false)throw Error();if(alive.current)close();}
  catch{if(alive.current)setPhase('claim-error');}finally{claiming.current=false;}
 }
 useEffect(()=>{
  alive.current=true;const opener=document.activeElement;
  dialog.current.showModal();dialog.current.querySelector('button:not(:disabled)')?.focus();
  let resume;
  const unsubscribe=getAdConsent().subscribe(()=>{if(!consentAllowsAds(getAdConsent().getStatus()))placement.current?.cancel();});
  if(offer.mode==='test')showAdConsent(false,{pause:pauseForAd}).then(async status=>{
   if(!alive.current)return;
   if(!consentAllowsAds(status)){setIssue(navigator.onLine===false?'offline':getAdConsent().getFailure()==='load'?'load':status==='denied'?'consent-denied':'consent-unavailable');setPhase('unavailable');return;}
   const adBreak=await loadGoogleTestAds();
   if(!alive.current)return;
   if(!consentAllowsAds(getAdConsent().getStatus())){setIssue('consent-denied');setPhase('unavailable');return;}
   placement.current=createRewardedPlacement({adBreak,onReady:fn=>{setShow(()=>fn);setPhase('ready');},
    onPause:()=>{resume=suspendGameDialogs();pauseForAd(true);},
    onResume:()=>{resume?.();resume=null;pauseForAd(false);}
   });
   placement.current.result.then(result=>{
    if(!alive.current)return;
    if(result.viewed){verified.current=true;void claim();}
    else {const consent=getAdConsent().getStatus();setIssue(navigator.onLine===false?'offline':!consentAllowsAds(consent)?consent==='denied'?'consent-denied':'consent-unavailable':result.status);setPhase(result.status==='dismissed'?'dismissed':'unavailable');}
   });
  }).catch(()=>{if(alive.current){setIssue(navigator.onLine===false?'offline':'load');setPhase('unavailable');}});
  return()=>{alive.current=false;unsubscribe();placement.current?.cancel();resume?.();pauseForAd(false);if(opener?.isConnected)opener.focus();};
 },[]);
 const messages={"loading":msg('ads.phase.loading'),"ready":msg('ads.phase.ready'),"showing":msg('ads.phase.showing'),"unavailable":msg('ads.phase.unavailable'),"dismissed":msg('ads.phase.dismissed'),"claiming":msg('ads.phase.claiming'),"claim-error":msg('ads.phase.claim-error')};
 const problems={"consent-denied":[msg('ads.problem.consent-denied.0'),msg('ads.problem.consent-denied.1')],"consent-unavailable":[msg('ads.problem.consent-unavailable.0'),msg('ads.problem.consent-unavailable.1')],"load":[msg('ads.problem.load.0'),msg('ads.problem.load.1')],"offline":[msg('ads.problem.offline.0'),msg('ads.problem.offline.1')],"noAdPreloaded":[msg('ads.problem.noAdPreloaded.0'),msg('ads.problem.noAdPreloaded.1')],"frequencyCapped":[msg('ads.problem.frequencyCapped.0'),msg('ads.problem.frequencyCapped.1')],"timeout":[msg('ads.problem.timeout.0'),msg('ads.problem.timeout.1')],"disabled":[msg('ads.problem.disabled.0'),msg('ads.problem.disabled.1')]};
 const problem=problems[issue]??([msg('ads.problem.unknown.0'),msg('ads.problem.unknown.1')]);
 return <dialog ref={dialog} className="reward-ad" data-ad-mode={offer.mode} aria-labelledby="google-reward-title" onCancel={e=>{e.preventDefault();if(!['showing','claiming'].includes(phase))close();}}>
  <span className="eyebrow">{offer.mode==='test'?'GOOGLE · TEST MODE':msg('ads.unavailable')}</span>
  <h2 id="google-reward-title">{msg('ads.title')}</h2><p>{offer.reward}</p>
  <p role="status">{phase==='unavailable'?problem[0]:messages[phase]}</p>
  {phase==='unavailable'&&<><p className="ad-explanation">{problem[1]}</p><p>{msg('ads.noReward')}</p></>}
  {phase==='ready'&&<button className="primary" onClick={()=>{setPhase('showing');show();}}>{msg('ads.watchTest')}</button>}
  {phase==='claim-error'&&<button className="primary" onClick={claim}>{msg('ads.retryReward')}</button>}
  <button disabled={['showing','claiming'].includes(phase)} onClick={close}>{msg('ads.back')}</button>
 </dialog>;
}
