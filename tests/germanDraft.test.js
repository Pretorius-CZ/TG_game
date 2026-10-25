import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {levelGroups} from '../src/levelCatalog.js';
import {loadLocaleCatalog,message,catalogProblems} from '../src/i18n/messages.js';
import {translate,dataText,missingTranslations} from '../src/i18n/translate.js';
import {releasedLocales} from '../src/i18n/locales.js';
import {destinations} from '../src/destinations.js';
import {asterJumpPanels} from '../src/asterJumpStory.js';
import {jumpLog} from '../src/haven.js';

test('German draft covers first chapter repair and journal content without enabling a public release',async()=>{
 await loadLocaleCatalog('de');missingTranslations.clear();
 const fields=new Set(['name','room','thought','lesson','objective','result','action','title','text','source','time']);
 function audit(value){
  if(!value||typeof value!=='object')return;
  for(const [key,item]of Object.entries(value)){
   if(fields.has(key)&&typeof item==='string')translate(item,'de');
   else if(item&&typeof item==='object')audit(item);
  }
 }
 for(const [,repairs]of levelGroups.slice(0,8))audit(repairs);
 for(const file of ['logEntries','airlockRepairs','navigationRepairs','crewRepairs','galleyRepairs','engineRepairs','exteriorRepairs','departure']){
  for(const [key,value]of Object.entries(await import(`../src/${file}.js`)))if(/Logs$|Log$|logEntries$/.test(key))audit(value);
 }
 assert.deepEqual([...missingTranslations],[]);
 assert.equal(translate('Service power','de'),'Hilfsstromversorgung');
 assert.equal(translate('Course verified','de'),'Kurs bestätigt');
 assert.equal(translate('An unfamiliar sky','de'),'Ein fremder Himmel');
 assert.deepEqual(releasedLocales.map(l=>l.code),['en','cs']);
});

test('German second chapter covers all 24 repairs, journals, map destinations and the gate arrival',async()=>{
 await loadLocaleCatalog('de');missingTranslations.clear();
 const fields=new Set(['name','room','thought','lesson','objective','result','action','title','text','source','time','caption','complete']);
 const unchanged=new Set(['Haven','Aster Veil','Kepler Reach','Elysium']);
 function audit(value){
  if(!value||typeof value!=='object')return;
  for(const [key,item]of Object.entries(value)){
   if(fields.has(key)&&typeof item==='string'){
    const translated=translate(item,'de');
    assert.deepEqual(translated.match(/\d+/g),item.match(/\d+/g),item);
    if(/[a-z]{3}/i.test(item)&&!unchanged.has(item))assert.notEqual(translated,item,item);
   }else if(item&&typeof item==='object')audit(item);
  }
 }
 for(const scene of ['mine','ice','wreck','haven']){assert.equal(destinations[scene].repairs.length,6);audit(destinations[scene]);}
 audit(asterJumpPanels);audit(jumpLog);
 assert.deepEqual([...missingTranslations],[]);
 assert.equal(translate('Silent Mine / Survey 3','de'),'Stille Mine / Erkundung 3');
 assert.equal(translate('Haven / Restoration 6','de'),'Haven / Wiederherstellung 6');
 assert.equal(translate('0/6 tasks · Follow the signal into the outpost.','de'),'0/6 Aufgaben · Folge dem Signal in den Außenposten.');
 assert.equal(translate('HAVEN / JUMP GATE','de'),'HAVEN / SPRUNGTOR');
});

test('German dynamic objectives preserve every count in all 200 levels after balance changes',async()=>{
 await loadLocaleCatalog('de');
 const counts=value=>(value.match(/\d+/g)??[]).map(Number).sort((a,b)=>a-b);
 for(const [,repairs]of levelGroups)for(const repair of repairs){
  for(const objective of [repair.objective,repair.objective.replace(/\d+/g,n=>String(+n+7))]){
   const translated=translate(objective,'de');
   assert.deepEqual(counts(translated),counts(objective),repair.id);
   if(/protective covers?/.test(objective))assert.match(translated,/Schutzabdeckungen/,repair.id);
   if(objective.includes('Charge every resonator.'))assert.match(translated,/Lade alle Resonatoren auf\./,repair.id);
  }
 }
 assert.equal(translate('1 moves left','de'),'Noch 1 Zug');
 assert.equal(translate('8 moves left','de'),'Noch 8 Züge');
 assert.equal(translate('Covered Blue comet, row 3, column 7','de'),'Abgedeckt: Blauer Komet, Zeile 3, Spalte 7');
});

test('German UI and help catalogs retain parameters and all topics; Czech copy stays unchanged',async()=>{
 const catalog=await loadLocaleCatalog('de');
 assert.deepEqual(catalogProblems('de',catalog).filter(p=>!p.endsWith(': missing translation')),[]);
 const en=JSON.parse(readFileSync(new URL('../src/i18n/catalogs/runtime/en.json',import.meta.url)));
 for(const id of Object.keys(en))assert.equal(typeof catalog[id],typeof en[id],id);
 assert.match(message('help.chargeUse',{},'de'),/andere Stein eine Kombination bildet/);
 assert.doesNotMatch(message('help.chargeUse',{},'en'),/cannot be moved/);
 assert.equal(message('common.stars',{count:2,total:3},'de'),'2 von 3 Sternen');
 assert.equal(translate('Stars','cs'),'Hvězdy');
 assert.equal(dataText(['The ship','Loď'],'cs'),'Loď');
 assert.equal(dataText({en:'The ship',cs:'Loď'},'de'),'Das Schiff');
});
