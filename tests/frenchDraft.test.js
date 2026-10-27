import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chaptersFor} from '../src/chapters.js';
import {levelGroups} from '../src/levelCatalog.js';
import {elysiumRoute,elysiumRouteLog,elysiumArrivalLog} from '../src/elysium.js';
import {departurePanels} from '../src/departureStory.js';
import {asterJumpPanels} from '../src/asterJumpStory.js';
import {elysiumArrivalPanels} from '../src/elysiumArrivalStory.js';
import {jumpLog} from '../src/haven.js';
import {echoDeparturePanels} from '../src/echoDepartureStory.js';
import {riftStoryPanels} from '../src/riftStory.js';
import {riftArrivalLog} from '../src/rift.js';
import {researchStoryPanels} from '../src/researchStory.js';
import {relayStoryPanels} from '../src/relayStory.js';
import {caretakerPanels,caretakerLog} from '../src/caretakerStory.js';
import {journeyStories} from '../src/journeyStories.js';
import {translate,dataText,missingTranslations} from '../src/i18n/translate.js';
import {loadLocaleCatalog,catalogProblems,message} from '../src/i18n/messages.js';
import {releasedLocales} from '../src/i18n/locales.js';

test('French draft covers chapters 1–3 repairs, journals and transition panels without changing numbers',async()=>{
 await loadLocaleCatalog('fr');missingTranslations.clear();
 const fields=new Set(['name','room','thought','lesson','objective','result','action','title','text','source','time','caption','complete','chapter','finishLabel']);
 const counts=s=>(s.match(/\d+/g)??[]).sort();
 function audit(value){if(!value||typeof value!=='object')return;for(const[k,v]of Object.entries(value)){
  if(fields.has(k)&&typeof v==='string'){
   if(k==='chapter'&&/^[a-z-]+$/.test(v))continue;
   assert.deepEqual(counts(translate(v,'fr')),counts(v),v);
  }else if(v&&typeof v==='object')audit(v);
 }}
 for(const[,repairs]of levelGroups.slice(0,8))audit(repairs);
 for(const file of ['logEntries','airlockRepairs','navigationRepairs','crewRepairs','galleyRepairs','engineRepairs','exteriorRepairs','departure'])for(const[k,v]of Object.entries(await import(`../src/${file}.js`)))if(/Logs$|Log$|logEntries$/.test(k))audit(v);
 for(const c of chaptersFor({}).slice(1,3))audit(c.sections);
 audit([elysiumRoute,elysiumRouteLog,elysiumArrivalLog,departurePanels,asterJumpPanels,elysiumArrivalPanels,jumpLog]);
 assert.deepEqual([...missingTranslations],[]);
});

test('French shared runtime is complete and French is available to public players',async()=>{
 const catalog=await loadLocaleCatalog('fr');
 const runtime=JSON.parse(readFileSync(new URL('../src/i18n/catalogs/runtime/en.json',import.meta.url)));
 for(const id of Object.keys(runtime))assert.equal(typeof catalog[id],typeof runtime[id],id);
 assert.deepEqual(catalogProblems('fr',catalog).filter(p=>!p.endsWith(': missing translation')),[]);
 assert.deepEqual(releasedLocales.map(l=>l.code),['en','cs','de','fr','es']);
 assert.equal(message('common.movesLeft',{count:1},'fr'),'1 coup restant');
 assert.equal(message('common.movesLeft',{count:8},'fr'),'8 coups restants');
 assert.equal(translate('Covered Blue comet, row 3, column 7','fr'),'Sous capot : Comète bleue, ligne 3, colonne 7');
 assert.equal(translate('Continue to the data halls →','fr'),'Continuer vers les salles de données →');
 assert.equal(translate('Continue to the simulation chamber →','fr'),'Continuer vers la chambre de simulation →');
 assert.equal(translate('Continue to the central memory →','fr'),'Continuer vers la mémoire centrale →');
 assert.equal(translate('Continue to the solar beacon →','fr'),'Continuer vers la balise solaire →');
});

test('French objectives retain live counts throughout all 69 puzzles in chapters 1–3',async()=>{
 await loadLocaleCatalog('fr');const chapters=chaptersFor({}).slice(0,3);assert.equal(chapters.reduce((sum,c)=>sum+c.total,0),69);
 const groups=levelGroups.slice(0,16),counts=s=>(s.match(/\d+/g)??[]).map(Number).sort((a,b)=>a-b);
 assert.equal(groups.flatMap(([,r])=>r).length,69);
 for(const[,repairs]of groups)for(const repair of repairs)for(const source of [repair.objective,repair.objective.replace(/\d+/g,n=>String(+n+7))]){
  const translated=translate(source,'fr');assert.deepEqual(counts(translated),counts(source),repair.id);
  assert.doesNotMatch(translated,/\b(?:Collect|Match|Break|protective covers)\b/,repair.id);
 }
});

test('French chapters 4–8 cover repairs, journals and all associated story panels',async()=>{
 await loadLocaleCatalog('fr');missingTranslations.clear();
 const fields=new Set(['name','room','thought','lesson','objective','result','action','title','text','source','time','caption','complete','chapter','finishLabel']);
 const counts=s=>(s.match(/\d+/g)??[]).sort();
 function audit(value){if(!value||typeof value!=='object')return;for(const[k,v]of Object.entries(value)){
  if(fields.has(k)&&typeof v==='string'){
   if(k==='chapter'&&/^[a-z-]+$/.test(v))continue;
   assert.deepEqual(counts(translate(v,'fr')),counts(v),v);
  }else if(v&&typeof v==='object')audit(v);
 }}
 const chapters=chaptersFor({}).slice(3,8);assert.equal(chapters.reduce((n,c)=>n+c.total,0),98);
 for(const chapter of chapters){dataText(chapter,'fr');audit(chapter.sections);}
 audit([echoDeparturePanels,riftStoryPanels,riftArrivalLog,researchStoryPanels,relayStoryPanels,caretakerPanels,caretakerLog,journeyStories.filter(s=>s.chapter==='refuge')]);
 assert.deepEqual([...missingTranslations],[]);
 const repairs=chapters.flatMap(c=>c.sections.flatMap(s=>s.repairs));
 for(const repair of repairs){const source=repair.objective.replace(/\d+/g,n=>String(+n+7));assert.deepEqual(counts(translate(source,'fr')),counts(source),repair.id);}
});

test('French complete catalog covers all 200 levels, journals and the ending without missing translations',async()=>{
 const catalog=await loadLocaleCatalog('fr');assert.deepEqual(catalogProblems('fr',catalog),[]);missingTranslations.clear();
 const fields=new Set(['name','room','thought','lesson','objective','result','action','title','text','source','time','caption','complete','finishLabel']);
 const counts=s=>(s.match(/\d+/g)??[]).map(Number).sort((a,b)=>a-b);
 function audit(value){if(!value||typeof value!=='object')return;for(const[k,v]of Object.entries(value)){
  if(fields.has(k)&&typeof v==='string')assert.deepEqual(counts(translate(v,'fr')),counts(v),v);
  else if(v&&typeof v==='object')audit(v);
 }}
 const chapters=chaptersFor({});assert.equal(chapters.reduce((n,c)=>n+c.total,0),200);
 for(const chapter of chapters){dataText(chapter,'fr');audit(chapter.sections);}
 audit(journeyStories);
 for(const file of ['archive','signalNetwork'])for(const[k,v]of Object.entries(await import(`../src/${file}.js`)))if(/Logs$|Log$|logEntries$/.test(k))audit(v);
 for(const[,repairs]of levelGroups)for(const repair of repairs){const source=repair.objective.replace(/\d+/g,n=>String(+n+7));assert.deepEqual(counts(translate(source,'fr')),counts(source),repair.id);}
 // This unchanged place name has no source-catalog ID in any language.
 assert.deepEqual([...missingTranslations].filter(value=>value!=='fr:Kepler Reach'),[]);
});
