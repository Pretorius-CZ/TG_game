import test from'node:test';
import assert from'node:assert/strict';
import{readFileSync}from'node:fs';
import{chaptersFor}from'../src/chapters.js';
import{levelGroups}from'../src/levelCatalog.js';
import{elysiumRoute,elysiumRouteLog,elysiumArrivalLog}from'../src/elysium.js';
import{departurePanels}from'../src/departureStory.js';
import{asterJumpPanels}from'../src/asterJumpStory.js';
import{elysiumArrivalPanels}from'../src/elysiumArrivalStory.js';
import{jumpLog}from'../src/haven.js';
import{translate,dataText,missingTranslations}from'../src/i18n/translate.js';
import{loadLocaleCatalog,catalogProblems,message}from'../src/i18n/messages.js';
import{releasedLocales,matchLocale}from'../src/i18n/locales.js';

test('Spanish draft covers chapter 1–3 repairs, journals and transition panels without changing numbers',async()=>{
 await loadLocaleCatalog('es');missingTranslations.clear();
 const fields=new Set(['name','room','thought','lesson','objective','result','action','title','text','source','time','caption','complete','chapter','finishLabel']);
 const counts=s=>(s.match(/\d+/g)??[]).sort();
 function audit(value){if(!value||typeof value!=='object')return;for(const[k,v]of Object.entries(value)){
  if(fields.has(k)&&typeof v==='string'){
   if(k==='chapter'&&/^[a-z-]+$/.test(v))continue;
   assert.deepEqual(counts(translate(v,'es')),counts(v),v);
  }else if(v&&typeof v==='object')audit(v);
 }}
 for(const[,repairs]of levelGroups.slice(0,8))audit(repairs);
 for(const file of['logEntries','airlockRepairs','navigationRepairs','crewRepairs','galleyRepairs','engineRepairs','exteriorRepairs','departure'])for(const[k,v]of Object.entries(await import(`../src/${file}.js`)))if(/Logs$|Log$|logEntries$/.test(k))audit(v);
 for(const chapter of chaptersFor({}).slice(1,3))audit(chapter.sections);
 audit([elysiumRoute,elysiumRouteLog,elysiumArrivalLog,departurePanels,asterJumpPanels,elysiumArrivalPanels,jumpLog]);
 assert.deepEqual([...missingTranslations],[]);
});

test('Spanish runtime preserves parameters and plural forms and the edition is publicly selectable',async()=>{
 const catalog=await loadLocaleCatalog('es'),runtime=JSON.parse(readFileSync(new URL('../src/i18n/catalogs/runtime/en.json',import.meta.url)));
 for(const id of Object.keys(runtime))assert.equal(typeof catalog[id],typeof runtime[id],id);
 assert.deepEqual(catalogProblems('es',catalog).filter(p=>!p.endsWith(': missing translation')),[]);
 assert.deepEqual(releasedLocales.map(l=>l.code),['en','cs','de','fr','es']);assert.equal(matchLocale('es'),'es');
 assert.equal(message('common.movesLeft',{count:1},'es'),'Queda 1 movimiento');
 assert.equal(message('common.movesLeft',{count:8},'es'),'Quedan 8 movimientos');
 assert.equal(translate('Covered Blue comet, row 3, column 7','es'),'Con cubierta: Cometa azul, fila 3, columna 7');
});

test('Spanish objectives preserve changing counts throughout all 69 puzzles in chapters 1–3',async()=>{
 await loadLocaleCatalog('es');const chapters=chaptersFor({}).slice(0,3);assert.equal(chapters.reduce((n,c)=>n+c.total,0),69);
 const groups=levelGroups.slice(0,16),counts=s=>(s.match(/\d+/g)??[]).map(Number).sort((a,b)=>a-b);
 assert.equal(groups.flatMap(([,repairs])=>repairs).length,69);
 for(const[,repairs]of groups)for(const repair of repairs)for(const source of[repair.objective,repair.objective.replace(/\d+/g,n=>String(+n+7))]){
  const translated=translate(source,'es');assert.deepEqual(counts(translated),counts(source),repair.id);
  assert.doesNotMatch(translated,/\b(?:Collect|Match|Break|protective covers)\b/,repair.id);
 }
});

test('Spanish chapters 4–6 cover repairs, journals, transitions and all 51 changing objectives',async()=>{
 await loadLocaleCatalog('es');missingTranslations.clear();
 const fields=new Set(['name','room','thought','lesson','objective','result','action','title','text','source','time','caption','complete','chapter','finishLabel']);
 const counts=s=>(s.match(/\d+/g)??[]).map(Number).sort((a,b)=>a-b);
 function audit(value){if(!value||typeof value!=='object')return;for(const[k,v]of Object.entries(value)){
  if(fields.has(k)&&typeof v==='string'){
   if(k==='chapter'&&/^[a-z-]+$/.test(v))continue;
   assert.deepEqual(counts(translate(v,'es')),counts(v),v);
  }else if(v&&typeof v==='object')audit(v);
 }}
 const chapters=chaptersFor({}).slice(3,6);assert.equal(chapters.reduce((n,c)=>n+c.total,0),51);
 for(const chapter of chapters){dataText(chapter,'es');audit(chapter.sections);}
 for(const file of['elysium','echoDepartureStory','rift','riftStory','garden','research','relay','researchStory','relayStory'])for(const[k,v]of Object.entries(await import(`../src/${file}.js`)))if(/Logs$|Log$|Panels$/.test(k))audit(v);
 for(const repair of chapters.flatMap(c=>c.sections.flatMap(s=>s.repairs))){
  const source=repair.objective.replace(/\d+/g,n=>String(+n+7)),translated=translate(source,'es');
  assert.deepEqual(counts(translated),counts(source),repair.id);assert.doesNotMatch(translated,/\b(?:Collect|Match|Break|protective covers)\b/,repair.id);
 }
 assert.deepEqual([...missingTranslations],[]);
});

test('Spanish complete draft covers all 200 levels and the ending with no catalog problems',async()=>{
 const catalog=await loadLocaleCatalog('es');assert.deepEqual(catalogProblems('es',catalog),[]);missingTranslations.clear();
 const fields=new Set(['name','room','thought','lesson','objective','result','action','title','text','source','time','caption','complete','finishLabel']);
 const counts=s=>(s.match(/\d+/g)??[]).map(Number).sort((a,b)=>a-b);
 function audit(value){if(!value||typeof value!=='object')return;for(const[k,v]of Object.entries(value)){
  if(fields.has(k)&&typeof v==='string')assert.deepEqual(counts(translate(v,'es')),counts(v),v);
  else if(v&&typeof v==='object')audit(v);
 }}
 const chapters=chaptersFor({});assert.equal(chapters.reduce((n,c)=>n+c.total,0),200);
 for(const chapter of chapters){dataText(chapter,'es');audit(chapter.sections);}
 for(const file of['nightGarden','nightGrove','nightRoot','nightSanctuary','caretakerStory','refuge','refugeHomes','refugeMedical','returnCorridor','refugeArrival','archive','signalNetwork','journeyStories'])for(const[k,v]of Object.entries(await import(`../src/${file}.js`)))if(/Logs$|Log$|Panels$|journeyStories$/.test(k))audit(v);
 for(const[,repairs]of levelGroups)for(const repair of repairs){const source=repair.objective.replace(/\d+/g,n=>String(+n+7));assert.deepEqual(counts(translate(source,'es')),counts(source),repair.id);}
 assert.deepEqual([...missingTranslations].filter(v=>v!=='es:Kepler Reach'),[]);
});
