import React,{useLayoutEffect,useRef,useState} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import Stars from './Stars.jsx';
import {placeRepairLabels} from './repairLabels.js';
import './completedRepairs.css';

export default function CompletedRepairs({repairs,onReplay,hotspotOffset=110}){
 const {t,language}=useLanguage(),ref=useRef(null),[layout,setLayout]=useState([]);
 useLayoutEffect(()=>{
  const map=ref.current,scene=map.closest('.game'),header=scene.querySelector('.scene-top');
  function fit(){
   const rect=map.getBoundingClientRect(),scale=rect.width/map.clientWidth;
   if(!scale)return;
   const items=[...map.querySelectorAll('button[data-repair-id]')].map(button=>{
    const label=button.querySelector('.hotspot-label'),target=button.querySelector('.target'),box=button.getBoundingClientRect(),anchor=target.getBoundingClientRect();
    return {id:button.dataset.repairId,x:(box.left-rect.left)/scale+label.offsetLeft,y:(box.top-rect.top)/scale+label.offsetTop,width:label.offsetWidth,height:label.offsetHeight,anchor:{x:(anchor.left+anchor.width/2-rect.left)/scale,y:(anchor.top+anchor.height/2-rect.top)/scale},marker:{x:(anchor.left-rect.left)/scale,y:(anchor.top-rect.top)/scale,width:anchor.width/scale,height:anchor.height/scale}};
   });
   const top=header?(header.getBoundingClientRect().bottom-rect.top)/scale:0;
   const labels=placeRepairLabels(items,{width:map.clientWidth,height:map.clientHeight,top,obstacles:items.map(item=>item.marker)});
   const next=items.map((item,i)=>({...labels[i],anchor:item.anchor,dx:labels[i].x-item.x,dy:labels[i].y-item.y}));
   setLayout(previous=>JSON.stringify(previous)===JSON.stringify(next)?previous:next);
  }
  const observer=new ResizeObserver(fit);
  for(const node of [map,header,...map.querySelectorAll('.hotspot-label')])if(node)observer.observe(node);
  fit();return()=>observer.disconnect();
 },[repairs,language,hotspotOffset]);
 return <div ref={ref} className="scene-repairs" role="group" aria-label={t('Replay lesson')}>
  <svg className="repair-label-links" aria-hidden="true">{layout.filter(item=>Math.hypot(item.dx,item.dy)>10).map(item=><line key={item.id} x1={item.anchor.x} y1={item.anchor.y} x2={Math.max(item.x,Math.min(item.anchor.x,item.x+item.width))} y2={Math.max(item.y,Math.min(item.anchor.y,item.y+item.height))}/>)}</svg>
  {repairs.map(repair=>{const label=layout.find(item=>item.id===repair.id);return <button key={repair.id} type="button" data-repair-id={repair.id} className={`hotspot completed-hotspot replay-level ${repair.y>65?'hotspot-label-above':''}`} style={{left:`${repair.x}%`,top:`calc(${hotspotOffset}px + (100% - ${hotspotOffset}px) * ${repair.y/100})`}} aria-label={t(repair.name)} title={t(repair.name)} onClick={()=>onReplay(repair)}><span className="target" aria-hidden="true">✓</span><span className="hotspot-label" style={{transform:label?`translate(${label.dx}px,${label.dy}px)`:'none'}}>{t(repair.name)}<Stars id={repair.id}/></span></button>;})}
 </div>;
}
