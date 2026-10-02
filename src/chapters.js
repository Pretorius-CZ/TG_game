import {destinations} from './destinations.js';
import {shipStages,chapterEntry} from './chapterFlow.js';
import {canVisitAster} from './aster.js';
import {canVisitElysium} from './elysium.js';
import {canVisitRift} from './rift.js';
const groups=[
 ['ship','The ship','Loď',[], 'exterior'],
 ['kepler','Kepler Reach','Kepler Reach',['mine','ice','wreck','haven'],'system'],
 ['aster','Aster Veil','Aster Veil',['buoy','fracture','verdant'],'system2'],
 ['elysium','Elysium','Elysium',Object.keys(destinations).filter(s=>s.startsWith('elysium-')&&s!=='elysium-research'),'elysium'],
 ['rift','The Rift','Trhlina',Object.keys(destinations).filter(s=>s.startsWith('rift-')),'rift'],
 ['ring','The living ring','Živý prstenec',['beyond-rift'],'beyond-rift'],
 ['relay','The fading world','Zhasínající svět',['elysium-research','fading-relay'],'elysium-research'],
 ['night','The night garden','Noční zahrada',['night-glade','night-grove','night-root','night-sanctuary'],'night-glade'],
 ['refuge','The Refuge','Útočiště',['refuge-dock'],'refuge-dock'],
];
export function chaptersFor(p){return groups.map(([id,en,cs,scenes,entry],index)=>{
 const sites=scenes.map(scene=>({scene,...destinations[scene]}));
 const sections=id==='ship'?shipStages.map(s=>({...s,title:s.name,repairs:Array.from({length:s.total})})):sites;
 let total=sections.reduce((n,s)=>n+s.repairs.length,0),done=sections.reduce((n,s)=>n+Math.min(s.repairs.length,p[s.key]??0),0);
 if(id==='ship'){total++;done+=p.finaleDone?1:0;}
 if(id==='aster'){total++;done+=p.elysiumRouteCompleted===1?1:0;}
 const open=id==='ship'||id==='kepler'&&p.launchDone||id==='aster'&&p.jumpDone||id==='elysium'&&canVisitElysium(p,'elysium')||id==='rift'&&canVisitRift(p,'rift')||id==='ring'&&canVisitRift(p,entry)||['relay','night','refuge'].includes(id)&&canVisitElysium(p,entry);
 const next=id==='ship'?chapterEntry(p):id==='kepler'&&!p.scannerInstalled?'system':id==='aster'&&done===15?'system2':sites.find(s=>(p[s.key]??0)<s.repairs.length)?.scene??entry;
 return {id,en,cs,image:id==='ship'?'exterior-portrait':sites[0]?.image,number:index+1,entry,next,sections,total,done,open:Boolean(open),partial:id==='refuge'};
});}

export function chapterSectionOpen(p,c,scene){
 if(!c.open)return false;
 if(c.id==='ship')return Boolean(p.launchDone)||scene===c.next;
 if(c.id==='kepler')return !['ice','wreck'].includes(scene)||Boolean(p.scannerInstalled);
 if(c.id==='aster')return canVisitAster(p,scene);
 if(c.id==='rift'||c.id==='ring')return canVisitRift(p,scene);
 return canVisitElysium(p,scene);
}
