import test from 'node:test';
import assert from 'node:assert/strict';
import {createAndroidAuthFlow,androidAuthCallback,androidAuthRedirect,androidAuthPendingKey as key} from '../src/androidAuthFlow.js';
const redirect=androidAuthRedirect('com.playbeyondthesignal.game.preview');
function setup({launch,stored,at=1000,exchange,oauth}={}){
 const values=new Map(stored?[[key,JSON.stringify(stored)]]:[]),events={},states=[],calls={open:[],exchange:[],oauth:[]};
 const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 const listen=async(name,fn)=>{events[name]=fn;return{remove:async()=>{delete events[name];}};};
 const flow=createAndroidAuthFlow({storage,authOrigin:'https://project.supabase.co',now:()=>at,onState:s=>states.push(s),
  app:{getInfo:async()=>({id:'com.playbeyondthesignal.game.preview'}),addListener:listen,getLaunchUrl:async()=>launch?{url:launch}:undefined},
  browser:{addListener:listen,open:async opts=>calls.open.push(opts),close:async()=>{}},
  auth:{signInWithOAuth:async opts=>{calls.oauth.push(opts);return oauth??{data:{url:'https://project.supabase.co/auth/v1/authorize?provider=google'}};},exchangeCodeForSession:async code=>{calls.exchange.push(code);return exchange?exchange():{error:null};}}
 });return{flow,values,events,states,calls};
}
test('native redirects separate debug and release; unrelated links and implicit tokens are rejected',()=>{
 assert.equal(androidAuthRedirect('com.playbeyondthesignal.game'),'com.playbeyondthesignal.game://auth/callback');
 assert.throws(()=>androidAuthRedirect('unrelated.app'));
 assert.deepEqual(androidAuthCallback(redirect+'?code=ok',redirect),{code:'ok'});
 for(const url of [redirect+'?code=',redirect+'?code=a&code=b',redirect+'?code=a#access_token=secret',redirect+'?access_token=secret',redirect+'?code=a&refresh_token=x',redirect.replace('://auth/','://elsewhere/')+'?code=a',redirect.replace('/callback','/callback/extra')+'?code=a',redirect.replace('.preview','')+'?code=a','https://game.playbeyondthesignal.com/?code=a'])assert.equal(androidAuthCallback(url,redirect),null,url);
});
test('Google opens only the Supabase authorize endpoint and uses PKCE with native redirect',async()=>{
 const t=setup();await t.flow.ready;await Promise.all([t.flow.start(),t.flow.start()]);
 assert.equal(t.calls.oauth.length,1);assert.deepEqual(t.calls.oauth[0],{provider:'google',options:{redirectTo:redirect,skipBrowserRedirect:true,queryParams:{prompt:'select_account'}}});
 assert.equal(t.calls.open.length,1);assert.deepEqual(JSON.parse(t.values.get(key)),{redirect,at:1000});
 await t.flow.dispose();assert.deepEqual(Object.keys(t.events),[]);
});
test('warm callback is exchanged once and consumes pending state before the await',async()=>{
 let resolve;const t=setup({exchange:()=>new Promise(r=>{resolve=r;})});await t.flow.ready;await t.flow.start();
 t.events.appUrlOpen({url:redirect+'?code=one'});t.events.appUrlOpen({url:redirect+'?code=one'});
 assert.deepEqual(t.calls.exchange,['one']);assert.equal(t.values.has(key),false);resolve({error:null});
 await new Promise(r=>setImmediate(r));assert.equal(t.states.at(-1),'signed-in');
});
test('cold start handles a pending callback; an unsolicited or expired callback does nothing',async()=>{
 for(const stored of [undefined,{redirect,at:0},{redirect,at:999999},{redirect:redirect.replace('.preview',''),at:1000}]){
  const t=setup({launch:redirect+'?code=cold',stored,at:700000});await t.flow.ready;assert.deepEqual(t.calls.exchange,[]);
 }
 const t=setup({launch:redirect+'?code=cold',stored:{redirect,at:900}});await t.flow.ready;assert.deepEqual(t.calls.exchange,['cold']);assert.equal(t.states.at(-1),'signed-in');
});
test('cancelled, denied and failed exchanges preserve guest data and allow retry',async()=>{
 for(const failure of ['denied','exchange','browser']){
  const t=setup({exchange:failure==='exchange'?async()=>({error:Error('private backend details')}):undefined});await t.flow.ready;
  t.values.set('guest-save','preserve');await t.flow.start();
  if(failure==='browser'){t.events.browserFinished();assert.equal(t.states.at(-1),'cancelled');await t.flow.start();assert.equal(t.calls.open.length,2);}
  else {t.events.appUrlOpen({url:redirect+(failure==='denied'?'?error=access_denied':'?code=bad')});await new Promise(r=>setImmediate(r));assert.equal(t.states.at(-1),'failed');assert.equal(t.values.has(key),false);await t.flow.start();assert.equal(t.calls.open.length,2);}
  assert.equal(t.values.get('guest-save'),'preserve');
 }
});
test('failed or foreign authorize endpoints never open; logout cancels pending sign-in',async()=>{
 for(const oauth of [{error:Error('offline')},{data:{url:'https://attacker.example/auth/v1/authorize?provider=google'}},{data:{url:'https://project.supabase.co/other?provider=google'}}]){
  const t=setup({oauth});await t.flow.ready;await t.flow.start();assert.deepEqual(t.calls.open,[]);assert.equal(t.states.at(-1),'failed');assert.equal(t.values.has(key),false);
 }
 const t=setup();await t.flow.ready;await t.flow.start();t.flow.cancel();t.events.appUrlOpen({url:redirect+'?code=stale'});assert.deepEqual(t.calls.exchange,[]);
});
test('logout waits for an in-flight exchange so a late response cannot sign the user back in',async()=>{
 let resolve;const t=setup({exchange:()=>new Promise(r=>{resolve=r;})});await t.flow.ready;await t.flow.start();
 t.events.appUrlOpen({url:redirect+'?code=slow'});let finished=false;
 const cancelling=t.flow.cancel().then(()=>{finished=true;});await new Promise(r=>setImmediate(r));assert.equal(finished,false);
 resolve({error:null});await cancelling;assert.equal(finished,true);assert.equal(t.states.at(-1),'idle');
});
