import {signalScenes} from './signalNetwork.js';
import {shipStages} from './chapterFlow.js';
import {repairs} from './repairs.js';
import {airlockRepairs} from './airlockRepairs.js';
import {navigationRepairs} from './navigationRepairs.js';
import {crewRepairs} from './crewRepairs.js';
import {galleyRepairs} from './galleyRepairs.js';
import {engineRepairs} from './engineRepairs.js';
import {exteriorRepairs} from './exteriorRepairs.js';
import {finaleRepair} from './levelRules.js';
import {destinations} from './destinations.js';
import {elysiumSectorOrder} from './elysium.js';
import {riftOrder} from './rift.js';
import {archiveScenes} from './archive.js';
const shipTasks=[airlockRepairs,repairs,navigationRepairs,crewRepairs,galleyRepairs,engineRepairs,exteriorRepairs];
const repair=(scene,task,purpose)=>({kind:'repair',scene,repair:task,purpose});
const action=(scene,id,en,cs,purpose)=>({kind:'action',scene,action:id,label:[en,cs],purpose});
const purposes={ship:['Restore your ship and follow the expedition beacon.','Oprav svou loď a vydej se za majákem výpravy.'],kepler:['Recover both bearings to locate Haven.','Získej oba směry a najdi Haven.'],aster:['Compare both expedition records to find Elysium.','Porovnej oba záznamy výpravy a najdi Elysium.'],elysium:['Wake the city and restore its listening station.','Probuď město a obnov jeho naslouchající stanoviště.'],rift:['Investigate the echo and keep a safe way home.','Prozkoumej ozvěnu a zachovej bezpečnou cestu domů.'],ring:['Decode the living map and locate the human signal.','Rozlušti živou mapu a najdi lidský signál.'],night:['Follow the expedition trail to the garden caretaker.','Sleduj stopu výpravy ke správci zahrady.'],refuge:['Prepare the Refuge and bring the rescued crew home.','Připrav Útočiště a umožni návrat zachráněné posádky.'],archive:['Find out how the rescue network carried the expedition’s call.','Zjisti, jak záchranná síť přenášela volání výpravy.']};
function siteTask(p,scene,purpose){const site=destinations[scene],task=site.repairs[p[site.key]??0];return task?repair(scene,task,purpose):null;}
function choice(p,scenes,scene,purpose){const choices=scenes.filter(s=>(p[destinations[s].key]??0)<destinations[s].repairs.length);return choices.length?{kind:'choice',scene,choices,purpose}:null;}
// A single source of truth for story continuation. Visiting old scenes never changes this objective.
export function journeyFor(p){
 if(!p.launchDone){for(const [i,s] of shipStages.entries())if((p[s.key]??0)<s.total)return repair(s.scene,shipTasks[i][p[s.key]??0],purposes.ship);
  return p.finaleDone?action('exterior','departure','Launch the ship','Odletět s lodí',purposes.ship):repair('exterior',finaleRepair,purposes.ship);}
 let next=siteTask(p,'mine',purposes.kepler);if(next)return next;
 if(!p.scannerInstalled)return action('system','scanner','Activate the scanner','Zapnout skener',purposes.kepler);
 next=choice(p,['ice','wreck'],'system',purposes.kepler);if(next)return next;
 next=siteTask(p,'haven',purposes.kepler);if(next)return next;
 if(!p.jumpDone)return action('haven','gate','Travel to Aster Veil','Letět do Aster Veil',purposes.aster);
 next=siteTask(p,'buoy',purposes.aster);if(next)return next;
 next=choice(p,['fracture','verdant'],'system2',purposes.aster);if(next)return next;
 if(p.elysiumRouteCompleted!==1||p.elysiumArrival!==1)return action('system2','approach','Plot the Elysium approach','Naplánovat přílet k Elysiu',purposes.elysium);
 for(const s of elysiumSectorOrder){next=siteTask(p,s,purposes.elysium);if(next)return next;}
 for(const s of riftOrder){next=siteTask(p,s,purposes.rift);if(next)return next;}
 if(p.riftCrossed!==1)return action('rift','cross','Cross the Rift','Proletět Trhlinou',purposes.rift);
 for(const s of ['beyond-rift','elysium-research','fading-relay']){next=siteTask(p,s,purposes.ring);if(next)return next;}
 for(const s of ['night-glade','night-grove','night-root','night-sanctuary']){next=siteTask(p,s,purposes.night);if(next)return next;}
 if(p.caretakerMet!==1)return action('night-sanctuary','encounter','Meet the caretaker','Setkat se se správcem',purposes.night);
 for(const s of ['refuge-dock','refuge-homes','refuge-medical','return-corridor','refuge-arrival']){next=siteTask(p,s,purposes.refuge);if(next)return next;}
 for(const s of archiveScenes){next=siteTask(p,s,purposes.archive);if(next)return next;}
 for(const s of signalScenes){next=siteTask(p,s,['Restore the beacon links and deliver the crew’s answer.','Obnov spojení majáků a doruč odpověď posádky.']);if(next)return next;}
 return {kind:'end',scene:'signal-station',purpose:['200 levels completed. The crew is home and the rescue network has acknowledged their return. You can revisit repairs and replay the story.','Dokončil jsi 200 levelů. Posádka je doma a záchranná síť potvrdila její návrat. Můžeš opakovat opravy a přehrát příběh.']};
}
export function destinationName(scene){return destinations[scene]?.title??({system:'Kepler Reach',system2:'Aster Veil',elysium:'Elysium',rift:'The Rift',exterior:'Exterior',airlock:'Airlock',cockpit:'Cockpit',navigation:'Communications & navigation',crew:'Crew quarters',galley:'Galley & supplies',engine:'Engine room',corridor:'Corridor'}[scene]??scene);}
