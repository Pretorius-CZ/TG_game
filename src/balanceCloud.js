import {supabase} from './supabase.js';
import {readQueue,reporterIdentity,drainQueue,enqueueAttempts} from './balanceOutbox.js';
import {readAttempts,balanceKey} from './balanceTracking.js';
let running=false,started=false;
export const balanceCloudStatus={state:'idle',pending:0};
function announce(state){balanceCloudStatus.state=state;balanceCloudStatus.pending=readQueue().length;window.dispatchEvent(new CustomEvent('balance-cloud-status',{detail:{...balanceCloudStatus}}));}
export async function flushBalance(){
 if(running||navigator.onLine===false)return;
 if(!readQueue().length){announce('saved');return;}
 running=true;announce('sending');
 try{await drainQueue(async(identity,item)=>{const {error}=await supabase.rpc('record_balance_attempt',{reporter_id:identity.id,reporter_token:identity.token,incoming:item.payload,incoming_revision:item.revision});if(error)throw error;});announce(readQueue().length?'pending':'saved');}
 catch{announce('pending');}finally{running=false;}
}
export function startBalanceCloud(){
 if(started)return;started=true;reporterIdentity();
 // Backfill records from the previous local-only build, retaining stable IDs.
 try{if(!localStorage.getItem('beyond-signal-balance-cloud-migrated-v1')){
  const rows=readAttempts().map(row=>({...row,attemptId:row.attemptId??crypto.randomUUID(),legacy:row.legacy||!row.configuration}));
  localStorage.setItem(balanceKey,JSON.stringify(rows));enqueueAttempts(rows);
  localStorage.setItem('beyond-signal-balance-cloud-migrated-v1','1');
 }}catch{}
 window.addEventListener('balance-attempt-saved',flushBalance);
 window.addEventListener('online',flushBalance);
 window.addEventListener('focus',flushBalance);
 window.addEventListener('visibilitychange',()=>{if(!document.hidden)flushBalance();});
 setInterval(flushBalance,30000);flushBalance();
}
export async function fetchBalanceReport(){
 const rows=[];let offset=0;
 for(;;){const {data,error}=await supabase.rpc('read_balance_attempts',{page_offset:offset,page_size:1000});if(error)throw error;rows.push(...data);if(data.length<1000)return rows;offset+=1000;if(offset>=100000)throw new Error('Report too large; export from SQL Editor.');}
}
