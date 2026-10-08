import test from 'node:test';
import assert from 'node:assert/strict';
import {levelCatalog} from '../src/levelCatalog.js';
import {legacyRules,reportVersions,filterRules,latestAttempts} from '../src/balanceReport.js';
import {durationLabel,assistanceLabel,missingObjectives,funnelPercent} from '../src/balanceReport.js';
import {summarizeAttempts} from '../src/balanceTracking.js';
test('attempt details distinguish missing legacy values from no help and completed goals',()=>{
 assert.equal(durationLabel(undefined),'—');assert.equal(durationLabel(61500),'1:02');
 assert.equal(assistanceLabel({}),'—');assert.equal(assistanceLabel({helpers:[],hints:0,extraMoves:false}),'Bez pomoci');
 assert.equal(assistanceLabel({helpers:['Laser','Laser'],hints:1,extraMoves:true}),'Laser ×2 · Nápověda ×1 · +5 tahů');
 assert.equal(missingObjectives({}),'—');
 assert.equal(missingObjectives({configuration:{goals:[{label:'Stars',target:10}],resonators:[{target:3}]},counts:[7],remainingCovers:2,resonance:[1]}),'Stars: 3 · Kryty: 2 · Nabití kruhů: 2');
 assert.equal(missingObjectives({configuration:{goals:[{target:10}]},counts:[10]}),'Splněno');
});
test('summary counts distinct known browsers and median completed duration only',()=>{
 const rows=[{level:'a',outcome:'won',reporter:'x',durationMs:1000},{level:'a',outcome:'failed',reporter:'x',durationMs:9000},{level:'a',outcome:'quit',reporter:'y',durationMs:100000},{level:'b',outcome:'won',reporter:'z'}];
 const stats=summarizeAttempts(rows,'a');assert.equal(stats.devices,2);assert.equal(stats.duration,5000);
 assert.equal(summarizeAttempts([{level:'a',outcome:'won'}],'a').devices,null);
 assert.equal(funnelPercent(0,0),'—');assert.equal(funnelPercent(18,71),'25 %');
});
test('catalog follows chapter progression without losing or duplicating levels',()=>{
 assert.equal(levelCatalog.length,155);
 assert.equal(new Set(levelCatalog.map(r=>r.id)).size,155);
 const position=id=>levelCatalog.findIndex(r=>r.id===id);
 assert.ok(position('wreck-cargo')<position('refuge-dock-beacon'));
 assert.deepEqual(levelCatalog.map(r=>r.number),Array.from({length:155},(_,i)=>i+1));
});
test('version filter separates legacy data and preserves all outcomes',()=>{
 const rows=[{build:'v3',outcome:'quit'},{build:'v2'},{}];
 assert.deepEqual(reportVersions(rows),['v3','v2',legacyRules]);
 assert.deepEqual(filterRules(rows,'v3'),[rows[0]]);
 assert.deepEqual(filterRules(rows,legacyRules),[rows[2]]);
 assert.equal(filterRules(rows,''),rows);
});
test('latest feed uses attempt time, ignores invalid dates and does not mutate input',()=>{
 const rows=[{at:'2026-10-01T10:00:00Z'},{at:'invalid'},{at:'2026-10-02T10:00:00Z'}];
 assert.deepEqual(latestAttempts(rows,1),[rows[2]]);
 assert.equal(rows[0].at,'2026-10-01T10:00:00Z');
});
test('latest feed includes real gameplay millisecond timestamps alongside legacy ISO dates',()=>{
 const rows=[{at:'2026-10-01T10:00:00Z'},{at:Date.UTC(2026,9,6,20),attemptId:'new'}, {at:null},{}];
 assert.deepEqual(latestAttempts(rows),[rows[1],rows[0]]);
});
