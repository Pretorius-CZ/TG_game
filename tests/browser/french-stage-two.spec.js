import {test,expect} from '@playwright/test';
import {writeFileSync} from 'node:fs';
import {destinations} from '../../src/destinations.js';
import {normalizeProgress} from '../../src/progressStorage.js';
import {levelCatalog} from '../../src/levelCatalog.js';
import {chaptersFor} from '../../src/chapters.js';
import {journeyStories} from '../../src/journeyStories.js';
import {translate} from '../../src/i18n/translate.js';
import {loadLocaleCatalog} from '../../src/i18n/messages.js';
test.beforeAll(async()=>{await loadLocaleCatalog('fr');});
const counts=Object.fromEntries(Object.keys(normalizeProgress()).filter(k=>k==='completed'||k.endsWith('Completed')).map(k=>[k,99]));
const progress=normalizeProgress({...counts,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,elysiumRouteCompleted:1,elysiumArrival:1,riftCrossed:1,caretakerMet:1,stars:Object.fromEntries(levelCatalog.map((r,i)=>[r.id,1+i%3]))});
for(const [language,width,height]of [['fr',320,568],['fr',430,932]])test(`French chapters 2–10 preserve all task anchors, names and stars ${language} ${width}`,async({page},testInfo)=>{
 test.setTimeout(120000);await page.setViewportSize({width,height});
 const errors=[],overlaps=[],covered=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(({progress,language,stories})=>{
  const scene=new URL(location.href).searchParams.get('qa-scene');
  localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({...progress,scene}));
  localStorage.setItem('to-the-stars-language',language);
  localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));
  for(const id of stories)localStorage.setItem('beyond-the-signal-story:guest:0:'+id,'seen');
 },{progress,language,stories:journeyStories.map(s=>s.id)});
 const scenes=new Set(chaptersFor({}).slice(1).flatMap(c=>c.sections.map(s=>s.scene)));
 for(const [scene,site]of Object.entries(destinations).filter(([scene])=>scenes.has(scene))){
  await page.goto('/?qa-scene='+scene+'&previewLanguage=fr');
  await page.locator('button.welcome-secondary').click();await page.locator('.chapters-dialog>.close').click();
  await expect(page.locator('.expedition .completed-hotspot')).toHaveCount(site.repairs.length);
  await expect(page.locator('.completed-repairs-grid')).toHaveCount(0);
  const boxes=[];
  for(const repair of site.repairs){
   const point=page.locator('.expedition .completed-hotspot').filter({has:page.locator('.hotspot-label',{hasText:translate(repair.name,language)})});
   await expect(point).toBeVisible();
   expect(await point.evaluate(el=>el.style.left)).toBe(repair.x+'%');
   const anchor=await point.evaluate(el=>{const style=getComputedStyle(el),map=el.closest('.scene-repairs');return{x:parseFloat(style.left),y:parseFloat(style.top),width:map.clientWidth,height:map.clientHeight};});
   expect(Math.abs(anchor.x-anchor.width*repair.x/100)).toBeLessThan(1);
   expect(Math.abs(anchor.y-((site.hotspotOffset??110)+(anchor.height-(site.hotspotOffset??110))*repair.y/100))).toBeLessThan(1);
   const label=point.locator('.hotspot-label');
   await label.scrollIntoViewIfNeeded();await expect(label).toBeVisible();await expect(point.locator('.rating-stars')).toBeVisible();
   const box=await label.boundingBox();expect(box.width).toBeGreaterThan(20);expect(box.height).toBeGreaterThan(10);
   expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width+1);
   const unobscured=await label.evaluate(label=>{
    const r=label.getBoundingClientRect(),button=label.closest('button');
    return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===button;
   });if(!unobscured)covered.push({scene,id:repair.id});
   const scroll=0;
   boxes.push({id:repair.id,...box,y:box.y+scroll});
  }
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
   const a=boxes[i],b=boxes[j],x=Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x),y=Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y);
   if(x>2&&y>2)overlaps.push({scene,a:a.id,b:b.id,x:Math.round(x),y:Math.round(y)});
  }
  if(['elysium-homes','night-sanctuary','refuge-homes','refuge-arrival','archive-core','signal-garden'].includes(scene))await page.screenshot({path:testInfo.outputPath(scene+'.png'),fullPage:true});
  if(scene.startsWith('signal-'))for(const repair of site.repairs){
   await page.locator(`[data-repair-id="${repair.id}"] .target`).click();
   await expect(page.locator('#bubble-title')).toHaveText(translate(repair.name,language));
   await expect(page.locator('.repair-bubble-dialog .primary')).toContainText(translate('Replay lesson',language));
   await page.locator('.repair-bubble-dialog .close').click();
  }
 }
 await testInfo.attach('label-overlaps',{body:JSON.stringify(overlaps,null,2),contentType:'application/json'});
 writeFileSync(testInfo.outputPath('label-audit.json'),JSON.stringify({overlaps,covered},null,2));
 expect(overlaps).toEqual([]);
 expect(covered).toEqual([]);
 expect(errors).toEqual([]);
});
