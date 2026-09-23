// Pure game rules. Null mask cells split gravity into independent segments.
export const tutorial = { rows: 6, cols: 6, target: 18, types: 4 };
export function objectiveCount(board, cleared, targetType) {
  return cleared.filter(i => board[i] != null && board[i] < 10 && (targetType == null || board[i] === targetType)).length;
}
export function matches(board, cols) {
  const result = new Set();
  for (let i = 0; i < board.length; i++) {
    if (board[i] == null || board[i] >= 10) continue;
    for (const step of [1, cols]) {
      const run = [i];
      for (let j = i + step; j < board.length && board[j] === board[i]; j += step) {
        if (step === 1 && Math.floor(j / cols) !== Math.floor(i / cols)) break;
        run.push(j);
      }
      if (run.length >= 3) run.forEach(n => result.add(n));
    }
  }
  return [...result];
}
export function adjacent(a, b, cols) {
  return Math.abs(Math.floor(a / cols) - Math.floor(b / cols)) + Math.abs(a % cols - b % cols) === 1;
}
export function swap(board, a, b) {
  const next = [...board]; [next[a], next[b]] = [next[b], next[a]]; return next;
}
export function findMove(board, cols) {
  for (let a = 0; a < board.length; a++) {
    for (const b of [a + 1, a + cols]) {
      if (b >= board.length || board[a] == null || board[b] == null || !adjacent(a, b, cols)) continue;
      if (matches(swap(board, a, b), cols).length) return [a, b];
    }
  }
  return null;
}
export function makeBoard(level = tutorial, random = Math.random, maxAttempts = 1000) {
  const mask = level.mask ?? Array(level.rows * level.cols).fill(true);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const board = mask.map(() => null);
    for (let i = 0; i < board.length; i++) {
      if (!mask[i]) continue;
      const allowed = Array.from({ length: level.types }, (_, t) => t).filter(t =>
        !(i % level.cols >= 2 && board[i - 1] === t && board[i - 2] === t) &&
        !(i >= 2 * level.cols && board[i - level.cols] === t && board[i - 2 * level.cols] === t));
      board[i] = allowed[Math.floor(random() * allowed.length)];
    }
    if (findMove(board, level.cols)) return board;
  }
  throw new Error('Level mask cannot produce a playable board.');
}
export function refill(board, cleared, level = tutorial, random = Math.random) {
  const next = [...board]; const removed = new Set(cleared);
  for (let col = 0; col < level.cols; col++) {
    let segment = [];
    function fill() {
      const remaining = segment.filter(i => !removed.has(i)).map(i => board[i]);
      const missing = segment.length - remaining.length;
      const values = Array.from({ length: missing }, () => Math.floor(random() * level.types)).concat(remaining);
      segment.forEach((i, n) => { next[i] = values[n]; }); segment = [];
    }
    for (let row = 0; row < level.rows; row++) {
      const i = row * level.cols + col;
      if (board[i] == null) fill(); else segment.push(i);
    }
    fill();
  }
  return next;
}
