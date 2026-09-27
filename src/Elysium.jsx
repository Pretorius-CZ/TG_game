import React from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {elysiumDestinations,elysiumSectorOrder,elysiumComplete,canVisitElysium} from './elysium.js';
const positions=[[25,59],[81,64],[50,43],[22,29],[79,31],[50,15]];
const requirements=['','Restore the dock first','Restore the core first','Restore the ring first','Restore the residential sector first','Restore the biosphere first'];
const nextSteps=['Restore the arrival dock to enter the station safely.','The dock is safe. Restore the energy core next.','The core is stable. Reopen the central ring.','Restore the residential sector next.','Restore the biosphere to support the habitats.','Restore the observatory and send the welcome beacon.'];
export default function Elysium({progress,onNavigate,onLog}){
 const {t}=useLanguage(),finished=elysiumSectorOrder.map(id=>progress[elysiumDestinations[id].key]===4),complete=elysiumComplete(progress),count=finished.filter(Boolean).length;
 return <section className={`game elysium-map ${complete?'elysium-complete':''}`} aria-label={t('Elysium station')}>
  <div className="elysium-art" aria-hidden="true"><img src="./scenes/elysium.webp" alt=""/>
   {finished[0]&&<img src="./scenes/elysium-restored.webp" alt="" className="elysium-lit dock-lit"/>}
   {finished[1]&&<img src="./scenes/elysium-restored.webp" alt="" className="elysium-lit core-lit"/>}
   {finished[2]&&<img src="./scenes/elysium-ring-exterior.webp" alt="" className="elysium-lit ring-lit"/>}
   {finished[3]&&<img src="./scenes/elysium-city-exterior.webp" alt="" className="elysium-lit homes-lit"/>}
   {finished[4]&&<img src="./scenes/elysium-city-exterior.webp" alt="" className="elysium-lit garden-lit"/>}
   {complete&&<img src="./scenes/elysium-city-exterior.webp" alt="" className="elysium-lit city-lit"/>}
  </div>
  <div className="scene-top"><span className="eyebrow">{t(complete?'CHAPTER 04 COMPLETE':'CHAPTER 04 / ELYSIUM')}</span><h1>{t(complete?'A city awake.':'The sleeping city.')}</h1><p>{t(complete?'Station restoration complete':'A silent city. One sector at a time.')}</p></div>
  {elysiumSectorOrder.map((id,i)=>{
   const site=elysiumDestinations[id],playable=canVisitElysium(progress,id),[x,y]=positions[i];
   return <button key={id} className={`station-sector ${playable?'sector-open':''}`} style={{left:`${x}%`,top:`calc(150px + (100% - 240px) * ${y/100})`}} disabled={!playable} onClick={()=>onNavigate(id)}>
    <span className="sector-marker">{finished[i]?'✓':playable?'↗':'◇'}</span><strong>{t(site.title)}</strong><small>{playable?`${progress[site.key]??0}/4`:t(requirements[i])}</small>
   </button>;
  })}
  <div className="scene-bottom scene-caption"><span className="eyebrow">{count}/6 · {t('SECTORS ONLINE')}</span><p>{t(complete?'All six sectors are online. Elysium is ready for the returning crew.':nextSteps[count])}</p>{complete&&<button className="primary" onClick={()=>onLog(elysiumDestinations['elysium-observatory'].logs.at(-1).id)}>{t('Read the reply →')}</button>}</div>
 </section>;
}
