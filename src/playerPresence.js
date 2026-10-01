import {supabase} from './supabase.js';
import {reporterIdentity} from './balanceOutbox.js';
export function startPlayerPresence(){
 let stopped=false,running=false;
 async function ping(){
  if(stopped||running||document.hidden||!navigator.onLine)return;
  const identity=reporterIdentity();if(!identity)return;
  running=true;
  try{await supabase.rpc('record_player_presence',{reporter_id:identity.id,reporter_token:identity.token}).abortSignal(AbortSignal.timeout(8000));}catch{}finally{running=false;}
 }
 const timer=setInterval(ping,45000);document.addEventListener('visibilitychange',ping);window.addEventListener('online',ping);ping();
 return()=>{stopped=true;clearInterval(timer);document.removeEventListener('visibilitychange',ping);window.removeEventListener('online',ping);};
}
export async function fetchPlayerStats(){const {data,error}=await supabase.rpc('read_player_stats');if(error)throw error;return data;}
