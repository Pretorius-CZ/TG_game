import {test,expect} from '@playwright/test';
import {shipStages} from '../../src/chapterFlow.js';
import {tutorialTopics} from '../../src/tutorials.js';

async function setup(page,progress){
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(({progress,topics})=>{
  if(sessionStorage.getItem('replay-seeded'))return;
  sessionStorage.setItem('replay-seeded','1');
  localStorage.setItem('to-the-stars-language','en');
  localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));
  localStorage.setItem('beyond-signal-tutorials-v1:guest',JSON.stringify(topics));
  localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,scene:'exterior',...progress}));
 },{progress,topics:Object.keys(tutorialTopics)});
 await page.setViewportSize({width:393,height:780});
 await page.goto('/');
 await page.locator('.welcome-secondary').filter({hasText:'Chapters'}).click();
 await page.locator('.chapters-list details').first().locator('summary').click();
 return page.locator('.chapters-list details').first().locator('.chapter-actions button');
}

for(const stage of shipStages)test(`completed ${stage.scene} can replay before departure`,async({page})=>{
 const progress=Object.fromEntries(shipStages.map(s=>[s.key,s.total]));
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const buttons=await setup(page,progress);
 const room=buttons.filter({hasText:new RegExp('^'+stage.name.replace('&','\\&'))});
 await expect(room).toBeEnabled();await room.click();
 await expect(page.locator('.chapters-dialog')).toHaveCount(0);
 await expect(page.locator('.completed-hotspot')).toHaveCount(stage.total);
 await page.locator('.completed-hotspot').first().locator('.target').click();
 await expect(page.locator('.repair-bubble-dialog .primary')).toContainText('Replay lesson');
 await page.locator('.repair-bubble-dialog .primary').click();
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')));
 expect(saved.launchDone).toBe(false);
 for(const s of shipStages)expect(saved[s.key]).toBe(s.total);
 expect(errors).toEqual([]);
});

test('replay access leaves future ship segments locked',async({page})=>{
 const buttons=await setup(page,{airlockCompleted:3,completed:4,navigationCompleted:1});
 for(const name of ['Airlock','Cockpit','Navigation'])await expect(buttons.filter({hasText:new RegExp('^'+name)})).toBeEnabled();
 for(const name of ['Crew quarters','Galley','Engine room'])await expect(buttons.filter({hasText:new RegExp('^'+name)})).toBeDisabled();
});

test('chapter one lists repairs, HARD preparation and departure story in journey order',async({page})=>{
 const progress={...Object.fromEntries(shipStages.map(s=>[s.key,s.total])),finaleDone:true,launchDone:true};
 const buttons=await setup(page,progress);
 const labels=await buttons.allTextContents();
 expect(labels.slice(1,8).map(text=>text.split(' · ')[0])).toEqual(shipStages.map(s=>s.name));
 expect(labels[8]).toContain('Launch check');
 expect(labels[9]).toContain('Replay the departure story');
 await buttons.nth(8).click();await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).launchDone)).toBe(true);
});

test('legacy partial room exposes completed repairs without exposing the next locked repair',async({page})=>{
 const buttons=await setup(page,{airlockCompleted:3,completed:4,crewCompleted:2});
 await buttons.filter({hasText:/^Crew quarters/}).click();
 await expect(page.locator('.repair-hotspot')).toHaveCount(2);
 await expect(page.locator('.completed-hotspot')).toHaveCount(2);
 await page.locator('.completed-hotspot').first().click();
 await expect(page.locator('.repair-bubble-dialog .primary')).toContainText('Replay lesson');
});
