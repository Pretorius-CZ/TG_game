import React from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {canInstallScanner} from './exploration.js';
import {havenLocated} from './destinations.js';
import {canVisitAster,asterComplete} from './aster.js';
import './compactGame.css';

export default function SystemChart({progress,onNavigate,onInstall,onApproach,sceneRef}){
 const {t}=useLanguage(),aster=progress.scene==='system2',scanner=progress.scannerInstalled,haven=havenLocated(progress);
 const nodes=aster?[
  {id:'haven',name:'Haven gate',art:'haven-gate-restored.webp',detail:'Return',open:true},
  {id:'buoy',name:'Survey buoy',art:'map-aster-buoy.png',detail:`${progress.buoyCompleted??0}/3`,open:true},
  {id:'fracture',name:'Shattered moon',art:'map-aster-moon.png',detail:canVisitAster(progress,'fracture')?`${progress.fractureCompleted??0}/6`:'Restore buoy',open:canVisitAster(progress,'fracture')},
  {id:'verdant',name:'Verdant world',art:'map-aster-garden.png',detail:canVisitAster(progress,'verdant')?`${progress.verdantCompleted??0}/6`:'Restore buoy',open:canVisitAster(progress,'verdant')},
  {id:'elysium',name:'Elysium',art:'elysium.webp',detail:progress.elysiumArrival===1?'Visit station':asterComplete(progress)?'Plot approach':'Recover both records',open:asterComplete(progress),action:()=>progress.elysiumArrival===1?onNavigate('elysium'):onApproach()},
 ]:[
  {id:'exterior',name:'Landing moon',art:'map-kepler-origin.png',detail:'Return to ship',open:true},
  {id:'mine',name:'Silent Mine',art:'map-kepler-mine.png',detail:`${progress.mineCompleted??0}/6`,open:true},
  {id:'scanner',name:'Long-range scanner',detail:scanner?'Online':canInstallScanner(progress)?'Activate scanner':'Complete the mine',open:canInstallScanner(progress),done:scanner,action:onInstall},
  {id:'ice',name:'Icebound relay',art:'map-kepler-ice.png',detail:scanner?`${progress.iceCompleted??0}/6`:'Activate scanner first',open:scanner},
  {id:'wreck',name:'Drifting archive',art:'map-kepler-wreck.png',detail:scanner?`${progress.wreckCompleted??0}/6`:'Activate scanner first',open:scanner},
  {id:'haven',name:'Haven gate',art:'haven-gate-restored.webp',detail:haven?`${progress.havenCompleted??0}/6`:'Recover both records',open:haven},
 ];
 const status=aster?asterComplete(progress)?'Both records recovered. Elysium is within reach.':'Restore the buoy, then explore both worlds.':haven?'Haven located. Open the gate on the chart.':scanner?'Scanner online. The relay and archive are accessible.':canInstallScanner(progress)?'Cargo secured. Activate the scanner on the chart.':'Complete the mine to prepare the scanner.';
 return <section ref={sceneRef} className={`game compact-chart ${aster?'compact-aster':''}`} aria-label={t(aster?'Aster Veil system':'System chart')}>
  <div className="chart-stars" aria-hidden="true"><i className="system-sun"/><i className="orbit"/><i className="orbit orbit-two"/><i className="orbit orbit-three"/></div>
  <header className="chart-heading"><span className="eyebrow">{t(aster?'CHAPTER 03 / ASTER VEIL':'CHAPTER 02 / SYSTEM CHART')}</span><h1>{t(aster?'A different sky.':'Follow the echoes.')}</h1></header>
  <div className="chart-grid">{nodes.map(node=><button key={node.id} data-node={node.id} className={`chart-node ${node.done?'node-done':''} ${node.id==='scanner'&&node.open?'node-next':''}`} disabled={!node.open} onClick={node.action??(()=>onNavigate(node.id))}>
   <span className={`chart-node-art ${node.id==='haven'?'chart-gate-art':''}`} aria-hidden="true">{node.art?<img src={`./scenes/${node.art}`} alt=""/>:<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="31"/><circle cx="40" cy="40" r="20"/><circle cx="40" cy="40" r="8"/><path d="M40 9v31l22-22M9 40h10m42 0h10M40 61v10"/><circle cx="25" cy="25" r="3" className="scanner-dot"/></svg>}{!node.open&&!node.done&&<span className="node-lock">◇</span>}{node.done&&<span className="node-lock">✓</span>}</span>
   <strong>{t(node.name)}</strong><small>{/^\d/.test(node.detail)?node.detail:t(node.detail)}</small>
  </button>)}</div>
  <p className="chart-status" role="status">{t(status)}</p>
 </section>;
}

