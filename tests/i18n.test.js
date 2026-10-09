import test from 'node:test';
import assert from 'node:assert/strict';
import {translate,missingTranslations,validLanguage} from '../src/i18n/translate.js';
import {levelGroups} from '../src/levelCatalog.js';
import {destinations} from '../src/destinations.js';
import {readdirSync} from 'node:fs';

test('Czech covers repair and journal content across all chapters',async()=>{
  missingTranslations.clear();
  for(const file of ['repairs','airlockRepairs','navigationRepairs','crewRepairs','galleyRepairs','engineRepairs','exteriorRepairs','exploration','destinations','haven','logEntries','departure','aster']){
    const data=await import(`../src/${file}.js`);
    for(const [name,value] of Object.entries(data)){
      if(typeof value==='function'||!/repairs|logs|logEntries|Log$/i.test(name))continue;
      for(const item of Array.isArray(value)?value:[value]){
        for(const field of ['name','lesson','thought','result','description','action','objective','title','text','source','time']){
          if(typeof item?.[field]!=='string')continue;
          assert.equal(translate(item[field],'en'),item[field]);
          translate(item[field],'cs');
        }
      }
    }
  }
  assert.deepEqual([...missingTranslations],[]);
});
test('dynamic objectives preserve changed balance numbers and accessibility coordinates',()=>{
  const result=translate('Match 24 fuel cells and 24 comets. Break all 4 protective covers in 17 moves.','cs');
  assert.deepEqual(result.match(/\d+/g),['24','24','4','17']);
  assert.match(translate('Covered Comet, row 3, column 7','cs'),/řádek 3, sloupec 7/);
  assert.equal(translate('8 moves left','cs'),'Zbývající tahy: 8');
});
test('language fallback and non-text values do not alter game data',()=>{
  const board=[0,1,3];assert.equal(translate(board,'cs'),board);
  assert.equal(translate(null,'cs'),null);
  assert.equal(validLanguage('cs'),'cs');assert.equal(validLanguage('de'),'en');
  assert.equal(translate('Aster Veil','cs'),'Aster Veil');
});

test('all playable destinations, level instructions and story panels have Czech text',async()=>{
  missingTranslations.clear();
  const textFields=new Set(['name','lesson','thought','result','description','action','objective','title','text','source','time','room','chapter','complete','nextLabel','caption','label']);
  function read(value){
    if(!value||typeof value!=='object')return;
    for(const [key,item] of Object.entries(value)){
      if(textFields.has(key)&&typeof item==='string'){
        assert.equal(translate(item,'en'),item);
        translate(item,'cs');
      }else if(item&&typeof item==='object')read(item);
    }
  }
  read(levelGroups);
  read(destinations);
  for(const file of readdirSync(new URL('../src/',import.meta.url)).filter(file=>file.endsWith('Story.js'))){
    read(await import(`../src/${file}`));
  }
  assert.deepEqual([...missingTranslations],[]);
});

test('translated objectives retain every count and mechanic after balance changes',()=>{
  for(const [,levels] of levelGroups)for(const repair of levels){
    for(const objective of [repair.objective,repair.objective.replace(/\d+/g,n=>String(Number(n)+7))]){
      const cs=translate(objective,'cs');
      // Cover and move counts can change position in a natural translation.
      const counts=text=>(text.match(/\d+/g)??[]).map(Number).sort((a,b)=>a-b);
      assert.deepEqual(counts(cs),counts(objective),repair.id);
      if(/protective covers?/.test(objective))assert.match(cs,/ochranné kryty/,repair.id);
      if(objective.includes('Charge every resonator.'))assert.match(cs,/Nabij všechny rezonátory\./,repair.id);
      assert.doesNotMatch(cs,/\d+ světelného pylu/,repair.id);
    }
  }
});
