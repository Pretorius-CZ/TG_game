import React,{useEffect,useRef,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {pauseForAd} from './audio.js';
import {createRewardedPlacement,loadGoogleTestAds,suspendGameDialogs} from './googleH5Ads.js';
import {getAdConsent,consentAllowsAds} from './adConsent.js';
import {showAdConsent} from './consentUI.js';

export default function GoogleRewardAd({offer,close}){
 const {language}=useLanguage(),cs=language==='cs',dialog=useRef(null),placement=useRef(null),alive=useRef(true),claiming=useRef(false),verified=useRef(false);
 const [phase,setPhase]=useState(offer.mode==='disabled'?'unavailable':'loading'),[show,setShow]=useState(null);
 const [issue,setIssue]=useState(offer.mode==='disabled'?'disabled':null);
 async function claim(){
  if(!verified.current||claiming.current)return;claiming.current=true;setPhase('claiming');
  try{if(await offer.grant()===false)throw Error();if(alive.current)close();}
  catch{if(alive.current)setPhase('claim-error');}finally{claiming.current=false;}
 }
 useEffect(()=>{
  alive.current=true;const opener=document.activeElement;
  dialog.current.showModal();dialog.current.querySelector('button:not(:disabled)')?.focus();
  let resume;
  const unsubscribe=getAdConsent().subscribe(()=>{if(!consentAllowsAds(getAdConsent().getStatus()))placement.current?.cancel();});
  if(offer.mode==='test')showAdConsent(false,{pause:pauseForAd}).then(async status=>{
   if(!alive.current)return;
   if(!consentAllowsAds(status)){setIssue(navigator.onLine===false?'offline':getAdConsent().getFailure()==='load'?'load':status==='denied'?'consent-denied':'consent-unavailable');setPhase('unavailable');return;}
   const adBreak=await loadGoogleTestAds();
   if(!alive.current)return;
   if(!consentAllowsAds(getAdConsent().getStatus())){setIssue('consent-denied');setPhase('unavailable');return;}
   placement.current=createRewardedPlacement({adBreak,onReady:fn=>{setShow(()=>fn);setPhase('ready');},
    onPause:()=>{resume=suspendGameDialogs();pauseForAd(true);},
    onResume:()=>{resume?.();resume=null;pauseForAd(false);}
   });
   placement.current.result.then(result=>{
    if(!alive.current)return;
    if(result.viewed){verified.current=true;void claim();}
    else {const consent=getAdConsent().getStatus();setIssue(navigator.onLine===false?'offline':!consentAllowsAds(consent)?consent==='denied'?'consent-denied':'consent-unavailable':result.status);setPhase(result.status==='dismissed'?'dismissed':'unavailable');}
   });
  }).catch(()=>{if(alive.current){setIssue(navigator.onLine===false?'offline':'load');setPhase('unavailable');}});
  return()=>{alive.current=false;unsubscribe();placement.current?.cancel();resume?.();pauseForAd(false);if(opener?.isConnected)opener.focus();};
 },[]);
 const messages=cs?{
  loading:'Připravuji testovací reklamu…',ready:'Je připravená testovací reklama Googlu. Nevytváří reklamní výnos.',
  showing:'Probíhá testovací reklama…',unavailable:'Reklama teď není dostupná. Nic se nespotřebovalo a hra zůstává zachovaná.',
  dismissed:'Reklama nebyla dokončená. Odměna nebyla přidělena.',claiming:'Ukládám odměnu…','claim-error':'Odměnu se nepodařilo uložit. Zkus uložení znovu bez další reklamy.'
 }:{loading:'Preparing a test ad…',ready:'A Google test ad is ready. It does not generate advertising revenue.',
  showing:'Test ad in progress…',unavailable:'No ad is available right now. Nothing was spent and your game is preserved.',
  dismissed:'The ad was not completed. No reward was granted.',claiming:'Saving your reward…','claim-error':'Your reward could not be saved. Retry saving without watching another ad.'};
 const problems=cs?{
  'consent-denied':['Reklamu nespustíme podle tvých voleb soukromí.','Bez reklam můžeš dál hrát. Volbu můžeš změnit v Nastavení → Změnit reklamní souhlasy.'],
  'consent-unavailable':['Reklamní souhlasy se nepodařilo ověřit.','Google zpráva možná ještě není zveřejněná, nebo ji blokuje prohlížeč či připojení. Reklamu bez ověřené volby nespustíme.'],
  load:['Reklamní službu se nepodařilo načíst.','Příčinou mohou být štíty Brave, blokátor reklam, ochrana soukromí nebo problém s připojením. Pokud chceš reklamu zhlédnout, můžeš pro tento web povolit reklamy. Je to dobrovolné.'],
  offline:['Prohlížeč hlásí, že jsi offline.','Zkontroluj připojení a nabídku zkus znovu později.'],
  noAdPreloaded:['Poskytovatel teď nemá připravenou reklamu.','Zkus nabídku později. V testovacím režimu se dostupná a nedostupná reklama záměrně střídají.'],
  frequencyCapped:['Od poslední reklamy ještě neuplynula potřebná doba.','Chvíli počkej a zkus nabídku později.'],
  timeout:['Načítání reklamy trvalo příliš dlouho.','Zkontroluj připojení. Reklamu mohou omezovat také ochranné funkce prohlížeče.'],
  disabled:['Reklamy jsou nyní vypnuté.','Ve hře můžeš pokračovat bez reklamy.']
 }:{
  'consent-denied':['Your privacy choices do not allow us to start this ad.','You can keep playing without ads. To change your choice, open Settings → Advertising privacy choices.'],
  'consent-unavailable':['Advertising consent could not be verified.','The Google message may not be published yet, or your browser or connection may be blocking it. We will not start an ad without a verified choice.'],
  load:['The ad service could not load.','Brave Shields, an ad blocker, privacy protection or a connection problem may be responsible. If you want to watch an ad, you can allow ads for this site. This is optional.'],
  offline:['Your browser reports that you are offline.','Check your connection and try the offer again later.'],
  noAdPreloaded:['No ad is available right now.','Try the offer later. Test mode intentionally alternates between available and unavailable ads.'],
  frequencyCapped:['Not enough time has passed since the last ad.','Wait a little and try the offer later.'],
  timeout:['The ad took too long to load.','Check your connection. Browser protection may also restrict ads.'],
  disabled:['Advertisements are currently disabled.','You can continue playing without an ad.']
 };
 const problem=problems[issue]??(cs?['Reklamu se nepodařilo zobrazit.','Příčinu se nepodařilo určit. Zkus nabídku později; pokud se problém opakuje, může jít o připojení nebo blokování reklam.']:['The ad could not be shown.','The cause could not be determined. Try later; repeated failures may involve your connection or ad blocking.']);
 return <dialog ref={dialog} className="reward-ad" data-ad-mode={offer.mode} aria-labelledby="google-reward-title" onCancel={e=>{e.preventDefault();if(!['showing','claiming'].includes(phase))close();}}>
  <span className="eyebrow">{offer.mode==='test'?'GOOGLE · TEST MODE':cs?'REKLAMY NEDOSTUPNÉ':'ADS UNAVAILABLE'}</span>
  <h2 id="google-reward-title">{cs?'Odměna za reklamu':'Rewarded ad'}</h2><p>{offer.reward}</p>
  <p role="status">{phase==='unavailable'?problem[0]:messages[phase]}</p>
  {phase==='unavailable'&&<><p className="ad-explanation">{problem[1]}</p><p>{cs?'Odměna nebyla přidělena. Nic se nespotřebovalo a rozehraná hra zůstává zachovaná.':'No reward was granted. Nothing was spent and your current game is preserved.'}</p></>}
  {phase==='ready'&&<button className="primary" onClick={()=>{setPhase('showing');show();}}>{cs?'Spustit testovací reklamu':'Watch test ad'}</button>}
  {phase==='claim-error'&&<button className="primary" onClick={claim}>{cs?'Znovu uložit odměnu':'Retry saving reward'}</button>}
  <button disabled={['showing','claiming'].includes(phase)} onClick={close}>{cs?'Zpět do hry':'Back to game'}</button>
 </dialog>;
}
