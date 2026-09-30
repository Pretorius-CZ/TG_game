import React from 'react';
import './garden.css';
export default function GardenArt({completed}){
 return <div className="garden-activation" aria-hidden="true"><svg viewBox="0 0 768 1365" preserveAspectRatio="none">
  <g className={completed>=1?'active':''} data-garden-system="terrace"><ellipse cx="330" cy="1060" rx="325" ry="77" fill="none" stroke="#edce85" strokeWidth="3" strokeDasharray="24 18"/></g>
  <g className={completed>=2?'active':''} data-garden-system="beacon"><rect x="93" y="849" width="10" height="50" rx="5" fill="#8fffe0"/><path d="M96 825Q140 798 106 775M79 822Q41 800 74 779" fill="none" stroke="#7cf9dd" strokeWidth="3"/></g>
  <g className={completed>=3?'active':''} data-garden-system="bridge"><path d="M179 718Q364 727 581 702M183 728Q365 737 579 711" fill="none" stroke="#a9f7fc" strokeWidth="3"/></g>
  <g className={completed>=4?'active':''} data-garden-system="water"><path d="M458 557Q533 586 440 613T418 665Q473 688 433 715M286 619Q316 655 284 685" fill="none" stroke="#6bf3e0" strokeWidth="5" strokeDasharray="12 9"/></g>
  <g className={completed>=5?'active':''} data-garden-system="archive"><path d="M666 449V581M679 516V587M717 462V563" stroke="#ffe2a3" strokeWidth="4"/><circle cx="667" cy="451" r="6" fill="#fff3c1"/></g>
  <g className={completed>=6?'active':''} data-garden-system="heart"><path d="M407 497V577M425 510V579M257 535V622M193 473V557" stroke="#b4f6bd" strokeWidth="3"/>{[[260,620],[390,560],[480,650],[329,681],[590,677],[205,897],[428,921],[687,878]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5" fill="#bbffd0"/>)}</g>
 </svg></div>;
}
