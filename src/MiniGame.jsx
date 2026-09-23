import React, { useEffect, useRef, useState } from 'react';
import { adjacent, swap } from './match3';

import {moveBudget,initialIce,iceMatches,iceMove,makeIceBoard,ensurePlayableBoard} from './levelRules.js';
import {useLives,LivesBar,NoLives} from './Lives.jsx';
import AudioControls from './AudioControls.jsx';
import { sound } from './audio.js';
import {goalsFor,collectGoals,goalsComplete} from './objectives.js';
import {isBooster,boostersEnabled,wave} from './boosters.js';
const names = ['Fuel cell', 'Energy crystal', 'Blue comet', 'Asteroid', 'Star', 'Energy orb'];
const sprites = ['fuel', 'crystal', 'comet', 'asteroid', 'star', 'orb'];

export default function MiniGame({ onWin, onQuit, repair }) {
  const level = repair.level;
  const goals = goalsFor(repair);
  const boosts = boostersEnabled(repair);
  const lives=useLives();
  const spent=useRef(false);
  const [admitted,setAdmitted]=useState(()=>lives.count>0);
  const [ice,setIce]=useState(()=>initialIce(repair));
  const [extraMoves,setExtraMoves]=useState(0);
  const limit=moveBudget(repair)+extraMoves;
  const [initial] = useState(()=>{try{return {board:makeIceBoard(level,initialIce(repair)),failed:false};}catch{return {board:[],failed:true};}});
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
  const [message, setMessage] = useState('Tap one glowing piece, then the other to swap them.');
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [hint, setHint] = useState(() => iceMove(board, level.cols,ice));
  const dialog = useRef(null);
  const lock = useRef(false);
  const alive = useRef(true);
  const pointer = useRef(null);
  const suppressClick = useRef(false);
  // Keep the board visible until the entire cascade and its animations settle.
  const won = goalsComplete(goals, counts) && ice.length===0 && !busy && !fault;
  const exhausted=moves>=limit&&!won&&!busy&&!fault;
  useEffect(()=>{if(exhausted&&!spent.current){spent.current=true;lives.spend();}},[exhausted]);
  function leave(){if(moves>0&&!won&&!fault&&!spent.current){spent.current=true;lives.spend();}onQuit();}
  function failSafely(){
    run.current++;clearInterval(watchdog.current);lock.current=false;
    setBlastFx(null);setFault(true);setBusy(false);setMoving(null);setFalling([]);setCleared([]);setSelected(null);setHint(null);setConfirmQuit(false);
  }
  function retry(){
    if(!fault&&!lives.count)return;
    try{
      const fresh=makeIceBoard(level,initialIce(repair));
      run.current++;clearInterval(watchdog.current);lock.current=false;spent.current=false;
      setBlastFx(null);setFault(false);setBusy(false);setAdmitted(true);setBoard(fresh);setIce(initialIce(repair));setCounts(goals.map(()=>0));setMoves(0);setExtraMoves(0);setSelected(null);setHint(iceMove(fresh,level.cols,initialIce(repair)));setConfirmQuit(false);setMessage('A fresh attempt. You can do this.');
    }catch{failSafely();}
  }
  useEffect(() => { alive.current = true; dialog.current.showModal(); return () => { alive.current = false;run.current++;clearInterval(watchdog.current); }; }, []);
  const wait = ms => new Promise(resolve => setTimeout(resolve, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ms));

  async function play(a, b) {
    const activation=a===b&&isBooster(board[a]);
    if (fault || board[a] == null || board[b] == null || lock.current || !admitted || won || moves>=limit || ice.includes(a)||ice.includes(b)|| (!activation && (!adjacent(a, b, level.cols)||isBooster(board[a])||isBooster(board[b])))) return;
    const token=++run.current;
    let activeTicks=0;
    watchdog.current=setInterval(()=>{if(!document.hidden && ++activeTicks>=60 && token===run.current)failSafely();},1000);
    try{
    sound('swap'); lock.current = true; setBusy(true); setSelected(null); setHint(null); setMoving(activation?null:[a, b]);
    await wait(220); if (!alive.current || token!==run.current) return;
    let frozen=[...ice];
    let next = activation?[...board]:swap(board, a, b); let found = activation?[a]:iceMatches(next, level.cols,frozen);
    if (!found.length) { sound('invalid');
      setMoving(null); setMessage('Almost! A swap needs to make a line of 3 matching pieces.');
      await wait(220); if (!alive.current || token!==run.current) return;
    } else {
      setBoard(next); setMoving(null); setMoves(n => n + 1);
      let totals = [...counts]; let cascades = 0;
      while (found.length) {
        if(cascades>=40)throw new Error('Cascade safety limit');
        const resolved=wave(next,frozen,level,{enabled:boosts,activate:activation&&cascades===0?a:null,preferred:cascades===0?[b,a]:[]});
        found=resolved.hit;
        const detonations=activation&&cascades===0?found.filter(i=>isBooster(next[i])).map(i=>({i,type:next[i]})):[];
        setBlastFx(detonations.length?{detonations,hit:found}:null);
        sound('match', cascades); setCleared(found.filter(i=>!frozen.includes(i)&&!resolved.created.some(r=>r.at===i)));  setMessage(resolved.created.length ? 'Charge created! Tap it to blast pieces and protective covers.' : activation&&cascades===0 ? 'Charge fired! Nearby charges chain for free.' : cascades ? 'Chain reaction! Falling pieces can make new matches.' : 'Nice match! Check the objective to see which pieces count.');
        await wait(detonations.length?620:320); if (!alive.current || token!==run.current) return;
        totals = collectGoals(goals, totals, next, resolved.collected); setCounts(totals);
        // Animate the cells at or above a cleared tile in each column.
        const affected = next.map((_, i) => i).filter(i => next[i] != null && found.some(j => j % level.cols === i % level.cols && j >= i && Array.from({length:(j-i)/level.cols+1}, (_,n) => next[i+n*level.cols]).every(value => value != null)));
        setBlastFx(null);next=resolved.board;frozen=resolved.ice;setIce(frozen);setBoard(next); setCleared([]); setFalling(affected);
        await wait(260); if (!alive.current || token!==run.current) return;
        setFalling([]);
        found = iceMatches(next, level.cols,frozen); cascades++;
      }
      if (goalsComplete(goals, totals) && !frozen.length) sound('win');
      if ((!goalsComplete(goals, totals) || frozen.length) && moves+1<limit) {
        if(!iceMove(next,level.cols,frozen)){
          setMessage('Recalibrating board…');
          await wait(650);if(!alive.current || token!==run.current)return;
        }
        const recovery=ensurePlayableBoard(next,level,frozen);
        if(recovery.reshuffled){next=recovery.board;setBoard(next);setMessage('No possible matches. Board refreshed — no extra move or energy used.');}
      }
    }
    }catch{if(alive.current && token===run.current)failSafely();}
    finally{if(token===run.current){clearInterval(watchdog.current);lock.current=false;if(alive.current)setBusy(false);}}

  }
  function choose(i) {
    if (suppressClick.current) { suppressClick.current = false; return; }
    if (fault || busy || won || exhausted || ice.includes(i)) return;
    if(isBooster(board[i])){play(i,i);return;}
    sound('select');
    if (selected === i) setSelected(null);
    else if (selected != null && adjacent(selected, i, level.cols)) play(selected, i);
    else setSelected(i);
  }
  function endSwipe(event) {
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
  return <dialog className="mini-dialog" ref={dialog} aria-labelledby="level-title" onCancel={event => { event.preventDefault(); if (!busy) setConfirmQuit(true); }}>
    <div className="mini-header"><span className="eyebrow">{repair.room ?? 'COCKPIT'} / REPAIR LESSON</span><button className="close" aria-label="Leave level" disabled={busy} onClick={() => setConfirmQuit(true)}>×</button><h2 id="level-title">{repair.lesson}</h2><p>{repair.objective}</p>{initialIce(repair).length>0&&<p className="ice-objective">Also break all {initialIce(repair).length} protective covers by including their pieces in matching lines.</p>}</div>
    <div className="objective-list">{goals.map((goal,i)=><div className="charge" key={i}><span>{goal.type!=null&&<img className="objective-icon" src={`./tiles/${sprites[goal.type]}.png`} alt=""/>}{goal.label}</span><strong>{counts[i]} / {goal.target}</strong><progress aria-label={goal.label} max={goal.target} value={counts[i]}/></div>)}</div>
    <div className="level-hud"><LivesBar/><div className={`moves-counter ${limit-moves<=5?'low-moves':''}`} role="status" aria-label={`${Math.max(0,limit-moves)} moves left`}><span>MOVES</span><strong>{Math.max(0,limit-moves)}</strong></div></div>
    {fault ? <div className="out-of-moves" role="alert"><h3>Board recovery needed</h3><p>This puzzle could not continue safely. No energy was charged for this interrupted attempt.</p><button className="primary" onClick={retry}>Restart level · free</button><button className="keep-playing" onClick={onQuit}>Back to ship</button></div> : !admitted ? <><NoLives/>{lives.count>0&&<button className="primary" onClick={()=>setAdmitted(true)}>Start level</button>}</> : !won ? <>
      <div className={`board ${blastFx?'board-blasting':''}`} style={{ '--cols': level.cols }} aria-label="Match three board" aria-busy={busy}>
        {board.map((type, i) => type == null ? <span key={i} className="board-hole" aria-hidden="true"/> : <button key={i} data-cell={i} data-type={type} data-booster={isBooster(type)?(type===10?"pulse":"nova"):undefined} data-hint={hint?.includes(i) || undefined} className={`cell ${ice.includes(i)?'frozen-cell':''} ${selected === i ? 'selected' : ''} ${hint?.includes(i) ? 'hinted' : ''}`} disabled={busy || confirmQuit || exhausted || ice.includes(i)} aria-label={`${ice.includes(i)?'Covered ':''}${type===10?'Pulse charge':type===11?'Nova cross':names[type]}, row ${Math.floor(i / level.cols) + 1}, column ${i % level.cols + 1}`} aria-pressed={selected === i} onClick={() => choose(i)} onPointerDown={e => { suppressClick.current = false; pointer.current = { i, x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerUp={endSwipe} onPointerCancel={() => {pointer.current = null;}}>
          <span style={tileStyle(i)} className={`gem gem-${type} ${cleared.includes(i) ? 'clearing' : ''} ${falling.includes(i) ? 'falling' : ''}`}><>{isBooster(type)?<span className={`booster-art booster-${type}`} aria-hidden="true">{type===10?"✹":"✣"}</span>:<img src={`./tiles/${sprites[type]}.png`} alt="" draggable="false"/>}</></span>
        </button>)}
        {blastFx&&<svg className="blast-overlay" viewBox={`0 0 ${level.cols*100} ${level.rows*100}`} preserveAspectRatio="none" aria-hidden="true">
          {blastFx.hit.map(i=><rect key={i} className="blast-impact" x={i%level.cols*100+5} y={Math.floor(i/level.cols)*100+5} width="90" height="90" rx="15"/>)}
          {blastFx.detonations.map(({i,type})=>{const x=i%level.cols*100+50,y=Math.floor(i/level.cols)*100+50;return <g key={i} className={type===10?'pulse-burst':'nova-burst'}>
            {type===10?<><circle className="blast-ring" cx={x} cy={y} r="142"/><circle className="blast-ring blast-ring-inner" cx={x} cy={y} r="95"/></>:<><path className="nova-beam" d={`M 0 ${y} H ${level.cols*100} M ${x} 0 V ${level.rows*100}`}/><path className="nova-core" d={`M 0 ${y} H ${level.cols*100} M ${x} 0 V ${level.rows*100}`}/></>}
            <circle className="blast-flare" cx={x} cy={y} r="43"/>
            {Array.from({length:8},(_,n)=>{const a=n*Math.PI/4;return <line key={n} className="blast-spark" x1={x+Math.cos(a)*35} y1={y+Math.sin(a)*35} x2={x+Math.cos(a)*125} y2={y+Math.sin(a)*125}/>;})}
          </g>;})}
        </svg>}
      </div>
      {boosts&&<p className="booster-guide">4 in a line or T/L → Pulse (3×3). 5 in a line → Nova (row + column). Tap a charge: 1 move. Blasts break covers and trigger other charges.</p>}
      <p className="lesson" role="status">{message}</p>
      <div className="mini-actions"><span>Only valid swaps use a move</span><button disabled={busy || exhausted} onClick={() => {setHint(iceMove(board, level.cols,ice)); setMessage('Swap the glowing pieces, or tap a glowing charge to activate it.');}}>Show a hint</button></div>
      <p className="gentle">{initialIce(repair).length?`${ice.length} covers left. Line up 3 of the same type through a covered piece to break its cover. Collect it in a later match.`:'Only valid swaps use a move. Cascades are free.'}</p>
    </> : <div className="win-panel"><span className="win-spark">✦</span><h3>Ready to repair.</h3><p>You have completed the objective.<br/>Now bring your ship back to life.</p><button className="primary" disabled={busy} onClick={onWin}>{repair.action} <span>→</span></button></div>}
    {import.meta.env.DEV&&!fault&&!won&&!confirmQuit&&<button className="preview-complete" disabled={busy} onClick={()=>{if(lock.current)return;lock.current=true;onWin();}}>✓ Complete level <small>Preview · skip match-3</small></button>}
    {exhausted&&<div className="out-of-moves" role="region" aria-label="Out of moves"><h3>Out of moves</h3><p>Your repairs are safe. Try again or continue this attempt.</p><button className="primary" disabled={!import.meta.env.DEV} onClick={()=>setExtraMoves(n=>n+5)}>{import.meta.env.DEV?'Preview · +5 moves':'Extra moves · coming soon'}</button><small>{import.meta.env.DEV?'Test shortcut, no purchase':'Rewarded ads and purchases are not connected yet'}</small><button className="keep-playing" disabled={!lives.count} onClick={retry}>Retry level</button>{!lives.count&&<NoLives/>}</div>}
    <AudioControls/>{confirmQuit && <div className="quit-panel"><h3>Back to the ship?</h3><p>Leaving after a move uses one energy charge. Completed repairs stay safe.</p><button className="primary" onClick={leave}>Leave level</button><button className="keep-playing" onClick={() => setConfirmQuit(false)}>Keep playing</button></div>}
  </dialog>;
}
