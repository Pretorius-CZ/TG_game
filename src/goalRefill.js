// Attempt-local drought protection. Payments and ad rewards never enter this policy.
export function goalRefillRandom(level,goals,counts,board,covers,removed,history,random=Math.random){
 const active=[...new Set(goals.filter((g,i)=>g.type!=null&&(counts[i]??0)<g.target).map(g=>g.type))];
 const gone=new Set(removed.filter(i=>!covers.includes(i)));
 const inventory=Array.from({length:level.types},(_,type)=>board.filter((v,i)=>v===type&&!gone.has(i)&&!covers.includes(i)).length);
 const scarceLimit=Math.max(3,Math.floor(board.filter(v=>v!=null).length/level.types/2));
 return ()=>{
  const scarce=active.filter(type=>inventory[type]<scarceLimit);
  // Missing colours get the next spawn; one or two pieces cannot wait a long drought.
  const missing=scarce.filter(type=>inventory[type]===0);
  const overdue=scarce.filter(type=>(history[type]??0)>=(inventory[type]<3?6:18));
  const priority=[...new Set([...missing,...overdue])].sort((a,b)=>
   Number(inventory[b]===0)-Number(inventory[a]===0)||(history[b]??0)-(history[a]??0));
  const weights=Array(level.types).fill(1);
  scarce.forEach(type=>{if((history[type]??0)>=6)weights[type]=1.6;});
  let type=priority[0];
  if(type==null){let draw=random()*weights.reduce((a,b)=>a+b,0);type=weights.length-1;for(let i=0;i<weights.length;i++){draw-=weights[i];if(draw<0){type=i;break;}}}
  active.forEach(target=>{history[target]=target===type?0:(history[target]??0)+1;});
  inventory[type]++;
  // refill uses floor(random() * types); stay inside the selected colour bucket.
  return (type+0.5)/level.types;
 };
}
