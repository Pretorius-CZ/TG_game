export const MAX_LIVES=5,RECHARGE_MS=30*60*1000;
export const INTRO_RECHARGE_MS=10*60*1000;
export function recoverLives(value,now=Date.now(),interval=RECHARGE_MS){
 let count=Number.isInteger(value?.count)?Math.max(0,Math.min(5,value.count)):5;
 let nextAt=Number.isFinite(value?.nextAt)&&value.nextAt>0?value.nextAt:null;
 if(count===5)return {count,nextAt:null};
 if(nextAt===null)nextAt=now+interval;
 if(now>=nextAt){const gained=Math.floor((now-nextAt)/interval)+1;count=Math.min(5,count+gained);nextAt=count===5?null:nextAt+gained*interval;}
 return {count,nextAt};
}

export function configureRecharge(value,launchDone,now=Date.now()){
 const previous=value?.interval===INTRO_RECHARGE_MS?INTRO_RECHARGE_MS:RECHARGE_MS;
 const interval=launchDone?RECHARGE_MS:INTRO_RECHARGE_MS;
 const current=recoverLives(value,now,previous);
 // Shorten an old slow countdown when entering the introductory rules.
 // Switching to the slower rate never postpones the pending charge.
 if(current.nextAt!=null&&interval<previous)current.nextAt-=previous-interval;
 return {...recoverLives(current,now,interval),interval};
}
