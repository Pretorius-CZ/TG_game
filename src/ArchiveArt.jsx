import React from 'react';
import './archive.css';
const centers={'archive-entry':[50,47],'archive-data':[50,30],'archive-simulation':[50,51],'archive-core':[50,30]};
// Vector status lights and recovered projections are live game effects, not a replacement scene.
export default function ArchiveArt({scene,completed,repairs}){
 const [cx,cy]=centers[scene]??[50,45];
 const count=Math.max(0,Math.min(5,completed));
 return <div className={`archive-activation archive-stage-${count}`} aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none">
 {repairs.slice(0,count).map((r,i)=><g key={r.id} data-archive-system={r.id}>
 <circle cx={r.x+5} cy={r.y-3} r=".7" fill="#91ffe0" className="archive-status"/>
 <path d={`M${r.x-4} ${r.y-4}h8v2h-8z`} fill="#78dacf" fillOpacity=".28" stroke="#91ffe0" strokeWidth=".15"/>
 <path d={`M${r.x-3} ${r.y-3.5}h${Math.min(6,i+2)}`} stroke="#bdfff4" strokeWidth=".25"/>
 </g>)}
 {count>=2&&<g className="archive-projection" transform={`translate(${cx} ${cy})`}>
 <ellipse rx="13" ry="4" fill="#50c5e4" fillOpacity=".08" stroke="#7ae5ec" strokeWidth=".2"/>
 {Array.from({length:count-1},(_,i)=><g key={i}><path d={`M${-10+i*5} ${-2-i%2*4}L${-5+i*5} ${-6+(i+1)%2*4}`} fill="none" stroke="#a1e8ef" strokeWidth=".25" strokeDasharray={count<5?'1 .8':undefined}/><circle cx={-10+i*5} cy={-2-i%2*4} r=".6" fill="#a2ffe1"/></g>)}
 {scene==='archive-core'&&<><ellipse rx="12" ry="10" fill="none" stroke="#68d9db" strokeWidth=".3"/><ellipse rx="5" ry="10" fill="none" stroke="#68d9db" strokeWidth=".2"/></>}
 {count===5&&<path d="M-10 0L-3-4L3-2L10-6" stroke="#b8fbd7" strokeWidth=".6" fill="none"/>}
 </g>}
 {count===5&&<path d="M32 84L45 79M55 79L68 84" stroke="#8bead1" strokeWidth=".4"/>}
 </svg></div>;
}
