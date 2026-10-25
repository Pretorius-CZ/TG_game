import test from 'node:test';
import assert from 'node:assert/strict';
import {placeRepairLabels} from '../src/repairLabels.js';
const intersects=(a,b)=>Math.min(a.x+a.width,b.x+b.width)>Math.max(a.x,b.x)+1&&Math.min(a.y+a.height,b.y+b.height)>Math.max(a.y,b.y)+1;
test('completed labels fit around dense device anchors without moving or covering them',()=>{
 const items=Array.from({length:6},(_,i)=>({id:String(i),x:20+(i%3)*90,y:200+Math.floor(i/3)*100,width:100,height:50,anchor:{x:40+(i%3)*110,y:210+Math.floor(i/3)*150}}));
 const original=structuredClone(items),markers=items.map(i=>({x:i.anchor.x-22,y:i.anchor.y-22,width:44,height:44}));
 const labels=placeRepairLabels(items,{width:320,height:500,top:135,obstacles:markers});
 assert.deepEqual(items,original);assert.deepEqual(labels.map(x=>x.id),items.map(x=>x.id));
 for(const label of labels){assert.ok(label.x>=0&&label.x+label.width<=320);assert.ok(label.y>=135&&label.y+label.height<=500);for(const marker of markers)assert.equal(intersects(label,marker),false);}
 for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++)assert.equal(intersects(labels[i],labels[j]),false);
});
