import{test,expect}from'@playwright/test';

test('Spanish transfer preview preserves progress, energy, tools and public language choice',async({context,page},info)=>{
 await context.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));await page.setViewportSize({width:320,height:568});
 await page.goto('http://127.0.0.1:5181/transfer.html?previewLanguage=es');
 await page.evaluate(()=>{
  localStorage.setItem('to-the-stars-language','cs');localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,airlockCompleted:2,scene:'airlock'}));
  localStorage.setItem('to-the-stars-lives-v1',JSON.stringify({count:2,nextAt:Date.now()+600000,interval:600000}));localStorage.setItem('to-the-stars-helpers-v1:guest:0','[0,1,0,0,1]');
 });
 await page.goto('http://localhost:5181/transfer.html?previewLanguage=es');await expect(page.locator('h1')).toHaveText('Conservar tu partida guardada');
 const opened=page.waitForEvent('popup');await page.getByRole('button',{name:'Abrir la partida original',exact:true}).click();const original=await opened;
 await expect(original.locator('html')).toHaveAttribute('lang','es');await original.getByRole('button',{name:'Enviar la partida',exact:true}).click();
 await page.getByRole('button',{name:'Importar la partida',exact:true}).click();await expect(page.locator('#status')).toContainText('Partida guardada y verificada.');
 for(const p of[page,original]){
  expect(await p.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).airlockCompleted)).toBe(2);
  expect(await p.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-lives-v1')).count)).toBe(2);
  expect(await p.evaluate(()=>localStorage.getItem('to-the-stars-helpers-v1:guest:0'))).toBe('[0,1,0,0,1]');
  expect(await p.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe('cs');
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath('spanish-transfer.png'),fullPage:true});
 await page.locator('input[type=file]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"format":"unsupported"}')});
 await expect(page.locator('#status')).toHaveText('La copia de seguridad no es válida o no es compatible.');
});
