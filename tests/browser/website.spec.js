import {test,expect} from '@playwright/test';
import {sitePages} from '../../src/sitePages.js';
import {websiteLocales} from '../../src/i18n/websiteLocales.js';
import {updates} from '../../src/welcomeUpdates.js';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),axePath=require.resolve('axe-core/axe.min.js');

for(const {code:language} of websiteLocales)for(const width of [320,1440])test(`public guides, navigation and accessibility ${language} ${width}`,async({page},testInfo)=>{
 await page.setViewportSize({width,height:width===320?568:900});
 await page.addInitScript(code=>localStorage.setItem('to-the-stars-language',code),language);
 const errors=[],external=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route(/supabase\.co|country\.is|googlesyndication\.com/,route=>{external.push(route.request().url());return route.abort();});
 for(const entry of sitePages){
  await page.goto((language==='en'?'/':`/${language}/`)+entry.file);await expect(page.locator('html')).toHaveAttribute('lang',language);
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.title()).not.toMatch(/web\./);
  expect(await page.locator('.article-copy').innerText()).not.toMatch(/\bweb\.[a-zA-Z]/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const image of await page.locator('img').all()){await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate(node=>node.complete&&node.naturalWidth>0)).toBe(true);}
  const href=await page.locator('.game-link').first().getAttribute('href');expect(new URL(href).searchParams.get('lang')).toBe(language==='cs'?'cs':'en');
  await page.addScriptTag({path:axePath});
  const violations=await page.evaluate(async()=>{const result=await axe.run('body',{runOnly:{type:'rule',values:['color-contrast','link-name','button-name','image-alt','page-has-heading-one']}});return result.violations.map(item=>({id:item.id,nodes:item.nodes.map(node=>node.target)}));});
  expect(violations).toEqual([]);
 }
 expect(errors).toEqual([]);expect(external).toEqual([]);
 await page.goto((language==='en'?'/':`/${language}/`)+'tools-and-obstacles.html');await page.screenshot({path:testInfo.outputPath('guide.png'),fullPage:true});
});

test('guides and published updates remain readable without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false}),page=await context.newPage();
 for(const {code} of websiteLocales)for(const entry of sitePages){
  await page.goto('http://127.0.0.1:5181/'+(code==='en'?'':code+'/')+entry.file);
  await expect(page.locator('html')).toHaveAttribute('lang',code);
  await expect(page.locator('h1')).toBeVisible();
  expect((await page.locator('.article-copy').innerText()).length).toBeGreaterThan(500);
  if(entry.news)await expect(page.locator('.update')).toHaveCount(updates.length);
 }
 await context.close();
});
