import {test,expect} from '@playwright/test';
test('a double match in one move displays +2 before the first cascade',async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 const board=Array.from({length:64},(_,i)=>(Math.floor(i/8)+2*(i%8))%6);
 for(const [i,type]of [[18,1],[19,0],[20,0],[21,3],[24,1],[25,1],[26,0],[27,null]])board[i]=type;
 await page.route('**/src/goalRefill.js',async route=>{const response=await route.fetch(),source=await response.text();await route.fulfill({response,body:source.replace('export function makeGoalBoard(level,goals,covers=[],random=Math.random){','export function makeGoalBoard(level,goals,covers=[],random=Math.random){return '+JSON.stringify(board)+';')});});
 await page.goto('/tests/browser/fixture.html?stress=1');
 const moves=Number(await page.locator('.moves-counter strong').textContent());
 await page.locator('[data-cell="18"]').click();await page.locator('[data-cell="26"]').click();
 await expect(page.locator('.resonator-impulses text')).toHaveText('+2');await expect(page.locator('.resonator-feedback')).toContainText('+2');
 await page.screenshot({path:'.local/resonator-double-'+test.info().project.name+'.png'});
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
 await expect(page.locator('.moves-counter strong')).toHaveText(String(moves-1));
 expect(await page.locator('.resonator-cell small').textContent()).toMatch(/^[23]\/3$/);
});
