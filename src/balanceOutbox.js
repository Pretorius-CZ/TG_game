const queueKey='beyond-signal-balance-outbox-v1';
const identityKey='beyond-signal-balance-reporter-v1';
export function readQueue(){try{const q=JSON.parse(localStorage.getItem(queueKey)||'[]');return Array.isArray(q)?q:[];}catch{return [];}}
export function reporterIdentity(){try{let data=JSON.parse(localStorage.getItem(identityKey)||'null');if(!data?.id||!data?.token){data={id:crypto.randomUUID(),token:crypto.randomUUID(),sequence:0};localStorage.setItem(identityKey,JSON.stringify(data));}return data;}catch{return null;}}
export function enqueueAttempts(rows){try{const identity=reporterIdentity();if(!identity)return;const q=new Map(readQueue().map(item=>[item.payload.attemptId,item]));for(const row of rows){if(!row.attemptId)continue;identity.sequence=(identity.sequence??0)+1;q.set(row.attemptId,{revision:identity.sequence,payload:row});}localStorage.setItem(identityKey,JSON.stringify(identity));localStorage.setItem(queueKey,JSON.stringify([...q.values()].slice(-2000)));}catch{}}
export function enqueueAttempt(row){enqueueAttempts([row]);}
export async function drainQueue(send){const identity=reporterIdentity();if(!identity)return;for(const item of readQueue().slice(0,100)){await send(identity,item);const current=readQueue().filter(r=>!(r.payload.attemptId===item.payload.attemptId&&r.revision===item.revision));localStorage.setItem(queueKey,JSON.stringify(current));}}
