import {adjacent,matches,swap,refill,makeBoard} from './match3.js';
const thirdRepairs=['crew-bunk','galley-racks','engine-power','airlock-hull-panels','nav-chart'];
export function moveBudget(repair){
 if(repair.moves!=null)return repair.moves;
 const tuned={'crew-bunk':33,'galley-racks':38,'engine-cooling':36,'engine-fuel':37,'engine-power':44,'engine-drive':41,'nav-antenna':36,'nav-chart':44};
 if(tuned[repair.id])return tuned[repair.id];
 if(['lights','windows','computer','diagnostics'].includes(repair.id))return repair.targetType==null?Math.ceil(repair.target/2)+10:Math.ceil(repair.target*1.5)+12;
 return repair.targetType==null?Math.ceil(repair.target/3)+7:Math.ceil(repair.target*1.05)+8;
}
export function initialIce(repair){if(repair.ice)return repair.ice;if(!thirdRepairs.includes(repair.id))return [];const c=repair.level.cols;return [2*c+2,2*c+c-3,4*c+2,4*c+c-3].filter((v,i,a)=>a.indexOf(v)===i);}
export function iceMatches(board,cols,ice=[]){return matches(board,cols);}
export function iceMove(board,cols,ice=[]){for(let a=0;a<board.length;a++)for(const b of[a+1,a+cols]){if(board[a]==null||board[b]==null||ice.includes(a)||ice.includes(b)||!adjacent(a,b,cols))continue;if(iceMatches(swap(board,a,b),cols,ice).length)return[a,b];}return null;}
export function resolveIce(board,cleared,ice,level,random=Math.random){
 const frozen=new Set(ice),thawed=ice.filter(i=>cleared.includes(i));
 const next=refill(board.map((v,i)=>frozen.has(i)?null:v),cleared,level,random);
 ice.forEach(i=>next[i]=board[i]);
 return {collected:cleared.filter(i=>!frozen.has(i)),board:next,ice:ice.filter(i=>!thawed.includes(i)),thawed};
}
export const finaleRepair={id:'launch-check',room:'FINAL CHALLENGE',name:'Launch sequence',icon:'✦',lesson:'One last push',thought:'The ship is repaired. Clear the sealed launch relays and bring every system into sync.',objective:'Break all 8 protective covers and match 70 pieces in 48 moves.',target:70,targetType:null,moves:48,ice:[16,18,22,26,29,33,37,39],action:'Complete the launch check',level:{rows:8,cols:7,types:6}};

export function makeIceBoard(level,ice=[],random=Math.random){for(let n=0;n<1000;n++){const board=makeBoard(level,random);if(iceMove(board,level.cols,ice))return board;}throw new Error('No playable board with this ice layout.');}

