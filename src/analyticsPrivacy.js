export const analyticsChoiceKey='beyond-signal-analytics-choice-v1';
export const analyticsDeletionKey='beyond-signal-analytics-deletions-v1';
export const analyticsRetentionMs=90*24*60*60*1000;
const keys=['beyond-signal-balance-attempts-v1','beyond-signal-balance-outbox-v1','beyond-signal-campaign-visit-v1','beyond-signal-campaign-outbox-v1','beyond-signal-campaign-status-v1'];
let requests=new AbortController();
let epoch=0;
export const analyticsEpoch=()=>epoch;
export function analyticsChoice(){try{const value=JSON.parse(localStorage.getItem(analyticsChoiceKey));return value?.version===1&&Number.isFinite(value.at)&&['granted','denied'].includes(value.state)?value.state:'unknown';}catch{return 'unknown';}}
export function analyticsSince(){try{return analyticsAllowed()?JSON.parse(localStorage.getItem(analyticsChoiceKey)).at:Infinity;}catch{return Infinity;}}
export const analyticsAllowed=()=>analyticsChoice()==='granted';
export function clearAnalyticsHistory(){
 // Keep QA classification independently of optional visit measurements.
 try{const visit=JSON.parse(localStorage.getItem('beyond-signal-campaign-visit-v1'));if(visit?.source==='automated_test'&&visit?.medium==='bot')localStorage.setItem('beyond-signal-migrated-traffic-v1',JSON.stringify({source:visit.source,medium:visit.medium,campaign:visit.campaign}));}catch{}
 for(const key of keys)localStorage.removeItem(key);
 localStorage.setItem('beyond-signal-balance-cloud-migrated-v1','1');
}
export function pruneLocalAnalytics(){
 try{
  const cutoff=Date.now()-analyticsRetentionMs;
  for(const key of ['beyond-signal-balance-attempts-v1','beyond-signal-balance-outbox-v1']){
   const rows=JSON.parse(localStorage.getItem(key)||'[]');
   if(Array.isArray(rows))localStorage.setItem(key,JSON.stringify(rows.filter(row=>Number.isFinite(row.payload?.at??row.at)&&(row.payload?.at??row.at)>=cutoff)));
  }
  const queue=JSON.parse(localStorage.getItem('beyond-signal-campaign-outbox-v1')||'{}');
  localStorage.setItem('beyond-signal-campaign-outbox-v1',JSON.stringify(Object.fromEntries(Object.entries(queue).filter(([,visit])=>visit.lastAt>=cutoff))));
  const visit=JSON.parse(localStorage.getItem('beyond-signal-campaign-visit-v1')||'null');
  if(visit&&visit.lastAt<cutoff){
   if(visit.source==='automated_test'&&visit.medium==='bot')localStorage.setItem('beyond-signal-migrated-traffic-v1',JSON.stringify({source:visit.source,medium:visit.medium,campaign:visit.campaign}));
   localStorage.removeItem('beyond-signal-campaign-visit-v1');
  }
 }catch{}
}
export function setAnalyticsChoice(state){
 if(!['granted','denied'].includes(state))throw Error('Invalid analytics choice');
 epoch++;requests.abort();requests=new AbortController();
 localStorage.setItem(analyticsChoiceKey,JSON.stringify({version:1,state,at:Date.now()}));
 clearAnalyticsHistory();
 globalThis.window?.dispatchEvent(new Event('analytics-choice-changed'));
}
export function analyticsSignal(ms=8000){return AbortSignal.any([requests.signal,AbortSignal.timeout(ms)]);}
if(typeof window!=='undefined')window.addEventListener('storage',event=>{
 if(event.key===analyticsChoiceKey){epoch++;requests.abort();requests=new AbortController();window.dispatchEvent(new Event('analytics-choice-changed'));}
});
