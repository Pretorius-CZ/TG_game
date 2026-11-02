import test from 'node:test';
import assert from 'node:assert/strict';
import {networkLevels} from '../src/networkLevels.js';
import {networkStops,canVisitNetwork} from '../src/networkExpansion.js';
import {networkTravelStories} from '../src/networkStory.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {makeGoalBoard} from '../src/goalRefill.js';
import {findMove} from '../src/match3.js';
import {initialIce} from '../src/levelRules.js';

test('twenty new tasks visit eight short stops with varied boards and unchanged original budgets',()=>{
 const stops=networkStops.slice(2,10),levels=networkLevels.slice(10,30);
 assert.equal(stops.length,8);assert.deepEqual(stops.map(s=>s.total),[2,3,2,3,2,3,2,3]);
 assert.deepEqual(levels.map(r=>r.number),Array.from({length:20},(_,i)=>211+i));
 assert.equal(new Set(stops.map(s=>s.scene)).size,8);
 assert.ok(new Set(levels.map(r=>JSON.stringify(r.level))).size>=5);
 assert.ok(levels.some(r=>r.goals.length===1)&&levels.some(r=>r.goals.length===3));
 assert.equal(levels.filter(r=>r.hard).length,4);
 assert.deepEqual(networkLevels.slice(0,10).map(r=>r.moves),[22,23,24,26,24,24,25,27,26,27]);
 for(const r of networkLevels){assert.ok(r.nodes.length<=2,r.id);if(r.level.cols<=6)assert.ok(r.nodes.length<=1,r.id);assert.ok(r.nodes.reduce((n,d)=>n+d.target,0)<=4,r.id);}
});

test('new stops cannot be skipped; stale devices and reset preserve the intended progression',()=>{
 const full=normalizeProgress({...Object.fromEntries(Object.keys(normalizeProgress()).filter(k=>k==='completed'||k.endsWith('Completed')).map(k=>[k,99])),elysiumArrival:1,riftCrossed:1,caretakerMet:1,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true});
 for(const [i,s]of networkStops.slice(2).entries()){
  assert.equal(canVisitNetwork(full,s.scene),true);
  const previous=networkStops[i+1],incomplete=normalizeProgress({...full,[previous.key]:previous.total-1});
  assert.equal(canVisitNetwork(incomplete,s.scene),false);
  assert.equal(incomplete[s.key],0);
  assert.equal(mergeProgress(incomplete,full)[s.key],s.total);
  assert.equal(mergeProgress(full,normalizeProgress({resetRevision:1}))[s.key],0);
 }
 assert.deepEqual(networkTravelStories.map(s=>s.scene),['network-water','network-beacon-dock','network-far-approach']);
 for(const story of networkTravelStories){assert.equal(story.panels.length,2);assert.equal(story.ready(full),true);assert.equal(story.ready(normalizeProgress()),false);}
});

test('all new board shapes generate legal play with separated covers and fixed route nodes',()=>{
 for(const r of networkLevels.slice(10))for(let attempt=0;attempt<20;attempt++){
  let state=20261102+attempt;const random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
  const ice=initialIce(r),board=makeGoalBoard(r.level,r.goals,ice,random);
  assert.ok(findMove(board,r.level.cols,ice),r.id);
  assert.equal(board.length,r.level.cols*r.level.rows);
  for(const n of r.nodes){assert.equal(board[n.at],null);assert.equal(r.level.mask[n.at],false);}
  for(const at of ice)assert.ok(board[at]!=null,r.id);
 }
});
