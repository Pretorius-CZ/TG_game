import React,{useEffect,useRef,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import './riftTransit.css';

const duration=9400;
const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{const x=clamp(n);return x*x*(3-2*x);};

// A folded, flowing membrane, rather than the straight star trails of the Haven jump.
function drawPassage(ctx,w,h,time,entry,arrival,reduced){
 const t=time/1000,enter=smooth((t-.3)/2.8),exit=smooth((t-6.6)/2.2);
 ctx.fillStyle='#05030e';ctx.fillRect(0,0,w,h);
 function cover(img,zoom=1,alpha=1,focus=.45){
  if(!img.complete||!img.naturalWidth)return;
  const scale=Math.max(w/img.naturalWidth,h/img.naturalHeight)*zoom;
  const iw=img.naturalWidth*scale,ih=img.naturalHeight*scale;
  ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(img,w*.5-iw*.5,h*.45-ih*focus,iw,ih);ctx.restore();
 }
 if(reduced){cover(arrival,1);return;}
 if(t<3.1)cover(entry,1+enter*2.6,1,.4);
 const membrane=smooth((t-1.5)/1.2)*(1-exit);
 if(membrane>0){
  ctx.save();ctx.globalAlpha=membrane;
  const cx=w*(.5+.07*Math.sin(t*.53)),cy=h*(.47+.04*Math.cos(t*.63));
  const halo=ctx.createRadialGradient(cx,cy,0,cx,cy,h*.85);
  halo.addColorStop(0,'#06091a');halo.addColorStop(.22,'#171b3e');halo.addColorStop(.55,'#4c276b');halo.addColorStop(.8,'#132739');halo.addColorStop(1,'#080411');
  ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);
  // Deep layers bend towards different vanishing points to suggest a curved throat.
  for(let k=44;k>=0;k--){
   const z=(k+(t*.85)%1)/44,r=10+z*z*Math.max(w,h)*1.12;
   const bend=(1-z)*Math.sin(t*.55+z*3.3);
   const x=cx+bend*w*.16,y=cy+Math.cos(z*4+t*.42)*(1-z)*h*.09;
   ctx.beginPath();
   for(let j=0;j<=100;j++){
    const a=j/100*Math.PI*2;
    const fold=1+.13*Math.sin(a*3+t*.7-z*6)+.055*Math.cos(a*7-t*.6+z*9);
    const px=x+Math.cos(a+z*.7)*r*fold,py=y+Math.sin(a+z*.7)*r*fold*.86;
    if(j===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
   }
   ctx.closePath();
   const hue=245+30*Math.sin(z*5+t*.3),light=10+z*12+(Math.sin(z*22-t*1.9)+1)*6;
   ctx.fillStyle=`hsl(${hue} 48% ${light}%)`;ctx.fill();
   ctx.strokeStyle=`hsla(${185+z*90},75%,78%,${.07+z*.2})`;ctx.lineWidth=.6+z*2;ctx.stroke();
  }
  // Long curved caustics follow the membrane; nothing moves as a radial star streak.
  ctx.globalCompositeOperation='screen';
  for(let k=0;k<9;k++){
   ctx.beginPath();
   for(let j=0;j<=90;j++){
    const z=j/90,a=k*Math.PI*2/9+z*2.1+Math.sin(t*.4)*.35;
    const r=12+z*z*h*.95,fold=1+.1*Math.sin(z*9-t*.9+k);
    const x=cx+Math.cos(a)*r*fold,y=cy+Math.sin(a)*r*.85;
    if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
   }
   ctx.strokeStyle=`rgba(128,213,229,${.055+.025*Math.sin(t+k)})`;ctx.lineWidth=1.2;ctx.stroke();
  }
  ctx.restore();
 }
 if(exit>0){
  // The new landscape opens through the throat, then fills the screen.
  ctx.save();const radius=exit*Math.hypot(w,h);
  ctx.beginPath();ctx.ellipse(w*.5,h*.47,radius,radius*.85,0,0,Math.PI*2);ctx.clip();
  cover(arrival,1.12-.12*exit,1);ctx.restore();
  if(exit<1){ctx.beginPath();ctx.ellipse(w*.5,h*.47,radius,radius*.85,0,0,Math.PI*2);ctx.strokeStyle=`rgba(178,229,224,${Math.sin(exit*Math.PI)*.6})`;ctx.lineWidth=8;ctx.stroke();}
 }
}

export default function RiftTransit({onComplete,onCancel}){
 const {t}=useLanguage(),dialog=useRef(null),canvas=useRef(null),ended=useRef(false);
 const complete=useRef(onComplete),cancel=useRef(onCancel),[phase,setPhase]=useState(0),[reduced,setReduced]=useState(false);
 complete.current=onComplete;cancel.current=onCancel;
 function arrive(){if(ended.current)return;ended.current=true;complete.current();}
 function leave(){if(ended.current)return;ended.current=true;cancel.current();}
 useEffect(()=>{
  const modal=dialog.current;modal.showModal();
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');setReduced(media.matches);
  const el=canvas.current,ctx=el.getContext('2d'),entry=new Image(),arrival=new Image();
  entry.src='./scenes/rift-beacons-restored.webp';arrival.src='./scenes/rift-beyond.webp';
  let frame,w=1,h=1,elapsed=0,last=null,currentPhase=0,disposed=false;
  const paint=()=>{if(ctx&&!disposed)drawPassage(ctx,w,h,elapsed,entry,arrival,media.matches);};
  const resize=()=>{const box=el.getBoundingClientRect();w=box.width;h=box.height;const dpr=Math.min(window.devicePixelRatio||1,2);el.width=w*dpr;el.height=h*dpr;ctx?.setTransform(dpr,0,0,dpr,0,0);paint();};
  const observer=new ResizeObserver(resize);observer.observe(el);resize();
  entry.onload=arrival.onload=paint;
  function tick(now){
   if(disposed||ended.current)return;
   // Pausing in the background preserves the whole sequence on return.
   if(document.hidden||media.matches){last=null;return;}
   if(last!==null)elapsed+=Math.min(now-last,80);last=now;
   const next=elapsed<2800?0:elapsed<6800?1:2;
   if(next!==currentPhase){currentPhase=next;setPhase(next);}
   paint();
   if(elapsed>=duration){arrive();return;}frame=requestAnimationFrame(tick);
  }
  const resume=()=>{cancelAnimationFrame(frame);last=null;paint();if(!document.hidden&&!media.matches)frame=requestAnimationFrame(tick);};
  const preference=()=>{setReduced(media.matches);resume();};
  document.addEventListener('visibilitychange',resume);media.addEventListener('change',preference);resume();
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();entry.onload=arrival.onload=null;document.removeEventListener('visibilitychange',resume);media.removeEventListener('change',preference);};
 },[]);
 return <dialog ref={dialog} className="rift-transit-dialog" aria-label={t('Through the Rift')} onCancel={e=>{e.preventDefault();leave();}}>
  <div className="rift-passage" data-phase={reduced?'still':phase}>
   <canvas ref={canvas} aria-hidden="true"/>
   <div className="rift-passage-shade" aria-hidden="true"/>
   <div className="rift-passage-copy"><span className="eyebrow">{t('THE RIFT')}</span><h2>{t(reduced?'Beyond the familiar sky':['Approaching the aperture','Between two skies','The garden emerges'][phase])}</h2><p role="status">{t(reduced?'Return beacon online':['The anchors hold. Moving beyond the threshold.','Space folds around the ship. Follow the return signal.','Elysium receives our signal from the other side.'][phase])}</p></div>
   <div className="rift-passage-actions"><span>{t('ELYSIUM LINK / ONLINE')}</span><button className="primary" onClick={arrive}>{t(reduced?'Continue →':'Skip crossing →')}</button><button className="keep-playing" onClick={leave}>{t('Stay at the Rift')}</button></div>
  </div>
 </dialog>;
}
