import{test,expect}from'@playwright/test';

for(const preview of [false,true])test(`French transfer preserves progress, energy, stock and language preview=${preview}`,async({context,page},info)=>{
 const query=preview?'previewLanguage=fr':'lang=fr',savedLanguage=preview?'cs':'fr';
 await context.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.setViewportSize({width:320,height:568});
 await page.goto('http://127.0.0.1:5181/transfer.html?'+query);
 await page.evaluate(savedLanguage=>{
  localStorage.setItem('to-the-stars-language',savedLanguage);
  localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,airlockCompleted:2,scene:'airlock'}));
  localStorage.setItem('to-the-stars-lives-v1',JSON.stringify({count:2,nextAt:Date.now()+600000,interval:600000}));
  localStorage.setItem('to-the-stars-helpers-v1:guest:0','[0,1,0,0,1]');
 },savedLanguage);
 await page.goto('http://localhost:5181/transfer.html?'+query);
 await expect(page.locator('h1')).toHaveText('Conserver ta partie sauvegardée');
 const opened=page.waitForEvent('popup');await page.getByRole('button',{name:'Ouvrir la sauvegarde d’origine',exact:true}).click();const original=await opened;
 await expect(original.locator('html')).toHaveAttribute('lang','fr');
 await original.getByRole('button',{name:'Envoyer la sauvegarde',exact:true}).click();
 await expect(page.locator('h2',{hasText:'Vérifier avant l’importation'})).toBeVisible();
 await page.getByRole('button',{name:'Importer la sauvegarde',exact:true}).click();
 await expect(page.locator('#status')).toContainText('Sauvegarde enregistrée et vérifiée.');
 for(const p of [page,original]){
  expect(await p.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).airlockCompleted)).toBe(2);
  expect(await p.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-lives-v1')).count)).toBe(2);
  expect(await p.evaluate(()=>localStorage.getItem('to-the-stars-helpers-v1:guest:0'))).toBe('[0,1,0,0,1]');
  expect(await p.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe(savedLanguage);
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:info.outputPath('french-transfer.png'),fullPage:true});
 await page.goto('http://localhost:5181/transfer.html?'+query);
 await page.locator('input[type=file]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"format":"unsupported"}')});
 await expect(page.locator('#status')).toHaveText('Le fichier de sauvegarde est invalide ou incompatible.');
});
