import{test,expect}from'@playwright/test';

test.beforeEach(async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(()=>localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()})));
});

test('released Brazilian Portuguese opens from a public URL, persists and preserves existing progress',async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.addInitScript(()=>{if(!localStorage.getItem('to-the-stars-progress-v1'))localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,airlockCompleted:2,scene:'airlock'}));});
 await page.goto('/?lang=pt-BR');await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
 await expect(page.locator('.welcome-play')).toHaveText('Continuar');
 await expect(page.locator('.welcome-settings select')).toHaveValue('pt-BR');
 await expect(page.locator('.welcome-settings select option')).toHaveCount(6);
 const before=await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1'));
 await page.goto('/');await expect(page.locator('.welcome-play')).toHaveText('Continuar');
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1'))).toBe(before);
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe('pt-BR');
 await page.getByRole('button',{name:'⚙ Configurações',exact:true}).click();
 await expect(page.locator('.account-panel h2')).toHaveText('Configurações do jogo');
});

test('blind test offers Brazilian Portuguese without changing ordinary saves or language',async({page})=>{
 await page.goto('/playtest.html?run=portuguese-release-qa');
 await page.getByRole('button',{name:'PT-BR',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
 await page.getByRole('button',{name:'Povolit sběr a zahájit test',exact:true}).click();
 await expect(page.locator('.moves-counter span')).toHaveText('JOGADAS');
 await expect(page.locator('.board')).toHaveAttribute('aria-busy','false');
 const tutorial=page.locator('.mechanic-tutorial');
 if(await tutorial.isVisible())await tutorial.locator('.tutorial-close').click();
 const music=page.getByRole('button',{name:'Música: ligada',exact:true});
 await expect(music).toHaveAttribute('title','Música: ligada');
 await music.click();await expect(page.getByRole('button',{name:'Música: desligada',exact:true})).toBeVisible();
 const sounds=page.getByRole('button',{name:'Efeitos sonoros: ligados',exact:true});
 await sounds.click();await expect(page.getByRole('button',{name:'Efeitos sonoros: desligados',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1'))).toBeNull();
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBeNull();
});
