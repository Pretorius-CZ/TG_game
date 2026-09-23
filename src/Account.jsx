import React, {createContext, useContext, useEffect, useState} from 'react';
import {supabase} from './supabase.js';
export const AccountContext = createContext(null);
export const useAccount = () => useContext(AccountContext);

export function AccountProvider({children}) {
 const [session,setSession]=useState(undefined);
 const [generation,setGeneration]=useState(0);
 const [error,setError]=useState('');
 useEffect(()=>{
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event,next)=>setSession(next));
  supabase.auth.getSession().then(({error})=>{if(error){setError('Could not restore sign-in. Try again.');setSession(null);}});
  return()=>subscription.unsubscribe();
 },[]);
 if(session===undefined)return <p role="status">Restoring your session…</p>;
 return <AccountContext.Provider value={{user:session?.user,error,setError,restartView:()=>setGeneration(n=>n+1)}}>{React.cloneElement(children,{key:`${session?.user.id||'guest'}:${generation}`})}</AccountContext.Provider>;
}
export function AccountButton({onImport,onRestart}){
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
 return <div className="account-control"><button onClick={()=>setOpen(!open)} aria-expanded={open}>⚙ Settings</button>{open&&<section className="account-panel" aria-label="Game settings">
 <h2>Game settings</h2>
 {confirmReset?<div className="restart-confirm" role="alert"><h3>Start over?</h3><p>{user?'This resets all repairs, the ship log and departure for this account on every device.':'This resets all guest repairs, the ship log and departure on this browser.'} You will start with 5 energy charges here. This cannot be undone.</p><button disabled={busy} onClick={restart}>Yes, restart game</button><button disabled={busy} onClick={()=>setConfirmReset(false)}>Cancel</button></div>:<button className="restart-game-button" disabled={busy} onClick={()=>setConfirmReset(true)}>Restart entire game</button>}
 <h3>Account & cloud save</h3>
 <p>{user?user.email:'Sign in with Google to save repairs and your ship log across devices. Guest progress stays on this device.'}</p>
 <p>Energy and unfinished puzzles remain on this device.</p>{user&&<button disabled={busy} onClick={onImport}>Import guest progress from this device</button>}
 <button className="primary" disabled={busy} onClick={user?logout:login}>{user?'Sign out':'Continue with Google'}</button>
 {error&&<p role="alert">{error}</p>}

 <button disabled={busy} onClick={()=>{setOpen(false);setConfirmReset(false);}}>Close</button>
 </section>}</div>;
}

