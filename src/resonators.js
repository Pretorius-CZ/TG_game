import {adjacent} from './match3.js';
export const resonatorsComplete=(devices,charges)=>devices.every((r,i)=>(charges[i]??0)>=r.target);
// One impulse per device per matching wave, even when several neighbours match.
export function chargeResonators(devices,charges,matched,cols){
 return devices.map((r,i)=>Math.min(r.target,(charges[i]??0)+(matched.some(cell=>adjacent(cell,r.at,cols))?1:0)));
}
