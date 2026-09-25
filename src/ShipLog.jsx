import {useLanguage} from './i18n/Language.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { logEntries } from './logEntries.js';

export default function ShipLog({ completed, readIds, initialId, onRead, onClose, entries }) {
 const {t}=useLanguage();
  const items = entries ?? logEntries.map(e=>({...e,available:e.unlockAt<=completed}));
  const availableCount = items.filter(e=>e.available).length;
  const [selected, setSelected] = useState(initialId ?? null);
  const dialog = useRef(null);
  const heading = useRef(null);
  const entry = items.find(item => item.id === selected && item.available);
  useEffect(() => { dialog.current.showModal(); }, []);
  useEffect(() => {
    if (entry) onRead(entry.id);
    heading.current?.focus();
  }, [selected]);
  return <dialog ref={dialog} className="ship-log" aria-labelledby="log-title" onCancel={e => {e.preventDefault();onClose();}}>
    <div className="log-content">
      <button className="close" aria-label={t("Close ship log")} onClick={onClose}>{t("×")}</button>
      <span className="eyebrow">{t("SHIP ARCHIVE / EXPEDITION RECORDS")}</span>
      <h2 id="log-title" ref={heading} tabIndex={-1}>{t("Ship log")}</h2>
      {t(entry ? <article className="log-page">
        <div className="log-meta"><span>{t(entry.source)}</span><span>{t(entry.time)}</span></div>
        <span className="log-number">{t("ENTRY ")}{t(String(entry.unlockAt).padStart(2, '0'))}</span>
        <h3>{t(entry.title)}</h3><p className="log-text">{t(entry.text)}</p>
        <div className="log-signature">{t(entry.source === 'Personal log' ? '— Pilot, supply vessel' : '— Onboard archive / fragment recovered')}</div>
        <button className="all-repairs" onClick={() => setSelected(null)}>{t("← All entries")}</button>
        <button className="primary" onClick={onClose}>{t("Back to the ship ")}<span>{t("→")}</span></button>
      </article> : <>
        <p className="log-intro">{t("A few words. A little more of the story.")}</p>
        <span className="log-count">{t(availableCount)}{t(" / ")}{t(items.length)}{t(" fragments available")}</span>
        {t(availableCount === 0 && <p className="log-empty">{t("The archive is quiet. Restore the emergency lights to begin your first entry.")}</p>)}
        <ol className="log-entries">{t(items.map(item => {
          const locked = !item.available;
          return <li key={item.id}><button disabled={locked} onClick={() => setSelected(item.id)}>
            <span className="log-index">{t(String(item.unlockAt).padStart(2, '0'))}</span>
            <span><strong>{t(locked ? 'Unrecovered fragment' : item.title)}</strong><small>{t(locked ? 'Continue your journey' : item.source)}</small></span>
            {t(!locked && !readIds.includes(item.id) && <span className="unread-tag">{t("NEW")}</span>)}
            {t(locked && <span aria-label={t("Locked")}>{t("· · ·")}</span>)}
          </button></li>;
        }))}</ol>
        <p className="log-footnote">{t("Read whenever you like. Your repairs never wait for the story.")}</p>
      </>)}
    </div>
  </dialog>;
}
