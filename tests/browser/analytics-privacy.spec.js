import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{await page.addInitScript(()=>{if(!localStorage.getItem('beyond-signal-analytics-choice-v1'))localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));});});
async function mock(page,{deletionFails=false}={}){
 const requests=[];
 await page.route('**/rest/v1/rpc/**',async route=>{const name=route.request().url().split('/').pop();requests.push(name);const failure=name==='delete_browser_analytics'&&(typeof deletionFails==='function'?deletionFails():deletionFails);await route.fulfill({status:failure?503:200,contentType:'application/json',body:failure?'{"message":"offline"}':'null'});});
 await page.route('https://api.country.is/**',async route=>{requests.push('country');await route.fulfill({json:{country:'CZ'}});});
 return requests;
}
test('analytics stays off until opt-in, stops immediately, and erases only statistics',async({page})=>{
 await page.setViewportSize({width:320,height:568});const calls=await mock(page);
 await page.goto('/');await page.locator('.account-control>button').click();
 await expect(page.getByRole('button',{name:'Allow statistics',exact:true})).toBeVisible();
 expect(calls).toEqual([]);
 await page.getByRole('button',{name:'Allow statistics',exact:true}).click();
 await expect.poll(()=>calls.includes('record_campaign_visit')&&calls.includes('country')&&calls.includes('record_player_presence')).toBe(true);
 await page.getByRole('button',{name:'Do not allow statistics',exact:true}).click();
 calls.length=0;await page.evaluate(()=>{window.dispatchEvent(new Event('online'));document.dispatchEvent(new Event('visibilitychange'));});
 await page.waitForTimeout(500);expect(calls).toEqual([]);
 await page.evaluate(()=>localStorage.setItem('to-the-stars-progress-v1:privacy-test','keep'));
 await page.getByRole('button',{name:'Turn off and delete my statistics',exact:true}).click();
 await expect(page.getByText('Statistics for this browser were deleted. Your progress is unchanged.',{exact:true})).toBeVisible();
 expect(calls).toEqual(['delete_browser_analytics']);
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1:privacy-test'))).toBe('keep');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('a server deletion failure stays pending across reload and can be retried',async({page})=>{
 let failing=true;const calls=await mock(page,{deletionFails:()=>failing});
 await page.addInitScript(()=>{localStorage.setItem('beyond-signal-balance-reporter-v1',JSON.stringify({id:'11111111-1111-4111-8111-111111111111',token:'22222222-2222-4222-8222-222222222222'}));localStorage.setItem('to-the-stars-language','cs');});
 await page.goto('/');await page.locator('.account-control>button').click();
 await page.getByRole('button',{name:'Vypnout a smazat moje statistiky',exact:true}).click();
 await expect(page.getByText('Sběr je vypnutý. Výmaz na serveru se zatím nepodařil; žádost zůstává uložená pro opakování.',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('beyond-signal-analytics-deletions-v1')).length)).toBe(1);
 await page.reload();await page.locator('.account-control>button').click();
 await expect(page.getByRole('button',{name:'Zopakovat serverový výmaz',exact:true})).toBeVisible();
 expect(calls.every(name=>name==='delete_browser_analytics')).toBe(true);
 failing=false;await page.getByRole('button',{name:'Zopakovat serverový výmaz',exact:true}).click();
 await expect(page.getByText('Výmaz na serveru byl dokončen.',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('beyond-signal-analytics-deletions-v1')).length)).toBe(0);
});
test('withdrawal in another tab stops subsequent requests without a reload',async({page,context})=>{
 const calls=await mock(page);await page.goto('/');await page.locator('.account-control>button').click();await page.getByRole('button',{name:'Allow statistics',exact:true}).click();
 await expect.poll(()=>calls.includes('record_campaign_visit')).toBe(true);
 const other=await context.newPage();await mock(other);await other.goto('/');await other.locator('.account-control>button').click();
 await other.getByRole('button',{name:'Do not allow statistics',exact:true}).click();
 await expect(page.getByRole('button',{name:'Do not allow statistics',exact:true})).toBeDisabled();
 calls.length=0;await page.evaluate(()=>window.dispatchEvent(new Event('online')));await page.waitForTimeout(500);expect(calls).toEqual([]);
});
