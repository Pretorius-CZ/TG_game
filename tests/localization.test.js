import test from 'node:test';
import assert from 'node:assert/strict';
import {initialLanguage,matchLocale,preferredLanguage,releasedLocales,applyDocumentLanguage,addressLanguage,syncAddressLanguage} from '../src/i18n/locales.js';
import {gameAddress} from '../src/gameAddress.js';
import {message,englishMessages,formatMessage,catalogProblems,loadLocaleCatalog} from '../src/i18n/messages.js';

test('language preferences respect saved choice, browser order and unsupported languages',()=>{
 assert.equal(preferredLanguage({saved:'en',languages:['cs-CZ']}),'en');
 assert.equal(preferredLanguage({saved:'cs',languages:['en-US']}),'cs');
 assert.equal(preferredLanguage({saved:'bad',languages:['de-DE','cs-CZ','en-US']}),'de');
 assert.equal(preferredLanguage({languages:['en-US','cs-CZ']}),'en');
 assert.equal(preferredLanguage({languages:['ar-EG']}),'en');
 assert.equal(initialLanguage({storage:{getItem(){throw Error('blocked');}},languages:['cs-CZ']}),'cs');
 assert.equal(initialLanguage({storage:{getItem:()=>null},storageKey:'playtest',languages:['cs']}),'cs');
 assert.equal(initialLanguage({storage:{getItem:()=> 'en'},requested:'cs',languages:['en']}),'cs');
});
test('explicit language survives the cross-origin PLAY link without forwarding arbitrary parameters',()=>{
 const address=gameAddress('https://playbeyondthesignal.com/?code=private&utm_campaign=test',{language:'cs'});
 assert.equal(address,'https://game.playbeyondthesignal.com/?utm_campaign=test&lang=cs');
 assert.equal(addressLanguage(address),'cs');assert.equal(addressLanguage('broken'),null);
 assert.equal(addressLanguage('https://game.playbeyondthesignal.com/?lang=de'),'de');
 assert.equal(new URL(gameAddress('https://playbeyondthesignal.com/',{language:'de'})).searchParams.get('lang'),'de');
 let replaced;syncAddressLanguage('en',{href:address},{state:{keep:1},replaceState:(state,unused,url)=>{replaced={state,url};}});
 assert.deepEqual(replaced,{state:{keep:1},url:'https://game.playbeyondthesignal.com/?utm_campaign=test&lang=en'});
});
test('German and French are released and incomplete editions remain unavailable',async()=>{
 await loadLocaleCatalog('de');
 assert.deepEqual(releasedLocales.map(locale=>locale.code),['en','cs','de','fr','es']);
 assert.equal(matchLocale('pt_BR',{includeDrafts:true}),'pt-BR');
 assert.equal(matchLocale('pt',{includeDrafts:true}),'pt-BR');
 assert.equal(matchLocale('pt-PT',{includeDrafts:true}),null);
 assert.equal(matchLocale('fr-CA',{includeDrafts:true}),'fr');
 assert.equal(matchLocale('de-DE'),'de');assert.equal(matchLocale('fr'),'fr');
 assert.equal(message('common.play',{},'de'),'Spielen');
 const document={documentElement:{}};applyDocumentLanguage('cs',document);
 assert.deepEqual(document.documentElement,{lang:'cs',dir:'ltr'});
});
test('semantic message IDs preserve parameters and Czech plural categories',()=>{
 assert.equal(message('common.movesLeft',{count:1},'cs'),'Zbývá 1 tah');
 assert.equal(message('common.movesLeft',{count:3},'cs'),'Zbývají 3 tahy');
 assert.equal(message('common.movesLeft',{count:8},'cs'),'Zbývá 8 tahů');
 assert.equal(message('common.movesLeft',{count:1},'en'),'1 move left');
 assert.equal(message('common.movesLeft',{count:8},'en'),'8 moves left');
 assert.equal(message('common.stars',{count:2,total:3},'cs'),'2 ze 3 hvězd');
 assert.equal(formatMessage('Hello {name}',{name:'<script>bad</script>'}),'Hello <script>bad</script>');
 assert.equal(formatMessage('Hello {name}',{}),'Hello {name}');
});
test('catalog validation catches missing translations, empty text and lost parameters',async()=>{
 const cs=await loadLocaleCatalog('cs');assert.deepEqual(catalogProblems('cs',cs),[]);
 const bad={...cs,'common.movesLeft':{other:'Tah'},'common.play':''};delete bad['web.pageTitle'];
 const problems=catalogProblems('cs',bad);
 assert.ok(problems.some(problem=>problem.includes('placeholder mismatch')));
 assert.ok(problems.some(problem=>problem.includes('missing plural form few')));
 assert.ok(problems.some(problem=>problem.includes('empty or invalid translation')));
 assert.ok(problems.includes('web.pageTitle: missing translation'));
 assert.deepEqual(catalogProblems('fr',await loadLocaleCatalog('fr')),[]);
 assert.deepEqual(catalogProblems('es',await loadLocaleCatalog('es')),[]);
 for(const code of ['pt-BR']){
  const draft=await loadLocaleCatalog(code),errors=catalogProblems(code,draft);
  assert.ok(errors.some(problem=>problem.endsWith(': missing translation')));
  assert.deepEqual(errors.filter(problem=>!problem.endsWith(': missing translation')),[]);
  assert.equal(typeof draft['common.play'],'string');
 }
 assert.ok(Object.keys(englishMessages).length>2000);
});
