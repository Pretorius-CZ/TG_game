export const MAX_LIVES=5,RECHARGE_MS=30*60*1000;
export function recoverLives(value,now=Date.now()){
 let count=Number.isInteger(value?.count)?Math.max(0,Math.min(5,value.count)):5;
 let nextAt=Number.isFinite(value?.nextAt)&&value.nextAt>0?value.nextAt:null;
 if(count===5)return {count,nextAt:null};
 if(nextAt===null)nextAt=now+RECHARGE_MS;
 if(now>=nextAt){const gained=Math.floor((now-nextAt)/RECHARGE_MS)+1;count=Math.min(5,count+gained);nextAt=count===5?null:nextAt+gained*RECHARGE_MS;}
 return {count,nextAt};
}
