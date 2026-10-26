import {test,expect} from '@playwright/test';
import {loadLocaleCatalog} from '../../src/i18n/messages.js';
import {translate} from '../../src/i18n/translate.js';
import {journeyStories} from '../../src/journeyStories.js';
import {elysiumArrivalPanels} from '../../src/elysiumArrivalStory.js';
import {riftStoryPanels} from '../../src/riftStory.js';
import {echoDeparturePanels} from '../../src/echoDepartureStory.js';
import {researchStoryPanels} from '../../src/researchStory.js';
import {relayStoryPanels} from '../../src/relayStory.js';
import {caretakerPanels} from '../../src/caretakerStory.js';
import {destinations} from '../../src/destinations.js';
test.beforeAll(async()=>{await loadLocaleCatalog('fr');});
test('all chapter preview keeps ordinary saves isolated and renders French stories through chapter 8',async({page},info)=>{
 test.setTimeout(90000);await page.setViewportSize({width:320,height:568});const errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));await page.route(/supabase\.co|api\.country\.is/,r=>{requests.push(r.request().url());return r.fulfill({status:204,body:''});});
 const keys=['to-the-stars-progress-v1','to-the-stars-lives-v1','to-the-stars-helpers-v1:guest:0','beyond-signal-analytics-choice-v1','beyond-signal-tutorials-v1:guest'];
 await page.addInitScript(keys=>{for(const k of keys)localStorage.setItem(k,'ordinary-save-sentinel');localStorage.setItem('to-the-stars-language','cs');},keys);
 await page.goto('/tests/browser/localization-preview.html?previewLanguage=fr');await expect(page.locator('.scene-top h1')).toHaveText(translate('Survey buoy','fr'));
 const areas=page.getByLabel('Oblast náhledu');
 for(const scene of ['system2','elysium','rift','elysium-research','night-sanctuary','refuge-arrival']){
  await areas.selectOption(scene);await expect(page.locator('.game')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.getByLabel('Dokončené opravy náhledu').selectOption('0');const repair=destinations['refuge-arrival'].repairs[0];
 await page.locator(`[data-repair-id="${repair.id}"]`).click();await expect(page.locator('#bubble-story')).toHaveText(translate(repair.thought,'fr'));await page.locator('.repair-bubble .close').click();
 for(const story of [{id:'arrival',panels:elysiumArrivalPanels},{id:'rift',panels:riftStoryPanels},{id:'caretaker',panels:caretakerPanels},{id:'echo',panels:echoDeparturePanels},{id:'research',panels:researchStoryPanels},{id:'relay',panels:relayStoryPanels},...journeyStories.filter(s=>s.chapter==='refuge')]){
  await page.getByLabel('Příběh náhledu').selectOption(story.id);
  for(const panel of story.panels){
   const comic=page.locator('.caretaker-comic');await expect(comic.locator('h2')).toHaveText(translate(panel.title,'fr'));await expect(comic.locator('p[aria-live]')).toHaveText(translate(panel.caption,'fr'));
   const next=comic.locator('.primary');await next.scrollIntoViewIfNeeded();await expect(next).toBeInViewport();await next.click();
  }
  await expect(page.locator('.caretaker-comic')).toHaveCount(0);
 }
 await page.screenshot({path:info.outputPath('french-chapter-eight-preview.png'),fullPage:true});
 for(const key of keys)expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe('ordinary-save-sentinel');
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe('cs');
 expect(requests.filter(url=>/record_balance|merge_game|country/.test(url))).toEqual([]);expect(errors).toEqual([]);
});
