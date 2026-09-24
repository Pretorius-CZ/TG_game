import {mineRepairs} from '../src/exploration.js';
import {wave,blast,isBooster,rewards} from '../src/boosters.js';
import {adjacent,swap} from '../src/match3.js';
import {moveBudget,initialIce,iceMatches,resolveIce,makeIceBoard,ensurePlayableBoard} from '../src/levelRules.js';
import {goalsFor,collectGoals,goalsComplete} from '../src/objectives.js';
import {crewRepairs} from '../src/crewRepairs.js';
const samples=Number(process.argv[2]??300);
for(const repair of (process.argv[3]==='mine'?mineRepairs:crewRepairs)){
  const result={id:repair.id,moves:moveBudget(repair),samples};
  for(const strategy of ['random','targeted']){
    let wins=0,left=0;
    for(let trial=0;trial<samples;trial++){
      let seed=1701+trial;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
      const goals=goalsFor(repair),cols=repair.level.cols;
      let counts=goals.map(()=>0),ice=initialIce(repair),board=makeIceBoard(repair.level,ice,random);
      for(let turn=0;turn<moveBudget(repair);turn++){
        board=ensurePlayableBoard(board,repair.level,ice,random).board;
        const choices=[];
        board.forEach((v,a)=>{if(isBooster(v)){const hit=blast(board,cols,[a]);const gain=collectGoals(goals,counts,board,hit.filter(i=>!ice.includes(i)&&!isBooster(board[i]))).reduce((n,v,i)=>n+v-counts[i],0);choices.push({a,b:a,value:gain+5*hit.filter(i=>ice.includes(i)).length});}});
        for(let a=0;a<board.length;a++)for(const b of [a+1,a+cols]){
          if(isBooster(board[a])||isBooster(board[b])||board[a]==null||board[b]==null||ice.includes(a)||ice.includes(b)||!adjacent(a,b,cols))continue;
          const next=swap(board,a,b),hit=iceMatches(next,cols,ice);if(!hit.length)continue;
          const gain=collectGoals(goals,counts,next,hit.filter(i=>!ice.includes(i))).reduce((n,v,i)=>n+v-counts[i],0);
          choices.push({a,b,value:gain+5*hit.filter(i=>ice.includes(i)).length+rewards(next,cols,ice,[b,a]).length*4});
        }
        // The targeted bot sees only the immediate match, never future random drops.
        const best=Math.max(...choices.map(c=>c.value));
        const options=strategy==='random'?choices:choices.filter(c=>c.value===best);
        const move=options[Math.floor(random()*options.length)];board=swap(board,move.a,move.b);
        let hit=move.a===move.b?[move.a]:iceMatches(board,cols,ice),cascade=0;
        while(hit.length){
          if(++cascade>40)throw Error('Cascade safety limit');
          const resolved=wave(board,ice,repair.level,{random,activate:move.a===move.b&&cascade===1?move.a:null,preferred:cascade===1?[move.b,move.a]:[]});
          counts=collectGoals(goals,counts,board,resolved.collected);board=resolved.board;ice=resolved.ice;hit=iceMatches(board,cols,ice);
        }
        if(goalsComplete(goals,counts)&&!ice.length){wins++;left+=moveBudget(repair)-turn-1;break;}
      }
    }
    result[strategy]={wins,winPercent:Math.round(100*wins/samples),meanMovesLeftOnWin:wins?+(left/wins).toFixed(1):0};
  }
  console.log(JSON.stringify(result));
}
