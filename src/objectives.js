import {objectiveCount} from './match3.js';

export function goalsFor(repair) {
  return repair.goals ?? [{type: repair.targetType, target: repair.target, label: repair.name}];
}
export function collectGoals(goals, counts, board, collected) {
  return goals.map((goal, i) => Math.min(goal.target, (counts[i] ?? 0) + objectiveCount(board, collected, goal.type)));
}
export function goalsComplete(goals, counts) {
  return goals.every((goal, i) => (counts[i] ?? 0) >= goal.target);
}
