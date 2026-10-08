import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {matches,swap,adjacent} from '../src/match3.js';
import {rewards} from '../src/boosters.js';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/m/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve('dist-crazygames'),out=path.resolve('docs/media/crazygames');
const server=http.createServer(async(req,res)=>{try{
 const u=new URL(req.url,'http://local');if(u.pathname==='/render'){res.setHeader('Content-Type','text/html');return res.end('<canvas></canvas>');}
 const file=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(root+path.sep))throw Error();
 res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(await fs.readFile(file));
 }catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const context=await browser.newContext({viewport:{width:800,height:800},deviceScaleFactor:1});
 await context.route('https://sdk.crazygames.com/**',r=>r.fulfill({contentType:'application/javascript',body:'window.CrazyGames={SDK:{init:async()=>{},user:{systemInfo:{locale:"en-US"}},game:{gameplayStart(){},gameplayStop(){}}}};'}));
 await context.addInitScript(()=>{
  localStorage.setItem('to-the-stars-progress-v1',JSON.stringify({version:1,airlockCompleted:3,completed:3,scene:'cockpit'}));
  localStorage.setItem('beyond-signal-tutorials-v1:guest',JSON.stringify(['charges','covers','resonators','helpers','pulse','nova','laser','shuffle','swap','beam','emp']));
 });
 const page=await context.newPage();await page.goto(base);
 await page.getByRole('button',{name:'CONTINUE',exact:true}).click();
 await page.getByRole('button',{name:/Ship diagnostics/}).first().click();await page.getByRole('button',{name:/^(Play|Replay lesson)/}).click();await page.locator('.cell').first().waitFor();
 const crop=await page.locator('.mini-dialog').boundingBox();
 const frames=[],cdp=await context.newCDPSession(page);let recording=true,start=Date.now();
 cdp.on('Page.screencastFrame',e=>{if(recording)frames.push({t:(Date.now()-start)/1000,data:e.data});void cdp.send('Page.screencastFrameAck',{sessionId:e.sessionId});});
 await cdp.send('Page.startScreencast',{format:'jpeg',quality:92,maxWidth:800,maxHeight:800,everyNthFrame:1});
 let actions=0;
 while(Date.now()-start<16500){
  await page.waitForFunction(()=>document.querySelector('.cell:not(.frozen-cell):not(:disabled)'),null,{timeout:15000});
  const state=await page.locator('.board').evaluate(el=>({cols:Number(el.style.getPropertyValue('--cols')),board:[...el.children].filter(e=>e.matches('.cell,.board-hole,.resonator-cell')).map(e=>e.matches('.cell')?Number(e.dataset.type):null),ice:[...el.querySelectorAll('.frozen-cell')].map(e=>Number(e.dataset.cell))}));
  if(actions===2){await page.locator('.helper-tile').nth(0).click();const target=state.board.findIndex((v,i)=>v!=null&&!state.ice.includes(i));await page.locator(`[data-cell="${target}"]`).click();}
  else{
   const charge=state.board.findIndex((v,i)=>v>=10&&!state.ice.includes(i));
   if(charge>=0)await page.locator(`[data-cell="${charge}"]`).click();
   else{let best;
    for(let a=0;a<state.board.length;a++)for(const b of [a+1,a+state.cols]){
     if(state.board[a]==null||state.board[b]==null||state.ice.includes(a)||state.ice.includes(b)||!adjacent(a,b,state.cols))continue;
     const next=swap(state.board,a,b),hit=matches(next,state.cols);if(!hit.length)continue;
     const score=rewards(next,state.cols,state.ice,[b,a]).length*100+hit.length;if(!best||score>best.score)best={a,b,score};
    }
    if(!best)throw Error('No valid capture move');await page.locator(`[data-cell="${best.a}"]`).click();await page.locator(`[data-cell="${best.b}"]`).click();
   }
  }
  actions++;await page.waitForTimeout(1100);
 }
 await page.waitForTimeout(500);recording=false;await cdp.send('Page.stopScreencast');
 console.log(`Captured ${frames.length} frames, ${actions} real actions.`);
 const image=async file=>'data:image/png;base64,'+(await fs.readFile(file)).toString('base64');
 const background=await image('public/intro/signal.webp');
 for(const [name,w,h,cover] of [['landscape',1920,1080,'landscape-1920x1080-v2.png'],['portrait',1080,1620,'portrait-800x1200-v2.png']]){
  const render=await browser.newPage();await render.goto(base+'/render');
  await render.exposeFunction('save',async data=>fs.writeFile(path.join(out,`preview-${name}-${w}x${h}.mp4`),Buffer.from(data,'base64')));
  await render.exposeFunction('saveFrame',async(data,n)=>fs.writeFile(path.join(out,`preview-${name}-frame-${n}.png`),Buffer.from(data.split(',')[1],'base64')));
  const result=await render.evaluate(async({frames,crop,w,h,cover,background})=>{
   const load=src=>new Promise((r,j)=>{const i=new Image();i.onload=()=>r(i);i.onerror=j;i.src=src;});
   const shots=await Promise.all(frames.map(f=>load('data:image/jpeg;base64,'+f.data))),art=await load(background),title=await load(cover);
   const c=document.querySelector('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');
   const stream=c.captureStream(30),type='video/mp4;codecs=avc1.42001E';if(!MediaRecorder.isTypeSupported(type))throw Error('MP4 recorder unavailable');
   const rec=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:6500000}),chunks=[];rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
   function draw(t){if(t<.7){ctx.drawImage(title,0,0,w,h);return;}
    const scale=Math.max(w/art.width,h/art.height);ctx.drawImage(art,(w-art.width*scale)/2,(h-art.height*scale)/2,art.width*scale,art.height*scale);ctx.fillStyle='#020b1699';ctx.fillRect(0,0,w,h);
    const sourceTime=t-.7;let n=0;while(n+1<frames.length&&frames[n+1].t<=sourceTime)n++;
    const s=Math.min((w-40)/crop.width,(h-40)/crop.height),dw=crop.width*s,dh=crop.height*s;
    ctx.drawImage(shots[n],crop.x,crop.y,crop.width,crop.height,(w-dw)/2,(h-dh)/2,dw,dh);
   }
   draw(0);rec.start();const start=performance.now();let saved=new Set();await new Promise(resolve=>{async function tick(){const t=(performance.now()-start)/1000;draw(t);for(const n of[0,5,12])if(t>=n&&!saved.has(n)){saved.add(n);await window.saveFrame(c.toDataURL('image/png'),n);}if(t<18)requestAnimationFrame(tick);else resolve();}requestAnimationFrame(tick);});
   const stopped=new Promise(r=>rec.onstop=r);rec.stop();await stopped;const blob=new Blob(chunks,{type:'video/mp4'}),buf=new Uint8Array(await blob.arrayBuffer());let data='';for(let i=0;i<buf.length;i+=32768)data+=String.fromCharCode(...buf.subarray(i,i+32768));await window.save(btoa(data));stream.getTracks().forEach(t=>t.stop());
   const v=document.createElement('video');v.src=URL.createObjectURL(blob);await new Promise((r,j)=>{v.onloadedmetadata=r;v.onerror=j;});return{width:v.videoWidth,height:v.videoHeight,duration:v.duration,bytes:blob.size,audioTracks:stream.getAudioTracks().length};
  },{frames,crop,w,h,cover:await image(path.join(out,cover)),background});
  if(result.bytes>50*1024*1024||result.duration>20||result.audioTracks)throw Error('Video requirement failed');console.log(name,result);await render.close();
 }
}finally{await browser.close();server.close();}
