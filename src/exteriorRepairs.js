const level={rows:7,cols:7,types:6};
export const exteriorRepairs=[
 {id:'exterior-hull',room:'EXTERIOR',name:'Hull panels',icon:'◇',x:29,y:54,thought:'From here I can reach the damaged plating. Time to give this ship its skin back.',lesson:'A skin for the ship',objective:'Match 24 fuel cells to power the hull repair.',target:24,targetType:0,moves:38,action:'Patch the hull',result:'The damaged panels are replaced. The ship has a solid hull again.',level},
 {id:'exterior-engines',room:'EXTERIOR',name:'Engine nacelles',icon:'ϟ',x:82,y:54,thought:'The machinery inside is only half the job. These damaged housings and nozzle rings still need attention.',lesson:'Ready on the outside',objective:'Match 45 pieces to restore the nacelles and nozzles.',target:45,targetType:null,moves:24,action:'Restore engine nacelles',result:'New housings protect the engines. The nozzle rings are aligned and the standby lights are on.',level},
 {id:'exterior-landing-gear',room:'EXTERIOR',name:'Landing gear',icon:'▣',x:36,y:61,thought:'The landing struts locked during impact. Clear their protective covers and lift the hull off the rocks.',lesson:'Back on our feet',objective:'Match 45 pieces and release all 4 protective covers.',target:45,targetType:null,moves:38,action:'Deploy landing gear',result:'Hydraulics press the footpads into the ground. The ship rises onto its landing legs, ready for the final checks.',level},
 {id:'exterior-refuel',room:'EXTERIOR',name:'Emergency fuel depot',icon:'▣',x:77,y:72,thought:'The emergency fuel sled survived the landing. The internal lines are ready; now I need to repair its pump and transfer our reserve.',lesson:'Enough to reach the stars',objective:'Match 24 fuel cells to repair the pump and refuel the ship.',target:24,targetType:0,moves:38,action:'Repair pump & refuel',result:'The pump is running. Fuel flows through the hose into the ship. Tanks filled — one more launch check complete.',level},
];
export const exteriorLogs=[
 {id:'exterior-marks',repair:'exterior-hull',title:'Marks beneath the damage',text:'Beneath the impact scars are thin branching scorch marks. Something energetic brushed the hull before we landed. A clue, not an explanation.'},
 {id:'exterior-nozzles',repair:'exterior-engines',title:'More than a coat of paint',text:'The nozzle rings are aligned again. Whatever the internal diagnostics say, the engines finally look ready to carry us.'},
 {id:'exterior-standing',repair:'exterior-landing-gear',title:'Standing again',text:'For the first time since the landing, the hull is clear of the rocks. The ship settles onto its feet with a familiar creak. Now we can finish the checks and follow that signal.'},
 {id:'exterior-refueled',repair:'exterior-refuel',title:'A reserve for the journey',text:'We unloaded the emergency sled after landing. Its tanks were intact, but the pump had seized. Now the transfer is complete. We have enough fuel to follow the beacon.'},
].map((e,i)=>({...e,source:'Personal log',time:`After landing / Exterior ${i+1}`,unlockAt:i+1}));
export function exteriorScene(cockpit,completed){
 if(cockpit<4)return './scenes/exterior-portrait.webp';
 return ['./scenes/exterior-cockpit-lit.webp','./scenes/exterior-hull.webp','./scenes/exterior-engines.webp','./scenes/exterior-gear.webp'][Math.min(3,Math.max(0,completed))];
}

export function canRefuel(exteriorCompleted,engineCompleted){return exteriorCompleted>=3&&engineCompleted>=2;}
