import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from '@playwright/test';
import {normalizeProgress} from '../src/progressStorage.js';
import {journeyFor} from '../src/journey.js';
const root=path.resolve('dist-android'),out=path.resolve('releases/google-play/internal-1/store-assets');
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://local'),file=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(root+path.sep))throw Error();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.json':'application/json','.wav':'audio/wav'})[path.extname(file)]??'application/octet-stream');res.end(await fs.readFile(file));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'msedge',headless:true});
const full=normalizeProgress({...Object.fromEntries(Object.keys(normalizeProgress()).filter(k=>k==='completed'||k.endsWith('Completed')||k==='elysiumArrival'||k==='riftCrossed'||k==='caretakerMet').map(k=>[k,999])),finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true});
try{
 for(const spec of [
  {name:'01-match3',p:{airlockCompleted:3,completed:3,scene:'cockpit'},board:true},
  {name:'02-repair-ship',p:{airlockCompleted:3,completed:4,navigationCompleted:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,exteriorCompleted:2,scene:'exterior'}},
  {name:'03-elysium',p:{...full,elysiumDockCompleted:2,scene:'elysium-dock'}},
  {name:'04-night-garden',p:{...full,nightGladeCompleted:2,scene:'night-glade'}}
 ]){
  const p=normalizeProgress(spec.p);console.log(spec.name,journeyFor(p).scene);
  const context=await browser.newContext({viewport:{width:360,height:640},deviceScaleFactor:3,reducedMotion:'reduce'});
  await context.route('**/*supabase.co/**',r=>r.abort());await context.route('**/*country.is/**',r=>r.abort());
  await context.addInitScript(p=>{localStorage.setItem('to-the-stars-progress-v1',JSON.stringify(p));localStorage.setItem('beyond-signal-analytics-choice-v1',JSON.stringify({version:1,state:'denied',at:Date.now()}));localStorage.setItem('beyond-the-signal-intro:guest:0','seen');localStorage.setItem('beyond-signal-tutorials-v1:guest',JSON.stringify(['charges','covers','resonators','helpers']));},p);
  const page=await context.newPage();await page.goto(base+'/?lang=en');
  await page.locator('.welcome-play').click();
  if(spec.board){await page.locator('.repair-bubble-dialog[open]').waitFor();await page.getByRole('button',{name:/^Play →$/}).click();await page.locator('.board').waitFor();}
  await page.waitForTimeout(1200);if(spec.name==='04-night-garden' && await page.getByRole('button',{name:'Skip story',exact:true}).count())await page.getByRole('button',{name:'Skip story',exact:true}).click();await page.waitForTimeout(300);if(!spec.board && await page.locator('.repair-bubble-dialog[open]').count())await page.locator('.repair-bubble-dialog button').filter({hasText:'×'}).click();await page.waitForTimeout(1400);
  console.log((await page.locator('body').innerText()).slice(0,300));
  await page.screenshot({path:path.join(out,spec.name+'.png')});await context.close();
 }
}finally{await browser.close();server.close();}

