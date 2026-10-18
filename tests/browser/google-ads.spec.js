import {test,expect} from '@playwright/test';
import {findMove} from '../../src/match3.js';
const sdk='**/pagead/js/adsbygoogle.js?*';
function mockSDK(outcome){return `(()=>{
 const q=window.adsbygoogle;
 function process(c){
  if(c.onReady){queueMicrotask(c.onReady);return;}
  if(c.type!=='reward')return;
  window.mockPlacement=c;window.mockCalls=(window.mockCalls||0)+1;
  if(${JSON.stringify(outcome)}==='no-fill'){c.adBreakDone({breakStatus:'noAdPreloaded'});return;}
  c.beforeReward(()=>{
   c.beforeAd();
   const button=document.createElement('button');button.id='google-test-finish';button.textContent='Finish Google mock';
   button.style='position:fixed;inset:20%;z-index:999999;background:white;color:black';document.body.append(button);
   button.onclick=()=>{button.remove();if(${JSON.stringify(outcome)}==='dismissed')c.adDismissed();else {c.adViewed();c.adViewed();}c.afterAd();c.adBreakDone({breakStatus:'viewed'});};
  });
 }
 q.push=process;for(const c of [...q])process(c);
})();`;}
test.beforeEach(async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(()=>localStorage.setItem('to-the-stars-helpers-v1:guest:0','[0,0,0,0,0]'));
});
for(const outcome of ['viewed','dismissed','no-fill','blocked','cancelled'])test(`Google test reward ${outcome}`,async({page})=>{
 let loads=0;
 await page.route(sdk,r=>{loads++;return outcome==='blocked'?r.abort():r.fulfill({contentType:'text/javascript',body:mockSDK(outcome)});});
 await page.goto('/tests/browser/fixture.html?result=performance&ads_test=google');
 await expect(page.locator('.board')).toBeVisible();expect(loads).toBe(0);
 const board=await page.locator('.board').innerHTML();
 await page.locator('.helper-tile').first().click();
 const reward=page.locator('.reward-ad');await expect(reward).toHaveAttribute('data-ad-mode','test');
 await expect(page.locator('script[data-adbreak-test="on"]')).toHaveCount(1);
 if(['viewed','dismissed'].includes(outcome)){
  await reward.locator('.primary').click();
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await page.locator('#google-test-finish').click();
  if(outcome==='viewed')await expect(reward).toHaveCount(0);
  else {await expect(reward).toContainText('No reward was granted');await reward.locator('button').last().click();}
 }else if(outcome==='cancelled'){
  await expect(reward.locator('.primary')).toBeVisible();await reward.locator('button').last().click();
  await page.evaluate(()=>{window.mockPlacement.adViewed();window.mockPlacement.adBreakDone({breakStatus:'viewed'});});
 }else {await expect(reward).toContainText('No ad is available');await reward.locator('button').last().click();}
 await expect(page.locator('.mini-dialog')).toHaveJSProperty('open',true);
 expect(await page.locator('.board').innerHTML()).toBe(board);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-helpers-v1:guest:0')))).toEqual(outcome==='viewed'?[1,0,0,0,0]:[0,0,0,0,0]);
 expect(loads).toBe(1);
});
test('Google reward continues the same exhausted board without a second energy reservation',async({page})=>{
 await page.route(sdk,r=>r.fulfill({contentType:'text/javascript',body:mockSDK('viewed')}));
 await page.goto('/tests/browser/fixture.html?result=failed&ads_test=google');
 await expect(page.locator('.board')).toBeVisible();
 const board=await page.locator('[data-cell]').evaluateAll(c=>c.map(n=>+n.dataset.type));
 for(const i of findMove(board,7))await page.locator(`[data-cell="${i}"]`).click();
 await expect(page.locator('.mini-dialog')).toContainText('Out of moves');
 const cells=await page.locator('[data-cell]').evaluateAll(nodes=>nodes.map(n=>({cell:n.dataset.cell,type:n.dataset.type})));
 await page.locator('.board').evaluate(node=>{window.beforeAdBoard=node;});
 await page.getByRole('button',{name:'Ad · +5 moves',exact:true}).click();
 await page.locator('.reward-ad .primary').click();await page.locator('#google-test-finish').click();
 await expect(page.locator('.reward-ad')).toHaveCount(0);await expect(page.locator('.board')).toBeVisible();
 expect(await page.locator('[data-cell]').evaluateAll(nodes=>nodes.map(n=>({cell:n.dataset.cell,type:n.dataset.type})))).toEqual(cells);
 expect(await page.locator('.board').evaluate(node=>node===window.beforeAdBoard)).toBe(true);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-lives-v1')).count)).toBe(4);
});
test('QA traffic cannot load the Google SDK even with the test query',async({page})=>{
 let loads=0;await page.route(sdk,r=>{loads++;return r.abort();});
 await page.goto('/tests/browser/fixture.html?result=performance&ads_test=google&utm_source=automated_test&utm_medium=bot');
 await page.locator('.helper-tile').first().click();await expect(page.locator('.reward-ad')).toContainText('TEST MODE · NO REAL AD');expect(loads).toBe(0);
});
