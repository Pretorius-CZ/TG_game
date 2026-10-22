import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {LanguageProvider} from '../../src/i18n/Language.jsx';
import {AccountContext} from '../../src/Account.jsx';
import {LivesProvider} from '../../src/Lives.jsx';
import {RewardAdProvider} from '../../src/RewardAd.jsx';
import {StarProvider} from '../../src/Stars.jsx';
import Chapters from '../../src/Chapters.jsx';
import MiniGame from '../../src/MiniGame.jsx';
import {PlaytestContext} from '../../src/PlaytestContext.js';
import useProgressSave from '../../src/useProgressSave.js';
import {normalizeProgress,SAVE_KEY} from '../../src/progressStorage.js';
import {repairs} from '../../src/repairs.js';
import {tutorialTopics} from '../../src/tutorials.js';
import '../../src/style.css';
import '../../src/compactGame.css';

const replay={...repairs[3],target:1,targetType:null,goals:undefined,ice:[],level:repairs[0].level,...(location.search.includes('lower')?{moves:1}:{})};
localStorage.setItem('beyond-signal-tutorials-v1:guest',JSON.stringify(Object.keys(tutorialTopics)));
function Fixture(){
 const [progress,setProgress]=useState(()=>normalizeProgress(JSON.parse(localStorage.getItem(SAVE_KEY)||'null')??{airlockCompleted:3,completed:location.search.includes('first')?3:4,stars:{lights:3,windows:3,computer:3,diagnostics:1}}));
 useProgressSave(progress,setProgress);
 const [playing,setPlaying]=useState(false),[chapters,setChapters]=useState(true);
 const finish=()=>{setPlaying(false);setChapters(true);};
 return <StarProvider progress={progress} onProgress={setProgress}><main><button id="replay" onClick={()=>setPlaying(true)}>Replay diagnostics</button>{playing&&<PlaytestContext.Provider value={location.search.includes('blind')?{onSnapshot:()=>{},onResult:()=>{}}:null}><MiniGame repair={replay} onWin={finish} onQuit={finish}/></PlaytestContext.Provider>}<button id="chapters" onClick={()=>setChapters(true)}>Chapters</button>{!playing&&chapters&&<Chapters progress={progress} onNavigate={()=>{}} onClose={()=>setChapters(false)} onReplay={()=>{}}/>}</main></StarProvider>;
}
createRoot(document.getElementById('root')).render(<LanguageProvider><AccountContext.Provider value={{user:null,restartView:()=>{}}}><LivesProvider><RewardAdProvider><Fixture/></RewardAdProvider></LivesProvider></AccountContext.Provider></LanguageProvider>);
