import test from 'node:test';
import assert from 'node:assert/strict';
import { repairs, completeRepair, repairState } from '../src/repairs.js';
import { makeBoard, matches, findMove, swap, refill, objectiveCount } from '../src/match3.js';

function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }
test('every repair layout starts stable and preserves holes during a match and refill', () => {
  for (const repair of repairs) for (let seed = 1; seed <= 100; seed++) {
    const { level } = repair; const random = rng(seed);
    const board = makeBoard(level, random);
    assert.equal(matches(board, level.cols).length, 0);
    const move = findMove(board, level.cols); assert.ok(move);
    const next = swap(board, ...move); const cleared = matches(next, level.cols);
    const fallen = refill(next, cleared, level, random);
    board.forEach((cell, i) => assert.equal(fallen[i] === null, cell === null));
  }
});
test('only the target color contributes to color-specific repairs', () => {
  const board = [0, 1, 2, 2, null];
  assert.equal(objectiveCount(board, [0, 1, 2, 3, 4], 2), 2);
  assert.equal(objectiveCount(board, [0, 2, 3], 1), 0);
  assert.equal(objectiveCount(board, [0, 1, 2, 3, 4], null), 4);
});
test('repairs cannot be skipped or awarded twice and final replay stays complete', () => {
  let completed = 0;
  assert.equal(completeRepair(completed, 'diagnostics'), 0);
  for (const repair of repairs) {
    assert.equal(repairState(completed, completed), 'available');
    completed = completeRepair(completed, repair.id);
    assert.equal(completeRepair(completed, repair.id), completed);
  }
  assert.equal(completed, 4);
  repairs.forEach((repair, i) => {
    assert.equal(repairState(i, completed), 'complete');
    assert.equal(completeRepair(completed, repair.id), 4);
  });
});
