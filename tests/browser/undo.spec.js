import {test,expect} from '@playwright/test';
import {findMove,adjacent,swap} from '../../src/match3.js';
import {swapMatches} from '../../src/levelRules.js';
import {rewards} from '../../src/boosters.js';
import {mockSDK} from './googleAdsMock.js';

test.beforeEach(async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(()=>{
  localStorage.setItem('to-the-stars-language',new URL(location.href).searchParams.get('lang')==='cs'?'cs':'en');
  let seed=12345;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 });
});
const energy=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-lives-v1')||'{"count":5}').count);
async function settled(page){await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');}
async function state(page){return page.evaluate(()=>({
 board:[...document.querySelectorAll('[data-cell]')].map(c=>[c.dataset.cell,c.dataset.type,c.classList.contains('frozen-cell')]),
 rings:[...document.querySelectorAll('.resonator-cell')].map(c=>c.getAttribute('aria-label')),
 goals:[...document.querySelectorAll('.objective-list progress')].map(p=>[p.value,p.max]),
 moves:document.querySelector('.moves-counter strong').textContent,
 bonus:document.querySelector('.cascade-pulse-cell')?.dataset.cell??null
}));}
async function move(page,pair){
 await settled(page);
 pair??=findMove(await page.locator('.board').evaluate(el=>[...el.children].filter(c=>c.matches('button.cell,.board-hole,.resonator-cell')).map(c=>c.dataset.type==null?null:Number(c.dataset.type))),7);
 expect(pair).toBeTruthy();for(const i of pair)await page.locator(`[data-cell="${i}"]`).click();
 await expect(page.locator('.board[aria-busy="false"],.win-panel')).toHaveCount(1);return pair;
}
async function prepare(page){
 const before=await state(page),charges=await energy(page);
 await page.locator('.undo-control').click();await page.locator('.reward-ad .primary').click();await page.locator('.reward-ad .primary').click();await expect(page.locator('.reward-ad')).toHaveCount(0);
 expect(await state(page)).toEqual(before);expect(await energy(page)).toBe(charges);
 await expect(page.locator('.undo-control')).toHaveAttribute('data-undo-state','ready');
 await expect(page.locator('.undo-control')).toHaveClass(/undo-prepared/);
 await expect(page.locator('.undo-notice')).toBeVisible();
 if(await page.locator('.board').isVisible()){const cell=await page.locator('[data-cell]').first().boundingBox();expect(cell.width).toBeGreaterThanOrEqual(24);}
}
async function claim(page){await prepare(page);await page.locator('.undo-control').click();await expect(page.locator('.undo-notice')).toHaveText('Move undone.');}

test('undo restores the board and cascades, identical replay and only one use',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=performance');
 await expect(page.locator('.undo-control')).toBeDisabled();const before=await state(page);
 const pair=await move(page),after=await state(page);
 await expect(page.locator('.undo-control')).toBeEnabled();await claim(page);
 expect(await state(page)).toEqual(before);expect(await energy(page)).toBe(4);
 await expect(page.locator('.undo-control')).toBeDisabled();
 await move(page,pair);expect(await state(page)).toEqual(after);expect(await energy(page)).toBe(4);
 await expect(page.locator('.undo-control')).toBeDisabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('cancelling the offer keeps the turn and the undo right',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=performance');await move(page);const after=await state(page);
 await page.locator('.undo-control').click();await page.locator('.reward-ad button').last().click();
 expect(await state(page)).toEqual(after);await expect(page.locator('.undo-control')).toBeEnabled();
 await claim(page);await expect(page.locator('.undo-control')).toBeDisabled();
});

test('last-life exhaustion can undo without an extra charge',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('to-the-stars-lives-v1',JSON.stringify({count:1,nextAt:null})));
 await page.goto('/tests/browser/fixture.html?result=exhausted');const before=await state(page);const pair=await move(page);
 await expect(page.locator('.out-of-moves[role="region"]')).toBeVisible();expect(await energy(page)).toBe(0);
 await claim(page);expect(await state(page)).toEqual(before);expect(await energy(page)).toBe(0);
 await move(page,pair);await expect(page.locator('.out-of-moves[role="region"]')).toBeVisible();expect(await energy(page)).toBe(0);
 await expect(page.locator('.undo-control')).toBeDisabled();
});

test('retry resets the one-use allowance without retaining the old frame',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=exhausted');await move(page);await claim(page);await move(page);
 await page.locator('.out-of-moves>.keep-playing').first().click();await expect(page.locator('.undo-control')).toBeDisabled();
 expect(await energy(page)).toBe(4);await move(page);await expect(page.locator('.undo-control')).toBeEnabled();await claim(page);expect(await energy(page)).toBe(3);
});

test('masked board, covers and ring charge return to the state before a matching impulse',async({page})=>{
 await page.goto('/tests/browser/fixture.html?stress');await settled(page);const before=await state(page);
 const board=Array(64).fill(null);for(const [i,type]of before.board)board[+i]=+type;
 const covers=before.board.filter(([, ,covered])=>covered).map(([i])=>+i);
 let pair;
 for(let a=0;a<64&&!pair;a++)for(const b of [a+1,a+8]){
  const hit=swapMatches(board,a,b,8,covers);
  if(hit.some(i=>covers.includes(i)||adjacent(i,27,8))){pair=[a,b];break;}
 }
 expect(pair).toBeTruthy();await move(page,pair);const after=await state(page);
 expect(after.goals).not.toEqual(before.goals);await claim(page);expect(await state(page)).toEqual(before);
 await move(page,pair);expect(await state(page)).toEqual(after);
});

test('activating a charge is a reversible ordinary turn',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=performance');await settled(page);
 for(let turn=0;turn<12&&!await page.locator('[data-booster]').count();turn++){
  const board=await page.locator('[data-cell]').evaluateAll(c=>c.map(e=>Number(e.dataset.type)));
  let pair;
  for(let a=0;a<board.length&&!pair;a++)for(const b of [a+1,a+7]){
   if(b<board.length&&adjacent(a,b,7)&&swapMatches(board,a,b,7).length&&rewards(swap(board,a,b),7,[],[b,a]).length){pair=[a,b];break;}
  }
  await move(page,pair);
 }
 const charge=page.locator('[data-booster]').first();await expect(charge).toBeVisible();const at=Number(await charge.getAttribute('data-cell'));
 const before=await state(page);await move(page,[at]);const after=await state(page);
 await claim(page);expect(await state(page)).toEqual(before);await move(page,[at]);expect(await state(page)).toEqual(after);
});

test('settled wins cannot undo or revoke saved results',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=won');await move(page);await expect(page.locator('.win-panel')).toBeVisible();await expect(page.locator('.undo-control')).toHaveCount(0);expect(await energy(page)).toBe(5);
});

test('using a helper invalidates undo and a later undo does not refund the helper',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=performance');await move(page);
 await page.locator('.helper-type-0').click();await page.locator('[data-cell="0"]').click();await settled(page);
 await expect(page.locator('.undo-control')).toBeDisabled();await expect(page.locator('.helper-type-0')).toHaveClass(/empty-stock/);
 await move(page);await claim(page);await expect(page.locator('.helper-type-0')).toHaveClass(/empty-stock/);
 await page.reload();await expect(page.locator('.undo-control')).toBeDisabled();
});

test('a prepared undo survives another move and applies only on the explicit tap',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=performance');await move(page);const first=await state(page);await prepare(page);
 await move(page);expect(await state(page)).not.toEqual(first);await expect(page.locator('.undo-control')).toHaveAttribute('data-undo-state','ready');
 await page.locator('.undo-control').click();expect(await state(page)).toEqual(first);await expect(page.locator('.reward-ad')).toHaveCount(0);
 await expect(page.locator('.undo-control')).toHaveAttribute('data-undo-state','used');
});

test('prepared credit is retained through a helper barrier and needs no second ad',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=performance');await move(page);await prepare(page);
 await page.locator('.helper-type-0').click();await page.locator('[data-cell="0"]').click();await settled(page);
 await expect(page.locator('.undo-control')).toBeDisabled();await expect(page.locator('.undo-notice')).toContainText('still prepared');const before=await state(page);
 await move(page);await expect(page.locator('.undo-control')).toBeEnabled();await page.locator('.undo-control').click();
 expect(await state(page)).toEqual(before);await expect(page.locator('.reward-ad')).toHaveCount(0);await expect(page.locator('.helper-type-0')).toHaveClass(/empty-stock/);
});

test('retry drops an unused prepared credit and never applies the old turn',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=exhausted');await move(page);await prepare(page);
 await page.locator('.out-of-moves>.keep-playing').first().click();await expect(page.locator('.undo-control')).toHaveAttribute('data-undo-state','ad');await expect(page.locator('.undo-control')).toBeDisabled();
 await move(page);await page.locator('.undo-control').click();await expect(page.locator('.reward-ad')).toBeVisible();
});

test('Czech preparation and use show separate visible confirmations',async({page})=>{
 await page.goto('/tests/browser/fixture.html?result=performance&lang=cs');await move(page);await prepare(page);
 await expect(page.locator('.undo-notice')).toContainText('Krok zpět připraven');
 await expect(page.locator('.undo-control')).toHaveAttribute('aria-label','Vrátit poslední tah');
 await page.locator('.undo-control').click();await expect(page.locator('.undo-notice')).toHaveText('Tah vrácen.');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

for(const outcome of ['viewed','dismissed','blocked'])test(`Google undo reward ${outcome}`,async({page})=>{
 await page.route('**/pagead/js/adsbygoogle.js?*',r=>outcome==='blocked'?r.abort():r.fulfill({contentType:'text/javascript',body:mockSDK(outcome)}));
 await page.goto('/tests/browser/fixture.html?result=performance&ads_test=google');
 const before=await state(page);await move(page);const after=await state(page);await page.locator('.undo-control').click();
 const reward=page.locator('.reward-ad');await expect(reward).toHaveAttribute('data-ad-mode','test');
 if(outcome==='blocked'){
  await expect(reward).toContainText('could not load');await reward.locator('button').last().click();
 }else{
  await reward.locator('.primary').click();await expect(page.locator('#google-test-finish')).toBeVisible();await page.locator('#google-test-finish').click();
  if(outcome==='dismissed'){await expect(reward).toContainText('No reward was granted');await reward.locator('button').last().click();}
  else await expect(reward).toHaveCount(0);
 }
 expect(await state(page)).toEqual(after);
 await expect(page.locator('.undo-control')).toBeEnabled();
 if(outcome==='viewed'){
  await expect(page.locator('.undo-control')).toHaveAttribute('data-undo-state','ready');
  await page.locator('.undo-control').click();expect(await state(page)).toEqual(before);await expect(page.locator('.reward-ad')).toHaveCount(0);
  await expect(page.locator('.undo-control')).toBeDisabled();
 }else await expect(page.locator('.undo-control')).toHaveAttribute('data-undo-state','ad');
});
