let ctx, music, effects, timer, step = 0, ducked = false;
let prefs = {music:true, effects:true};
try { const saved=JSON.parse(localStorage.getItem('ship-audio')); for(const k of Object.keys(prefs)) if(typeof saved?.[k]==='boolean') prefs[k]=saved[k]; } catch {}
export const audioSettings = () => ({...prefs});
function tone(freq,duration,volume,bus,delay=0) {
  const t=ctx.currentTime+delay, o=ctx.createOscillator(), g=ctx.createGain();
  o.frequency.value=freq; g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(volume,t+Math.min(.04,duration/4));
  g.gain.exponentialRampToValueAtTime(.0001,t+duration);
  o.connect(g);g.connect(bus);o.start(t);o.stop(t+duration+.02);
  o.onended=()=>{o.disconnect();g.disconnect();};
}
function ambient() {
  if(!ctx || ctx.state!=='running' || !prefs.music || document.hidden) return;
  const chord=[[130.81,196,293.66],[110,164.81,246.94],[98,146.83,220],[110,196,261.63]][step++%4];
  chord.forEach((f,i)=>tone(f,8,.035,music,i*.3));
  tone(55,8,.018,music);tone(chord[2]*2,4,.012,music,2);
}
function mix() {
  if(!ctx)return;
  music.gain.setTargetAtTime(prefs.music?(ducked?.32:.65):0,ctx.currentTime,.15);
  effects.gain.setTargetAtTime(prefs.effects?.55:0,ctx.currentTime,.02);
}
async function unlock() {
  try {
    if(!ctx){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;ctx=new Audio();music=ctx.createGain();effects=ctx.createGain();music.connect(ctx.destination);effects.connect(ctx.destination);mix();}
    if(document.hidden)return;
    await ctx.resume();
    if(!timer){ambient();timer=setInterval(ambient,6500);}
  }catch{}
}
export function setAudio(key,value){prefs[key]=value;try{localStorage.setItem('ship-audio',JSON.stringify(prefs));}catch{}mix();window.dispatchEvent(new Event('ship-audio-change'));}
export function duckMusic(value){ducked=value;mix();}
export function sound(name,cascade=0){
  if(!ctx||ctx.state!=='running'||!prefs.effects||document.hidden)return;
  const notes={select:[440],swap:[330,440],invalid:[180,150],match:[523.25,659.25],win:[523.25,659.25,783.99,1046.5],repair:[261.63,392,523.25,783.99]}[name];
  notes?.forEach((f,i)=>tone(f*(name==='match'?2**(Math.min(cascade,5)/12):1),name==='repair'?1.1:name==='win'?.65:.16,name==='select'?.05:.09,effects,i*.085));
}
export function mountAudio(){
  const activate=()=>{void unlock();};
  const visibility=()=>{if(!ctx)return;if(document.hidden)void ctx.suspend().catch(()=>{});else void unlock();};
  document.addEventListener('pointerdown',activate,true);document.addEventListener('keydown',activate,true);document.addEventListener('visibilitychange',visibility);
  return()=>{document.removeEventListener('pointerdown',activate,true);document.removeEventListener('keydown',activate,true);document.removeEventListener('visibilitychange',visibility);clearInterval(timer);timer=undefined;if(ctx)void ctx.close().catch(()=>{});ctx=undefined;};
}
