import test from 'node:test';
import assert from 'node:assert/strict';
import {relevantTutorials,initialTutorials,helperTutorials,readTutorials,tutorialTopics} from '../src/tutorials.js';
test('only relevant mechanics are introduced',()=>{
 assert.deepEqual(relevantTutorials({boosts:false,covers:false,resonators:false}),['helpers']);
 assert.deepEqual(relevantTutorials({boosts:true,covers:true,resonators:true}),['charges','covers','resonators','helpers']);
 for(const entry of Object.values(tutorialTopics)){assert.equal(entry.en.length,2);assert.equal(entry.cs.length,2);}
});
test('boost explanations do not open at level entry, but covers and resonators still do',()=>{
 assert.deepEqual(initialTutorials({covers:false,resonators:false}),[]);
 assert.deepEqual(initialTutorials({covers:true,resonators:true}),['covers','resonators']);
 assert.equal(new Set(helperTutorials).size,5);
 for(const id of [...helperTutorials,'pulse','nova'])assert.ok(tutorialTopics[id]?.en&&tutorialTopics[id]?.cs);
});
test('tutorial state ignores corrupt storage and unknown topics',()=>{
 assert.deepEqual(readTutorials({getItem(){throw Error();}},'profile'),[]);
 assert.deepEqual(readTutorials({getItem:()=>JSON.stringify(['covers','invalid'])},'profile'),['covers']);
});
