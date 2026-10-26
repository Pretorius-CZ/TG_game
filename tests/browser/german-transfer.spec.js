import{test,expect}from'@playwright/test';
test('German popup transfer preserves progress, energy, stock and language',async({context,page},info)=>{
 await context.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.setViewportSize({width:320,height:568});
 await page.goto('http://127.0.0.1:5181/transfer.html?lang=de');
 await page.evaluate(()=>{
  localStorage.setItem('to-the-stars-language','de');
  localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,airlockCompleted:2,scene:'airlock'}));
  localStorage.setItem('to-the-stars-lives-v1',JSON.stringify({count:2,nextAt:Date.now()+600000,interval:600000}));
  localStorage.setItem('to-the-stars-helpers-v1:guest:0','[0,1,0,0,1]');
 });
 await page.goto('http://localhost:5181/transfer.html?lang=de');
 await expect(page.locator('h1')).toHaveText('Deinen Spielstand behalten');
 const opened=page.waitForEvent('popup');await page.getByRole('button',{name:'Bisherigen Spielstand öffnen',exact:true}).click();const original=await opened;
 await expect(original.locator('html')).toHaveAttribute('lang','de');
 await original.getByRole('button',{name:'Spielstand senden',exact:true}).click();
 await expect(page.locator('h2',{hasText:'Vor dem Import prüfen'})).toBeVisible();
 await page.getByRole('button',{name:'Spielstand importieren',exact:true}).click();
 await expect(page.locator('#status')).toContainText('Gespeichert und überprüft.');
 for(const p of [page,original]){
  expect(await p.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).airlockCompleted)).toBe(2);
  expect(await p.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-lives-v1')).count)).toBe(2);
  expect(await p.evaluate(()=>localStorage.getItem('to-the-stars-helpers-v1:guest:0'))).toBe('[0,1,0,0,1]');
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:info.outputPath('german-transfer.png'),fullPage:true});
 await page.getByRole('link',{name:'Zum Spiel',exact:true}).click();await expect(page.locator('.welcome-play')).toHaveText('Weiter');
 await page.goto('http://localhost:5181/transfer.html?lang=de');
 await page.locator('input[type=file]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"format":"unsupported"}')});
 await expect(page.locator('#status')).toHaveText('Die Sicherungsdatei ist ungültig oder wird nicht unterstützt.');
});
