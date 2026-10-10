import test from 'node:test';
import assert from 'node:assert/strict';
import {showRewarded} from '../src/androidRewardFlow.js';
import {rewardAllowed} from '../src/rewardPolicy.js';
const events={Rewarded:'reward',Dismissed:'dismiss',FailedToShow:'fail'};
function fake(sequence,{prepareError=false,showError=false}={}){
 const listeners=new Map();let removals=0;
 return {get removals(){return removals;},
  async addListener(name,callback){listeners.set(name,callback);return {async remove(){listeners.delete(name);removals++;}};},
  async prepareRewardVideoAd(){if(prepareError)throw Error('no fill');},
  showRewardVideoAd(){if(showError)return Promise.reject(Error('native failure'));queueMicrotask(()=>{for(const name of sequence)listeners.get(name)?.();});return new Promise(()=>{});}
 };
}
test('Android only enables extra moves, web and portal policies stay unchanged',()=>{
 for(const kind of ['moves','hint','helper','energy',undefined]){
  assert.equal(rewardAllowed('android',kind),kind==='moves');
  assert.equal(rewardAllowed('production',kind),true);
  assert.equal(rewardAllowed('crazygames',kind),true);
 }
});
test('reward requires native Rewarded, dismissal alone earns nothing',async()=>{
 for(const [sequence,expected] of [[['dismiss'],false],[['reward','dismiss'],true],[['reward','reward','dismiss'],true]]){
  const plugin=fake(sequence);assert.equal(await showRewarded(plugin,events,'test-id'),expected);assert.equal(plugin.removals,3);
 }
});
test('load and show failures never grant and always remove listeners',async()=>{
 for(const plugin of [fake([],{prepareError:true}),fake([],{showError:true}),fake(['fail'])]){
  await assert.rejects(showRewarded(plugin,events,'test-id'));assert.equal(plugin.removals,3);
 }
});
test('earning reward does not resume gameplay before fullscreen dismissal',async()=>{
 const callbacks={};let resolved=false;
 const plugin={async addListener(name,fn){callbacks[name]=fn;return {async remove(){}};},async prepareRewardVideoAd(){},showRewardVideoAd(){callbacks.reward();return Promise.resolve({amount:1});}};
 const result=showRewarded(plugin,events,'test-id').then(value=>{resolved=true;return value;});
 await new Promise(resolve=>setImmediate(resolve));assert.equal(resolved,false);
 callbacks.dismiss();assert.equal(await result,true);
});
