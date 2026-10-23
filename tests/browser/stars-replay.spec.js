import {test,expect} from '@playwright/test';
import {findMove} from '../../src/match3.js';

for(const mode of ['close','reload','lower'])test(`replay rating persists on ${mode} and matches chapter totals`,async({page})=>{
 await page.route(/supabase\.co|country\.is/,route=>route.fulfill({status:204,body:''}));
 await page.addInitScript(()=>{localStorage.setItem('to-the-stars-language','en');localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));});
 if(mode==='lower')await page.addInitScript(()=>localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,airlockCompleted:3,completed:4,stars:{lights:3,windows:3,computer:3,diagnostics:3}})));
 await page.goto(`/tests/browser/stars-fixture.html?${mode}`);
 const ship=page.locator('.chapters-list details').first(),cockpit=ship.locator('.chapter-actions button').filter({hasText:'Cockpit'});
 await ship.locator('summary').click();await expect(cockpit.locator('.chapter-stars')).toHaveText(mode==='lower'?'★ 12 / 12':'★ 10 / 12');
 await page.locator('.chapters-dialog>.close').click();await page.locator('#replay').click();
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
 const board=await page.locator('[data-cell]').evaluateAll(cells=>cells.map(cell=>Number(cell.dataset.type)));
 for(const i of findMove(board,7))await page.locator(`[data-cell="${i}"]`).click();
 await expect(page.locator('.hero-rating')).toHaveAttribute('aria-label',mode==='lower'?'1 of 3 stars':'3 of 3 stars');
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).stars.diagnostics)).toBe(3);
 if(mode==='reload')await page.reload();
 else {await page.locator('.mini-header>.close').click();await page.locator('.quit-panel .primary').click();}
 await ship.locator('summary').click();await expect(cockpit.locator('.chapter-stars')).toHaveText('★ 12 / 12');
 await page.reload();await ship.locator('summary').click();await expect(cockpit.locator('.chapter-stars')).toHaveText('★ 12 / 12');
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')));
 expect(stored.completed).toBe(4);expect(stored.stars).toMatchObject({lights:3,windows:3,computer:3,diagnostics:3});
});

for(const mode of ['first','blind'])test(`automatic replay award preserves ${mode} isolation`,async({page})=>{
 await page.route(/supabase\.co|country\.is/,route=>route.fulfill({status:204,body:''}));
 await page.addInitScript(()=>{localStorage.setItem('to-the-stars-language','en');localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));});
 await page.goto(`/tests/browser/stars-fixture.html?${mode}`);
 await page.locator('.chapters-dialog>.close').click();await page.locator('#replay').click();
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
 const board=await page.locator('[data-cell]').evaluateAll(cells=>cells.map(cell=>Number(cell.dataset.type)));
 for(const i of findMove(board,7))await page.locator(`[data-cell="${i}"]`).click();
 await expect(page.locator('.hero-rating')).toHaveAttribute('aria-label','3 of 3 stars');
 await page.locator('.mini-header>.close').click();await page.locator('.quit-panel .primary').click();
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')));
 expect(stored.completed).toBe(mode==='first'?3:4);
 expect(stored.stars.diagnostics).toBe(mode==='first'?undefined:1);
});
