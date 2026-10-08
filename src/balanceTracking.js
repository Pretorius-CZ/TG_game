import {enqueueAttempt} from './balanceOutbox.js';
import {nearMiss} from './analyticsReport.js';
export const balanceKey='beyond-signal-balance-attempts-v1';
export function readAttempts(){try{const data=JSON.parse(localStorage.getItem(balanceKey)||'[]');return Array.isArray(data)?data:[];}catch{return [];}}
export function saveAttempt(row){try{const data=readAttempts().filter(r=>!row.attemptId||r.attemptId!==row.attemptId);localStorage.setItem(balanceKey,JSON.stringify([...data,row].slice(-2000)));enqueueAttempt(row);if(typeof window!=='undefined')window.dispatchEvent(new Event('balance-attempt-saved'));}catch{}}
export function summarizeAttempts(rows,id){
 const relevant=rows.filter(r=>r.level===id);
 const completed=relevant.filter(r=>['won','failed','exhausted'].includes(r.outcome));
 const clean=completed.filter(r=>!r.extraMoves&&!r.helpers?.length&&!r.hints);
 const wins=completed.filter(r=>r.outcome==='won');
 const measuredWins=wins.filter(r=>Number.isFinite(r.remaining));
 const ratio=(a,b)=>b?Math.round(a/b*100):null;
 const rate=ratio(wins.length,completed.length);
 const durations=completed.filter(r=>Number.isFinite(r.durationMs)&&r.durationMs>=0).map(r=>r.durationMs).sort((a,b)=>a-b);
 const middle=Math.floor(durations.length/2);
 const devices=new Set(relevant.map(r=>r.reporter).filter(Boolean)).size||null;
 const completedDevices=new Set(completed.map(r=>r.reporter).filter(Boolean)).size;
 const failures=completed.map(nearMiss).filter(value=>value!==null);
 return {devices,nearMisses:failures.filter(Boolean).length,measuredFailures:failures.length,duration:durations.length?(durations.length%2?durations[middle]:(durations[middle-1]+durations[middle])/2):null,attempts:completed.length,wins:wins.length,rate,cleanRate:ratio(clean.filter(r=>r.outcome==='won').length,clean.length),cleanAttempts:clean.length,
 help:ratio(completed.filter(r=>r.extraMoves||r.helpers?.length||r.hints).length,completed.length),
 remaining:measuredWins.length?Math.round(measuredWins.reduce((sum,r)=>sum+r.remaining,0)/measuredWins.length):null,
 quits:relevant.filter(r=>r.outcome==='quit').length,faults:relevant.filter(r=>r.outcome==='fault').length,
 verdict:completed.length<20?'Málo dat':completedDevices<5?'Málo nezávislých zařízení':rate>90?'Prověřit snížení tahů':rate<35?'Prověřit přílišnou obtížnost':'Sledovat podle role levelu'};
}
