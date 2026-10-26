import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {LanguageProvider,useLanguage} from './i18n/Language.jsx';
import {AccountContext} from './Account.jsx';
import {LivesProvider} from './Lives.jsx';
import {RewardAdProvider} from './RewardAd.jsx';
import {PlaytestContext} from './PlaytestContext.js';
import MiniGame from './MiniGame.jsx';
import OrientationGuard from './OrientationGuard.jsx';
import {levelGroups} from './levelCatalog.js';
import {moveBudget} from './levelRules.js';
import {BALANCE_RULES_VERSION} from './balanceTracking.js';
import {createPlaytest,readPlaytest,playtestKey,queuePlaytestResult,ratePlaytest,playtestExport} from './playtestStorage.js';
import {supabase} from './supabase.js';
import {mountAudio} from './audio.js';
import './style.css';
import './compactGame.css';
import './playtest.css';

const run=new URLSearchParams(location.search).get('run')||'blind-200-v1';
const key=playtestKey(/^[a-zA-Z0-9_-]{1,60}$/.test(run)?run:'blind-200-v1');
function Playtest(){
 const {language,setLanguage}=useLanguage();
 const [error,setError]=useState(''),[sync,setSync]=useState(''),[playing,setPlaying]=useState(null),[rating,setRating]=useState(''),[note,setNote]=useState(''),[ready,setReady]=useState(false);
 const [session,setSession]=useState(()=>{try{return readPlaytest(localStorage,key)||createPlaytest(levelGroups.flatMap(([,rs])=>rs).map(r=>({...r,moves:moveBudget(r)})),{rules:BALANCE_RULES_VERSION});}catch(e){return {invalid:e.message};}});
 const ref=useRef(session),sending=useRef(false),alive=useRef(true),finishRef=useRef(null);
 useEffect(mountAudio,[]);
 function commit(next){
  try{const previous=readPlaytest(localStorage,key);if(previous&&previous.revision!==ref.current.revision)throw Error('Test se změnil v jiné kartě. Zavři ji a znovu otevři tento odkaz.');next={...next,revision:ref.current.revision+1};localStorage.setItem(key,JSON.stringify(next));ref.current=next;setSession(next);return true;}
  catch(e){setError('Uložení se nepodařilo. '+e.message);return false;}
 }
 useEffect(()=>{
  alive.current=true;let release;
  if(navigator.locks)navigator.locks.request(key,{ifAvailable:true},async lock=>{if(!alive.current)return;if(!lock){setError('Tento test už je otevřený v jiné kartě. Pokračuj tam nebo ji zavři a obnov tuto stránku.');return;}setReady(true);await new Promise(resolve=>{release=resolve;});});else setReady(true);
  return()=>{alive.current=false;release?.();};
 },[]);
 useEffect(()=>{
  if(!ready||session.invalid)return;
  if(ref.current.active){const row=ref.current.active;commit(queuePlaytestResult(ref.current,{...row,at:Date.now(),configuration:{...row.configuration,playtest:{...row.configuration?.playtest,interrupted:true}}}));}
 },[ready]);
 async function flush(){
  if(sending.current||!ref.current.consent||!ready||navigator.onLine===false||error)return;
  sending.current=true;
  try{for(const item of [...ref.current.pending]){
   const current=ref.current;if(!current.consent||!alive.current)break;
   setSync('Odesílám výsledky…');
   const {error:rpcError}=await supabase.rpc('record_balance_attempt',{reporter_id:current.reporter,reporter_token:current.token,incoming:item.payload,incoming_revision:item.revision}).abortSignal(AbortSignal.timeout(12000));
   if(rpcError)throw rpcError;
   if(!alive.current)break;
   if(!commit({...ref.current,pending:ref.current.pending.filter(p=>p.payload.attemptId!==item.payload.attemptId||p.revision!==item.revision)}))break;
  }if(alive.current)setSync(ref.current.pending.length?'Čeká na odeslání':'Výsledky jsou odeslané');}
  catch{if(alive.current)setSync('Výsledky zůstávají uložené zde; odeslání zopakuji po připojení.');}finally{sending.current=false;}
 }
 useEffect(()=>{flush();const timer=setInterval(flush,15000);window.addEventListener('online',flush);return()=>{clearInterval(timer);window.removeEventListener('online',flush);};},[ready,session.consent,session.pending.length,error]);
 function finish(row){
  if(ref.current.rating===row.attemptId)return;
  if(commit(queuePlaytestResult(ref.current,row))){setPlaying(null);setRating('');setNote('');requestAnimationFrame(()=>finishRef.current?.focus());}
 }
 function open(){
  const current=ref.current;if(current.cursor>=current.order.length||current.active||current.rating)return;
  const id=crypto.randomUUID();
  try{localStorage.setItem(key+':stock','[1,1,1,1,1]');setPlaying(id);}catch(e){setError('Nelze uložit testovací pomůcky. '+e.message);}
 }
 function resume(){if(commit({...ref.current,consent:true}))open();}
 function next(retry=false,pause=false){
  try{const rated=ratePlaytest(ref.current,rating,note);if(commit({...rated,rating:null,cursor:rated.cursor+(retry?0:1)})){setRating('');setNote('');if(!pause&&ref.current.cursor<ref.current.order.length)open();}}
  catch(e){setError(e.message);}
 }
 function download(){const blob=new Blob([JSON.stringify(playtestExport(ref.current),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='beyond-signal-blind-playtest.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 const row=session.attempts?.find(r=>r.attemptId===session.rating),done=session.cursor>=session.order?.length;
 const repair=session.repairs?.find(r=>r.id===session.order[session.cursor]);
 const context={stockKey:key+':stock',tutorialKey:key+':tutorials',onResult:finish,onSnapshot:snapshot=>{if(!ref.current.rating)commit({...ref.current,active:snapshot});}};
 const neutral=repair?{...repair,name:`Test ${session.cursor+1}`,room:'SLEPÝ PLAYTEST',lesson:`Test ${session.cursor+1} / ${session.order.length}`,action:language==='de'?'Versuch bewerten':language==='cs'?'Ohodnotit pokus':'Rate attempt'}:null;
 return <main className="blind-playtest"><h1>Slepý playtest</h1><p className="playtest-progress">{session.invalid?'Test nelze načíst':`${session.cursor} / ${session.order.length} úrovní vyhodnoceno`}</p>
 <div className="test-language"><button aria-pressed={language==='cs'} onClick={()=>setLanguage('cs')}>CZ</button><button aria-pressed={language==='en'} onClick={()=>setLanguage('en')}>EN</button><button aria-pressed={language==='de'} onClick={()=>setLanguage('de')}>DE</button><button aria-pressed={language==='fr'} onClick={()=>setLanguage('fr')}>FR</button></div>
 {(error||session.invalid)&&<p role="alert">{error||session.invalid}</p>}
 {!session.invalid&&!playing&&<>
 {row?<section className="playtest-rating" ref={finishRef} tabIndex={-1} aria-labelledby="rating-heading"><h2 id="rating-heading">Jaký byl Test {session.cursor+1}?</h2><p>{{won:'Výhra',exhausted:'Došly tahy',quit:'Pokus přerušen',fault:'Technická chyba',failed:'Prohra'}[row.outcome]} · {row.moves} / {row.budget} tahů{row.configuration?.playtest?.interrupted?' · obnovení stránky':''}</p>
 <div role="group" aria-label="Obtížnost">{[['easy','Lehké'],['fair','Akorát'],['hard','Těžké']].map(([value,label])=><button key={value} aria-pressed={rating===value} onClick={()=>setRating(value)}>{label}</button>)}</div>
 <label>Poznámka (nepovinná)<textarea maxLength={500} value={note} onChange={e=>setNote(e.target.value)} placeholder="Co bylo snadné nebo frustrující? Bez osobních údajů."/></label>
 <button className="primary" disabled={!rating||!ready||Boolean(error)} onClick={()=>next(false)}>Uložit hodnocení a další test</button><button disabled={!rating||!ready||Boolean(error)} onClick={()=>next(true)}>Uložit a zkusit stejný test znovu</button><button disabled={!rating||!ready||Boolean(error)} onClick={()=>next(false,true)}>Uložit a pokračovat později</button>
 </section>:done?<section><h2>Všech 200 levelů vyhodnoceno.</h2><p>Díky! Výsledky můžeš exportovat a společně je projdeme.</p></section>:<section>
 <h2>{session.cursor?'Pokračovat v testu':'200 levelů, náhodné pořadí'}</h2>
 <p>Pořadí i současná pravidla se uloží při zahájení. Původní čísla, názvy, kapitoly a označení HARD zůstanou skryté. Po každém pokusu vyber hodnocení; můžeš pokračovat i po prohře.</p>
 <p>Běžný postup, účet, energie ani zásoby se nepoužijí. V každém pokusu máš jednu od každé pomůcky, jednu nápovědu a jeden krok zpět zdarma; bez reklam, bonusových tahů a čekání na energii. Použití kroku zpět se zapíše k výsledku.</p>
 <p>Zahájením povolíš sběr výsledku, tahů, času od otevření pokusu, použitých pomůcek a náloží, hodnocení a poznámky. Výsledky se ukládají zde a odesílají pod náhodným ID do samostatného playtestu v /balance. Bez Googlu, jména a e-mailu. Server má 90denní retenci. Rozhraní testu je česky, jazyk samotné desky přepneš nahoře.</p>
 <p>Vracej se přes stejný odkaz ve stejném prohlížeči a zařízení. Rozehraná deska se neukládá; po obnovení vyhodnotíš přerušený pokus. Běžné statistiky tím nezapínáš. <a href="./privacy.html" target="_blank" rel="noreferrer">Ochrana soukromí</a></p>
 <button className="primary" disabled={!ready||Boolean(error)} onClick={resume}>{session.consent?'Pokračovat v testu':'Povolit sběr a zahájit test'}</button>
 </section>}
 <p role="status">{sync||'Výsledky se nejprve ukládají v tomto prohlížeči.'}{session.pending.length>0?` Čeká na odeslání: ${session.pending.length}.`:''}</p>
 <div className="test-footer"><button onClick={download}>Exportovat výsledky JSON</button>{session.revision>0&&<button onClick={()=>commit({...ref.current,consent:!ref.current.consent})}>{session.consent?'Pozastavit odesílání':'Povolit odesílání výsledků'}</button>}<a href="./">Běžná hra</a></div>
 </>}
 {playing&&neutral&&<PlaytestContext.Provider value={context}><LivesProvider practice><MiniGame key={playing} repair={neutral} onWin={()=>{}} onQuit={()=>{}}/></LivesProvider></PlaytestContext.Provider>}
 </main>;
}
document.body.classList.add('blind-test-page');
createRoot(document.getElementById('root')).render(<LanguageProvider storageKey={key+':language'} defaultLanguage="cs"><OrientationGuard/><RewardAdProvider><AccountContext.Provider value={{user:null}}><Playtest/></AccountContext.Provider></RewardAdProvider></LanguageProvider>);
