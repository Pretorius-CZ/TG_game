import React, { useState, useEffect } from 'react';
import { audioSettings, setAudio } from './audio.js';
export default function AudioControls(){
  const [settings,update]=useState(audioSettings);
  useEffect(()=>{const sync=()=>update(audioSettings());window.addEventListener('ship-audio-change',sync);return()=>window.removeEventListener('ship-audio-change',sync);},[]);
  return <div className="audio-controls" aria-label="Sound settings">{['music','effects'].map(key=><button key={key} aria-pressed={settings[key]} onClick={()=>{const value=!settings[key];setAudio(key,value);update(old=>({...old,[key]:value}));}}>{key==='music'?'Music':'Sounds'}: {settings[key]?'On':'Off'}</button>)}</div>;
}
