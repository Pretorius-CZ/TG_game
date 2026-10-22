import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.route(/supabase\.co|country\.is/,route=>route.fulfill({status:200,contentType:'application/json',body:'null'}));
 await page.addInitScript(()=>localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()})));
});

test('first visit follows browser language and saved choice wins across game, site and legal pages',async({browser})=>{
 const context=await browser.newContext({locale:'cs-CZ',viewport:{width:320,height:568}}),page=await context.newPage();
 await page.route(/supabase\.co|country\.is/,route=>route.fulfill({status:200,contentType:'application/json',body:'null'}));
 await page.addInitScript(()=>localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()})));
 await page.goto('http://127.0.0.1:5181/welcome.html');
 await expect(page.locator('html')).toHaveAttribute('lang','cs');
 await expect(page.locator('[data-text="contentNote"]')).toContainText('200 levelů');
 await expect(page.locator('#update-list article')).toHaveCount(5);
 await expect(page.locator('#update-list article').first()).toContainText('200');
 await page.locator('[data-language="en"]').click();
 await expect(page.locator('[data-text="play"]').first()).toHaveText('Play free');
 await page.goto('http://127.0.0.1:5181/privacy.html');await expect(page.locator('html')).toHaveAttribute('lang','en');
 await expect(page.locator('[data-copy="en"]')).toBeVisible();await expect(page.locator('[data-copy="cs"]')).toBeHidden();
 await page.goto('http://127.0.0.1:5181/');await expect(page.locator('.welcome-play')).toHaveText('PLAY');
 await page.locator('.welcome-settings select').selectOption('cs');await expect(page.locator('.welcome-play')).toHaveText('HRÁT');
 await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','cs');
 await page.goto('http://127.0.0.1:5181/contact.html');await expect(page.locator('[data-copy="cs"]')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await context.close();
});

test('language changes from the site preserve the active board, moves and local progress',async({page,context})=>{
 await page.addInitScript(()=>localStorage.setItem('to-the-stars-language','en'));
 await page.goto('/tests/browser/fixture.html?result=performance');
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
 const before=await page.locator('[data-cell]').evaluateAll(cells=>cells.map(cell=>[cell.dataset.cell,cell.dataset.type]));
 const moves=await page.locator('.moves-counter strong').textContent();
 await page.evaluate(()=>localStorage.setItem('to-the-stars-progress-v1:language-check','preserve'));
 const site=await context.newPage();await site.goto('/welcome.html');await site.locator('[data-language="cs"]').click();
 await expect(page.locator('html')).toHaveAttribute('lang','cs');
 expect(await page.locator('[data-cell]').evaluateAll(cells=>cells.map(cell=>[cell.dataset.cell,cell.dataset.type]))).toEqual(before);
 expect(await page.locator('.moves-counter strong').textContent()).toBe(moves);
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1:language-check'))).toBe('preserve');
 await expect(page.locator('.hint-control>span')).toHaveText('Nápověda');
 await site.close();
});

test('public selectors hide drafts and the small-screen page has no missing messages or overflow',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/welcome.html');
 expect(await page.locator('[data-language]').evaluateAll(buttons=>buttons.map(button=>button.dataset.language))).toEqual(['en','cs']);
 for(const language of ['en','cs']){
  await page.locator(`[data-language="${language}"]`).click();
  expect(new URL(await page.locator('.game-link').first().getAttribute('href')).searchParams.get('lang')).toBe(language);
  const copy=await page.locator('[data-text],[data-alt],[data-label]').evaluateAll(nodes=>nodes.map(node=>node.textContent+' '+node.getAttribute('alt')+' '+node.getAttribute('aria-label')).join('\n'));
  expect(copy).not.toMatch(/\b(?:web|news)\.[a-zA-Z]/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.screenshot({path:testInfo.outputPath('website-cs.png')});expect(errors).toEqual([]);
 await page.goto('/');await expect(page.locator('.welcome-settings select option')).toHaveCount(2);
});
