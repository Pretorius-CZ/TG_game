import {test,expect} from '@playwright/test';
import {findMove} from '../../src/match3.js';
import {iceMove} from '../../src/levelRules.js';
import {normalizeProgress} from '../../src/progressStorage.js';
import {journeyStories} from '../../src/journeyStories.js';

test.beforeEach(async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
});

for(const language of ['en','cs'])for(const viewport of [{width:320,height:568},{width:320,height:658},{width:430,height:739},{width:768,height:1024},{width:1920,height:1080}]){
 test(`board fits ${viewport.width}x${viewport.height} ${language}`,async({page},testInfo)=>{
  await page.setViewportSize(viewport);
  await page.addInitScript(language=>localStorage.setItem('to-the-stars-language',language),language);
  await page.goto('/tests/browser/fixture.html?stress');
  const board=page.locator('.board');await expect(board).toBeVisible();
  await board.locator('img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
  await page.waitForTimeout(250);
  await expect(page.locator('.mechanic-tutorial')).toHaveCount(0);
  await expect.poll(async()=>board.evaluate(b=>b.getBoundingClientRect().width)).toBeGreaterThan(210);
  const metrics=await page.evaluate(()=>{
   const dialog=document.querySelector('.mini-dialog'),board=document.querySelector('.board'),cells=[...board.querySelectorAll('.cell')];
   const r=board.getBoundingClientRect();
   return {boardWidth:r.width,boardHeight:r.height,cell:Math.min(...cells.map(c=>c.getBoundingClientRect().width)),overflow:document.documentElement.scrollWidth>innerWidth,dialogScroll:dialog.scrollHeight-dialog.clientHeight,buttons:[...dialog.querySelectorAll('.close,.mechanics-help,.helper-tile')].map(b=>{const r=b.getBoundingClientRect();return {w:r.width,h:r.height,hit:b.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};})};
  });
  console.log(`${testInfo.project.name} ${viewport.width}x${viewport.height} ${language}: cell=${metrics.cell}, board=${metrics.boardWidth}, scroll=${metrics.dialogScroll}`);
  expect(metrics.cell).toBeGreaterThanOrEqual(24);
  expect(metrics.overflow).toBe(false);
  expect(metrics.buttons.every(b=>b.w>=24&&b.h>=24&&b.hit)).toBe(true);
  if(viewport.height>=568)expect(metrics.dialogScroll).toBeLessThanOrEqual(2);
  if(viewport.width>=768)expect(metrics.boardWidth).toBeGreaterThan(450);
  await page.screenshot({path:testInfo.outputPath('board.png')});
  await testInfo.attach('layout.json',{body:JSON.stringify(await page.locator('.mini-dialog').evaluate(d=>({dialog:d.getBoundingClientRect().toJSON(),scroll:d.scrollHeight,client:d.clientHeight,children:[...d.children].map(c=>({class:c.className,rect:c.getBoundingClientRect().toJSON(),css:getComputedStyle(c).flex}))}))),contentType:'application/json'});
 });
}

test('portrait prompt preserves the board and blocks input',async({browser,browserName})=>{
 test.skip(browserName==='firefox','Touch emulation is not available in Firefox.');
 const context=await browser.newContext({viewport:{width:430,height:739},hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();await page.route(/supabase\.co/,r=>r.fulfill({status:204,body:''}));
 await page.goto('/tests/browser/fixture.html');await expect(page.locator('.board')).toBeVisible();
 const before=await page.locator('.board').innerHTML();
 await page.setViewportSize({width:863,height:360});
 await expect(page.locator('.orientation-guard')).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.locator('.orientation-guard')).toBeVisible();
 await expect(page.locator('.mini-dialog')).toHaveJSProperty('open',true);
 expect(await page.evaluate(()=>document.elementFromPoint(innerWidth/2,innerHeight/2)?.closest('dialog')?.className)).toBe('orientation-guard');
 await page.setViewportSize({width:430,height:739});await expect(page.locator('.orientation-guard')).not.toBeVisible();
 expect(await page.locator('.board').innerHTML()).toBe(before);
 await context.close();
});

for(const viewport of [{width:320,height:568},{width:430,height:739},{width:1366,height:768}])test(`scene controls retain their size ${viewport.width}x${viewport.height}`,async({page},testInfo)=>{
 await page.setViewportSize(viewport);await page.goto('/');
 await page.locator('.welcome-play').click();await page.locator('.intro-skip').click();
 await expect(page.locator('.play-area .game')).toBeVisible();
 await page.locator('.repair-bubble-dialog .close').click();
 await expect.poll(()=>page.locator('.play-area').evaluate(el=>el.style.width)).not.toBe('');
 const metrics=await page.locator('.play-area').evaluate(area=>({
  overflow:document.documentElement.scrollWidth>innerWidth,
  buttons:[...area.querySelectorAll('.scene-tools>button,.scene-tools summary,.audio-icons button')].map(b=>{const r=b.getBoundingClientRect();return {w:r.width,h:r.height,hit:b.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};})
 }));
 expect(metrics.overflow).toBe(false);expect(metrics.buttons.every(b=>b.w>=24&&b.h>=24&&b.hit)).toBe(true);
 await page.locator('.journey-guide summary').click();await expect(page.locator('.journey-panel')).toBeVisible();
 await page.locator('.journey-guide summary').click();await expect(page.locator('.journey-panel')).not.toBeVisible();
 await page.screenshot({path:testInfo.outputPath('scene.png')});
});

for(const result of ['won','exhausted'])test(`compact ${result} and continuation`,async({page},testInfo)=>{
 await page.setViewportSize({width:320,height:568});
 await page.goto(`/tests/browser/fixture.html?result=${result}`);
 await expect(page.locator('.board')).toBeVisible();
 const cells=await page.locator('[data-cell]').evaluateAll(c=>c.map(el=>+el.dataset.type));
 const move=findMove(cells,7);expect(move).toBeTruthy();
 for(const i of move)await page.locator(`[data-cell="${i}"]`).click();
 const panel=page.locator(result==='won'?'.win-panel':'.out-of-moves[role="region"]');
 await expect(panel).toBeVisible();
 const size=await page.locator('.mini-dialog').boundingBox();expect(size.height).toBeLessThanOrEqual(556);
 await expect(panel.locator('.primary')).toBeInViewport();
 await expect(page.locator('.puzzle-area')).not.toBeVisible();
 await page.screenshot({path:testInfo.outputPath(`${result}.png`)});
 if(result==='exhausted'){
  const snapshot=()=>page.locator('.board [data-cell]').evaluateAll(cells=>cells.map(c=>[c.dataset.cell,c.dataset.type,c.classList.contains('frozen-cell')]));
  const board=await snapshot();
  await panel.locator('.primary').click();await page.locator('.reward-ad .primary').click();await page.locator('.reward-ad .primary').click();
  await expect(page.locator('.board')).toBeVisible();
  expect(await snapshot()).toEqual(board);
  expect(Number(await page.locator('.moves-counter strong').innerText())).toBe(5);
 }
});

test('twenty moves and a helper remain responsive',async({page},testInfo)=>{
 await page.setViewportSize({width:430,height:739});await page.goto('/tests/browser/fixture.html?result=performance');
 await expect(page.locator('.board')).toBeVisible();
 const timings=[];
 for(let turn=0;turn<20;turn++){
  const started=Date.now(),before=Number(await page.locator('.moves-counter strong').innerText());
  const cells=await page.locator('[data-cell]').evaluateAll(c=>c.map(el=>+el.dataset.type));
  const move=iceMove(cells,7,[]);expect(move).toBeTruthy();
  await page.locator(`[data-cell="${move[0]}"]`).click();
  if(move[0]!==move[1])await page.locator(`[data-cell="${move[1]}"]`).click();
  await expect(page.locator('.moves-counter strong')).toHaveText(String(before-1));
  await expect(page.locator('.board')).toHaveAttribute('aria-busy','false',{timeout:10000});
  timings.push(Date.now()-started);
 }
 const remaining=await page.locator('.moves-counter strong').innerText();
 await page.locator('.helper-tile').nth(0).click();await page.locator('[data-cell="0"]').click();
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
 await expect(page.locator('.helper-tile').nth(0)).not.toHaveClass(/in-stock/);
 await expect(page.locator('.moves-counter strong')).toHaveText(remaining);
 console.log(`${testInfo.project.name}: 20 moves total ${timings.reduce((a,b)=>a+b,0)}ms, max ${Math.max(...timings)}ms`);
 await testInfo.attach('move-timing.json',{body:JSON.stringify(timings),contentType:'application/json'});
});

test('no energy offers a compact recovery and starts after reward',async({page},testInfo)=>{
 await page.setViewportSize({width:320,height:568});
 await page.addInitScript(()=>localStorage.setItem('to-the-stars-lives-v1',JSON.stringify({count:0,nextAt:Date.now()+1800000,interval:1800000})));
 await page.goto('/tests/browser/fixture.html');
 await expect(page.locator('.mini-dialog .out-of-moves')).toBeVisible();await expect(page.locator('.board')).toHaveCount(0);
 await expect(page.locator('.mini-dialog .out-of-moves button').first()).toBeInViewport();
 await page.screenshot({path:testInfo.outputPath('no-energy.png')});
 await page.locator('.mini-dialog .out-of-moves button').first().click();
 await page.locator('.reward-ad .primary').click();await page.locator('.reward-ad .primary').click();
 await page.locator('.mini-dialog>.primary').click();await expect(page.locator('.board')).toBeVisible();
});

test('completed journey has no hidden objective button over the scene',async({page},testInfo)=>{
 const counts=Object.fromEntries(Object.entries(normalizeProgress()).filter(([key])=>key==='completed'||key.endsWith('Completed')||key==='riftCrossed'||key==='elysiumArrival'||key==='caretakerMet').map(([key])=>[key,99]));
 const progress=normalizeProgress({...counts,completed:4,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,scene:'archive-core'});
 await page.addInitScript(({progress,stories})=>{
  localStorage.setItem('to-the-stars-progress-v1',JSON.stringify(progress));
  for(const story of stories)localStorage.setItem(`beyond-the-signal-story:guest:0:${story}`,'seen');
 },{progress,stories:journeyStories.map(s=>s.id)});
 await page.setViewportSize({width:320,height:658});await page.goto('/');await page.locator('.welcome-play').click();
 await expect(page.locator('.journey-guide')).toHaveAttribute('data-journey-kind','end');
 await expect(page.locator('.journey-panel button')).not.toBeVisible();
 const display=await page.locator('.journey-panel').evaluate(p=>getComputedStyle(p).display);expect(display).toBe('none');
 await page.screenshot({path:testInfo.outputPath('completed-journey.png')});
});
