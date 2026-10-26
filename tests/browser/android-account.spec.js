import {test,expect} from '@playwright/test';
import {normalizeProgress,mergeProgress,SAVE_KEY} from '../../src/progressStorage.js';
import {accountKey} from '../../src/accountStorage.js';
test.skip(!process.env.ANDROID_AUTH_TEST,'Requires Android mode and explicitly mocked native plugins.');
const id='11111111-1111-4111-8111-111111111111',email='android-qa@example.invalid';
const user={id,email,aud:'authenticated',role:'authenticated',app_metadata:{provider:'google'},user_metadata:{},created_at:new Date().toISOString()};
const token=[{alg:'HS256',typ:'JWT'},{sub:id,exp:Math.floor(Date.now()/1000)+3600,aud:'authenticated'},'test-signature'].map(v=>typeof v==='string'?v:Buffer.from(JSON.stringify(v)).toString('base64url')).join('.');
async function setup(page,language='en'){
 let cloud=normalizeProgress({airlockCompleted:3,completed:4,navigationCompleted:4,crewCompleted:2,stars:{lights:3}});
 const errors=[],exchanges=[],saved=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/src/androidAuth.js',r=>r.fulfill({contentType:'application/javascript',body:`
 import {supabase,supabaseUrl} from '/src/supabase.js';
 import {createAndroidAuthFlow} from '/src/androidAuthFlow.js';
 export function androidAuth(onState){
  window.nativeAuthEvents={};
  const listen=async(name,fn)=>{window.nativeAuthEvents[name]=fn;return{remove:async()=>{delete window.nativeAuthEvents[name];}};};
  return createAndroidAuthFlow({auth:supabase.auth,storage:localStorage,authOrigin:new URL(supabaseUrl).origin,onState,
   app:{getInfo:async()=>({id:'com.playbeyondthesignal.game.preview'}),getLaunchUrl:async()=>undefined,addListener:listen},
   browser:{addListener:listen,open:async({url})=>{window.nativeOpenedUrl=url;},close:async()=>{}}});
 }`}));
 await page.route(/supabase\.co/,async r=>{
  const path=new URL(r.request().url()).pathname;
  if(path==='/auth/v1/token'){exchanges.push(r.request().postDataJSON());return r.fulfill({json:{access_token:token,refresh_token:'fake-refresh-token',expires_in:3600,token_type:'bearer',user}});}
  if(path==='/auth/v1/user')return r.fulfill({json:user});
  if(path==='/auth/v1/logout')return r.fulfill({status:204,body:''});
  if(path==='/rest/v1/rpc/sync_game_progress'){const incoming=r.request().postDataJSON().incoming;cloud=mergeProgress(cloud,normalizeProgress(incoming));saved.push(cloud);return r.fulfill({json:cloud});}
  return r.fulfill({status:204,body:''});
 });
 await page.route(/api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(language=>{
  if(sessionStorage.getItem('account-seeded'))return;sessionStorage.setItem('account-seeded','1');
  localStorage.setItem('to-the-stars-language',language);
  localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));
  localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,airlockCompleted:3,completed:4,navigationCompleted:2,engineCompleted:1,stars:{lights:2},scene:'cockpit'}));
  localStorage.setItem('to-the-stars-helpers-v1:guest:0','[0,1,0,0,0]');
 },language);
 await page.goto('/');await page.getByRole('button',{name:language==='de'?/Einstellungen/:language==='cs'?/Nastavení/:/Settings/}).click();
 await expect(page.locator('.account-panel .primary')).toBeEnabled();
 return{errors,exchanges,saved};
}
test('Android Google PKCE restores cloud, persists login, imports guest explicitly and signs out safely',async({page})=>{
 const t=await setup(page);
 await page.getByRole('button',{name:'Continue with Google'}).click();
 await expect.poll(()=>page.evaluate(()=>window.nativeOpenedUrl)).toContain('/auth/v1/authorize?');
 expect(await page.evaluate(()=>new URL(window.nativeOpenedUrl).searchParams.get('redirect_to'))).toBe('com.playbeyondthesignal.game.preview://auth/callback');
 await page.evaluate(()=>window.nativeAuthEvents.appUrlOpen({url:'com.playbeyondthesignal.game.preview://auth/callback?code=qa-only-code'}));
 await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key))?.crewCompleted,accountKey(id))).toBe(2);
 expect(t.exchanges).toHaveLength(1);expect(t.exchanges[0].code_verifier).toBeTruthy();
 const guest=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY);expect(guest.navigationCompleted).toBe(2);
 await page.reload();await page.getByRole('button',{name:'⚙ Settings'}).click();
 await expect(page.getByText(email,{exact:true})).toBeVisible();expect(t.exchanges).toHaveLength(1);
 await page.getByRole('button',{name:'Import guest progress from this device'}).click();
 await expect(page.locator('.import-feedback')).toContainText('saved online');
 await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key))?.engineCompleted,accountKey(id))).toBe(1);
 expect(t.saved.at(-1).crewCompleted).toBe(2);expect(t.saved.at(-1).engineCompleted).toBe(1);
 await page.getByRole('button',{name:'Sign out',exact:true}).click();
 await page.getByRole('button',{name:'⚙ Settings'}).click();await expect(page.getByRole('button',{name:'Continue with Google'})).toBeEnabled();
 const after=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY);expect(after).toEqual(guest);
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-helpers-v1:guest:0'))).toBe('[0,1,0,0,0]');expect(t.errors).toEqual([]);
});
for(const kind of ['cancelled','denied'])test(`Android sign-in ${kind} retains guest and offers retry`,async({page})=>{
 const t=await setup(page),before=await page.evaluate(key=>localStorage.getItem(key),SAVE_KEY);
 await page.getByRole('button',{name:'Continue with Google'}).click();await expect.poll(()=>page.evaluate(()=>window.nativeOpenedUrl)).toBeTruthy();
 if(kind==='cancelled')await page.evaluate(()=>window.nativeAuthEvents.browserFinished());
 else await page.evaluate(()=>window.nativeAuthEvents.appUrlOpen({url:'com.playbeyondthesignal.game.preview://auth/callback?error=access_denied'}));
 await expect(page.getByRole('button',{name:'Continue with Google'})).toBeEnabled();
 expect(await page.evaluate(key=>localStorage.getItem(key),SAVE_KEY)).toBe(before);expect(t.exchanges).toEqual([]);expect(t.errors).toEqual([]);
});
test('Czech Android settings explain the same-account cloud flow and cancellation',async({page})=>{
 const t=await setup(page,'cs');await expect(page.locator('.account-panel')).toContainText('stejný Google účet jako na webu');
 await page.locator('.account-panel .primary').click();await expect(page.locator('.account-panel')).toContainText('Dokonči Google přihlášení');
 await page.evaluate(()=>window.nativeAuthEvents.browserFinished());await expect(page.locator('.account-panel')).toContainText('Přihlášení bylo zavřeno');
 await expect(page.locator('.account-panel .primary')).toBeEnabled();expect(t.errors).toEqual([]);
});

test('German Android sign-in instructions and cancellation preserve the guest save',async({page})=>{
 const t=await setup(page,'de'),before=await page.evaluate(key=>localStorage.getItem(key),SAVE_KEY);
 await expect(page.locator('.account-panel')).toContainText('Google');
 await page.locator('.account-panel .primary').click();
 await expect(page.locator('.account-panel')).toContainText('Schließe die Google-Anmeldung im Browser ab');
 await page.evaluate(()=>window.nativeAuthEvents.browserFinished());
 await expect(page.locator('.account-panel')).toContainText('Die Anmeldung wurde geschlossen.');
 expect(await page.evaluate(key=>localStorage.getItem(key),SAVE_KEY)).toBe(before);expect(t.errors).toEqual([]);
});
