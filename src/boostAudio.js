import {createBoostSynth,boostSounds} from './boostSynth.js';
export {boostSounds};
// Versioned, local samples: no external audio service or runtime downloads from vendors.
export const boostSampleUrls=Object.fromEntries(boostSounds.map(name=>[name,`./audio/${name}-${['pulse','nova'].includes(name)?'v2':'v1'}.wav`]));
export function createBoostAudio(ctx,destination){
 const fallback=createBoostSynth(ctx,destination),buffers=new Map(),voices=new Set();
 const abort=new AbortController();let disposed=false,last=-Infinity;
 const compressor=ctx.createDynamicsCompressor();
 compressor.threshold.value=-16;compressor.knee.value=10;compressor.ratio.value=5;
 compressor.attack.value=.003;compressor.release.value=.12;compressor.connect(destination);
 const ready=Promise.all(boostSounds.map(async name=>{
  try{
   const response=await fetch(new URL(boostSampleUrls[name],document.baseURI),{signal:abort.signal});
   if(!response.ok)throw new Error('Audio sample unavailable');
   const buffer=await ctx.decodeAudioData(await response.arrayBuffer());
   if(!disposed)buffers.set(name,buffer);
  }catch{/* Synthesis fallback keeps gameplay usable offline or after a failed request. */}
 }));
 function stop(){for(const voice of voices){try{voice.stop();}catch{}}voices.clear();}
 return {ready,play(name){
  if(!boostSounds.includes(name)||disposed)return false;
  const buffer=buffers.get(name);if(!buffer)return fallback.play(name);
  if(ctx.currentTime-last<.12||voices.size>=3)return true;last=ctx.currentTime;
  const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=buffer;
  const gentle=['pulse','nova','emp'].includes(name),t=ctx.currentTime;
  const volume=(voices.size?.65:.9)*(gentle?.42:1);
  gain.gain.setValueAtTime(gentle?0:volume,t);
  if(gentle)gain.gain.linearRampToValueAtTime(volume,t+Math.min(.045,buffer.duration/3));
  const filter=gentle?ctx.createBiquadFilter():null;
  source.connect(gain);
  if(filter){filter.type='lowpass';filter.frequency.value=2600;filter.Q.value=.5;gain.connect(filter);filter.connect(compressor);}else gain.connect(compressor);
  voices.add(source);source.onended=()=>{voices.delete(source);source.disconnect();gain.disconnect();filter?.disconnect();};source.start();
  return true;
 },stop,dispose(){disposed=true;abort.abort();stop();fallback.dispose();compressor.disconnect();}};
}
