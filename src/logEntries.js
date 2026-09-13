export const logEntries = [
  { id: 'first-light', repair: 'lights', unlockAt: 1, title: 'An unfamiliar sky', source: 'Personal log', time: 'After landing / 01', text: 'Emergency lights are back. I can finally see where I landed. This moon was never on our route.' },
  { id: 'far-ridge', repair: 'windows', unlockAt: 2, title: 'Lights on the ridge', source: 'Personal log', time: 'After landing / 02', text: "The glass is sealed. Beyond it, a line of lights crosses the far ridge. I thought they were stars. Stars don't follow the ground." },
  { id: 'course-change', repair: 'computer', unlockAt: 3, title: 'An unexpected detour', source: 'Recovered flight record', time: 'Before landing / recovered', text: 'COURSE CHANGE — DISTRESS BEACON DETECTED. Origin: survey expedition. Status: missing for 27 years.' },
  { id: 'safe-landing', repair: 'diagnostics', unlockAt: 4, title: 'It kept me safe', source: 'Recovered emergency record', time: 'During landing / recovered', text: "Landing was deliberate. The ship diverted power from its engines to keep the cockpit intact. The beacon's coordinates are still in memory." },
];
export const unlockedLogs = completed => logEntries.filter(entry => entry.unlockAt <= completed);
