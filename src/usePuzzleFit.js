import {useLayoutEffect} from 'react';

// Measure the available flex space directly. Size containment and cqh have
// inconsistent results in older mobile WebKit, particularly after a retry.
export default function usePuzzleFit(dialog, active, cols, rows) {
 useLayoutEffect(()=>{
  const area=dialog.current?.querySelector('.puzzle-area');
  const board=area?.querySelector('.board');
  if(!active||!area||!board)return;
  const fit=()=>{
   const width=Math.max(0,Math.min(area.clientWidth,area.clientHeight*cols/rows));
   board.style.width=`${width}px`;
   board.style.setProperty('--cell-size',`${Math.max(0,(width-10-(cols-1)*3)/cols)}px`);
  };
  const observer=new ResizeObserver(fit);
  observer.observe(area);fit();
  return()=>observer.disconnect();
 },[dialog,active,cols,rows]);
}
