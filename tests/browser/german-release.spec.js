import{test,expect}from'@playwright/test';
import{findMove}from'../../src/match3.js';
import{mockSDK}from'./googleAdsMock.js';
test.beforeEach(async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(()=>localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()})));
});
test('released German opens directly, survives reload and keeps existing progress',async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.addInitScript(()=>{if(!localStorage.getItem('to-the-stars-progress-v1'))localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,airlockCompleted:2,scene:'airlock'}));});
 await page.goto('/?lang=de');await expect(page.locator('html')).toHaveAttribute('lang','de');
 await expect(page.locator('.welcome-play')).toHaveText('Weiter');
 await expect(page.locator('.welcome-settings select')).toHaveValue('de');
 await expect(page.locator('.welcome-settings select option')).toHaveCount(3);
 const before=await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1'));
 await page.reload();await expect(page.locator('.welcome-play')).toHaveText('Weiter');
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1'))).toBe(before);
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe('de');
});
test('public language switch preserves every tile position, move, objective and energy',async({page})=>{
 await page.setViewportSize({width:320,height:568});await page.goto('/tests/browser/i18n-fixture.html?lang=de');
 await expect(page.locator('.moves-counter span')).toHaveText('ZÜGE');
 const state=()=>page.evaluate(()=>({cells:[...document.querySelectorAll('[data-cell]')].map(c=>{const r=c.getBoundingClientRect();return{index:c.dataset.cell,type:c.dataset.type,x:r.x,y:r.y,w:r.width,h:r.height};}),moves:document.querySelector('.moves-counter strong').textContent,goals:[...document.querySelectorAll('.objective-list progress')].map(p=>[p.value,p.max]),energy:localStorage.getItem('to-the-stars-lives-v1')}));
 const before=await state();for(const i of findMove(before.cells.map(c=>+c.type),7))await page.locator(`[data-cell="${i}"]`).click();
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');const played=await state();
 for(const [code,label]of[['cs','TAHY'],['en','MOVES'],['de','ZÜGE']]){
  await page.locator('.test-language-control select').selectOption(code);await expect(page.locator('.moves-counter span')).toHaveText(label);
  expect(await state()).toEqual(played);
 }
});

test('blind test offers a German board without touching ordinary progress',async({page})=>{
 await page.goto('/playtest.html?run=german-release-qa');
 await page.getByRole('button',{name:'DE',exact:true}).click();
 await expect(page.locator('html')).toHaveAttribute('lang','de');
 await page.getByRole('button',{name:'Povolit sběr a zahájit test',exact:true}).click();
 await expect(page.locator('.moves-counter span')).toHaveText('ZÜGE');
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1'))).toBeNull();
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBeNull();
});

test('German Undo explanation fits and keeps the move until explicit confirmation',async({page},info)=>{
 await page.setViewportSize({width:320,height:568});
 await page.route('**/pagead/js/adsbygoogle.js?*',r=>r.fulfill({contentType:'text/javascript',body:mockSDK('viewed')}));
 await page.goto('/tests/browser/fixture.html?result=performance&ads_test=google&lang=de');
 await expect(page.locator('.moves-counter span')).toHaveText('ZÜGE');
 const board=()=>page.locator('[data-cell]').evaluateAll(cells=>cells.map(c=>+c.dataset.type));const before=await board();
 for(const i of findMove(before,7))await page.locator(`[data-cell="${i}"]`).click();
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');const after=await board();
 await page.locator('.undo-control').click();const ad=page.locator('.reward-ad');
 await expect(ad).toContainText('Rückgängig-Funktion');await expect(ad.locator('.primary')).toBeInViewport();
 await page.screenshot({path:info.outputPath('german-undo.png')});
 await ad.locator('.primary').click();await page.locator('#google-test-finish').click();await expect(ad).toHaveCount(0);
 expect(await board()).toEqual(after);await expect(page.locator('.undo-notice')).toContainText('markierte Zurück-Taste');
 await page.locator('.undo-control').click();expect(await board()).toEqual(before);
});
