import {test,expect} from '@playwright/test';

for(const charge of [10,11])test(`falling charge ${charge} stays usable above an intact cover`,async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(()=>{
  localStorage.setItem('to-the-stars-language','en');
  let seed=73;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 });
 await page.route(/\/src\/goalRefill\.js/,async route=>{
  const response=await route.fetch();
  const source=(await response.text()).replace('export function makeGoalBoard(','function originalMakeGoalBoard(');
  await route.fulfill({response,body:source+`\nexport function makeGoalBoard(){return [${charge},1,2,1,2,3,2,3,4,3,0,4,4,4,1];}`});
 });
 await page.goto('/tests/browser/fixture.html?charge-cover');
 const board=page.locator('.board'),cover=page.locator('[data-cell="3"]');
 await expect(board).toHaveAttribute('aria-busy','false');
 await page.locator('[data-cell="11"]').click();await page.locator('[data-cell="14"]').click();
 await expect(board).toHaveAttribute('aria-busy','false');
 await expect(cover).toHaveClass(/frozen-cell/);
 await expect(page.locator('.frozen-cell[data-booster]')).toHaveCount(0);
 const bomb=page.locator('[data-cell="0"]');
 await expect(bomb).toHaveAttribute('data-type',String(charge));await expect(bomb).toBeEnabled();
 await bomb.click();await expect(board).toHaveAttribute('aria-busy','false');
 await expect(page.locator('.frozen-cell')).toHaveCount(0);
 await expect(page.locator('.fault-panel')).toHaveCount(0);
});
