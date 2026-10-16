// Explicit QA campaign labels classify browsers, never playing skill or win rate.
export const isBotVisit = visit => visit.source === 'automated_test' && visit.medium === 'bot';
export function trafficSelection(attempts, visits, traffic = 'players', knownBots = []) {
 const bots = new Set([...knownBots, ...visits.filter(isBotVisit).map(v => v.reporter).filter(Boolean)]);
 const matches = row => traffic === 'all' || bots.has(row.reporter) === (traffic === 'bots');
 return {attempts: attempts.filter(matches), visits: visits.filter(matches), bots};
}
