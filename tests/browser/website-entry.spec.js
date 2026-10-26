import {test,expect} from '@playwright/test';
import {websiteLocales,websiteAddress} from '../../src/i18n/websiteLocales.js';

for(const width of [320,1440])test(`localized home and legal entry pages fit ${width}`,async({page},info)=>{
 await page.setViewportSize({width,height:width===320?568:900});
 const errors=[],external=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route(/supabase\.co|country\.is|googlesyndication\.com/,route=>{external.push(route.request().url());return route.abort();});
 for(const {code} of websiteLocales)for(const file of ['index.html','contact.html','privacy.html']){
  const prefix=code==='en'?'/':`/${code}/`;
  await page.goto(prefix+(code==='en'&&file==='index.html'?'welcome.html':file)+(code==='en'?'?lang=en':''));
  await expect(page.locator('html')).toHaveAttribute('lang',code);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('[data-website-language]')).toHaveValue(code);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const link of await page.locator('.game-link').all())expect(new URL(await link.getAttribute('href')).searchParams.get('lang')).toBe(['cs','de'].includes(code)?code:'en');
  if(file==='index.html'){
   await expect(page.locator('[data-text="contentNote"]')).toContainText('200');
   await expect(page.locator('.game-language-note').first()).toBeVisible();
   await expect(page.locator('.update')).toHaveCount(8);
   await expect(page.locator('.update').first().locator('time')).toHaveAttribute('datetime','2026-10-26');
   await expect(page.locator('.update').first()).toContainText('Deutsch');
   await page.screenshot({path:info.outputPath(`${code}-home.png`),fullPage:true});
  }
  if(file==='privacy.html'){
   await expect(page.locator('[data-copy]')).toHaveCount(1);
   await expect(page.locator('a[href="mailto:flambiz.cz@gmail.com"]')).toBeVisible();
  }
 }
 expect(errors).toEqual([]);expect(external).toEqual([]);
});

test('explicit English remains usable without localStorage',async({browser})=>{
 const context=await browser.newContext({locale:'de-DE'}),page=await context.newPage();
 await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError');}}));
 await page.goto('http://127.0.0.1:5181/de/');
 await page.locator('[data-website-language]').selectOption('en');
 await expect(page.locator('html')).toHaveAttribute('lang','en');
 await page.locator('[data-text="site.about"]').click();
 await expect(page.locator('html')).toHaveAttribute('lang','en');
 await expect(page).toHaveURL(/about.html\?lang=en$/);
 await context.close();
});
