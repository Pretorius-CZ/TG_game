import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {journeyFor} from '../src/journey.js';
import {normalizeProgress} from '../src/progressStorage.js';
import {shipStages} from '../src/chapterFlow.js';
import {destinations} from '../src/destinations.js';
import {levelCatalog} from '../src/levelCatalog.js';
import {journeyStories,chapterStoryOptions} from '../src/journeyStories.js';
import {translate,missingTranslations} from '../src/i18n/translate.js';
test('one story objective walks all 187 levels and required non-puzzle milestones',()=>{
 let p=normalizeProgress();const played=[],actions=[];
 for(let guard=0;guard<250;guard++){
  const goal=journeyFor(p);if(goal.kind==='end')break;
  assert.deepEqual(journeyFor({...p,scene:'exterior'}),goal,'visiting old scenes must not change the story objective');
  if(goal.kind==='repair'){played.push(goal.repair.id);if(goal.repair.id==='launch-check')p.finaleDone=true;else{const stage=shipStages.find(s=>s.scene===goal.scene);const key=stage?.key??destinations[goal.scene].key;p[key]++;}}
  else if(goal.kind==='choice'){assert.ok(goal.choices.length<=2);const site=destinations[goal.choices[0]];played.push(site.repairs[p[site.key]].id);p[site.key]++;}
  else{actions.push(goal.action);if(goal.action==='departure')p.launchDone=true;else if(goal.action==='scanner')p.scannerInstalled=true;else if(goal.action==='gate')p.jumpDone=true;else if(goal.action==='approach'){played.push('elysium-route');p.elysiumRouteCompleted=1;p.elysiumArrival=1;}else if(goal.action==='cross')p.riftCrossed=1;else if(goal.action==='encounter')p.caretakerMet=1;else assert.fail(goal.action);}
  p=normalizeProgress(p);
 }
 assert.equal(journeyFor(p).kind,'end');assert.equal(new Set(played).size,187);assert.deepEqual(new Set(played),new Set(levelCatalog.map(r=>r.id)));
 assert.deepEqual(actions,['departure','scanner','gate','approach','cross','encounter']);
 assert.equal(chapterStoryOptions(p,'archive').length,1);
});
test('four new comics have three bilingual panels and project artwork; replay eligibility preserves progress',()=>{
 missingTranslations.clear();assert.equal(journeyStories.length,4);
 for(const story of journeyStories){assert.equal(story.panels.length,3);translate(story.title,'cs');translate(story.finishLabel,'cs');
  for(const panel of story.panels){assert.ok(existsSync(new URL('../public/scenes/'+panel.image+'.webp',import.meta.url)),panel.image);translate(panel.title,'cs');translate(panel.caption,'cs');}
  assert.equal(story.ready(normalizeProgress()),false);
 }
 assert.deepEqual([...missingTranslations],[]);
 const p={refugeMedicalCompleted:5,returnCorridorCompleted:6,refugeArrivalCompleted:6,archiveCoreCompleted:5};const before=JSON.stringify(p);
 assert.equal(chapterStoryOptions(p,'refuge').length,3);assert.equal(chapterStoryOptions(p,'archive').length,1);assert.equal(JSON.stringify(p),before);
});
