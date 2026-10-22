import {crazyGames,android} from './platform.js';
import {useLanguage} from './i18n/Language.jsx';
import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {supabase} from './supabase.js';
import {gameAddress} from './gameAddress.js';
import AdChoicesButton from './AdChoicesButton.jsx';
import AnalyticsChoices from './AnalyticsChoices.jsx';
import LanguageSelect from './i18n/LanguageSelect.jsx';
const itch=import.meta.env.MODE==='itch';
const guestOnly=itch||crazyGames||android;
export const AccountContext = createContext(null);
export const useAccount = () => useContext(AccountContext);

export function AccountProvider({children}) {
 const {t}=useLanguage();
 const [session,setSession]=useState(guestOnly?null:undefined);
 const [generation,setGeneration]=useState(0);
 const [error,setError]=useState('');
 useEffect(()=>{
  if(guestOnly)return;
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event,next)=>setSession(next));
  supabase.auth.getSession().then(({error})=>{if(error){setError('Could not restore sign-in. Try again.');setSession(null);}});
  return()=>subscription.unsubscribe();
 },[]);
 if(session===undefined)return <p role="status">{t("Restoring your session…")}</p>;
 return <AccountContext.Provider value={{user:session?.user,error,setError,restartView:()=>setGeneration(n=>n+1)}}>{t(React.cloneElement(children,{key:`${session?.user.id||'guest'}:${generation}`}))}</AccountContext.Provider>;
}
export function AccountButton({onImport,onRestart}){
 const {t,msg,language}=useLanguage();
 const {user,error,setError}=useAccount();
 const [importMessage,setImportMessage]=useState('');
 const [open,setOpen]=useState(false),[busy,setBusy]=useState(false),[confirmReset,setConfirmReset]=useState(false);
 const toggle=useRef(null),heading=useRef(null);
 const close=()=>{setOpen(false);setConfirmReset(false);toggle.current?.focus({preventScroll:true});};
 useEffect(()=>{if(open)heading.current?.focus({preventScroll:true});},[open]);
 async function importGuest(){
  setBusy(true);setError('');setImportMessage(language==='cs'?'Přebírám a ukládám postup…':'Importing and saving progress…');
  try{const result=await onImport();setImportMessage(language==='cs'?
   result.state==='saved'?'Postup hosta byl převzat a uložen online. Na druhém zařízení obnov stránku hry.':result.state==='empty'?'V tomto prohlížeči není uložený žádný postup hosta.':'Postup byl převzat v tomto zařízení. Online uložení se nepodařilo; postup hosta je zachovaný. Zkontroluj připojení a zkus postup převzít znovu.':
   result.state==='saved'?'Guest progress imported and saved online. Refresh the game on your other device.':result.state==='empty'?'No guest progress was found in this browser.':'Progress imported on this device. Cloud saving failed; the guest save is safe. Check your connection and try importing again.');
  }catch{setImportMessage(language==='cs'?'Postup se nepodařilo převzít. Uložený postup hosta zůstává zachovaný.':'Import failed. Your guest save is still safe.');}finally{setBusy(false);}
 }
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
 return <div className="account-control"><button ref={toggle} onClick={()=>open?close():setOpen(true)} aria-expanded={open}>{t("⚙ Settings")}</button>{t(open&&<section className="account-panel" aria-label={t("Game settings")} onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();close();}}}>
 <h2 ref={heading} tabIndex={-1}>{t("Game settings")}</h2><fieldset className="language-picker"><legend>{t("Language")}</legend><LanguageSelect/></fieldset>
 {t(confirmReset?<div className="restart-confirm" role="alert"><h3>{t("Start over?")}</h3><p>{t(user?"This resets all game progress for this account on every device, including repairs, the ship log and completed chapters.":"This resets all guest progress in this browser, including repairs, the ship log and completed chapters.")}{t(" You will start with 5 energy charges here. This cannot be undone.")}</p><button disabled={busy} onClick={restart}>{t("Yes, restart game")}</button><button disabled={busy} onClick={()=>setConfirmReset(false)}>{t("Cancel")}</button></div>:<button className="restart-game-button" disabled={busy} onClick={()=>setConfirmReset(true)}>{t("Restart entire game")}</button>)}
 {!guestOnly&&<a className="balance-report-link" href="./balance.html" target="_blank" rel="noopener">{language==='cs'?'Přehled testování obtížnosti':'Difficulty testing report'}</a>}
 {!crazyGames&&<AnalyticsChoices/>}
 {android?<><p>{msg('android.localSave')}</p><button onClick={async()=>{try{const {androidPrivacy}=await import('./androidAds.js');await androidPrivacy();}catch{setError(msg('android.privacyUnavailable'));}}}>{msg('android.adPrivacy')}</button>{error&&<p role="alert">{error}</p>}<p><a href="https://playbeyondthesignal.com/privacy.html" target="_blank" rel="noopener">{t('Privacy')}</a>{' · '}<a href="https://playbeyondthesignal.com/contact.html" target="_blank" rel="noopener">{language==='cs'?'Kontakt':'Contact'}</a></p></>:crazyGames?<p>{language==='cs'?'Postup se ukládá automaticky.':'Progress is saved automatically.'}</p>:itch?<p>{language==='cs'?'Verze itch.io ukládá postup v tomto prohlížeči. Google přihlášení je dostupné na našem webu.':'The itch.io edition saves progress in this browser. Google sign-in is available on our website.'} <a href="https://playbeyondthesignal.com/" target="_blank" rel="noopener">playbeyondthesignal.com</a></p>:<><h3>{t("Account & cloud save")}</h3>
 <p>{t(user?user.email:'Sign in with Google to save repairs and your ship log across devices. Guest progress stays on this device.')}</p>
 <p>{t("Energy is saved only in this browser. Unfinished puzzles are not saved.")}</p>{t(user&&<button disabled={busy} onClick={importGuest}>{t("Import guest progress from this device")}</button>)}
 {location.hostname==='game.playbeyondthesignal.com'&&<p><a href={gameAddress(location.href,{transfer:true})}>{language==='cs'?'Převzít původní postup, energii a pomůcky':'Recover original progress, energy and helpers'}</a></p>}
 {importMessage&&<p className="import-feedback" role="status" aria-live="polite">{importMessage}</p>}
 <button className="primary" disabled={busy} onClick={user?logout:login}>{t(user?'Sign out':'Continue with Google')}</button>
 {t(error&&<p role="alert">{t(error)}</p>)}</>}

 {!guestOnly&&import.meta.env.MODE!=='telegram'&&<><p><a href="./privacy.html" target="_blank" rel="noopener">{language==='cs'?'Ochrana soukromí':'Privacy'}</a>{' · '}<a href="./contact.html" target="_blank" rel="noopener">{language==='cs'?'Kontakt':'Contact'}</a></p><AdChoicesButton/></>}
 <button className="keep-playing account-close" disabled={busy} onClick={close}>{t("Close")}</button>
 </section>)}</div>;
}

