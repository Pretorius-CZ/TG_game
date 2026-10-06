import {levelGroups} from './levelCatalog.js';
import {destinations} from './destinations.js';
const shipKeys=['airlockCompleted','completed','navigationCompleted','crewCompleted','galleyCompleted','engineCompleted','exteriorCompleted','finaleDone'];
export function earnedStars(budget,moves){
 if(!Number.isFinite(budget)||budget<=0||!Number.isFinite(moves)||moves<0)return 1;
 const left=Math.max(0,budget-moves);
 return left>=Math.ceil(budget*.30)?3:left>=Math.ceil(budget*.15)?2:1;
}
export function completedLevelIds(p){
 const ids=levelGroups.slice(0,8).flatMap(([,levels],i)=>levels.slice(0,shipKeys[i]==='finaleDone'?(p.finaleDone?1:0):(p[shipKeys[i]]??0)).map(r=>r.id));
 for(const site of Object.values(destinations))ids.push(...site.repairs.slice(0,p[site.key]??0).map(r=>r.id));
 if(p.elysiumRouteCompleted===1)ids.push('elysium-route');
 return ids;
}
export function normalizeStars(p){return Object.fromEntries(completedLevelIds(p).map(id=>[id,Number.isInteger(p.stars?.[id])&&p.stars[id]>=1&&p.stars[id]<=3?p.stars[id]:1]));}
export function mergeStars(a={},b={}){return Object.fromEntries([...new Set([...Object.keys(a),...Object.keys(b)])].map(id=>[id,Math.max(a[id]??0,b[id]??0)]));}
