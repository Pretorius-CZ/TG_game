import {test,expect} from '@playwright/test';
const user='12345678-1234-4234-9234-123456789abc';
test('existing account on the game subdomain receives no second starter pack, imported stock remains usable',async({context,page,baseURL})=>{
 await page.route('https://game.playbeyondthesignal.com/**',async route=>{
  const url=new URL(route.request().url());
  const response=await context.request.get(new URL(url.pathname+url.search,baseURL).href);await route.fulfill({response});
 });
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.goto(`https://game.playbeyondthesignal.com/tests/browser/fixture.html?stock-user=${user}`);
 await expect(page.locator('.board')).toBeVisible();await expect(page.locator('.helper-tile.in-stock')).toHaveCount(0);
 await expect(page.locator('.helper-tile.empty-stock')).toHaveCount(5);
 await page.evaluate(id=>localStorage.setItem(`to-the-stars-helpers-v1:${id}:0`,'[0,1,0,0,1]'),user);
 await page.reload();await expect(page.locator('.helper-tile.in-stock')).toHaveCount(2);
 await expect(page.locator('.helper-type-1')).toHaveClass(/in-stock/);await expect(page.locator('.helper-type-4')).toHaveClass(/in-stock/);
});
