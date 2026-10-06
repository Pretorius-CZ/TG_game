// Attempt-local drought protection. Payments and ad rewards never enter this policy.
import {makeIceBoard} from './levelRules.js';
import {adjacent,matches,swap} from './match3.js';

// A useful opportunity must collect this colour, not merely offer another colour's move.
export function hasGoalMove(board,cols,covers,type){
 const blocked=new Set(covers);
 for(let a=0;a<board.length;a++)for(const b of [a+1,a+cols]){
  if(b>=board.length||board[a]==null||board[b]==null||blocked.has(a)||blocked.has(b)||!adjacent(a,b,cols))continue;
  const next=swap(board,a,b);
  const hit=matches(next,cols);
  if((hit.includes(a)||hit.includes(b))&&hit.some(i=>(i===a||i===b)&&next[i]===type&&!blocked.has(i)))return true;
 }
 return false;
}

// Prefer a playable opening with enough uncovered goal pieces to offer choices.
export function makeGoalBoard(level,goals,covers=[],random=Math.random){
 const active=[...new Set(goals.filter(g=>g.type!=null).map(g=>g.type))];
 const cells=level.mask?level.mask.filter(Boolean).length:level.rows*level.cols;
 const minimum=Math.max(4,Math.floor((cells-covers.length)/level.types));
 let best,score=-1;
 for(let attempt=0;attempt<(active.length?12:1);attempt++){
  const board=makeIceBoard(level,covers,random);
  const available=active.map(type=>board.filter((v,i)=>v===type&&!covers.includes(i)).length);
  const opportunities=active.map(type=>hasGoalMove(board,level.cols,covers,type));
  const balance=available.reduce((sum,n)=>sum+Math.min(n,minimum),0)+opportunities.filter(Boolean).length*minimum;
  if(balance>score){best=board;score=balance;}
  if(available.every(n=>n>=minimum)&&opportunities.every(Boolean))return board;
 }
 return best;
}
export function goalRefillRandom(level,goals,counts,board,covers,removed,history,random=Math.random){
 const active=[...new Set(goals.filter((g,i)=>g.type!=null&&(counts[i]??0)<g.target).map(g=>g.type))];
 const gone=new Set(removed.filter(i=>!covers.includes(i)));
 const inventory=Array.from({length:level.types},(_,type)=>board.filter((v,i)=>v===type&&!gone.has(i)&&!covers.includes(i)).length);
 const scarceLimit=Math.max(5,Math.ceil(board.filter(v=>v!=null).length/level.types));
 const stranded=new Set(active.filter(type=>!hasGoalMove(board,level.cols,covers,type)));
 return ()=>{
  const scarce=active.filter(type=>inventory[type]<scarceLimit);
  // Missing colours get the next spawn; one or two pieces cannot wait a long drought.
  const missing=scarce.filter(type=>inventory[type]===0);
  const overdue=scarce.filter(type=>(history[type]??0)>=(inventory[type]<4?2: stranded.has(type)?4:8));
  const priority=[...new Set([...missing,...overdue])].sort((a,b)=>
   Number(inventory[b]===0)-Number(inventory[a]===0)||(history[b]??0)-(history[a]??0));
  const weights=Array(level.types).fill(1);
  scarce.forEach(type=>{if((history[type]??0)>=3)weights[type]=1.8;});
  let type=priority[0];
  if(type==null){let draw=random()*weights.reduce((a,b)=>a+b,0);type=weights.length-1;for(let i=0;i<weights.length;i++){draw-=weights[i];if(draw<0){type=i;break;}}}
  active.forEach(target=>{history[target]=target===type?0:(history[target]??0)+1;});
  inventory[type]++;
  // refill uses floor(random() * types); stay inside the selected colour bucket.
  return (type+0.5)/level.types;
 };
}
