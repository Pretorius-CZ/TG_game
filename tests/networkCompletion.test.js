import test from 'node:test';
import assert from 'node:assert/strict';
import {networkLevels} from '../src/networkLevels.js';
import {networkStops,canVisitNetwork} from '../src/networkExpansion.js';
import {networkCompletionStories} from '../src/networkCompletionStory.js';
import {normalizeProgress,mergeProgress} from '../src/progressStorage.js';
import {journeyFor} from '../src/journey.js';
import {makeGoalBoard} from '../src/goalRefill.js';
import {initialIce,swapMatches} from '../src/levelRules.js';
import {adjacent} from '../src/match3.js';

test('the scheduled delivery visits eight small work areas and ends with a replayable handover',()=>{
 const stops=networkStops.slice(10),levels=networkLevels.slice(30);
 assert.deepEqual(stops.map(s=>s.total),[2,3,2,3,2,3,2,3]);
 assert.deepEqual(levels.map(r=>r.number),Array.from({length:20},(_,i)=>231+i));
 assert.deepEqual(levels.filter(r=>r.hard).map(r=>r.number),[235,240,245,250]);
 const full=normalizeProgress({...Object.fromEntries(Object.keys(normalizeProgress()).filter(k=>k==='completed'||k.endsWith('Completed')).map(k=>[k,99])),elysiumArrival:1,riftCrossed:1,caretakerMet:1,finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true});
 for(const [i,s]of stops.entries()){
  const previous=networkStops[i+9],blocked=normalizeProgress({...full,[previous.key]:previous.total-1});
  assert.equal(canVisitNetwork(blocked,s.scene),false);assert.equal(blocked[s.key],0);
  assert.equal(mergeProgress(blocked,full)[s.key],s.total);
  assert.equal(mergeProgress(full,normalizeProgress({resetRevision:1}))[s.key],0);
 }
 assert.equal(journeyFor(full).scene,'network-first-watch');assert.equal(journeyFor(full).kind,'end');
 assert.equal(networkCompletionStories.length,5);
 for(const s of networkCompletionStories){assert.equal(s.ready(full),true);assert.equal(s.ready(normalizeProgress()),false);assert.equal(s.panels.length,2);}
 assert.equal(networkCompletionStories.at(-1).terminal,true);
});

test('new layouts have legal uncovered swaps, separated covers and modest route requirements',()=>{
 for(const r of networkLevels.slice(30))for(let trial=0;trial<20;trial++){
  let seed=231000+trial;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
  const ice=initialIce(r),board=makeGoalBoard(r.level,r.goals,ice,random),cols=r.level.cols;
  assert.ok(board.some((v,a)=>v!=null&&!ice.includes(a)&&[a+1,a+cols].some(b=>b<board.length&&board[b]!=null&&!ice.includes(b)&&adjacent(a,b,cols)&&swapMatches(board,a,b,cols,ice).length)),r.id);
  assert.ok(r.nodes.length<=(cols<=6?1:2));assert.ok(r.nodes.reduce((n,x)=>n+x.target,0)<=4);
  for(const node of r.nodes){assert.equal(board[node.at],null);for(const at of ice)assert.ok(Math.max(Math.abs(at%cols-node.at%cols),Math.abs(Math.floor(at/cols)-Math.floor(node.at/cols)))>1);}
 }
});
