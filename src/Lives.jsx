import {crazyGames} from './platform.js';
import {useRewardAd} from './RewardAd.jsx';
import {useLanguage} from './i18n/Language.jsx';
import React,{createContext,useContext,useEffect,useRef,useState,useCallback} from 'react';
import {recoverLives,configureRecharge,RECHARGE_MS} from './livesRules.js';
import {createAttemptEnergy} from './attemptEnergy.js';
const KEY='to-the-stars-lives-v1';
const LivesContext=createContext(null);
export function LivesProvider({children,storageKey=KEY,practice=false}){
 const {t}=useLanguage();
 const [state,setState]=useState(()=>{if(practice)return {count:5,nextAt:null};try{return JSON.parse(localStorage.getItem(storageKey))??{count:5,nextAt:null};}catch{return {count:5,nextAt:null};}}),ref=useRef(state);
 const configured=useRef(false);
 function update(value){ref.current=value;setState(value);if(!practice)try{localStorage.setItem(storageKey,JSON.stringify(value));}catch{}}
 const configure=useCallback(launchDone=>{update(configureRecharge(ref.current,launchDone));configured.current=true;},[]);
 useEffect(()=>{const tick=()=>{if(!configured.current)return;const next={...recoverLives(ref.current,Date.now(),ref.current.interval),interval:ref.current.interval};if(next.count!==ref.current.count||next.nextAt!==ref.current.nextAt)update(next);};const timer=setInterval(tick,1000);return()=>clearInterval(timer);},[]);
 function spend(){if(practice)return true;const interval=ref.current.interval??RECHARGE_MS;const current=recoverLives(ref.current,Date.now(),interval);if(!current.count)return false;update({count:current.count-1,interval,nextAt:current.nextAt??Date.now()+interval});return true;}
 function reward(){const interval=ref.current.interval??RECHARGE_MS;const current=recoverLives(ref.current,Date.now(),interval);const count=Math.min(5,current.count+1);update({...current,count,nextAt:count===5?null:current.nextAt,interval});return true;}
 const attempts=useRef(null);
 if(!attempts.current)attempts.current=createAttemptEnergy({spend,reward});
 return <LivesContext.Provider value={{...state,configure,reward,reserveAttempt:attempts.current.reserve,settleAttempt:attempts.current.settle,minutes:(state.interval??RECHARGE_MS)/60000,spend,refill:()=>update({count:5,nextAt:null,interval:ref.current.interval})}}>{t(children)}</LivesContext.Provider>;
}
export function useLives(){return useContext(LivesContext);}
export function LivesBar(){
 const {t,language}=useLanguage();
 const lives=useLives(),[now,setNow]=useState(Date.now());
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);
 const seconds=Math.max(0,Math.ceil(((lives.nextAt??now)-now)/1000));
 const countdown=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
 return <div className="lives-bar energy-module" aria-label={t(`${lives.count} of 5 energy charges${lives.nextAt?`, next charge in ${countdown}`:''}`)} title={(language==='cs'?'První platný tah rezervuje jeden článek. Výhra jej vrátí. Obnovení rozehraného pokusu jej spotřebuje. ':'The first valid move reserves one charge. Winning refunds it. Reloading a started attempt uses it. ')+t(lives.minutes===10?"One energy charge per failed attempt. Recharges every 10 minutes.":"One energy charge per failed attempt. Recharges every 30 minutes.")}>
  <div className="energy-heading"><span>{t("ENERGY")}</span><b>{t(lives.count)}{t("/5")}</b></div>
  <div className="energy-cells" aria-hidden="true">{t(Array.from({length:5},(_,i)=><span key={i} className={`energy-cell ${i<lives.count?'charged':'depleted'}`}><i/></span>))}</div>
  <small>{t(lives.nextAt?`RECHARGE ${countdown}`:'FULL CHARGE')}</small>
 </div>;
}
export function NoLives(){
 const {t}=useLanguage();const lives=useLives();const ad=useRewardAd();return <div className="out-of-moves"><h3>{t("Energy depleted")}</h3><LivesBar/><p>{t(lives.minutes===10?"One charge returns every 10 minutes.":"One charge returns every 30 minutes.")}</p><button disabled={lives.count>0} onClick={()=>ad(t("+1 energy charge"),lives.reward)}>{t(crazyGames?"+1 energy · free":"Ad · +1 energy")}</button>{t(import.meta.env.DEV&&<button className="preview-complete" onClick={lives.refill}>{t("Preview · refill 5 charges")}</button>)}</div>;}
