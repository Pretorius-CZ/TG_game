import {test,expect} from '@playwright/test';
import {websiteLocales,websiteAddress} from '../../src/i18n/websiteLocales.js';

test.beforeEach(async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.route(/supabase\.co|country\.is/,route=>route.fulfill({status:200,contentType:'application/json',body:'null'}));
 await page.addInitScript(()=>localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()})));
});

test('first visit detects Czech, website selection persists independently of game language',async({browser})=>{
 const context=await browser.newContext({locale:'cs-CZ',viewport:{width:320,height:568}}),page=await context.newPage();
 await page.route(/supabase\.co|country\.is/,route=>route.fulfill({status:200,contentType:'application/json',body:'null'}));
 await page.addInitScript(()=>localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()})));
 await page.goto('http://127.0.0.1:5181/welcome.html');
 await expect(page.locator('html')).toHaveAttribute('lang','cs');
 await expect(page.locator('[data-text="contentNote"]')).toContainText('200 levelů');
 await expect(page.locator('#update-list article')).toHaveCount(7);
 await page.locator('[data-website-language]').selectOption('en');
 await expect(page.locator('[data-text="play"]').first()).toHaveText('Play free');
 await page.goto('http://127.0.0.1:5181/privacy.html');
 await expect(page.locator('html')).toHaveAttribute('lang','en');
 await expect(page.locator('[data-copy="en"]')).toBeVisible();
 await page.goto('http://127.0.0.1:5181/');
 await expect(page.locator('.welcome-play')).toHaveText('HRÁT');
 await page.locator('.welcome-settings select').selectOption('en');
 await expect(page.locator('.welcome-play')).toHaveText('PLAY');
 await page.goto('http://127.0.0.1:5181/cs/contact.html');
 await expect(page.locator('[data-copy="cs"]')).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe('en');
 await context.close();
});

test('website selection never changes an active game board, moves or saved game language',async({page,context})=>{
 await page.addInitScript(()=>localStorage.setItem('to-the-stars-language','en'));
 await page.goto('/tests/browser/fixture.html?result=performance');
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
 const before=await page.locator('[data-cell]').evaluateAll(cells=>cells.map(cell=>[cell.dataset.cell,cell.dataset.type]));
 const moves=await page.locator('.moves-counter strong').textContent();
 await page.evaluate(()=>localStorage.setItem('to-the-stars-progress-v1:language-check','preserve'));
 const site=await context.newPage();await site.goto('/welcome.html');await site.locator('[data-website-language]').selectOption('de');
 await expect(site.locator('html')).toHaveAttribute('lang','de');
 await expect(page.locator('html')).toHaveAttribute('lang','en');
 expect(await page.locator('[data-cell]').evaluateAll(cells=>cells.map(cell=>[cell.dataset.cell,cell.dataset.type]))).toEqual(before);
 expect(await page.locator('.moves-counter strong').textContent()).toBe(moves);
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1:language-check'))).toBe('preserve');
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe('en');
 await site.close();
});

test('all website choices map PLAY correctly and game still exposes only complete game translations',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/welcome.html');
 expect(await page.locator('[data-website-language] option').evaluateAll(options=>options.map(option=>option.value))).toEqual(websiteLocales.map(locale=>locale.code));
 for(const {code} of websiteLocales){
  const nextAddress=websiteAddress(page.url(),code);await Promise.all([page.waitForURL(nextAddress),page.locator('[data-website-language]').selectOption(code)]);await page.waitForLoadState('load');
  await expect(page.locator('html')).toHaveAttribute('lang',code);
  expect(new URL(await page.locator('.game-link').first().getAttribute('href')).searchParams.get('lang')).toBe(['cs','de'].includes(code)?code:'en');
  const copy=await page.locator('[data-text],[data-alt],[data-label]').evaluateAll(nodes=>nodes.map(node=>node.textContent+' '+node.getAttribute('alt')+' '+node.getAttribute('aria-label')).join('\n'));
  expect(copy).not.toMatch(/\b(?:web|news)\.[a-zA-Z]/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  // Read-more links must remain articles, even though they share transfer-link styling.
  expect(new URL(await page.locator('[data-text="site.about"]').evaluate(link=>link.href)).pathname).toBe((code==='en'?'/':`/${code}/`)+'about.html');
 }
 await page.screenshot({path:testInfo.outputPath('website-pt-BR.png')});expect(errors).toEqual([]);
 await page.goto('/');await expect(page.locator('.welcome-settings select option')).toHaveCount(3);
});
