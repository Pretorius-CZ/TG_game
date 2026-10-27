import{test,expect}from'@playwright/test';

for(const preview of[false,true])test(`Brazilian Portuguese transfer preserves progress, energy, tools and language preview=${preview}`,async({context,page},info)=>{
 const query=preview?'previewLanguage=pt-BR':'lang=pt-BR',savedLanguage=preview?'cs':"pt-BR";
 await context.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));await page.setViewportSize({width:320,height:568});
 await page.goto('http://127.0.0.1:5181/transfer.html?'+query);
 await page.evaluate(savedLanguage=>{
  localStorage.setItem('to-the-stars-language',savedLanguage);localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,airlockCompleted:2,scene:'airlock'}));
  localStorage.setItem('to-the-stars-lives-v1',JSON.stringify({count:2,nextAt:Date.now()+600000,interval:600000}));localStorage.setItem('to-the-stars-helpers-v1:guest:0','[0,1,0,0,1]');
 },savedLanguage);
 await page.goto('http://localhost:5181/transfer.html?'+query);await expect(page.locator('h1')).toHaveText('Mantenha sua partida salva');
 const opened=page.waitForEvent('popup');await page.getByRole('button',{name:'Abrir partida original',exact:true}).click();const original=await opened;
 await expect(original.locator('html')).toHaveAttribute('lang',"pt-BR");await original.getByRole('button',{name:'Enviar partida salva',exact:true}).click();
 await page.getByRole('button',{name:'Importar partida salva',exact:true}).click();await expect(page.locator('#status')).toContainText('Salvo e verificado.');
 for(const p of[page,original]){
  expect(await p.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).airlockCompleted)).toBe(2);
  expect(await p.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-lives-v1')).count)).toBe(2);
  expect(await p.evaluate(()=>localStorage.getItem('to-the-stars-helpers-v1:guest:0'))).toBe('[0,1,0,0,1]');
  expect(await p.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe(savedLanguage);
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath('portuguese-transfer.png'),fullPage:true});
 await page.locator('input[type=file]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"format":"unsupported"}')});
 await expect(page.locator('#status')).toHaveText('O backup da partida é inválido ou incompatível.');
});
