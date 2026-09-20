import React, { useId } from 'react';
import { corridorLighting } from './corridor.js';

// Reveal the actual illuminated fixtures, not replacement neon strokes.
const fixtures = {
  'crew-quarters': 'M 49 341 L 194 401 M 234 488 L 234 720 M 234 793 L 234 1030 M 43 700 L 43 854',
  galley: 'M 763 442 L 874 390 M 725 540 L 725 757 M 725 838 L 725 1035',
  'engine-room': 'M 373 603 L 387 586 M 414 584 L 522 584 M 550 587 L 562 602 M 373 636 L 373 708 M 373 724 L 373 893 M 563 637 L 563 891',
};
export default function CorridorArt({ completedRoomIds }) {
  const { doors, ceiling } = corridorLighting(completedRoomIds);
  const id=useId().replace(/:/g,'');
  return <div className="art corridor-art" aria-hidden="true" data-ceiling={ceiling}>
    <img className="scene-image" src="./scenes/corridor-dark.webp" alt=""/>
    <svg className="corridor-fixtures" viewBox="0 0 941 1672" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>
        {Object.entries(fixtures).map(([room,d])=><mask key={room} id={`${id}-${room}`} maskUnits="userSpaceOnUse" x="0" y="0" width="941" height="1672"><path d={d} fill="none" stroke="white" strokeWidth="26" strokeLinecap="round" filter={`url(#${id}-soft)`}/></mask>)}
      </defs>
      {Object.keys(fixtures).map(room=><image key={room} data-door-light={room} href="./scenes/corridor-concept.webp" width="941" height="1672" mask={`url(#${id}-${room})`} style={{opacity:doors.includes(room)?1:0}}/>)}
    </svg>
    <img className="scene-image corridor-lit" src="./scenes/corridor-concept.webp" alt="" style={{opacity:ceiling ? 1 : 0}}/>
    <div className="shade"/>
  </div>;
}
