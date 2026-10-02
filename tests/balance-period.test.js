import test from 'node:test';
import assert from 'node:assert/strict';
import {attemptDay,attemptsForDay} from '../src/balancePeriod.js';
test('all-time report retains records and day filter respects Prague midnight',()=>{
 const rows=[{at:Date.parse('2026-10-01T21:59:00Z')},{at:Date.parse('2026-10-01T22:01:00Z')},{at:'invalid'}];
 assert.equal(attemptsForDay(rows,''),rows);
 assert.equal(attemptDay(rows[0]),'2026-10-01');
 assert.equal(attemptDay(rows[1]),'2026-10-02');
 assert.deepEqual(attemptsForDay(rows,'2026-10-02'),[rows[1]]);
 assert.equal(attemptDay({}),null);
 assert.equal(attemptDay(rows[2]),null);
});
