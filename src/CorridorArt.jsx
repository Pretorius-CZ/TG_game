import React from 'react';
import { corridorLighting } from './corridor.js';

export default function CorridorArt({ completedRoomIds }) {
  const { doors, ceiling } = corridorLighting(completedRoomIds);
  return <div className="art corridor-art" aria-hidden="true" data-ceiling={ceiling}>
    <img className="scene-image" src="/scenes/corridor-dark.webp" alt=""/>
    <img className="scene-image corridor-lit" src="/scenes/corridor-concept.webp" alt="" style={{opacity:ceiling ? 1 : 0}}/>
    <svg className="corridor-strips" viewBox="0 0 941 1672" preserveAspectRatio="xMidYMid slice" fill="none" strokeWidth="7">
      <g style={{opacity:doors.includes('crew-quarters') && !ceiling ? 1 : 0}} stroke="#65e5f2"><path d="M 33 341 L 215 421 L 235 453 L 235 1018 M 25 1198 L 178 1110"/></g>
      <g style={{opacity:doors.includes('galley') && !ceiling ? 1 : 0}} stroke="#ffc861"><path d="M 730 447 L 868 390 M 714 474 L 710 984"/></g>
      <g style={{opacity:doors.includes('engine-room') && !ceiling ? 1 : 0}} stroke="#ff706b"><path d="M 375 603 L 396 581 L 539 581 L 561 603 L 561 890"/></g>
    </svg>
    <div className="shade"/>
  </div>;
}
