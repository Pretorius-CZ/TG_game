import test from 'node:test';
import assert from 'node:assert/strict';
import {makeIceBoard,ensurePlayableBoard} from '../src/levelRules.js';
test('impossible layout stops after a bounded generation budget',()=>{
 let calls=0;
 assert.throws(()=>makeIceBoard({rows:1,cols:2,types:4},[],()=>{calls++;return .5;}));
 assert.ok(calls<=256);
});
test('unrecoverable covered board returns control by throwing',()=>{
 assert.throws(()=>ensurePlayableBoard([0,1],{rows:1,cols:2,types:4},[0,1]));
});
