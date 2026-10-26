import{test,expect}from'@playwright/test';

test.beforeEach(async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.addInitScript(()=>localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()})));
});

test('released French opens from a public URL, persists and preserves existing progress',async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.addInitScript(()=>{if(!localStorage.getItem('to-the-stars-progress-v1'))localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,airlockCompleted:2,scene:'airlock'}));});
 await page.goto('/?lang=fr');await expect(page.locator('html')).toHaveAttribute('lang','fr');
 await expect(page.locator('.welcome-play')).toHaveText('CONTINUER');
 await expect(page.locator('.welcome-settings select')).toHaveValue('fr');
 await expect(page.locator('.welcome-settings select option')).toHaveCount(4);
 const before=await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1'));
 await page.goto('/');await expect(page.locator('.welcome-play')).toHaveText('CONTINUER');
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1'))).toBe(before);
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBe('fr');
 await page.getByRole('button',{name:'⚙ Paramètres',exact:true}).click();
 await expect(page.locator('.account-panel h2')).toHaveText('Paramètres du jeu');
});

test('blind test offers French without changing ordinary saves or language',async({page})=>{
 await page.goto('/playtest.html?run=french-release-qa');
 await page.getByRole('button',{name:'FR',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('lang','fr');
 await page.getByRole('button',{name:'Povolit sběr a zahájit test',exact:true}).click();
 await expect(page.locator('.moves-counter span')).toHaveText('COUPS');
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-progress-v1'))).toBeNull();
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-language'))).toBeNull();
});
