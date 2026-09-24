import {useLayoutEffect,useState,useEffect,useRef} from 'react';
import {loadProgress,storeProgress,mergeProgress,normalizeProgress} from './progressStorage.js';
import {accountStorage,accountKey} from './accountStorage.js';
import {useAccount} from './Account.jsx';
import {useLives} from './Lives.jsx';
import {supabase} from './supabase.js';
const local={getItem:key=>window.localStorage.getItem(key),setItem:(key,value)=>window.localStorage.setItem(key,value)};
export default function useProgressSave(progress,restore){
 const {user,restartView}=useAccount();
 const lives=useLives();
 const resetting=useRef(false);
 const id=user?.id;
 const [status,setStatus]=useState('ready');
 const latest=useRef(progress);latest.current=progress;
 useLayoutEffect(()=>{
  if(resetting.current)return;
  const result=storeProgress(accountStorage(local,id),progress);setStatus(result.status);
  if(result.progress.resetRevision>(progress.resetRevision??0)){restartView();return;}
  if(JSON.stringify(result.progress)!==JSON.stringify(progress))restore(result.progress);
 },[progress,restore,id]);
 useEffect(()=>{
  function sync(event){
   if(event.key!==accountKey(id))return;
   const result=loadProgress(accountStorage(local,id));
   if(result.status==='ready'){if(result.progress.resetRevision>(latest.current.resetRevision??0))restartView();else restore(current=>mergeProgress(current,result.progress));}else setStatus(result.status);
  }
  window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
 },[restore,id]);
 const [cloud,setCloud]=useState('pending');
 useEffect(()=>{
  if(!id)return;
  let stopped=false,running=false;
  async function sync(){
   if(stopped||running||resetting.current)return;
   running=true;setCloud('syncing');
   try{
    // The server merges under a row lock, so two devices cannot erase repairs.
    const {data,error}=await supabase.rpc('sync_game_progress',{incoming:normalizeProgress(latest.current)}).abortSignal(AbortSignal.timeout(12000));
    if(error)throw error;
    if(data?.version!==1)throw new Error('Unsupported cloud save');
    if((data.resetRevision??0)===(latest.current.resetRevision??0) && latest.current.launchDone && !data.launchDone)throw new Error('Departure migration required');
    if((data.resetRevision??0)===(latest.current.resetRevision??0)&&((latest.current.mineCompleted??0)>(data.mineCompleted??0)||(latest.current.scannerInstalled&&!data.scannerInstalled)))throw new Error('Exploration migration required');
    if((data.resetRevision??0)===(latest.current.resetRevision??0)&&['iceCompleted','wreckCompleted','havenCompleted'].some(key=>(latest.current[key]??0)>(data[key]??0)))throw new Error('Planet expeditions migration required');
    if((data.resetRevision??0)===(latest.current.resetRevision??0)&&latest.current.jumpDone&&!data.jumpDone)throw new Error('Gate migration required');
    if(!stopped&&!resetting.current){
     if((data.resetRevision??0)>(latest.current.resetRevision??0)){
      local.setItem(accountKey(id),JSON.stringify(normalizeProgress(data)));restartView();
     }else restore(current=>mergeProgress(current,normalizeProgress(data)));
     setCloud('saved');
    }
   }catch{if(!stopped)setCloud('offline');}
   finally{running=false;}
  }
  setCloud('syncing');const soon=setTimeout(sync,750);const timer=setInterval(sync,15000);
  window.addEventListener('online',sync);
  return()=>{stopped=true;clearTimeout(soon);clearInterval(timer);window.removeEventListener('online',sync);};
 },[id,restore,JSON.stringify(progress)]);
 async function resetGame(){
  if(resetting.current)return;
  resetting.current=true;
  try{
   let fresh;
   if(id){
    const {data,error}=await supabase.rpc('reset_game_progress',{expected_revision:latest.current.resetRevision??0}).abortSignal(AbortSignal.timeout(12000));
    if(error||data?.version!==1||!Number.isSafeInteger(data.resetRevision))throw error||new Error('Reset unavailable');
    fresh=normalizeProgress(data);
   }else{
    const stored=loadProgress(accountStorage(local)).progress;
    fresh=normalizeProgress({resetRevision:Math.max(stored.resetRevision,latest.current.resetRevision??0)+1});
   }
   // Replace only this profile. Never remove authentication or another account's save.
   local.setItem(accountKey(id),JSON.stringify(fresh));
   lives.refill();restartView();
  }catch(error){resetting.current=false;throw error;}
 }
 return {local:status,cloud:id?cloud:null,resetGame};
}
export function initialProgress(userId){return loadProgress(accountStorage(local,userId)).progress;}
