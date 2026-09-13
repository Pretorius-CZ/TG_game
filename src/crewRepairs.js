const full = {rows:7, cols:7, types:5};
const corners = {...full, mask:Array.from({length:49},(_,i)=>![0,6,42,48].includes(i))};
export const crewRepairs = [
  {id:'crew-ventilation', room:'CREW QUARTERS', name:'Air circulation', icon:'◎', x:25,y:23,
    thought:"The air has barely moved since the landing. Let's reconnect the fan and get this room breathing again.",
    lesson:'A breath of hope', objective:'Match any 36 pieces to restore air circulation.', target:36,targetType:null,
    action:'Restore ventilation',result:'The fan is running and the duct is sealed. Fresh air can reach the cabin.',level:full},
  {id:'crew-filters', room:'CREW QUARTERS', name:'Air filters',icon:'◇',x:77,y:24,
    thought:"The fan works, but the filter took a beating. A clean cartridge should clear the dust.",
    lesson:'Clear the air',objective:'Match 18 blue comets to restore the air filters.',target:18,targetType:2,
    action:'Replace the filters',result:'Clean filters are in place. The cabin air is clear again.',level:corners},
  {id:'crew-bunk', room:'CREW QUARTERS',name:'Bunk',icon:'▱',x:25,y:48,
    thought:"I can't sleep in the pilot's seat forever. Let's make this bunk safe—and a little more comfortable.",
    lesson:'Somewhere to rest',objective:'Match 20 energy crystals to rebuild the bunk.',target:20,targetType:1,
    action:'Restore the bunk',result:'The bunks are secure, with fresh bedding ready for a proper rest.',level:full},
  {id:'crew-cabin', room:'CREW QUARTERS',name:'Cabin systems',icon:'ϟ',x:76,y:49,
    thought:"A working desk, secure lockers and warm lights. Small things that make a ship feel like home.",
    lesson:'A place to call home',objective:'Match any 48 pieces to restore the cabin systems.',target:48,targetType:null,
    action:'Bring the cabin to life',result:'Crew quarters restored. Your doorway now shines cyan in the corridor.',level:corners},
];
export function completeCrewRepair(completed,id){return crewRepairs[completed]?.id===id?completed+1:completed;}
export const crewLogs = [
  {id:'crew-breath',repair:'crew-ventilation',title:'The sound of air',text:"The fan is humming again. For a moment it sounds like an ordinary night between supply stops. I hadn't realised how much I missed that sound."},
  {id:'crew-clean',repair:'crew-filters',title:'A clearer room',text:"The dust is finally clearing. The little photographs beside the bunks survived the landing. Familiar places, a long way from this moon."},
  {id:'crew-rest',repair:'crew-bunk',title:'A proper place to rest',text:"The bunk is ready. My original route was supposed to end with a routine delivery and a quiet night. I'll take the quiet night, even here."},
  {id:'crew-home',repair:'crew-cabin',title:'More than a shelter',text:"The lockers close, the lights are warm, and my cup is back on the desk. There is still a ship to repair and a signal to follow. Tonight, this room feels like home."},
].map((entry,i)=>({...entry,source:'Personal log',time:`After landing / Crew quarters ${i+1}`,unlockAt:i+1}));
