import{test,expect}from'@playwright/test';

test.beforeEach(async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(()=>localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()})));
});

test('released Spanish opens from a public URL, persists and preserves existing progress',async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.addInitScript(()=>{if(!localStorage.getItem('to-the-stars-progress-v1'))localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,airlockCompleted:2,scene:'airlock'}));});
 await page.goto('/?lang=es');await expect(page.locator('html')).toHaveAttribute('lang','es');
 await expect(page.locator('.welcome-play')).toHaveText('Continuar');
 await expect(page.locator('.welcome-settings select')).toHaveValue('es');
 await expect(page.locator('.welcome-settings select option')).toHaveCount(5);
 const before=await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1'));
 await page.goto('/');await expect(page.locator('.welcome-play')).toHaveText('Continuar');
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1'))).toBe(before);
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe('es');
 await page.getByRole('button',{name:'⚙ Ajustes',exact:true}).click();
 await expect(page.locator('.account-panel h2')).toHaveText('Ajustes del juego');
});

test('blind test offers Spanish without changing ordinary saves or language',async({page})=>{
 await page.goto('/playtest.html?run=spanish-release-qa');
 await page.getByRole('button',{name:'ES',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('lang','es');
 await page.getByRole('button',{name:'Povolit sběr a zahájit test',exact:true}).click();
 await expect(page.locator('.moves-counter span')).toHaveText('MOVIMIENTOS');
 const music=page.getByRole('button',{name:'Música: activada',exact:true});
 await expect(music).toHaveAttribute('title','Música: activada');
 await music.click();await expect(page.getByRole('button',{name:'Música: desactivada',exact:true})).toBeVisible();
 const sounds=page.getByRole('button',{name:'Sonidos: activados',exact:true});
 await sounds.click();await expect(page.getByRole('button',{name:'Sonidos: desactivados',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1'))).toBeNull();
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBeNull();
});
