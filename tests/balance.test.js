import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeAttempts,saveAttempt,readAttempts} from '../src/balanceTracking.js';
import {levelCatalog} from '../src/levelCatalog.js';
test('catalog counts every unique playable puzzle, including final launch and approach',()=>{
 assert.equal(levelCatalog.length,120);assert.equal(new Set(levelCatalog.map(r=>r.id)).size,120);
 assert.ok(levelCatalog.some(r=>r.id==='launch-check'));assert.ok(levelCatalog.every(r=>r.moves>0));
});
test('balance separates help, quits and faults and avoids inventing old remaining moves',()=>{
 const data=[{level:'x',outcome:'won',moves:4,remaining:6},{level:'x',outcome:'won',moves:5,extraMoves:true},{level:'x',outcome:'exhausted',moves:10},{level:'x',outcome:'quit',moves:2},{level:'x',outcome:'fault',moves:3}];
 const s=summarizeAttempts(data,'x');assert.equal(s.attempts,3);assert.equal(s.rate,67);assert.equal(s.cleanRate,50);assert.equal(s.help,33);assert.equal(s.remaining,6);assert.equal(s.quits,1);assert.equal(s.faults,1);assert.equal(s.verdict,'Málo dat');
});
test('continued win updates the exhausted attempt instead of counting two attempts',()=>{
 const store=new Map();globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 try{saveAttempt({attemptId:'a',level:'x',outcome:'exhausted',moves:12});saveAttempt({attemptId:'a',level:'x',outcome:'won',moves:14,extraMoves:true});assert.equal(readAttempts().length,1);assert.equal(summarizeAttempts(readAttempts(),'x').rate,100);}finally{delete globalThis.localStorage;}
});
