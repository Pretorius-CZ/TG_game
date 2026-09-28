import {useEffect,useState} from 'react';
import {useAccount} from './Account.jsx';
import {accountKey} from './accountStorage.js';
import {readStock,spendStock,stockKey} from './helperStock.js';
export default function useHelperStock(){
 const {user}=useAccount();
 const [key]=useState(()=>{
  try{return stockKey(user?.id,JSON.parse(localStorage.getItem(accountKey(user?.id)))?.resetRevision??0);}catch{return stockKey(user?.id);}
 });
 function read(){try{return readStock(localStorage,key);}catch{return [0,0,0,0,0];}}
 const [stock,setStock]=useState(read);
 useEffect(()=>{const sync=()=>setStock(read());window.addEventListener('storage',sync);window.addEventListener('helper-stock-change',sync);return()=>{window.removeEventListener('storage',sync);window.removeEventListener('helper-stock-change',sync);};},[key]);
 async function consume(index){
  const spend=()=>{try{const next=spendStock(localStorage,key,index);if(!next){setStock(read());return false;}setStock(next);window.dispatchEvent(new Event('helper-stock-change'));return true;}catch{setStock([0,0,0,0,0]);return false;}};
  return navigator.locks?navigator.locks.request(key,spend):spend();
 }
 return [stock,consume];
}
