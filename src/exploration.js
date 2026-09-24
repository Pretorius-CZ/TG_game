const full={rows:7,cols:7,types:5};
const corners={...full,mask:Array.from({length:49},(_,i)=>![0,6,42,48].includes(i))};
const content=[
 ['mine-pad','Landing beacons','A safe approach',27,61,18,1,14,[],
  'No landing clearance. Just an automated beacon repeating into the dark. I can bring the pad lights back from here.',
  'The approach lights trace a safe path to the outpost.',
  'No one at the gate','The beacon called us in, but nobody answered. The dust on this pad is undisturbed. Whoever changed the signal did it from somewhere else.'],
 ['mine-hatch','Station entrance','A door into silence',21,40,18,2,14,[],
  'The emergency hatch is sealed. Its local circuit should still respond to a clean power pulse.',
  'The hatch is open. Emergency lights reveal a path into the station.',
  'An orderly departure','No damage inside. Tools put away, lockers closed. This was not a panicked evacuation. They left knowing where they were going.'],
 ['mine-power','Power grid','Wake the station',73,47,21,1,17,[15,19,29,33],
  'Protective relays cut the generator off. Clear their covers and we can wake the station without overloading it.',
  'Power restored. The service grid and control cabin are online.',
  'A recent visitor','The generator records one brief activation after the evacuation. Someone came back, changed the beacon, and shut the station down again.'],
 ['mine-drill','Extraction rig','Something worth carrying',80,27,24,3,16,[],
  'A sealed batch of structural material is still in the rig. Releasing it should be easier than starting a new dig.',
  'A structural-material shipment is ready at the rig. Finish loading to bring it aboard.',
  'Held in reserve','The shipment was marked for an orbital station. Someone cancelled the pickup. These plates could reinforce our scanner mount.'],
 ['mine-terminal','Control terminal','A message beneath the loop',45,24,36,null,17,[8,12,36,40],
  'The public beacon repeats the same message. The local terminal may still hold the transmission underneath it.',
  'Research data recovered: two possible relays lie beyond our current scanner range.',
  'Two echoes','There are two coordinates: an ice moon and a derelict among the asteroids. A final note reads: "If the beacon finds you, do not transmit your name."'],
 ['mine-lift','Cargo elevator','Bring it home',82,73,42,null,19,[8,12,22,26,36,40],
  'The elevator is our last link to the pad. One loaded shipment, one set of coordinates. Then we head back to the ship.',
  'Shipment loaded aboard. Structural material and research data are ready for the scanner upgrade.',
  'Not an empty system','Cargo secured. We came looking for a voice and found a trail. With a better scanner, we can choose which echo to follow.'],
];
export const mineRepairs=content.map(([id,name,lesson,x,y,target,targetType,moves,ice,thought,result])=>({
 id,name,lesson,x,y,target,targetType,moves,ice,thought,result,room:'SILENT MINE',icon:'✦',action:'Complete expedition task',
 level:id==='mine-hatch'||id==='mine-lift'?corners:full,
 objective:targetType===1?`Collect ${target} energy crystals.`:targetType===2?`Collect ${target} blue comets.`:targetType===3?`Collect ${target} asteroids.`:id==='mine-terminal'?'Collect 18 comets and 18 stars.':'Collect 21 fuel cells and 21 crystals.',
 ...(targetType==null?{goals:id==='mine-terminal'?[{type:2,target:18,label:'Blue comets'},{type:4,target:18,label:'Stars'}]:[{type:0,target:21,label:'Fuel cells'},{type:1,target:21,label:'Energy crystals'}]}:{}),
}));
export const mineLogs=content.map((row,i)=>({id:`${row[0]}-log`,repair:row[0],title:row[11],text:row[12],source:'Expedition log',time:`Silent Mine / Survey ${i+1}`,unlockAt:30+i}));
export function completeMine(completed,id){return mineRepairs[completed]?.id===id?completed+1:completed;}
// Shipments derive from milestones. Replays cannot farm or duplicate resources.
export function expeditionCargo(completed,scannerInstalled){return {materials:completed===6&&!scannerInstalled?1:0,data:completed>=5&&!scannerInstalled?1:0,energy:0};}
export function canInstallScanner(progress){return progress.launchDone&&progress.mineCompleted===6&&!progress.scannerInstalled;}
