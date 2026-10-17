import {test,expect} from '@playwright/test';
import {normalizeProgress} from '../../src/progressStorage.js';
import {journeyStories} from '../../src/journeyStories.js';

for(const [room,key] of [['airlock','airlockCompleted'],['cockpit','completed'],['crew','crewCompleted'],['galley','galleyCompleted'],['engine','engineCompleted'],['navigation','navigationCompleted'],['exterior','exteriorCompleted']]){
 test(`current and repaired artwork in ${room}`,async({page},testInfo)=>{
  await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
  const progress=normalizeProgress({completed:4,airlockCompleted:3,crewCompleted:4,galleyCompleted:4,engineCompleted:5,navigationCompleted:4,exteriorCompleted:4,[key]:0,scene:room});
  await page.addInitScript(({progress,stories})=>{
   localStorage.setItem('to-the-stars-progress-v1',JSON.stringify(progress));
   for(const story of stories)localStorage.setItem(`beyond-the-signal-story:guest:0:${story}`,'seen');
  },{progress,stories:journeyStories.map(s=>s.id)});
  await page.goto('/');await page.locator('.welcome-play').click();
  await expect(page.locator('.repair-bubble-dialog')).toBeVisible();
  await page.locator('.repair-bubble-dialog .preview-complete').click();
  await expect(page.locator('.game .loading')).toHaveCount(0);
  await expect(page.locator('.repair-reveal')).toBeVisible();
  await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1'))[key],key)).toBe(1);
  const images=await page.locator('.game .scene-image').evaluateAll(images=>Promise.all(images.map(async image=>{await image.decode();return image.getAttribute('src');})));
  expect(images.length).toBeGreaterThan(0);
  if(room==='exterior')expect(images).toContain('./scenes/exterior-hull.webp');
  else expect(images).toHaveLength(1);
  await page.screenshot({path:testInfo.outputPath('repaired-room.png')});
 });
}
