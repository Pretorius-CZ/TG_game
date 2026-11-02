import {test,expect} from '@playwright/test';
import {normalizeProgress} from '../../src/progressStorage.js';
import {networkLevels} from '../../src/networkLevels.js';
import {networkDestinations} from '../../src/networkExpansion.js';
import {journeyStories} from '../../src/journeyStories.js';
import {findMove,adjacent,matches,swap} from '../../src/match3.js';

const counts=Object.fromEntries(Object.keys(normalizeProgress()).filter(k=>k==='completed'||k.endsWith('Completed')).map(k=>[k,99]));
const full=normalizeProgress({...counts,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,elysiumArrival:1,riftCrossed:1,caretakerMet:1});
async function setup(page,{scene='network-handover',done=0,language='cs',comic=false,travel=false}={}){
 const marker='network-setup:'+crypto.randomUUID();
 const stops=Object.entries(networkDestinations),index=stops.findIndex(([s])=>s===scene);
 const seed=normalizeProgress({...full,scene,...Object.fromEntries(stops.map(([s,site],i)=>[site.key,i<index?site.repairs.length:i===index?Math.min(done,site.repairs.length):0]))});
 await page.route(/supabase\.co|api\.country\.is/,r=>r.abort());
 await page.addInitScript(({seed,language,stories,comic,travel,marker})=>{
  if(sessionStorage.getItem(marker))return;sessionStorage.setItem(marker,'1');
  const p=seed;
  localStorage.setItem('to-the-stars-progress-v1',JSON.stringify(p));
  localStorage.setItem('to-the-stars-language',language);
  localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));
  for(const id of stories)if(!(comic&&id==='network-first-watch')&&!(travel&&['network-crew-stops','network-near-departure','network-far-crossing'].includes(id)))localStorage.setItem('beyond-the-signal-story:guest:0:'+id,'seen');
 },{seed,language,comic,travel,marker,stories:journeyStories.map(s=>s.id)});
 await page.goto('/?lang='+language);
}
test('new transition comic opens once and leads into the first real repair',async({page})=>{
 await page.setViewportSize({width:393,height:873});
 await setup(page,{comic:true});
 await page.locator('.welcome-play').click();
 const comic=page.locator('.caretaker-comic[open]');
 await expect(comic).toBeVisible();await expect(comic.locator('h2')).toHaveText('Záchrana je dokončená');
 for(let i=0;i<3;i++){
  await expect.poll(()=>comic.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
  await comic.locator('.comic-pagination button').nth(i).click();
 }
 await comic.locator('.comic-caption>.primary').click();
 await expect(comic).toHaveCount(0);
 await expect(page.locator('.repair-bubble-dialog[open]')).toBeVisible();
 await expect(page.locator('#bubble-title')).toHaveText('Převezmi službu sítě');
 await page.locator('.repair-bubble-dialog .close').click();
 expect(await page.evaluate(()=>localStorage.getItem('beyond-the-signal-story:guest:0:network-first-watch'))).toBe('seen');
});
test('ordered nodes use the production MiniGame, new sprites and a valid move',async({page})=>{
 await page.setViewportSize({width:393,height:873});await setup(page,{done:2});
 await page.locator('button.welcome-secondary').click();await page.locator('.chapters-dialog>.close').click();
 await page.locator('[data-repair-id="network-first-node"] .target').click();
 await page.locator('.repair-bubble-dialog .primary').click();
 const dialog=page.locator('.mini-dialog[open]');await expect(dialog).toBeVisible();
 await expect(dialog.locator('.route-node-current')).toHaveCount(1);
 const imgs=dialog.locator('.gem img');await expect.poll(()=>imgs.evaluateAll(xs=>xs.length>0&&xs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
 expect(await imgs.first().getAttribute('src')).toContain('/tiles/network-');
 const board=Array(56).fill(null);for(const item of await dialog.locator('[data-cell]').evaluateAll(xs=>xs.map(x=>({at:Number(x.dataset.cell),type:Number(x.dataset.type)}))))board[item.at]=item.type;
 const [a,b]=findMove(board,7);await dialog.locator(`[data-cell="${a}"]`).click();await dialog.locator(`[data-cell="${b}"]`).click();
 await expect.poll(()=>dialog.locator('.cell:disabled').count()).toBe(0,{timeout:15000});
 await page.screenshot({path:'.local/network-real-minigame.png',fullPage:true});
});
for(const language of ['cs','en','de','fr','es','pt-BR'])test(`new scene labels remain anchored and separate ${language}`,async({page})=>{
 await page.setViewportSize({width:320,height:873});
 for(const scene of Object.keys(networkDestinations)){
  await setup(page,{scene,done:5,language});await page.locator('button.welcome-secondary').click();await page.locator('.chapters-dialog>.close').click();
  const site=page.locator('.network-site');await expect(site).toBeVisible();
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const rects=await site.locator('[data-repair-id]').evaluateAll(xs=>xs.map(x=>{
   const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};};
   return{id:x.dataset.repairId,label:rect(x.querySelector('.hotspot-label')),target:rect(x.querySelector('.target')),scene:rect(x.closest('.game'))};
  }));
  expect(rects).toHaveLength(networkDestinations[scene].repairs.length);
  const overlap=(a,b)=>Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>1;
  for(const item of rects){
   expect(item.label.x).toBeGreaterThanOrEqual(item.scene.x);
   expect(item.label.x+item.label.w).toBeLessThanOrEqual(item.scene.x+item.scene.w+1);
   for(const other of rects){expect(overlap(item.label,other.target),item.id+' covers '+other.id).toBe(false);if(item!==other)expect(overlap(item.label,other.label),item.id+' overlaps '+other.id).toBe(false);}
  }
  await page.screenshot({path:`.local/network-scene-${scene}-${language}.png`,fullPage:true});
 }
});

test('network task markers stay circular before and after repairs',async({page})=>{
 test.setTimeout(180000);
 for(const width of [320,393,465]){
  await page.setViewportSize({width,height:950});
  for(const scene of Object.keys(networkDestinations))for(const done of [0,1,networkDestinations[scene].repairs.length]){
   await setup(page,{scene,done});await page.locator('button.welcome-secondary').click();await page.locator('.chapters-dialog>.close').click();
   const markers=await page.locator('.network-site .hotspot .target').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return{w:r.width,h:r.height};}));
   expect(markers.length).toBeGreaterThan(0);
   for(const r of markers){expect(Math.abs(r.w-r.h),`${scene} ${done} at ${width}`).toBeLessThan(1);expect(r.h).toBeGreaterThanOrEqual(33);}
  }
 }
});

test('twenty new repairs traverse all eight stops and three travel comics',async({page})=>{
 test.setTimeout(90000);await page.setViewportSize({width:393,height:873});
 await setup(page,{scene:'network-water',language:'en',travel:true});await page.locator('.welcome-play').click();
 let comics=0;
 for(const r of networkLevels.slice(10)){
  await expect.poll(async()=>await page.locator('.caretaker-comic[open],.repair-bubble-dialog[open]').count()).toBeGreaterThan(0);
  if(await page.locator('.caretaker-comic[open]').count()){
   const comic=page.locator('.caretaker-comic[open]');comics++;
   for(let i=0;i<2;i++){
    await expect.poll(()=>comic.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
    await comic.locator('.comic-caption>.primary').click();
   }
  }
  await expect(page.locator('#bubble-title')).toHaveText(r.name);
  await page.locator('.repair-bubble-dialog .preview-complete').click();
  await expect(page.locator('.repair-reveal h2')).toHaveText(r.name);
  await page.locator('.repair-reveal .primary').click();
 }
 expect(comics).toBe(3);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')));
 for(const s of Object.values(networkDestinations))expect(saved[s.key]).toBe(s.repairs.length);
 expect(Object.keys(saved.stars)).toHaveLength(230);
 await page.reload();await page.locator('button.welcome-secondary').click();
 await expect(page.locator('.chapters-dialog details').last().locator('summary')).toContainText('30/30');
});

test('new narrow, wide and covered layouts work in the real minigame',async({page})=>{
 test.setTimeout(90000);
 await page.setViewportSize({width:393,height:873});
 for(const number of [211,213,220,224,230]){
  const r=networkLevels.find(r=>r.number===number),[scene,site]=Object.entries(networkDestinations).find(([,s])=>s.repairs.some(x=>x.id===r.id));
  await setup(page,{scene,done:site.repairs.findIndex(x=>x.id===r.id),language:'en'});
  await page.locator('.welcome-play').click();await page.locator('.repair-bubble-dialog .primary').click();
  const dialog=page.locator('.mini-dialog[open]');await expect(dialog).toBeVisible();
  await expect.poll(()=>dialog.locator('.gem img').evaluateAll(xs=>xs.length>0&&xs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
  if(await page.locator('.mechanic-tutorial').count())await page.locator('.mechanic-tutorial .tutorial-close').click();
  const rect=await dialog.evaluate(e=>{const r=e.getBoundingClientRect();return{x:r.x,right:r.right};});expect(rect.x).toBeGreaterThanOrEqual(0);expect(rect.right).toBeLessThanOrEqual(394);
  expect(await dialog.locator('.route-node-current').count()).toBe(r.nodes.length?1:0);
  const board=Array(r.level.cols*r.level.rows).fill(null);for(const cell of await dialog.locator('[data-cell]').evaluateAll(xs=>xs.map(x=>({at:Number(x.dataset.cell),type:Number(x.dataset.type)}))))board[cell.at]=cell.type;
  const available=await dialog.locator('[data-cell]:not(:disabled)').evaluateAll(xs=>xs.map(x=>Number(x.dataset.cell)));
  const move=available.flatMap(a=>[a+1,a+r.level.cols].filter(b=>available.includes(b)&&adjacent(a,b,r.level.cols)&&matches(swap(board,a,b),r.level.cols).length).map(b=>[a,b]))[0];
  expect(move,'a playable swap must exclude covered cells').toBeTruthy();
  const [a,b]=move;await dialog.locator(`[data-cell="${a}"]`).click();await dialog.locator(`[data-cell="${b}"]`).click();
  await expect.poll(()=>dialog.locator('.cell:disabled').count()).toBeLessThanOrEqual(r.ice.length,{timeout:15000});
  await page.screenshot({path:'.local/network-minigame-'+number+'.png',fullPage:true});
 }
});
