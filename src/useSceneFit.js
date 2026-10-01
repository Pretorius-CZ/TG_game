import {useLayoutEffect} from 'react';
export default function useSceneFit(key){
 useLayoutEffect(()=>{
  const area=document.querySelector('.play-area'),shell=area?.closest('.shell');
  if(!area||!shell)return;
  let frame;
  function fit(){
   cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
    const game=area.querySelector('.game');if(!game)return;
    const viewport=window.visualViewport?.height||window.innerHeight;
    const width=shell.clientWidth-parseFloat(getComputedStyle(shell).paddingLeft)-parseFloat(getComputedStyle(shell).paddingRight);
    const header=shell.querySelector('.masthead')?.getBoundingClientRect().height||52;
    const footer=shell.querySelector('footer')?.getBoundingClientRect().height||30;
    const available=Math.max(200,viewport-header-footer-12);
    game.style.width=width+'px';game.style.maxWidth='none';
    const scale=Math.min(1,available/game.offsetHeight);
    game.style.zoom=String(scale);area.style.width=(width*scale)+'px';
   });
  }
  const observer=new ResizeObserver(fit);const game=area.querySelector('.game');if(game)observer.observe(game);
  window.addEventListener('resize',fit);window.visualViewport?.addEventListener('resize',fit);fit();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',fit);window.visualViewport?.removeEventListener('resize',fit);};
 },[key]);
}
