import {test,expect} from '@playwright/test';
import {normalizeProgress} from '../../src/progressStorage.js';
import {archiveDestinations} from '../../src/archive.js';
import {journeyStories} from '../../src/journeyStories.js';
import {levelCatalog} from '../../src/levelCatalog.js';

const counts=Object.fromEntries(Object.keys(normalizeProgress()).filter(k=>k==='completed'||k.endsWith('Completed')).map(k=>[k,99]));
const full=normalizeProgress({...counts,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,elysiumArrival:1,riftCrossed:1,caretakerMet:1,stars:Object.fromEntries(levelCatalog.map((r,i)=>[r.id,1+i%3]))});
for(const language of ['cs','en','de','fr','es','pt-BR'])for(const width of [320,393,430]){
 test(`archive console captions stay by their devices ${language} ${width}`,async({page})=>{
  test.setTimeout(90000);
  await page.setViewportSize({width,height:873});
  await page.route(/supabase\.co|api\.country\.is/,r=>r.abort());
  await page.addInitScript(({full,language,stories})=>{
   const url=new URL(location.href),scene=url.searchParams.get('qa-scene'),done=Number(url.searchParams.get('qa-done'));
   localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({...full,scene,archiveSimulationCompleted:done}));
   localStorage.setItem('to-the-stars-language',language);
   localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));
   for(const id of stories)localStorage.setItem('beyond-the-signal-story:guest:0:'+id,'seen');
  },{full,language,stories:journeyStories.map(s=>s.id)});
  const cases=[...Array.from({length:6},(_,done)=>['archive-simulation',done]),...Object.keys(archiveDestinations).filter(s=>s!=='archive-simulation').map(s=>[s,5])];
  for(const [scene,done] of cases){
   await page.goto(`/?qa-scene=${scene}&qa-done=${done}&lang=${language}`);
   await page.locator('.welcome-secondary').click();await page.locator('.chapters-dialog>.close').click();
   const buttons=page.locator('.archive-site button[data-repair-id]');
   await expect(buttons).toHaveCount(scene==='archive-simulation'?Math.min(done+1,5):5);
   // Wait for the measured caption layout, then inspect the real play-area cascade.
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const data=await buttons.evaluateAll(buttons=>buttons.map(b=>{
    const rect=el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};
    return{id:b.dataset.repairId,target:rect(b.querySelector('.target')),label:rect(b.querySelector('.hotspot-label')),scene:rect(b.closest('.game'))};
   }));
   const overlaps=(a,b)=>Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>1;
   for(const item of data){
    const repair=archiveDestinations[scene].repairs.find(r=>r.id===item.id);
    // Check visible marker centers, not merely the button's CSS left/top values.
    expect(Math.abs(item.target.x+item.target.width/2-(item.scene.x+1+(item.scene.width-2)*repair.x/100))).toBeLessThan(2);
    expect(Math.abs(item.target.y+item.target.height/2-(item.scene.y+1+(item.scene.height-2)*repair.y/100))).toBeLessThan(2);
    expect(item.label.x).toBeGreaterThanOrEqual(item.scene.x);
    expect(item.label.x+item.label.width).toBeLessThanOrEqual(item.scene.x+item.scene.width+1);
    expect(item.label.y).toBeGreaterThanOrEqual(item.scene.y);
    expect(item.label.y+item.label.height).toBeLessThanOrEqual(item.scene.y+item.scene.height+1);
    for(const other of data){expect(overlaps(item.label,other.target),`${scene}: caption covers ${other.id}`).toBe(false);if(item!==other)expect(overlaps(item.label,other.label),`${scene}: captions overlap`).toBe(false);}
   }
   if(scene==='archive-simulation'&&done===5){
    for(const item of data){
     const target=page.locator(`[data-repair-id="${item.id}"] .target`);
     await target.click();await expect(page.locator('.repair-bubble-dialog[open]')).toBeVisible();
     await page.locator('.repair-bubble-dialog .close').click();
    }
   }
  }
 });
}
