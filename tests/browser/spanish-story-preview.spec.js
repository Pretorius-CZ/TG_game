import{test,expect}from'@playwright/test';
import{shipStages}from'../../src/chapterFlow.js';
import{departurePanels}from'../../src/departureStory.js';
import{asterJumpPanels}from'../../src/asterJumpStory.js';
import{elysiumArrivalPanels}from'../../src/elysiumArrivalStory.js';
import{loadLocaleCatalog}from'../../src/i18n/messages.js';
import{translate}from'../../src/i18n/translate.js';
test.beforeAll(async()=>{await loadLocaleCatalog('es');});
test.beforeEach(async({page})=>{await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));});

test('Spanish jump and Elysium arrival panels stay isolated from ordinary progress',async({page},info)=>{
 await page.setViewportSize({width:320,height:568});
 const keys=['to-the-stars-progress-v1','to-the-stars-lives-v1','to-the-stars-helpers-v1:guest:0','beyond-signal-analytics-choice-v1','beyond-signal-tutorials-v1:guest'];
 await page.addInitScript(keys=>{for(const k of keys)localStorage.setItem(k,'ordinary-save-sentinel');localStorage.setItem('to-the-stars-language','cs');},keys);
 await page.goto('/tests/browser/localization-preview.html?previewLanguage=es');
 await expect(page.locator('.scene-top h1')).toHaveText('Boya de exploración');
 for(const[id,panels]of[['jump',asterJumpPanels],['arrival',elysiumArrivalPanels]]){
  await page.getByLabel('Příběh náhledu').selectOption(id);
  for(const panel of panels){
   const comic=page.locator('.caretaker-comic');await expect(comic.locator('h2')).toHaveText(translate(panel.title,'es'));
   await expect(comic.locator('p[aria-live]')).toHaveText(translate(panel.caption,'es'));
   await comic.locator('.primary').scrollIntoViewIfNeeded();await expect(comic.locator('.primary')).toBeInViewport();await comic.locator('.primary').click();
  }
 }
 await page.screenshot({path:info.outputPath('spanish-story-preview.png'),fullPage:true});
 for(const key of keys)expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe('ordinary-save-sentinel');
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe('cs');
});

for(const width of[320,430])test(`Spanish departure opens the first expedition with its story at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:width===320?568:932});
 const progress={version:1,...Object.fromEntries(shipStages.map(s=>[s.key,s.total])),finaleDone:true,scene:'exterior'};
 await page.addInitScript(progress=>{localStorage.setItem('to-the-stars-progress-v1',JSON.stringify(progress));localStorage.setItem('to-the-stars-language','cs');localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));},progress);
 await page.goto('/?previewLanguage=es');await page.locator('button.welcome-secondary').click();await page.locator('.chapters-dialog>.close').click();
 await page.locator('.launch-control').click();await page.locator('.departure-controls .primary').click();
 for(const panel of departurePanels){const comic=page.locator('.caretaker-comic');await expect(comic.locator('h2')).toHaveText(translate(panel.title,'es'));await expect(comic.locator('p[aria-live]')).toHaveText(translate(panel.caption,'es'));await comic.locator('.primary').click();}
 await page.locator('[data-node="mine"]').click();await page.locator('[data-repair-id] .target').first().click();
 await expect(page.locator('#bubble-title')).toHaveText('Balizas de aterrizaje');await page.locator('.repair-bubble .primary').click();
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
 const p=await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')));expect(p.launchDone).toBe(true);expect(p.mineCompleted).toBe(0);
});
