import {adjacent} from './match3.js';
export const resonatorsComplete=(devices,charges)=>devices.every((r,i)=>(charges[i]??0)>=r.target);
// One impulse per device per matching wave, even when several neighbours match.
export function chargeResonators(devices,charges,matched,cols){
 return devices.map((r,i)=>Math.min(r.target,(charges[i]??0)+(matched.some(cell=>adjacent(cell,r.at,cols))?1:0)));
}

// Leave the eight neighbouring cells free, and keep covers separated too.
export function spacedResonatorCovers(covers,devices,level){
 if(!devices.length)return covers;
 const distance=(a,b)=>Math.max(Math.abs(a%level.cols-b%level.cols),Math.abs(Math.floor(a/level.cols)-Math.floor(b/level.cols)));
 const valid=at=>at>=0&&at<level.rows*level.cols&&level.mask?.[at]!==false&&devices.every(r=>distance(at,r.at)>1);
 const candidates=[...new Set([...covers,...Array.from({length:level.rows*level.cols},(_,i)=>i)])];
 const result=[],limit=devices.length>=2?Math.min(3,covers.length):covers.length;
 for(const at of candidates){if(valid(at)&&result.every(other=>distance(at,other)>1))result.push(at);if(result.length===limit)break;}
 return limit?result:[];
}
