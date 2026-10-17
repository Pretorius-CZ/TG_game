import {test,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import {findMove} from '../../src/match3.js';

test.beforeEach(async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
});
test('fifty completed mount cycles release level dialogs and listeners',async({page,browserName},testInfo)=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const cdp=browserName==='chromium'?await page.context().newCDPSession(page):null;
 await page.goto('/tests/browser/fixture.html?result=won&cycles');
 const samples=[];
 for(let cycle=1;cycle<=50;cycle++){
  await expect(page.locator('.board')).toBeVisible();
  const board=await page.locator('[data-cell]').evaluateAll(c=>c.map(el=>+el.dataset.type));
  for(const i of findMove(board,7))await page.locator(`[data-cell="${i}"]`).click();
  await expect(page.locator('.win-panel')).toBeVisible({timeout:10000});
  await page.locator('.win-panel .primary').click();
  await expect(page.locator('dialog.mini-dialog')).toHaveCount(0);
  if([5,25,50].includes(cycle)){
   if(cdp)await cdp.send('HeapProfiler.collectGarbage');
   samples.push({cycle,...await page.evaluate(()=>({elements:document.querySelectorAll('*').length,animations:document.getAnimations().length})),
    ...(cdp?await cdp.send('Memory.getDOMCounters'):{}),...(cdp?await cdp.send('Runtime.getHeapUsage'):{})});
  }
  if(cycle<50)await page.locator('#reopen').click();
 }
 expect(errors).toEqual([]);expect(samples.at(-1).elements).toBe(samples[0].elements);
 expect(samples.at(-1).animations).toBe(0);
 if(cdp){expect(samples.at(-1).jsEventListeners).toBeLessThanOrEqual(samples[0].jsEventListeners+5);await cdp.detach();}
 await writeFile(testInfo.outputPath('memory-cycles.json'),JSON.stringify({engine:browserName,browser:page.context().browser().version(),gc:!!cdp,samples},null,2));
 await testInfo.attach('memory-cycles.json',{path:testInfo.outputPath('memory-cycles.json'),contentType:'application/json'});
});

test('scene layout settles instead of repeatedly changing zoom',async({page})=>{
 await page.goto('/');await page.locator('.welcome-play').click();await page.locator('.intro-skip').click();
 await page.locator('.repair-bubble-dialog .close').click();
 await expect.poll(()=>page.locator('.game').evaluate(el=>el.style.zoom)).not.toBe('');
 const changes=await page.locator('.game').evaluate(el=>new Promise(resolve=>{
  let count=0;const observer=new MutationObserver(()=>count++);
  observer.observe(el,{attributes:true,attributeFilter:['style']});
  setTimeout(()=>{observer.disconnect();resolve(count);},1000);
 }));
 expect(changes).toBeLessThan(4);
});

test('cold load records decoded art, LCP element and resource timings',async({browser},testInfo)=>{
 const samples=[];
 for(let repeat=0;repeat<5;repeat++){
  const context=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'reduce'});
  const page=await context.newPage();await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
  await page.addInitScript(()=>{
   window.qaLcp=[];
   if(PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint'))new PerformanceObserver(list=>{
    window.qaLcp.push(...list.getEntries().map(e=>({time:e.startTime,url:e.url,tag:e.element?.tagName,className:e.element?.className,size:e.size})));
   }).observe({type:'largest-contentful-paint',buffered:true});
  });
  await page.goto(testInfo.project.use.baseURL??'http://127.0.0.1:5181');
  await expect(page.locator('.welcome[data-art-ready="true"]')).toBeVisible();
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  samples.push(await page.evaluate(()=>({artReadyMs:performance.now(),lcp:window.qaLcp,
   resources:performance.getEntriesByType('resource').map(r=>({url:r.name,start:r.startTime,duration:r.duration,bytes:r.transferSize,decoded:r.decodedBodySize})),
   environment:{userAgent:navigator.userAgent,viewport:[innerWidth,innerHeight],dpr:devicePixelRatio}})));
  await context.close();
 }
 await writeFile(testInfo.outputPath('cold-load.json'),JSON.stringify({mode:'local development, external services stubbed; not production network benchmark',samples},null,2));
 await testInfo.attach('cold-load.json',{path:testInfo.outputPath('cold-load.json'),contentType:'application/json'});
 expect(samples.every(s=>!s.resources.some(r=>r.url.includes('/scenes/')))).toBe(true);
});
