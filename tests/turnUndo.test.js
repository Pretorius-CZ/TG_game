import test from 'node:test';
import assert from 'node:assert/strict';
import {createTurnRandom,createTurnUndo} from '../src/turnUndo.js';
import {summarizeAttempts} from '../src/balanceTracking.js';
import {assistanceLabel} from '../src/balanceReport.js';

test('random replay retains draws across checkpoints and divergent paths',()=>{
 let calls=0;const random=createTurnRandom(()=>++calls/100);
 random.next();random.next();random.checkpoint();
 const original=[random.next(),random.next(),random.next()];random.rewind();
 assert.deepEqual([random.next(),random.next(),random.next()],original);assert.equal(calls,5);
 random.rewind();random.next();random.checkpoint();
 assert.equal(random.next(),original[1]);assert.equal(random.next(),original[2]);
 assert.equal(random.next(),.06);random.reset();assert.equal(random.next(),.07);
});

test('undo deeply restores the entire turn and cannot be claimed twice',()=>{
 const random=createTurnRandom(()=>.3),undo=createTurnUndo(random);
 const state={board:[0,10,null,2],ice:[0],counts:[4],resonance:[2],moves:7,cascadePulse:1,refillHistory:{0:3}};
 const expected=structuredClone(state);undo.capture(state);random.next();
 state.board[0]=11;state.ice.pop();state.counts[0]=99;state.resonance[0]=3;state.refillHistory[0]=0;
 assert.deepEqual(undo.take(),expected);assert.equal(undo.available,false);assert.equal(undo.take(),null);
 undo.capture(state);assert.equal(undo.available,false);
 undo.reset();undo.capture(state);assert.deepEqual(undo.take(),state);
});

test('helper barriers, faults and resets invalidate old undo frames',()=>{
 const undo=createTurnUndo(createTurnRandom());
 undo.capture({moves:1});undo.invalidate();assert.equal(undo.take(),null);
 undo.capture({moves:2});assert.deepEqual(undo.take(),{moves:2});
 undo.reset();assert.equal(undo.take(),null);undo.capture({moves:0});assert.equal(undo.available,true);
});

test('undo is assistance in local and server-shaped analytics, never a clean win',()=>{
 const row={level:'lights',outcome:'won',remaining:3,helpers:[],hints:0,extraMoves:false,configuration:{assistance:{undoUses:1,actions:8}}};
 const summary=summarizeAttempts([row],'lights');
 assert.equal(summary.cleanAttempts,0);assert.equal(summary.help,100);
 assert.equal(assistanceLabel(row),'Krok zpět ×1');
 assert.equal(summarizeAttempts([{...row,configuration:{}}],'lights').cleanAttempts,1);
});
