import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
});

for(const language of ['en','cs'])for(const viewport of [{width:320,height:568},{width:390,height:664},{width:430,height:739}]){
 test(`help fits without scrolling ${viewport.width} ${language}`,async({page},testInfo)=>{
  await page.setViewportSize(viewport);
  await page.addInitScript(l=>localStorage.setItem('to-the-stars-language',l),language);
  await page.goto('/tests/browser/fixture.html?stress');
  await expect(page.locator('.board')).toBeVisible();
  const before=await page.locator('.board').innerHTML();
  await page.locator('.mechanics-help').click();
  const help=page.locator('.mechanic-tutorial');
  async function fits(){
   const metrics=await help.evaluate(h=>{
    const s=h.querySelector('section'),b=h.querySelector('.primary'),r=b.getBoundingClientRect();
    return {section:s.scrollHeight-s.clientHeight,overlay:h.scrollHeight-h.clientHeight,
     hit:b.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)),bottom:r.bottom,overflow:document.documentElement.scrollWidth>innerWidth};
   });
   expect(metrics.section).toBeLessThanOrEqual(2);expect(metrics.overlay).toBeLessThanOrEqual(2);
   expect(metrics.hit).toBe(true);expect(metrics.bottom).toBeLessThanOrEqual(viewport.height);expect(metrics.overflow).toBe(false);
  }
  for(const topic of ['charges','covers','resonators','helpers','laser','shuffle','swap','beam','emp']){
   await help.locator('select').selectOption(topic);await fits();
   if(topic==='charges'){
    await expect(help.locator('.tutorial-patterns figure')).toHaveCount(4);
    await help.locator('.primary').click();await fits();
    await expect(help.locator('.tutorial-patterns figure')).toHaveCount(2);
    await page.screenshot({path:testInfo.outputPath('help-use.png')});
   }
  }
  await help.locator('.primary').click();await expect(help).toHaveCount(0);
  expect(await page.locator('.board').innerHTML()).toBe(before);
 });
}

for(const viewport of [{width:320,height:568},{width:768,height:1024},{width:1440,height:900}]){
 test(`website guides and navigation ${viewport.width}`,async({page},testInfo)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize(viewport);
  await page.goto('/welcome.html?utm_source=automated_test&utm_medium=bot&utm_campaign=website_preview');
  for(const language of ['en','cs']){
   await page.locator(`[data-language=${language}]`).click();
   await expect(page.locator('html')).toHaveAttribute('lang',language);
   await expect(page.locator('#guides details')).toHaveCount(5);
   await expect(page.locator('#update-list .update').first()).toContainText(language==='cs'?'Více místa':'More room');
   for(const detail of await page.locator('#guides details').all()){
    if(!await detail.getAttribute('open').then(v=>v!==null))await detail.locator('summary').click();
    await expect(detail.locator('p').first()).toBeVisible();
   }
   expect(await page.locator('.game-link').evaluateAll(links=>links.every(a=>new URL(a.href).origin==='https://game.playbeyondthesignal.com'&&new URL(a.href).searchParams.get('utm_campaign')==='website_preview'))).toBe(true);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
   await page.screenshot({path:testInfo.outputPath(`website-${language}.png`),fullPage:true});
  }
  await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','cs');
  expect(errors).toEqual([]);
 });
}
