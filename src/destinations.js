import {havenDestination} from './haven.js';
import {mineRepairs,mineLogs} from './exploration.js';

const grid={rows:7,cols:7,types:6};
const clipped={...grid,mask:Array.from({length:49},(_,i)=>![0,6,42,48].includes(i))};
const long={rows:8,cols:7,types:6};
const labels=['Fuel cells','Energy crystals','Blue comets','Asteroids','Stars','Energy orbs'];
function tasks(prefix,room,rows){return rows.map((r,i)=>({
 id:`${prefix}-${r.key}`,room,name:r.name,lesson:r.lesson,icon:'✦',x:r.x,y:r.y,
 thought:r.thought,result:r.result,action:'Complete expedition task',
 level:i===5?long:i%2?clipped:grid,moves:[23,24,27,26,28,30][i],
 ice:i<2?[]:i===2?[15,19,29,33]:i===5?[9,12,22,26,37,40]:i===4?[8,12,36,40]:[],
 goals:r.goals.map(([type,target])=>({type,target,label:labels[type]})),
 target:r.goals.reduce((n,g)=>n+g[1],0),targetType:null,
 objective:`Collect ${r.goals.map(([type,target])=>`${target} ${labels[type].toLowerCase()}`).join(' and ')}.`,
}));}
function logs(prefix,title,rows,start){return rows.map((r,i)=>({id:`${prefix}-${r.key}-log`,repair:`${prefix}-${r.key}`,title:r.logTitle,text:r.log,source:'Expedition log',time:`${title} / Survey ${i+1}`,unlockAt:start+i}));}
const iceContent=[
 {key:'beacons',name:'Approach beacons',lesson:'A light in the snow',x:21,y:75,goals:[[1,18]],
 thought:'The scanner sees a station beneath the storm. A line of landing beacons will get us close enough to investigate.',
 result:'Amber beacons cut through the snow. The approach is safe.',logTitle:'A patient signal',
 log:'The relay has been answering automatically for years. Beneath that loop is a newer timestamp—the same day someone visited the mine.'},
 {key:'airlock',name:'Frozen airlock',lesson:'Beyond the frost',x:18,y:49,goals:[[0,18],[2,12]],
 thought:'The outer mechanism is frozen solid. A controlled power cycle should release the seal without cracking it.',
 result:'The entrance is open. Warm emergency light spills onto the snow.',logTitle:'A station put to sleep',
 log:'The crew packed carefully. Sample cases are labelled, bunks are made. Their final checklist says: transfer to the orbital refuge. Its location has been removed.'},
 {key:'heater',name:'Thermal loop',lesson:'Warmth returns',x:80,y:49,goals:[[1,24]],
 thought:'Safety covers locked the thermal relays during the shutdown. Free them before asking the heater for full power.',
 result:'The heater is running. Pipes thaw and the laboratory can be brought online.',logTitle:'Enough for everyone',
 log:'They left charged cells in storage for whoever came next. A note on the heater reads: leave the reserve connected until the last shuttle arrives.'},
 {key:'lab',name:'Research laboratory',lesson:'The missing half',x:32,y:24,goals:[[2,18],[4,18]],
 thought:'The laboratory clock was tied to the relay. Its measurements may tell us where the real transmission came from.',
 result:'Laboratory screens are online. One bearing to the orbital refuge has been recovered.',logTitle:'A moving destination',
 log:'The refuge did not keep a fixed orbit. Its route was hidden in paired observations: one here, one on an archive vessel. Either record alone points into empty space.'},
 {key:'dish',name:'Relay dish',lesson:'Listen without a name',x:79,y:22,goals:[[4,24],[5,12]],
 thought:'I will listen first. The warning at the mine was clear: do not broadcast our identity.',
 result:'The relay has a clean lock. Its bearing is stored for comparison with the archive vessel.',logTitle:'A voice behind the loop',
 log:'A brief message slipped through: "Supply vessel, keep your transponder quiet. We can hear you working." Someone is watching these old relays. I have not answered.'},
 {key:'cells',name:'Reserve energy cells',lesson:'Carry the warmth',x:83,y:77,goals:[[0,21],[1,21]],
 thought:'The reserve is stable. Secure the cells and the relay record; the ship can carry both back to orbit.',
 result:'One energy shipment and one research archive are aboard. Compare this bearing with the drifting archive.',logTitle:'The first bearing',
 log:'Energy secured, relay record copied. We now have a time and a direction. The archive vessel holds the other observation. Together they should show us where the refuge went.'},
];
const wreckContent=[
 {key:'dock',name:'Docking clamps',lesson:'Hold on to the wreck',x:24,y:77,goals:[[0,18]],
 thought:'There is no gravity to hold us here. Secure the boarding cradle before we disturb anything inside.',
 result:'Docking clamps are locked and the boarding lights are on.',logTitle:'A ship that waited',
 log:'The archive vessel is caught in a slow tumble between the rocks. No distress beacon, no fresh impact. It was left here deliberately, engines cold.'},
 {key:'bulkhead',name:'Emergency bulkhead',lesson:'Into the archive',x:13,y:46,goals:[[3,18],[1,12]],
 thought:'The inner door protected the records from the hull breach. I need its emergency circuit, not the entire ship.',
 result:'The bulkhead opens onto an illuminated service passage.',logTitle:'A deliberate silence',
 log:'Every public transmitter was disconnected by hand. The archive was left intact. Whoever abandoned this vessel wanted the records found, but not broadcast.'},
 {key:'reactor',name:'Auxiliary reactor',lesson:'A borrowed heartbeat',x:83,y:47,goals:[[1,24]],
 thought:'The archive needs a steady supply. Clear the reactor safeguards and feed only the essential circuits.',
 result:'The auxiliary reactor is stable. The archive bus has power.',logTitle:'The supply manifest',
 log:'Food, medical packs, habitat panels. These were not weapons or mining supplies. The missing expedition was building a place for people to live.'},
 {key:'records',name:'Navigation archive',lesson:'Recover the second half',x:34,y:28,goals:[[4,18],[2,18]],
 thought:'The protected records survived the breach. A careful restart should recover the vessel’s last observation of the refuge.',
 result:'Archive racks are online. The second observation has been recovered.',logTitle:'A refuge between orbits',
 log:'The station is called Haven. Its approach path is reconstructed from two observations, stored separately here and at the ice relay. That explains the missing coordinates.'},
 {key:'antenna',name:'Passive antenna',lesson:'A signal without a reply',x:82,y:28,goals:[[5,21],[4,15]],
 thought:'This antenna can receive without identifying us. I can verify the archive’s clock against the live signal.',
 result:'The antenna clock is synchronized. Both records can now be compared accurately.',logTitle:'An unfinished welcome',
 log:'A cached greeting ends halfway through: "When you reach Haven, the outer dock will look abandoned. Do not—" The next packet is missing. The live signal is still there.'},
 {key:'cargo',name:'Recovery cradle',lesson:'Bring the record home',x:79,y:72,goals:[[3,21],[0,21]],
 thought:'Secure the archive and the spare structural panels. Nothing else here needs to be disturbed.',
 result:'One material shipment and one research archive are aboard. Compare the record with the ice relay.',logTitle:'The second bearing',
 log:'The recovery cradle is aboard. We have the archive vessel’s bearing and a name: Haven. Once the ice relay’s record is alongside it, there will be nowhere left for that station to hide.'},
];
export const iceRepairs=tasks('ice','ICEBOUND RELAY',iceContent);
export const wreckRepairs=tasks('wreck','DRIFTING ARCHIVE',wreckContent);
export const iceLogs=logs('ice','Icebound Relay',iceContent,36);
export const wreckLogs=logs('wreck','Drifting Archive',wreckContent,42);
export const havenLog={id:'haven-coordinates-log',title:'Haven',source:'Expedition log',time:'Two bearings / One destination',unlockAt:48,text:'The two records align. Beyond the asteroid belt, an orbital station moves through the shadow of the outer planet. Haven. Its main systems are dark, but a light is blinking at the dock. Then the receiver wakes: "You found the way. We will need your help."'};
export const havenLocated=p=>p.scannerInstalled&&p.iceCompleted===6&&p.wreckCompleted===6;
export function completeDestination(completed,id,repairs){return repairs[completed]?.id===id?completed+1:completed;}
export function systemCargo(p){return {materials:(p.mineCompleted===6&&!p.scannerInstalled?1:0)+(p.wreckCompleted===6&&!(p.havenCompleted>=1)?1:0),data:(p.mineCompleted>=5&&!p.scannerInstalled?1:0)+(p.iceCompleted===6&&!(p.havenCompleted>=5)?1:0)+(p.wreckCompleted===6&&!(p.havenCompleted>=5)?1:0),energy:p.iceCompleted===6&&!(p.havenCompleted>=2)?1:0};}
const mineClips=['polygon(0% 50%,60% 50%,60% 76%,0% 80%)','polygon(0% 30%,40% 30%,44% 49%,0% 50%)','polygon(55% 37%,100% 37%,100% 57%,57% 55%)','polygon(60% 8%,100% 8%,100% 37%,60% 38%)','polygon(27% 16%,60% 16%,62% 34%,27% 33%)','polygon(60% 57%,100% 57%,100% 92%,60% 90%)'];
const iceClips=['polygon(0% 64%,53% 64%,53% 94%,0% 94%)','polygon(0% 38%,48% 38%,48% 63%,0% 63%)','polygon(58% 34%,100% 34%,100% 64%,58% 64%)','polygon(8% 14%,59% 14%,59% 36%,8% 36%)','polygon(60% 10%,100% 10%,100% 35%,60% 35%)','polygon(57% 65%,100% 65%,100% 94%,57% 94%)'];
const wreckClips=['polygon(0% 57%,49% 57%,49% 95%,0% 95%)','polygon(0% 34%,32% 34%,32% 58%,0% 58%)','polygon(62% 37%,100% 37%,100% 61%,62% 61%)','polygon(12% 17%,61% 17%,61% 36%,12% 36%)','polygon(62% 10%,100% 10%,100% 36%,62% 36%)','polygon(55% 61%,100% 61%,100% 88%,55% 88%)'];
export const destinations={
 haven:havenDestination,
 mine:{title:'The Silent Mine',key:'mineCompleted',repairs:mineRepairs,logs:mineLogs,image:'silent-mine',clips:mineClips,complete:'A shipment secured. A trail uncovered.'},
 ice:{title:'Icebound Relay',key:'iceCompleted',repairs:iceRepairs,logs:iceLogs,image:'icebound-relay',clips:iceClips,complete:'Reserve cells secured. A bearing recovered.'},
 wreck:{title:'Drifting Archive',key:'wreckCompleted',repairs:wreckRepairs,logs:wreckLogs,image:'drifting-archive',clips:wreckClips,complete:'Archive recovered. Haven has a name.'},
};
