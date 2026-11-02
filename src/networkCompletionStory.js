import {networkLevels} from './networkLevels.js';
const level=n=>networkLevels.find(r=>r.number===n);
const panel=(image,n,field='thought')=>({image,imageExtension:'png',title:level(n).name,caption:level(n)[field]});
export const networkCompletionStories=[
 {id:'network-visitor-arrives',chapter:'network',scene:'network-visitor-service',ready:p=>p.networkFarCoreCompleted===3,
  title:level(231).name,finishLabel:level(231).name,panels:[panel('network-far-core-restored',230,'result'),panel('network-freighter',231)]},
 {id:'network-alternate-flight',chapter:'network',scene:'network-detour',ready:p=>p.networkVisitorCargoCompleted===3,
  title:level(236).name,finishLabel:level(236).name,panels:[panel('network-freighter-restored',235,'result'),panel('network-detour-shelter',236)]},
 {id:'network-prepare-reception',chapter:'network',scene:'network-receiving-dock',ready:p=>p.networkRouteRelayCompleted===3,
  title:level(241).name,finishLabel:level(241).name,panels:[panel('network-detour-shelter-restored',240,'result'),panel('network-receiving',241)]},
 {id:'network-crew-boards',chapter:'network',scene:'network-crew-arrival',ready:p=>p.networkDockControlCompleted===3,
  title:level(246).name,finishLabel:level(246).name,panels:[panel('network-receiving-restored',245,'result'),panel('network-first-watch',246)]},
 {id:'network-watch-complete',chapter:'network',scene:'network-first-watch',terminal:true,ready:p=>p.networkFirstWatchCompleted===3,
  title:level(250).name,finishLabel:'View the completed chapter',panels:[panel('network-receiving-restored',245,'result'),panel('network-first-watch-restored',250,'result')]},
];
