// Layered synthesis keeps effects small and avoids downloading audio assets.
export const boostSounds=['laser','pulse','nova','emp','shuffle','tool-swap','beam'];
export function createBoostSynth(ctx,destination){
 const compressor=ctx.createDynamicsCompressor();
 compressor.threshold.value=-18;compressor.knee.value=12;compressor.ratio.value=6;
 compressor.attack.value=.003;compressor.release.value=.18;compressor.connect(destination);
 const noise=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
 const data=noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
 let last=-Infinity;
 function envelope(source,duration,volume,delay=0,filter=null){
  const t=ctx.currentTime+delay,g=ctx.createGain();g.gain.setValueAtTime(.0001,t);
  g.gain.exponentialRampToValueAtTime(volume,t+.008);
  g.gain.exponentialRampToValueAtTime(.0001,t+duration);
  source.connect(filter??g);if(filter)filter.connect(g);g.connect(compressor);
  source.start(t);source.stop(t+duration+.02);
  source.onended=()=>{source.disconnect();filter?.disconnect();g.disconnect();};
 }
 function sweep(start,end,duration,volume,type='sine',delay=0){
  const o=ctx.createOscillator(),t=ctx.currentTime+delay;o.type=type;
  o.frequency.setValueAtTime(start,t);o.frequency.exponentialRampToValueAtTime(end,t+duration);
  envelope(o,duration,volume,delay);
 }
 function hiss(frequency,end,duration,volume,delay=0){
  const source=ctx.createBufferSource(),f=ctx.createBiquadFilter(),t=ctx.currentTime+delay;
  source.buffer=noise;f.type='bandpass';f.Q.value=.7;
  f.frequency.setValueAtTime(frequency,t);f.frequency.exponentialRampToValueAtTime(end,t+duration);
  envelope(source,duration,volume,delay,f);
 }
 return {play(name){
  if(!boostSounds.includes(name))return false;
  // One composite blast per wave; rapid chains cannot stack unlimited voices.
  if(ctx.currentTime-last<.12)return true;last=ctx.currentTime;
  if(name==='laser'){
   sweep(500,1800,.10,.09,'triangle');sweep(2400,120,.30,.23,'sawtooth',.06);
   hiss(5000,700,.23,.16,.06);sweep(170,45,.25,.15,'sine',.07);
  }else if(name==='pulse'){
   // Short pressure front and low impact; no prolonged rumble or debris tail.
   hiss(3600,1800,.07,.72);sweep(210,48,.17,.55);
   sweep(85,35,.25,.48,'sine',.025);hiss(850,120,.28,.58,.02);
   hiss(4200,650,.07,.20,.10);
  }else if(name==='nova'||name==='beam'){
   sweep(220,1700,.16,.14,'triangle');sweep(1800,160,.55,.22,'sawtooth',.08);
   hiss(4200,350,.65,.30,.08);sweep(130,35,.7,.32,'sine',.08);
  }else if(name==='emp'){
   sweep(180,900,.18,.15,'triangle');sweep(190,28,.75,.38,'sine',.14);
   hiss(3000,70,.6,.28,.14);sweep(900,120,.4,.10,'triangle',.16);
  }else if(name==='shuffle'){
   for(let i=0;i<6;i++){hiss(900+i*350,400,.13,.12,i*.13);sweep(300+i*80,190,.12,.08,'triangle',i*.13);}
   sweep(800,500,.15,.13,'triangle',.85);
  }else{
   sweep(350,1200,.14,.13,'triangle');sweep(1200,350,.17,.13,'triangle',.12);
   hiss(2000,600,.2,.08);
  }
  return true;
 },dispose(){compressor.disconnect();}};
}
