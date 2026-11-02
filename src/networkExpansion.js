import {networkLevels,networkTileNames} from './networkLevels.js';

// The first ten tasks of the expansion. Counts are independent of the original 200.
export const networkScenes=['network-handover','network-platform'];
const positions=[[[17,50],[83,50],[18,63],[83,63],[50,49]],[[15,44],[82,35],[15,62],[83,56],[50,53]]];
export const networkDestinations=Object.fromEntries(networkScenes.map((scene,section)=>{
 const title=section?'The service platform':'The network watch';
 const repairs=networkLevels.slice(section*5,section*5+5).map((draft,i)=>({
  ...draft,room:title,lesson:draft.name,tileSet:'network',resonators:draft.nodes,orderedRoute:true,
  x:positions[section][i][0],y:positions[section][i][1],ice:[],target:draft.goals.reduce((n,g)=>n+g.target,0),targetType:null,
  action:'Continue the network work',objective:'Collect the marked components. Power the numbered nodes in order. Blasts do not directly charge nodes.',
 }));
 return [scene,{title,key:section?'networkPlatformCompleted':'networkHandoverCompleted',repairs,
  system:section?'network-handover':'signal-station',chapter:'The new network',art:'network',hotspotOffset:0,
  image:scene,imageExtension:'png',restoredExtension:'png',
  clips:repairs.map(r=>`polygon(${Math.max(0,r.x-18)}% ${r.y-9}%,${Math.min(100,r.x+18)}% ${r.y-9}%,${Math.min(100,r.x+18)}% ${r.y+9}%,${Math.max(0,r.x-18)}% ${r.y+9}%)`),
  complete:section?'The platform is ready for its first maintenance crew.':'The old route stays open while we build the extension.',
  ...(section?{}:{nextScene:'network-platform'}),
  logs:repairs.map(r=>({id:r.id+'-log',repair:r.id,title:r.name,text:r.result,source:'Network service log',time:title,unlockAt:r.number})),
 }];
}));
export const canVisitNetwork=(p,scene)=>networkScenes.includes(scene)&&p.signalStationCompleted===4&&(scene==='network-handover'||p.networkHandoverCompleted===5);
export {networkTileNames};
