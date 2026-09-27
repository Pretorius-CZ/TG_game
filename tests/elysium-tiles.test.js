import test from 'node:test';
import assert from 'node:assert/strict';
import {tileSetFor} from '../src/tileSets.js';
import {elysiumDestinations,elysiumRoute} from '../src/elysium.js';
import {translate,missingTranslations} from '../src/i18n/translate.js';
import {collectGoals,goalsFor} from '../src/objectives.js';
test('Elysium tile artwork, live goals and translations agree; approach keeps Aster tiles',()=>{
 missingTranslations.clear();
 const labels=['Coolant charges','Energy modules','Data chips','Alloy components','Light cells','Biocapsules'];
 for(const site of Object.values(elysiumDestinations))for(const repair of site.repairs){
  const tiles=tileSetFor(repair);assert.equal(new Set(tiles.sprites).size,6);assert.ok(tiles.sprites.every(s=>s.startsWith('elysium-')));
  for(const name of tiles.names){translate(name,'cs');translate(`Covered ${name}, row 3, column 2`,'cs');}
  const goals=goalsFor(repair);assert.ok(goals.every(g=>g.label===labels[g.type]));
  const translated=translate(repair.objective,'cs');assert.deepEqual(translated.match(/\d+/g),repair.objective.match(/\d+/g));
  for(const goal of goals)translate(goal.label,'cs');
  const board=[0,1,2,3,4,5];assert.deepEqual(collectGoals(goals,goals.map(()=>0),board,[goals[0].type]),goals.map((_,i)=>i===0?1:0));
 }
 assert.equal(tileSetFor(elysiumRoute).sprites[3],'aster-ore');assert.equal(tileSetFor({}).sprites[0],'fuel');
 assert.deepEqual([...missingTranslations],[]);
});
