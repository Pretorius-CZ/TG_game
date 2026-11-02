import {test,expect} from '@playwright/test';
import {findMove} from '../../src/match3.js';

test('new-network preview plays independently on a narrow phone',async({page})=>{
 await page.setViewportSize({width:320,height:740});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/tests/browser/network-preview.html');
 await expect(page.locator('select option')).toHaveCount(10);
 await expect(page.locator('.route-board button')).toHaveCount(56);
 const board=await page.locator('.route-board button').evaluateAll(cells=>cells.map(cell=>Number(cell.getAttribute('aria-label').match(/typ (\d+)/)[1])-1));
 const [a,b]=findMove(board,7);
 await page.locator('.route-board button').nth(a).click();
 await page.locator('.route-board button').nth(b).click();
 await expect(page.locator('section strong')).toHaveText('Tahy: 21');
 await expect(page.getByRole('status')).not.toHaveText('Probíhá kaskáda…');
 await page.locator('select').selectOption('9');
 await expect(page.locator('.node')).toHaveCount(3);
 await expect(page.locator('.node.active')).toHaveCount(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1'))).toBeNull();
 expect(errors).toEqual([]);
 await expect.poll(()=>page.locator('.route-board img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
 await page.screenshot({path:'.local/network-preview-320.png',fullPage:true});
});
