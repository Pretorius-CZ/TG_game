// Google Mobile Ads sends Rewarded before Dismissed. Dismissal alone never earns a reward.
export async function showRewarded(admob,events,adId){
 const handles=[];let earned=false;
 let finish,fail;
 const dismissed=new Promise((resolve,reject)=>{finish=resolve;fail=reject;});
 // A native failure may arrive before prepare finishes; attach a handler immediately.
 dismissed.catch(()=>{});
 try{
  handles.push(await admob.addListener(events.Rewarded,()=>{earned=true;}));
  handles.push(await admob.addListener(events.Dismissed,()=>finish(earned)));
  handles.push(await admob.addListener(events.FailedToShow,()=>fail(new Error('Ad could not be shown'))));
  await admob.prepareRewardVideoAd({adId});
  // The native promise can remain pending on dismissal without reward. Use events for completion.
  admob.showRewardVideoAd().catch(fail);
  return await dismissed;
 }finally{await Promise.allSettled(handles.map(handle=>handle.remove()));}
}
