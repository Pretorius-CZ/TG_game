const square={rows:7,cols:7,types:6};
const tall={rows:8,cols:7,types:6};
const cut=level=>({...level,mask:Array.from({length:level.rows*level.cols},(_,i)=>![0,level.cols-1,(level.rows-1)*level.cols,level.rows*level.cols-1].includes(i))});
export const navigationRepairs=[
 {id:'nav-antenna',room:'NAVIGATION',name:'Signal antenna',icon:'⌁',x:18,y:44,thought:"The beacon's coordinates survived. First, I need an antenna that can hear more than static.",lesson:'A direction in the noise',objective:'Match 20 energy crystals to restore the antenna.',target:20,targetType:1,action:'Deploy the antenna',result:'The antenna is deployed. A pulse is coming from the recorded bearing.',level:square,exterior:true},
 {id:'nav-receiver',room:'NAVIGATION',name:'Communications',icon:'≋',x:59,y:35,thought:"There is a pattern in the noise. Let's restore the receiver and send a short reply.",lesson:'Someone is listening',objective:'Match any 42 pieces to restore communications.',target:42,targetType:null,action:'Restore communications',result:'Someone answered our code. This is a live reply.',level:cut(square)},
 {id:'nav-chart',room:'NAVIGATION',name:'Star chart',icon:'✦',x:56,y:47,thought:'Someone answered. Now I need to place those coordinates on a working chart.',lesson:'A point among the stars',objective:'Match 22 stars to restore the chart.',target:22,targetType:4,action:'Restore the star chart',result:'The beacon now has a place on the chart. A destination beyond this moon.',level:tall},
 {id:'nav-route',room:'NAVIGATION',name:'Flight route',icon:'↗',x:65,y:47,thought:"A destination is not a safe route. I'll check the approach before asking this ship to fly.",lesson:'A course to follow',objective:'Match any 50 pieces to verify the flight route.',target:50,targetType:null,action:'Verify the course',result:'Course verified. Check every ship system before departure.',level:cut(tall)},
];
export const navigationLogs=[
 {id:'nav-noise',repair:'nav-antenna',title:'A direction in the noise',source:'Personal log',text:'The receiver is picking up a pulse from the recorded bearing. It matches the old expedition beacon. The message itself is still buried in static.'},
 {id:'nav-answer',repair:'nav-receiver',title:'An answer',source:'Transmission record',text:'OUTGOING: If you can hear me, repeat this code: SEVEN FOUR.\n\nINCOMING: SEVEN FOUR. We hear you. Follow the beacon.'},
 {id:'nav-point',repair:'nav-chart',title:'A point among the stars',source:'Personal log',text:'The beacon now has a place on the chart. Someone is waiting beyond this moon. The lights on the ridge are still another question.'},
 {id:'nav-course',repair:'nav-route',title:'Course verified',source:'Navigation record',text:'BEACON COORDINATES CONFIRMED. APPROACH ROUTE VERIFIED.\n\nDeparture requires completion of all ship repairs.'},
].map((e,i)=>({...e,time:`After landing / Navigation ${i+1}`,unlockAt:i+1}));

export function shipReadiness(progress){
 return [['cockpit','Cockpit',4],['airlock-work','Airlock & hull',4],['crew','Crew quarters',4],['galley','Galley & supplies',4],['engine','Engine room',5],['navigation','Navigation',4]].map(([id,name,total])=>({id,name,total,completed:progress[id]??0,ready:progress[id]===total}));
}
