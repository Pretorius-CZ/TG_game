import {useEffect,useRef} from 'react';
import {canUpdate,newVersion} from './updatePolicy.js';
export default function useGameUpdate(save,blocked){
 const latest=useRef({save,blocked});latest.current={save,blocked};
 useEffect(()=>{
  const address=new URL(location.href);if(address.searchParams.has('gameVersion')){address.searchParams.delete('gameVersion');history.replaceState(history.state,'',address.href);}
  if(import.meta.env.DEV)return;
  let stopped=false,checking=false,pending=null,safeSince=0,overlay;
  async function check(){
   if(checking||!navigator.onLine||document.hidden)return;
   checking=true;
   try{
    const url=new URL('./version.json',document.baseURI);url.searchParams.set('check',Date.now());
    const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(8000)});
    if(response.ok){const value=await response.json();if(!stopped)pending=newVersion(value,__GAME_VERSION__)?value.version:null;}
   }catch{/* Network failures never interrupt play. */}finally{checking=false;}
  }
  function apply(){
   const {save,blocked}=latest.current;
   const unsafeUI=document.querySelector('dialog[open], .repair-reveal');
   if(!pending||!canUpdate({online:navigator.onLine,visible:!document.hidden,blocked:blocked||Boolean(unsafeUI),local:save.local,cloud:save.cloud})){safeSince=0;return;}
   if(!safeSince){safeSince=Date.now();return;}
   if(Date.now()-safeSince<2000||overlay)return;
   // A stale HTML response must not cause an endless refresh loop.
   try{if(sessionStorage.getItem('beyond-signal-update-target')===pending)return;
    sessionStorage.setItem('beyond-signal-update-target',pending);
   }catch{return;}
   overlay=document.createElement('div');overlay.className='game-update-overlay';overlay.setAttribute('role','status');
   overlay.textContent=document.documentElement.lang==='cs'?'Aktualizace hry…':'Updating game…';document.body.append(overlay);
   const url=new URL(location.href);url.searchParams.set('gameVersion',pending);location.replace(url.href);
  }
  check();const checks=setInterval(check,120000),applies=setInterval(apply,500);
  window.addEventListener('online',check);document.addEventListener('visibilitychange',check);
  return()=>{stopped=true;clearInterval(checks);clearInterval(applies);overlay?.remove();window.removeEventListener('online',check);document.removeEventListener('visibilitychange',check);};
 },[]);
}
