import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeProgress,SAVE_KEY} from '../src/progressStorage.js';
import {exportBackup,validateBackup,planImport,importBackup,recoverTransfer,readPending,TRANSFER_PENDING} from '../src/saveTransfer.js';
import {validTransferMessage} from '../src/transferOrigins.js';
import {migrationCampaign} from '../src/campaignPolicy.js';
import {stockKey} from '../src/helperStock.js';
const id='12345678-1234-4234-9234-123456789abc';
function memory(initial={}){const data=new Map(Object.entries(initial));return {get length(){return data.size;},key:i=>[...data.keys()][i]??null,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};}
const save=n=>JSON.stringify(normalizeProgress({airlockCompleted:n}));

test('German preference transfers with unchanged saves and incomplete languages are rejected',()=>{
 const source=memory({[SAVE_KEY]:save(2),'to-the-stars-language':'de'}),backup=exportBackup(source,{id}),target=memory();
 importBackup(target,backup);
 assert.equal(target.getItem('to-the-stars-language'),'de');assert.equal(target.getItem(SAVE_KEY),save(2));
 assert.equal(source.getItem(SAVE_KEY),save(2));
 for(const code of ['pt-BR','de-DE','fr-FR','es-ES','invalid'])assert.throws(()=>exportBackup(memory({'to-the-stars-language':code}),{id}));
});

test('released French preference transfers without changing guest progress',()=>{
 const source=memory({[SAVE_KEY]:save(2),'to-the-stars-language':'fr'}),target=memory();
 importBackup(target,exportBackup(source,{id}));
 assert.equal(target.getItem('to-the-stars-language'),'fr');assert.equal(target.getItem(SAVE_KEY),save(2));
});
test('backup preserves guest and account saves, energy deadlines, stock and preferences without auth tokens',()=>{
 const values={[SAVE_KEY]:save(2),[`${SAVE_KEY}:user:${id}`]:save(3),'to-the-stars-lives-v1':JSON.stringify({count:0,nextAt:1792253000000,interval:600000}),[`to-the-stars-helpers-v1:guest:0`]:'[0,1,0,1,0]','to-the-stars-language':'cs','ship-audio':'{"music":false,"effects":true}',[`beyond-signal-tutorials-v1:${id}`]:'["pulse"]','beyond-the-signal-story:guest:0:research-return':'seen','sb-project-auth-token':'secret','unrelated':'private'};
 const source=memory(values),backup=exportBackup(source,{id}),target=memory();
 assert.equal(backup.entries['sb-project-auth-token'],undefined);assert.equal(backup.entries.unrelated,undefined);
 importBackup(target,backup);
 for(const [key,value] of Object.entries(backup.entries))assert.equal(target.getItem(key),value);
 assert.equal(source.getItem(SAVE_KEY),values[SAVE_KEY]);assert.equal(readPending(target),null);
});
test('replaying a backup cannot refill spent energy or helpers, even with replace selected',()=>{
 const source=memory({'to-the-stars-lives-v1':'{"count":5,"nextAt":null}', 'to-the-stars-helpers-v1:guest:0':'[1,1,1,1,1]'}),backup=exportBackup(source,{id}),target=memory();
 importBackup(target,backup);target.setItem('to-the-stars-lives-v1','{"count":0,"nextAt":1000}');target.setItem('to-the-stars-helpers-v1:guest:0','[0,0,0,0,0]');
 assert.equal(importBackup(target,backup,{replace:true}).already,true);assert.equal(JSON.parse(target.getItem('to-the-stars-lives-v1')).count,0);assert.equal(target.getItem('to-the-stars-helpers-v1:guest:0'),'[0,0,0,0,0]');
});
test('conflicting progress is kept by default, intentional replacement is explicit',()=>{
 const backup=exportBackup(memory({[SAVE_KEY]:save(1)}),{id}),target=memory({[SAVE_KEY]:save(3)});
 assert.deepEqual(planImport(target,backup).conflicts,[SAVE_KEY]);importBackup(target,backup);assert.equal(target.getItem(SAVE_KEY),save(3));
 importBackup(target,backup,{replace:true});assert.equal(target.getItem(SAVE_KEY),save(1));
});
test('a newer account reset cannot be replaced by an older snapshot',()=>{
 const key=`${SAVE_KEY}:user:${id}`,target=memory({[key]:JSON.stringify(normalizeProgress({resetRevision:5}))}),backup=exportBackup(memory({[key]:save(3)}),{id});
 importBackup(target,backup,{replace:true});assert.equal(JSON.parse(target.getItem(key)).resetRevision,5);
});
test('invalid/unknown backup keys and versions are rejected before writing',()=>{
 const backup=exportBackup(memory({[SAVE_KEY]:save(1)}),{id}),target=memory();
 for(const changed of [{...backup,version:2},{...backup,entries:{'sb-project-auth-token':'secret'}},{...backup,entries:{'to-the-stars-helpers-v1:guest:0':'[9]'}},{...backup,entries:{'to-the-stars-lives-v1':'{"count":99,"nextAt":null}'}}])assert.throws(()=>importBackup(target,changed));
 assert.equal(target.length,0);assert.throws(()=>validateBackup({...backup,id:'wrong'}));
});
test('interrupted multi-key writes survive refresh and can be resumed without overwriting the journal',()=>{
 const target=memory({[SAVE_KEY]:save(1)}),backup=exportBackup(memory({[SAVE_KEY]:save(3),'to-the-stars-language':'cs'}),{id});
 const original=target.setItem;let fail=true;
 target.setItem=(key,value)=>{if(key==='to-the-stars-language'&&fail)throw Error('quota');original(key,value);};
 assert.throws(()=>importBackup(target,backup,{replace:true}),/quota/);assert.ok(readPending(target));
 assert.throws(()=>importBackup(target,backup),/Recover/);
 fail=false;recoverTransfer(target,'finish');assert.equal(target.getItem(SAVE_KEY),save(3));assert.equal(target.getItem('to-the-stars-language'),'cs');assert.equal(target.getItem(TRANSFER_PENDING),null);
 assert.equal(importBackup(target,backup,{replace:true}).already,true);
});
test('interrupted writes can restore the original target values and remove newly added keys',()=>{
 const target=memory({[SAVE_KEY]:save(1)}),backup=exportBackup(memory({[SAVE_KEY]:save(3),'to-the-stars-language':'cs'}),{id}),original=target.setItem;
 target.setItem=(key,value)=>{if(key==='to-the-stars-language')throw Error('quota');original(key,value);};
 assert.throws(()=>importBackup(target,backup,{replace:true}));recoverTransfer(target,'rollback');
 assert.equal(target.getItem(SAVE_KEY),save(1));assert.equal(target.getItem('to-the-stars-language'),null);assert.equal(readPending(target),null);
});
test('a failed journal write leaves the saved game unchanged',()=>{
 const target=memory({[SAVE_KEY]:save(1)}),backup=exportBackup(memory({[SAVE_KEY]:save(3)}),{id}),original=target.setItem;
 target.setItem=(key,value)=>{if(key===TRANSFER_PENDING)throw Error('quota');original(key,value);};
 assert.throws(()=>importBackup(target,backup,{replace:true}));assert.equal(target.getItem(SAVE_KEY),save(1));
});
test('analytics identity and queued bot reports stay together; target identity is never replaced',()=>{
 const source=memory({'beyond-signal-balance-reporter-v1':JSON.stringify({id,token:id,sequence:2}),'beyond-signal-balance-outbox-v1':'[{"payload":{"attemptId":"test","traffic":"bot"}}]','beyond-signal-campaign-visit-v1':'{"source":"automated_test","medium":"bot","campaign":"qa_01"}'}),backup=exportBackup(source,{id}),target=memory();
 importBackup(target,backup);assert.equal(target.getItem('beyond-signal-campaign-visit-v1'),source.getItem('beyond-signal-campaign-visit-v1'));
 const other=memory({'beyond-signal-balance-reporter-v1':'{"id":"another","token":"secret","sequence":1}'});importBackup(other,backup,{replace:true});assert.equal(other.getItem('beyond-signal-balance-outbox-v1'),null);assert.match(other.getItem('beyond-signal-balance-reporter-v1'),/another/);
});
test('cross-origin handshake requires the exact origin, window, nonce and message type',()=>{
 const source={},nonce=id,expected={origin:'https://playbeyondthesignal.com',source,nonce},event={origin:expected.origin,source,data:{channel:'beyond-signal-transfer-v1',nonce,type:'backup'}};
 assert.equal(validTransferMessage(event,expected,'backup'),true);
 for(const bad of [{...event,origin:'https://evil.example'},{...event,source:{}},{...event,data:{...event.data,nonce:'wrong'}},{...event,data:{...event.data,type:'saved'}}])assert.equal(validTransferMessage(bad,expected,'backup'),false);
});
test('a default save created by opening the new website does not block the original guest progress',()=>{
 const target=memory({[SAVE_KEY]:save(0)}),backup=exportBackup(memory({[SAVE_KEY]:save(3)}),{id});
 const plan=planImport(target,backup);assert.equal(plan.conflicts.length,0);importBackup(target,backup);assert.equal(JSON.parse(target.getItem(SAVE_KEY)).airlockCompleted,3);
});
test('older version-one saves from before account resets migrate with revision zero',()=>{
 const backup=exportBackup(memory({[SAVE_KEY]:'{"version":1,"airlockCompleted":2}'}),{id}),target=memory();importBackup(target,backup);
 assert.equal(JSON.parse(target.getItem(SAVE_KEY)).resetRevision,0);assert.equal(JSON.parse(target.getItem(SAVE_KEY)).airlockCompleted,2);
});
test('source export materializes unused starter stock while target export cannot invent it',()=>{
 const key=`${SAVE_KEY}:user:${id}`,source=memory({[key]:save(3)});
 const old=exportBackup(source,{id,includeUnusedStock:true});assert.equal(old.entries[stockKey(id)],'[1,1,1,1,1]');
 assert.equal(exportBackup(source,{id}).entries[stockKey(id)],undefined);
});
test('account copies merge progress rather than replacing a newer completed task',()=>{
 const key=`${SAVE_KEY}:user:${id}`,target=memory({[key]:save(3)}),backup=exportBackup(memory({[key]:save(1)}),{id});
 importBackup(target,backup,{replace:true});assert.equal(JSON.parse(target.getItem(key)).airlockCompleted,3);
});
test('a different backup ID cannot refill energy or helpers spent after an earlier migration',()=>{
 const now=Date.now(),target=memory({'to-the-stars-lives-v1':JSON.stringify({count:1,nextAt:now+300000,interval:600000}),'to-the-stars-helpers-v1:guest:0':'[0,0,1,0,0]'}),backup=exportBackup(memory({'to-the-stars-lives-v1':JSON.stringify({count:4,nextAt:now+400000,interval:600000}),'to-the-stars-helpers-v1:guest:0':'[1,1,1,1,1]'}),{id});
 importBackup(target,backup,{replace:true,now});assert.equal(JSON.parse(target.getItem('to-the-stars-lives-v1')).count,1);assert.equal(target.getItem('to-the-stars-helpers-v1:guest:0'),'[0,0,1,0,0]');
});
test('fresh target energy is replaced by the original pending recovery without creating charges',()=>{
 const now=Date.now(),target=memory({'to-the-stars-lives-v1':'{"count":5,"nextAt":null,"interval":600000}'}),backup=exportBackup(memory({'to-the-stars-lives-v1':JSON.stringify({count:2,nextAt:now+300000,interval:600000})}),{id});
 importBackup(target,backup,{now});assert.equal(JSON.parse(target.getItem('to-the-stars-lives-v1')).count,2);assert.equal(JSON.parse(target.getItem('to-the-stars-lives-v1')).nextAt,now+300000);
});
test('bot classification survives transfer even when target analytics already has its own identity',()=>{
 const target=memory({'beyond-signal-balance-reporter-v1':'{"id":"target","token":"private","sequence":0}'}),backup=exportBackup(memory({'beyond-signal-campaign-visit-v1':'{"source":"automated_test","medium":"bot","campaign":"qa_01"}'}),{id});
 importBackup(target,backup);const marker=JSON.parse(target.getItem('beyond-signal-migrated-traffic-v1'));
 assert.equal(migrationCampaign({source:'direct',medium:'none',campaign:'none'},marker).medium,'bot');
 assert.equal(target.getItem('beyond-signal-balance-reporter-v1'),' {"id":"target","token":"private","sequence":0}'.trim());
 assert.equal(migrationCampaign({source:'automated_test',medium:'bot',campaign:'qa_02'},marker).campaign,'qa_02');
});
