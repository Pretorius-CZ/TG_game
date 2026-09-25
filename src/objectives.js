import {objectiveCount} from './match3.js';

const pieceLabels = ['Fuel cells', 'Energy crystals', 'Blue comets', 'Asteroids', 'Stars', 'Energy orbs'];

export function goalsFor(repair) {
  return repair.goals ?? [{type: repair.targetType, target: repair.target, label: pieceLabels[repair.targetType] ?? 'Pieces'}];
}
export function collectGoals(goals, counts, board, collected) {
  return goals.map((goal, i) => Math.min(goal.target, (counts[i] ?? 0) + objectiveCount(board, collected, goal.type)));
}
export function goalsComplete(goals, counts) {
  return goals.every((goal, i) => (counts[i] ?? 0) >= goal.target);
}
