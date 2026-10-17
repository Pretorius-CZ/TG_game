import {test,expect} from '@playwright/test';
import {normalizeProgress} from '../../src/progressStorage.js';
import {archiveDestinations} from '../../src/archive.js';
import {journeyStories} from '../../src/journeyStories.js';
import {translate} from '../../src/i18n/translate.js';

for(const language of ['en','cs'])test(`ship log does not interrupt levels 168 to 169 ${language}`,async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 const counts=Object.fromEntries(Object.entries(normalizeProgress()).filter(([key])=>key==='completed'||key.endsWith('Completed')||['riftCrossed','elysiumArrival','caretakerMet'].includes(key)).map(([key])=>[key,99]));
 const progress=normalizeProgress({...counts,...Object.fromEntries(Object.values(archiveDestinations).map(d=>[d.key,0])),completed:4,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,scene:'archive-entry'});
 await page.addInitScript(({progress,stories,language})=>{
  localStorage.setItem('to-the-stars-progress-v1',JSON.stringify(progress));localStorage.setItem('to-the-stars-language',language);
  for(const story of stories)localStorage.setItem(`beyond-the-signal-story:guest:0:${story}`,'seen');
 },{progress,stories:journeyStories.map(s=>s.id),language});
 await page.goto('/');await page.locator('.welcome-play').click();
 await expect(page.locator('#bubble-title')).toHaveText(translate(archiveDestinations['archive-entry'].repairs[0].name,language));
 await page.locator('.repair-bubble-dialog .preview-complete').click();
 await page.locator('.repair-reveal .new-log').click();
 await expect(page.locator('.ship-log article')).toBeVisible();
 await page.locator('.ship-log .all-repairs').click();await page.locator('.ship-log .close').click();
 await page.locator('.repair-reveal .primary').click();
 await page.locator('.journey-guide summary').click();await page.locator('.journey-panel button').click();
 await expect(page.locator('#bubble-title')).toHaveText(translate(archiveDestinations['archive-entry'].repairs[1].name,language));
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).archiveEntryCompleted)).toBe(1);
});
