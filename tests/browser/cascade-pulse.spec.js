import {test,expect} from '@playwright/test';
const board=[1,2,0,3,3,0,1,2,2,3,3,0,2,3,2,1,0,1,4,2,4,3,3,1,1,0,0,1,0,1,2,2,1,2,3,2,1,4,3,4,3,4,3,4,1,0,4,4,3];
test('three actual cascades produce one resting bonus Pulse after a single move',async({page})=>{
 await page.setViewportSize({width:320,height:568});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.route('**/src/goalRefill.js',async route=>{
  const response=await route.fetch();let source=await response.text();
  source='let cascadeSeed=3822440233;\n'+source.replace('export function makeGoalBoard(level,goals,covers=[],random=Math.random){','export function makeGoalBoard(level,goals,covers=[],random=Math.random){return '+JSON.stringify(board)+';').replace('export function goalRefillRandom(level,goals,counts,board,covers,removed,history,random=Math.random){','export function goalRefillRandom(level,goals,counts,board,covers,removed,history,random=Math.random){return ()=>((cascadeSeed=(cascadeSeed*1664525+1013904223)>>>0)/4294967296);');
  await route.fulfill({response,body:source});
 });
 await page.goto('/tests/browser/fixture.html?result=performance');
 await page.locator('[data-cell="26"]').click();await page.locator('[data-cell="33"]').click();
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
 await expect(page.locator('.cascade-pulse-cell')).toHaveCount(1);await expect(page.locator('.cascade-pulse-cell')).toHaveAttribute('data-type','10');await expect(page.locator('.cascade-reward')).toContainText('Bonus Pulse');
 await expect(page.locator('.moves-counter strong')).toHaveText('79');
 await page.screenshot({path:'.local/cascade-pulse-'+test.info().project.name+'.png'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});
