import React,{useEffect,useRef,useState} from 'react';
import {sound} from './audio.js';

// Perspective star field: particles approach the camera instead of rotating spokes.
function WarpField(){
 const canvas=useRef(null);
 useEffect(()=>{
  const el=canvas.current,ctx=el.getContext('2d');
  if(!ctx)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width=1,height=1,frame,last=performance.now(),start=last;
  let seed=719;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  const stars=Array.from({length:600},()=>({x:(random()-.5)*3,y:(random()-.5)*3,z:random()*2+.05,hue:random()<.2?260:195+random()*25,size:.4+random()*1.2}));
  function resize(){const rect=el.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);el.width=width*dpr;el.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);if(reduced)draw(start);}
  const observer=new ResizeObserver(resize);observer.observe(el);resize();
  function draw(now){
   const t=(now-start)/1000,dt=Math.min((now-last)/1000,.04);last=now;
   const acceleration=reduced?0:Math.min(1,Math.max(0,(t-1.25)/.85));
   const exit=reduced?0:Math.min(1,Math.max(0,(t-5.25)/1.25));
   const warp=acceleration*(1-exit),speed=.025+warp*1.45;
   ctx.fillStyle='#020610';ctx.fillRect(0,0,width,height);
   const cx=width*(.5+Math.sin(t*.4)*.012*warp),cy=height*.47,focal=Math.max(width,height)*.46;
   const fog=ctx.createRadialGradient(cx,cy,4,cx,cy,height*.68);
   fog.addColorStop(0,'#d7f7ff');fog.addColorStop(.018,'#75caff');fog.addColorStop(.08,`rgba(54,103,192,${.18+warp*.4})`);fog.addColorStop(.36,`rgba(22,53,118,${.08+warp*.32})`);fog.addColorStop(1,'rgba(2,6,16,0)');
   ctx.fillStyle=fog;ctx.fillRect(0,0,width,height);
   ctx.globalCompositeOperation='lighter';
   // Faint nested wavefronts give the star streaks a curved tunnel volume.
   if(warp>.01)for(let i=0;i<12;i++){
    const travel=((t*.55+i/12)%1),radius=12+travel*travel*height*.9;
    ctx.beginPath();ctx.ellipse(cx,cy,radius*.78,radius,Math.sin(t*.2)*.08,0,Math.PI*2);
    ctx.strokeStyle=`rgba(74,124,224,${warp*.028*Math.sin(travel*Math.PI)})`;ctx.lineWidth=1+travel*4;ctx.stroke();
   }
   for(const star of stars){
    if(!reduced)star.z-=dt*speed;
    if(star.z<.035){star.z=2;star.x=(random()-.5)*3;star.y=(random()-.5)*3;}
    const x=cx+star.x*focal/star.z,y=cy+star.y*focal/star.z;
    if(x< -100||x>width+100||y< -100||y>height+100)continue;
    const tail=star.z+.005+warp*.38;
    const tx=cx+star.x*focal/tail,ty=cy+star.y*focal/tail;
    const alpha=Math.min(.95,.24+(.8/star.z))*(.65+warp*.35);
    const gradient=ctx.createLinearGradient(tx,ty,x+.01,y+.01);
    gradient.addColorStop(0,`hsla(${star.hue},90%,65%,0)`);gradient.addColorStop(1,`hsla(${star.hue},90%,85%,${alpha})`);
    ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(x,y);ctx.strokeStyle=gradient;ctx.lineWidth=Math.min(3,star.size/star.z);ctx.stroke();
   }
   ctx.globalCompositeOperation='source-over';
   // One soft exposure swell on acceleration, no repeated flashes.
   const flare=reduced?0:Math.max(0,1-Math.abs(t-1.8)/.5)*.27;
   if(flare){ctx.fillStyle=`rgba(185,223,255,${flare})`;ctx.fillRect(0,0,width,height);}
   if(!reduced)frame=requestAnimationFrame(draw);
  }
  draw(start);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();};
 },[]);
 return <canvas ref={canvas} className="warp-field" aria-hidden="true"/>;
}

export default function GateTransit({onComplete,onCancel}){
 const dialog=useRef(null),finish=useRef(onComplete),[phase,setPhase]=useState(0),ended=useRef(false);
 finish.current=onComplete;
 function arrive(){if(ended.current)return;ended.current=true;finish.current();}
 useEffect(()=>{
  dialog.current.showModal();sound('repair');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timers=[setTimeout(()=>setPhase(1),reduced?200:1500),setTimeout(()=>setPhase(2),reduced?450:5300),setTimeout(arrive,reduced?900:6900)];
  return()=>timers.forEach(clearTimeout);
 },[]);
 return <dialog ref={dialog} className="transit-dialog" aria-label="Jump to Aster Veil" onCancel={e=>{e.preventDefault();onCancel();}}>
  <div className={`transit-cinema transit-phase-${phase}`}>
   <WarpField/>
   <div className="warp-vignette" aria-hidden="true"/>
   <div className="warp-gate" aria-hidden="true"/>
   <div className="transit-copy"><span className="eyebrow">KEPLER REACH <span aria-hidden="true">⟶</span> ASTER VEIL</span><h2>{['Jump field charging','Warp transit','A different sky'][phase]}</h2><p role="status">{['Route locked · preparing to accelerate','Following the expedition’s coordinates','Decelerating · return passage established'][phase]}</p></div>
   <div className="warp-telemetry" aria-hidden="true"><span>{['FIELD SYNCHRONIZATION','TRANSIT CORRIDOR STABLE','DESTINATION ACQUIRED'][phase]}</span><i/><small>HAVEN LINK / ONLINE</small></div>
   <div className="transit-actions"><button className="primary" onClick={arrive}>Skip crossing →</button><button className="keep-playing" onClick={onCancel}>Stay at Haven</button></div>
  </div>
 </dialog>;
}
