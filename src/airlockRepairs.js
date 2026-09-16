const full={rows:7,cols:6,types:5};
const corners={...full,mask:Array.from({length:42},(_,i)=>![0,5,36,41].includes(i))};
export const airlockRepairs=[
 {id:'airlock-power',room:'AIRLOCK & HULL',name:'Service power',icon:'ϟ',x:11,y:27,thought:"The emergency lamps are still holding. Let's restore the service panel before we touch the hatches.",lesson:'A little more light',objective:'Match 24 energy crystals to restore service power.',target:24,targetType:1,action:'Restore service power',result:'Service power restored. The airlock controls and work lights are back online.',level:full},
 {id:'airlock-inner-hatch',room:'AIRLOCK & HULL',name:'Inner hatch',icon:'▣',x:28,y:36,thought:'This hatch separates the cabin from the airlock. It needs to close properly before I test the outer seals.',lesson:'A safe barrier',objective:'Match any 36 pieces to repair the inner hatch.',target:36,targetType:null,action:'Secure the inner hatch',result:'The inner hatch closes securely. The cabin can be isolated from the airlock.',level:corners},
 {id:'airlock-hull-panels',room:'AIRLOCK & HULL',name:'Hull panels',icon:'◇',x:89,y:53,thought:"The service arm can reach the damaged plating from outside. I'll restore its controls and let it handle the patch.",lesson:'A skin for the ship',objective:'Match 24 fuel cells to power the hull repair.',target:24,targetType:0,action:'Patch the hull',result:'The service arm has replaced the damaged hull panels. The breach beneath the cockpit is closed.',level:full,exterior:'./scenes/exterior-hull.webp'},
 {id:'airlock-seals',room:'AIRLOCK & HULL',name:'Airlock seals',icon:'◎',x:55,y:34,thought:'The hull is patched. New seals and a pressure test will tell me whether this compartment is ready.',lesson:'Holding steady',objective:'Match any 42 pieces to restore the airlock seals.',target:42,targetType:null,action:'Seal the airlock',result:'Pressure test passed. The outer hatch is sealed and its green indicator is on. Airlock and hull secured.',level:corners,exterior:'./scenes/exterior-sealed.webp'},
];
export const airlockLogs=[
 {id:'airlock-service-light',repair:'airlock-power',title:'A little more light',text:"The service lights reveal a thin, branching scorch mark along the outer frame. It doesn't look like damage from the rocks. I'll inspect it when the hull camera is working."},
 {id:'airlock-inner-safe',repair:'airlock-inner-hatch',title:'One safe room at a time',text:'The inner hatch locks with a familiar, reassuring click. One more barrier between me and the cold outside. This ship is beginning to feel like shelter again.'},
 {id:'airlock-hull-marks',repair:'airlock-hull-panels',title:'Marks beneath the damage',text:"The hull camera shows the same branching marks beyond the impact damage. Something energetic brushed the ship before we landed. That's a clue, not an explanation."},
 {id:'airlock-pressure-safe',repair:'airlock-seals',title:'Holding steady',text:'Pressure is holding. The ship has a skin again. Whatever remains on the repair list, the cold outside can stay outside. One more step toward following that signal.'},
].map((e,i)=>({...e,source:'Personal log',time:`After landing / Airlock ${i+1}`,unlockAt:i+1}));

export function exteriorStage(cockpit,airlock){
 if(cockpit<4)return 0;
 return airlock>=4?3:airlock>=3?2:1;
}
