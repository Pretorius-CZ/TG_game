export const playtestKey=id=>'beyond-signal-blind-test-v1:'+id;
export const isPlaytestAttempt=row=>row?.configuration?.playtest?.mode==='blind-200-v1';
export function createPlaytest(repairs,{uuid=()=>crypto.randomUUID(),random=()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296,rules}={}){
 const order=repairs.map(r=>r.id);
 for(let i=order.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
 return {version:1,revision:0,session:uuid(),reporter:uuid(),token:uuid(),rules,createdAt:Date.now(),order,repairs:JSON.parse(JSON.stringify(repairs)),cursor:0,attempts:[],pending:[],active:null,rating:null,consent:false};
}
export function readPlaytest(storage,key){
 const raw=storage.getItem(key);if(!raw)return null;
 const s=JSON.parse(raw);
 if(s.version!==1||!Array.isArray(s.order)||!Array.isArray(s.repairs)||s.order.length!==200||new Set(s.order).size!==200||s.order.some(id=>!s.repairs.some(r=>r.id===id))||!Number.isInteger(s.cursor)||s.cursor<0||s.cursor>s.order.length||!Array.isArray(s.attempts)||!Array.isArray(s.pending)||!Number.isInteger(s.revision))throw Error('Uložený test nelze bezpečně načíst. Exportuj jej nebo kontaktuj správce; nic nebylo smazáno.');
 return s;
}
export function queuePlaytestResult(session,row){
 const revision=session.revision+1,metadata={mode:'blind-200-v1',session:session.session,initialRules:session.rules,index:session.cursor+1,total:session.order.length,rating:null,note:'',...row.configuration?.playtest};
 const payload={...row,configuration:{...row.configuration,playtest:metadata}};
 return {...session,active:null,rating:row.attemptId,attempts:[...session.attempts.filter(r=>r.attemptId!==row.attemptId),payload],pending:[...session.pending.filter(r=>r.payload.attemptId!==row.attemptId),{revision,payload}]};
}
export function ratePlaytest(session,rating,note=''){
 if(!['easy','fair','hard'].includes(rating))throw Error('Vyber hodnocení.');
 const row=session.attempts.find(r=>r.attemptId===session.rating);if(!row)throw Error('Výsledek pokusu chybí.');
 return queuePlaytestResult(session,{...row,configuration:{...row.configuration,playtest:{...row.configuration.playtest,rating,note:note.trim().slice(0,500)}}});
}
export function playtestExport(session){return {version:1,kind:'blind-playtest',rules:session.rules,session:session.session,completed:session.cursor,total:session.order.length,exportedAt:new Date().toISOString(),attempts:session.attempts};}
