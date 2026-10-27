import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WEBSITE_LANGUAGE_KEY,websiteLocales,initialWebsiteLanguage,websiteRoute,websiteAddress,gameLanguageForWebsite} from '../src/i18n/websiteLocales.js';
import {LANGUAGE_KEY,releasedLocales} from '../src/i18n/locales.js';
import {websiteFiles,publicSitePaths} from '../src/sitePages.js';

test('website preferences support six languages matching the six game releases',()=>{
 assert.deepEqual(websiteLocales.map(locale=>locale.code),['en','cs','de','fr','es','pt-BR']);
 assert.deepEqual(releasedLocales.map(locale=>locale.code),['en','cs','de','fr','es','pt-BR']);
 const saved={[WEBSITE_LANGUAGE_KEY]:'de',[LANGUAGE_KEY]:'cs'},storage={getItem:key=>saved[key]};
 assert.equal(initialWebsiteLanguage({storage,languages:['fr-FR']}),'de');
 assert.equal(initialWebsiteLanguage({storage,requested:'es-MX'}),'es');
 assert.equal(initialWebsiteLanguage({storage:{getItem:key=>key===LANGUAGE_KEY?'cs':null},languages:['de']}),'cs');
 assert.equal(initialWebsiteLanguage({languages:['pt-BR','en']}),'pt-BR');
 assert.equal(initialWebsiteLanguage({languages:['pt-PT','en']}),'en');
 assert.equal(initialWebsiteLanguage({storage:{getItem(){throw Error('blocked');}},languages:['fr']}),'fr');
 assert.deepEqual(saved,{[WEBSITE_LANGUAGE_KEY]:'de',[LANGUAGE_KEY]:'cs'});
});

test('language switches preserve article, hash and campaigns; released website languages select matching gameplay',()=>{
 const original='https://playbeyondthesignal.com/de/tools-and-obstacles.html?utm_source=automated_test&lang=de#covers';
 assert.equal(websiteAddress(original,'fr'),'https://playbeyondthesignal.com/fr/tools-and-obstacles.html?utm_source=automated_test#covers');
 assert.deepEqual(websiteRoute('https://playbeyondthesignal.com/pt-BR/'),{language:'pt-BR',file:'index.html'});
 assert.equal(websiteAddress('https://playbeyondthesignal.com/de/','en'),'https://playbeyondthesignal.com/welcome.html?lang=en');
 for(const locale of websiteLocales)assert.equal(gameLanguageForWebsite(locale.code),['cs','de','fr','es','pt-BR'].includes(locale.code)?locale.code:'en');
});

test('all 48 public pages contain translated HTML, metadata, language alternatives and safe game links',()=>{
 assert.equal(publicSitePaths.length,48);
 for(const locale of websiteLocales){
  const catalog={...JSON.parse(readFileSync(`src/i18n/catalogs/web/${locale.code}.json`,'utf8')),...JSON.parse(readFileSync(`src/i18n/catalogs/legal/${locale.code}.json`,'utf8'))};
  for(const file of websiteFiles){
   const path=(locale.code==='en'?'':locale.code+'/')+(file==='index.html'&&locale.code==='en'?'welcome.html':file),html=readFileSync(path,'utf8');
   assert.ok(html.includes(`<html lang="${locale.code}"`),path);
   assert.equal([...html.matchAll(/rel="alternate"/g)].length,7,path);
   assert.ok(html.includes('data-website-language'),path);
   for(const [,id] of html.matchAll(/data-(?:text|alt|label)="([^"]+)"/g))assert.equal(typeof catalog['web.'+id],'string',path+': '+id);
   for(const [,tag] of html.matchAll(/(<a\b[^>]*class="[^"]*game-link[^>]*>)/g))assert.ok(tag.includes(`?lang=${gameLanguageForWebsite(locale.code)}`),tag);
   if(file==='privacy.html')assert.ok(html.includes(`data-copy="${locale.code}"`));
   if(file==='index.html'||file==='contact.html')assert.ok(html.includes('data-text="site.gameLanguage"'));
  }
 }
});
