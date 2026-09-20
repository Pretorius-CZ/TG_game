import {useLayoutEffect,useState,useEffect} from 'react';
import {SAVE_KEY,loadProgress,storeProgress,mergeProgress} from './progressStorage.js';
const storage={getItem:key=>window.localStorage.getItem(key),setItem:(key,value)=>window.localStorage.setItem(key,value)};
export default function useProgressSave(progress,restore){
 const [status,setStatus]=useState('ready');
 useLayoutEffect(()=>{
  const result=storeProgress(storage,progress);setStatus(result.status);
  if(JSON.stringify(result.progress)!==JSON.stringify(progress))restore(result.progress);
 },[progress,restore]);
 useEffect(()=>{function sync(event){if(event.key!==SAVE_KEY)return;const result=loadProgress(storage);if(result.status==='ready')restore(local=>mergeProgress(local,result.progress));else setStatus(result.status);}
 window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
 },[restore]);
 return status;
}
export function initialProgress(){return loadProgress(storage).progress;}
