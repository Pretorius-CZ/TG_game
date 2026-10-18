import {test,expect} from '@playwright/test';
import {mockSDK} from './googleAdsMock.js';
const sdk='**/pagead/js/adsbygoogle.js?*';
test.beforeEach(async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(()=>localStorage.setItem('to-the-stars-helpers-v1:guest:0','[0,0,0,0,0]'));
});
for(const choice of ['granted','denied'])test(`first CMP choice ${choice} preserves the attempt`,async({page})=>{
 await page.route(sdk,r=>r.fulfill({contentType:'text/javascript',body:mockSDK('viewed',{consent:'prompt'})}));
 await page.goto('/tests/browser/fixture.html?result=performance&ads_test=google');
 await expect(page.locator('.board')).toBeVisible();const board=await page.locator('.board').innerHTML();
 await page.locator('.helper-tile').first().click();
 await expect(page.locator('#google-cmp-test')).toBeVisible();await expect(page.locator('dialog[open]')).toHaveCount(0);
 expect(await page.locator('#root').evaluate(node=>node.inert)).toBe(true);
 expect(await page.evaluate(()=>window.mockCalls||0)).toBe(0);
 await page.getByRole('button',{name:choice==='granted'?'Accept CMP':'Reject CMP'}).click();
 const reward=page.locator('.reward-ad');await expect(reward).toBeVisible();
 expect(await page.locator('#root').evaluate(node=>node.inert)).toBe(false);
 if(choice==='granted'){
  await reward.locator('.primary').click();await page.locator('#google-test-finish').click();
  await expect(reward).toHaveCount(0);
 }else{
  await expect(reward).toContainText('Your privacy choices');expect(await page.evaluate(()=>window.mockCalls||0)).toBe(0);
  await reward.getByRole('button',{name:'Back to game'}).click();
 }
 expect(await page.locator('.board').innerHTML()).toBe(board);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-helpers-v1:guest:0')))).toEqual(choice==='granted'?[1,0,0,0,0]:[0,0,0,0,0]);
});
test('saved consent can be revoked from settings without resetting progress',async({page})=>{
 await page.route(sdk,r=>r.fulfill({contentType:'text/javascript',body:mockSDK('viewed',{consent:'granted'})}));
 await page.goto('/?ads_test=google');await expect(page.locator('.welcome-play')).toBeVisible();
 await page.locator('.account-control>button').click();
 await page.getByRole('button',{name:'Advertising privacy choices',exact:true}).click();
 await page.getByRole('button',{name:'Reject CMP'}).click();
 await expect(page.locator('.ad-choices-control')).toContainText('Google received your advertising choices');
 await page.locator('.account-close').click();
 await page.locator('.welcome-play').click();await page.locator('.intro-skip').click();await page.locator('.repair-bubble-dialog .primary').click();
 await page.locator('.helper-tile').first().click();await expect(page.locator('.reward-ad')).toContainText('Your privacy choices');
 expect(await page.evaluate(()=>window.mockCalls||0)).toBe(0);
});
test('a footer choice loads CMP only after a click and can be changed again',async({page})=>{
 let loads=0;await page.route(sdk,r=>{loads++;return r.fulfill({contentType:'text/javascript',body:mockSDK('viewed',{consent:'granted'})});});
 await page.goto('/privacy.html');expect(loads).toBe(0);
 await page.locator('.privacy-choices').click();await page.getByRole('button',{name:'Reject CMP'}).click();
 await expect(page.locator('.privacy-choice-status')).toContainText('Google received');
 await page.locator('[data-language=cs]').click();await expect(page.locator('.privacy-choices')).toHaveText('Reklamní souhlasy');
 await page.locator('.privacy-choices').click();await page.getByRole('button',{name:'Accept CMP'}).click();
 await expect(page.locator('.privacy-choice-status')).toContainText('přijaty Googlem');expect(loads).toBe(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});
