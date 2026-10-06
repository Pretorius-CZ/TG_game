// Combine existing real-gameplay trailers into a chronological portrait teaser.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/m/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const music=process.argv.includes('--music');
const root=path.resolve('docs/media'),name=music?'beyond-the-signal-journey-music.mp4':'beyond-the-signal-journey-vertical.mp4';
const clips=[
 {file:'laser',from:0,to:1.8},
 {file:'laser',from:4.8,to:9.5,title:'START WITH YOUR SHIP',subtitle:'Match tiles. Use tools. Repair the damage.',color:'#edc38c'},
 {file:'laser',from:9.5,to:11.7},
 {file:'station',from:3.4,to:6.2,title:'LATER: AWAKEN ELYSIUM',subtitle:'New chapters. New tiles.',color:'#83e9f5'},
 {file:'garden',from:4.5,to:9.5,title:'BEYOND: THE NIGHT GARDEN',subtitle:'The adventure keeps changing.',color:'#bcf29e'},
 {file:'laser',from:12,to:15}
 ];
const server=http.createServer(async(req,res)=>{try{if(req.url==='/'){res.setHeader('Content-Type','text/html');return res.end('<body style="margin:0;background:#07131f"><canvas width="1080" height="1920"></canvas></body>');}const file=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!file.startsWith(root+path.sep))throw Error();const data=await fs.readFile(file);res.setHeader('Content-Type','video/mp4');res.setHeader('Content-Length',data.length);res.end(data);}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage();await page.goto(base);
 await page.exposeFunction('save',async(data,file)=>fs.writeFile(path.join(root,file),Buffer.from(data,'base64')));
 const sources={};for(const file of ['laser','station','garden'])sources[file]='data:video/mp4;base64,'+(await fs.readFile(path.join(root,`beyond-the-signal-${file}-vertical.mp4`))).toString('base64');
 const score=music?(await fs.readFile(path.join(root,'beyond-the-signal-synthwave.wav'))).toString('base64'):null;
 await page.evaluate(async({clips,name,sources,score})=>{
  const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
  const audio=new AudioContext(),dest=audio.createMediaStreamDestination(),bus=audio.createDynamicsCompressor();bus.threshold.value=-7;bus.knee.value=6;bus.ratio.value=5;bus.attack.value=.003;bus.release.value=.16;bus.connect(dest);await audio.resume();
  const media=await Promise.all(clips.map(async c=>{const v=document.createElement('video');v.preload='auto';v.src=sources[c.file];document.body.append(v);v.style.display='none';await new Promise((r,j)=>{v.onloadeddata=r;v.onerror=j;});v.currentTime=c.from;await new Promise(r=>v.onseeked=r);const source=audio.createMediaElementSource(v),gain=audio.createGain();source.connect(gain);gain.connect(bus);return{v,gain};}));
  let musicSource;if(score){musicSource=audio.createBufferSource();musicSource.buffer=await audio.decodeAudioData(Uint8Array.from(atob(score),x=>x.charCodeAt(0)).buffer);const gain=audio.createGain();gain.gain.value=.65;musicSource.connect(gain);gain.connect(bus);}
  const stream=canvas.captureStream(30);dest.stream.getAudioTracks().forEach(t=>stream.addTrack(t));
  const recorder=new MediaRecorder(stream,{mimeType:'video/mp4;codecs=avc1.42001E',videoBitsPerSecond:6500000,audioBitsPerSecond:128000});const chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
  function draw(v,c){ctx.drawImage(v,0,0,1080,1920);if(c.title){ctx.fillStyle='#081521';ctx.fillRect(0,65,1080,170);ctx.textAlign='center';ctx.fillStyle=c.color;ctx.font='600 51px Arial';ctx.fillText(c.title,540,140);ctx.fillStyle='#d5e6ee';ctx.font='32px Arial';ctx.fillText(c.subtitle,540,200);}}
  draw(media[0].v,clips[0]);recorder.start();musicSource?.start();
  for(let i=0;i<clips.length;i++){const c=clips[i],{v,gain}=media[i],duration=c.to-c.from;const now=audio.currentTime;gain.gain.setValueAtTime(.02,now);gain.gain.linearRampToValueAtTime(1,now+.08);gain.gain.setValueAtTime(1,now+duration-.1);gain.gain.linearRampToValueAtTime(.02,now+duration);await v.play();const start=performance.now();await new Promise(resolve=>{function frame(){draw(v,c);if((performance.now()-start)/1000<duration)requestAnimationFrame(frame);else resolve();}requestAnimationFrame(frame);});v.pause();}
  const stopped=new Promise(r=>recorder.onstop=r);recorder.stop();await stopped;const bytes=new Uint8Array(await new Blob(chunks).arrayBuffer());let data='';for(let i=0;i<bytes.length;i+=32768)data+=String.fromCharCode(...bytes.subarray(i,i+32768));await window.save(btoa(data),name);await audio.close();
 },{clips,name,sources,score});
 const check=await browser.newPage();await check.goto(base);await check.exposeFunction('saveFrame',async(data,n)=>fs.writeFile(path.join(root,`beyond-the-signal-journey-frame-${n}.png`),Buffer.from(data.split(',')[1],'base64')));
 const bytes=(await fs.readFile(path.join(root,name))).toString('base64');
 const info=await check.evaluate(async bytes=>{const v=document.createElement('video');v.src='data:video/mp4;base64,'+bytes;await new Promise((r,j)=>{v.onloadeddata=r;v.onerror=j;});for(const t of[4,10,14,18]){v.currentTime=t;await new Promise(r=>v.onseeked=r);const c=document.createElement('canvas');c.width=540;c.height=960;c.getContext('2d').drawImage(v,0,0,540,960);await window.saveFrame(c.toDataURL('image/png'),t);}return{width:v.videoWidth,height:v.videoHeight,duration:v.duration};},bytes);
 console.log(JSON.stringify(info));
}finally{await browser.close();server.close();}
