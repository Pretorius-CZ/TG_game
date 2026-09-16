import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import {recoverLives,RECHARGE_MS} from './livesRules.js';
const KEY='to-the-stars-lives-v1';
const LivesContext=createContext(null);
export function LivesProvider({children}){
 const [state,setState]=useState(()=>{try{return recoverLives(JSON.parse(localStorage.getItem(KEY)));}catch{return recoverLives(null);}}),ref=useRef(state);
 function update(value){ref.current=value;setState(value);try{localStorage.setItem(KEY,JSON.stringify(value));}catch{}}
 useEffect(()=>{const tick=()=>{const next=recoverLives(ref.current);if(next.count!==ref.current.count||next.nextAt!==ref.current.nextAt)update(next);};const timer=setInterval(tick,1000);return()=>clearInterval(timer);},[]);
 function spend(){const current=recoverLives(ref.current);if(!current.count)return false;update({count:current.count-1,nextAt:current.nextAt??Date.now()+RECHARGE_MS});return true;}
 return <LivesContext.Provider value={{...state,spend,refill:()=>update({count:5,nextAt:null})}}>{children}</LivesContext.Provider>;
}
export function useLives(){return useContext(LivesContext);}
export function LivesBar(){
 const lives=useLives(),[now,setNow]=useState(Date.now());
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);
 const seconds=Math.max(0,Math.ceil(((lives.nextAt??now)-now)/1000));
 const countdown=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
 return <div className="lives-bar energy-module" aria-label={`${lives.count} of 5 energy charges${lives.nextAt?`, next charge in ${countdown}`:''}`} title="One energy charge per failed attempt. Recharges every 30 minutes.">
  <div className="energy-heading"><span>ENERGY</span><b>{lives.count}/5</b></div>
  <div className="energy-cells" aria-hidden="true">{Array.from({length:5},(_,i)=><span key={i} className={`energy-cell ${i<lives.count?'charged':'depleted'}`}><i/></span>)}</div>
  <small>{lives.nextAt?`RECHARGE ${countdown}`:'FULL CHARGE'}</small>
 </div>;
}
export function NoLives(){const lives=useLives();return <div className="out-of-moves"><h3>Energy depleted</h3><LivesBar/><p>One charge returns every 30 minutes.</p><button disabled>Recharge energy · not available yet</button>{import.meta.env.DEV&&<button className="preview-complete" onClick={lives.refill}>Preview · refill 5 charges</button>}</div>;}
