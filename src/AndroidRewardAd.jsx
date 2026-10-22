import React,{useEffect,useRef,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {pauseForAd} from './audio.js';

export default function AndroidRewardAd({offer,close}){
 const {msg}=useLanguage(),dialog=useRef(null),locked=useRef(false),earned=useRef(false);
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{const focus=document.activeElement;dialog.current.showModal();pauseForAd(true);return()=>{pauseForAd(false);if(focus?.isConnected)focus.focus({preventScroll:true});};},[]);
 async function watch(){
  if(locked.current)return;locked.current=true;setBusy(true);setError('');
  try{
   if(!earned.current){const {androidMovesAd}=await import('./androidAds.js');earned.current=await androidMovesAd();}
   if(!earned.current){setError(msg('android.notCompleted'));return;}
   if(await offer.grant()===false)throw Error('grant');
   close();
  }catch{setError(msg(earned.current?'android.claimFailed':'android.adUnavailable'));}
  finally{locked.current=false;setBusy(false);}
 }
 return <dialog ref={dialog} className="reward-ad" aria-labelledby="android-ad-title" onCancel={event=>{event.preventDefault();if(!locked.current)close();}}>
  <span className="eyebrow">{msg('android.testAd')}</span><h2 id="android-ad-title">{msg('android.movesAd')}</h2><p>{msg('android.sameBoard')}</p>
  {error&&<p role="alert">{error}</p>}
  <button className="primary" disabled={busy} onClick={watch}>{msg(busy?'android.wait':earned.current?'android.claim':'android.watch')}</button>
  <button disabled={busy} onClick={close}>{msg('android.close')}</button>
 </dialog>;
}
