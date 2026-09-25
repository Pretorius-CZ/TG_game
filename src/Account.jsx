import {useLanguage} from './i18n/Language.jsx';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {supabase} from './supabase.js';
export const AccountContext = createContext(null);
export const useAccount = () => useContext(AccountContext);

export function AccountProvider({children}) {
 const {t}=useLanguage();
 const [session,setSession]=useState(undefined);
 const [generation,setGeneration]=useState(0);
 const [error,setError]=useState('');
 useEffect(()=>{
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event,next)=>setSession(next));
  supabase.auth.getSession().then(({error})=>{if(error){setError('Could not restore sign-in. Try again.');setSession(null);}});
  return()=>subscription.unsubscribe();
 },[]);
 if(session===undefined)return <p role="status">{t("Restoring your session…")}</p>;
 return <AccountContext.Provider value={{user:session?.user,error,setError,restartView:()=>setGeneration(n=>n+1)}}>{t(React.cloneElement(children,{key:`${session?.user.id||'guest'}:${generation}`}))}</AccountContext.Provider>;
}
export function AccountButton({onImport,onRestart}){
 const {t,language,setLanguage}=useLanguage();
 const {user,error,setError}=useAccount();
 const [open,setOpen]=useState(false),[busy,setBusy]=useState(false),[confirmReset,setConfirmReset]=useState(false);
 async function restart(){setBusy(true);setError('');try{await onRestart();}catch{setError('Restart failed. Check your connection and try again. Your progress has not been cleared on this device.');}finally{setBusy(false);}}
 async function login(){
  setBusy(true);setError('');
  const {error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:new URL('./',window.location.href).href}});
  if(error){setError('Google sign-in is not available yet. Please try again later.');setBusy(false);}
 }
 async function logout(){
  setBusy(true);const {error}=await supabase.auth.signOut({scope:'local'});
  if(error)setError('Could not sign out. Please try again.');
  setBusy(false);
 }
 return <div className="account-control"><button onClick={()=>setOpen(!open)} aria-expanded={open}>{t("⚙ Settings")}</button>{t(open&&<section className="account-panel" aria-label={t("Game settings")}>
 <h2>{t("Game settings")}</h2><fieldset className="language-picker"><legend>{t("Language")}</legend><button type="button" aria-pressed={language==='en'} onClick={()=>setLanguage('en')}>EN · English</button><button type="button" aria-pressed={language==='cs'} onClick={()=>setLanguage('cs')}>CZ · Čeština</button></fieldset>
 {t(confirmReset?<div className="restart-confirm" role="alert"><h3>{t("Start over?")}</h3><p>{t(user?'This resets all repairs, the ship log and departure for this account on every device.':'This resets all guest repairs, the ship log and departure on this browser.')}{t(" You will start with 5 energy charges here. This cannot be undone.")}</p><button disabled={busy} onClick={restart}>{t("Yes, restart game")}</button><button disabled={busy} onClick={()=>setConfirmReset(false)}>{t("Cancel")}</button></div>:<button className="restart-game-button" disabled={busy} onClick={()=>setConfirmReset(true)}>{t("Restart entire game")}</button>)}
 <h3>{t("Account & cloud save")}</h3>
 <p>{t(user?user.email:'Sign in with Google to save repairs and your ship log across devices. Guest progress stays on this device.')}</p>
 <p>{t("Energy and unfinished puzzles remain on this device.")}</p>{t(user&&<button disabled={busy} onClick={onImport}>{t("Import guest progress from this device")}</button>)}
 <button className="primary" disabled={busy} onClick={user?logout:login}>{t(user?'Sign out':'Continue with Google')}</button>
 {t(error&&<p role="alert">{t(error)}</p>)}

 <button disabled={busy} onClick={()=>{setOpen(false);setConfirmReset(false);}}>{t("Close")}</button>
 </section>)}</div>;
}

