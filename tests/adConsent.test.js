import test from 'node:test';
import assert from 'node:assert/strict';
import {consentDecision,consentAllowsAds,createAdConsent} from '../src/adConsent.js';
const data={cmpStatus:'loaded',eventStatus:'useractioncomplete',gdprApplies:true,tcString:'cmp-generated',purpose:{consents:{1:true}},vendor:{consents:{755:true}}};
test('only explicit CMP decisions allow ads; API ready, stubs and missing strings do not',()=>{
 assert.equal(consentDecision(data,true),'granted');
 for(const status of ['unknown','pending','denied','unavailable'])assert.equal(consentAllowsAds(status),false);
 assert.equal(consentDecision({...data,tcString:''},true),'pending');
 assert.equal(consentDecision({...data,cmpStatus:'stub'},true),'pending');
 assert.equal(consentDecision({...data,eventStatus:'cmpuishown'},true),'pending');
 assert.equal(consentDecision({...data,vendor:{consents:{755:false}}},true),'denied');
 assert.equal(consentDecision({...data,purpose:{consents:{1:false}}},true),'denied');
 assert.equal(consentDecision({...data,gdprApplies:false},true),'not-required');
 assert.equal(consentDecision(data,false),'unavailable');
});
function fixture(initial=data){
 let listener,revocations=0,loads=0;
 const queue=[],win={googlefc:{callbackQueue:queue,showRevocationMessage(){revocations++;listener({...data,eventStatus:'cmpuishown'},true);}}};
 win.__tcfapi=(action,version,fn)=>{assert.equal(action,'addEventListener');listener=fn;fn(initial,true);};
 const consent=createAdConsent({win,loadTag:async()=>{loads++;for(const c of queue)c.CONSENT_API_READY();queue.push=c=>c.CONSENT_API_READY();},apiTimeoutMs:20});
 return {consent,emit:(d,success=true)=>listener(d,success),get loads(){return loads;},get revocations(){return revocations;}};
}
test('CMP acceptance and later refusal propagate without a local consent substitute',async()=>{
 const f=fixture();assert.equal(await f.consent.request(),'granted');
 const changed=f.consent.request({change:true});await new Promise(r=>setTimeout(r,0));
 assert.equal(f.revocations,1);assert.equal(f.consent.getStatus(),'pending');
 f.emit({...data,purpose:{consents:{1:false}}});assert.equal(await changed,'denied');
});
test('simultaneous requests share one CMP operation and wait for the user',async()=>{
 const f=fixture({...data,eventStatus:'cmpuishown'}),a=f.consent.request(),b=f.consent.request();
 assert.equal(a,b);await new Promise(r=>setTimeout(r,0));assert.equal(f.loads,1);
 f.emit(data);assert.equal(await a,'granted');
});
test('an unavailable or blocked CMP never becomes automatic acceptance',async()=>{
 const win={googlefc:{callbackQueue:[]}};
 const c=createAdConsent({win,loadTag:async()=>{},apiTimeoutMs:5});
 assert.equal(await c.request(),'unavailable');assert.equal(consentAllowsAds(c.getStatus()),false);
 const error=Error();error.code='ad-tag-unavailable';
 const blocked=createAdConsent({win:{},loadTag:async()=>{throw error;},apiTimeoutMs:5});
 assert.equal(await blocked.request(),'unavailable');assert.equal(blocked.getFailure(),'load');
});
test('opening settings with no previous choice uses the initial CMP prompt once',async()=>{
 const f=fixture({...data,eventStatus:'cmpuishown'}),choice=f.consent.request({change:true});
 await new Promise(r=>setTimeout(r,0));f.emit(data);assert.equal(await choice,'granted');assert.equal(f.revocations,0);
});
test('a callable CMP without data or a visible message cannot trap the game',async()=>{
 const queue=[],win={googlefc:{callbackQueue:queue},__tcfapi:()=>{}};
 const consent=createAdConsent({win,loadTag:async()=>queue[0].CONSENT_API_READY(),apiTimeoutMs:5});
 assert.equal(await consent.request(),'unavailable');
});
test('a throwing CMP listener releases the game without granting consent',async()=>{
 const queue=[],win={googlefc:{callbackQueue:queue},__tcfapi:()=>{throw Error('CMP failed');}};
 const consent=createAdConsent({win,loadTag:async()=>queue[0].CONSENT_API_READY(),apiTimeoutMs:5});
 assert.equal(await consent.request(),'unavailable');
});
