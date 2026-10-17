import {normalizeProgress} from './progressStorage.js';

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
const maxBytes=4*1024*1024;
const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.getPrototypeOf(value)===Object.prototype;
function fail(){throw new Error('Invalid or unsupported save backup.');}
export function isTransferKey(key){return progressKey.test(key)||helpersKey.test(key)||tutorialsKey.test(key)||seenKey.test(key)||analyticsKeys.has(key)||preferences.has(key)||key===energyKey;}
function validateValue(key,value){
 if(typeof value!=='string'||value.length>maxBytes)fail();
 if(key==='to-the-stars-language'){if(!['en','cs'].includes(value))fail();return value;}
 if(seenKey.test(key)){if(value!=='seen')fail();return value;}
 if(key==='beyond-signal-balance-cloud-migrated-v1'){if(value!=='1')fail();return value;}
 let data;try{data=JSON.parse(value);}catch{fail();}
 if(progressKey.test(key)){
  if(!plain(data)||data.version!==1||!Number.isSafeInteger(data.resetRevision)||data.resetRevision<0)fail();
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
 return {format:input.format,version:1,id:input.id,createdAt:input.createdAt,entries:Object.fromEntries(entries.map(([key,value])=>{if(!isTransferKey(key))fail();return [key,validateValue(key,value)];}))};
}
export function exportBackup(storage,{id=crypto.randomUUID(),now=Date.now()}={}){
 const entries={};for(let i=0;i<storage.length;i++){const key=storage.key(i);if(isTransferKey(key)){const value=storage.getItem(key);if(value!==null)entries[key]=value;}}
 return validateBackup({format:'beyond-signal-save',version:1,id,createdAt:now,entries});
}
function receipts(storage){const raw=storage.getItem(receiptsKey);if(raw===null)return [];const data=JSON.parse(raw);if(!Array.isArray(data)||data.some(x=>typeof x!=='string'))throw Error('Transfer history is unreadable.');return data;}
export function planImport(storage,input,{replace=false}={}){
 const backup=validateBackup(input),seen=receipts(storage);if(seen.includes(backup.id))return {backup,changes:[],conflicts:[],skipped:[],already:true};
 const conflicts=[],skipped=[],changes=[];
 const analytics=Object.entries(backup.entries).filter(([k])=>analyticsKeys.has(k));
 // Identity and queued reports travel together; never attach old reports to a new reporter.
 const analyticsConflict=[...analyticsKeys].some(k=>{const value=storage.getItem(k);return value!==null&&value!==backup.entries[k];});
 for(const [key,value] of Object.entries(backup.entries)){
  const before=storage.getItem(key);if(before===value)continue;
  if(analyticsKeys.has(key)){
   if(analyticsConflict){skipped.push(key);continue;}
   if(analytics.length&&!backup.entries['beyond-signal-balance-reporter-v1']){skipped.push(key);continue;}
  }
  if(before!==null){
   conflicts.push(key);
   if(!replace){skipped.push(key);continue;}
   // An older account reset must never overwrite a newer reset on this device.
   if(progressKey.test(key)&&key.includes(':user:')){
    const current=JSON.parse(validateValue(key,before)),incoming=JSON.parse(value);
    if(current.resetRevision>incoming.resetRevision){skipped.push(key);continue;}
   }
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
