import {networkLevels,networkTileNames} from './networkLevels.js';
import {networkStopDefinitions,completionStops} from './networkContinuation.js';

export const networkStops=[
 {scene:'network-handover',key:'networkHandoverCompleted',title:'The network watch',total:5,positions:[[17,50],[83,50],[18,63],[83,63],[50,49]],complete:'The old route stays open while we build the extension.'},
 {scene:'network-platform',key:'networkPlatformCompleted',title:'The service platform',total:5,positions:[[15,44],[82,35],[15,62],[83,56],[50,53]],complete:'The platform is ready for its first maintenance crew.'},
 ...networkStopDefinitions,
 ...completionStops,
];
export const networkScenes=networkStops.map(s=>s.scene);
export const networkDestinations=Object.fromEntries(networkStops.map((stop,section)=>{
 const {scene,title,key,total,positions,complete}=stop;
 const offset=networkStops.slice(0,section).reduce((n,s)=>n+s.total,0);
 const repairs=networkLevels.slice(offset,offset+total).map((draft,i)=>({
  ...draft,room:title,lesson:draft.name,tileSet:'network',resonators:draft.nodes,orderedRoute:true,
  x:positions[i][0],y:positions[i][1],ice:draft.ice??[],target:draft.goals.reduce((n,g)=>n+g.target,0),targetType:null,
  action:'Continue the network work',objective:draft.number>210&&!draft.nodes.length?'Collect the marked components and clear any protective covers.':'Collect the marked components. Power the numbered nodes in order. Blasts do not directly charge nodes.',
 }));
 return [scene,{title,key,repairs,
  system:section?networkStops[section-1].scene:'signal-station',chapter:'The new network',art:'network',hotspotOffset:0,
  image:stop.image??scene,imageExtension:'png',restoredExtension:'png',
  ...(stop.restoredImage?{restoredImage:stop.restoredImage}:{}),
  clips:repairs.map(r=>`polygon(${Math.max(0,r.x-18)}% ${r.y-9}%,${Math.min(100,r.x+18)}% ${r.y-9}%,${Math.min(100,r.x+18)}% ${r.y+9}%,${Math.max(0,r.x-18)}% ${r.y+9}%)`),
  complete,
  ...(networkStops[section+1]?{nextScene:networkStops[section+1].scene}:{}),
  logs:repairs.map(r=>({id:r.id+'-log',repair:r.id,title:r.name,text:r.result,source:'Network service log',time:title,unlockAt:r.number})),
 }];
}));
export const canVisitNetwork=(p,scene)=>{
 const index=networkScenes.indexOf(scene);
 return index>=0&&p.signalStationCompleted===4&&networkStops.slice(0,index).every(s=>p[s.key]===s.total);
};
export {networkTileNames};
