import React, { useEffect, useRef, useState } from 'react';
import { adjacent, findMove, makeBoard, matches, refill, swap, tutorial } from './match3';

const names = ['Amber diamond', 'Mint circle', 'Blue square', 'Pink triangle'];
const symbols = ['◆', '●', '■', '▲'];

export default function MiniGame({ onWin, onQuit, repair }) {
  const [board, setBoard] = useState(() => makeBoard());
  const [selected, setSelected] = useState(null);
  const [cleared, setCleared] = useState([]);
  const [moving, setMoving] = useState(null);
  const [falling, setFalling] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('Tap one glowing piece, then the other to swap them.');
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [hint, setHint] = useState(() => findMove(board, tutorial.cols));
  const dialog = useRef(null);
  const lock = useRef(false);
  const alive = useRef(true);
  const pointer = useRef(null);
  const suppressClick = useRef(false);
  const won = score >= repair.target;
  useEffect(() => { dialog.current.showModal(); return () => { alive.current = false; }; }, []);
  const wait = ms => new Promise(resolve => setTimeout(resolve, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ms));

  async function play(a, b) {
    if (lock.current || won || !adjacent(a, b, tutorial.cols)) return;
    lock.current = true; setBusy(true); setSelected(null); setHint(null); setMoving([a, b]);
    await wait(220); if (!alive.current) return;
    let next = swap(board, a, b); let found = matches(next, tutorial.cols);
    if (!found.length) {
      setMoving(null); setMessage('Almost! A swap needs to make a line of 3 matching pieces.');
      await wait(220); if (!alive.current) return;
    } else {
      setBoard(next); setMoving(null); setMoves(n => n + 1);
      let total = score; let cascades = 0;
      while (found.length && total < repair.target) {
        setCleared(found); setMessage(cascades ? 'Chain reaction! Falling pieces can make new matches.' : 'Nice match! Check the objective to see which pieces count.');
        await wait(320); if (!alive.current) return;
        total += found.filter(i => repair.targetType == null || next[i] === repair.targetType).length; setScore(total);
        // Animate the cells at or above a cleared tile in each column.
        const affected = next.map((_, i) => i).filter(i => found.some(j => j % tutorial.cols === i % tutorial.cols && j >= i));
        next = refill(next, found); setBoard(next); setCleared([]); setFalling(affected);
        await wait(260); if (!alive.current) return;
        setFalling([]);
        found = matches(next, tutorial.cols); cascades++;
      }
      if (total < repair.target && !findMove(next, tutorial.cols)) {
        next = makeBoard(); setBoard(next); setMessage('No moves left on this board. A fresh board is ready — your progress is safe.');
      }
    }
    lock.current = false; setBusy(false);
  }
  function choose(i) {
    if (suppressClick.current) { suppressClick.current = false; return; }
    if (busy || won) return;
    if (selected === i) setSelected(null);
    else if (selected != null && adjacent(selected, i, tutorial.cols)) play(selected, i);
    else setSelected(i);
  }
  function endSwipe(event) {
    const start = pointer.current; pointer.current = null;
    if (!start) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    suppressClick.current = true;
    const target = start.i + (Math.abs(dx) > Math.abs(dy) ? Math.sign(dx) : Math.sign(dy) * tutorial.cols);
    if (target >= 0 && target < board.length && adjacent(start.i, target, tutorial.cols)) play(start.i, target);
  }
  function tileStyle(i) {
    if (!moving?.includes(i)) return {};
    const j = moving[0] === i ? moving[1] : moving[0];
    return { transform: `translate(${(j % tutorial.cols - i % tutorial.cols) * 100}%, ${(Math.floor(j / tutorial.cols) - Math.floor(i / tutorial.cols)) * 100}%)`, zIndex: 2 };
  }
  return <dialog className="mini-dialog" ref={dialog} aria-labelledby="level-title" onCancel={event => { event.preventDefault(); if (!busy) setConfirmQuit(true); }}>
    <div className="mini-header"><span className="eyebrow">COCKPIT / REPAIR LESSON</span><button className="close" aria-label="Leave level" disabled={busy} onClick={() => setConfirmQuit(true)}>×</button><h2 id="level-title">{repair.lesson}</h2><p>{repair.objective}</p></div>
    <div className="charge"><span>{repair.icon} {repair.name.toUpperCase()}</span><strong>{Math.min(score, repair.target)} / {repair.target}</strong><progress aria-label="Repair progress" max={repair.target} value={Math.min(score, repair.target)}/></div>
    {!won ? <>
      <div className="board" style={{ '--cols': tutorial.cols }} aria-label="Match three board" aria-busy={busy}>
        {board.map((type, i) => <button key={i} data-cell={i} data-type={type} data-hint={hint?.includes(i) || undefined} className={`cell ${selected === i ? 'selected' : ''} ${hint?.includes(i) ? 'hinted' : ''}`} disabled={busy || confirmQuit} aria-label={`${names[type]}, row ${Math.floor(i / 6) + 1}, column ${i % 6 + 1}`} aria-pressed={selected === i} onClick={() => choose(i)} onPointerDown={e => { suppressClick.current = false; pointer.current = { i, x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerUp={e => endSwipe(e, i)} onPointerCancel={() => {pointer.current = null;}}>
          <span style={tileStyle(i)} className={`gem gem-${type} ${cleared.includes(i) ? 'clearing' : ''} ${falling.includes(i) ? 'falling' : ''}`}>{symbols[type]}</span>
        </button>)}
      </div>
      <p className="lesson" role="status">{message}</p>
      <div className="mini-actions"><span>{moves} moves · No time limit</span><button disabled={busy} onClick={() => {setHint(findMove(board, tutorial.cols)); setMessage('Swap the two glowing pieces. Match lines can go across or down.');}}>Show a hint</button></div>
      <p className="gentle">Take your time. There is no move limit in this lesson.</p>
    </> : <div className="win-panel"><span className="win-spark">✦</span><h3>Ready to repair.</h3><p>You have completed the objective.<br/>Now bring your ship back to life.</p><button className="primary" disabled={busy} onClick={onWin}>{repair.action} <span>→</span></button></div>}
    {confirmQuit && <div className="quit-panel"><h3>Back to the cockpit?</h3><p>This attempt will not be saved.</p><button className="primary" onClick={onQuit}>Leave level</button><button className="keep-playing" onClick={() => setConfirmQuit(false)}>Keep playing</button></div>}
  </dialog>;
}
