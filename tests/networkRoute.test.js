import test from 'node:test';
import assert from 'node:assert/strict';
import {chargeRoute, routeComplete} from '../src/experimental/networkRoute.js';
import {networkDraftLevels} from '../src/experimental/networkChapter.js';

test('future nodes cannot precharge; the next node waits for a new wave', () => {
 const board=[0,0,0,1,1,1,2,3,4,5,2,3];
 const nodes=[{at:6,target:1},{at:9,target:1}];
 const first=chargeRoute(nodes,[],[0,1,2,3,4,5],6,board);
 assert.deepEqual(first,[1,0]);
 assert.deepEqual(chargeRoute(nodes,first,[0,1,2,3,4,5],6,board),[1,1]);
 assert.equal(routeComplete(nodes,first),false);
});

test('separate combinations count but a connected cross is a single pulse', () => {
 const board=[0,0,0,2,null,3,1,1,1];
 assert.deepEqual(chargeRoute([{at:4,target:3}],[],[0,1,2,6,7,8],3,board),[2]);
 const cross=[1,0,2,0,0,0,2,0,1];
 assert.deepEqual(chargeRoute([{at:0,target:3}],[],[1,3,4,5,7],3,cross),[1]);
});

test('draft boards retain reachable neighbouring cells and their own unique IDs', () => {
 assert.equal(networkDraftLevels.length,10);
 assert.equal(new Set(networkDraftLevels.map(r=>r.id)).size,10);
 for(const r of networkDraftLevels){
  assert.equal(r.level.mask.length,56);
  for(const node of r.nodes){assert.equal(r.level.mask[node.at],false);assert.ok([node.at-7,node.at+7,node.at-1,node.at+1].some(at=>r.level.mask[at]));}
 }
});
