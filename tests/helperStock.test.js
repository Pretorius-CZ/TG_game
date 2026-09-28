import test from 'node:test';
import assert from 'node:assert/strict';
import {readStock,spendStock,stockKey} from '../src/helperStock.js';
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
