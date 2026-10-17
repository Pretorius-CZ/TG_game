import {test,expect} from '@playwright/test';
const source='http://127.0.0.1:5181',target='http://localhost:5181';
test.beforeEach(async({context,page})=>{
 await context.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
 await page.setViewportSize({width:320,height:568});
});
async function prepare(context){
 const original=await context.newPage();await original.goto(`${source}/transfer.html`);
 await original.evaluate(()=>{
  localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,resetRevision:0,airlockCompleted:2,scene:'airlock'}));
  localStorage.setItem('to-the-stars-lives-v1',JSON.stringify({count:2,nextAt:Date.now()+600000,interval:600000}));
  localStorage.setItem('to-the-stars-helpers-v1:guest:0','[0,1,0,0,1]');
  localStorage.setItem('sb-test-auth-token','do-not-copy');
 });await original.close();
}
test('explicit cross-origin popup transfer preserves the original and imports before game startup',async({context,page})=>{
 await prepare(context);await page.goto(`${target}/transfer.html`);
 const popupPromise=page.waitForEvent('popup');await page.getByRole('button',{name:'Open original saved game',exact:true}).click();const popup=await popupPromise;
 await popup.getByRole('button',{name:'Send saved game',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Review before importing'})).toBeVisible();
 // No providers have created defaults or a new analytics identity on the target.
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-lives-v1'))).toBeNull();
 await page.getByRole('button',{name:'Import saved game',exact:true}).click();
 await expect(page.locator('#status')).toContainText('Saved and verified');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).airlockCompleted)).toBe(2);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-lives-v1')).count)).toBe(2);
 expect(await page.evaluate(()=>localStorage.getItem('to-the-stars-helpers-v1:guest:0'))).toBe('[0,1,0,0,1]');
 expect(await page.evaluate(()=>localStorage.getItem('sb-test-auth-token'))).toBeNull();
 expect(await popup.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).airlockCompleted)).toBe(2);
 await expect(popup.locator('#status')).toContainText('confirmed saving');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:test.info().outputPath('transfer-complete.png')});
 await page.getByRole('link',{name:'Continue to the game',exact:true}).click();
 await expect(page.locator('.welcome')).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).airlockCompleted)).toBe(2);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-lives-v1')).count)).toBe(2);
});
test('download/upload fallback works without a popup and rejects an auth-token backup',async({context,page})=>{
 await prepare(context);await page.goto(`${source}/transfer.html`);
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Download this browser’s backup'}).click();const download=await downloadPromise,path=await download.path();
 await page.goto(`${target}/transfer.html`);await page.locator('input[type=file]').setInputFiles(path);
 await page.getByRole('button',{name:'Import saved game',exact:true}).click();await expect(page.locator('#status')).toContainText('Saved and verified');
 await page.locator('input[type=file]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'beyond-signal-save',version:1,id:'12345678-1234-4234-9234-123456789abc',createdAt:1,entries:{'sb-project-auth-token':'secret'}}))});
 await expect(page.locator('#status')).toHaveAttribute('data-error','true');expect(await page.evaluate(()=>localStorage.getItem('sb-project-auth-token'))).toBeNull();
});
test('interrupted imports route game startup to recovery and can finish after reload',async({page})=>{
 await page.goto(`${target}/transfer.html`);await page.evaluate(()=>localStorage.setItem('beyond-signal-transfer-pending-v1',JSON.stringify({version:1,id:'12345678-1234-4234-9234-123456789abc',changes:[{key:'to-the-stars-progress-v1',before:null,after:JSON.stringify({version:1,resetRevision:0,airlockCompleted:3})}]})));
 await page.goto(`${target}/`);await expect(page).toHaveURL(`${target}/transfer.html`);
 await page.getByRole('button',{name:'Finish transfer',exact:true}).click();await expect(page.getByRole('heading',{name:'Interrupted transfer'})).toHaveCount(0);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('to-the-stars-progress-v1')).airlockCompleted)).toBe(3);
 expect(await page.evaluate(()=>localStorage.getItem('beyond-signal-transfer-pending-v1'))).toBeNull();
});
