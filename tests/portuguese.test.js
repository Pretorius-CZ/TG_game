import test from 'node:test';
import assert from 'node:assert/strict';
import {chaptersFor} from '../src/chapters.js';
import {levelGroups} from '../src/levelCatalog.js';
import {translate,dataText,missingTranslations} from '../src/i18n/translate.js';
import {loadLocaleCatalog,catalogProblems,message} from '../src/i18n/messages.js';

test('Brazilian Portuguese covers all 200 levels, journals and transitions with valid parameters',async()=>{
 const catalog=await loadLocaleCatalog('pt-BR');assert.deepEqual(catalogProblems('pt-BR',catalog),[]);missingTranslations.clear();
 const fields=new Set(['name','room','thought','lesson','objective','result','action','title','text','source','time','caption','complete','finishLabel']);
 const counts=s=>(s.match(/\d+/g)??[]).map(Number).sort((a,b)=>a-b);
 function audit(value){if(!value||typeof value!=='object')return;for(const[k,v]of Object.entries(value)){
  if(fields.has(k)&&typeof v==='string')assert.deepEqual(counts(translate(v,'pt-BR')),counts(v),v);
  else if(v&&typeof v==='object')audit(v);
 }}
 const chapters=chaptersFor({});assert.equal(chapters.reduce((n,c)=>n+c.total,0),200);
 for(const chapter of chapters){dataText(chapter,'pt-BR');audit(chapter.sections);}
 for(const file of ['logEntries','airlockRepairs','navigationRepairs','crewRepairs','galleyRepairs','engineRepairs','exteriorRepairs','departure','departureStory','asterJumpStory','elysiumArrivalStory','exploration','destinations','haven','elysium','echoDepartureStory','rift','riftStory','garden','research','relay','researchStory','relayStory','nightGarden','nightGrove','nightRoot','nightSanctuary','caretakerStory','refuge','refugeHomes','refugeMedical','returnCorridor','refugeArrival','archive','signalNetwork','journeyStories'])for(const[k,v]of Object.entries(await import(`../src/${file}.js`)))if(/Logs$|Log$|Panels$|logEntries$|journeyStories$/.test(k))audit(v);
 for(const[,repairs]of levelGroups)for(const repair of repairs){const source=repair.objective.replace(/\d+/g,n=>String(+n+7)),translated=translate(source,'pt-BR');assert.deepEqual(counts(translated),counts(source),repair.id);assert.doesNotMatch(translated,/\b(?:Collect|Match|Break|protective covers)\b/,repair.id);}
 assert.deepEqual([...missingTranslations].filter(v=>v!=='pt-BR:Kepler Reach'),[]);
 assert.equal(message('common.movesLeft',{count:1},'pt-BR'),'Resta 1 jogada');
 assert.equal(message('common.movesLeft',{count:8},'pt-BR'),'Restam 8 jogadas');
 assert.equal(translate('Covered Blue comet, row 3, column 7','pt-BR'),'Com cobertura: Cometa azul, linha 3, coluna 7');
});
