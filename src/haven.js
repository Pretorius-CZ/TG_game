const board={rows:7,cols:7,types:6};
const rows=[
 ['dock','Outer dock','A place to return to',25,72,[[3,18],[0,12]],24,[],
  'The outer berth needs the structural panels we recovered. Secure the dock and we will finally have a safe place to return to.',
  'Dock restored. One material shipment has been installed in the berth.',
  'The rest of the warning','The cached greeting finishes as we connect: "Do not power the main ring before aligning it." The voice belongs to Haven’s caretaker system. It has been keeping a small habitat alive while the expedition searches farther out.'],
 ['power','Station power','Keep the refuge alive',25,49,[[1,24]],25,[],
  'The reserve cells from the ice relay can restart the station grid. The caretaker has waited a long time for this.',
  'Station power restored. The energy shipment is connected; docking and service lights are online.',
  'A borrowed sunrise','Windows light up across the refuge. The caretaker says the crew left through the gate with enough supplies for a short survey. The return window passed without a message.'],
 ['ring','Gate alignment','Close the circle',68,34,[[3,21],[4,15]],28,[15,19,29,33],
  'The gate is not a ship engine. Its segments must agree on the same geometry before we feed them power.',
  'Ring segments aligned. The jump aperture remains inactive until the final systems check.',
  'The road between stars','Haven was built around an old transit ring. Ships travel freely inside a system, but this structure carries them between stars. Once both ends recognize a route, the passage stays registered.'],
 ['coupler','Energy coupling','A steady current',75,58,[[1,21],[0,18]],28,[9,11,30,32],
  'The cells have started the station. Its own reactor can now sustain the gate—we only need to reconnect the coupling.',
  'Gate coupling online. The station reactor can sustain repeated crossings without more shipments.',
  'No toll on the way home','The connection is stable. The caretaker promises that a registered route can be used in either direction. We will not need to gather another shipment just to come home.'],
 ['route-coordinates','Destination coordinates','Where the expedition went',24,32,[[2,21],[4,21]],29,[8,12,36,40],
  'The two recovered archives contain matching transit signatures. Load both and let the observatory reconstruct the destination.',
  'Two research archives installed. A route to the Aster Veil system is verified.',
  'Aster Veil','The next system appears as a blue star behind a veil of dust. A survey buoy, a shattered moon, and a garden-world candidate. This is where the expedition was heading when its messages stopped.'],
 ['stabilize','Stabilize the jump gate','One last alignment · HARD',62,79,[[1,24],[2,24],[4,18]],34,[9,12,22,26,37,40,44,47],
  'Every segment is ready. Stabilize the covered control relays and open the route. We can always turn back once it is registered.',
  'Jump gate stabilized. Aster Veil is within reach. The route will remain open after your first crossing.',
  'An open door','The ring fills with light. The caretaker will remain at Haven and keep the refuge running. I have a ship, a safe dock behind me, and a road into the unknown.'],
];
const labels=['Fuel cells','Energy crystals','Blue comets','Asteroids','Stars','Energy orbs'];
export const havenRepairs=rows.map(([key,name,lesson,x,y,goals,moves,ice,thought,result],i)=>({
 id:`haven-${key}`,name,lesson,x,y,moves,ice,thought,result,room:'HAVEN / JUMP GATE',icon:'✦',action:'Restore station system',
 level:i===5?{rows:8,cols:7,types:6}:board,
 goals:goals.map(([type,target])=>({type,target,label:labels[type]})),target:goals.reduce((n,g)=>n+g[1],0),targetType:null,
 objective:`Collect ${goals.map(([t,n])=>`${n} ${labels[t].toLowerCase()}`).join(', ')}.${ice.length?' Break every protective cover.':''}`,
}));
export const havenLogs=rows.map((r,i)=>({id:`haven-${r[0]}-log`,repair:`haven-${r[0]}`,title:r[10],text:r[11],source:'Station log',time:`Haven / Restoration ${i+1}`,unlockAt:49+i}));
export const jumpLog={id:'first-jump-log',title:'A different sky',source:'Personal log',time:'Aster Veil / Arrival',unlockAt:55,text:'The stars stretch into lines, then settle into a sky I have never seen. Haven answers immediately behind us: route registered, return passage open. Ahead, an old survey buoy blinks in the dust. The expedition came this way. For the first time, following it does not mean leaving every safe place behind.'};
export const gateReady=p=>p.scannerInstalled&&p.iceCompleted===6&&p.wreckCompleted===6&&p.havenCompleted===6;
export const havenDestination={title:'Haven Refuge',key:'havenCompleted',repairs:havenRepairs,logs:havenLogs,image:'haven-gate',complete:'Refuge restored. A road between stars is open.',clips:[
 'polygon(0% 62%,44% 62%,44% 92%,0% 92%)',
 'polygon(0% 41%,46% 41%,46% 62%,0% 62%)',
 'polygon(45% 3%,100% 3%,100% 49%,45% 49%)',
 'polygon(46% 49%,100% 49%,100% 70%,46% 70%)',
 'polygon(0% 18%,45% 18%,45% 41%,0% 41%)',
 'polygon(45% 70%,100% 70%,100% 96%,45% 96%)',
]};
