import {useContext,useEffect,useState} from 'react';
import {android} from './platform.js';
import {PlaytestContext} from './PlaytestContext.js';
import {useAccount} from './Account.jsx';
import {accountKey} from './accountStorage.js';
import {readStock,spendStock,stockKey,rewardStock,starterStockAllowed,freshStock} from './helperStock.js';
export default function useHelperStock(){
 const playtest=useContext(PlaytestContext);
 const {user}=useAccount();
 const [key]=useState(()=>{
  if(playtest)return playtest.stockKey;
  try{return stockKey(user?.id,JSON.parse(localStorage.getItem(accountKey(user?.id)))?.resetRevision??0);}catch{return stockKey(user?.id);}
 });
 const [initial]=useState(()=>{if(playtest)return freshStock();try{return starterStockAllowed({hostname:location.hostname,userId:user?.id,native:android,progress:JSON.parse(localStorage.getItem(accountKey(user?.id)))})?freshStock():[0,0,0,0,0];}catch{return [0,0,0,0,0];}});
 function read(){try{return readStock(localStorage,key,initial);}catch{return [0,0,0,0,0];}}
 const [stock,setStock]=useState(read);
 useEffect(()=>{const sync=()=>setStock(read());window.addEventListener('storage',sync);window.addEventListener('helper-stock-change',sync);return()=>{window.removeEventListener('storage',sync);window.removeEventListener('helper-stock-change',sync);};},[key]);
 async function consume(index){
  const spend=()=>{try{const next=spendStock(localStorage,key,index,initial);if(!next){setStock(read());return false;}setStock(next);window.dispatchEvent(new Event('helper-stock-change'));return true;}catch{setStock([0,0,0,0,0]);return false;}};
  return navigator.locks?navigator.locks.request(key,spend):spend();
 }
 async function reward(index){
 const grant=()=>{try{const next=rewardStock(localStorage,key,index,initial);if(!next)return false;setStock(next);window.dispatchEvent(new Event('helper-stock-change'));return true;}catch{return false;}};
 return navigator.locks?navigator.locks.request(key,grant):grant();
 }
 return [stock,consume,reward];
}
