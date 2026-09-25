import {useLanguage} from './i18n/Language.jsx';
import {boostersEnabled} from './boosters.js';
import {moveBudget,initialIce} from './levelRules.js';
import React, { useLayoutEffect, useRef } from 'react';

export default function RepairBubble({ repair, replay, sceneRef, onClose, onPlay, onComplete }) {
 const {t}=useLanguage();
  const dialog = useRef(null);
  useLayoutEffect(() => {
    const element = dialog.current;
    element.showModal();
    function position() {
      const scene = sceneRef.current.getBoundingClientRect();
      const width = Math.min(scene.width - 32, 420);
      element.style.width = `${width}px`;
      element.style.left = `${scene.left + (scene.width - width) / 2}px`;
      element.style.top = `${Math.max(12, Math.min(scene.bottom - element.offsetHeight - 16, window.innerHeight - element.offsetHeight - 12))}px`;
    }
    position();
    const observer = new ResizeObserver(position);
    observer.observe(element); observer.observe(sceneRef.current);
    window.addEventListener('scroll', position, true);
    window.addEventListener('resize', position);
    return () => { observer.disconnect(); window.removeEventListener('scroll', position, true); window.removeEventListener('resize', position); };
  }, []);
  return <dialog ref={dialog} className="repair-bubble" style={{'--tail-x': `${repair.x}%`}} aria-labelledby="bubble-title" aria-describedby="bubble-story" onCancel={e => {e.preventDefault();onClose();}} onClick={e => {if(e.target === dialog.current) onClose();}}>
    <div className="bubble-inner">
      <button className="close" aria-label={t("Close pilot thought")} onClick={onClose}>{t("×")}</button>
      <div className="bubble-speaker"><span className="pilot-emblem" aria-hidden="true">{t("✦")}</span><span>{t("PILOT")}<small>{t(replay ? 'BACK AT THE CONSOLE' : 'PERSONAL LOG / PRESENT')}</small></span></div>
      <h2 id="bubble-title">{t(repair.name)}</h2>
      <p id="bubble-story">{t(replay ? 'This system is already restored. A little more practice before the next repair?' : repair.thought)}</p>
      <div className="bubble-objective">{t(repair.objective)}<br/>{t(moveBudget(repair))}{t(" moves")}{t(initialIce(repair).length?` · ${initialIce(repair).length} protective covers`:null)}</div>
      {t(boostersEnabled(repair)&&<p className="booster-guide">{t("Make 4 in a line or a T/L for a Pulse charge. Make 5 in a line for a Nova cross. Tap a charge to fire it for one move.")}</p>)}
      <button className="primary" onClick={onPlay}>{t(replay ? 'Replay lesson' : 'Play')} <span>{t("→")}</span></button>
      {t(import.meta.env.DEV&&onComplete&&!replay&&<button className="preview-complete" onClick={onComplete}>{t("✓ Complete level ")}<small>{t("Preview · skip match-3")}</small></button>)}
    </div>
  </dialog>;
}
