import React from 'react';
import './signalNetwork.css';
// Restoration lights track each actual device; the raster remains the scene background.
export default function SignalArt({scene,completed,repairs}){
 const done=repairs.slice(0,completed),finished=completed===repairs.length;
 return <div className={`signal-activation ${finished?'signal-linked':''}`} aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none">
 <defs><radialGradient id={`signal-light-${scene}`}><stop stopColor="#83ffe4" stopOpacity=".65"/><stop offset="1" stopColor="#83ffe4" stopOpacity="0"/></radialGradient></defs>
 {done.map(r=><g key={r.id} data-signal-device={r.id}><ellipse cx={r.x} cy={r.y} rx="8" ry="6" fill={`url(#signal-light-${scene})`}/><circle cx={r.x+3} cy={r.y-2} r=".55" fill="#b5ffeb"/><path d={`M${r.x-4} ${r.y+1}h8`} stroke="#b5ffeb" strokeWidth=".3"/></g>)}
 {done.length>1&&<path d={done.map((r,i)=>`${i?'L':'M'}${r.x} ${r.y}`).join(' ')} fill="none" stroke="#96eadc" strokeOpacity=".5" strokeWidth=".25" strokeDasharray={finished?undefined:'1 1'}/>}
 {finished&&<path className="signal-route-glow" d="M50 45V22M47 26l3-4 3 4" fill="none" stroke="#aef9ec" strokeWidth=".4"/>}
 </svg></div>;
}
