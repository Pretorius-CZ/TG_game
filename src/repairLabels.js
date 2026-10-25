// Move labels only: device anchors always retain their configured scene coordinates.
const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
export function placeRepairLabels(items,{width,height,top=0,obstacles=[]}){
 const gap=3,pad=b=>({x:b.x-gap,y:b.y-gap,width:b.width+gap*2,height:b.height+gap*2});
 const options=items.map(item=>{
  const w=item.width,h=item.height,minX=6,maxX=Math.max(minX,width-w-6),minY=Math.min(top+6,Math.max(0,height-h-6)),maxY=Math.max(minY,height-h-6),clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const xs=new Set([minX,maxX,item.x,item.anchor.x-w/2,item.anchor.x+28,item.anchor.x-w-28]);
  const ys=new Set([minY,maxY,item.y,item.anchor.y-h-28,item.anchor.y+28]);
  for(let x=minX;x<=maxX;x+=10)xs.add(x);for(let y=minY;y<=maxY;y+=10)ys.add(y);
  const columns=Math.floor((width-12+gap)/(w+gap));for(let i=0;i<columns;i++)xs.add(columns===1?minX:minX+(maxX-minX)*i/(columns-1));
  for(const box of obstacles){xs.add(box.x-w-gap);xs.add(box.x+box.width+gap);ys.add(box.y-h-gap);ys.add(box.y+box.height+gap);}
  const seen=new Set(),boxes=[];
  for(const x of xs)for(const y of ys){const box={id:item.id,x:clamp(x,minX,maxX),y:clamp(y,minY,maxY),width:w,height:h};const key=box.x+':'+box.y;if(seen.has(key))continue;seen.add(key);box.distance=(box.x-item.x)**2+(box.y-item.y)**2;box.obstruction=obstacles.reduce((sum,b)=>sum+overlap(pad(box),b),0);boxes.push(box);}
  return boxes.sort((a,b)=>a.obstruction-b.obstruction||a.distance-b.distance);
 });
 // A small bounded search avoids a greedy choice trapping the remaining labels.
 const order=items.map((_,i)=>i).sort((a,b)=>options[a].filter(x=>!x.obstruction).length-options[b].filter(x=>!x.obstruction).length),chosen=[];let attempts=0;
 function solve(depth){
  if(depth===order.length)return true;
  if(++attempts>6000)return false;
  const index=order[depth];
  for(const box of options[index]){
   if(box.obstruction)break;
   if(chosen.some(other=>overlap(pad(box),other)))continue;
   chosen.push(box);if(solve(depth+1))return true;chosen.pop();
   if(attempts>6000)return false;
  }
  return false;
 }
 if(!solve(0)){
  chosen.length=0;
  for(const index of order){let best,score=Infinity;for(const box of options[index]){const cost=(box.obstruction+chosen.reduce((n,b)=>n+overlap(pad(box),b),0))*1e6+box.distance;if(cost<score){score=cost;best=box;}}chosen.push(best);}
 }
 return items.map(item=>{const {id,x,y,width,height}=chosen.find(box=>box.id===item.id);return{id,x,y,width,height};});
}
