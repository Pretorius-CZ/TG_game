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
import Elysium from '../../src/Elysium.jsx';
import Rift from '../../src/Rift.jsx';
import ShipLog from '../../src/ShipLog.jsx';
import StoryComic from '../../src/StoryComic.jsx';
import {journeyFor} from '../../src/journey.js';
import {destinations} from '../../src/destinations.js';
import {shipStages} from '../../src/chapterFlow.js';
import {levelCatalog} from '../../src/levelCatalog.js';
import {chaptersFor} from '../../src/chapters.js';
import {journeyStories} from '../../src/journeyStories.js';
import {asterJumpPanels} from '../../src/asterJumpStory.js';
import {elysiumArrivalPanels} from '../../src/elysiumArrivalStory.js';
import {echoDeparturePanels} from '../../src/echoDepartureStory.js';
import {riftStoryPanels} from '../../src/riftStory.js';
import {researchStoryPanels} from '../../src/researchStory.js';
import {relayStoryPanels} from '../../src/relayStory.js';
import {caretakerPanels} from '../../src/caretakerStory.js';
import '../../src/style.css';
import '../../src/compactGame.css';
const chapters=chaptersFor({}).slice(1),sites=chapters.flatMap(c=>c.sections);
const scenes=['system','system2','elysium','rift',...sites.map(s=>s.scene)];
const stories=[...[
 ['jump','Aster Veil arrival story',asterJumpPanels],['arrival','Approaching Elysium',elysiumArrivalPanels],['echo','Elysium departure story',echoDeparturePanels],['rift','Rift crossing story',riftStoryPanels],['research','Return to Elysium story',researchStoryPanels],['relay','Night garden descent story',relayStoryPanels],['caretaker','Caretaker encounter',caretakerPanels]
].map(([id,title,panels])=>({id,title,panels,finishLabel:'Close'})),...journeyStories];
const seed=()=>({...Object.fromEntries(shipStages.map(s=>[s.key,s.total])),...Object.fromEntries(sites.map(s=>[s.key,s.repairs.length])),finaleDone:true,launchDone:true,scannerInstalled:true,jumpDone:true,elysiumRouteCompleted:1,elysiumArrival:1,riftCrossed:1,caretakerMet:1,scene:'buoy',stars:Object.fromEntries(levelCatalog.map(r=>[r.id,3]))});
const practice={stockKey:'german-localization-preview:stock',tutorialKey:'german-localization-preview:tutorials',onResult:()=>{},onSnapshot:()=>{}};
function Preview(){
 const {t}=useLanguage(),[progress,setProgress]=useState(seed),[revision,setRevision]=useState(0),[log,setLog]=useState(null),[read,setRead]=useState([]),[story,setStory]=useState(null),[notice,setNotice]=useState('');
 const site=destinations[progress.scene],goal=journeyFor(progress);
 function navigate(scene){if(scenes.includes(scene)){setNotice('');setProgress(p=>({...p,scene}));setRevision(n=>n+1);}else setNotice('První kapitolu otevři v běžném vývojovém náhledu.');}
 const showStory=id=>setStory(stories.find(s=>s.id===id));
 const entries=sites.flatMap(s=>s.logs.map((entry,i)=>({...entry,available:i<(progress[s.key]??0)})));
 const props={progress,onProgress:setProgress,onNavigate:navigate,onLog:setLog,onContinueStory:()=>navigate(goal.scene),storyGoal:goal,onReplayStory:showStory,onJumpStory:()=>showStory('jump'),onEncounter:()=>showStory('caretaker')};
 return <main className="app">
  <header className="chapter-preview-toolbar"><strong>Německý náhled · kapitoly 2–10</strong><p>Postup je pouze v paměti. Výsledky se neodesílají. Běžná hra se nemění.</p>
   <label>Oblast <select aria-label="Oblast náhledu" value={progress.scene} onChange={e=>navigate(e.target.value)}>{scenes.map(scene=><option key={scene} value={scene}>{t(destinations[scene]?.title??({system:'System chart',system2:'Aster Veil system',elysium:'Elysium station',rift:'The Rift'}[scene]))}</option>)}</select></label>
   {site&&<label>Dokončené opravy <select aria-label="Dokončené opravy náhledu" value={progress[site.key]??0} onChange={e=>{setProgress(p=>({...p,[site.key]:Number(e.target.value)}));setRevision(n=>n+1);}}>{Array.from({length:site.repairs.length+1},(_,i)=><option key={i} value={i}>{i}/{site.repairs.length}</option>)}</select></label>}
   <label>Příběh <select aria-label="Příběh náhledu" value="" onChange={e=>showStory(e.target.value)}><option value="">Vyber scénu</option>{stories.map(s=><option key={s.id} value={s.id}>{t(s.title)}</option>)}</select></label>
   <LanguageSelect/><button onClick={()=>setLog(undefined)}>Deník</button><button onClick={()=>{setProgress(seed());setRevision(n=>n+1);setNotice('');}}>Obnovit náhled</button>{notice&&<p role="status">{notice}</p>}
  </header>
  <StarProvider progress={progress} onProgress={setProgress}>{progress.scene==='elysium'?<Elysium {...props}/>:progress.scene==='rift'?<Rift {...props}/>:<Exploration key={revision} {...props}/>}</StarProvider>
  {log!==null&&<ShipLog entries={entries} readIds={read} initialId={log} onRead={id=>setRead(ids=>ids.includes(id)?ids:[...ids,id])} onClose={()=>setLog(null)}/>}
  {story&&<StoryComic key={story.id} panels={story.panels} chapter="" title={story.title} finishLabel={story.finishLabel??'Close'} onFinish={()=>setStory(null)}/>}
 </main>;
}
// A separate presentation namespace also isolates story-seen markers from guest saves.
createRoot(document.getElementById('root')).render(<LanguageProvider><AccountContext.Provider value={{user:{id:'localization-preview'}}}><LivesProvider practice><RewardAdProvider><PlaytestContext.Provider value={practice}><Preview/></PlaytestContext.Provider></RewardAdProvider></LivesProvider></AccountContext.Provider></LanguageProvider>);
