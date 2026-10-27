import {test,expect} from '@playwright/test';
import {normalizeProgress} from '../../src/progressStorage.js';
import {shipStages} from '../../src/chapterFlow.js';
import {levelCatalog} from '../../src/levelCatalog.js';
import {destinations} from '../../src/destinations.js';
import {asterJumpPanels} from '../../src/asterJumpStory.js';
import {loadLocaleCatalog} from '../../src/i18n/messages.js';
import {translate} from '../../src/i18n/translate.js';

const baseline=normalizeProgress({
 ...Object.fromEntries(shipStages.map(s=>[s.key,s.total])),
 finaleDone:true,launchDone:true,scannerInstalled:true,
 mineCompleted:6,iceCompleted:6,wreckCompleted:6,havenCompleted:6,jumpDone:true,buoyCompleted:3,fractureCompleted:6,verdantCompleted:6,elysiumRouteCompleted:1,elysiumArrival:1,
 stars:Object.fromEntries(levelCatalog.slice(0,69).map(r=>[r.id,3]))
});
test.beforeAll(async()=>{await loadLocaleCatalog('es');});
async function prepare(page,{jumpDone=true,progress=baseline}={}){
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(({baseline,jumpDone})=>{
  const scene=new URL(location.href).searchParams.get('qa-scene')??'haven';
  localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({...baseline,jumpDone,scene}));
  localStorage.setItem('to-the-stars-language','cs');
  localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));
 },{baseline:progress,jumpDone});
 return errors;
}
async function enter(page,scene){
 await page.goto('/?previewLanguage=es&qa-scene='+scene);
 await page.locator('button.welcome-secondary').click();await page.locator('.chapters-dialog>.close').click();
}

for(const width of [320,430])for(const scene of ['mine','ice','wreck','haven','buoy','fracture','verdant']){
 test(`Spanish ${scene} completed repairs remain named and replayable at ${width}px`,async({page},info)=>{
  await page.setViewportSize({width,height:width===320?568:900});const errors=await prepare(page);
  await enter(page,scene);const site=destinations[scene];
  await expect(page.locator('.scene-top h1')).toHaveText(translate(site.title,'es'));
  await expect(page.locator('.scene-repairs .replay-level')).toHaveCount(site.repairs.length);
  const clipped=await page.locator('.scene-repairs .hotspot-label').evaluateAll(labels=>labels.map(label=>{const r=label.getBoundingClientRect();return{text:label.textContent,left:r.left,right:r.right};}).filter(r=>r.left<0||r.right>innerWidth+1));
  for(const repair of site.repairs){
   const point=page.locator(`[data-repair-id="${repair.id}"]`);
   await point.scrollIntoViewIfNeeded();await expect(point.locator('.hotspot-label')).toContainText(translate(repair.name,'es'));
   await expect(point.locator('.rating-stars')).toHaveAttribute('aria-label','3 de 3 estrellas');
   expect(await point.evaluate(button=>{const r=button.querySelector('.target').getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===button;})).toBe(true);
   await point.locator('.target').click();await expect(page.locator('#bubble-title')).toHaveText(translate(repair.name,'es'));
   await expect(page.locator('.repair-bubble .primary')).toContainText('Repetir lección');
   await page.locator('.repair-bubble .close').click();
  }
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')));
  expect(saved[site.key]).toBe(site.repairs.length);for(const repair of site.repairs)expect(saved.stars[repair.id]).toBe(3);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
  expect(clipped).toEqual([]);
  await page.screenshot({path:info.outputPath(scene+'.png')});
 });
}
