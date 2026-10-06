import {supabase} from './supabase.js';
import {reporterIdentity} from './balanceOutbox.js';
import {campaignFromURL,reusableVisit} from './campaignPolicy.js';
const visitKey='beyond-signal-campaign-visit-v1',queueKey='beyond-signal-campaign-outbox-v1';
let active=null,running=false;
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback;}catch{return fallback;}}
function persist(){try{localStorage.setItem(visitKey,JSON.stringify(active));const queue=read(queueKey,{});queue[active.id]=active;localStorage.setItem(queueKey,JSON.stringify(Object.fromEntries(Object.entries(queue).slice(-100))));}catch{}}
function initializeVisit(){
 if(active)return;
 const now=Date.now(),campaign=campaignFromURL(location.href),previous=read(visitKey,null);
 active=reusableVisit(previous,campaign,now)?previous:{id:crypto.randomUUID(),...campaign,at:now,lastAt:now,revision:0,attempts:{}};
}
export function trackCampaignAttempt(id,level,outcome='started'){
 initializeVisit();
 active.lastAt=Date.now();active.attempts[id]={level,outcome};active.revision++;
 persist();flushCampaign();
}
export async function flushCampaign(){
 if(running||navigator.onLine===false)return;
 const identity=reporterIdentity();if(!identity)return;running=true;
 try{for(const visit of Object.values(read(queueKey,{}))){
 const {error}=await supabase.rpc('record_campaign_visit',{reporter_id:identity.id,reporter_token:identity.token,incoming:visit}).abortSignal(AbortSignal.timeout(8000));if(error)throw error;
 const queue=read(queueKey,{});if(queue[visit.id]?.revision===visit.revision){delete queue[visit.id];localStorage.setItem(queueKey,JSON.stringify(queue));}
 }}catch{/* Keep the outbox for retry, including before SQL migration is installed. */}finally{running=false;}
}
export function startCampaignTracking(){
 initializeVisit();active.lastAt=Date.now();active.revision++;persist();flushCampaign();
 const refresh=()=>{if(!document.hidden){active.lastAt=Date.now();persist();flushCampaign();}};
 const timer=setInterval(refresh,30000);window.addEventListener('online',refresh);document.addEventListener('visibilitychange',refresh);
 return()=>{clearInterval(timer);window.removeEventListener('online',refresh);document.removeEventListener('visibilitychange',refresh);};
}
export async function fetchCampaignStats(){const {data,error}=await supabase.rpc('read_campaign_stats');if(error)throw error;return data;}
