import {test,expect} from '@playwright/test';
import {normalizeProgress} from '../../src/progressStorage.js';
import {signalDestinations,signalScenes} from '../../src/signalNetwork.js';
import {journeyStories} from '../../src/journeyStories.js';
import {translate} from '../../src/i18n/translate.js';
import {iceMove} from '../../src/levelRules.js';
const baseline=()=>{const raw=Object.fromEntries(Object.keys(normalizeProgress()).filter(k=>k==='completed'||k.endsWith('Completed')).map(k=>[k,6]));return normalizeProgress({...raw,...Object.fromEntries(Object.values(signalDestinations).map(s=>[s.key,0])),elysiumRouteCompleted:1,elysiumArrival:1,riftCrossed:1,caretakerMet:1,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,scene:'archive-core'});};
async function story(page,id,language){const s=journeyStories.find(s=>s.id===id),dialog=page.getByRole('dialog',{name:translate(s.title,language),exact:true});await expect(dialog).toBeVisible();for(let i=0;i<s.panels.length;i++){await expect(dialog.locator('.comic-caption h2')).toHaveText(translate(s.panels[i].title,language));await dialog.locator('.primary').click();}await expect(dialog).toHaveCount(0);}
for(const language of ['en','cs'])test(`all thirteen tasks, three stories, level200 and reload ${language}`,async({page})=>{
 await page.setViewportSize({width:language==='cs'?320:430,height:language==='cs'?568:739});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().includes('/scenes/signal-')&&r.status()>=400)errors.push('Missing art');});
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(({progress,language,seen})=>{
  if(!sessionStorage.getItem('signal-test-seeded')){localStorage.setItem('to-the-stars-progress-v1',JSON.stringify(progress));for(const id of seen)localStorage.setItem('beyond-the-signal-story:guest:0:'+id,'seen');sessionStorage.setItem('signal-test-seeded','1');}
  localStorage.setItem('to-the-stars-language',language);localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));
 },{progress:baseline(),language,seen:journeyStories.filter(s=>s.chapter!=='signal').map(s=>s.id)});
 await page.goto('/');await page.locator('.welcome-play').click();await story(page,'signal-departure',language);
 for(const scene of signalScenes){const site=signalDestinations[scene];
  if(scene==='signal-station')await story(page,'signal-arrival',language);
  for(const [i,repair]of site.repairs.entries()){
   await expect(page.locator('#bubble-title')).toHaveText(translate(repair.name,language));
   await page.locator('.repair-bubble-dialog .close').click();
   const hotspot=page.locator('.signal-site .hotspot:not(.completed-hotspot)');
   const box=await hotspot.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(language==='cs'?320:430);
   await hotspot.click();await expect(page.locator('#bubble-title')).toHaveText(translate(repair.name,language));
   await page.locator('.repair-bubble-dialog .preview-complete').click();
   await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1'))[key],site.key)).toBe(i+1);
   if(scene==='signal-station'&&i===3)await story(page,'signal-delivered-200',language);
   await page.locator('.repair-reveal .primary').click();
  }
 }
 await expect(page.locator('.scene-top')).toContainText('200');
 expect(await page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).stars).length)).toBe(200);
 await page.getByRole('button',{name:language==='cs'?'Přehrát závěr příběhu':'Replay the story ending',exact:true}).click();
 await story(page,'signal-delivered-200',language);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).signalStationCompleted)).toBe(4);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`.local/signal-ending-${language}-${test.info().project.name}.png`});
 await page.reload();await page.locator('.welcome-play').click();await expect(page.locator('.scene-top')).toContainText('200');await expect(page.locator('.caretaker-comic')).toHaveCount(0);expect(errors).toEqual([]);
});
test('each new board renders and accepts a legal move at phone size',async({page})=>{
 await page.setViewportSize({width:320,height:568});await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 // Each navigation abandons a moved attempt and correctly costs energy.
 // Refill only this isolated fixture so all thirteen render checks can run.
 await page.addInitScript(()=>localStorage.setItem('to-the-stars-lives-v1',JSON.stringify({count:5,nextAt:null})));
 for(const site of Object.values(signalDestinations))for(const repair of site.repairs){
  await page.goto('/tests/browser/fixture.html?id='+repair.id);await expect(page.locator('.board')).toBeVisible();
  const board=await page.locator('[data-cell]').evaluateAll((nodes,size)=>{const cells=Array(size).fill(null);for(const n of nodes)cells[+n.dataset.cell]=+n.dataset.type;return cells;},repair.level.cols*repair.level.rows);
  const move=iceMove(board,repair.level.cols,repair.ice);expect(move).toBeTruthy();
  for(const i of move)await page.locator(`[data-cell="${i}"]`).click();
  await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
