import {matches} from './match3.js';
import {resolveIce} from './levelRules.js';

export const PULSE=10, NOVA=11;
export const isBooster=value=>value===PULSE||value===NOVA;
export const boostersEnabled=repair=>repair.boosters!==false;

// One reward per connected matching group. Covered cells cannot host a reward.
export function rewards(board,cols,ice=[],preferred=[]){
  const runs=[];
  for(let i=0;i<board.length;i++){
    if(board[i]==null||isBooster(board[i]))continue;
    for(const step of [1,cols]){
      const previous=i-step;
      if(previous>=0&&(step===cols||i%cols!==0)&&board[previous]===board[i])continue;
      const cells=[i];
      for(let j=i+step;j<board.length&&board[j]===board[i]&&(step===cols||Math.floor(j/cols)===Math.floor(i/cols));j+=step)cells.push(j);
      if(cells.length>=3)runs.push(cells);
    }
  }
  const groups=[];
  for(const run of runs){
    const touching=groups.filter(g=>g.cells.some(i=>run.includes(i)));
    const cells=[...new Set([...run,...touching.flatMap(g=>g.cells)])];
    const longest=Math.max(run.length,...touching.map(g=>g.longest));
    touching.forEach(g=>groups.splice(groups.indexOf(g),1));groups.push({cells,longest});
  }
  return groups.filter(g=>g.longest>=4||g.cells.length>=5).flatMap(g=>{
    const at=[...preferred,...g.cells].find(i=>g.cells.includes(i)&&!ice.includes(i));
    return at==null?[]:[{at,type:g.longest>=5?NOVA:PULSE}];
  });
}

export function blast(board,cols,starts){
  const hit=new Set(),fired=new Set(),queue=[...starts];
  while(queue.length){
    const at=queue.shift();if(fired.has(at)||!isBooster(board[at]))continue;fired.add(at);
    const row=Math.floor(at/cols),col=at%cols;
    board.forEach((value,i)=>{
      if(value==null)return;
      const dr=Math.abs(Math.floor(i/cols)-row),dc=Math.abs(i%cols-col);
      if(board[at]===NOVA?(dr===0||dc===0):(dr<=1&&dc<=1)){
        hit.add(i);if(isBooster(value)&&!fired.has(i))queue.push(i);
      }
    });
  }
  return [...hit];
}

export function wave(board,ice,level,{enabled=true,activate=null,preferred=[],random=Math.random}={}){
  const found=activate==null?matches(board,level.cols):blast(board,level.cols,[activate]);
  const created=enabled&&activate==null?rewards(board,level.cols,ice,preferred):[];
  const protectedCells=[...ice,...created.map(r=>r.at)];
  const collected=found.filter(i=>!protectedCells.includes(i)&&!isBooster(board[i]));
  const seeded=[...board];created.forEach(r=>seeded[r.at]=r.type);
  const resolved=resolveIce(seeded,found,protectedCells,level,random);
  return {board:resolved.board,ice:ice.filter(i=>!found.includes(i)),collected,
    hit:found,created};
}
