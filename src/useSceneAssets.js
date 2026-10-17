import {useEffect,useState} from 'react';

const images=new Map();
function loadImage(src){
 if(!images.has(src))images.set(src,new Promise((resolve,reject)=>{
  const image=new Image();
  const finish=error=>{image.onload=null;image.onerror=null;if(error){images.delete(src);reject(error);}else resolve();};
  image.onload=()=>image.decode().then(()=>finish(),finish);
  image.onerror=()=>finish(new Error(`Could not load scene: ${src}`));
  image.src=src;
 }));
 return images.get(src);
}

// Only required layers gate interaction. A failed speculative load cannot
// block the current scene, and changing scenes invalidates stale completions.
export default function useSceneAssets(required=[],upcoming=[],enabled=true){
 const key=JSON.stringify([...new Set(required)]),next=JSON.stringify([...new Set(upcoming)]);
 const [state,setState]=useState({key:null,ready:false,error:false}),[attempt,retry]=useState(0);
 useEffect(()=>{
  if(!enabled)return;
  let alive=true,cancelWarm=()=>{};
  setState({key,ready:false,error:false});
  Promise.all(JSON.parse(key).map(loadImage)).then(()=>{
   if(!alive)return;
   setState({key,ready:true,error:false});
   // Save-data users fetch only what they visit. Warm one likely next state
   // after the current scene has painted, never while the welcome is open.
   if(navigator.connection?.saveData)return;
   const warm=()=>{if(alive)JSON.parse(next).forEach(src=>loadImage(src).catch(()=>{}));};
   if(window.requestIdleCallback){const id=requestIdleCallback(warm,{timeout:3000});cancelWarm=()=>cancelIdleCallback(id);}
   else{const id=setTimeout(warm,500);cancelWarm=()=>clearTimeout(id);}
  }).catch(()=>{if(alive)setState({key,ready:false,error:true});});
  return()=>{alive=false;cancelWarm();};
 },[key,next,enabled,attempt]);
 return {loaded:enabled&&state.key===key&&state.ready,error:enabled&&state.key===key&&state.error,retry:()=>retry(n=>n+1)};
}
