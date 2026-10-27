import {test,expect} from '@playwright/test';
import {findMove} from '../../src/match3.js';

test.beforeEach(async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(()=>{
  localStorage.setItem('to-the-stars-language','cs');
  localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));
 });
});

for(const width of [320,430,1024])test(`Spanish draft help and language switches preserve the running game at ${width}px`,async({page},info)=>{
 await page.setViewportSize({width,height:width===320?568:900});
 await page.goto('/tests/browser/i18n-fixture.html?previewLanguage=es');
 await expect(page.locator('.moves-counter span')).toHaveText('MOVIMIENTOS');
 const state=()=>page.evaluate(()=>({board:[...document.querySelectorAll('[data-cell]')].map(c=>+c.dataset.type),moves:document.querySelector('.moves-counter strong').textContent,counts:[...document.querySelectorAll('.objective-list progress')].map(p=>p.value)}));
 const first=await state();for(const i of findMove(first.board,7))await page.locator(`[data-cell="${i}"]`).click();
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');const played=await state();
 const select=page.locator('.test-language-control select');
 for(const [code,label]of [['cs','TAHY'],['en','MOVES'],['es','MOVIMIENTOS']]){
  await select.selectOption(code);await expect(page.locator('.moves-counter span')).toHaveText(label);expect(await state()).toEqual(played);
 }
 await page.getByRole('button',{name:'Ayuda de mecánicas'}).click();
 const help=page.locator('.mechanic-tutorial');
 for(const topic of await help.locator('select option').evaluateAll(options=>options.map(o=>o.value))){
  await help.locator('select').selectOption(topic);
  if(topic==='charges')await help.locator('.primary').click();
  await expect(help.locator('h3')).not.toContainText('help.');
  const fit=await help.evaluate(h=>{const s=h.querySelector('section'),b=h.querySelector('.primary'),r=b.getBoundingClientRect();return {scroll:s.scrollHeight-s.clientHeight,clickable:b.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};});
  expect(fit.scroll).toBeLessThanOrEqual(2);expect(fit.clickable).toBe(true);
 }
 await help.locator('.primary').click();expect(await state()).toEqual(played);
 const clippedTools=await page.locator('.helper-tile small').evaluateAll(labels=>labels.filter(label=>{const range=document.createRange();range.selectNodeContents(label);return range.getBoundingClientRect().width>label.clientWidth+1;}).map(label=>label.textContent));
 expect(clippedTools).toEqual([]);
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe('cs');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:info.outputPath('spanish-game.png')});
});

test('Spanish preview translates the welcome, settings and first repair with the released language selector',async({page})=>{
 await page.goto('/?previewLanguage=es');
 await expect(page.locator('.welcome-play')).toHaveText('Jugar');
 await page.getByRole('button',{name:'⚙ Ajustes'}).click();
 await expect(page.locator('.account-panel h2')).toHaveText('Ajustes del juego');
 await expect(page.locator('.account-panel')).toContainText('Continuar con Google');
 await page.locator('.account-close').click();
 await page.locator('.welcome-play').click();await page.locator('.intro-skip').click();
 await expect(page.locator('.repair-bubble')).toBeVisible();
 await expect(page.locator('#bubble-title')).toHaveText('Alimentación de servicio');
 await page.locator('.repair-bubble .close').click();
 await page.locator('.journey-guide summary').click();
 await expect(page.locator('.journey-panel')).toContainText('Repara tu nave');
 await page.goto('/');
 const codes=await page.locator('.welcome-settings select option').evaluateAll(options=>options.map(o=>o.value));
 expect(codes).toEqual(['en','cs','de','fr']);
});
