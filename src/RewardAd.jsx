import {crazyGames,android,rewardAvailable} from './platform.js';
import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {pauseForAd} from './audio.js';
import './rewardAd.css';
import GoogleRewardAd from './GoogleRewardAd.jsx';
import {webAdsMode} from './webAdsPolicy.js';
import AndroidRewardAd from './AndroidRewardAd.jsx';
const Context=createContext(null);
export const useRewardAd=()=>useContext(Context);
export function RewardAdProvider({children}){
 const [offer,setOffer]=useState(null),pending=useRef(null);
 async function request(reward,grant,kind){if(pending.current||!rewardAvailable(kind))return;if(crazyGames){pending.current={reward,grant};try{await grant();}finally{pending.current=null;}return;}
 let storage;try{storage=localStorage;}catch{}
 const mode=android?'android':webAdsMode({configured:import.meta.env.VITE_WEB_ADS_MODE||'simulation',url:location.href,storage,platform:['itch','telegram'].includes(import.meta.env.MODE)?import.meta.env.MODE:'web'});
 pending.current={reward,grant,mode,kind};setOffer(pending.current);}
 function close(){pending.current=null;setOffer(null);}
 return <Context.Provider value={request}>{children}{offer&&(offer.mode==='android'?<AndroidRewardAd offer={offer} close={close}/>:offer.mode==='simulation'?<RewardAd offer={offer} close={close}/>:<GoogleRewardAd offer={offer} close={close}/>)}</Context.Provider>;
}
function RewardAd({offer,close}){
 const {t}=useLanguage(),dialog=useRef(null),locked=useRef(false);
 const [started,setStarted]=useState(false),[error,setError]=useState(false),[busy,setBusy]=useState(false);
 useEffect(()=>{const focus=document.activeElement;dialog.current.showModal();pauseForAd(true);return()=>{pauseForAd(false);if(focus?.isConnected)focus.focus();};},[]);
 async function finish(){if(locked.current)return;locked.current=true;setBusy(true);try{if(await offer.grant()===false)throw Error();close();}catch{setError(true);setBusy(false);locked.current=false;}}
 return <dialog ref={dialog} className="reward-ad" aria-labelledby="reward-title" onCancel={e=>{e.preventDefault();if(!locked.current)close();}}>
 <span className="eyebrow">{t('TEST MODE · NO REAL AD')}</span><h2 id="reward-title">{t(started?'Test advertisement':'Watch an ad?')}</h2>
 <p>{offer.reward}</p>{started&&<div className="ad-placeholder" aria-hidden="true">▷<br/>{t('ADVERTISEMENT')}</div>}
 <p>{t('Simulation for balancing. No waiting or payment.')}</p>
 {error&&<p role="alert">{t('Reward could not be saved. Please try again.')}</p>}
 <button className="primary" disabled={busy} onClick={started?finish:()=>setStarted(true)}>{t(started?'Close and claim reward':'Start test ad')}</button>
 <button disabled={busy} onClick={close}>{t('Cancel without reward')}</button>
 </dialog>;
}
