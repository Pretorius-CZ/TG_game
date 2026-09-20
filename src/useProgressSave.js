import {useLayoutEffect,useState,useEffect,useRef} from 'react';
import {loadProgress,storeProgress,mergeProgress,normalizeProgress} from './progressStorage.js';
import {accountStorage,accountKey} from './accountStorage.js';
import {useAccount} from './Account.jsx';
import {supabase} from './supabase.js';
const local={getItem:key=>window.localStorage.getItem(key),setItem:(key,value)=>window.localStorage.setItem(key,value)};
export default function useProgressSave(progress,restore){
 const {user}=useAccount();
 const id=user?.id;
 const [status,setStatus]=useState('ready');
 const latest=useRef(progress);latest.current=progress;
 useLayoutEffect(()=>{
  const result=storeProgress(accountStorage(local,id),progress);setStatus(result.status);
  if(JSON.stringify(result.progress)!==JSON.stringify(progress))restore(result.progress);
 },[progress,restore,id]);
 useEffect(()=>{
  function sync(event){
   if(event.key!==accountKey(id))return;
   const result=loadProgress(accountStorage(local,id));
   if(result.status==='ready')restore(current=>mergeProgress(current,result.progress));else setStatus(result.status);
  }
  window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
 },[restore,id]);
 const [cloud,setCloud]=useState('pending');
 useEffect(()=>{
  if(!id)return;
  let stopped=false,running=false;
  async function sync(){
   if(stopped||running)return;
   running=true;setCloud('syncing');
   try{
    // The server merges under a row lock, so two devices cannot erase repairs.
    const {data,error}=await supabase.rpc('sync_game_progress',{incoming:normalizeProgress(latest.current)}).abortSignal(AbortSignal.timeout(12000));
    if(error)throw error;
    if(data?.version!==1)throw new Error('Unsupported cloud save');
    if(!stopped){restore(current=>mergeProgress(current,normalizeProgress(data)));setCloud('saved');}
   }catch{if(!stopped)setCloud('offline');}
   finally{running=false;}
  }
  setCloud('syncing');const soon=setTimeout(sync,750);const timer=setInterval(sync,15000);
  window.addEventListener('online',sync);
  return()=>{stopped=true;clearTimeout(soon);clearInterval(timer);window.removeEventListener('online',sync);};
 },[id,restore,JSON.stringify(progress)]);
 return {local:status,cloud:id?cloud:null};
}
export function initialProgress(userId){return loadProgress(accountStorage(local,userId)).progress;}
