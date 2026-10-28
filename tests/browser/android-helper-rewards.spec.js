import {test,expect} from '@playwright/test';

test.skip(process.env.ANDROID_HELPER_TEST!=='1','Requires Android Vite mode and a mocked native ad adapter');
for(const language of ['en','cs'])for(const outcome of ['viewed','dismissed','error']){
 test(`Android helper refill ${language} ${outcome}`,async({page})=>{
  await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
  await page.route(/\/src\/androidAds\.js/,r=>r.fulfill({contentType:'application/javascript',body:`export async function androidMovesAd(){${outcome==='error'?'throw Error("No ad")':`return ${outcome==='viewed'}`};}`}));
  await page.addInitScript(()=>localStorage.setItem('beyond-signal-android-audience-v1',JSON.stringify({version:1,group:'adult'})));
 await page.addInitScript(lang=>{
   localStorage.setItem('to-the-stars-language',lang);
   localStorage.setItem('to-the-stars-helpers-v1:guest:0',JSON.stringify([0,0,1,0,0]));
  },language);
  await page.goto('/tests/browser/fixture.html?result=performance');
  const laser=page.locator('.helper-type-0'),shuffle=page.locator('.helper-type-1'),owned=page.locator('.helper-type-2');
  await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
  const board=()=>page.locator('[data-cell]').evaluateAll(cells=>cells.map(c=>c.dataset.type));
  const before=await board();
  await expect(laser).toBeEnabled();await laser.click();
  await expect(page.locator('#android-ad-title')).toHaveText(language==='cs'?'Boost za reklamu':'Watch an ad for a boost');
  await expect(page.locator('.reward-ad')).not.toContainText('+5');
  await page.locator('.reward-ad .primary').click();
  if(outcome==='viewed'){
   await expect(page.locator('.reward-ad')).toHaveCount(0);
   await expect(laser.locator('.helper-badge')).toHaveText('1');
   expect(await board()).toEqual(before);
   await expect(laser).toHaveAttribute('aria-pressed','false');
   await expect(shuffle).toBeDisabled();await expect(owned).toBeEnabled();
   expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-helpers-v1:guest:0')))).toEqual([1,0,1,0,0]);
   await laser.click();await expect(laser).toHaveAttribute('aria-pressed','true');
   await page.locator('[data-cell]').first().click();
   await expect(laser.locator('.helper-badge')).toHaveText('0');
   await expect(laser).toBeDisabled();await expect(owned).toBeEnabled();
  }else{
   await expect(page.locator('.reward-ad [role="alert"]')).toBeVisible();
   await page.locator('.reward-ad button').last().click();
   await expect(laser).toBeEnabled();await expect(shuffle).toBeEnabled();
   expect(await board()).toEqual(before);
   expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-helpers-v1:guest:0')))).toEqual([0,0,1,0,0]);
  }
 });
}
