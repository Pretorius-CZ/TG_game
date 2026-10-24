import {createPortal} from 'react-dom';
import {PlaytestContext} from './PlaytestContext.js';
import usePuzzleFit from './usePuzzleFit.js';
import {crazyGames,android,rewardAvailable} from './platform.js';
import {reportGameplay} from './crazyGames.js';
import {trackCampaignAttempt} from './campaignTracking.js';
import Stars,{useStars} from './Stars.jsx';
import {earnedStars} from './starRating.js';
import {goalRefillRandom,makeGoalBoard} from './goalRefill.js';
import {createTurnRandom,createTurnUndo} from './turnUndo.js';
import './undo.css';
import {useAccount} from './Account.jsx';
import MechanicTutorial from './MechanicTutorial.jsx';
import {relevantTutorials,initialTutorials,helperTutorials,readTutorials} from './tutorials.js';
import {saveAttempt,BALANCE_RULES_VERSION} from './balanceTracking.js';
import {chargeResonators,resonatorsComplete} from './resonators.js';
import HelperIcon from './HelperIcon.jsx';
import {useRewardAd} from './RewardAd.jsx';
import {tileSetFor} from './tileSets.js';
import {useLanguage} from './i18n/Language.jsx';
import React, { useContext,useEffect, useRef, useState } from 'react';
import { adjacent, swap } from './match3';

import {moveBudget,initialIce,iceMatches,iceMove,swapMatches,ensurePlayableBoard} from './levelRules.js';
import {useLives,LivesBar,NoLives} from './Lives.jsx';
import AudioControls from './AudioControls.jsx';
import useHelperStock from './useHelperStock.js';
import { sound } from './audio.js';
import {goalsFor,collectGoals,goalsComplete} from './objectives.js';
import {blast,isBooster,boostersEnabled,wave,awardCascadePulse} from './boosters.js';


export default function MiniGame({ onWin, onQuit, repair }) {
 const playtest=useContext(PlaytestContext);
 const [cascadePulse,setCascadePulse]=useState(null);
 const {t,msg,language}=useLanguage();
 const {award,stars}=useStars();
 const {user}=useAccount();
 const tutorialKey=playtest?.tutorialKey??`beyond-signal-tutorials-v1:${user?.id||'guest'}`;
  const level = repair.level;
  const resonators=repair.resonators??[];
  const [resonatorHelp,setResonatorHelp]=useState(false);
  const [resonatorFx,setResonatorFx]=useState([]);
  const [resonance,setResonance]=useState(()=>resonators.map(()=>0));
  const {names,sprites}=tileSetFor(repair);
  const goals = goalsFor(repair);
  const refillHistory=useRef({});
  const turnRandom=useRef(null),turnUndo=useRef(null);
  if(!turnRandom.current){turnRandom.current=createTurnRandom();turnUndo.current=createTurnUndo(turnRandom.current);}
  const [undoReady,setUndoReady]=useState(false),[undoUsed,setUndoUsed]=useState(false);
  const [undoCredit,setUndoCredit]=useState(false),[undoNotice,setUndoNotice]=useState('');
  const undoCreditRef=useRef(false);
  const undoOwner=useRef(null);undoOwner.current=`${repair.id}:${user?.id??'guest'}`;
  useEffect(()=>{turnUndo.current.invalidate();setUndoReady(false);undoCreditRef.current=false;setUndoCredit(false);setUndoNotice('');},[repair.id,user?.id]);
  useEffect(()=>{if(undoNotice!=='restored')return;const timer=setTimeout(()=>setUndoNotice(''),5000);return()=>clearTimeout(timer);},[undoNotice]);
  const boosts = boostersEnabled(repair);
  const topics=relevantTutorials({boosts,covers:initialIce(repair).length>0,resonators:resonators.length>0});
  const seenTutorials=useRef(new Set((()=>{try{return readTutorials(localStorage,tutorialKey);}catch{return [];}})()));
  const [tutorialQueue,setTutorialQueue]=useState(()=>initialTutorials({covers:initialIce(repair).length>0,resonators:resonators.length>0}).filter(id=>!seenTutorials.current.has(id)));
  const tutorial=tutorialQueue[0];
  function dismissTutorial(){
    seenTutorials.current.add(tutorial);
    try{localStorage.setItem(tutorialKey,JSON.stringify([...new Set([...readTutorials(localStorage,tutorialKey),tutorial])]));}catch{}
    setTutorialQueue(queue=>queue.slice(1));
  }
  function explainBoosts(used){
    const unseen=[...new Set(used)].filter(id=>!seenTutorials.current.has(id));
    if(unseen.length)setTutorialQueue(queue=>[...new Set([...queue,...unseen])]);
  }
  const lives=useLives();
  const spent=useRef(false);
  const [admitted,setAdmitted]=useState(()=>lives.count>0);
  const [ice,setIce]=useState(()=>initialIce(repair));
  const [extraMoves,setExtraMoves]=useState(0);
  const limit=moveBudget(repair)+extraMoves;
  const [initial] = useState(()=>{try{return {board:makeGoalBoard(level,goals,initialIce(repair),turnRandom.current.next),failed:false};}catch{return {board:[],failed:true};}});
  const [board, setBoard] = useState(initial.board);
  const [fault,setFault]=useState(initial.failed);
  const run=useRef(0);
  const watchdog=useRef(null);
  const [selected, setSelected] = useState(null);
  const [cleared, setCleared] = useState([]);
  const [blastFx,setBlastFx] = useState(null);
  const [moving, setMoving] = useState(null);
  const [falling, setFalling] = useState([]);
  const [counts, setCounts] = useState(()=>goals.map(()=>0));
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [shuffling,setShuffling]=useState(false);
  const [message, setMessage] = useState(boosts?'Match 3 pieces. Tap ? for a hint.':'Tap one glowing piece, then the other to swap them.');
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [hint, setHint] = useState(() => boosts?null:iceMove(board, level.cols,ice));
  const [hintsLeft,setHintsLeft]=useState(1);
  const [toolsLeft,consumeTool,rewardTool]=useHelperStock();
  const ad=useRewardAd();
  const [adsUsed,setAdsUsed]=useState({moves:false,hint:false,helper:false});
  const assistance=useRef({helpers:[],extraMoves:false,hints:0});
  const recorded=useRef(false);
  const attemptId=useRef(crypto.randomUUID());
  const attemptStarted=useRef(Date.now());
  useEffect(()=>{if(!playtest&&admitted&&!fault)(!crazyGames)&&trackCampaignAttempt(attemptId.current,repair.id);},[admitted,repair.id]);
  function attemptSnapshot(outcome){return {build:BALANCE_RULES_VERSION,attemptId:attemptId.current,level:repair.id,outcome,moves,budget:limit,baseBudget:moveBudget(repair),remaining:Math.max(0,limit-moves),at:Date.now(),durationMs:Date.now()-attemptStarted.current,configuration:{cols:level.cols,rows:level.rows,types:level.types,goals,ice:initialIce(repair),resonators,assistance:{undoUses:assistance.current.undoUses??0,actions:assistance.current.actions??0},...(playtest?{playtest:{chargeActivations:assistance.current.chargeActivations??0,chargeSwaps:assistance.current.chargeSwaps??0,chargesCreated:assistance.current.chargesCreated??0,cascadePulses:assistance.current.cascadePulses??0}}:{})},counts,remainingCovers:ice.length,resonance,...assistance.current};}
  function recordResult(outcome,terminal=true){
    if(recorded.current)return;if(terminal)recorded.current=true;
    if(playtest){recorded.current=true;playtest.onResult(attemptSnapshot(outcome));return;}
    if(!crazyGames)trackCampaignAttempt(attemptId.current,repair.id,outcome);
    if(!crazyGames)saveAttempt({build:BALANCE_RULES_VERSION,attemptId:attemptId.current,level:repair.id,outcome,moves,budget:limit,baseBudget:moveBudget(repair),remaining:Math.max(0,limit-moves),at:Date.now(),durationMs:Date.now()-attemptStarted.current,configuration:{cols:level.cols,rows:level.rows,types:level.types,goals,ice:initialIce(repair),resonators,assistance:{undoUses:assistance.current.undoUses??0,actions:assistance.current.actions??0}},counts,remainingCovers:ice.length,resonance,...assistance.current});
  }
  function requestHelp(kind,index){
    if(playtest)return;
    if(tutorial||busy||lock.current||adsUsed[kind]||!rewardAvailable(kind))return;
    const token=run.current;
    const reward=kind==='moves'?t('+5 moves'):kind==='hint'?t('One extra hint'):'1× '+t(helpers[index][1]);
    ad(reward,async()=>{
      if(!alive.current||run.current!==token)return false;
      if(kind==='helper'&&!await rewardTool(index))return false;
      if(kind==='moves'){
        // Exhaustion is provisional when the player continues the same attempt.
        if(spent.current){lives.reward();lives.reserveAttempt(attemptId.current);spent.current=false;}
        setExtraMoves(n=>n+5);assistance.current.extraMoves=true;
      }
      if(kind==='hint')setHintsLeft(1);
      setAdsUsed(previous=>({...previous,[kind]:true}));
      return true;
    },kind);
  }
  function requestUndo(){
    if(tutorial||confirmQuit||busy||lock.current||won||fault||undoUsed||!undoReady||!turnUndo.current.available)return;
    if(playtest){undoCreditRef.current=true;applyUndo();return;}
    if(undoCreditRef.current){applyUndo();return;}
    if(!rewardAvailable('undo'))return;
    const token=run.current,owner=undoOwner.current;
    ad(msg('undo.description'),()=>{
      if(!alive.current||run.current!==token||undoOwner.current!==owner||!turnUndo.current.available)return false;
      // Watching earns a credit; only the next explicit tap consumes the turn.
      undoCreditRef.current=true;setUndoCredit(true);setUndoNotice('prepared');
      return true;
    },'undo');
  }
  function applyUndo(){
    if(!undoCreditRef.current||!turnUndo.current.available)return;
    if(spent.current&&!lives.resumeAttempt(attemptId.current))return;
    const previous=turnUndo.current.take();
    if(!previous)return;
    undoCreditRef.current=false;setUndoCredit(false);
    spent.current=false;assistance.current.undoUses=1;
    refillHistory.current=previous.refillHistory;
    setBoard(previous.board);setIce(previous.ice);setCounts(previous.counts);setResonance(previous.resonance);setMoves(previous.moves);setCascadePulse(previous.cascadePulse);
    setUndoUsed(true);setUndoReady(false);setSelected(null);setHint(null);setTool(null);setConfirmQuit(false);setResonatorHelp(false);setResonatorFx([]);setBlastFx(null);setMoving(null);setFalling([]);setCleared([]);
    setMessage(msg('undo.restored'));setUndoNotice('restored');
    requestAnimationFrame(()=>dialog.current?.querySelector('.board button:not(:disabled)')?.focus({preventScroll:true}));
  }
  const [tool,setTool]=useState(null);
  const helpers=[['⌖','Laser','Select one tile.'],['⤨','Shuffle','Shuffle the board.'],['⇄','Swap','Select two adjacent uncovered tiles.'],['➜','Beam','Select a row to clear.'],['✺','EMP','Select the centre of a 3×3 blast.']];
  const resultPanel=useRef(null);
  const dialog = useRef(null);
  const quitPanel=useRef(null),quitOpener=useRef(null);
  useEffect(()=>{
    if(confirmQuit){quitOpener.current??=document.activeElement;quitPanel.current?.querySelector('.keep-playing')?.focus({preventScroll:true});}
    else if(quitOpener.current?.isConnected){quitOpener.current.focus({preventScroll:true});quitOpener.current=null;}
  },[confirmQuit]);
  const lock = useRef(false);
  const alive = useRef(true);
  const pointer = useRef(null);
  const suppressClick = useRef(false);
  // Keep the board visible until the entire cascade and its animations settle.
  const won = goalsComplete(goals, counts) && resonatorsComplete(resonators,resonance) && ice.length===0 && !busy && !fault;
  const exhausted=moves>=limit&&!won&&!busy&&!fault;
  useEffect(()=>{if(playtest&&!recorded.current)playtest.onSnapshot(attemptSnapshot(won?'won':fault?'fault':'quit'));},[moves,busy,counts,ice,resonance,won,fault,hintsLeft]);
  useEffect(()=>{if(playtest&&fault)recordResult('fault');},[fault]);
  usePuzzleFit(dialog,admitted&&!won&&!fault&&!exhausted,level.cols,level.rows);
  useEffect(()=>{const active=admitted&&!fault&&!won&&!exhausted&&!tutorial&&!confirmQuit;reportGameplay(active);return()=>reportGameplay(false);},[admitted,fault,won,exhausted,tutorial,confirmQuit]);
  useEffect(()=>{if(won)lives.settleAttempt(attemptId.current,true);},[won]);
  // A completed replay earns its better rating even if the result is closed or reloaded.
  // First completions still award together with onWin; blind tests never change progress.
  const savedStars=stars[repair.id];
  useEffect(()=>{
    if(won&&!playtest&&savedStars&&earnedStars(moveBudget(repair),moves)>savedStars)
      award(repair.id,moveBudget(repair),moves);
  },[won,playtest,savedStars,repair,moves,award]);
  useEffect(()=>{if(exhausted&&(!playtest||undoUsed||!turnUndo.current.available))recordResult("exhausted",false);if(exhausted&&!spent.current){spent.current=true;lives.settleAttempt(attemptId.current);}},[exhausted,undoUsed]);
  useEffect(()=>{if(exhausted||won||fault){dialog.current?.scrollTo({top:0});resultPanel.current?.focus({preventScroll:true});}},[exhausted,won,fault]);
  function showHint(){
    if(tutorial||lock.current||busy||exhausted||won||fault||!admitted||hintsLeft<=0||hint)return;
    const next=iceMove(board,level.cols,ice);
    if(!next)return;
    assistance.current.hints++;setHint(next);setHintsLeft(n=>n-1);setMessage('Swap the glowing pieces, or tap a glowing charge to activate it.');
  }
  function leave(){recordResult("quit");lives.settleAttempt(attemptId.current,won||fault);onQuit();}
  function failSafely(){
    turnUndo.current.invalidate();setUndoReady(false);setUndoNotice('');
    lives.settleAttempt(attemptId.current,true);
    run.current++;clearInterval(watchdog.current);lock.current=false;
    setCascadePulse(null);setResonatorFx([]);setShuffling(false);setBlastFx(null);setFault(true);setBusy(false);setMoving(null);setFalling([]);setCleared([]);setSelected(null);setHint(null);setConfirmQuit(false);
  }
  function retry(){
    if(!fault&&!lives.count)return;
    try{
      turnUndo.current.reset();setUndoReady(false);setUndoUsed(false);undoCreditRef.current=false;setUndoCredit(false);setUndoNotice('');
      const fresh=makeGoalBoard(level,goals,initialIce(repair),turnRandom.current.next);
      refillHistory.current={};
      recordResult(fault?"fault":"failed");recorded.current=false;attemptId.current=crypto.randomUUID();attemptStarted.current=Date.now();if(!playtest&&!crazyGames)trackCampaignAttempt(attemptId.current,repair.id);assistance.current={helpers:[],extraMoves:false,hints:0};setAdsUsed({moves:false,hint:false,helper:false});
      run.current++;clearInterval(watchdog.current);lock.current=false;spent.current=false;
      setCascadePulse(null);setResonatorFx([]);setShuffling(false);setBlastFx(null);setFault(false);setBusy(false);setAdmitted(true);setBoard(fresh);setIce(initialIce(repair));setCounts(goals.map(()=>0));setMoves(0);setExtraMoves(0);setResonance(resonators.map(()=>0));setSelected(null);setHint(boosts?null:iceMove(fresh,level.cols,initialIce(repair)));setHintsLeft(1);setTool(null);setConfirmQuit(false);setMessage('A fresh attempt. You can do this.');
    }catch{failSafely();}
  }
  useEffect(() => { alive.current = true; dialog.current.showModal(); return () => { alive.current = false;run.current++;clearInterval(watchdog.current); }; }, []);
  const wait = ms => new Promise(resolve => setTimeout(resolve, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ms));

  async function animateShuffle(next,token){
    setSelected(null);setHint(null);setShuffling(true);sound('shuffle');
    // Keep the message readable even when motion is disabled.
    await new Promise(resolve=>setTimeout(resolve,750));
    if(!alive.current||token!==run.current)return false;
    setBoard(next);
    await new Promise(resolve=>setTimeout(resolve,750));
    if(!alive.current||token!==run.current)return false;
    setShuffling(false);return true;
  }

  async function play(a, b, helper=null) {
    if(tutorial)return;
    const activation=helper==null&&a===b&&isBooster(board[a]);
    if (resonatorHelp || fault || board[a] == null || board[b] == null || lock.current || !admitted || won || moves>=limit || (helper==null&&(ice.includes(a)||ice.includes(b)))|| (helper==null&&!activation && !adjacent(a, b, level.cols))) return;
    if(helper!=null&&(!toolsLeft[helper]||(helper===2&&(ice.includes(a)||ice.includes(b)||!adjacent(a,b,level.cols)||a===b))))return;
    if(activation&&!seenTutorials.current.has(board[a]===11?'nova':'pulse')){setTutorialQueue([board[a]===11?'nova':'pulse']);return;}
    // Reserve before the first animation/await, including a charge activation.
    // Invalid swaps and helpers do not spend a move and need no reservation.
    const swapHit=helper==null&&!activation?swapMatches(board,a,b,level.cols,ice):[];
    if(helper==null&&(activation||swapHit.length)&&!lives.reserveAttempt(attemptId.current)){failSafely();return;}
    if(helper==null&&(activation||swapHit.length)){
      turnUndo.current.capture({board,ice,counts,resonance,moves,cascadePulse,refillHistory:refillHistory.current});setUndoReady(false);
    }
    const token=++run.current;
    const createdBoosts=new Set();let completedAction=false;
    let activeTicks=0;
    watchdog.current=setInterval(()=>{if(!document.hidden && ++activeTicks>=60 && token===run.current)failSafely();},1000);
    try{
    setCascadePulse(null);sound('swap'); lock.current = true; setBusy(true); setSelected(null); setHint(null); setMoving(helper!=null||activation?null:[a, b]);
    await wait(220); if (!alive.current || token!==run.current) return;
    let frozen=[...ice];
    let next=helper===2?swap(board,a,b):helper!=null||activation?[...board]:swap(board,a,b);
    let toolHit=null;
    if(helper===1){
      const indices=next.map((v,i)=>v!=null&&!frozen.includes(i)?i:null).filter(i=>i!=null);
      let shuffled=false;
      for(let attempt=0;attempt<128;attempt++){
        const values=indices.map(i=>board[i]);
        for(let j=values.length-1;j>0;j--){const k=Math.floor(turnRandom.current.next()*(j+1));[values[j],values[k]]=[values[k],values[j]];}
        indices.forEach((i,j)=>next[i]=values[j]);
        if(!iceMatches(next,level.cols,frozen).length&&iceMove(next,level.cols,frozen)){shuffled=true;break;}
      }
      if(!shuffled){setMoving(null);return;}
    }else if(helper!=null&&helper!==2){
      toolHit=next.flatMap((v,i)=>v!=null&&(helper===0?i===a:helper===3?Math.floor(i/level.cols)===Math.floor(a/level.cols):Math.abs(i%level.cols-a%level.cols)<=1&&Math.abs(Math.floor(i/level.cols)-Math.floor(a/level.cols))<=1)?[i]:[]);
      toolHit=[...new Set([...toolHit,...blast(next,level.cols,toolHit.filter(i=>isBooster(next[i])))])];
    }
    let found=toolHit??(activation?[a]:helper==null?swapHit:iceMatches(next,level.cols,frozen));
    if(helper!=null){if(!await consumeTool(helper)){setMoving(null);setTool(null);return;}if(!alive.current||token!==run.current)return;turnUndo.current.invalidate();setUndoReady(false);if(undoCreditRef.current)setUndoNotice('waiting');assistance.current.helpers.push(helpers[helper][1]);if(helper!==1)sound(["laser","shuffle","tool-swap","beam","emp"][helper]);setTool(null);if(helper===1&&!await animateShuffle(next,token))return;}
    if (!found.length&&helper==null) { sound('invalid');
      setMoving(null); setMessage('Almost! A swap needs to make a line of 3 matching pieces.');
      await wait(220); if (!alive.current || token!==run.current) return;
    } else {
      setBoard(next); setMoving(null); setMoves(n => n + (helper==null?1:0));
      if(playtest&&helper==null){if(activation)assistance.current.chargeActivations=(assistance.current.chargeActivations??0)+1;else if(isBooster(board[a])||isBooster(board[b]))assistance.current.chargeSwaps=(assistance.current.chargeSwaps??0)+1;}
      let totals = [...counts]; let cascades = 0,cascadeMatches=0,lastCascade=[];let charged=[...resonance];
      while (found.length) {
        if(cascades>=40)throw new Error('Cascade safety limit');
        const naturalMatch=(activation||toolHit)&&cascades===0?[]:iceMatches(next,level.cols,frozen);
        if(cascades>0&&naturalMatch.length){cascadeMatches++;lastCascade=naturalMatch;}
        const previousCharge=charged;
        charged=chargeResonators(resonators,charged,naturalMatch,level.cols,next);setResonance(charged);
        const impulses=resonators.flatMap((r,i)=>charged[i]>previousCharge[i]?[{at:r.at,amount:charged[i]-previousCharge[i],from:naturalMatch.filter(cell=>adjacent(cell,r.at,level.cols))}]:[]);
        if(impulses.length){
          setResonatorFx(impulses);
          await new Promise(resolve=>setTimeout(resolve,900));
          if(!alive.current||token!==run.current)return;
          setResonatorFx([]);
        }
        const resolved=wave(next,frozen,level,{enabled:boosts,activate:activation&&cascades===0?a:null,preferred:cascades===0?[b,a]:[],hit:cascades===0?toolHit:null,refillRandom:collected=>goalRefillRandom(level,goals,collectGoals(goals,totals,next,collected),next,frozen,collected,refillHistory.current,turnRandom.current.next)});
        found=resolved.hit;
        resolved.created.forEach(r=>createdBoosts.add(r.type===11?'nova':'pulse'));
        if(playtest)assistance.current.chargesCreated=(assistance.current.chargesCreated??0)+resolved.created.length;
        const detonations=activation&&cascades===0?found.filter(i=>isBooster(next[i])).map(i=>({i,type:next[i]})):[];
        setBlastFx(detonations.length?{detonations,hit:found}:null);
        if(detonations.length)sound(detonations.some(d=>d.type===11)?'nova':'pulse');
        else if(!(toolHit&&cascades===0))sound('match', cascades); setCleared(found.filter(i=>!frozen.includes(i)&&!resolved.created.some(r=>r.at===i)));  setMessage(resolved.created.length ? 'Charge created! Tap it to blast pieces and protective covers.' : activation&&cascades===0 ? 'Charge fired! Nearby charges chain for free.' : cascades ? 'Chain reaction! Falling pieces can make new matches.' : 'Nice match! Check the objective to see which pieces count.');
        await wait(detonations.length?620:320); if (!alive.current || token!==run.current) return;
        totals = collectGoals(goals, totals, next, resolved.collected); setCounts(totals);
        // Animate the cells at or above a cleared tile in each column.
        const anchors=new Set(resolved.created.map(r=>r.at));
        const affected = next.map((_, i) => i).filter(i => next[i] != null && !anchors.has(i) && found.some(j => j % level.cols === i % level.cols && j >= i && Array.from({length:(j-i)/level.cols+1}, (_,n) => next[i+n*level.cols]).every((value,n) => value != null&&!anchors.has(i+n*level.cols))));
        setBlastFx(null);next=resolved.board;frozen=resolved.ice;setIce(frozen);setBoard(next); setCleared([]); setFalling(affected);
        await wait(260); if (!alive.current || token!==run.current) return;
        setFalling([]);
        found = iceMatches(next, level.cols,frozen); cascades++;
      }
      const finished=goalsComplete(goals,totals)&&resonatorsComplete(resonators,charged)&&!frozen.length;
      const bonus=awardCascadePulse(next,frozen,{cascades:cascadeMatches,enabled:boosts&&helper==null&&!finished,preferred:lastCascade});
      if(bonus.at!=null){
        next=bonus.board;setBoard(next);setCascadePulse(bonus.at);createdBoosts.add('cascade');sound('match',3);
        setMessage('Cascade bonus! A Pulse charge is ready.');
        assistance.current.cascadePulses=(assistance.current.cascadePulses??0)+1;
        if(playtest)assistance.current.chargesCreated=(assistance.current.chargesCreated??0)+1;
      }
      if (finished) sound('win');
      if (!goalsComplete(goals, totals) || !resonatorsComplete(resonators,charged) || frozen.length) {
        const recovery=ensurePlayableBoard(next,level,frozen,turnRandom.current.next);
        if(recovery.reshuffled){
          next=recovery.board;
          if(!await animateShuffle(next,token))return;
          setMessage('No possible matches. Board refreshed — no extra move or energy used.');
        }
      }
      completedAction=true;
      assistance.current.actions=(assistance.current.actions??0)+1;
    }
    }catch{if(alive.current && token===run.current)failSafely();}
    finally{if(token===run.current){clearInterval(watchdog.current);lock.current=false;if(alive.current){setShuffling(false);setBusy(false);setUndoReady(turnUndo.current.available);if(undoCreditRef.current&&turnUndo.current.available)setUndoNotice('prepared');if(completedAction)explainBoosts([...createdBoosts]);}}}

  }
  function choose(i) {
    if(tutorial)return;
    if (suppressClick.current) { suppressClick.current = false; return; }
    if (fault || busy || won || exhausted) return;
    if(tool!=null){if(tool===2){if(ice.includes(i))return;if(selected==null||!adjacent(selected,i,level.cols)){setSelected(i);return;}play(selected,i,tool);}else play(i,i,tool);return;}
    if(ice.includes(i))return;
    if(selected!=null&&adjacent(selected,i,level.cols)){play(selected,i);return;}
    if(isBooster(board[i])){play(i,i);return;}
    sound('select');
    if (selected === i) setSelected(null);
    else setSelected(i);
  }
  function endSwipe(event) {
    if(tool!=null){pointer.current=null;return;}
    const start = pointer.current; pointer.current = null;
    if (!start) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    suppressClick.current = true;
    const target = start.i + (Math.abs(dx) > Math.abs(dy) ? Math.sign(dx) : Math.sign(dy) * level.cols);
    if (target >= 0 && target < board.length && adjacent(start.i, target, level.cols)) play(start.i, target);
  }
  function tileStyle(i) {
    if (!moving?.includes(i)) return {};
    const j = moving[0] === i ? moving[1] : moving[0];
    return { transform: `translate(${(j % level.cols - i % level.cols) * 100}%, ${(Math.floor(j / level.cols) - Math.floor(i / level.cols)) * 100}%)`, zIndex: 2 };
  }
  const undoAvailable=undoCredit||Boolean(playtest);
  const undoControl=<button className={`undo-control${undoAvailable&&!undoUsed&&undoReady?' undo-prepared':''}`} data-undo-state={undoUsed?'used':undoAvailable?'ready':'ad'} aria-label={msg(undoUsed?'undo.used':undoAvailable?'undo.apply':'undo.label')} title={msg(undoUsed?'undo.used':undoAvailable?'undo.applyDescription':'undo.description')} disabled={tutorial||busy||confirmQuit||won||fault||!admitted||undoUsed||!undoReady||(!undoAvailable&&!rewardAvailable('undo'))} onClick={requestUndo}><span className="undo-art" aria-hidden="true">↶</span><small>{msg('undo.short')}</small><b className="helper-badge">{undoUsed?'0':undoAvailable?'1':crazyGames?'+':'AD'}</b></button>;
  return createPortal(<dialog className={`mini-dialog ${exhausted||won||fault||!admitted?'mini-result':''}`} ref={dialog} aria-labelledby="level-title" onCancel={event => { event.preventDefault(); if(tutorial){dismissTutorial();return;}if (!busy){quitOpener.current=document.activeElement;setConfirmQuit(true);} }}>
    {undoNotice&&!won&&!fault&&<p className="undo-notice" role="status">{msg(`undo.${undoNotice}`)}</p>}
    {tutorial&&!fault&&admitted&&<MechanicTutorial topic={tutorial} language={language} remaining={tutorialQueue.length} onNext={dismissTutorial} onClose={()=>{dismissTutorial();setTutorialQueue([]);}} onTopic={id=>setTutorialQueue([id])} topics={[...topics,...helperTutorials]}/>}
    <div className="level-hud"><div className="energy-audio"><LivesBar/><AudioControls/></div><button className="hint-control" aria-description={android&&!hintsLeft?msg("android.hintUsed"):t(hintsLeft?"One free hint per attempt":crazyGames?"Extra hint":"Ad · extra hint")} title={android&&!hintsLeft?msg("android.hintUsed"):t(hintsLeft?"One free hint per attempt":crazyGames?"Extra hint":"Ad · extra hint")} disabled={busy||exhausted||won||fault||!admitted||(playtest&&hintsLeft===0)||(hintsLeft===0&&(adsUsed.hint||!rewardAvailable("hint")))||Boolean(hint)} onClick={()=>hintsLeft?showHint():requestHelp("hint")}><span>{t("Hint")}</span>{" "}<small>{t(hintsLeft?'1/1':playtest?'0':(adsUsed.hint||!rewardAvailable('hint'))?'0':crazyGames?'+':'AD')}</small></button><div className={`moves-counter ${limit-moves<=5?'low-moves':''}`} role="status" aria-label={t(`${Math.max(0,limit-moves)} moves left`)}><span>{t("MOVES")}</span><strong>{t(Math.max(0,limit-moves))}</strong></div></div>
    <div className="mini-header"><button className="mechanics-help" disabled={busy||exhausted||won||fault||!admitted} aria-label={language==='cs'?'Pravidla a pomůcky':'Mechanics help'} onClick={()=>{setResonatorHelp(false);setTutorialQueue(topics);}}>ⓘ</button><span className="eyebrow">{t(repair.room ?? 'COCKPIT')}{t(" / REPAIR LESSON")}</span><button className="close" aria-label={t("Leave level")} disabled={busy} onClick={e => {quitOpener.current=e.currentTarget;setConfirmQuit(true);}}>{t("×")}</button><h2 id="level-title">{t(repair.lesson)}</h2></div>
    <div className="objective-list" style={{"--goal-count":goals.length+(initialIce(repair).length?1:0)+(resonators.length?1:0)}}>{t(goals.map((goal,i)=><div className="charge" key={i}><span>{t(goal.type!=null&&<img className="objective-icon" src={`./tiles/${sprites[goal.type]}.png`} alt={t("")}/>)}</span><strong translate="no" aria-live="polite" aria-atomic="true">{`${counts[i] ?? 0} / ${goal.target}`}</strong><progress aria-label={t(goal.label)} max={goal.target} value={counts[i]}/></div>))}{resonators.length>0&&<div className="charge" title={t('Match beside each ring to charge it. Blasts do not charge rings.')}><button className="resonator-help-button" aria-label={t('Charge the ring')} onClick={()=>setResonatorHelp(v=>!v)}>◎ ?</button><strong>{resonance.reduce((a,b)=>a+b,0)} / {resonators.reduce((a,r)=>a+r.target,0)}</strong><progress aria-label={t('Resonators')} value={resonance.reduce((a,b)=>a+b,0)} max={resonators.reduce((a,r)=>a+r.target,0)}/></div>}{initialIce(repair).length>0&&<div className="charge" title={t('Protective covers')}><span><i className="cover-objective-icon" aria-hidden="true"/></span><strong translate="no">{initialIce(repair).length-ice.length} / {initialIce(repair).length}</strong><progress aria-label={t('Protective covers')} max={initialIce(repair).length} value={initialIce(repair).length-ice.length}/></div>}</div>

    {t(exhausted&&(playtest?<div className="out-of-moves" ref={resultPanel} tabIndex={-1} role="region" aria-label={t('Out of moves')}><h3>{t('Out of moves')}</h3>{undoControl}<button className="primary" onClick={()=>recordResult('exhausted')}>{t(repair.action)}</button></div>:<div className="out-of-moves" ref={resultPanel} tabIndex={-1} role="region" aria-label={t("Out of moves")}><h3>{t("Out of moves")}</h3><p>{t("Your repairs are safe. Try again or continue this attempt.")}</p><button className="primary" disabled={adsUsed.moves} onClick={()=>requestHelp('moves')}>{t(adsUsed.moves?'Extra moves used':crazyGames?'+5 moves · free':'Ad · +5 moves')}</button>{undoControl}<button className="keep-playing" disabled={!lives.count} onClick={retry}>{t("Retry level")}</button><button className="keep-playing" onClick={()=>{recordResult(fault?"fault":"failed");onQuit();}}>{t("Back to exploration")}</button>{t(!lives.count&&<NoLives/>)}</div>))}
    {t(fault ? <div className="out-of-moves" ref={resultPanel} tabIndex={-1} role="alert"><h3>{t("Board recovery needed")}</h3><p>{t("This puzzle could not continue safely. No energy was charged for this interrupted attempt.")}</p><button className="primary" onClick={retry}>{t("Restart level · free")}</button><button className="keep-playing" onClick={()=>{recordResult(fault?"fault":"failed");onQuit();}}>{t("Back to exploration")}</button></div> : !admitted ? <><NoLives/>{t(lives.count>0&&<button className="primary" onClick={()=>setAdmitted(true)}>{t("Start level")}</button>)}</> : !won ? <div className="puzzle-area" hidden={exhausted} style={{"--ratio":level.cols/level.rows,"--rows":level.rows}}>
      <div className={`board ${blastFx?'board-blasting':''} ${shuffling?'board-shuffling':''}`} style={{ '--cols': level.cols }} aria-label={t("Match three board")} aria-busy={busy}>
        {resonatorHelp&&<div className="resonator-guide" role="note"><strong>{t('Charge the ring')}</strong><p>{t("Match at least 3 identical pieces so that one touches the ring above, below, left or right. Each separate match adds +1 per ring, even in the same wave. Blasts do not count.")}</p><button className="primary" onClick={()=>setResonatorHelp(false)}>{t('Got it')}</button></div>}
        {resonatorFx.length>0&&<svg className="resonator-impulses" viewBox={`0 0 ${level.cols*100} ${level.rows*100}`} aria-hidden="true">{resonatorFx.map(r=><g key={r.at}>{r.from.map(i=><line key={i} x1={i%level.cols*100+50} y1={Math.floor(i/level.cols)*100+50} x2={r.at%level.cols*100+50} y2={Math.floor(r.at/level.cols)*100+50}/>)}<circle cx={r.at%level.cols*100+50} cy={Math.floor(r.at/level.cols)*100+50} r="45"/><text x={r.at%level.cols*100+50} y={Math.floor(r.at/level.cols)*100+15} textAnchor="middle">+{r.amount}</text></g>)}</svg>}
        {resonatorFx.length>0&&<span className="resonator-feedback" role="status">{(language==='cs'?'Nabití kruhu: ':'Ring charge: ')+resonatorFx.map(r=>'+'+r.amount).join(' / ')}</span>}
        {cascadePulse!=null&&<span className="resonator-feedback cascade-reward" role="status">{language==='cs'?'3 kaskády · Pulse navíc!':'3 cascades · Bonus Pulse!'}</span>}
        {shuffling&&<div className="shuffle-overlay" role="status" aria-live="polite"><span aria-hidden="true">⤨</span><strong>{t('Shuffling…')}</strong><small>{t('Preparing your next move')}</small></div>}
        {t(board.map((type, i) => type == null ? resonators.some(r=>r.at===i)?<span key={i} className={'resonator-cell '+((resonance[resonators.findIndex(r=>r.at===i)]??0)>=resonators.find(r=>r.at===i).target?'resonator-ready':'')} role="img" aria-label={t('Resonators')+' '+(resonance[resonators.findIndex(r=>r.at===i)]??0)+'/'+resonators.find(r=>r.at===i).target}><span aria-hidden="true">◎</span><small>{resonance[resonators.findIndex(r=>r.at===i)]??0}/{resonators.find(r=>r.at===i).target}</small></span>:<span key={i} className="board-hole" aria-hidden="true"/> : <button key={i} data-cell={i} data-type={type} data-booster={isBooster(type)?(type===10?"pulse":"nova"):undefined} data-hint={hint?.includes(i) || undefined} className={`cell ${cascadePulse===i?"cascade-pulse-cell":""} ${resonators.some((r,n)=>resonance[n]<r.target&&adjacent(i,r.at,level.cols))?'resonator-neighbour':''} ${ice.includes(i)?'frozen-cell':''} ${selected === i ? 'selected' : ''} ${hint?.includes(i) ? 'hinted' : ''}`} disabled={resonatorHelp || busy || confirmQuit || exhausted || (ice.includes(i)&&(tool==null||tool===2))} aria-label={t(`${ice.includes(i)?'Covered ':''}${type===10?'Pulse charge':type===11?'Nova cross':names[type]}, row ${Math.floor(i / level.cols) + 1}, column ${i % level.cols + 1}`)} aria-pressed={selected === i} onClick={() => choose(i)} onPointerDown={e => { suppressClick.current = false; pointer.current = { i, x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerUp={endSwipe} onPointerCancel={() => {pointer.current = null;}}>
          <span style={tileStyle(i)} className={`gem gem-${type} ${cleared.includes(i) ? 'clearing' : ''} ${falling.includes(i) ? 'falling' : ''}`}><>{t(isBooster(type)?<span className={`booster-art booster-${type}`} aria-hidden="true">{t(type===10?"✹":"✣")}</span>:<img src={`./tiles/${sprites[type]}.png`} alt={t("")} draggable="false"/>)}</></span>
        </button>))}
        {t(blastFx&&<svg className="blast-overlay" viewBox={`0 0 ${level.cols*100} ${level.rows*100}`} preserveAspectRatio="none" aria-hidden="true">
          {t(blastFx.hit.map(i=><rect key={i} className="blast-impact" x={i%level.cols*100+5} y={Math.floor(i/level.cols)*100+5} width="90" height="90" rx="15"/>))}
          {t(blastFx.detonations.map(({i,type})=>{const x=i%level.cols*100+50,y=Math.floor(i/level.cols)*100+50;return <g key={i} className={type===10?'pulse-burst':'nova-burst'}>
            {t(type===10?<><circle className="blast-ring" cx={x} cy={y} r="142"/><circle className="blast-ring blast-ring-inner" cx={x} cy={y} r="95"/></>:<><path className="nova-beam" d={`M 0 ${y} H ${level.cols*100} M ${x} 0 V ${level.rows*100}`}/><path className="nova-core" d={`M 0 ${y} H ${level.cols*100} M ${x} 0 V ${level.rows*100}`}/></>)}
            <circle className="blast-flare" cx={x} cy={y} r="43"/>
            {t(Array.from({length:8},(_,n)=>{const a=n*Math.PI/4;return <line key={n} className="blast-spark" x1={x+Math.cos(a)*35} y1={y+Math.sin(a)*35} x2={x+Math.cos(a)*125} y2={y+Math.sin(a)*125}/>;}))}
          </g>;}))}
        </svg>)}
      </div>

    </div> : <div className="win-panel" ref={resultPanel} tabIndex={-1}><p className="stars-optional">{language==='cs'?'K postupu stačí výhra. Tři hvězdy jsou dobrovolná výzva.':'Winning is enough to progress. Three stars are an optional challenge.'}</p><p className="replay-tip">{language==='cs'?'Znovu hrát: otevři ☰ Kapitoly, navštiv místnost a klepni na dokončenou opravu ✓.':'To replay: open ☰ Chapters, visit a room and tap a completed repair ✓.'}</p><Stars hero value={earnedStars(moveBudget(repair),moves)}/><p className="rating-note">{language==='cs'?'Nejlepší výsledek':'Best result'}: <Stars value={Math.max(stars[repair.id]??0,earnedStars(moveBudget(repair),moves))}/><br/>{language==='cs'?'Hvězdy závisí na zbývajících tazích z původního limitu; bonusové tahy se nepočítají.':'Stars are based on moves left from the original limit; bonus moves do not count.'}</p><h3>{t("Objective complete.")}</h3><p>{t("You have completed the objective.")}<br/>{t("Continue your journey.")}</p><button className="primary" disabled={busy} onClick={()=>{recordResult("won");award(repair.id,moveBudget(repair),moves);onWin();}}>{t(repair.action)} <span>{t("→")}</span></button></div>)}
    {!fault&&!won&&!exhausted&&admitted&&<div className="helper-panel">
      <div className="helper-prompt" role="status">{tool!=null?<>{t(helpers[tool][2])}<button onClick={()=>{setTool(null);setSelected(null);}}>{t('Cancel')}</button></>:null}</div>
      <div className="helper-bar">{helpers.map(([icon,name],i)=><button key={name} className={`helper-tile helper-type-${i} ${toolsLeft[i]?"in-stock":"empty-stock"}`} aria-description={t(helpers[i][2])} aria-pressed={tool===i} disabled={busy||confirmQuit||(!toolsLeft[i]&&(adsUsed.helper||!rewardAvailable("helper")))} onClick={()=>{if(!toolsLeft[i]){requestHelp("helper",i);return;}if(!seenTutorials.current.has(helperTutorials[i])){setTool(null);setSelected(null);setTutorialQueue([helperTutorials[i]]);return;}setSelected(null);setHint(null);if(i===1)play(board.findIndex(v=>v!=null),board.findIndex(v=>v!=null),i);else setTool(tool===i?null:i);}}><span className="helper-art"><HelperIcon index={i}/></span><small>{t(name)}</small>{" "}<b className="helper-badge">{toolsLeft[i]||(!adsUsed.helper&&rewardAvailable("helper")?<><svg viewBox="0 0 12 12" aria-hidden="true"><path d="m4 2 6 4-6 4z" fill="currentColor"/></svg>{t(crazyGames?'+':'AD')}</>:"0")}</b></button>)}{undoControl}</div>
    </div>}
    {t(import.meta.env.DEV&&!playtest&&!fault&&!won&&!exhausted&&!confirmQuit&&<button className="preview-complete" disabled={busy} onClick={()=>{if(lock.current)return;lock.current=true;lives.settleAttempt(attemptId.current,true);onWin();}}>{t("✓ Complete level ")}<small>{t("Preview · skip match-3")}</small></button>)}

    {t(confirmQuit && <div className="quit-panel" ref={quitPanel} role="dialog" aria-modal="true" aria-labelledby="quit-title" onKeyDown={e=>{
      if(e.key==='Escape'){e.preventDefault();e.stopPropagation();setConfirmQuit(false);}
      if(e.key==='Tab'){
        const buttons=[...quitPanel.current.querySelectorAll('button')],first=buttons[0],last=buttons.at(-1);
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    }}><h3 id="quit-title">{t("Leave this level?")}</h3><p>{t("Leaving after a move uses one energy charge. Completed repairs stay safe.")}</p><button className="primary" onClick={leave}>{t("Leave level")}</button><button className="keep-playing" onClick={() => setConfirmQuit(false)}>{t("Keep playing")}</button></div>)}
  </dialog>,document.body);
}
