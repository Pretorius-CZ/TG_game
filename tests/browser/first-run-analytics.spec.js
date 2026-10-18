import {test,expect} from '@playwright/test';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),axePath=require.resolve('axe-core/axe.min.js');
for(const language of ['en','cs'])for(const answer of ['granted','denied'])test(`first-run choice ${answer} is remembered ${language}`,async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await page.addInitScript(l=>localStorage.setItem('to-the-stars-language',l),language);
 const calls=[];await page.route(/supabase\.co|api\.country\.is/,r=>{if(/record_|country\.is/.test(r.request().url()))calls.push(r.request().url());return r.fulfill({status:200,contentType:'application/json',body:r.request().url().includes('country.is')?'{"country":"CZ"}':'null'});});
 await page.goto('/');const prompt=page.locator('.analytics-first-run');await expect(prompt).toBeVisible();
 expect(calls).toEqual([]);await expect(prompt.locator('h2')).toBeFocused();
 expect(await prompt.evaluate(el=>el.scrollHeight<=el.clientHeight)).toBe(true);
 await page.addScriptTag({path:axePath});const violations=await page.evaluate(async()=>{const report=await axe.run('.analytics-first-run',{runOnly:{type:'rule',values:['color-contrast','aria-dialog-name','button-name']}});return report.violations.map(v=>v.id);});expect(violations).toEqual([]);
 const label=answer==='granted'?(language==='cs'?'Povolit statistiky':'Allow statistics'):(language==='cs'?'Ne, děkuji':'No, thanks');
 await prompt.getByRole('button',{name:label,exact:true}).click();await expect(prompt).toHaveCount(0);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('beyond-signal-analytics-choice-v1')).state)).toBe(answer);
 if(answer==='granted')await expect.poll(()=>calls.length).toBeGreaterThan(0);else expect(calls).toEqual([]);
 await page.reload();await expect(page.locator('.welcome[data-art-ready="true"]')).toBeVisible();await expect(prompt).toHaveCount(0);
 await page.locator('.account-control>button').click();
 const button=page.getByRole('button',{name:answer==='granted'?(language==='cs'?'Nepovolit statistiky':'Do not allow statistics'):(language==='cs'?'Povolit statistiky':'Allow statistics'),exact:true});await button.click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('beyond-signal-analytics-choice-v1')).state)).not.toBe(answer);
});
test('Escape declines, and changing language before deciding does not enable analytics',async({page})=>{
 await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:200,contentType:'application/json',body:'null'}));
 await page.goto('/');const prompt=page.locator('.analytics-first-run');await expect(prompt).toBeVisible();
 await prompt.getByRole('button',{name:'CZ',exact:true}).click();await expect(prompt.locator('h2')).toHaveText('Pomůžeš nám vyladit hru?');
 expect(await page.evaluate(()=>localStorage.getItem('beyond-signal-analytics-choice-v1'))).toBeNull();
 await page.keyboard.press('Escape');await expect(prompt).toHaveCount(0);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('beyond-signal-analytics-choice-v1')).state)).toBe('denied');
});
test('blocked storage offers a way back to the game without enabling statistics',async({page})=>{
 const calls=[];await page.route(/supabase\.co|api\.country\.is/,r=>{if(/record_|country\.is/.test(r.request().url()))calls.push(r.request().url());return r.fulfill({status:200,contentType:'application/json',body:'null'});});
 await page.addInitScript(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='beyond-signal-analytics-choice-v1')throw new DOMException('Blocked','SecurityError');return original.call(this,key,value);};});
 await page.goto('/');const prompt=page.locator('.analytics-first-run');await prompt.getByRole('button',{name:'Allow statistics',exact:true}).click();
 await expect(prompt.getByRole('alert')).toBeVisible();await prompt.getByRole('button',{name:'Continue without statistics',exact:true}).click();
 await expect(prompt).toHaveCount(0);await page.locator('.welcome-play').click();await expect(page.locator('.intro-skip')).toBeVisible();expect(calls).toEqual([]);
});
