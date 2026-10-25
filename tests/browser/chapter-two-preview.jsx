import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {LanguageProvider,useLanguage} from '../../src/i18n/Language.jsx';
import LanguageSelect from '../../src/i18n/LanguageSelect.jsx';
import {AccountContext} from '../../src/Account.jsx';
import {LivesProvider} from '../../src/Lives.jsx';
import {RewardAdProvider} from '../../src/RewardAd.jsx';
import {StarProvider} from '../../src/Stars.jsx';
import {PlaytestContext} from '../../src/PlaytestContext.js';
import Exploration from '../../src/Exploration.jsx';
import ShipLog from '../../src/ShipLog.jsx';
import AsterJumpStory from '../../src/AsterJumpStory.jsx';
import {journeyFor} from '../../src/journey.js';
import {destinations} from '../../src/destinations.js';
import {shipStages} from '../../src/chapterFlow.js';
import {levelCatalog} from '../../src/levelCatalog.js';
import {jumpLog} from '../../src/haven.js';
import '../../src/style.css';
import '../../src/compactGame.css';
const scenes=['mine','ice','wreck','haven','system','system2'];
const seed=()=>({...Object.fromEntries(shipStages.map(s=>[s.key,s.total])),finaleDone:true,launchDone:true,scannerInstalled:true,mineCompleted:6,iceCompleted:6,wreckCompleted:6,havenCompleted:6,jumpDone:false,scene:'mine',stars:Object.fromEntries(levelCatalog.slice(0,53).map(r=>[r.id,3]))});
// Practice providers isolate this review tool from ordinary saves and analytics.
const practice={stockKey:'german-chapter-two-preview:stock',tutorialKey:'german-chapter-two-preview:tutorials',onResult:()=>{},onSnapshot:()=>{}};
function Preview(){
 const {t}=useLanguage(),[progress,setProgress]=useState(seed),[revision,setRevision]=useState(0),[log,setLog]=useState(null),[read,setRead]=useState([]),[arrival,setArrival]=useState(false),[notice,setNotice]=useState('');
 const site=destinations[progress.scene],goal=journeyFor(progress);
 function navigate(scene){if(scenes.includes(scene)){setNotice('');setProgress(p=>({...p,scene}));}else setNotice('Tato oblast bude přeložená v dalším balíku.');}
 const entries=[...scenes.slice(0,4).flatMap(scene=>destinations[scene].logs.map((entry,i)=>({...entry,available:i<(progress[destinations[scene].key]??0)}))),{...jumpLog,available:progress.jumpDone}];
 return <main className="app">
  <header className="chapter-preview-toolbar"><strong>Německý náhled · kapitola 2</strong><p>Herní postup zůstává jen v tomto náhledu. Výsledky se neodesílají.</p>
   <label>Oblast <select aria-label="Oblast náhledu" value={progress.scene} onChange={e=>navigate(e.target.value)}>{scenes.map(scene=><option key={scene} value={scene}>{t(destinations[scene]?.title??(scene==='system2'?'Aster Veil system':'System chart'))}</option>)}</select></label>
   {site&&<label>Dokončené opravy <select aria-label="Dokončené opravy náhledu" value={progress[site.key]??0} onChange={e=>{setProgress(p=>({...p,[site.key]:Number(e.target.value)}));setRevision(n=>n+1);}}>{Array.from({length:7},(_,i)=><option key={i} value={i}>{i}/6</option>)}</select></label>}
   <LanguageSelect/><button onClick={()=>setLog(undefined)}>Deník</button><button onClick={()=>{setProgress(seed());setRevision(n=>n+1);setNotice('');}}>Obnovit náhled</button>{notice&&<p role="status">{notice}</p>}
  </header>
  <StarProvider progress={progress} onProgress={setProgress}><Exploration key={revision} progress={progress} onProgress={setProgress} onNavigate={navigate} onLog={id=>setLog(id)} onJumpStory={()=>setArrival(true)} onContinueStory={()=>navigate(goal.scene)} storyGoal={goal}/></StarProvider>
  {log!==null&&<ShipLog entries={entries} readIds={read} initialId={log} onRead={id=>setRead(ids=>ids.includes(id)?ids:[...ids,id])} onClose={()=>setLog(null)} onReplayJump={()=>{setLog(null);setArrival(true);}}/>}
  {arrival&&<AsterJumpStory onFinish={()=>setArrival(false)}/>}
 </main>;
}
createRoot(document.getElementById('root')).render(<LanguageProvider><AccountContext.Provider value={{user:null}}><LivesProvider practice><RewardAdProvider><PlaytestContext.Provider value={practice}><Preview/></PlaytestContext.Provider></RewardAdProvider></LivesProvider></AccountContext.Provider></LanguageProvider>);
