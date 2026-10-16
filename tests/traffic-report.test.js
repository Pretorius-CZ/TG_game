import test from 'node:test';
import assert from 'node:assert/strict';
import {isBotVisit,trafficSelection} from '../src/trafficReport.js';
import {excludeTesters,campaignSelection,visitGroups,onboardingReport} from '../src/analyticsReport.js';
import {summarizeAttempts} from '../src/balanceTracking.js';

test('QA source and medium classify all campaigns and the whole browser history',()=>{
 const visits=[{reporter:'bot',source:'automated_test',medium:'bot',campaign:'qa_02'},
  {reporter:'bot',source:'direct',medium:'none'},{reporter:'human',source:'bounty',medium:'test'},
  {reporter:'tester',source:'automated_test',medium:'human'}];
 const attempts=['bot','human','tester',undefined].map((reporter,i)=>({reporter,attemptId:String(i)}));
 assert.equal(isBotVisit(visits[3]),false);
 assert.deepEqual(trafficSelection(attempts,visits,'bots').attempts,[attempts[0]]);
 assert.equal(trafficSelection(attempts,visits,'bots').visits.length,2);
 assert.deepEqual(trafficSelection(attempts,visits).attempts,attempts.slice(1));
 assert.equal(trafficSelection(attempts,visits,'all').attempts.length,4);
});
test('server bot directory excludes bots even when visit pages are absent',()=>{
 assert.equal(trafficSelection([{reporter:'bot'}],[],'players',['bot']).attempts.length,0);
 assert.equal(trafficSelection([{reporter:'bot'}],[],'bots',['bot']).attempts.length,1);
});
test('one traffic selection feeds campaigns, countries, onboarding, difficulty and export',()=>{
 const visits=['bot','human','tester'].map((reporter,i)=>({reporter,source:i===0?'automated_test':'direct',
  medium:i===0?'bot':'none',campaign:'qa_01',country:i===0?'US':'CZ',device:'mobile',
  recordedAt:'2026-10-16T10:00:00Z',attempts:{[reporter]:{level:'first',outcome:i===0?'failed':'won'}}}));
 const attempts=visits.map(v=>({reporter:v.reporter,attemptId:v.reporter,level:'first',outcome:v.attempts[v.reporter].outcome,moves:3}));
 for(const [traffic,expected,wins] of [['players',1,1],['bots',1,0],['all',2,1]]){
  const scoped=trafficSelection(attempts,visits,traffic);
  const selected=campaignSelection(excludeTesters(scoped.attempts,['tester']),excludeTesters(scoped.visits,['tester']));
  assert.equal(selected.attempts.length,expected); // Same rows are exported.
  assert.equal(visitGroups(selected.visits).reduce((n,v)=>n+v.visits,0),expected);
  assert.equal(visitGroups(selected.visits,['country']).reduce((n,v)=>n+v.visits,0),expected);
  assert.equal(onboardingReport(selected.visits,[{id:'first'}]).cohort,expected);
  assert.equal(summarizeAttempts(selected.attempts,'first').wins,wins);
 }
});
