export const GOOGLE_AD_CLIENT='ca-pub-4627613906098117';
let loading;
// Only the Google mock-ad API is exposed here. No caller can remove test mode.
export function loadGoogleTestTag(win=window,doc=document){
 if(loading)return loading;
 loading=new Promise((resolve,reject)=>{
  if(doc.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')){reject(Error('Unexpected advertising script'));return;}
  win.adsbygoogle=win.adsbygoogle||[];
  const push=value=>win.adsbygoogle.push(value);
  win.adBreak=win.adConfig=push;
  let settled=false;
  let readyResolve;const ready=new Promise(done=>{readyResolve=done;});
  const timer=setTimeout(()=>fail(),15000);
  function fail(){if(settled)return;settled=true;clearTimeout(timer);const error=Error('Ad service unavailable');error.code='ad-tag-unavailable';reject(error);}
  const script=doc.createElement('script');script.async=true;script.crossOrigin='anonymous';
  script.dataset.adbreakTest='on';script.dataset.adFrequencyHint='30s';
  script.src=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_AD_CLIENT}`;
  script.onerror=fail;
  script.onload=()=>{if(settled)return;settled=true;clearTimeout(timer);resolve({ready,adBreak:push});};
  push({preloadAdBreaks:'on',sound:'off',onReady:()=>readyResolve(push)});
  doc.head.append(script);
 });
 // A failed loader is intentionally not retried into the same partly loaded SDK.
 return loading;
}
export async function loadGoogleTestAds(win=window,doc=document){
 const {ready}=await loadGoogleTestTag(win,doc);
 let timer;
 try{return await Promise.race([ready,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Ad service unavailable')),15000);})]);}
 finally{clearTimeout(timer);}
}

// A placement owns its callbacks; late callbacks can never reward a cancelled request.
export function createRewardedPlacement({adBreak,onReady,onPause=()=>{},onResume=()=>{},document:doc=globalThis.document,readyMs=15000,watchMs=180000}){
 let active=true,shown=false,viewed=false,showAd,remaining=readyMs,paused=false;
 let resolve;const result=new Promise(done=>{resolve=done;});
 function finish(status){
  if(!active)return;active=false;clearInterval(timer);
  if(paused){paused=false;onResume();}
  resolve({status,viewed:viewed&&status==='viewed'});
 }
 const timer=setInterval(()=>{if(!doc?.hidden){remaining-=250;if(remaining<=0)finish('timeout');}},250);
 const handle={result,cancel:()=>finish('cancelled'),show(){
  if(!active||shown||!showAd)return;shown=true;remaining=watchMs;
  try{showAd();}catch{finish('error');}
 }};
 try{adBreak({type:'reward',name:'optional-game-help',
  beforeReward:fn=>{if(!active||shown)return;showAd=fn;remaining=watchMs;onReady(handle.show);},
  beforeAd:()=>{if(!active||!shown)return;paused=true;onPause();},
  adViewed:()=>{if(active&&shown)viewed=true;},
  adDismissed:()=>{if(active)finish('dismissed');},
  afterAd:()=>finish(viewed?'viewed':'dismissed'),
  adBreakDone:info=>finish(viewed?'viewed':info?.breakStatus==='viewed'?'unverified':info?.breakStatus||'unavailable')
 });}catch{finish('error');}
 return handle;
}

export function suspendGameDialogs(doc=document){
 const top=doc.activeElement?.closest('dialog');
 const dialogs=[...doc.querySelectorAll('dialog[open]')].filter(d=>d!==top);
 if(top?.open)dialogs.push(top);
 for(const dialog of dialogs)dialog.close();
 return ()=>{for(const dialog of dialogs)if(dialog.isConnected&&!dialog.open)dialog.showModal();};
}
