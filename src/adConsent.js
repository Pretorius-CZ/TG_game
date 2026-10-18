import {loadGoogleTestTag} from './googleH5Ads.js';

// Read the CMP's decision; never manufacture a consent string or save a local substitute.
export function consentDecision(data,success){
 if(!success||!data||data.cmpStatus==='error')return 'unavailable';
 if(data.cmpStatus!=='loaded')return 'pending';
 if(data.eventStatus==='cmpuishown')return 'pending';
 if(!['tcloaded','useractioncomplete'].includes(data.eventStatus))return 'pending';
 if(data.gdprApplies===false)return 'not-required';
 if(data.gdprApplies!==true||!data.tcString)return 'pending';
 return data.purpose?.consents?.[1]===true&&data.vendor?.consents?.[755]===true?'granted':'denied';
}
export const consentAllowsAds=status=>status==='granted'||status==='not-required';

export function createAdConsent({win,loadTag,apiTimeoutMs=15000}){
 let status='unknown',listening=false,apiReady=false,apiPromise,busy=null,failure=null,prompts=0,uiVisible=false;
 const listeners=new Set();
 const publish=next=>{status=next;for(const listener of listeners)listener();};
 function api(){
  if(apiPromise)return apiPromise;
  apiPromise=new Promise((resolve,reject)=>{
   let active=true;
   const timer=setTimeout(()=>{active=false;apiPromise=null;reject(Error('Consent service unavailable'));},apiTimeoutMs);
   win.googlefc=win.googlefc||{};win.googlefc.callbackQueue=win.googlefc.callbackQueue||[];
   win.googlefc.callbackQueue.push({CONSENT_API_READY:()=>{
    if(!active)return;
    if(typeof win.__tcfapi!=='function'){active=false;clearTimeout(timer);apiPromise=null;reject(Error('Consent API unavailable'));return;}
    active=false;clearTimeout(timer);apiReady=true;
    try{
     if(!listening){listening=true;win.__tcfapi('addEventListener',0,(data,success)=>{uiVisible=data?.eventStatus==='cmpuishown';if(uiVisible)prompts++;publish(consentDecision(data,success));});}
     resolve();
    }catch(error){listening=false;apiReady=false;apiPromise=null;reject(error);}
   }});
  });
  return apiPromise;
 }
 function waitDecision(){
  if(!['pending','unknown'].includes(status))return Promise.resolve(status);
  return new Promise(resolve=>{
   let timer;
   const check=()=>{
    if(!['pending','unknown'].includes(status)){clearTimeout(timer);listeners.delete(check);resolve(status);}
    else if(uiVisible){clearTimeout(timer);timer=null;}
    else if(!timer)timer=setTimeout(()=>publish('unavailable'),apiTimeoutMs);
   };
   listeners.add(check);check();
  });
 }
 async function run(change){
  failure=null;
  const previousPrompts=prompts;
  try{
   // Install the callback before the AdSense tag can load its CMP.
   const ready=api();
   await Promise.all([ready,loadTag()]);
   const initial=await waitDecision();
   // If loading the tag already asked the user, their fresh choice is enough.
   if(change&&['granted','denied'].includes(initial)&&prompts===previousPrompts){
    if(!apiReady||typeof win.googlefc.showRevocationMessage!=='function')throw Error('Consent choices unavailable');
    publish('pending');const decision=waitDecision();
    win.googlefc.callbackQueue.push({CONSENT_API_READY:()=>{try{win.googlefc.showRevocationMessage();}catch{publish('unavailable');}}});
    return await decision;
   }
   return initial;
  }catch(error){failure=error.code==='ad-tag-unavailable'?'load':'consent';publish('unavailable');return status;}
 }
 return {getStatus:()=>status,getFailure:()=>failure,subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},
  request({change=false}={}){if(busy)return busy;busy=run(change).finally(()=>{busy=null;});return busy;}
 };
}
let singleton;
export function getAdConsent(){return singleton??=createAdConsent({win:window,loadTag:()=>loadGoogleTestTag()});}
