import {supabase} from './supabase.js';
import {reporterIdentity} from './balanceOutbox.js';
import {campaignFromURL,visitForActivity,deviceCategory,mergeVisitAttempts} from './campaignPolicy.js';
import {lookupCountry,normalizeCountry} from './countryTracking.js';
const visitKey='beyond-signal-campaign-visit-v1',queueKey='beyond-signal-campaign-outbox-v1';
const statusKey='beyond-signal-campaign-status-v1';
let active=null,running=false,countryLookup=null,lastCountryLookup=0;
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback;}catch{return fallback;}}
export function campaignDiagnostics(){const status=read(statusKey,{}),visit=read(visitKey,{});return {...status,country:normalizeCountry(visit.country),pending:Object.keys(read(queueKey,{})).length};}
function status(update){try{localStorage.setItem(statusKey,JSON.stringify({...read(statusKey,{}),...update}));window.dispatchEvent(new Event('campaign-status'));}catch{}}
function persist(){try{
 const previous=read(visitKey,null);
 if(previous?.id===active.id){active.attempts=mergeVisitAttempts(previous.attempts,active.attempts);active.revision=Math.max(active.revision,previous.revision);}
 active.revision++;active.visible=!document.hidden;
 localStorage.setItem(visitKey,JSON.stringify(active));const queue=read(queueKey,{});queue[active.id]=active;localStorage.setItem(queueKey,JSON.stringify(Object.fromEntries(Object.entries(queue).slice(-100))));
}catch{}}
function initializeVisit(){
 const now=Date.now(),campaign=campaignFromURL(location.href),previous=read(visitKey,null);
 const candidate=previous&&active&&previous.id===active.id&&previous.lastAt>active.lastAt?previous:active||previous;
 const chosen=visitForActivity(candidate,campaign,now,()=>crypto.randomUUID(),deviceCategory(navigator));
 if(active?.id!==chosen.id)lastCountryLookup=0;
 // Retain the object while a geolocation request is in flight.
 if(active?.id===chosen.id)Object.assign(active,chosen);else active=chosen;
}
export function trackCampaignAttempt(id,level,outcome='started'){
 const earlier=active?.attempts?.[id];
 initializeVisit();
 const previous=active.attempts[id]||earlier,now=Date.now();
 active.lastAt=now;active.attempts[id]={level,outcome,startedAt:previous?.startedAt??now,...(outcome==='started'?{}:{finishedAt:now})};
 persist();flushCampaign();
}
export async function flushCampaign(){
 if(running||navigator.onLine===false)return;
 const identity=reporterIdentity();if(!identity)return;running=true;let sentSuccessfully=false;
 try{for(const visit of Object.values(read(queueKey,{}))){
 const {error}=await supabase.rpc('record_campaign_visit',{reporter_id:identity.id,reporter_token:identity.token,incoming:visit}).abortSignal(AbortSignal.timeout(8000));if(error)throw error;
 const queue=read(queueKey,{});if(queue[visit.id]?.revision===visit.revision){delete queue[visit.id];localStorage.setItem(queueKey,JSON.stringify(queue));}
 }sentSuccessfully=true;status({sendError:'',sentAt:Date.now()});}catch(error){status({sendError:error?.message||'Odeslání návštěvy selhalo.'});}finally{
 running=false;
 // A result arriving during an in-flight start must be sent without waiting 30 seconds.
 if(sentSuccessfully&&Object.keys(read(queueKey,{})).length)queueMicrotask(flushCampaign);
 }
}
function resolveCountry(){
 if(import.meta.env.MODE==='itch'||normalizeCountry(active?.country)||countryLookup||Date.now()-lastCountryLookup<60000)return;
 const visit=active;lastCountryLookup=Date.now();status({countryState:'loading'});
 countryLookup=lookupCountry().then(country=>{
 status({countryState:country?'known':'unavailable',countryCheckedAt:Date.now()});
 if(country&&active===visit){active.country=country;persist();flushCampaign();}
 }).finally(()=>{countryLookup=null;});
}
export function startCampaignTracking(){
 initializeVisit();active.lastAt=Date.now();persist();flushCampaign();
 resolveCountry();
 const refresh=()=>{if(!document.hidden){initializeVisit();active.lastAt=Date.now();persist();flushCampaign();resolveCountry();}};
 const timer=setInterval(refresh,30000);window.addEventListener('online',refresh);document.addEventListener('visibilitychange',refresh);
 return()=>{clearInterval(timer);window.removeEventListener('online',refresh);document.removeEventListener('visibilitychange',refresh);};
}
export async function fetchCampaignStats(){const {data,error}=await supabase.rpc('read_campaign_stats');if(error)throw error;return data;}
