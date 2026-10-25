import {test,expect} from '@playwright/test';
import {loadLocaleCatalog} from '../../src/i18n/messages.js';
import {translate} from '../../src/i18n/translate.js';
import {journeyStories} from '../../src/journeyStories.js';
import {elysiumArrivalPanels} from '../../src/elysiumArrivalStory.js';
import {riftStoryPanels} from '../../src/riftStory.js';
import {caretakerPanels} from '../../src/caretakerStory.js';
import {destinations} from '../../src/destinations.js';
test.beforeAll(async()=>{await loadLocaleCatalog('de');});
test('all chapter preview keeps ordinary saves isolated and renders German stories through level 200',async({page},info)=>{
 test.setTimeout(90000);await page.setViewportSize({width:320,height:568});const errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));await page.route(/supabase\.co|api\.country\.is/,r=>{requests.push(r.request().url());return r.fulfill({status:204,body:''});});
 const keys=['to-the-stars-progress-v1','to-the-stars-lives-v1','to-the-stars-helpers-v1:guest:0','beyond-signal-analytics-choice-v1','beyond-signal-tutorials-v1:guest'];
 await page.addInitScript(keys=>{for(const k of keys)localStorage.setItem(k,'ordinary-save-sentinel');localStorage.setItem('to-the-stars-language','cs');},keys);
 await page.goto('/tests/browser/localization-preview.html?previewLanguage=de');await expect(page.locator('.scene-top h1')).toHaveText(translate('Survey buoy','de'));
 const areas=page.getByLabel('Oblast náhledu');
 for(const scene of ['system2','elysium','rift','elysium-research','night-sanctuary','signal-station']){
  await areas.selectOption(scene);await expect(page.locator('.game')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.getByLabel('Dokončené opravy náhledu').selectOption('0');const repair=destinations['signal-station'].repairs[0];
 await page.locator(`[data-repair-id="${repair.id}"]`).click();await expect(page.locator('#bubble-story')).toHaveText(translate(repair.thought,'de'));await page.locator('.repair-bubble .close').click();
 for(const story of [{id:'arrival',panels:elysiumArrivalPanels},{id:'rift',panels:riftStoryPanels},{id:'caretaker',panels:caretakerPanels},...journeyStories]){
  await page.getByLabel('Příběh náhledu').selectOption(story.id);
  for(const panel of story.panels){
   const comic=page.locator('.caretaker-comic');await expect(comic.locator('h2')).toHaveText(translate(panel.title,'de'));await expect(comic.locator('p[aria-live]')).toHaveText(translate(panel.caption,'de'));
   const next=comic.locator('.primary');await next.scrollIntoViewIfNeeded();await expect(next).toBeInViewport();await next.click();
  }
  await expect(page.locator('.caretaker-comic')).toHaveCount(0);
 }
 await page.screenshot({path:info.outputPath('german-final-preview.png'),fullPage:true});
 for(const key of keys)expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe('ordinary-save-sentinel');
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe('cs');
 expect(requests.filter(url=>/record_balance|merge_game|country/.test(url))).toEqual([]);expect(errors).toEqual([]);
});

test('German blocked ad explains the cause and preserves the running game',async({page})=>{
 await page.setViewportSize({width:320,height:568});await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(()=>localStorage.setItem('to-the-stars-helpers-v1:guest:0','[0,0,0,0,0]'));
 await page.route('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?*',r=>r.abort());
 await page.goto('/tests/browser/fixture.html?result=performance&ads_test=google&previewLanguage=de');await expect(page.locator('.board')).toBeVisible();
 await expect(page.locator('.moves-counter span')).toHaveText('ZÜGE');
 const board=await page.locator('.board').innerHTML();await page.locator('.helper-tile').first().click();
 const ad=page.locator('.reward-ad');await expect(ad).toContainText('Der Werbedienst konnte nicht geladen werden.');await expect(ad).toContainText('Brave Shields');
 await expect(ad).toContainText('Es wurde keine Belohnung vergeben');await ad.getByRole('button',{name:'Zurück zum Spiel'}).click();
 expect(await page.locator('.board').innerHTML()).toBe(board);expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-helpers-v1:guest:0')))).toEqual([0,0,0,0,0]);
});
