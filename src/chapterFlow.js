// Chapter one has one active repair stage. Existing completion is never reordered.
export const shipStages=[
 {scene:'airlock',key:'airlockCompleted',total:3,name:'Airlock'},
 {scene:'cockpit',key:'completed',total:4,name:'Cockpit'},
 {scene:'navigation',key:'navigationCompleted',total:4,name:'Navigation'},
 {scene:'crew',key:'crewCompleted',total:4,name:'Crew quarters'},
 {scene:'galley',key:'galleyCompleted',total:4,name:'Galley'},
 {scene:'engine',key:'engineCompleted',total:5,name:'Engine room'},
 {scene:'exterior',key:'exteriorCompleted',total:4,name:'Exterior & fuel'},
];
export function currentShipStage(p){return shipStages.find(s=>(p[s.key]??0)<s.total)??{scene:'exterior',name:p.finaleDone?'Departure':'Launch check',key:null,total:0};}
export function chapterEntry(p){const s=currentShipStage(p).scene;return ['crew','galley','engine'].includes(s)?'corridor':s==='navigation'?'cockpit':s;}
export function canVisitChapter(p,scene){if(p.launchDone)return true;return scene==='exterior'||scene===currentShipStage(p).scene||scene===chapterEntry(p);}
