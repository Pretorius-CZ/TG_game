import test from 'node:test';
import assert from 'node:assert/strict';
import {crewRepairs,completeCrewRepair,crewLogs} from '../src/crewRepairs.js';
import {makeBoard,matches,findMove,swap,refill} from '../src/match3.js';

test('crew boards are stable and refill valid types without filling holes',()=>{
  let seed=18;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  for(const {level} of crewRepairs)for(let n=0;n<100;n++){
    const board=makeBoard(level,random);assert.equal(board.length,49);assert.equal(matches(board,7).length,0);
    const move=findMove(board,7);assert.ok(move);const changed=swap(board,...move);
    const next=refill(changed,matches(changed,7),level,random);
    next.forEach((v,i)=>{assert.equal(v===null,board[i]===null);if(v!==null)assert.ok(Number.isInteger(v)&&v>=0&&v<5);});
  }
});
test('crew repairs cannot skip steps or duplicate completion and logs match repairs',()=>{
  let completed=0;assert.equal(completeCrewRepair(0,crewRepairs[3].id),0);
  crewRepairs.forEach((r,i)=>{assert.equal(crewLogs[i].repair,r.id);completed=completeCrewRepair(completed,r.id);assert.equal(completed,i+1);assert.equal(completeCrewRepair(completed,r.id),completed);});
  assert.equal(completeCrewRepair(4,'crew-cabin'),4);
});
