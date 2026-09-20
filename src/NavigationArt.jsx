import React from 'react';

export default function NavigationArt({completed}){
 return <div className="navigation-displays" data-navigation-stage={completed} aria-hidden="true">
  {completed>=1&&<div className="antenna-control"><span>LINK</span><i/><i/><i/><b>ONLINE</b></div>}
  {completed>=2&&<div className="receiver-display"><span>LIVE CHANNEL</span><svg viewBox="0 0 300 35"><path d="M0 18H35L43 8L51 28L62 3L74 31L87 13L95 18H124L132 8L143 30L155 4L168 27L177 18H214L225 6L239 29L250 13L263 18H300"/></svg><b>SEVEN FOUR · WE HEAR YOU</b></div>}
  {completed>=3&&<div className="chart-display"><svg viewBox="0 0 400 210">
   <g fill="none" stroke="#4ba6bd" opacity=".4"><ellipse cx="190" cy="108" rx="165" ry="66"/><ellipse cx="190" cy="108" rx="106" ry="43"/><path d="M15 108H385M190 12V198M50 35L333 182M53 182L329 35"/></g>
   {[[45,56],[73,155],[134,68],[180,140],[256,57],[292,158],[340,75],[224,176],[116,111]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i===0||i===6?5:2.5} fill={i===6?'#ffd579':'#b9f8ff'}/>)}
   <circle cx="340" cy="75" r="17" fill="none" stroke="#ffd579" className="beacon-ring"/>
   {completed>=4&&<path className="flight-route" d="M45 56 Q60 126 116 111 T256 57 Q310 35 340 75" fill="none" stroke="#ffd579" strokeWidth="3"/>}
   <text x="27" y="42">SHIP</text><text x="289" y="108">BEACON</text>
  </svg><span>{completed>=4?'COURSE VERIFIED':'BEACON LOCATED'}</span></div>}
 </div>;
}
