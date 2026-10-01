import {repairs} from './repairs.js';
import {airlockRepairs} from './airlockRepairs.js';
import {navigationRepairs} from './navigationRepairs.js';
import {crewRepairs} from './crewRepairs.js';
import {galleyRepairs} from './galleyRepairs.js';
import {engineRepairs} from './engineRepairs.js';
import {exteriorRepairs} from './exteriorRepairs.js';
import {finaleRepair,moveBudget} from './levelRules.js';
import {elysiumRoute} from './elysium.js';
import {destinations} from './destinations.js';
export const levelGroups=[
 ['Chapter 1 / Airlock',airlockRepairs],['Chapter 1 / Cockpit',repairs],
 ['Chapter 1 / Navigation',navigationRepairs],['Chapter 1 / Crew',crewRepairs],
 ['Chapter 1 / Galley',galleyRepairs],['Chapter 1 / Engines',engineRepairs],
 ['Chapter 1 / Exterior',exteriorRepairs],['Chapter 1 / Launch',[finaleRepair]],
 ['Chapter 3 / Elysium approach',[elysiumRoute]],
 ...Object.values(destinations).map(s=>[s.title,s.repairs])
];
export const levelCatalog=levelGroups.flatMap(([group,levels])=>levels.map(r=>({id:r.id,name:r.name,group,moves:moveBudget(r),cols:r.level.cols,rows:r.level.rows,types:r.level.types})));
