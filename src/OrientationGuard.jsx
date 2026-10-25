import React,{useEffect,useRef} from 'react';
import {createPortal} from 'react-dom';
import {useLanguage} from './i18n/Language.jsx';
import './orientation.css';

export default function OrientationGuard(){
 const dialog=useRef(null),{msg}=useLanguage();
 useEffect(()=>{
  const media=matchMedia('(orientation: landscape) and (pointer: coarse) and (max-height: 600px) and (max-width: 1100px)');
  let focus=null;
  const sync=()=>{
   const el=dialog.current;
   if(media.matches){
    if(!el.open){focus=document.activeElement;el.showModal();}
    // A reward or game dialog may open while the device is rotated. Keep
    // the rotation prompt above it without unmounting any game state.
    const modals=[...document.querySelectorAll('dialog:modal')];
    if(modals.some(other=>other!==el&&!other.inert)&&document.elementFromPoint(innerWidth/2,innerHeight/2)?.closest('dialog')!==el){el.close();el.showModal();}
   }else if(el.open){el.close();if(focus?.isConnected)focus.focus({preventScroll:true});focus=null;}
  };
  const observer=new MutationObserver(sync);
  observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['open']});
  media.addEventListener('change',sync);sync();
  return()=>{observer.disconnect();media.removeEventListener('change',sync);dialog.current?.close();};
 },[]);
 return createPortal(<dialog ref={dialog} className="orientation-guard" aria-labelledby="orientation-title" onCancel={e=>e.preventDefault()}>
  <div><span aria-hidden="true">↻</span><h2 id="orientation-title">{msg("ui.OrientationGuard.turn-your-phone-upright")}</h2><p>{msg("ui.OrientationGuard.play-in-portrait-orientation-your-current-level-is-kept")}</p></div>
 </dialog>,document.body);
}
