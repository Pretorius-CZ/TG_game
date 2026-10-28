import React,{useEffect,useState} from 'react';
import {android} from './platform.js';
import {useLanguage} from './i18n/Language.jsx';
import LanguageSelect from './i18n/LanguageSelect.jsx';
import {readAudience,saveAudience,forceLocalPlay} from './androidAudience.js';
import {setAnalyticsChoice} from './analyticsPrivacy.js';
import {supabase} from './supabase.js';
import './androidAudience.css';

export default function AndroidAudienceGate({children}){
 const {msg}=useLanguage(),[group,setGroup]=useState(readAudience),[editing,setEditing]=useState(false),[choice,setChoice]=useState(''),[failed,setFailed]=useState(false);
 useEffect(()=>{if(!android)return;const open=()=>{supabase.auth.stopAutoRefresh();setChoice('');setEditing(true);};window.addEventListener('android-age-settings',open);return()=>window.removeEventListener('android-age-settings',open);},[]);
 if(!android||(group&&!editing))return children;
 function submit(event){
  event.preventDefault();if(!choice)return;
  try{
   // Discard optional upload queues before entering local-only play; saves are untouched.
   if(choice!=='adult')setAnalyticsChoice('denied');
   saveAudience(choice);
   // Recreate the auth client with the new persistence policy, with no old account provider.
   location.reload();
  }catch{setFailed(true);}
 }
 return <main className="android-audience"><div className="android-audience-card"><LanguageSelect/><h1>{msg('audience.title')}</h1><p>{msg('audience.intro')}</p><form onSubmit={submit}><fieldset><legend>{msg('audience.group')}</legend>{[['minor','audience.minor'],['adult','audience.adult'],['private','audience.private']].map(([value,id])=><label key={value}><input type="radio" name="age-group" value={value} checked={choice===value} onChange={()=>setChoice(value)}/>{msg(id)}</label>)}</fieldset><button className="primary" disabled={!choice}>{msg('audience.continue')}</button></form><p>{msg('audience.storage')}</p>{failed&&<div role="alert"><p>{msg('audience.failed')}</p><button onClick={()=>{forceLocalPlay();supabase.auth.stopAutoRefresh();setGroup('private');setEditing(false);}}>{msg('audience.localContinue')}</button></div>}</div></main>;
}
