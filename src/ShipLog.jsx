import React, { useEffect, useRef, useState } from 'react';
import { logEntries } from './logEntries.js';

export default function ShipLog({ completed, readIds, initialId, onRead, onClose }) {
  const [selected, setSelected] = useState(initialId ?? null);
  const dialog = useRef(null);
  const heading = useRef(null);
  const entry = logEntries.find(item => item.id === selected && item.unlockAt <= completed);
  useEffect(() => { dialog.current.showModal(); }, []);
  useEffect(() => {
    if (entry) onRead(entry.id);
    heading.current?.focus();
  }, [selected]);
  return <dialog ref={dialog} className="ship-log" aria-labelledby="log-title" onCancel={e => {e.preventDefault();onClose();}}>
    <div className="log-content">
      <button className="close" aria-label="Close ship log" onClick={onClose}>×</button>
      <span className="eyebrow">SHIP ARCHIVE / CHAPTER 01</span>
      <h2 id="log-title" ref={heading} tabIndex={-1}>Ship log</h2>
      {entry ? <article className="log-page">
        <div className="log-meta"><span>{entry.source}</span><span>{entry.time}</span></div>
        <span className="log-number">ENTRY {String(entry.unlockAt).padStart(2, '0')}</span>
        <h3>{entry.title}</h3><p className="log-text">{entry.text}</p>
        <div className="log-signature">{entry.source === 'Personal log' ? '— Pilot, supply vessel' : '— Onboard archive / fragment recovered'}</div>
        <button className="all-repairs" onClick={() => setSelected(null)}>← All entries</button>
        <button className="primary" onClick={onClose}>Back to the ship <span>→</span></button>
      </article> : <>
        <p className="log-intro">A few words. A little more of the story.</p>
        <span className="log-count">{Math.min(completed, logEntries.length)} / {logEntries.length} fragments available</span>
        {completed === 0 && <p className="log-empty">The archive is quiet. Restore the emergency lights to begin your first entry.</p>}
        <ol className="log-entries">{logEntries.map(item => {
          const locked = item.unlockAt > completed;
          return <li key={item.id}><button disabled={locked} onClick={() => setSelected(item.id)}>
            <span className="log-index">{String(item.unlockAt).padStart(2, '0')}</span>
            <span><strong>{locked ? 'Unrecovered fragment' : item.title}</strong><small>{locked ? 'Continue repairing the cockpit' : item.source}</small></span>
            {!locked && !readIds.includes(item.id) && <span className="unread-tag">NEW</span>}
            {locked && <span aria-label="Locked">· · ·</span>}
          </button></li>;
        })}</ol>
        <p className="log-footnote">Read whenever you like. Your repairs never wait for the story.</p>
      </>}
    </div>
  </dialog>;
}
