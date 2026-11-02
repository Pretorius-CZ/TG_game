// Ordered energy routes for the network expansion.
import {adjacent} from './match3.js';
import {resonatorMatchGroups} from './resonators.js';

// Only the node active at the START of a wave can receive that wave's energy.
// Independent matches count separately; crossing runs count as one combination.
export function chargeRoute(nodes, charges, matched, cols, board) {
  const next = nodes.map((node, i) => Math.min(node.target, Math.max(0, charges[i] ?? 0)));
  const active = nodes.findIndex((node, i) => next[i] < node.target);
  if (active < 0) return next;
  const hits = resonatorMatchGroups(matched, cols, board)
    .filter(group => group.some(cell => adjacent(cell, nodes[active].at, cols))).length;
  next[active] = Math.min(nodes[active].target, next[active] + hits);
  return next;
}

export const routeComplete = (nodes, charges) => nodes.every((node, i) => (charges[i] ?? 0) >= node.target);
