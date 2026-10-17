import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';

const origin='https://game.playbeyondthesignal.com';
await mkdir('.local/deployment-smoke',{recursive:true});
const browser=await chromium.launch();
try{
 for(const pathname of ['/','/index.html']){
  const context=await browser.newContext({viewport:{width:430,height:739},reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];
  // Test startup without creating production analytics or using an account.
  await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(origin+'/')&&r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  page.on('requestfailed',r=>{if(r.url().startsWith(origin+'/'))errors.push(`${r.failure()?.errorText} ${r.url()}`);});
  await page.goto(origin+pathname,{waitUntil:'networkidle',timeout:30000});
  await page.locator('.welcome[data-art-ready="true"]').waitFor({timeout:20000});
  await page.locator('.welcome-play').click();
  await page.locator('.intro-skip').click();
  await page.locator('.repair-bubble-dialog').waitFor({timeout:15000});
  if(errors.length)throw Error(errors.join('\n'));
  await page.screenshot({path:`.local/deployment-smoke/${pathname==='/'?'root':'index'}.png`});
  console.log(JSON.stringify({url:origin+pathname,welcome:true,artwork:true,firstRepair:true,failedResources:0}));
  await context.close();
 }
}finally{await browser.close();}
