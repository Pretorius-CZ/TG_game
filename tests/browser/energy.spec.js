import {test,expect} from '@playwright/test';
import {findMove,matches,swap,adjacent} from '../../src/match3.js';
test.beforeEach(async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.setViewportSize({width:430,height:739});
});
const energy=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-lives-v1')||'{"count":5}').count);
async function move(page){
 await expect(page.locator('.board')).toBeVisible();
 const board=await page.locator('[data-cell]').evaluateAll(c=>c.map(el=>+el.dataset.type));
 const pair=findMove(board,7);expect(pair).toBeTruthy();
 for(const i of pair)await page.locator(`[data-cell="${i}"]`).click();
}
test('reload after a move consumes one charge, repeated reloads do not',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=performance');await move(page);
 await expect.poll(()=>energy(page)).toBe(4);
 await page.reload();await expect(page.locator('.board')).toBeVisible();expect(await energy(page)).toBe(4);
 await page.reload();await expect(page.locator('.board')).toBeVisible();expect(await energy(page)).toBe(4);
});
test('reservation is durable before the move animation completes',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/tests/browser/fixture.html?result=performance');await move(page);
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','true');
 expect(await energy(page)).toBe(4);await page.reload();await expect(page.locator('.board')).toBeVisible();expect(await energy(page)).toBe(4);
});
test('opening, invalid swap, helper and refresh before a paid move remain free',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=performance');
 const board=await page.locator('[data-cell]').evaluateAll(c=>c.map(el=>+el.dataset.type));
 let pair;
 for(let a=0;a<board.length&&!pair;a++)for(const b of [a+1,a+7])if(b<board.length&&adjacent(a,b,7)&&!matches(swap(board,a,b),7).length){pair=[a,b];break;}
 for(const i of pair)await page.locator(`[data-cell="${i}"]`).click();
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');expect(await energy(page)).toBe(5);
 await page.locator('.helper-tile').nth(0).click();await page.locator('[data-cell="0"]').click();
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');expect(await energy(page)).toBe(5);
 await page.reload();await expect(page.locator('.board')).toBeVisible();expect(await energy(page)).toBe(5);
});
for(const result of ['won','exhausted'])test(`${result}: energy is settled once and survives reload`,async({page})=>{
 await page.goto(`/tests/browser/fixture.html?result=${result}`);await move(page);
 await expect(page.locator(result==='won'?'.win-panel':'.out-of-moves[role="region"]')).toBeVisible();
 const expected=result==='won'?5:4;await expect.poll(()=>energy(page)).toBe(expected);
 await page.reload();await expect(page.locator('.board')).toBeVisible();expect(await energy(page)).toBe(expected);
});
test('leaving a started attempt does not debit it again',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=performance');await move(page);
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
 await page.locator('.mini-header .close').click();await page.locator('.quit-panel .primary').click();
 expect(await energy(page)).toBe(4);await page.reload();await expect(page.locator('.board')).toBeVisible();expect(await energy(page)).toBe(4);
});
test('continuation and retry cannot create a refund or a second loss',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=exhausted');await move(page);
 await expect(page.locator('.out-of-moves[role="region"]')).toBeVisible();expect(await energy(page)).toBe(4);
 await page.locator('.out-of-moves[role="region"]>.primary').click();
 await page.locator('.reward-ad .primary').click();await page.locator('.reward-ad .primary').click();
 await expect(page.locator('.board')).toBeVisible();expect(await energy(page)).toBe(4);
 await page.reload();await expect(page.locator('.board')).toBeVisible();expect(await energy(page)).toBe(4);
 await move(page);await expect(page.locator('.out-of-moves[role="region"]')).toBeVisible();expect(await energy(page)).toBe(3);
 await page.locator('.out-of-moves[role="region"]>.keep-playing').first().click();
 await expect(page.locator('.board')).toBeVisible();expect(await energy(page)).toBe(3);
 await page.reload();await expect(page.locator('.board')).toBeVisible();expect(await energy(page)).toBe(3);
});
test('technical recovery refunds a reserved charge exactly once',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=performance');
 await expect(page.locator('.board')).toBeVisible();
 await page.evaluate(()=>{Math.random=()=>{throw new Error('Simulated refill failure');};});
 await move(page);await expect(page.locator('.out-of-moves[role="alert"]')).toBeVisible();
 expect(await energy(page)).toBe(5);
 await page.reload();await expect(page.locator('.board')).toBeVisible();expect(await energy(page)).toBe(5);
});
