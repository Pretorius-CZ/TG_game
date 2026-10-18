import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{await page.addInitScript(()=>{if(!localStorage.getItem('beyond-signal-analytics-choice-v1'))localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));});});
test.beforeEach(async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
});
async function enter(page){
 await page.locator('.welcome-play').click();await page.locator('.intro-skip').click();
 await page.locator('.repair-bubble-dialog .close').click();
}
test('welcome fetches no future scenes and exposes decoded artwork',async({page})=>{
 const scenes=[];page.on('request',r=>{if(r.url().includes('/scenes/'))scenes.push(r.url());});
 await page.goto('/');await expect(page.locator('.welcome[data-art-ready="true"]')).toBeVisible();
 await page.waitForTimeout(600);expect(scenes).toEqual([]);
 await enter(page);await expect(page.locator('.game .loading')).toHaveCount(0);
 await expect(page.locator('.game [data-room="airlock"] img.scene-layer')).toHaveCount(1);
 expect(scenes.some(src=>/cockpit-|airlock-[234]/.test(src))).toBe(false);
});
test('failed future scene does not block this room; required scene retries',async({page})=>{
 let fail=true;
 await page.route('**/scenes/airlock-1.webp',r=>fail?r.abort():r.continue());
 await page.goto('/');await enter(page);
 await expect(page.locator('.game .loading')).toHaveCount(0);
 await page.locator('.game .repair-hotspot').last().click();
 await page.locator('.repair-bubble-dialog .preview-complete').click();
 await expect(page.locator('.game .loading')).toBeVisible();
 await expect(page.locator('.game .loading .primary')).toBeVisible();
 fail=false;await page.locator('.game .loading .primary').click();
 await expect(page.locator('.game .loading')).toHaveCount(0);
 await expect(page.locator('.game .scene-layer')).toHaveAttribute('src','./scenes/airlock-1.webp');
});
test('welcome artwork failure can recover while navigation stays available',async({page})=>{
 let fail=true;await page.route('**/intro/signal.webp',r=>fail?r.abort():r.continue());
 await page.goto('/');await expect(page.locator('.intro-loading button')).toBeVisible();
 await expect(page.locator('.welcome-play')).toBeEnabled();
 fail=false;await page.locator('.intro-loading button').click();
 await expect(page.locator('.welcome[data-art-ready="true"]')).toBeVisible();
});
