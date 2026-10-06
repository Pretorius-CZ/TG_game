// Original 124 BPM synthwave cue, rendered offline without external samples.
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/m/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage();
 await page.exposeFunction('saveScore',async data=>fs.writeFile('docs/media/beyond-the-signal-synthwave.wav',Buffer.from(data,'base64')));
 console.log(await page.evaluate(async()=>{
  const rate=48000,duration=19.6,ac=new OfflineAudioContext(2,Math.ceil(rate*duration),rate),beat=60/124;
  const mix=ac.createGain(),comp=ac.createDynamicsCompressor();mix.gain.value=.7;comp.threshold.value=-15;comp.knee.value=12;comp.ratio.value=3;comp.attack.value=.004;comp.release.value=.14;mix.connect(comp);comp.connect(ac.destination);
  let seed=173;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
  const noise=ac.createBuffer(1,rate*2,rate);for(let i=0;i<noise.length;i++)noise.getChannelData(0)[i]=random()*2-1;
  const hz=n=>440*2**((n-69)/12);
  function synth(n,t,len,amp=.08,type='sawtooth',cutoff=1800,pan=0){
   const o=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain(),p=ac.createStereoPanner();o.type=type;o.frequency.value=hz(n);f.type='lowpass';f.frequency.setValueAtTime(cutoff,t);f.frequency.exponentialRampToValueAtTime(Math.max(200,cutoff*.4),t+len);f.Q.value=.8;p.pan.value=pan;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(amp,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+len);o.connect(f);f.connect(g);g.connect(p);p.connect(mix);o.start(t);o.stop(t+len+.02);
  }
  function drumNoise(t,len,amp,frequency,kind='highpass',pan=0){const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain(),p=ac.createStereoPanner();s.buffer=noise;f.type=kind;f.frequency.value=frequency;p.pan.value=pan;g.gain.setValueAtTime(amp,t);g.gain.exponentialRampToValueAtTime(.0001,t+len);s.connect(f);f.connect(g);g.connect(p);p.connect(mix);s.start(t,random());s.stop(t+len);}
  function kick(t,amp=.65){const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(145,t);o.frequency.exponentialRampToValueAtTime(45,t+.15);g.gain.setValueAtTime(amp,t);g.gain.exponentialRampToValueAtTime(.0001,t+.36);o.connect(g);g.connect(mix);o.start(t);o.stop(t+.38);drumNoise(t,.018,.06,2800);}
  function snare(t){drumNoise(t,.19,.18,1200);drumNoise(t+.018,.12,.1,2100);synth(50,t,.1,.12,'triangle',400);}
  const chords=[[40,55,59,64],[36,55,60,64],[43,55,59,62],[38,57,62,66],[40,55,59,64]];
  // Slow stereo chord bed under a rhythmic eighth-note bass and bright arpeggio.
  for(let bar=0;bar<10;bar++){
   const t=bar*4*beat,chord=chords[Math.floor(bar/2)],root=chord[0];
   for(const n of chord.slice(1)){synth(n,t,4*beat,.045,'sawtooth',1100,-.35);synth(n+.04,t,4*beat,.045,'sawtooth',1400,.35);}
   for(let step=0;step<8;step++){
    const time=t+step*beat/2;if(time>=17)continue;
    synth(root+(step===6?12:0),time,beat*.42,.15,'sawtooth',650);
    if(bar>=1){const n=chord[1+step%3]+12;synth(n,time,beat*.65,bar>=6?.075:.055,'square',3200,step%2?.3:-.3);synth(n,time+beat*.75,beat*.5,.018,'triangle',2200,step%2?-.6:.6);}
   }
  }
  for(let n=0;n<35;n++){
   const t=n*beat;if(t>=17)break;
   if(n>=4||n%4===0)kick(t,n>=24?.72:.62);
   if(n>=4&&n%4%2===1)snare(t);
   if(n>=4){drumNoise(t,.035,.035,7500,'highpass',-.2);drumNoise(t+beat/2,n%4===3?.14:.045,n%4===3?.043:.032,6200,'highpass',.25);}
  }
  // Two build-ups and a final chord accent for the call to action.
  for(const start of [7.8,15.4]){for(let j=0;j<8;j++)drumNoise(start+j*.13,.07,.025+j*.006,1600+j*450);}
  for(const t of [0,8.7,11.5,16.6]){drumNoise(t,1,.08,5200,'highpass');kick(t,.5);}
  kick(17,.75);drumNoise(17,1.1,.08,3400,'highpass');for(const n of[40,52,59,64,67,71])synth(n,17,2.5,.07,'sawtooth',2600,n%2?.35:-.35);
  const rendered=await ac.startRendering();let peak=0,sum=0;
  for(let ch=0;ch<2;ch++){const data=rendered.getChannelData(ch);for(let i=0;i<data.length;i++){data[i]*=Math.min(1,i/(rate*.02),(data.length-i)/(rate*.25));peak=Math.max(peak,Math.abs(data[i]));sum+=data[i]*data[i];}}
  const scale=.92/Math.max(peak,.01),samples=rendered.length,buf=new ArrayBuffer(44+samples*4),view=new DataView(buf);
  const word=(at,s)=>[...s].forEach((x,i)=>view.setUint8(at+i,x.charCodeAt(0)));word(0,'RIFF');view.setUint32(4,36+samples*4,true);word(8,'WAVE');word(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,2,true);view.setUint32(24,rate,true);view.setUint32(28,rate*4,true);view.setUint16(32,4,true);view.setUint16(34,16,true);word(36,'data');view.setUint32(40,samples*4,true);
  for(let i=0;i<samples;i++)for(let ch=0;ch<2;ch++)view.setInt16(44+(i*2+ch)*2,Math.round(Math.max(-1,Math.min(1,rendered.getChannelData(ch)[i]*scale))*32767),true);
  const bytes=new Uint8Array(buf);let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));await window.saveScore(btoa(binary));return{duration,bpm:124,peak:.92,rms:Math.sqrt(sum/(samples*2))*scale};
 }));
}finally{await browser.close();}
