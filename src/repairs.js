// Stage one only. Completing the cockpit does not complete the ship.
export const repairs = [
  {
    id: 'lights', name: 'Emergency lights', icon: 'ϟ', x: 67, y: 29,
    thought: "I can't make out the damage in this darkness. Let's get the lights working first.",
    description: 'Reconnect the ceiling lights. A little light will make the damage easier to see.',
    result: 'The ceiling lights are on. Now you can see the damaged window seals.',
    lesson: 'A spark of hope', objective: 'Match any 18 pieces to charge the lights.',
    target: 18, targetType: null, action: 'Switch on the lights',
    level: { rows: 6, cols: 6, types: 4 },
  },
  {
    id: 'windows', name: 'Window seals', icon: '◇', x: 30, y: 38,
    thought: "The window seals took a beating. I'll patch them up, then take a proper look outside.",
    description: 'Patch the cockpit window cracks and restore the seals. The rest of the hull still needs work.',
    result: 'Cracks are patched and the cockpit window seals are secure.',
    lesson: 'A clearer view', objective: 'Match 12 blue comets to repair the window seals.',
    target: 12, targetType: 2, action: 'Seal the windows',
    level: { rows: 6, cols: 6, types: 4, mask: Array.from({length: 36}, (_, i) => ![0, 5, 30, 35].includes(i)) },
  },
  {
    id: 'computer', name: 'Flight computer', icon: '▣', x: 50, y: 45,
    thought: "The flight recorder might explain why we left our route. If I can get this console running…",
    description: 'Bring the central computer back online. Navigation and communications will come later.',
    result: 'The central display is online. Ship systems can now be checked.',
    lesson: 'Back online', objective: 'Match 15 energy crystals to reboot the flight computer.',
    target: 15, targetType: 1, action: 'Boot the computer',
    level: { rows: 6, cols: 6, types: 4 },
  },
  {
    id: 'diagnostics', name: 'Ship diagnostics', icon: '◎', x: 71, y: 48,
    thought: "We followed a distress beacon. Now let's find out what happened during the landing — and what this ship needs next.",
    description: 'Reconnect the side displays and run a damage scan. Find out what the ship needs next.',
    result: 'Damage scan complete. Cockpit restored; hull, living quarters, supplies, navigation, fuel and engines still need repairs.',
    lesson: 'What lies ahead', objective: 'Match any 30 pieces to run the ship diagnostics.',
    target: 30, targetType: null, action: 'Run diagnostics',
    level: { rows: 7, cols: 6, types: 5 },
  },
];

export function repairState(index, completed) {
  return index < completed ? 'complete' : index === completed ? 'available' : 'locked';
}

export function completeRepair(completed, repairId) {
  return repairs[completed]?.id === repairId ? completed + 1 : completed;
}
