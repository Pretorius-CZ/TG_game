import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sitePages,mainSiteOrigin,publicSitePaths} from '../src/sitePages.js';
import en from '../src/i18n/catalogs/web/en.json' with {type:'json'};
import cs from '../src/i18n/catalogs/web/cs.json' with {type:'json'};
import {levelCatalog} from '../src/levelCatalog.js';
import {INTRO_RECHARGE_MS,RECHARGE_MS} from '../src/livesRules.js';

test('every public article ships readable HTML, a real canonical and complete Czech copy',()=>{
 assert.equal(sitePages.length,5);
 for(const page of sitePages){
  const html=readFileSync(page.file,'utf8');
  assert.ok(html.includes(`href="${mainSiteOrigin}/${page.file}"`));
  assert.ok(html.includes(en[`web.${page.id}.title`]));
  for(const match of html.matchAll(/data-(?:text|alt|label)="([^"]+)"/g)){
   assert.equal(typeof en['web.'+match[1]],'string',page.file+': '+match[1]);
   assert.equal(typeof cs['web.'+match[1]],'string',page.file+': '+match[1]);
  }
  for(const section of page.sections){assert.ok(html.includes(en[`web.${page.id}.${section}.body`]));}
  assert.ok(publicSitePaths.includes('/'+page.file));
 }
});
test('public factual numbers remain tied to current game content and recharge rules',()=>{
 assert.equal(levelCatalog.length,200);
 assert.match(en['web.about.adventure.extra'],new RegExp(String(levelCatalog.length)));
 assert.equal(INTRO_RECHARGE_MS,10*60*1000);assert.equal(RECHARGE_MS,30*60*1000);
 assert.match(en['web.saving.local.body'],/10 minutes.*30 minutes/);
 assert.match(en['web.mechanics.moving.body'],/does not fire/);
 assert.match(en['web.mechanics.rings.body'],/Two independent combinations/);
});
