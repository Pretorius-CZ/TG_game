import {test,expect} from '@playwright/test';
import {matches} from '../../src/match3.js';

for(const charge of [10,11])for(const input of ['drag','click'])test(`charge ${charge}: valid ${input}, invalid drag and tap detonation`,async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 const board=Array.from({length:49},(_,i)=>(Math.floor(i/7)+2*(i%7))%5);
 board[14]=0;board[15]=0;board[16]=charge;board[17]=0;
 expect(matches(board,7)).toEqual([]);
 // Replace only the opening board in this browser fixture; use production play rules.
 await page.route('**/src/goalRefill.js',async route=>{
  const response=await route.fetch(),source=await response.text();
  const marker='export function makeGoalBoard(level,goals,covers=[],random=Math.random){';
  expect(source).toContain(marker);
  await route.fulfill({response,body:source.replace(marker,marker+'return '+JSON.stringify(board)+';')});
 });
 await page.goto('/tests/browser/fixture.html?result=performance');
 const cell=i=>page.locator(`[data-cell="${i}"]`),moves=page.locator('.moves-counter strong');
 await expect(cell(16)).toHaveAttribute('data-type',String(charge));
 async function drag(a,b){const from=await cell(a).boundingBox(),to=await cell(b).boundingBox();await page.mouse.move(from.x+from.width/2,from.y+from.height/2);await page.mouse.down();await page.mouse.move(to.x+to.width/2,to.y+to.height/2,{steps:5});await page.mouse.up();await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');}
 await expect(moves).toHaveText('80');
 await drag(16,23);await expect(moves).toHaveText('80');await expect(cell(16)).toHaveAttribute('data-type',String(charge));
 if(input==='drag')await drag(16,17);
 else{await cell(17).click();await cell(16).click();await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');}
 await expect(moves).toHaveText('79');
 // Later cascades may let the moved charge fall; moving must not detonate it.
 const remainingCharge=page.locator(`[data-type="${charge}"]`).first();await expect(remainingCharge).toBeVisible();
 await remainingCharge.click();await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');await expect(moves).toHaveText('78');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
