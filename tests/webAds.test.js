import test from 'node:test';
import assert from 'node:assert/strict';
import {webAdsMode} from '../src/webAdsPolicy.js';
import {createRewardedPlacement} from '../src/googleH5Ads.js';
const url='https://game.playbeyondthesignal.com/';
test('paid ads cannot be enabled, while test is opt-in and bot traffic stays simulated',()=>{
 assert.equal(webAdsMode({url}),'simulation');
 assert.equal(webAdsMode({url:url+'?ads_test=google'}),'test');
 for(const configured of ['disabled','live','invalid'])assert.equal(webAdsMode({url,configured}),'disabled');
 assert.equal(webAdsMode({url:url+'?ads_test=google&utm_source=automated_test&utm_medium=bot'}),'simulation');
 for(const key of ['beyond-signal-migrated-traffic-v1','beyond-signal-campaign-visit-v1'])assert.equal(webAdsMode({configured:'test',url,storage:{getItem:k=>k===key?JSON.stringify({source:'automated_test',medium:'bot'}):null}}),'simulation');
 for(const platform of ['itch','telegram'])assert.equal(webAdsMode({url:url+'?ads_test=google',platform}),'simulation');
});
function fixture(options={}){
 let callbacks,show,paused=0,resumed=0;
 const placement=createRewardedPlacement({adBreak:c=>{callbacks=c;},onReady:fn=>{show=fn;},onPause:()=>paused++,onResume:()=>resumed++,...options});
 return {placement,get callbacks(){return callbacks;},get show(){return show;},get paused(){return paused;},get resumed(){return resumed;}};
}
test('only a completed view rewards once and resumes the same attempt',async()=>{
 const f=fixture();let starts=0;
 f.callbacks.beforeReward(()=>{starts++;f.callbacks.beforeAd();});f.show();f.show();
 f.callbacks.adViewed();f.callbacks.adViewed();f.callbacks.afterAd();f.callbacks.adBreakDone({breakStatus:'viewed'});
 assert.deepEqual(await f.placement.result,{status:'viewed',viewed:true});assert.equal(starts,1);assert.equal(f.paused,1);assert.equal(f.resumed,1);
});
test('viewed placement status without adViewed cannot grant a reward',async()=>{
 const f=fixture();f.callbacks.beforeReward(()=>{});f.show();f.callbacks.adBreakDone({breakStatus:'viewed'});
 assert.equal((await f.placement.result).viewed,false);
});
test('dismissal, no-fill, callback error and explicit cancellation never reward',async()=>{
 for(const status of ['dismissed','noAdPreloaded','error','cancelled']){
  const f=fixture();f.callbacks.beforeReward(()=>{f.callbacks.beforeAd();});f.show();
  if(status==='cancelled')f.placement.cancel();else if(status==='dismissed')f.callbacks.adDismissed();else f.callbacks.adBreakDone({breakStatus:status});
  f.callbacks.adViewed();f.callbacks.afterAd();
  assert.deepEqual(await f.placement.result,{status,viewed:false});assert.equal(f.resumed,1);
 }
});
test('loader/placement errors and timeouts release the request without granting',async()=>{
 const f=fixture({adBreak:()=>{throw Error('blocked');}});assert.equal((await f.placement.result).viewed,false);
 const timed=fixture({readyMs:1});assert.deepEqual(await timed.placement.result,{status:'timeout',viewed:false});
 timed.callbacks.beforeReward(()=>assert.fail('late ad must not open'));timed.callbacks.adViewed();
});
test('ad watchdog does not time out while the document is hidden',async()=>{
 const doc={hidden:true},f=fixture({document:doc,readyMs:1});let done=false;
 f.placement.result.then(()=>{done=true;});await new Promise(r=>setTimeout(r,300));assert.equal(done,false);
 doc.hidden=false;assert.equal((await f.placement.result).status,'timeout');
});
