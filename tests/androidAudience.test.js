import test from 'node:test';
import assert from 'node:assert/strict';
import {audienceKey,readAudience,saveAudience,onlineServicesAllowed,forceLocalPlay} from '../src/androidAudience.js';
test('Android online services require an explicit, valid adult choice, including unavailable storage',()=>{
 for(const raw of [null,'broken','{}','{"version":2,"group":"adult"}','{"version":1,"group":"minor"}','{"version":1,"group":"private"}']){
  assert.equal(onlineServicesAllowed('android',{getItem:()=>raw}),false);
 }
 assert.equal(onlineServicesAllowed('android',{getItem(){throw Error('blocked');}}),false);
 assert.equal(onlineServicesAllowed('android',{getItem:()=>'{"version":1,"group":"adult"}'}),true);
 assert.equal(onlineServicesAllowed('web',{getItem(){throw Error('must not read');}}),true);
});
test('audience choice stores only the policy group; a failed write cannot authorize adult services',()=>{
 const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 saveAudience('minor',storage);assert.equal(readAudience(storage),'minor');
 assert.deepEqual(JSON.parse(values.get(audienceKey)),{version:1,group:'minor'});
 assert.throws(()=>saveAudience('18',storage));
 assert.throws(()=>saveAudience('adult',{setItem(){throw Error('blocked');}}));
 assert.equal(onlineServicesAllowed('android',storage),false);
});
test('local fallback overrides a stale adult choice for the current run',()=>{
 forceLocalPlay();assert.equal(onlineServicesAllowed('android',{getItem:()=>'{"version":1,"group":"adult"}'}),false);
});
