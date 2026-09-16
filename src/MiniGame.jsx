import React, { useEffect, useRef, useState } from 'react';
import { adjacent, swap, objectiveCount } from './match3';

import {moveBudget,initialIce,iceMatches,iceMove,resolveIce,makeIceBoard} from './levelRules.js';
import {useLives,LivesBar,NoLives} from './Lives.jsx';
import AudioControls from './AudioControls.jsx';
import { sound } from './audio.js';
const names = ['Fuel cell', 'Energy crystal', 'Blue comet', 'Asteroid', 'Star', 'Energy orb'];
const sprites = ['fuel', 'crystal', 'comet', 'asteroid', 'star', 'orb'];

export default function MiniGame({ onWin, onQuit, repair }) {
  const level = repair.level;
  const lives=useLives();
  const spent=useRef(false);
  const [admitted,setAdmitted]=useState(()=>lives.count>0);
  const [ice,setIce]=useState(()=>initialIce(repair));
  const [extraMoves,setExtraMoves]=useState(0);
  const limit=moveBudget(repair)+extraMoves;
  const [board, setBoard] = useState(() => makeIceBoard(level,initialIce(repair)));
  const [selected, setSelected] = useState(null);
  const [cleared, setCleared] = useState([]);
  const [moving, setMoving] = useState(null);
  const [falling, setFalling] = useState([]);
  const [score, setScore] = useState(0);
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
  const won = score >= repair.target && ice.length===0;
  const exhausted=moves>=limit&&!won&&!busy;
  useEffect(()=>{if(exhausted&&!spent.current){spent.current=true;lives.spend();}},[exhausted]);
  function leave(){if(moves>0&&!won&&!spent.current){spent.current=true;lives.spend();}onQuit();}
  function retry(){if(!lives.count)return;spent.current=false;setAdmitted(true);setBoard(makeIceBoard(level,initialIce(repair)));setIce(initialIce(repair));setScore(0);setMoves(0);setExtraMoves(0);setSelected(null);setHint(null);setConfirmQuit(false);setMessage('A fresh attempt. You can do this.');}
  useEffect(() => { alive.current = true; dialog.current.showModal(); return () => { alive.current = false; }; }, []);
  const wait = ms => new Promise(resolve => setTimeout(resolve, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ms));

  async function play(a, b) {
    if (board[a] == null || board[b] == null || lock.current || !admitted || won || moves>=limit || ice.includes(a)||ice.includes(b)|| !adjacent(a, b, level.cols)) return;
    sound('swap'); lock.current = true; setBusy(true); setSelected(null); setHint(null); setMoving([a, b]);
    await wait(220); if (!alive.current) return;
    let frozen=[...ice];
    let next = swap(board, a, b); let found = iceMatches(next, level.cols,frozen);
    if (!found.length) { sound('invalid');
      setMoving(null); setMessage('Almost! A swap needs to make a line of 3 matching pieces.');
      await wait(220); if (!alive.current) return;
    } else {
      setBoard(next); setMoving(null); setMoves(n => n + 1);
      let total = score; let cascades = 0;
      while (found.length) {
        sound('match', cascades); setCleared(found.filter(i=>!frozen.includes(i))); setMessage(cascades ? 'Chain reaction! Falling pieces can make new matches.' : 'Nice match! Check the objective to see which pieces count.');
        await wait(320); if (!alive.current) return;
        total += objectiveCount(next, found.filter(i=>!frozen.includes(i)), repair.targetType); setScore(total);
        // Animate the cells at or above a cleared tile in each column.
        const affected = next.map((_, i) => i).filter(i => next[i] != null && found.some(j => j % level.cols === i % level.cols && j >= i && Array.from({length:(j-i)/level.cols+1}, (_,n) => next[i+n*level.cols]).every(value => value != null)));
        const resolved=resolveIce(next,found,frozen,level);next=resolved.board;frozen=resolved.ice;setIce(frozen);setBoard(next); setCleared([]); setFalling(affected);
        await wait(260); if (!alive.current) return;
        setFalling([]);
        found = iceMatches(next, level.cols,frozen); cascades++;
      }
      if (total >= repair.target && !frozen.length) sound('win');
      if ((total < repair.target||frozen.length) && !iceMove(next, level.cols,frozen)) {
        next = makeIceBoard(level,frozen); setBoard(next); setMessage('No moves left on this board. A fresh board is ready — your progress is safe.');
      }
    }
    lock.current = false; setBusy(false);
  }
  function choose(i) {
    if (suppressClick.current) { suppressClick.current = false; return; }
    if (busy || won || exhausted || ice.includes(i)) return;
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
    <div className="charge"><span>{repair.icon} {repair.name.toUpperCase()}</span><strong>{Math.min(score, repair.target)} / {repair.target}</strong><progress aria-label="Repair progress" max={repair.target} value={Math.min(score, repair.target)}/></div>
    <div className="level-hud"><LivesBar/><div className={`moves-counter ${limit-moves<=5?'low-moves':''}`} role="status" aria-label={`${Math.max(0,limit-moves)} moves left`}><span>MOVES</span><strong>{Math.max(0,limit-moves)}</strong></div></div>
    {!admitted ? <><NoLives/>{lives.count>0&&<button className="primary" onClick={()=>setAdmitted(true)}>Start level</button>}</> : !won ? <>
      <div className="board" style={{ '--cols': level.cols }} aria-label="Match three board" aria-busy={busy}>
        {board.map((type, i) => type == null ? <span key={i} className="board-hole" aria-hidden="true"/> : <button key={i} data-cell={i} data-type={type} data-hint={hint?.includes(i) || undefined} className={`cell ${ice.includes(i)?'frozen-cell':''} ${selected === i ? 'selected' : ''} ${hint?.includes(i) ? 'hinted' : ''}`} disabled={busy || confirmQuit || exhausted || ice.includes(i)} aria-label={`${ice.includes(i)?'Covered ':''}${names[type]}, row ${Math.floor(i / level.cols) + 1}, column ${i % level.cols + 1}`} aria-pressed={selected === i} onClick={() => choose(i)} onPointerDown={e => { suppressClick.current = false; pointer.current = { i, x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerUp={endSwipe} onPointerCancel={() => {pointer.current = null;}}>
          <span style={tileStyle(i)} className={`gem gem-${type} ${cleared.includes(i) ? 'clearing' : ''} ${falling.includes(i) ? 'falling' : ''}`}><img src={`/tiles/${sprites[type]}.png`} alt="" draggable="false"/></span>
        </button>)}
      </div>
      <p className="lesson" role="status">{message}</p>
      <div className="mini-actions"><span>Only valid swaps use a move</span><button disabled={busy || exhausted} onClick={() => {setHint(iceMove(board, level.cols,ice)); setMessage('Swap the two glowing pieces. Match lines can go across or down.');}}>Show a hint</button></div>
      <p className="gentle">{initialIce(repair).length?`${ice.length} covers left. Line up 3 of the same type through a covered piece to break its cover. Collect it in a later match.`:'Only valid swaps use a move. Cascades are free.'}</p>
    </> : <div className="win-panel"><span className="win-spark">✦</span><h3>Ready to repair.</h3><p>You have completed the objective.<br/>Now bring your ship back to life.</p><button className="primary" disabled={busy} onClick={onWin}>{repair.action} <span>→</span></button></div>}
    {import.meta.env.DEV&&!won&&!confirmQuit&&<button className="preview-complete" disabled={busy} onClick={()=>{if(lock.current)return;lock.current=true;onWin();}}>✓ Complete level <small>Preview · skip match-3</small></button>}
    {exhausted&&<div className="out-of-moves" role="region" aria-label="Out of moves"><h3>Out of moves</h3><p>Your repairs are safe. Try again or continue this attempt.</p><button className="primary" disabled={!import.meta.env.DEV} onClick={()=>setExtraMoves(n=>n+5)}>{import.meta.env.DEV?'Preview · +5 moves':'Extra moves · coming soon'}</button><small>{import.meta.env.DEV?'Test shortcut, no purchase':'Rewarded ads and purchases are not connected yet'}</small><button className="keep-playing" disabled={!lives.count} onClick={retry}>Retry level</button>{!lives.count&&<NoLives/>}</div>}
    <AudioControls/>{confirmQuit && <div className="quit-panel"><h3>Back to the ship?</h3><p>Leaving after a move uses one energy charge. Completed repairs stay safe.</p><button className="primary" onClick={leave}>Leave level</button><button className="keep-playing" onClick={() => setConfirmQuit(false)}>Keep playing</button></div>}
  </dialog>;
}
