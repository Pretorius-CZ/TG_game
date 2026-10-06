// Capture real gameplay in a disposable browser profile, then render a portrait MP4.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {matches,swap,adjacent} from '../src/match3.js';
import {rewards} from '../src/boosters.js';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/m/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve('dist-itch'),out=path.resolve('docs/media');
const variant=process.argv[2]??'original';
const variants={
 original:{scene:'cockpit',repair:'Ship diagnostics',tool:null,theme:'public/intro/signal.webp',damaged:'public/scenes/exterior-portrait.webp',fixed:'public/scenes/exterior-gear.webp',headline:'MATCH. CASCADE.',blast:'UNLEASH THE BLAST.',transition:'REPAIR YOUR SHIP.',tagline:'DISCOVER WHAT LIES BEYOND.',accent:'#edc38c',poster:13},
 laser:{scene:'cockpit',repair:'Ship diagnostics',tool:0,theme:'public/intro/signal.webp',damaged:'public/scenes/exterior-portrait.webp',fixed:'public/scenes/exterior-gear.webp',headline:'ONE MATCH. BIG POSSIBILITIES.',blast:'PRECISION LASER. BIG BLASTS.',transition:'REBUILD. EXPLORE.',tagline:'EVERY PUZZLE TAKES YOU FURTHER.',accent:'#edc38c',poster:6.5},
 station:{scene:'elysium-dock',repair:'Dock guidance',tool:3,theme:'public/scenes/elysium-dock-restored.webp',damaged:'public/scenes/elysium-dock.webp',fixed:'public/scenes/elysium-dock-restored.webp',headline:'POWER UP ELYSIUM.',blast:'CLEAR A ROW WITH THE BEAM.',transition:'AWAKEN A SPACE STATION.',tagline:'NEW WORLDS. NEW PUZZLES.',accent:'#83e9f5',poster:6.5},
 garden:{scene:'night-glade',repair:'Trace the root network',tool:4,theme:'public/scenes/night-glade-restored.webp',damaged:'public/scenes/night-glade.webp',fixed:'public/scenes/night-glade-restored.webp',headline:'ENTER THE NIGHT GARDEN.',blast:'UNLEASH THE EMP.',transition:'BRING THE GARDEN TO LIFE.',tagline:'FOLLOW THE SIGNAL INTO THE UNKNOWN.',accent:'#bcf29e',poster:6.5}
};
const config=variants[variant];if(!config)throw Error('Unknown promo variant');
const stem=variant==='original'?'beyond-the-signal-promo':`beyond-the-signal-${variant}`;
const videoName=stem+'-vertical.mp4';
const source=await fs.readFile('src/progressStorage.js','utf8');
const maxima=JSON.parse(source.match(/const limits=(\{[^;]+\});/)[1].replace(/(\w+):/g,'"$1":'));
const progress=variant==='original'||variant==='laser'?{version:1,airlockCompleted:3,completed:3,scene:'cockpit'}:{version:1,...maxima,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,scene:config.scene};
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://local');if(u.pathname==='/favicon.ico'){res.writeHead(204);return res.end();}if(u.pathname==='/render'){res.setHeader('Content-Type','text/html');return res.end('<html><body style="margin:0;background:#050e19"><canvas width="1080" height="1920"></canvas></body></html>');}const file=path.resolve(root,'.'+u.pathname);if(!file.startsWith(root+path.sep))throw Error('outside root');const data=await fs.readFile(file);const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.wav':'audio/wav'})[ext]??'application/octet-stream');res.end(data);}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const context=await browser.newContext({viewport:{width:390,height:780},deviceScaleFactor:1});
 await context.route('**/*supabase.co/**',r=>r.abort());
 await context.addInitScript(progress=>{localStorage.setItem('to-the-stars-progress-v1',JSON.stringify(progress));localStorage.setItem('beyond-signal-tutorials-v1:guest',JSON.stringify(['charges','covers','resonators','helpers']));},progress);
 const page=await context.newPage();await page.goto(base+'/index.html');
 await page.getByRole('button',{name:'CONTINUE',exact:true}).click();
 await page.getByRole('button',{name:new RegExp(config.repair)}).first().click();await page.getByRole('button',{name:/^(Play|Replay lesson) →$/}).click();await page.locator('.board').waitFor();
 const frames=[],cdp=await context.newCDPSession(page);let recording=false,start=0;
 cdp.on('Page.screencastFrame',event=>{if(recording)frames.push({t:(Date.now()-start)/1000,data:event.data});void cdp.send('Page.screencastFrameAck',{sessionId:event.sessionId});});
 await cdp.send('Page.startScreencast',{format:'jpeg',quality:88,maxWidth:390,maxHeight:780,everyNthFrame:2});recording=true;start=Date.now();
 const events=[];let detonated=false,helperUsed=false;
 await page.waitForTimeout(450);
 for(let turn=0;turn<14;turn++){
  await page.waitForFunction(()=>{const c=document.querySelector('.cell:not(.frozen-cell)');return c&&!c.disabled;},{},{timeout:15000});
  const state=await page.locator('.board').evaluate(el=>({cols:Number(el.style.getPropertyValue('--cols')),board:Array.from(el.children).filter(e=>e.matches('.cell,.board-hole,.resonator-cell')).map(e=>e.matches('.cell')?Number(e.dataset.type):null),ice:[...el.querySelectorAll('.frozen-cell')].map(e=>Number(e.dataset.cell))}));
  if(config.tool!=null&&turn>=1&&!helperUsed){
   const soundName=['laser','shuffle','tool-swap','beam','emp'][config.tool];
   const target=Math.floor(state.board.length/2)+2;
   await page.locator('.helper-tile').nth(config.tool).click();events.push({name:soundName,t:(Date.now()-start)/1000});await page.locator(`[data-cell="${target}"]`).click();helperUsed=true;await page.waitForTimeout(1400);continue;
  }
  const charge=state.board.findIndex((v,i)=>v>=10&&!state.ice.includes(i));
  if(charge>=0){events.push({name:state.board[charge]===11?'nova':'pulse',t:(Date.now()-start)/1000});await page.locator(`[data-cell="${charge}"]`).click();detonated=true;await page.waitForTimeout(1300);break;}
  if(helperUsed&&turn>=5)break;
  let best=null;
  for(let a=0;a<state.board.length;a++)for(const b of [a+1,a+state.cols]){if(state.board[a]==null||state.board[b]==null||state.ice.includes(a)||state.ice.includes(b)||!adjacent(a,b,state.cols))continue;const next=swap(state.board,a,b),hit=matches(next,state.cols);if(!hit.length)continue;const score=rewards(next,state.cols,state.ice,[b,a]).length*100+hit.length;if(!best||score>best.score)best={a,b,score};}
  if(!best)break;
  events.push({name:'match',t:(Date.now()-start)/1000});await page.locator(`[data-cell="${best.a}"]`).click();await page.locator(`[data-cell="${best.b}"]`).click();await page.waitForTimeout(900);
 }
 recording=false;await cdp.send('Page.stopScreencast');
 if(!detonated&&!helperUsed)throw Error('No real booster detonation captured; rerun to get another board.');
 await fs.writeFile(path.join(out,'video-work',stem+'-capture.json'),JSON.stringify({events,frames:frames.length,duration:frames.at(-1).t,config,helperUsed,detonated}));
 console.log(`Captured ${frames.length} real gameplay frames, ${events.length} actions.`);
 const imageData=async p=>'data:image/'+(p.endsWith('.png')?'png':'webp')+';base64,'+(await fs.readFile(p)).toString('base64');
 const assets={flight:await imageData(config.theme),damaged:await imageData(config.damaged),fixed:await imageData(config.fixed)};
 const sounds={};for(const name of ['pulse','nova','laser','beam','emp'])sounds[name]=(await fs.readFile(`public/audio/${name}-v1.wav`)).toString('base64');
 await page.goto(base+'/render');
 await page.exposeFunction('saveVideo',async data=>{await fs.writeFile(path.join(out,videoName),Buffer.from(data,'base64'));});
 await page.exposeFunction('savePoster',async data=>{await fs.writeFile(path.join(out,stem+'-poster.png'),Buffer.from(data.split(',')[1],'base64'));});
 await page.evaluate(async({frames,events,assets,sounds,config})=>{
  const load=src=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});
  const shots=await Promise.all(frames.map(f=>load('data:image/jpeg;base64,'+f.data))),art={};for(const [key,data]of Object.entries(assets))art[key]=await load(data);
  const c=document.querySelector('canvas'),ctx=c.getContext('2d'),W=1080,H=1920;
  const ac=new AudioContext(),dest=ac.createMediaStreamDestination(),master=ac.createGain();master.gain.value=.45;master.connect(dest);await ac.resume();
  const samples={};for(const [key,data]of Object.entries(sounds)){const bytes=Uint8Array.from(atob(data),x=>x.charCodeAt(0));samples[key]=await ac.decodeAudioData(bytes.buffer);}
  function tone(t,f,duration,gain){const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(master);o.start(t);o.stop(t+duration);}
  const audioStart=ac.currentTime+.15;
  for(let i=0;i<15;i++)tone(audioStart+i,110*(i%4===3?1.25:1),1.5,.055);
  // Edit the gameplay clip to at most 7 seconds without fabricating any moves.
  const sourceLength=frames.at(-1).t,speed=sourceLength/7;
  for(const e of events){const t=audioStart+2.5+e.t/speed;if(samples[e.name]){const s=ac.createBufferSource();s.buffer=samples[e.name];s.connect(master);s.start(t);}else{tone(t,440, .13,.25);tone(t+.08,660,.15,.16);}}
  tone(audioStart+11,523,.7,.12);tone(audioStart+11.16,659,.7,.12);tone(audioStart+11.32,784,.9,.12);
  const stream=c.captureStream(30);for(const track of dest.stream.getAudioTracks())stream.addTrack(track);
  const rec=new MediaRecorder(stream,{mimeType:'video/mp4;codecs=avc1.42001E',videoBitsPerSecond:6500000,audioBitsPerSecond:128000}),chunks=[];rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
  function cover(img,x,y,w,h,zoom=1){const s=Math.max(w/img.width,h/img.height)*zoom;ctx.drawImage(img,x+(w-img.width*s)/2,y+(h-img.height*s)/2,img.width*s,img.height*s);}
  function text(s,y,size=64,color='#eef6fc'){ctx.font=`600 ${size}px Arial`;ctx.textAlign='center';ctx.fillStyle=color;ctx.shadowColor='#000';ctx.shadowBlur=15;ctx.fillText(s,W/2,y);ctx.shadowBlur=0;}
  function shade(){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(4,12,22,.8)');g.addColorStop(.3,'rgba(4,12,22,0)');g.addColorStop(.8,'rgba(4,12,22,.25)');g.addColorStop(1,'rgba(4,12,22,.95)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  function draw(t){ctx.fillStyle='#07131f';ctx.fillRect(0,0,W,H);
   if(t<2.5){cover(art.flight,0,0,W,H,1+t*.025);shade();text('BEYOND',260,72);text('THE SIGNAL',365,112);text('A SCI-FI MATCH-3 ADVENTURE',465,36,'#e7bf83');text('Follow a signal that should not exist.',1700,46);}
   else if(t<9.5){cover(art.flight,0,0,W,H,1.04);ctx.fillStyle='rgba(4,12,22,.8)';ctx.fillRect(0,0,W,H);text(t<6?config.headline:config.blast,175,55,config.accent);const st=Math.min(sourceLength,(t-2.5)*speed);let n=0;while(n+1<frames.length&&frames[n+1].t<=st)n++;ctx.drawImage(shots[n],150,240,780,1560);text('Real gameplay footage',1870,30,'#91aebf');}
   else if(t<12){cover(t<10.5?art.damaged:art.fixed,0,0,W,H,1.03+(t-9.5)*.02);shade();text(config.transition,230,55);text(config.tagline,1730,39,config.accent);if(t>=10.5&&t<10.8){ctx.fillStyle=`rgba(180,230,255,${Math.max(0,.5-(t-10.5)*1.7)})`;ctx.fillRect(0,0,W,H);}}
   else{cover(art.flight,0,0,W,H,1.08);shade();ctx.fillStyle='rgba(3,12,24,.35)';ctx.fillRect(0,0,W,H);text('BEYOND',330,76);text('THE SIGNAL',450,112);text('150 LEVELS • A JOURNEY INTO THE UNKNOWN',570,34,'#edc38c');ctx.fillStyle='#e9bc7d';ctx.beginPath();ctx.roundRect(120,1440,840,140,25);ctx.fill();text('PLAY FREE IN YOUR BROWSER',1527,40,'#0b1b28');text('playbeyondthesignal.com',1690,49);text('No download needed',1780,35,'#c2d5df');}
   // Short fades at the beginning/end keep the cut clean.
   const opacity=t<.3?1-t/.3:t>14.65?(t-14.65)/.35:0;if(opacity>0){ctx.fillStyle=`rgba(0,0,0,${opacity})`;ctx.fillRect(0,0,W,H);}
  }
  draw(config.poster);await window.savePoster(c.toDataURL('image/png'));draw(0);rec.start();const start=performance.now();await new Promise(resolve=>{function frame(){const t=(performance.now()-start)/1000;draw(Math.min(t,15));if(t<15)requestAnimationFrame(frame);else resolve();}requestAnimationFrame(frame);});
  const stopped=new Promise(r=>rec.onstop=r);rec.stop();await stopped;const bytes=new Uint8Array(await new Blob(chunks).arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));await window.saveVideo(btoa(binary));await ac.close();
 },{frames,events,assets,sounds,config});
 console.log('Saved 1080×1920 MP4 with audio and poster.');
 const video=await browser.newPage();await video.goto(base+'/render');
 const bytes=(await fs.readFile(path.join(out,videoName))).toString('base64');
 console.log(await video.evaluate(async bytes=>{const v=document.createElement('video');v.src='data:video/mp4;base64,'+bytes;await new Promise((r,j)=>{v.onloadedmetadata=r;v.onerror=j;});v.currentTime=7;await new Promise(r=>v.onseeked=r);const c=document.createElement('canvas');c.width=360;c.height=640;c.getContext('2d').drawImage(v,0,0,360,640);await window.savePreview?.(c.toDataURL());return{width:v.videoWidth,height:v.videoHeight,duration:v.duration};},bytes));
}finally{await browser.close();server.close();}
