import React, {createContext, useContext, useEffect, useState} from 'react';
import {supabase} from './supabase.js';
export const AccountContext = createContext(null);
export const useAccount = () => useContext(AccountContext);

export function AccountProvider({children}) {
 const [session,setSession]=useState(undefined);
 const [error,setError]=useState('');
 useEffect(()=>{
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event,next)=>setSession(next));
  supabase.auth.getSession().then(({error})=>{if(error){setError('Could not restore sign-in. Try again.');setSession(null);}});
  return()=>subscription.unsubscribe();
 },[]);
 if(session===undefined)return <p role="status">Restoring your session…</p>;
 return <AccountContext.Provider value={{user:session?.user,error,setError}}>{React.cloneElement(children,{key:session?.user.id||'guest'})}</AccountContext.Provider>;
}
export function AccountButton({onImport}){
 const {user,error,setError}=useAccount();
 const [open,setOpen]=useState(false),[busy,setBusy]=useState(false);
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
 return <div className="account-control"><button onClick={()=>setOpen(!open)} aria-expanded={open}>◎ {user?'Account':'Save online'}</button>{open&&<section className="account-panel" aria-label="Cloud saves">
 <h2>{user?'Your account':'Keep your journey'}</h2>
 <p>{user?user.email:'Sign in with Google to save repairs and your ship log across devices. Guest progress stays on this device.'}</p>
 <p>Energy and unfinished puzzles remain on this device.</p>{user&&<button onClick={onImport}>Import guest progress from this device</button>}
 <button className="primary" disabled={busy} onClick={user?logout:login}>{user?'Sign out':'Continue with Google'}</button>
 {error&&<p role="alert">{error}</p>}
 <button onClick={()=>setOpen(false)}>Close</button>
 </section>}</div>;
}

