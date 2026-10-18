import {analyticsAllowed,analyticsSignal} from './analyticsPrivacy.js';
import {supabase} from './supabase.js';
import {reporterIdentity} from './balanceOutbox.js';
export function startPlayerPresence(){
 let stopped=false,running=false;
 async function ping(){
  if(!analyticsAllowed()||stopped||running||document.hidden||!navigator.onLine)return;
  const identity=reporterIdentity();if(!identity)return;
  running=true;
  try{await supabase.rpc('record_player_presence',{reporter_id:identity.id,reporter_token:identity.token}).abortSignal(analyticsSignal());}catch{}finally{running=false;}
 }
 window.addEventListener('analytics-choice-changed',ping);const timer=setInterval(ping,45000);document.addEventListener('visibilitychange',ping);window.addEventListener('online',ping);ping();
 return()=>{window.removeEventListener('analytics-choice-changed',ping);stopped=true;clearInterval(timer);document.removeEventListener('visibilitychange',ping);window.removeEventListener('online',ping);};
}
export async function fetchPlayerStats(){const {data,error}=await supabase.rpc('read_player_stats');if(error)throw error;return data;}
