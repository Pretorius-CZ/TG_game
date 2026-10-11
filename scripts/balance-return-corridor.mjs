import {returnCorridor} from '../src/returnCorridor.js';
import {chargeResonators,resonatorsComplete} from '../src/resonators.js';
import {makeGoalBoard} from '../src/goalRefill.js';
import {goalRefillRandom} from '../src/goalRefill.js';
import {wave,blast,isBooster,rewards} from '../src/boosters.js';
import {adjacent,swap} from '../src/match3.js';
import {moveBudget,initialIce,iceMatches,ensurePlayableBoard} from '../src/levelRules.js';
import {goalsFor,collectGoals,goalsComplete} from '../src/objectives.js';
const samples=Number(process.argv[2]??300);
const selected=process.argv.find(a=>a.startsWith('--levels='))?.slice(9).split(',');
const fair=true;
for(const repair of returnCorridor.repairs){
  if(selected&&!selected.includes(repair.id))continue;
  const result={policy:'fair-v4-with-resonators',name:repair.name,id:repair.id,moves:moveBudget(repair),samples};
  for(const strategy of ['targeted']){
    let wins=0,left=0;
    for(let trial=0;trial<samples;trial++){
      let seed=1701+trial;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
      const goals=goalsFor(repair),cols=repair.level.cols,history={};
      let counts=goals.map(()=>0),ice=initialIce(repair),board=makeGoalBoard(repair.level,goals,ice,random),charges=repair.resonators.map(()=>0);
      for(let turn=0;turn<moveBudget(repair);turn++){
        board=ensurePlayableBoard(board,repair.level,ice,random).board;
        const choices=[];
        board.forEach((v,a)=>{if(isBooster(v)&&!ice.includes(a)){const hit=blast(board,cols,[a]);const gain=collectGoals(goals,counts,board,hit.filter(i=>!ice.includes(i)&&!isBooster(board[i]))).reduce((n,v,i)=>n+v-counts[i],0);choices.push({a,b:a,value:gain+5*hit.filter(i=>ice.includes(i)).length});}});
        for(let a=0;a<board.length;a++)for(const b of [a+1,a+cols]){
          if(isBooster(board[a])||isBooster(board[b])||board[a]==null||board[b]==null||ice.includes(a)||ice.includes(b)||!adjacent(a,b,cols))continue;
          const next=swap(board,a,b),hit=iceMatches(next,cols,ice);if(!hit.length)continue;
          const gain=collectGoals(goals,counts,next,hit.filter(i=>!ice.includes(i))).reduce((n,v,i)=>n+v-counts[i],0);
          choices.push({a,b,value:gain+7*chargeResonators(repair.resonators,charges,hit,cols).reduce((n,v,i)=>n+v-charges[i],0)+5*hit.filter(i=>ice.includes(i)).length+rewards(next,cols,ice,[b,a]).length*4});
        }
        // The targeted bot sees only the immediate match, never future random drops.
        const best=Math.max(...choices.map(c=>c.value));
        const options=strategy==='random'?choices:choices.filter(c=>c.value===best);
        const move=options[Math.floor(random()*options.length)];board=swap(board,move.a,move.b);
        let hit=move.a===move.b?[move.a]:iceMatches(board,cols,ice),cascade=0;
        while(hit.length){
          if(++cascade>40)throw Error('Cascade safety limit');
          if(!(move.a===move.b&&cascade===1))charges=chargeResonators(repair.resonators,charges,iceMatches(board,cols,ice),cols);
          const resolved=wave(board,ice,repair.level,{random,...(fair?{refillRandom:collected=>goalRefillRandom(repair.level,goals,collectGoals(goals,counts,board,collected),board,ice,collected,history,random)}:{}),activate:move.a===move.b&&cascade===1?move.a:null,preferred:cascade===1?[move.b,move.a]:[]});
          counts=collectGoals(goals,counts,board,resolved.collected);board=resolved.board;ice=resolved.ice;hit=iceMatches(board,cols,ice);
        }
        if(goalsComplete(goals,counts)&&!ice.length&&resonatorsComplete(repair.resonators,charges)){wins++;left+=moveBudget(repair)-turn-1;break;}
      }
    }
    result[strategy]={wins,winPercent:Math.round(100*wins/samples),meanMovesLeftOnWin:wins?+(left/wins).toFixed(1):0};
  }
  console.log(JSON.stringify(result));
}
