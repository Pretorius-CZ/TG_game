import {test,expect} from '@playwright/test';
test.skip(!process.env.ANDROID_AUTH_TEST,'Requires Android mode; online services are intercepted.');
const audienceKey='beyond-signal-android-audience-v1';
test('unknown and local Android play never restore an old Google session or upload legacy statistics',async({page})=>{
 const external=[];await page.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/,r=>{external.push(r.request().url());return r.abort();});
 await page.addInitScript(()=>{
  if(localStorage.getItem('seeded-audience'))return;localStorage.setItem('seeded-audience','1');
  localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'granted',at:Date.now()}));
  localStorage.setItem('sb-pogyrdsuoqpnzsdeuqpk-auth-token',JSON.stringify({access_token:'expired',refresh_token:'old-token',expires_at:1}));
  localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,airlockCompleted:2,scene:'airlock'}));
  localStorage.setItem('beyond-the-signal-intro:guest:0','seen');
 });
 await page.goto('/');await expect(page.locator('.android-audience')).toBeVisible();await page.waitForTimeout(350);expect(external).toEqual([]);
 await expect(page.locator('input:checked')).toHaveCount(0);await page.locator('input[value="minor"]').check();await page.locator('.android-audience .primary').click();
 await expect(page.locator('.welcome-play')).toBeVisible();await page.locator('.account-control>button').click();
 await expect(page.getByText('Local play: no ads, Google sign-in or outgoing gameplay statistics. Progress stays on this device.')).toBeVisible();
 await expect(page.getByRole('button',{name:'Continue with Google'})).toHaveCount(0);await expect(page.getByRole('button',{name:'Allow statistics',exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'Advertising privacy'})).toHaveCount(0);
 await page.getByRole('button',{name:'Close',exact:true}).click();await page.locator('.welcome-play').click();await expect(page.getByRole('button',{name:/Play →/})).toBeVisible();await page.getByRole('button',{name:/Play →/}).click();await expect(page.locator('.board')).toBeVisible();
 await expect(page.locator('.undo-control .helper-badge')).toHaveText('0');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).airlockCompleted)).toBe(2);
 await page.reload();await expect(page.locator('.welcome-play')).toBeVisible();await page.waitForTimeout(350);expect(external).toEqual([]);
 expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),audienceKey)).toEqual({version:1,group:'minor'});
});
for(const language of ['en','cs','de','fr','es','pt-BR'])test(`age choice and private play fit a narrow phone in ${language}`,async({page})=>{
 await page.setViewportSize({width:320,height:568});const external=[];await page.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/,r=>{external.push(r.request().url());return r.abort();});
 await page.goto('/?lang='+language);await expect(page.locator('.android-audience')).toBeVisible();
 await expect(page.locator('.android-audience')).not.toContainText('audience.');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('input[value="private"]').check();await page.locator('.android-audience .primary').click();await expect(page.locator('.welcome-play')).toBeVisible();await page.waitForTimeout(150);expect(external).toEqual([]);
});
test('a failed age-setting write cannot fall back to stale adult permissions',async({page})=>{
 await page.route(/supabase\.co|country\.is/,r=>r.abort());
 await page.addInitScript(()=>{
  localStorage.setItem('beyond-signal-android-audience-v1',JSON.stringify({version:1,group:'adult'}));
  localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));
 });
 await page.goto('/');await page.locator('.account-control>button').click();
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Age settings',exact:true}).click();
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('storage full');};});
 await page.locator('input[value="minor"]').check();await page.locator('.android-audience .primary').click();
 await page.getByRole('button',{name:'Continue with local play',exact:true}).click();
 await page.locator('.account-control>button').click();
 await expect(page.getByRole('button',{name:'Continue with Google',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Allow statistics',exact:true})).toHaveCount(0);
 await expect(page.locator('.account-panel')).toContainText('Local play: no ads');
});
