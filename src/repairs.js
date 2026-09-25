// Cockpit follows the airlock. Boosters and progressively harder objectives are enabled.
export const repairs = [
  {
    id: 'lights', name: 'Emergency lights', icon: 'ϟ', x: 67, y: 29,
    thought: "I can't make out the damage in this darkness. Let's get the lights working first.",
    description: 'Reconnect the ceiling lights. A little light will make the damage easier to see.',
    result: 'The ceiling lights are on. Now you can see the damaged window seals.',
    lesson: 'A spark of hope', objective: 'Match 21 energy crystals to charge the lights.',
    target: 21, targetType: 1, moves: 14, action: 'Switch on the lights',
    level: { rows: 7, cols: 7, types: 5 },
  },
  {
    id: 'windows', name: 'Window seals', icon: '◇', x: 30, y: 38,
    thought: "The window seals took a beating. I'll patch them up, then take a proper look outside.",
    description: 'Patch the cockpit window cracks and restore the seals. The rest of the hull still needs work.',
    result: 'Cracks are patched and the cockpit window seals are secure.',
    lesson: 'A clearer view', objective: 'Collect 18 blue comets and 18 stars to repair the window seals.',
    target: 36, targetType: null, moves: 16, goals: [{type:2,target:18,label:'Blue comets'},{type:4,target:18,label:'Stars'}], action: 'Seal the windows',
    level: { rows: 7, cols: 7, types: 5, mask: Array.from({length: 49}, (_, i) => ![0, 6, 42, 48].includes(i)) },
  },
  {
    id: 'computer', name: 'Flight computer', icon: '▣', x: 50, y: 45,
    thought: "The flight recorder might explain why we left our route. If I can get this console running…",
    description: 'Bring the central computer back online. Navigation and communications will come later.',
    result: 'The central display is online. Ship systems can now be checked.',
    lesson: 'Back online', objective: 'Collect 24 energy crystals and break all 4 protective covers to reboot the flight computer.',
    target: 24, targetType: 1, moves: 24, ice: [15,19,29,33], action: 'Boot the computer',
    level: { rows: 7, cols: 7, types: 6 },
  },
  {
    id: 'diagnostics', name: 'Ship diagnostics', icon: '◎', x: 71, y: 48,
    thought: "We followed a distress beacon. Now let's find out what happened during the landing — and what this ship needs next.",
    description: 'Reconnect the side displays and run a damage scan. Find out what the ship needs next.',
    result: 'Damage scan complete. Cockpit restored; hull, living quarters, supplies, navigation, fuel and engines still need repairs.',
    lesson: 'What lies ahead', objective: 'Collect 24 fuel cells and 24 blue comets, and break all 4 protective covers.',
    target: 48, targetType: null, moves: 24, ice: [9,12,37,40], goals: [{type:0,target:24,label:'Fuel cells'},{type:2,target:24,label:'Blue comets'}], action: 'Run diagnostics',
    level: { rows: 8, cols: 7, types: 6 },
  },
];

export function repairState(index, completed) {
  return index < completed ? 'complete' : index === completed ? 'available' : 'locked';
}

export function completeRepair(completed, repairId) {
  return repairs[completed]?.id === repairId ? completed + 1 : completed;
}
