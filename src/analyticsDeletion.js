import {supabase} from './supabase.js';
import {analyticsDeletionKey,setAnalyticsChoice} from './analyticsPrivacy.js';
import {onlineServicesAllowed} from './androidAudience.js';
const identityKey='beyond-signal-balance-reporter-v1';
export function pendingAnalyticsDeletions(){try{const rows=JSON.parse(localStorage.getItem(analyticsDeletionKey)||'[]');return Array.isArray(rows)?rows.filter(row=>typeof row?.id==='string'&&typeof row?.token==='string'):[];}catch{return [];}}
let deleting;
export function retryAnalyticsDeletion(){
 if(deleting)return deleting;
 deleting=(async()=>{
  for(const identity of pendingAnalyticsDeletions()){
   const {error}=await supabase.rpc('delete_browser_analytics',{reporter_id:identity.id,reporter_token:identity.token}).abortSignal(AbortSignal.timeout(12000));
   if(error)throw error;
   localStorage.setItem(analyticsDeletionKey,JSON.stringify(pendingAnalyticsDeletions().filter(item=>item.id!==identity.id)));
  }
 })().finally(()=>{deleting=null;});
 return deleting;
}
export async function deleteBrowserAnalytics(){
 setAnalyticsChoice('denied');
 const identity=JSON.parse(localStorage.getItem(identityKey)||'null');
 if(identity?.id&&identity?.token){
  const pending=pendingAnalyticsDeletions();
  if(!pending.some(item=>item.id===identity.id))pending.push({id:identity.id,token:identity.token});
  // Persist the capability before removing it from active reporting.
  localStorage.setItem(analyticsDeletionKey,JSON.stringify(pending));
  localStorage.removeItem(identityKey);
 }
 await retryAnalyticsDeletion();
}
export function startAnalyticsDeletionRetry(){
 if(!onlineServicesAllowed())return;
 const retry=()=>{if(pendingAnalyticsDeletions().length)retryAnalyticsDeletion().catch(()=>{});};
 retry();window.addEventListener('online',retry);
 return()=>window.removeEventListener('online',retry);
}
