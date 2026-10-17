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
    const available=Math.max(200,viewport-header-footer-20);
    game.style.width=width+'px';game.style.maxWidth='none';game.style.zoom='1';
    const naturalHeight=game.offsetHeight;
    // The scene artwork scales; navigation, energy and audio retain their
    // CSS pixel size. On short frames reserve a separate row for the HUD.
    const hudRow=available/naturalHeight<.8?76:0;
    const scale=Math.min(1,(available-hudRow)/naturalHeight);
    area.style.zoom='1';area.style.width=Math.max(width*scale,Math.min(width,320))+'px';
    area.style.paddingTop=hudRow+'px';
    game.style.zoom=String(scale);game.style.marginInline='auto';
   });
  }
  const observer=new ResizeObserver(fit);const game=area.querySelector('.game');if(game)observer.observe(game);
  window.addEventListener('resize',fit);window.visualViewport?.addEventListener('resize',fit);fit();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',fit);window.visualViewport?.removeEventListener('resize',fit);};
 },[key]);
}
