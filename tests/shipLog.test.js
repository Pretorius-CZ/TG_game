import test from 'node:test';
import assert from 'node:assert/strict';
import { logEntries, unlockedLogs } from '../src/logEntries.js';
import { repairs, completeRepair } from '../src/repairs.js';

test('each completed repair unlocks exactly its own fragment', () => {
  assert.equal(unlockedLogs(0).length, 0);
  repairs.forEach((repair, i) => {
    const entries = unlockedLogs(i + 1);
    assert.equal(entries.length, i + 1);
    assert.equal(entries.at(-1).repair, repair.id);
  });
  assert.equal(new Set(logEntries.map(entry => entry.id)).size, logEntries.length);
});
test('replay does not duplicate or unlock another fragment', () => {
  const completed = completeRepair(1, 'lights');
  assert.deepEqual(unlockedLogs(completed), unlockedLogs(1));
  assert.equal(unlockedLogs(completeRepair(4, 'diagnostics')).length, 4);
});
