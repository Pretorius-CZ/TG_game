import test from 'node:test';
import assert from 'node:assert/strict';
import {levelCatalog} from '../src/levelCatalog.js';
import {legacyRules,reportVersions,filterRules,latestAttempts} from '../src/balanceReport.js';
test('catalog follows chapter progression without losing or duplicating levels',()=>{
 assert.equal(levelCatalog.length,145);
 assert.equal(new Set(levelCatalog.map(r=>r.id)).size,145);
 const position=id=>levelCatalog.findIndex(r=>r.id===id);
 assert.ok(position('wreck-cargo')<position('refuge-dock-beacon'));
 assert.deepEqual(levelCatalog.map(r=>r.number),Array.from({length:145},(_,i)=>i+1));
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
