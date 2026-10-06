// CC0 field-recording based source; provenance in public/audio/README.md.
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/m/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sourcePath='docs/media/explosion-source-samster.mp3';
let source;
try{source=await fs.readFile(sourcePath);}catch(error){
 if(error.code!=='ENOENT')throw error;
 const response=await fetch('https://cdn.freesound.org/previews/592/592000_5487341-hq.mp3',{signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw new Error(`Explosion source download failed: ${response.status}`);
 source=Buffer.from(await response.arrayBuffer());
 await fs.mkdir('docs/media',{recursive:true});await fs.writeFile(sourcePath,source);
}
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage();
 const results=await page.evaluate(async encoded=>{
  const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
  const ac=new OfflineAudioContext(1,1,44100),buffer=await ac.decodeAudioData(bytes.buffer);
  const mono=Float32Array.from({length:buffer.length},(_,i)=>Array.from({length:buffer.numberOfChannels},(_,c)=>buffer.getChannelData(c)[i]).reduce((a,b)=>a+b,0)/buffer.numberOfChannels);
  let peak=0;for(const value of mono)peak=Math.max(peak,Math.abs(value));
  let onset=mono.findIndex(v=>Math.abs(v)>peak*.07);onset=Math.max(0,onset-Math.floor(buffer.sampleRate*.003));
  return [['pulse',.72,1],['nova',1.0,.9]].map(([name,duration,speed])=>{
   const rate=32000,n=Math.ceil(rate*duration),samples=new Float32Array(n);
   for(let i=0;i<n;i++){
    const at=onset+i*buffer.sampleRate/rate*speed,j=Math.floor(at),f=at-j;
    let value=(mono[j]??0)*(1-f)+(mono[j+1]??0)*f;
    const fade=Math.min(1,i/(rate*.0015),(n-i)/(rate*.1));
    samples[i]=value*fade;
   }
   let max=0;for(const v of samples)max=Math.max(max,Math.abs(v));
   const wav=new ArrayBuffer(44+n*2),view=new DataView(wav);
   const text=(at,s)=>{for(let i=0;i<s.length;i++)view.setUint8(at+i,s.charCodeAt(i));};
   text(0,'RIFF');view.setUint32(4,36+n*2,true);text(8,'WAVE');text(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);text(36,'data');view.setUint32(40,n*2,true);
   for(let i=0;i<n;i++)view.setInt16(44+i*2,Math.round(samples[i]/max*.9*32767),true);
   let binary='';for(const b of new Uint8Array(wav))binary+=String.fromCharCode(b);
   return {name,duration,rate,base64:btoa(binary),onset:onset/buffer.sampleRate};
  });
 },source.toString('base64'));
 for(const {name,base64,...metadata} of results){await fs.writeFile(`public/audio/${name}-v2.wav`,Buffer.from(base64,'base64'));console.log(name,metadata);}
}finally{await browser.close();}
