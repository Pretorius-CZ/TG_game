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
    const shellStyle=getComputedStyle(shell);
    const width=shell.clientWidth-parseFloat(shellStyle.paddingLeft)-parseFloat(shellStyle.paddingRight);
    const header=shell.querySelector('.masthead')?.getBoundingClientRect().height||52;
    const footer=shell.querySelector('footer')?.getBoundingClientRect().height||30;
    const available=Math.max(200,viewport-header-footer-20);
    const write=(el,key,value)=>{if(el.style[key]!==value)el.style[key]=value;};
    write(game,'width',width+'px');write(game,'maxWidth','none');
    // Exterior labels and the departure button need readable touch targets.
    // Let a short display scroll instead of shrinking this scene below them.
    if(game.classList.contains('exterior-room')){
     write(area,'zoom','1');write(area,'width',width+'px');write(area,'paddingTop','0px');
     write(game,'zoom','1');write(game,'marginInline','auto');return;
    }
    // offsetHeight is in unscaled CSS pixels. Resetting zoom before each
    // measurement forced two layouts, even when the scene had not changed.
    const naturalHeight=game.offsetHeight;
    // The scene artwork scales; navigation, energy and audio retain their
    // CSS pixel size. On short frames reserve a separate row for the HUD.
    const hudRow=available/naturalHeight<.8?76:0;
    const scale=Math.min(1,(available-hudRow)/naturalHeight);
    // Later chapters add Back as a fourth navigation control. Size the HUD
    // from its contents, rather than assuming the opening chapter's width.
    const tools=area.querySelector('.scene-tools'),lives=area.querySelector('.scene-lives');
    const controlsWidth=(tools?.offsetWidth??0)+(lives?.offsetWidth??0)+32;
    write(area,'zoom','1');write(area,'width',Math.max(width*scale,Math.min(width,Math.max(320,controlsWidth)))+'px');
    write(area,'paddingTop',hudRow+'px');
    write(game,'zoom',String(scale));write(game,'marginInline','auto');
   });
  }
  const observer=new ResizeObserver(fit);const game=area.querySelector('.game');if(game)observer.observe(game);
  for(const hud of area.querySelectorAll('.scene-tools,.scene-lives'))observer.observe(hud);
  window.addEventListener('resize',fit);window.visualViewport?.addEventListener('resize',fit);fit();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',fit);window.visualViewport?.removeEventListener('resize',fit);};
 },[key]);
}
