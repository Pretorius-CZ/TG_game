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
 mineCompleted:6,iceCompleted:6,wreckCompleted:6,havenCompleted:6,jumpDone:true,
 stars:Object.fromEntries(levelCatalog.slice(0,53).map(r=>[r.id,3]))
});
test.beforeAll(async()=>{await loadLocaleCatalog('de');});
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
 await page.goto('/?previewLanguage=de&qa-scene='+scene);
 await page.locator('button.welcome-secondary').click();await page.locator('.chapters-dialog>.close').click();
}

for(const width of [320,430,1024])for(const scene of ['mine','ice','wreck','haven']){
 test(`German ${scene} completed repairs remain named and replayable at ${width}px`,async({page},info)=>{
  await page.setViewportSize({width,height:width===320?568:900});const errors=await prepare(page);
  await enter(page,scene);const site=destinations[scene];
  await expect(page.locator('.scene-top h1')).toHaveText(translate(site.title,'de'));
  await expect(page.locator('.completed-repairs-grid .replay-level')).toHaveCount(6);
  for(const repair of site.repairs){
   const point=page.locator(`[data-repair-id="${repair.id}"]`);
   await point.scrollIntoViewIfNeeded();await expect(point.locator('.hotspot-label')).toContainText(translate(repair.name,'de'));
   await expect(point.locator('.rating-stars')).toHaveAttribute('aria-label','3 von 3 Sternen');
   expect(await point.evaluate(button=>{const r=button.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===button;})).toBe(true);
   await point.click();await expect(page.locator('#bubble-title')).toHaveText(translate(repair.name,'de'));
   await expect(page.locator('.repair-bubble .primary')).toContainText('Reparatur erneut spielen');
   await page.locator('.repair-bubble .close').click();
  }
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')));
  expect(saved[site.key]).toBe(6);for(const repair of site.repairs)expect(saved.stars[repair.id]).toBe(3);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
  await page.screenshot({path:info.outputPath(scene+'.png')});
 });
}

test('German gate cancellation, first crossing and three arrival panels keep their normal progression',async({page})=>{
 await page.setViewportSize({width:430,height:932});await page.emulateMedia({reducedMotion:'no-preference'});
 const errors=await prepare(page,{jumpDone:false});await enter(page,'haven');
 await page.locator('[data-journey-action="gate"]').click();await expect(page.locator('.transit-dialog')).toBeVisible();
 await expect(page.locator('.transit-dialog h2')).toHaveText('Sprungfeld wird geladen');
 await page.locator('.transit-dialog .keep-playing').click();await expect(page.locator('.transit-dialog')).toHaveCount(0);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).jumpDone)).toBe(false);
 await page.locator('[data-journey-action="gate"]').click();await page.locator('.transit-dialog .primary').click();
 const story=page.locator('.caretaker-comic');
 for(const panel of asterJumpPanels){
  await expect(story.locator('h2')).toHaveText(translate(panel.title,'de'));
  await expect(story.locator('.comic-caption p').first()).toHaveText(translate(panel.caption,'de'));
  await story.locator('.primary').click();
 }
 await expect(story).toHaveCount(0);await expect(page.locator('.compact-aster')).toBeVisible();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')));
 expect(saved.jumpDone).toBe(true);expect(saved.scene).toBe('system2');expect(saved.havenCompleted).toBe(6);
 expect(errors).toEqual([]);
});

test('German scanner activation unlocks both expedition choices without changing repairs',async({page})=>{
 const progress=normalizeProgress({...baseline,iceCompleted:0,wreckCompleted:0,havenCompleted:0,scannerInstalled:false,jumpDone:false,scene:'system'});
 const errors=await prepare(page,{progress,jumpDone:false});await enter(page,'system');
 const scanner=page.locator('[data-node="scanner"]'),ice=page.locator('[data-node="ice"]'),wreck=page.locator('[data-node="wreck"]');
 await expect(scanner).toContainText('Scanner aktivieren');await expect(scanner).toBeEnabled();
 await expect(ice).toBeDisabled();await expect(wreck).toBeDisabled();
 await expect(page.locator('.chart-status')).toContainText('Ladung gesichert');
 await scanner.click();await expect(ice).toBeEnabled();await expect(wreck).toBeEnabled();
 await expect(page.locator('.chart-status')).toHaveText('Scanner online. Relaisstation und Archiv sind erreichbar.');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')));
 expect(saved.scannerInstalled).toBe(true);expect(saved.mineCompleted).toBe(6);expect(saved.iceCompleted).toBe(0);expect(saved.wreckCompleted).toBe(0);
 await ice.click();await expect(page.locator('.scene-top h1')).toHaveText('Vereiste Relaisstation');expect(errors).toEqual([]);
});

test('chapter-two review preview isolates progress, stock, tutorials and results from normal gameplay',async({page})=>{
 const ordinary=['to-the-stars-progress-v1','to-the-stars-lives-v1','to-the-stars-helpers-v1:guest:0','beyond-signal-analytics-choice-v1','beyond-signal-tutorials-v1:guest'];
 await page.addInitScript(keys=>{for(const key of keys)localStorage.setItem(key,'ordinary-save-sentinel');localStorage.setItem('to-the-stars-language','cs');},ordinary);
 const sent=[];await page.route(/supabase\.co|api\.country\.is/,r=>{sent.push(r.request().url());return r.fulfill({status:204,body:''});});
 await page.goto('/tests/browser/chapter-two-preview.html?previewLanguage=de');
 await expect(page.locator('.scene-top h1')).toHaveText('Die stille Mine');
 const areas=page.getByLabel('Oblast náhledu');
 await areas.selectOption('ice');await expect(page.locator('.scene-top h1')).toHaveText('Vereiste Relaisstation');
 await page.getByLabel('Dokončené opravy náhledu').selectOption('0');
 await page.locator('[data-repair-id="ice-beacons"]').click();
 await expect(page.locator('#bubble-story')).toHaveText(translate(destinations.ice.repairs[0].thought,'de'));
 await page.locator('.repair-bubble .close').click();
 await page.getByRole('button',{name:'Deník',exact:true}).click();
 await expect(page.locator('.ship-log')).toBeVisible();await page.locator('.ship-log .close').click();
 for(const key of ordinary)expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe('ordinary-save-sentinel');
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe('cs');
 expect(sent.filter(url=>/record_balance|merge_game|country/.test(url))).toEqual([]);
});
