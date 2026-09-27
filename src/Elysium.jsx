import React from 'react';
import {useLanguage} from './i18n/Language.jsx';

const sectors=[
 ['elysium-dock','Arrival dock',25,59],['elysium-core','Energy core',81,64],
 ['elysium-ring','Central ring',50,43],['homes','Residential sector',22,29],
 ['garden','Biosphere',79,31],['command','Observatory',50,15],
];
export default function Elysium({progress,onNavigate}){
 const {t}=useLanguage(),dock=progress.elysiumDockCompleted===4,core=progress.elysiumCoreCompleted===4,ring=progress.elysiumRingCompleted===4;
 return <section className="game elysium-map" aria-label={t('Elysium station')}>
  <div className="elysium-art" aria-hidden="true"><img src="./scenes/elysium.webp" alt=""/>
   {dock&&<img src="./scenes/elysium-restored.webp" alt="" className="elysium-lit dock-lit"/>}
   {core&&<img src="./scenes/elysium-restored.webp" alt="" className="elysium-lit core-lit"/>}
   {ring&&<img src="./scenes/elysium-ring-exterior.webp" alt="" className="elysium-lit ring-lit"/>}
  </div>
  <div className="scene-top"><span className="eyebrow">{t('CHAPTER 04 / ELYSIUM')}</span><h1>{t('The sleeping city.')}</h1><p>{t(ring?'The ring is open. Homes and gardens are next.':core?'Essential power restored. The city is still asleep.':'A silent city. One sector at a time.')}</p></div>
  {sectors.map(([id,name,x,y],i)=>{
   const playable=i===0||(i===1&&dock)||(i===2&&core),count=i===0?progress.elysiumDockCompleted:i===1?progress.elysiumCoreCompleted:progress.elysiumRingCompleted;
   return <button key={id} className={`station-sector ${playable?'sector-open':''}`} style={{left:`${x}%`,top:`calc(150px + (100% - 240px) * ${y/100})`}} disabled={!playable} onClick={()=>onNavigate(id)}>
    <span className="sector-marker">{playable?'↗':'◇'}</span><strong>{t(name)}</strong><small>{t(playable?`${count??0}/4`:i===1?'Restore the dock first':i===2?'Restore the core first':'Coming next')}</small>
   </button>;
  })}
  <div className="scene-bottom scene-caption"><span className="eyebrow">{t(ring?'THREE SECTORS ONLINE':core?'TWO SECTORS ONLINE':'RESTORATION / ELYSIUM')}</span><p>{t(ring?'Next: restore the residential sector, then build the biosphere.':core?'The core is stable. Reopen the central ring.':dock?'The dock is safe. Restore the energy core next.':'Restore the arrival dock to enter the station safely.')}</p></div>
 </section>;
}
