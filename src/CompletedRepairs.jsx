import React,{useLayoutEffect,useRef,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import Stars from './Stars.jsx';
import './completedRepairs.css';

export default function CompletedRepairs({repairs,onReplay}){
 const {t}=useLanguage(),ref=useRef(null),[bounds,setBounds]=useState({top:200,bottom:100});
 useLayoutEffect(()=>{
  const scene=ref.current.closest('.game'),header=scene.querySelector('.scene-top'),footer=scene.querySelector('.scene-caption,.archive-navigation');
  function fit(){
   const top=header?header.offsetTop+header.offsetHeight+10:100;
   const bottom=footer?scene.clientHeight-footer.offsetTop+10:12;
   setBounds(previous=>previous.top===top&&previous.bottom===bottom?previous:{top,bottom});
  }
  const observer=new ResizeObserver(fit);
  for(const node of [scene,header,footer])if(node)observer.observe(node);
  fit();return()=>observer.disconnect();
 },[]);
 return <div ref={ref} className="completed-repairs-grid" role="group" aria-label={t('Replay lesson')} style={{top:bounds.top,bottom:bounds.bottom}}>
  {repairs.map(repair=><button key={repair.id} type="button" data-repair-id={repair.id} className="completed-hotspot replay-level" aria-label={t(repair.name)} title={t(repair.name)} onClick={()=>onReplay(repair)}><span className="replay-level-check" aria-hidden="true">✓</span><span className="hotspot-label">{t(repair.name)}<Stars id={repair.id}/></span></button>)}
 </div>;
}
