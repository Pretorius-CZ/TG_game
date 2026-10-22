import {analyticsAllowed,analyticsSince,analyticsSignal,analyticsRetentionMs,analyticsEpoch} from './analyticsPrivacy.js';
import {android} from './platform.js';
import {supabase} from './supabase.js';
import {reporterIdentity} from './balanceOutbox.js';
import {campaignFromURL,visitForActivity,deviceCategory,mergeVisitAttempts,migrationCampaign} from './campaignPolicy.js';
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
 const now=Date.now(),campaign=android?{source:'googleplay',medium:'android_preview',campaign:'current_device_test'}:migrationCampaign(campaignFromURL(location.href),read('beyond-signal-migrated-traffic-v1',null)),previous=read(visitKey,null);
 const validPrevious=previous?.lastAt>=analyticsSince()?previous:null;
 const candidate=validPrevious&&active&&validPrevious.id===active.id&&validPrevious.lastAt>active.lastAt?validPrevious:active||validPrevious;
 const chosen=visitForActivity(candidate,campaign,now,()=>crypto.randomUUID(),deviceCategory(navigator));
 if(active?.id!==chosen.id)lastCountryLookup=0;
 // Retain the object while a geolocation request is in flight.
 if(active?.id===chosen.id)Object.assign(active,chosen);else active=chosen;
}
export function trackCampaignAttempt(id,level,outcome='started'){
 if(!analyticsAllowed())return;
 const earlier=active?.attempts?.[id];
 initializeVisit();
 const previous=active.attempts[id]||earlier,now=Date.now();
 active.lastAt=now;active.attempts[id]={level,outcome,startedAt:previous?.startedAt??now,...(outcome==='started'?{}:{finishedAt:now})};
 persist();flushCampaign();
}
export async function flushCampaign(){
 if(!analyticsAllowed()||running||navigator.onLine===false)return;
 const identity=reporterIdentity();if(!identity)return;running=true;const epoch=analyticsEpoch();let sentSuccessfully=false;
 try{
 const eligible=Object.fromEntries(Object.entries(read(queueKey,{})).filter(([,visit])=>visit.lastAt>=Math.max(analyticsSince(),Date.now()-analyticsRetentionMs)));
 localStorage.setItem(queueKey,JSON.stringify(eligible));
 for(const visit of Object.values(eligible)){
 if(!analyticsAllowed()||epoch!==analyticsEpoch())return;
 const {error}=await supabase.rpc('record_campaign_visit',{reporter_id:identity.id,reporter_token:identity.token,incoming:visit}).abortSignal(analyticsSignal());if(error)throw error;
 if(epoch!==analyticsEpoch())return;
 const queue=read(queueKey,{});if(queue[visit.id]?.revision===visit.revision){delete queue[visit.id];localStorage.setItem(queueKey,JSON.stringify(queue));}
 }sentSuccessfully=true;status({sendError:'',sentAt:Date.now()});}catch(error){if(epoch===analyticsEpoch())status({sendError:error?.message||'Odeslání návštěvy selhalo.'});}finally{
 running=false;
 // A result arriving during an in-flight start must be sent without waiting 30 seconds.
 if(analyticsAllowed()&&epoch===analyticsEpoch()&&sentSuccessfully&&Object.keys(read(queueKey,{})).length)queueMicrotask(flushCampaign);
 }
}
function resolveCountry(){
 if(!analyticsAllowed()||import.meta.env.MODE==='itch'||normalizeCountry(active?.country)||countryLookup||Date.now()-lastCountryLookup<60000)return;
 const visit=active;lastCountryLookup=Date.now();status({countryState:'loading'});
 countryLookup=lookupCountry(undefined,analyticsSignal()).then(country=>{
 if(!analyticsAllowed())return;
 status({countryState:country?'known':'unavailable',countryCheckedAt:Date.now()});
 if(country&&active===visit){active.country=country;persist();flushCampaign();}
 }).finally(()=>{countryLookup=null;});
}
export function startCampaignTracking(){
 const refresh=()=>{if(analyticsAllowed()&&!document.hidden){initializeVisit();active.lastAt=Date.now();persist();flushCampaign();resolveCountry();}};
 const changed=()=>{active=null;lastCountryLookup=0;refresh();};window.addEventListener('analytics-choice-changed',changed);refresh();
 const timer=setInterval(refresh,30000);window.addEventListener('online',refresh);document.addEventListener('visibilitychange',refresh);
 return()=>{window.removeEventListener('analytics-choice-changed',changed);clearInterval(timer);window.removeEventListener('online',refresh);document.removeEventListener('visibilitychange',refresh);};
}
export async function fetchCampaignStats(){const {data,error}=await supabase.rpc('read_campaign_stats');if(error)throw error;return data;}
