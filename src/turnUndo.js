// Replay the same random draws after undo, without changing their distribution.
// A checkpoint discards past draws; only the last action and its future remain.
export function createTurnRandom(source=()=>Math.random()){
 let values=[],cursor=0;
 return {
  next(){if(cursor===values.length)values.push(source());return values[cursor++];},
  checkpoint(){values=values.slice(cursor);cursor=0;},
  rewind(){cursor=0;},
  reset(){values=[];cursor=0;}
 };
}

// Memory only, one ordinary turn per attempt. Never stores stock or saved progress.
export function createTurnUndo(random){
 let frame=null,used=false;
 return {
  get available(){return !used&&frame!==null;},
  capture(state){random.checkpoint();if(used)return;frame=structuredClone(state);},
  invalidate(){frame=null;},
  take(){
   if(used||!frame)return null;
   const restored=structuredClone(frame);random.rewind();frame=null;used=true;return restored;
  },
  reset(){frame=null;used=false;random.reset();}
 };
}
