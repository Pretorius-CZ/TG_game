// The original level-200 ending remains available; this is the next assignment.
export const networkIntroStory={
 id:'network-first-watch',chapter:'network',scene:'network-handover',ready:p=>p.signalStationCompleted===4,
 title:'The first watch',finishLabel:'Accept the new assignment',panels:[
  {image:'signal-station',title:'The rescue is complete',caption:'The expedition is home. The station closes the old distress call and keeps its record safe. This new assignment does not change their story.'},
  {image:'departure-flight',title:'A supply ship again',caption:'The operator asks us to deliver replacement modules to an outer service platform. A working network needs somewhere to maintain its equipment.'},
  {image:'network-platform',imageExtension:'png',title:'Build the next safe stop',caption:'We will extend the network while the rescue route stays open. First take over the maintenance watch, then prepare the new platform for its first crew.'},
 ],
};
export const networkTravelStories=[
 {id:'network-crew-stops',chapter:'network',scene:'network-water',ready:p=>p.networkPlatformCompleted===5,
  title:'Room for the next watch',finishLabel:'Visit the water workshop',panels:[
   {image:'network-water',imageExtension:'png',title:'A working station needs daily care',caption:'The workshop is ready, but its future crew needs clean water and a quiet place to rest. Our next delivery stays inside the station.'},
   {image:'network-quarters',imageExtension:'png',title:'Short stops, useful changes',caption:'We will visit the water workshop, crew habitat, nursery and courtyard before taking the beacon modules outside.'},
  ]},
 {id:'network-near-departure',chapter:'network',scene:'network-beacon-dock',ready:p=>p.networkCourtyardCompleted===3,
  title:'The first new branch',finishLabel:'Approach the near beacon',panels:[
   {image:'network-courtyard',imageExtension:'png',title:'A place to pause',caption:'The courtyard is open. The caretaker keeps the seedlings while we deliver the next modules beyond the station windows.'},
   {image:'network-beacon-dock',imageExtension:'png',title:'A dock beneath the mast',caption:'Our first field stop is the near beacon. Secure its small service dock, then climb to the optical mast above it.'},
  ]},
 {id:'network-far-crossing',chapter:'network',scene:'network-far-approach',ready:p=>p.networkNearMastCompleted===3,
  title:'Following our own signal',finishLabel:'Survey the far approach',panels:[
   {image:'network-beacon-mast',imageExtension:'png',title:'The return beam stays lit',caption:'The near mast now points to the far anchorage. This time our ship follows a route we helped build.'},
   {image:'network-far-approach',imageExtension:'png',title:'The tower beyond the moon',caption:'Mark the approach around the moon, then enter the remote service tower. Both ends must answer before the next delivery can use this branch.'},
  ]},
];
