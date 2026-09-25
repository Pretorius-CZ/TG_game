import {useLanguage} from './i18n/Language.jsx';
import React,{useId} from 'react';
import FuelDepot from './FuelDepot.jsx';
import {exteriorScene} from './exteriorRepairs.js';

// Raster details share the portrait coordinate system with the scene.
export default function ExteriorArt({cockpit=0,completed=0,seals=false,antenna=false}){
 const {t}=useLanguage();
 const id=useId().replace(/:/g,'');
 return <div className="exterior-art" data-exterior-stage={completed} data-antenna={antenna?'deployed':'stowed'} data-seals={seals}>
  <img className="scene-image scene-layer" src={exteriorScene(cockpit,completed)} alt={t("")}/>
  <svg className="exterior-details" viewBox="0 0 941 1672" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
   <defs>
    <filter id={`${id}-edge`}><feGaussianBlur stdDeviation="2"/></filter>
    <mask id={`${id}-antenna`} maskUnits="userSpaceOnUse" x="0" y="0" width="941" height="1672"><path d="M365 658H463V755L445 768L397 753Z" fill="white" filter={`url(#${id}-edge)`}/></mask>
    <mask id={`${id}-hatch`} maskUnits="userSpaceOnUse" x="0" y="0" width="941" height="1672"><rect x="430" y="835" width="72" height="136" rx="8" fill="white" filter={`url(#${id}-edge)`}/></mask>
   </defs>
   {t(antenna&&<g className="ship-antenna"><image href="./scenes/exterior-antenna-source.webp" width="941" height="1672" mask={`url(#${id}-antenna)`}/></g>)}
   {t(cockpit>=4&&<image href={seals?'./scenes/exterior-sealed.webp':'./scenes/exterior-cockpit-lit.webp'} width="941" height="1672" mask={`url(#${id}-hatch)`}/>)}
  </svg>
  <FuelDepot fueled={completed>=4}/>
 </div>;
}
