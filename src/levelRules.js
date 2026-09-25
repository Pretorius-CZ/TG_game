import {adjacent,matches,swap,refill,makeBoard} from './match3.js';
const thirdRepairs=['crew-bunk','galley-racks','engine-power','airlock-seals','exterior-landing-gear','nav-chart'];
export function moveBudget(repair){
 if(repair.moves!=null)return repair.moves;
 return repair.targetType==null?Math.ceil(repair.target/3)+7:Math.ceil(repair.target*1.05)+8;
}
export function initialIce(repair){if(repair.ice)return repair.ice;if(!thirdRepairs.includes(repair.id))return [];const c=repair.level.cols;return [2*c+2,2*c+c-3,4*c+2,4*c+c-3].filter((v,i,a)=>a.indexOf(v)===i);}
export function iceMatches(board,cols,ice=[]){return matches(board,cols);}
export function iceMove(board,cols,ice=[]){const charge=board.findIndex((v,i)=>v>=10&&!ice.includes(i));if(charge>=0)return[charge,charge];for(let a=0;a<board.length;a++)for(const b of[a+1,a+cols]){if(board[a]==null||board[b]==null||ice.includes(a)||ice.includes(b)||!adjacent(a,b,cols))continue;if(iceMatches(swap(board,a,b),cols,ice).length)return[a,b];}return null;}
export function resolveIce(board,cleared,ice,level,random=Math.random){
 const frozen=new Set(ice),thawed=ice.filter(i=>cleared.includes(i));
 // Covers stay on board cells; the pieces beneath them participate in gravity.
 // A covered hit strips the cover without collecting its piece.
 const next=refill(board,cleared.filter(i=>!frozen.has(i)),level,random);
 return {collected:cleared.filter(i=>!frozen.has(i)),board:next,ice:ice.filter(i=>!thawed.includes(i)),thawed};
}
export const finaleRepair={id:'launch-check',room:'FINAL CHALLENGE',name:'Launch sequence',icon:'✦',lesson:'One last push',thought:'The ship is repaired. Clear the sealed launch relays and bring every system into sync.',objective:'Break all 8 protective covers and match 70 pieces in 30 moves.',target:70,targetType:null,moves:30,ice:[16,18,22,26,29,33,37,39],action:'Complete the launch check',level:{rows:8,cols:7,types:6}};

export function makeIceBoard(level,ice=[],random=Math.random){
 // One shared bounded budget, not nested thousand-attempt loops.
 for(let n=0;n<128;n++){
  let board;try{board=makeBoard(level,random,1);}catch{continue;}
  if(iceMove(board,level.cols,ice))return board;
 }
 throw new Error('No playable board with this cover layout.');
}


// Recover only settled dead boards; callers retain score, moves and covers.
export function ensurePlayableBoard(board,level,ice=[],random=Math.random){
 if(iceMove(board,level.cols,ice))return {board,reshuffled:false};
 return {board:makeIceBoard(level,ice,random),reshuffled:true};
}
