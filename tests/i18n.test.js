import test from 'node:test';
import assert from 'node:assert/strict';
import {translate,missingTranslations,validLanguage} from '../src/i18n/translate.js';

test('Czech covers repair and journal content across all chapters',async()=>{
  missingTranslations.clear();
  for(const file of ['repairs','airlockRepairs','navigationRepairs','crewRepairs','galleyRepairs','engineRepairs','exteriorRepairs','exploration','destinations','haven','logEntries','departure']){
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
