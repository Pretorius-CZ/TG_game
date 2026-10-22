import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {sitePages} from '../src/sitePages.js';

const origin=process.env.LIVE_GAME_ORIGIN||'https://game.playbeyondthesignal.com';
if(!['https://game.playbeyondthesignal.com','https://playbeyondthesignal.com'].includes(origin))throw Error('Unexpected deployment origin');
const website=process.env.LIVE_SITE_MODE==='website';
const checkKey=process.env.GITHUB_SHA?.slice(0,12)||String(Date.now());
const checkedUrl=path=>origin+path+(path.includes('?')?'&':'?')+'ui_check='+checkKey;
await mkdir('.local/deployment-smoke',{recursive:true});
const browser=await chromium.launch();
try{
 for(const pathname of ['/','/index.html']){
  const context=await browser.newContext({viewport:{width:430,height:739},reducedMotion:'reduce',locale:'en-US'});
  const page=await context.newPage(),errors=[];
  // Test startup without creating production analytics or using an account.
  await page.route(/supabase\.co|api\.country\.is/,r=>r.fulfill({status:204,body:''}));
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(origin+'/')&&r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  page.on('requestfailed',r=>{if(r.url().startsWith(origin+'/'))errors.push(`${r.failure()?.errorText} ${r.url()}`);});
  await page.goto(checkedUrl(pathname),{waitUntil:'networkidle',timeout:30000});
  if(website){
   await page.locator('.site-header').waitFor({timeout:20000});
   const links=await page.locator('.game-link').evaluateAll(nodes=>nodes.map(n=>n.href));
   if(!links.length||links.some(url=>!url.startsWith('https://game.playbeyondthesignal.com/')))throw Error('Website game links do not lead to the game subdomain');
   if(errors.length)throw Error(errors.join('\n'));
   if(pathname==='/'){
    for(const entry of sitePages){const response=await fetch(checkedUrl('/'+entry.file));if(!response.ok||!(await response.text()).includes(`data-page="${entry.id}"`))throw Error('Public page is missing: '+entry.file);}
    for(const [path,marker]of [['/sitemap.xml','how-to-play.html'],['/robots.txt','Sitemap:'],['/transfer.html','id="transfer"'],['/legacy-game.html','id="root"']]){const response=await fetch(checkedUrl(path));if(!response.ok||!(await response.text()).includes(marker))throw Error('Website recovery/discovery endpoint missing: '+path);}
   }
   console.log(JSON.stringify({url:origin+pathname,website:true,gameLinks:true,failedResources:0}));await context.close();continue;
  }
  await page.locator('.welcome[data-art-ready="true"]').waitFor({timeout:20000});
  if(await page.locator('.analytics-first-run').count())await page.locator('.analytics-first-run').getByRole('button',{name:'No, thanks',exact:true}).click();
  await page.locator('.welcome-play').click();
  await page.locator('.intro-skip').click();
  await page.locator('.repair-bubble-dialog').waitFor({timeout:15000});
  if(errors.length)throw Error(errors.join('\n'));
  await page.screenshot({path:`.local/deployment-smoke/${pathname==='/'?'root':'index'}.png`});
  console.log(JSON.stringify({url:origin+pathname,welcome:true,artwork:true,firstRepair:true,failedResources:0}));
  await context.close();
 }
}finally{await browser.close();}
