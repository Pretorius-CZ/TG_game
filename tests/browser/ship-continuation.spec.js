import{test,expect}from'@playwright/test';
import{shipStages}from'../../src/chapterFlow.js';
import{tutorialTopics}from'../../src/tutorials.js';
import{exteriorRepairs}from'../../src/exteriorRepairs.js';
import{repairs}from'../../src/repairs.js';
import{navigationRepairs}from'../../src/navigationRepairs.js';
import{message,loadLocaleCatalog}from'../../src/i18n/messages.js';
import{translate}from'../../src/i18n/translate.js';
const interior=Object.fromEntries(shipStages.filter(s=>s.scene!=='exterior').map(s=>[s.key,s.total]));
test.beforeAll(async()=>{await loadLocaleCatalog('de');});
async function enter(page,progress,language,width){
 await page.setViewportSize({width,height:width===320?568:900});
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(({progress,language,topics})=>{
  localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,...progress}));localStorage.setItem('to-the-stars-language',language==='de'?'cs':language);
  localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));localStorage.setItem('beyond-signal-tutorials-v1:guest',JSON.stringify(topics));
 },{progress,language,topics:Object.keys(tutorialTopics)});
 await page.goto('/'+(language==='de'?'?previewLanguage=de':''));
 if(Object.entries(progress).some(([key,value])=>(key==='completed'||key.endsWith('Completed'))&&value>0)){
  await page.locator('button.welcome-secondary').click();await page.locator('.chapters-dialog>.close').click();
 }else{
  await page.locator('.welcome-play').click();await page.locator('.intro-skip').click();await page.locator('.repair-bubble .close').click();await page.getByRole('button',{name:translate('Go back',language),exact:true}).click();
 }
}
for(const [language,width]of[['en',430],['cs',320],['de',320]]){
 for(const finaleDone of [false,true])test(`exterior controls never overlap before departure ${language} finale=${finaleDone}`,async({page},info)=>{
  await enter(page,{...interior,exteriorCompleted:4,finaleDone,scene:'exterior'},language,width);
  await expect(page.locator('.exterior-room .repair-hotspot')).toHaveCount(4);
  const launch=page.locator('.launch-control');await expect(launch).toBeVisible();
  const controls=page.locator('.exterior-room .repair-hotspot,.exterior-room .ship-entry,.launch-control');
  const targets=await page.locator('.exterior-room .repair-hotspot .target,.exterior-room .ship-entry .target').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {width:r.width,height:r.height,clickable:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===n.closest('button')};}));
  for(const target of targets){expect(target.width).toBeGreaterThanOrEqual(44);expect(target.height).toBeGreaterThanOrEqual(44);}
  const boxes=await controls.evaluateAll(nodes=>nodes.map(n=>{const rects=[n,...n.querySelectorAll(".hotspot-label")].map(e=>e.getBoundingClientRect());return {x:Math.min(...rects.map(r=>r.x)),y:Math.min(...rects.map(r=>r.y)),right:Math.max(...rects.map(r=>r.right)),bottom:Math.max(...rects.map(r=>r.bottom))};}));
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
   const a=boxes[i],b=boxes[j];expect(Math.min(a.right,b.right)-Math.max(a.x,b.x)>0&&Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)>0,`controls ${i}/${j} overlap`).toBe(false);
  }
  await page.screenshot({path:info.outputPath('exterior-departure.png'),fullPage:true});
  const replay=page.locator('.launch-replay');await expect(replay).toHaveCount(finaleDone?1:0);
  if(finaleDone){
   await expect(launch.locator('.rating-stars')).toHaveCount(0);await expect(replay.locator('.rating-stars')).toHaveCount(1);
   await replay.click();await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
   await page.locator('.mini-header .close').click();await page.locator('.quit-panel .primary').click();
   expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).finaleDone)).toBe(true);
  }
  await launch.click();await expect(page.locator(finaleDone?'.departure-dialog':'.mini-dialog')).toBeVisible();
 });
 test(`last interior repair leads to a clear hull task and allows returning from inside ${language}`,async({page},info)=>{
  await enter(page,{...interior,engineCompleted:4,exteriorCompleted:0,scene:'engine'},language,width);
  await page.locator('.repair-hotspot:not(.completed-hotspot) .target').click();await page.locator('.repair-bubble .preview-complete').click();await page.locator('.repair-reveal .primary').click();
  await expect(page.locator('.exterior-room')).toBeVisible();await expect(page.locator('.exterior-room')).not.toHaveClass(/first-boarding/);
  await expect(page.locator('.scene-top h1')).toHaveText(message('ship.interiorReady',{},language));
  await expect(page.locator('.scene-top p')).toHaveText(message('ship.nextRepair',{name:translate(exteriorRepairs[0].name,language)},language));
  const hull=page.getByTitle(translate(exteriorRepairs[0].name,language),{exact:true});await expect(hull).toBeEnabled();
  expect(await hull.locator('.target').evaluate(target=>{const r=target.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===target.closest('button');})).toBe(true);
  await hull.locator('.target').click();await expect(page.locator('#bubble-title')).toHaveText(translate(exteriorRepairs[0].name,language));await page.locator('.repair-bubble .close').click();
  await page.locator('.ship-entry .target').click();await expect(page.locator('.airlock-room')).toBeVisible();await page.getByRole('button',{name:translate('Go back',language),exact:true}).click();
  await expect(page.locator('.exterior-room')).toBeVisible();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')));expect(saved.engineCompleted).toBe(5);expect(saved.exteriorCompleted).toBe(0);expect(saved.launchDone).toBe(false);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath('exterior-ready.png'),fullPage:true});
 });
 test(`landing gear result has one clear next repair and keeps its introduction ${language}`,async({page},info)=>{
  await enter(page,{...interior,exteriorCompleted:2,scene:'exterior'},language,width);
  await page.getByTitle(translate(exteriorRepairs[2].name,language),{exact:true}).locator('.target').click();await page.locator('.repair-bubble .preview-complete').click();
  await expect(page.locator('.ship-entry')).toHaveCount(0);
  await expect(page.locator('.repair-reveal .primary')).toHaveText(message('ship.nextRepair',{name:translate(exteriorRepairs[3].name,language)},language)+' →');
  await page.screenshot({path:info.outputPath('landing-gear-result.png'),fullPage:true});
  await page.locator('.repair-reveal .primary').click();await expect(page.locator('#bubble-title')).toHaveText(translate(exteriorRepairs[3].name,language));await expect(page.locator('#bubble-story')).toHaveText(translate(exteriorRepairs[3].thought,language));await expect(page.locator('.mini-dialog')).toHaveCount(0);
  await page.locator('.repair-bubble .primary').click();await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).exteriorCompleted)).toBe(3);
 });
}
test('first boarding keeps future exterior repairs locked but has a usable return route',async({page})=>{
 await enter(page,{scene:'exterior'},'en',320);await expect(page.locator('.exterior-room')).toHaveClass(/first-boarding/);await expect(page.locator('.repair-hotspot')).toHaveCount(0);
 await page.locator('.ship-entry .target').click();await expect(page.locator('.airlock-room')).toBeVisible();await page.getByRole('button',{name:'Go back',exact:true}).click();await expect(page.locator('.exterior-room')).toBeVisible();await expect(page.locator('.repair-hotspot')).toHaveCount(0);
});
for(const completed of [0,3])test(`cockpit continuation opens the next briefing before starting the next puzzle from ${completed}`,async({page})=>{
 const next=completed===0?repairs[1]:navigationRepairs[0];
 await enter(page,{airlockCompleted:3,completed,scene:'cockpit'},'en',430);await page.locator('.repair-hotspot:not(.completed-hotspot) .target').click();await page.locator('.repair-bubble .preview-complete').click();await page.locator('.repair-reveal .primary').click();await expect(page.locator('#bubble-title')).toHaveText(next.name);await expect(page.locator('#bubble-story')).toHaveText(next.thought);await expect(page.locator('.mini-dialog')).toHaveCount(0);
});
