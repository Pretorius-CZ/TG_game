import{test,expect}from'@playwright/test';
import{shipStages}from'../../src/chapterFlow.js';
import{departurePanels}from'../../src/departureStory.js';
import{asterJumpPanels}from'../../src/asterJumpStory.js';
import{elysiumArrivalPanels}from'../../src/elysiumArrivalStory.js';
import{echoDeparturePanels}from'../../src/echoDepartureStory.js';
import{riftStoryPanels}from'../../src/riftStory.js';
import{researchStoryPanels}from'../../src/researchStory.js';
import{relayStoryPanels}from'../../src/relayStory.js';
import{caretakerPanels}from'../../src/caretakerStory.js';
import{journeyStories}from'../../src/journeyStories.js';
import{normalizeProgress}from'../../src/progressStorage.js';
import{levelCatalog}from'../../src/levelCatalog.js';
import{loadLocaleCatalog}from'../../src/i18n/messages.js';
import{translate}from'../../src/i18n/translate.js';
test.beforeAll(async()=>{await loadLocaleCatalog("pt-BR");});
test.beforeEach(async({page})=>{await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));});

test('Brazilian Portuguese transition panels through chapter 10 stay isolated from ordinary progress',async({page},info)=>{
 await page.setViewportSize({width:320,height:568});
 const keys=['to-the-stars-progress-v1','to-the-stars-lives-v1','to-the-stars-helpers-v1:guest:0','beyond-signal-analytics-choice-v1','beyond-signal-tutorials-v1:guest'];
 await page.addInitScript(keys=>{for(const k of keys)localStorage.setItem(k,'ordinary-save-sentinel');localStorage.setItem('to-the-stars-language','cs');},keys);
 await page.goto('/tests/browser/localization-preview.html?previewLanguage=pt-BR');
 await expect(page.locator('.scene-top h1')).toHaveText("Boia de exploração");
 for(const[id,panels]of[['jump',asterJumpPanels],['arrival',elysiumArrivalPanels],['echo',echoDeparturePanels],['rift',riftStoryPanels],['research',researchStoryPanels],['relay',relayStoryPanels],['caretaker',caretakerPanels],...journeyStories.map(s=>[s.id,s.panels])]){
  await page.getByLabel('Příběh náhledu').selectOption(id);
  for(const panel of panels){
   const comic=page.locator('.caretaker-comic');await expect(comic.locator('h2')).toHaveText(translate(panel.title,"pt-BR"));
   await expect(comic.locator('p[aria-live]')).toHaveText(translate(panel.caption,"pt-BR"));
   await comic.locator('.primary').scrollIntoViewIfNeeded();await expect(comic.locator('.primary')).toBeInViewport();await comic.locator('.primary').click();
  }
 }
 await page.screenshot({path:info.outputPath('portuguese-story-preview.png'),fullPage:true});
 for(const key of keys)expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe('ordinary-save-sentinel');
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe('cs');
});

test('Brazilian Portuguese Rift story and transit open the living garden without changing completed repairs',async({page})=>{
 await page.setViewportSize({width:320,height:568});
 const progress=normalizeProgress({...Object.fromEntries(shipStages.map(s=>[s.key,s.total])),finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,mineCompleted:6,iceCompleted:6,wreckCompleted:6,havenCompleted:6,buoyCompleted:3,fractureCompleted:6,verdantCompleted:6,elysiumRouteCompleted:1,elysiumArrival:1,elysiumDockCompleted:4,elysiumCoreCompleted:4,elysiumRingCompleted:4,elysiumHomesCompleted:4,elysiumGardenCompleted:4,elysiumObservatoryCompleted:4,riftEchoCompleted:4,riftPlatformCompleted:4,riftBeaconsCompleted:4,riftCrossed:0,scene:'rift',stars:Object.fromEntries(levelCatalog.slice(0,105).map(r=>[r.id,3]))});
 await page.addInitScript(progress=>{localStorage.setItem('to-the-stars-progress-v1',JSON.stringify(progress));localStorage.setItem('to-the-stars-language','cs');localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));localStorage.setItem('beyond-the-signal-story:guest:0:elysium-departure','seen');},progress);
 await page.goto('/?previewLanguage=pt-BR');await page.locator('button.welcome-secondary').click();await page.locator('.chapters-dialog>.close').click();
 await page.locator('[data-journey-action="cross"]').click();
 for(const panel of riftStoryPanels){const comic=page.locator('.caretaker-comic');await expect(comic.locator('h2')).toHaveText(translate(panel.title,"pt-BR"));await comic.locator('.primary').click();}
 await expect(page.locator('.rift-transit-dialog')).toBeVisible();await expect(page.locator('.rift-transit-dialog h2')).toHaveText("Além do céu conhecido");
 await page.locator('.rift-transit-dialog .primary').click();await expect(page.locator('.expedition')).toBeVisible();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')));
 expect(saved.riftCrossed).toBe(1);expect(saved.scene).toBe('beyond-rift');expect(saved.riftBeaconsCompleted).toBe(4);expect(saved.stars).toEqual(progress.stars);
});

for(const width of[320,430])test(`Brazilian Portuguese departure opens the first expedition with its story at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:width===320?568:932});
 const progress={version:1,...Object.fromEntries(shipStages.map(s=>[s.key,s.total])),finaleDone:true,scene:'exterior'};
 await page.addInitScript(progress=>{localStorage.setItem('to-the-stars-progress-v1',JSON.stringify(progress));localStorage.setItem('to-the-stars-language','cs');localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));},progress);
 await page.goto('/?previewLanguage=pt-BR');await page.locator('button.welcome-secondary').click();await page.locator('.chapters-dialog>.close').click();
 await page.locator('.launch-control').click();await page.locator('.departure-controls .primary').click();
 for(const panel of departurePanels){const comic=page.locator('.caretaker-comic');await expect(comic.locator('h2')).toHaveText(translate(panel.title,"pt-BR"));await expect(comic.locator('p[aria-live]')).toHaveText(translate(panel.caption,"pt-BR"));await comic.locator('.primary').click();}
 await page.locator('[data-node="mine"]').click();await page.locator('[data-repair-id] .target').first().click();
 await expect(page.locator('#bubble-title')).toHaveText("Faróis de pouso");await page.locator('.repair-bubble .primary').click();
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
 const p=await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')));expect(p.launchDone).toBe(true);expect(p.mineCompleted).toBe(0);
});
