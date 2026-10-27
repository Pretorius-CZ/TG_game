import{test,expect}from'@playwright/test';
import{shipStages}from'../../src/chapterFlow.js';
import{normalizeProgress}from'../../src/progressStorage.js';
import{destinations}from'../../src/destinations.js';
import{loadLocaleCatalog,message}from'../../src/i18n/messages.js';
import{translate}from'../../src/i18n/translate.js';

test.beforeAll(async()=>{await loadLocaleCatalog('fr');});
const ship=Object.fromEntries(shipStages.map(s=>[s.key,s.total]));
async function enter(page,progress,width){
 await page.setViewportSize({width,height:width===320?568:width===430?932:1080});
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(progress=>{
  localStorage.setItem('to-the-stars-progress-v1',JSON.stringify(progress));localStorage.setItem('to-the-stars-language','fr');
  localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));
 },normalizeProgress(progress));
 await page.goto('/?lang=fr');await page.locator('button.welcome-secondary').click();await page.locator('.chapters-dialog>.close').click();
}
for(const width of[320,430,1920]){
 test(`French repair 25 result opens repair 26 at ${width}`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await enter(page,{...ship,exteriorCompleted:0,scene:'exterior'},width);
  await page.locator('.repair-hotspot:not(.completed-hotspot) .target').click();await page.locator('.repair-bubble .preview-complete').click();
  await page.locator('.repair-reveal .primary').click();await expect(page.locator('#bubble-title')).toHaveText(translate('Engine nacelles','fr'));
  await page.locator('.repair-bubble .primary').click();await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).exteriorCompleted)).toBe(1);expect(errors).toEqual([]);
 });
 test(`French repair 53 result crosses the gate and starts repair 54 at ${width}`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await enter(page,{...ship,finaleDone:true,launchDone:true,mineCompleted:6,scannerInstalled:true,iceCompleted:6,wreckCompleted:6,havenCompleted:5,scene:'haven'},width);
  await page.locator('.hotspot:not(.completed-hotspot) .target').click();await page.locator('.repair-bubble .preview-complete').click();
  const next=page.locator('.repair-reveal .primary');await expect(next).toHaveText(message('exploration.continueStory',{},'fr'));await next.click();
  await expect(page.locator('.transit-dialog')).toBeVisible();await page.locator('.transit-actions .primary').click();
  await expect(page.locator('.caretaker-comic')).toBeVisible();await page.locator('.comic-skip').click();
  await page.locator('[data-node="buoy"]').click();
  await page.locator(`[data-repair-id="${destinations.buoy.repairs[0].id}"] .target`).click();
  await expect(page.locator('#bubble-title')).toHaveText(translate(destinations.buoy.repairs[0].name,'fr'));
  await page.locator('.repair-bubble .primary').click();await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
  const p=await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')));expect(p.havenCompleted).toBe(6);expect(p.jumpDone).toBe(true);expect(p.buoyCompleted).toBe(0);expect(errors).toEqual([]);
 });
}
