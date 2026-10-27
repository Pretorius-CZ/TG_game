import {test,expect} from '@playwright/test';
test.skip(process.env.PRODUCTION_LOCALE_TEST!=='1','Requires a production preview, not the Vite development server');
test('an unsupported preview URL cannot enable an unsupported language in a production build',async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(()=>{
  localStorage.setItem('to-the-stars-language','cs');
  localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));
 });
 await page.goto('/?previewLanguage=it&lang=it');
 await expect(page.locator('html')).toHaveAttribute('lang','cs');
 expect(await page.locator('.welcome-settings select option').evaluateAll(options=>options.map(o=>o.value))).toEqual(['en','cs','de','fr','es','pt-BR']);
 await expect(page.locator('.welcome-play')).toHaveText('HRÁT');
 await page.goto('/transfer.html?previewLanguage=it&lang=it');
 await expect(page.locator('html')).toHaveAttribute('lang','cs');
 await expect(page.locator('h1')).toHaveText('Zachovat uloženou hru');
});
