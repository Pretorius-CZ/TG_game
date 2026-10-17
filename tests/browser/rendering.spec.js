import {test,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';

// Diagnostic, deliberately separate from solver clicks and screenshots.
// Compare on the same runner; these numbers are not physical phone FPS.
test('record rendering with and without backdrop blur on a real game scene',async({page,browserName},testInfo)=>{
 test.setTimeout(60000);
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:1366,height:768});
 await page.goto('/');await page.locator('.welcome-play').click();await page.locator('.intro-skip').click();
 await page.locator('.repair-bubble-dialog .primary').click();await expect(page.locator('.board')).toBeVisible();
 expect(await page.locator('.mini-dialog').evaluate(el=>getComputedStyle(el,'::backdrop').backdropFilter)).toBe('none');
 const cdp=browserName==='chromium'?await page.context().newCDPSession(page):null;
 if(cdp)await cdp.send('Tracing.start',{categories:'devtools.timeline,blink.user_timing',transferMode:'ReturnAsStream'});
 const samples=[];
 for(const blur of [true,false,true]){
  const style=await page.addStyleTag({content:`.mini-dialog::backdrop{backdrop-filter:${blur?'blur(5px)':'none'}!important}`});
  const frames=await page.evaluate(()=>new Promise(resolve=>{
   const durations=[];let started,last;
   function frame(now){if(last)durations.push(now-last);last=now;started??=now;if(now-started<1500)requestAnimationFrame(frame);else resolve(durations);}
   requestAnimationFrame(frame);
  }));
  samples.push({blur,frameMs:frames,animations:await page.evaluate(()=>document.getAnimations().length)});
  await style.evaluate(el=>el.remove());
 }
 if(cdp){
  const completed=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve));
  await cdp.send('Tracing.end');const {stream}=await completed;let trace='';
  for(;;){const chunk=await cdp.send('IO.read',{handle:stream});trace+=chunk.base64Encoded?Buffer.from(chunk.data,'base64').toString():chunk.data;if(chunk.eof)break;}
  await cdp.send('IO.close',{handle:stream});await cdp.detach();
  await writeFile(testInfo.outputPath('rendering-trace.json'),trace);
 }
 const environment=await page.evaluate(()=>{
  const gl=document.createElement('canvas').getContext('webgl'),ext=gl?.getExtension('WEBGL_debug_renderer_info');
  return {userAgent:navigator.userAgent,viewport:[innerWidth,innerHeight],dpr:devicePixelRatio,renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):null};
 });
 await writeFile(testInfo.outputPath('rendering.json'),JSON.stringify({browser:page.context().browser().version(),engine:browserName,environment,samples},null,2));
 await testInfo.attach('rendering.json',{path:testInfo.outputPath('rendering.json'),contentType:'application/json'});
});
