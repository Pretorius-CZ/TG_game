import {matchLocale} from './i18n/locales.js';
import {normalizeProgress,mergeProgress} from './progressStorage.js';
import {recoverLives,RECHARGE_MS} from './livesRules.js';
import {stockKey,freshStock} from './helperStock.js';

export const TRANSFER_PENDING='beyond-signal-transfer-pending-v1';
const receiptsKey='beyond-signal-transfer-receipts-v1';
const uuid='[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const profile=`(?:guest|${uuid})`;
const progressKey=new RegExp(`^to-the-stars-progress-v1(?::user:${uuid})?$`,'i');
const helpersKey=new RegExp(`^to-the-stars-helpers-v1:${profile}:\\d+$`,'i');
const tutorialsKey=new RegExp(`^beyond-signal-tutorials-v1:${profile}$`,'i');
const seenKey=new RegExp(`^beyond-the-signal-(?:intro:${profile}:\\d+|story:${profile}:\\d+:[a-z0-9-]+)$`,'i');
const analyticsKeys=new Set(['beyond-signal-balance-reporter-v1','beyond-signal-balance-attempts-v1','beyond-signal-balance-outbox-v1','beyond-signal-balance-cloud-migrated-v1','beyond-signal-campaign-visit-v1','beyond-signal-campaign-outbox-v1']);
const preferences=new Set(['ship-audio','to-the-stars-language']);
const energyKey='to-the-stars-lives-v1';
const trafficKey='beyond-signal-migrated-traffic-v1';
const maxBytes=4*1024*1024;
const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.getPrototypeOf(value)===Object.prototype;
function fail(){throw new Error('Invalid or unsupported save backup.');}
export function isTransferKey(key){return progressKey.test(key)||helpersKey.test(key)||tutorialsKey.test(key)||seenKey.test(key)||analyticsKeys.has(key)||preferences.has(key)||key===energyKey||key===trafficKey;}
function validateValue(key,value){
 if(typeof value!=='string'||value.length>maxBytes)fail();
 if(key==='to-the-stars-language'){if(matchLocale(value)!==value)fail();return value;}
 if(seenKey.test(key)){if(value!=='seen')fail();return value;}
 if(key==='beyond-signal-balance-cloud-migrated-v1'){if(value!=='1')fail();return value;}
 let data;try{data=JSON.parse(value);}catch{fail();}
 if(key===trafficKey&&(!plain(data)||data.source!=='automated_test'||data.medium!=='bot'||typeof data.campaign!=='string'||!/^[a-zA-Z0-9_.-]{1,80}$/.test(data.campaign)))fail();
 if(progressKey.test(key)){
  if(!plain(data)||data.version!==1||!Number.isSafeInteger(data.resetRevision??0)||(data.resetRevision??0)<0)fail();
  return JSON.stringify(normalizeProgress(data));
 }
 if(helpersKey.test(key)&&(!Array.isArray(data)||data.length!==5||data.some(n=>n!==0&&n!==1)))fail();
 if(tutorialsKey.test(key)&&(!Array.isArray(data)||data.length>100||data.some(s=>typeof s!=='string'||s.length>100)))fail();
 if(key===energyKey&&(!plain(data)||!Number.isInteger(data.count)||data.count<0||data.count>5||!(data.nextAt===null||Number.isFinite(data.nextAt)&&data.nextAt>0)||!(data.interval===undefined||[600000,1800000].includes(data.interval))))fail();
 if(key==='ship-audio'&&(!plain(data)||Object.keys(data).some(k=>!['music','effects'].includes(k))||Object.values(data).some(v=>typeof v!=='boolean')))fail();
 if(analyticsKeys.has(key)){
  if(key==='beyond-signal-balance-reporter-v1'&&(!plain(data)||typeof data.id!=='string'||typeof data.token!=='string'||!Number.isSafeInteger(data.sequence)||data.sequence<0))fail();
  if(['beyond-signal-balance-attempts-v1','beyond-signal-balance-outbox-v1'].includes(key)&&(!Array.isArray(data)||data.length>2000))fail();
  if(['beyond-signal-campaign-visit-v1','beyond-signal-campaign-outbox-v1'].includes(key)&&!plain(data))fail();
 }
 return JSON.stringify(data);
}
export function validateBackup(input){
 if(JSON.stringify(input)?.length>maxBytes||!plain(input)||input.format!=='beyond-signal-save'||input.version!==1||!new RegExp(`^${uuid}$`,'i').test(input.id)||!Number.isSafeInteger(input.createdAt)||input.createdAt<0||!plain(input.entries))fail();
 const entries=Object.entries(input.entries);if(entries.length>512)fail();
 const validated=Object.fromEntries(entries.map(([key,value])=>{if(!isTransferKey(key))fail();return [key,validateValue(key,value)];}));
 const visits=[...(validated['beyond-signal-campaign-visit-v1']?[JSON.parse(validated['beyond-signal-campaign-visit-v1'])]:[]),...Object.values(JSON.parse(validated['beyond-signal-campaign-outbox-v1']||'{}'))];
 const bot=visits.find(v=>v?.source==='automated_test'&&v?.medium==='bot');
 if(bot)validated[trafficKey]=JSON.stringify({source:'automated_test',medium:'bot',campaign:typeof bot.campaign==='string'&&/^[a-zA-Z0-9_.-]{1,80}$/.test(bot.campaign)?bot.campaign:'migration'});
 return {format:input.format,version:1,id:input.id,createdAt:input.createdAt,entries:validated};
}
export function exportBackup(storage,{id=crypto.randomUUID(),now=Date.now(),includeUnusedStock=false}={}){
 const entries={};for(let i=0;i<storage.length;i++){const key=storage.key(i);if(isTransferKey(key)){const value=storage.getItem(key);if(value!==null)entries[key]=value;}}
 if(includeUnusedStock)for(const [key,value] of Object.entries(entries))if(progressKey.test(key)){
  const save=JSON.parse(validateValue(key,value)),user=key.includes(':user:')?key.split(':user:')[1]:undefined,stock=stockKey(user,save.resetRevision);
  if(entries[stock]===undefined)entries[stock]=JSON.stringify(freshStock());
 }
 return validateBackup({format:'beyond-signal-save',version:1,id,createdAt:now,entries});
}
function receipts(storage){const raw=storage.getItem(receiptsKey);if(raw===null)return [];const data=JSON.parse(raw);if(!Array.isArray(data)||data.some(x=>typeof x!=='string'))throw Error('Transfer history is unreadable.');return data;}
export function isEmptyProgress(value){
 const save=normalizeProgress(value);
 return save.resetRevision===0&&!Object.entries(save).some(([key,n])=>(key==='completed'||key.endsWith('Completed')||key==='caretakerMet'||key==='riftCrossed')&&n>0);
}
export function summarizeBackup(input){
 const backup=validateBackup(input),saves=Object.entries(backup.entries).filter(([key])=>progressKey.test(key));
 return {guest:saves.some(([key,value])=>key==='to-the-stars-progress-v1'&&!isEmptyProgress(JSON.parse(value))),accounts:saves.filter(([key])=>key.includes(':user:')).length,energy:backup.entries[energyKey]?JSON.parse(backup.entries[energyKey]).count:null};
}
export function planImport(storage,input,{replace=false,now=Date.now()}={}){
 const backup=validateBackup(input),seen=receipts(storage);if(seen.includes(backup.id))return {backup,changes:[],conflicts:[],skipped:[],already:true};
 const conflicts=[],skipped=[],changes=[];
 const analytics=Object.entries(backup.entries).filter(([k])=>analyticsKeys.has(k));
 // Identity and queued reports travel together; never attach old reports to a new reporter.
 const analyticsConflict=[...analyticsKeys].some(k=>{const value=storage.getItem(k);return value!==null&&value!==backup.entries[k];});
 for(const [key,original] of Object.entries(backup.entries)){
  let value=original;
  const before=storage.getItem(key);if(before===value)continue;
  if(analyticsKeys.has(key)){
   if(analyticsConflict){skipped.push(key);continue;}
   if(analytics.length&&!backup.entries['beyond-signal-balance-reporter-v1']){skipped.push(key);continue;}
  }
  if(before!==null){
   if(progressKey.test(key)){
    const current=JSON.parse(validateValue(key,before)),incoming=JSON.parse(value);
    // The same account has one reset lineage. Guest saves may be independent games.
    if(key.includes(':user:')){
     const merged=mergeProgress(current,incoming);
     value=JSON.stringify(merged);
     if(value!==before)changes.push({key,before,after:value});
     continue;
    }
    if(!replace&&isEmptyProgress(current)){
     changes.push({key,before,after:value});continue;
    }
   }
   if(key===energyKey){
    const a=JSON.parse(validateValue(key,before)),b=JSON.parse(value);
    const current={...recoverLives(a,now,a.interval??RECHARGE_MS),interval:a.interval??RECHARGE_MS};
    const incoming={...recoverLives(b,now,b.interval??RECHARGE_MS),interval:b.interval??RECHARGE_MS};
    // A second export must not refill charges spent on the new address.
    const merged=incoming.count<current.count?incoming:current;
    if(incoming.count===current.count&&incoming.nextAt&&current.nextAt)merged.nextAt=Math.min(incoming.nextAt,current.nextAt);
    value=JSON.stringify(merged);if(value!==before)changes.push({key,before,after:value});continue;
   }
   if(helpersKey.test(key)){
    const current=JSON.parse(validateValue(key,before)),incoming=JSON.parse(value);
    value=JSON.stringify(current.map((n,i)=>Math.min(n,incoming[i])));
    if(value!==before)changes.push({key,before,after:value});continue;
   }
   conflicts.push(key);
   if(!replace){skipped.push(key);continue;}
  }
  changes.push({key,before,after:value});
 }
 return {backup,changes,conflicts,skipped,already:false};
}
function write(storage,key,value){if(value===null)storage.removeItem(key);else storage.setItem(key,value);if(storage.getItem(key)!==value)throw Error('Could not verify the saved data.');}
export function readPending(storage){
 const raw=storage.getItem(TRANSFER_PENDING);if(raw===null)return null;
 const journal=JSON.parse(raw);
 if(!plain(journal)||journal.version!==1||!new RegExp(`^${uuid}$`,'i').test(journal.id)||!Array.isArray(journal.changes)||journal.changes.length>512)fail();
 for(const change of journal.changes){if(!plain(change)||!isTransferKey(change.key)||!(change.before===null||typeof change.before==='string'))fail();validateValue(change.key,change.after);}
 return journal;
}
export function recoverTransfer(storage,action='rollback'){
 if(action!=='rollback'&&action!=='finish')throw Error('Unknown recovery action.');
 const journal=readPending(storage);if(!journal)return;
 for(const c of journal.changes)write(storage,c.key,action==='finish'?c.after:c.before);
 if(action==='finish')write(storage,receiptsKey,JSON.stringify([...new Set([...receipts(storage),journal.id])].slice(-200)));
 write(storage,TRANSFER_PENDING,null);
}
export function importBackup(storage,input,options={}){
 if(readPending(storage))throw Error('Recover the interrupted transfer first.');
 const plan=planImport(storage,input,options);if(plan.already)return plan;
 // A conflict-only preview must not consume the backup ID before the player chooses.
 if(!plan.changes.length&&plan.conflicts.length)return plan;
 const journal={version:1,id:plan.backup.id,changes:plan.changes};
 write(storage,TRANSFER_PENDING,JSON.stringify(journal));
 // Keep the journal on failure. The dedicated page can resume or roll back every key.
 recoverTransfer(storage,'finish');return plan;
}
