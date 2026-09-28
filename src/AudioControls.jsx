import {useLanguage} from './i18n/Language.jsx';
import React, { useState, useEffect } from 'react';
import { audioSettings, setAudio } from './audio.js';
export default function AudioControls(){
 const {t}=useLanguage();
  const [settings,update]=useState(audioSettings);
  useEffect(()=>{const sync=()=>update(audioSettings());window.addEventListener('ship-audio-change',sync);return()=>window.removeEventListener('ship-audio-change',sync);},[]);
  return <div className="audio-controls audio-icons" aria-label={t("Sound settings")}>{['music','effects'].map(key=>{
    const label=`${t(key==='music'?'Music':'Sounds')}: ${t(settings[key]?'On':'Off')}`;
    return <button key={key} type="button" title={label} aria-label={label} aria-pressed={settings[key]} onClick={()=>{const value=!settings[key];setAudio(key,value);update(old=>({...old,[key]:value}));}}>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {key==='music'?<><path d="M9 17V5l11-2v12M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/></>:<><path d="M4 9h4l5-4v14l-5-4H4zM16 8q4 4 0 8M19 5q7 7 0 14"/></>}
        {!settings[key]&&<><path d="M3 3l18 18" stroke="#142635" strokeWidth="5"/><path d="M3 3l18 18" strokeWidth="2.2"/></>}
      </svg>
    </button>;
  })}</div>;
}
