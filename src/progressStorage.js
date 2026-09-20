import {shipReadiness} from './navigationRepairs.js';
import {logEntries} from './logEntries.js';
import {crewLogs} from './crewRepairs.js';
import {galleyLogs} from './galleyRepairs.js';
import {engineLogs} from './engineRepairs.js';
import {airlockLogs} from './airlockRepairs.js';
import {navigationLogs} from './navigationRepairs.js';
import {exteriorLogs} from './exteriorRepairs.js';
export const SAVE_KEY='to-the-stars-progress-v1';
const groups={completed:logEntries,crewCompleted:crewLogs,galleyCompleted:galleyLogs,engineCompleted:engineLogs,airlockCompleted:airlockLogs,navigationCompleted:navigationLogs,exteriorCompleted:exteriorLogs};
const limits={completed:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,airlockCompleted:3,navigationCompleted:4,exteriorCompleted:4};
const scenes=['exterior','airlock','cockpit','corridor','crew','galley','engine','navigation'];
export function normalizeProgress(value={}){
 const save={version:1};
 for(const [key,max] of Object.entries(limits))save[key]=Number.isInteger(value?.[key])?Math.max(0,Math.min(max,value[key])):0;
 if(save.completed<4)for(const key of Object.keys(limits))if(key!=='completed')save[key]=0;
 if(save.engineCompleted<2)save.exteriorCompleted=Math.min(3,save.exteriorCompleted);
 const unlocked=Object.entries(groups).flatMap(([key,entries])=>entries.slice(0,save[key]).map(e=>e.id));
 save.readIds=[...new Set(Array.isArray(value?.readIds)?value.readIds.filter(id=>unlocked.includes(id)):[])];
 save.finaleDone=value?.finaleDone===true&&shipReadiness({cockpit:save.completed,crew:save.crewCompleted,galley:save.galleyCompleted,engine:save.engineCompleted,'airlock-work':save.airlockCompleted,navigation:save.navigationCompleted,exterior:save.exteriorCompleted}).every(r=>r.ready);
 save.scene=scenes.includes(value?.scene)?value.scene:'exterior';
 if(save.completed<4&&['crew','galley','engine','navigation'].includes(save.scene))save.scene='exterior';
 return save;
}
export function mergeProgress(local,stored){
 const merged={...local,readIds:[...local.readIds,...stored.readIds],finaleDone:local.finaleDone||stored.finaleDone};
 for(const key of Object.keys(limits))merged[key]=Math.max(local[key],stored[key]);
 return normalizeProgress(merged);
}
export function loadProgress(storage){
 try{const raw=storage.getItem(SAVE_KEY);if(!raw)return {progress:normalizeProgress(),status:'ready'};
 const data=JSON.parse(raw);if(data?.version!==1)return {progress:normalizeProgress(),status:'unsupported'};
 return {progress:normalizeProgress(data),status:'ready'};
 }catch{return {progress:normalizeProgress(),status:'unavailable'};}
}
export function storeProgress(storage,progress){
 try{const raw=storage.getItem(SAVE_KEY);let merged=normalizeProgress(progress);
 if(raw){let previous;try{previous=JSON.parse(raw);}catch{return {progress:merged,status:'unavailable'};}
 if(previous?.version!==1)return {progress:merged,status:'unsupported'};
 merged=mergeProgress(merged,normalizeProgress(previous));}
 storage.setItem(SAVE_KEY,JSON.stringify(merged));return {progress:merged,status:'saved'};
 }catch{return {progress:normalizeProgress(progress),status:'unavailable'};}
}
