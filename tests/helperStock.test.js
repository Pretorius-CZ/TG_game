import test from 'node:test';
import assert from 'node:assert/strict';
import {readStock,spendStock,stockKey,rewardStock} from '../src/helperStock.js';
const storage=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};};
test('helper stock survives level changes and reloads, and cannot be spent twice',()=>{
 const db=storage(),key=stockKey();
 assert.deepEqual(readStock(db,key),[1,1,1,1,1]);
 assert.deepEqual(spendStock(db,key,2),[1,1,0,1,1]);
 assert.deepEqual(readStock(db,key),[1,1,0,1,1]);
 assert.equal(spendStock(db,key,2),false);
 assert.deepEqual(readStock(db,stockKey('other')),[1,1,1,1,1]);
 assert.deepEqual(readStock(db,stockKey(undefined,1)),[1,1,1,1,1]);
});
test('corrupt saves never refill helpers and failed writes do not grant an effect',()=>{
 const db=storage(),key=stockKey();db.setItem(key,'broken');assert.deepEqual(readStock(db,key),[0,0,0,0,0]);
 assert.throws(()=>spendStock({getItem:()=>null,setItem:()=>{throw Error('full');}},key,0));
});

test('ad grants only the selected empty helper and persists across levels',()=>{
 const db=storage(),key=stockKey('tester',2);
 spendStock(db,key,0);spendStock(db,key,3);
 assert.deepEqual(rewardStock(db,key,0),[1,1,1,0,1]);
 assert.deepEqual(readStock(db,key),[1,1,1,0,1]);
 assert.equal(rewardStock(db,key,0),false);
 assert.equal(rewardStock(db,key,-1),false);
 assert.equal(rewardStock(db,key,5),false);
 assert.deepEqual(readStock(db,stockKey('another',2)),[1,1,1,1,1]);
 assert.throws(()=>rewardStock({getItem:()=> '[0,0,0,0,0]',setItem:()=>{throw Error('full');}},key,0));
});
