import {crazyGames} from './platform.js';
import {useRewardAd} from './RewardAd.jsx';
import {useLanguage} from './i18n/Language.jsx';
import React,{createContext,useContext,useEffect,useRef,useState,useCallback} from 'react';
import {recoverLives,configureRecharge,RECHARGE_MS} from './livesRules.js';
const KEY='to-the-stars-lives-v1';
const LivesContext=createContext(null);
export function LivesProvider({children}){
 const {t}=useLanguage();
 const [state,setState]=useState(()=>{try{return JSON.parse(localStorage.getItem(KEY))??{count:5,nextAt:null};}catch{return {count:5,nextAt:null};}}),ref=useRef(state);
 const configured=useRef(false);
 function update(value){ref.current=value;setState(value);try{localStorage.setItem(KEY,JSON.stringify(value));}catch{}}
 const configure=useCallback(launchDone=>{update(configureRecharge(ref.current,launchDone));configured.current=true;},[]);
 useEffect(()=>{const tick=()=>{if(!configured.current)return;const next={...recoverLives(ref.current,Date.now(),ref.current.interval),interval:ref.current.interval};if(next.count!==ref.current.count||next.nextAt!==ref.current.nextAt)update(next);};const timer=setInterval(tick,1000);return()=>clearInterval(timer);},[]);
 function spend(){const current=recoverLives(ref.current,Date.now(),ref.current.interval);if(!current.count)return false;update({count:current.count-1,interval:ref.current.interval,nextAt:current.nextAt??Date.now()+ref.current.interval});return true;}
 return <LivesContext.Provider value={{...state,configure,reward:()=>{const current=recoverLives(ref.current,Date.now(),ref.current.interval);const count=Math.min(5,current.count+1);update({...current,count,nextAt:count===5?null:current.nextAt,interval:ref.current.interval});return true;},minutes:(state.interval??RECHARGE_MS)/60000,spend,refill:()=>update({count:5,nextAt:null,interval:ref.current.interval})}}>{t(children)}</LivesContext.Provider>;
}
export function useLives(){return useContext(LivesContext);}
export function LivesBar(){
 const {t}=useLanguage();
 const lives=useLives(),[now,setNow]=useState(Date.now());
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);
 const seconds=Math.max(0,Math.ceil(((lives.nextAt??now)-now)/1000));
 const countdown=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
 return <div className="lives-bar energy-module" aria-label={t(`${lives.count} of 5 energy charges${lives.nextAt?`, next charge in ${countdown}`:''}`)} title={t(lives.minutes===10?"One energy charge per failed attempt. Recharges every 10 minutes.":"One energy charge per failed attempt. Recharges every 30 minutes.")}>
  <div className="energy-heading"><span>{t("ENERGY")}</span><b>{t(lives.count)}{t("/5")}</b></div>
  <div className="energy-cells" aria-hidden="true">{t(Array.from({length:5},(_,i)=><span key={i} className={`energy-cell ${i<lives.count?'charged':'depleted'}`}><i/></span>))}</div>
  <small>{t(lives.nextAt?`RECHARGE ${countdown}`:'FULL CHARGE')}</small>
 </div>;
}
export function NoLives(){
 const {t}=useLanguage();const lives=useLives();const ad=useRewardAd();return <div className="out-of-moves"><h3>{t("Energy depleted")}</h3><LivesBar/><p>{t(lives.minutes===10?"One charge returns every 10 minutes.":"One charge returns every 30 minutes.")}</p><button disabled={lives.count>0} onClick={()=>ad(t("+1 energy charge"),lives.reward)}>{t(crazyGames?"+1 energy · free":"Ad · +1 energy")}</button>{t(import.meta.env.DEV&&<button className="preview-complete" onClick={lives.refill}>{t("Preview · refill 5 charges")}</button>)}</div>;}
