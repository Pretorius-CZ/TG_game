import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createPortal} from 'react-dom';
import {LanguageProvider} from '../../src/i18n/Language.jsx';
import LanguageSelect from '../../src/i18n/LanguageSelect.jsx';
import {AccountContext} from '../../src/Account.jsx';
import {LivesProvider} from '../../src/Lives.jsx';
import {RewardAdProvider} from '../../src/RewardAd.jsx';
import MiniGame from '../../src/MiniGame.jsx';
import {airlockRepairs} from '../../src/airlockRepairs.js';
import {tutorialTopics} from '../../src/tutorials.js';
import '../../src/style.css';
import '../../src/compactGame.css';
localStorage.setItem('beyond-signal-tutorials-v1:guest',JSON.stringify(Object.keys(tutorialTopics)));
const repair={...airlockRepairs[0],moves:80,target:9999,goals:undefined,targetType:null};
function Harness(){
 const [dialog,setDialog]=useState(null);
 useEffect(()=>{setDialog(document.querySelector('.mini-dialog'));},[]);
 return <><MiniGame repair={repair} onWin={()=>{}} onQuit={()=>{}}/>{dialog&&createPortal(<div className="test-language-control"><LanguageSelect/></div>,dialog)}</>;
}
createRoot(document.getElementById('root')).render(<LanguageProvider><AccountContext.Provider value={{user:null}}><LivesProvider><RewardAdProvider><Harness/></RewardAdProvider></LivesProvider></AccountContext.Provider></LanguageProvider>);
