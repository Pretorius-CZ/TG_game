import test from 'node:test';
import assert from 'node:assert/strict';
import {readStock,spendStock,stockKey,rewardStock,starterStockAllowed} from '../src/helperStock.js';
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
test('Google sign-in on the new origin never creates a second starter collection',()=>{
 assert.equal(starterStockAllowed({hostname:'game.playbeyondthesignal.com',userId:'existing',progress:{completed:4}}),false);
 assert.equal(starterStockAllowed({hostname:'game.playbeyondthesignal.com',userId:'existing',progress:{completed:0}}),false);
 assert.equal(starterStockAllowed({hostname:'game.playbeyondthesignal.com',progress:{airlockCompleted:2}}),false);
 assert.equal(starterStockAllowed({hostname:'game.playbeyondthesignal.com',progress:{airlockCompleted:0,resetRevision:0}}),true);
 const db=storage(),key=stockKey('existing'),empty=[0,0,0,0,0];
 assert.deepEqual(readStock(db,key,empty),empty);assert.equal(spendStock(db,key,0,empty),false);assert.deepEqual(rewardStock(db,key,2,empty),[0,0,1,0,0]);
 db.setItem(key,'[1,0,0,1,0]');assert.deepEqual(readStock(db,key,empty),[1,0,0,1,0]);
});
