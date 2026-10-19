import {adjacent} from './match3.js';
export const resonatorsComplete=(devices,charges)=>devices.every((r,i)=>(charges[i]??0)>=r.target);
// Runs sharing a tile form one combination (T/L/cross), not several impulses.
export function resonatorMatchGroups(matched,cols,board){
 const cells=new Set(matched),groups=[];
 for(const at of cells){
  if(board[at]==null||board[at]>=10)continue;
  for(const step of [1,cols]){
   const previous=at-step;
   if(cells.has(previous)&&board[previous]===board[at]&&(step===cols||Math.floor(previous/cols)===Math.floor(at/cols)))continue;
   const run=[at];
   for(let next=at+step;cells.has(next)&&board[next]===board[at]&&(step===cols||Math.floor(next/cols)===Math.floor(at/cols));next+=step)run.push(next);
   if(run.length<3)continue;
   const touching=groups.filter(group=>group.some(cell=>run.includes(cell)));
   for(const group of touching)groups.splice(groups.indexOf(group),1);
   groups.push([...new Set([...run,...touching.flat()])]);
  }
 }
 return groups;
}
// Independent combinations charge independently, including in the same wave.
export function chargeResonators(devices,charges,matched,cols,board){
 if(!devices.length)return [];
 const groups=resonatorMatchGroups(matched,cols,board);
 return devices.map((r,i)=>Math.min(r.target,(charges[i]??0)+groups.filter(group=>group.some(cell=>adjacent(cell,r.at,cols))).length));
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
