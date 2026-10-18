// Browser-only fixture: exercises production components with isolated providers.
import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {LanguageProvider} from '../../src/i18n/Language.jsx';
import {AccountContext} from '../../src/Account.jsx';
import {LivesProvider} from '../../src/Lives.jsx';
import {RewardAdProvider} from '../../src/RewardAd.jsx';
import MiniGame from '../../src/MiniGame.jsx';
import OrientationGuard from '../../src/OrientationGuard.jsx';
import {repairs} from '../../src/repairs.js';
import {archiveDestinations} from '../../src/archive.js';
import {signalDestinations} from '../../src/signalNetwork.js';
import {tutorialTopics} from '../../src/tutorials.js';
import '../../src/style.css';
import '../../src/compactGame.css';
const params=new URLSearchParams(location.search);
const all=[...repairs,...Object.values(archiveDestinations).flatMap(d=>d.repairs),...Object.values(signalDestinations).flatMap(d=>d.repairs)];
const source=all.find(r=>r.id===params.get('id'))??repairs[3];
let repair=params.has('stress')?{...source,lesson:'Verify the reconstructed journey',level:{rows:8,cols:8,types:6,mask:Array.from({length:64},(_,i)=>i!==27)},ice:[9,12,33,36],goals:[0,1,2].map(type=>({type,target:100,label:'Test objective'})),resonators:[{at:27,target:3}]}:source;
if(params.has('result'))repair={...repairs[0],moves:params.get('result')==='performance'?80:1,target:params.get('result')==='won'?1:9999,targetType:null,goals:undefined};
localStorage.setItem('beyond-signal-tutorials-v1:guest',JSON.stringify(Object.keys(tutorialTopics)));
function Fixture(){
 const [open,setOpen]=useState(true);
 const finish=result=>{document.body.dataset.finished=result;if(params.has('cycles'))setOpen(false);};
 return open?<MiniGame repair={repair} onWin={()=>finish('won')} onQuit={()=>finish('quit')}/>:<button id="reopen" onClick={()=>setOpen(true)}>Open level</button>;
}
createRoot(document.getElementById('root')).render(<LanguageProvider><OrientationGuard/><RewardAdProvider><LivesProvider><AccountContext.Provider value={{user:params.has('stock-user')?{id:params.get('stock-user')}:null}}><Fixture/></AccountContext.Provider></LivesProvider></RewardAdProvider></LanguageProvider>);
