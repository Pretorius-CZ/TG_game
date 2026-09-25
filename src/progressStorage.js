import {havenLogs,jumpLog,gateReady} from './haven.js';
import {iceLogs,wreckLogs,havenLog,havenLocated} from './destinations.js';
import {mineLogs} from './exploration.js';
import {departureLog} from './departure.js';
import {shipReadiness} from './navigationRepairs.js';
import {logEntries} from './logEntries.js';
import {crewLogs} from './crewRepairs.js';
import {galleyLogs} from './galleyRepairs.js';
import {engineLogs} from './engineRepairs.js';
import {airlockLogs} from './airlockRepairs.js';
import {navigationLogs} from './navigationRepairs.js';
import {exteriorLogs} from './exteriorRepairs.js';
export const SAVE_KEY='to-the-stars-progress-v1';
const groups={completed:logEntries,crewCompleted:crewLogs,galleyCompleted:galleyLogs,engineCompleted:engineLogs,airlockCompleted:airlockLogs,navigationCompleted:navigationLogs,exteriorCompleted:exteriorLogs,mineCompleted:mineLogs,iceCompleted:iceLogs,wreckCompleted:wreckLogs,havenCompleted:havenLogs};
const limits={completed:4,crewCompleted:4,galleyCompleted:4,engineCompleted:5,airlockCompleted:3,navigationCompleted:4,exteriorCompleted:4,mineCompleted:6,iceCompleted:6,wreckCompleted:6,havenCompleted:6};
const scenes=['exterior','airlock','cockpit','corridor','crew','galley','engine','navigation','system','mine','ice','wreck','haven','system2'];
export function normalizeProgress(value={}){
 const save={version:1,resetRevision:Number.isSafeInteger(value?.resetRevision)&&value.resetRevision>=0?value.resetRevision:0};
 for(const [key,max] of Object.entries(limits))save[key]=Number.isInteger(value?.[key])?Math.max(0,Math.min(max,value[key])):0;
 if(save.completed<4)for(const key of Object.keys(limits))if(key!=='completed'&&key!=='airlockCompleted')save[key]=0;
 if(save.engineCompleted<2)save.exteriorCompleted=Math.min(3,save.exteriorCompleted);
 save.finaleDone=value?.finaleDone===true&&shipReadiness({cockpit:save.completed,crew:save.crewCompleted,galley:save.galleyCompleted,engine:save.engineCompleted,'airlock-work':save.airlockCompleted,navigation:save.navigationCompleted,exterior:save.exteriorCompleted}).every(r=>r.ready);
 save.launchDone=value?.launchDone===true&&save.finaleDone;
 if(!save.launchDone)save.mineCompleted=0;
 save.scannerInstalled=value?.scannerInstalled===true&&save.mineCompleted===6&&save.launchDone;
 if(!save.scannerInstalled){save.iceCompleted=0;save.wreckCompleted=0;}
 if(!havenLocated(save))save.havenCompleted=0;
 save.jumpDone=value?.jumpDone===true&&gateReady(save);
 const unlocked=Object.entries(groups).flatMap(([key,entries])=>entries.slice(0,save[key]).map(e=>e.id));
 save.readIds=[...new Set(Array.isArray(value?.readIds)?value.readIds.filter(id=>unlocked.includes(id)):[])];
 if(save.launchDone&&value?.readIds?.includes(departureLog.id))save.readIds.push(departureLog.id);
 if(havenLocated(save)&&value?.readIds?.includes(havenLog.id))save.readIds.push(havenLog.id);
 if(save.jumpDone&&value?.readIds?.includes(jumpLog.id))save.readIds.push(jumpLog.id);
 save.scene=scenes.includes(value?.scene)?value.scene:'exterior';
 if(save.scene==='haven'&&!havenLocated(save))save.scene=save.launchDone?'system':'exterior';
 if(save.scene==='system2'&&!save.jumpDone)save.scene=save.launchDone?'system':'exterior';
 if(!save.scannerInstalled&&['ice','wreck'].includes(save.scene))save.scene=save.launchDone?'system':'exterior';
 if(!save.launchDone&&['system','mine'].includes(save.scene))save.scene='exterior';
 if(save.completed<4&&['crew','galley','engine','navigation'].includes(save.scene))save.scene='exterior';
 return save;
}
export function mergeProgress(local,stored){
 if((local.resetRevision??0)!==(stored.resetRevision??0))return normalizeProgress((local.resetRevision??0)>(stored.resetRevision??0)?local:stored);
 const merged={...local,readIds:[...local.readIds,...stored.readIds],finaleDone:local.finaleDone||stored.finaleDone,launchDone:local.launchDone||stored.launchDone,scannerInstalled:local.scannerInstalled||stored.scannerInstalled,jumpDone:local.jumpDone||stored.jumpDone};
 for(const key of Object.keys(limits))merged[key]=Math.max(local[key]??0,stored[key]??0);
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
