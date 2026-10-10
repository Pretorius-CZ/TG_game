import test from 'node:test';
import assert from 'node:assert/strict';
import {excludeTesters,visitGroups,onboardingReport,nearMiss,deviceDirectory} from '../src/analyticsReport.js';
import {summarizeAttempts} from '../src/balanceTracking.js';
import {campaignKey,campaignSelection} from '../src/analyticsReport.js';
test('campaign filter joins exact attempt and reporter, not all activity of a browser',()=>{
 const bounty={source:'bountyboard',medium:'playtest',campaign:'pilot_01'};
 const visits=[{...bounty,reporter:'p',attempts:{a:{}}},{...bounty,reporter:'p',attempts:{a:{}}},{source:'direct',reporter:'p',attempts:{b:{}}}];
 const rows=[{reporter:'p',attemptId:'a'},{reporter:'p',attemptId:'b'},{reporter:'q',attemptId:'a'},{attemptId:'a'},{reporter:'p'}];
 const scope=campaignSelection(rows,visits,campaignKey(bounty));
 assert.deepEqual(scope.attempts,[rows[0]]);assert.equal(scope.visits.length,2);
 assert.equal(campaignSelection(rows,visits).attempts,rows);
 assert.equal(campaignSelection(rows,visits).unlinked,3);
 assert.deepEqual(campaignSelection(rows,visits,'missing').attempts,[]);
 assert.deepEqual(campaignSelection(rows,[],campaignKey(bounty)).attempts,[]);
});
test('filtered onboarding retains first-seen history from other campaigns',()=>{
 const current=[{reporter:'old',recordedAt:'2026-10-10',attempts:{a:{level:'one',outcome:'won'}}}];
 const history=[{reporter:'old',recordedAt:'2026-10-01',attempts:{}},...current];
 assert.equal(onboardingReport(current,[{id:'one'}],'2026-10-08',history).cohort,0);
 assert.equal(onboardingReport(current,[{id:'one'}],null,history).cohort,1);
});
const visit=(reporter,attempts={},extra={})=>({reporter,attempts,source:'facebook',medium:'paid_social',campaign:'launch',...extra});
test('tester exclusion applies retroactively, is reversible and retains unidentified legacy attempts',()=>{
 const rows=[visit('tester'),visit('player'),{level:'legacy'}];
 assert.deepEqual(excludeTesters(rows,['tester']),rows.slice(1));
 assert.equal(excludeTesters(rows,['tester'],true),rows);
 assert.equal(rows.length,3);
});
test('campaign and country groups count visits separately from browsers and distinct played levels',()=>{
 const visits=[visit('p',{a:{level:'one',outcome:'won'},b:{level:'one',outcome:'failed'}},{country:'CZ'}),visit('p',{c:{level:'one',outcome:'won'},d:{level:'two',outcome:'started'}},{country:'CZ'}),visit('q')];
 assert.deepEqual(visitGroups(visits),[{source:'facebook',medium:'paid_social',campaign:'launch',visits:3,devices:2,started:2,won:2,continued:1,attempts:4}]);
 const countries=visitGroups(visits,['country']);
 assert.equal(countries.find(c=>c.country==='CZ').devices,1);
 assert.equal(countries.find(c=>c.country==='unknown').started,0);
});
test('onboarding joins visits but never counts retries as new players or late-game visitors as new starts',()=>{
 const catalog=Array.from({length:11},(_,i)=>({id:String(i+1),number:i+1}));
 const visits=[visit('p',{a:{level:'1',outcome:'failed'},b:{level:'1',outcome:'won'}}),visit('p',{c:{level:'2',outcome:'won'}}),visit('q',{d:{level:'1',outcome:'started'}}),visit('late',{e:{level:'10',outcome:'won'}})];
 const report=onboardingReport(visits,catalog);
 assert.equal(report.cohort,2);assert.equal(report.unanchored,1);assert.equal(report.levels.length,10);
 assert.equal(report.levels[0].started,2);assert.equal(report.levels[0].won,1);assert.equal(report.levels[0].continued,1);assert.equal(report.levels[0].pending,1);
 assert.equal(report.levels[1].started,1);assert.equal(report.levels[9].started,0);
});
test('new-device cohort does not turn an old returning device into a new player',()=>{
 const catalog=[{id:'one'},{id:'two'}];
 const visits=[visit('old',{}, {recordedAt:'2026-10-01T00:00:00Z'}),visit('old',{a:{level:'one',outcome:'won'}},{recordedAt:'2026-10-09T00:00:00Z'}),visit('new',{b:{level:'one',outcome:'started'}},{recordedAt:'2026-10-09T00:00:00Z'}),visit('unknown',{c:{level:'one',outcome:'won'}})];
 const report=onboardingReport(visits,catalog,'2026-10-08T00:00:00Z');
 assert.equal(report.cohort,1);assert.equal(report.older,2);assert.equal(report.levels[0].won,0);
 assert.equal(onboardingReport(visits,catalog).cohort,3);
});
test('one continued attempt spanning sessions is counted once per campaign',()=>{
 const visits=[visit('p',{a:{level:'one',outcome:'started'}}),visit('p',{a:{level:'one',outcome:'won'}})];
 const group=visitGroups(visits)[0];assert.equal(group.visits,2);assert.equal(group.started,2);assert.equal(group.attempts,1);
});
test('near misses require complete measurements and each target within ten percent',()=>{
 const row={outcome:'failed',configuration:{goals:[{target:20},{target:30}],ice:[],resonators:[]},counts:[18,28]};
 assert.equal(nearMiss(row),true);
 assert.equal(nearMiss({...row,counts:[17,30]}),false);
 assert.equal(nearMiss({...row,counts:[20,30]}),false);
 assert.equal(nearMiss({...row,outcome:'won'}),null);
 assert.equal(nearMiss({...row,counts:[18]}),null);
 assert.equal(nearMiss({...row,configuration:{...row.configuration,ice:[1,2,3,4]},remainingCovers:1}),false);
 assert.equal(nearMiss({...row,configuration:{...row.configuration,resonators:[{target:2}]},resonance:[]}),null);
 assert.equal(nearMiss({...row,configuration:{...row.configuration,resonators:[{target:2}]},resonance:[1]}),false);
});
test('difficulty suggestion waits for more than one repeat tester',()=>{
 const rows=Array.from({length:30},()=>({level:'one',outcome:'won',reporter:'same'}));
 assert.equal(summarizeAttempts(rows,'one').verdict,'Málo nezávislých zařízení');
 const varied=rows.map((r,i)=>({...r,reporter:String(i%5)}));
 assert.equal(summarizeAttempts(varied,'one').verdict,'Prověřit snížení tahů');
});
test('device directory preserves marked devices without attempts and never exposes reporter secrets',()=>{
 const result=deviceDirectory([visit('p',{}, {recordedAt:'2026-10-08T10:00:00Z',token:'secret'})],[{reporter:'p',at:Date.UTC(2026,9,8,11)}],['tester']);
 assert.equal(result[0].id,'p');assert.equal(result[0].visits,1);assert.equal(result[0].attempts,1);
 assert.equal(result[1].tester,true);assert.ok(!JSON.stringify(result).includes('secret'));
});
