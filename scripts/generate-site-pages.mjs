import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {websiteLocales} from '../src/i18n/websiteLocales.js';
import {localizeSitePage} from './localize-site-pages.mjs';
import {sitePages,mainSiteOrigin} from '../src/sitePages.js';
import english from '../src/i18n/catalogs/web/en.json' with {type:'json'};
import {updates} from '../src/welcomeUpdates.js';

const check=process.argv.includes('--check');
const outputs=new Map();
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const text=id=>{const value=english['web.'+id];if(typeof value!=='string')throw Error(`Missing website message: ${id}`);return escape(value);};
const node=(tag,id,attributes='')=>`<${tag} data-text="${id}"${attributes}>${text(id)}</${tag}>`;
const news=()=>updates.map(update=>`<article class="update"><time datetime="${update.date}">${escape(new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(update.date+'T12:00:00Z')))}</time><div><span class="update-tag">${escape(english[`news.${update.id}.tag`])}</span><h3>${escape(english[`news.${update.id}.title`])}</h3><p>${escape(english[`news.${update.id}.body`])}</p></div></article>`).join('');
const nav=()=>`<nav class="site-nav wrap" aria-label="Main navigation" data-label="navLabel"><a href="./welcome.html" data-text="site.home">${text('site.home')}</a><a href="./about.html" data-text="navAbout">${text('navAbout')}</a><a href="./how-to-play.html" data-text="navGuides">${text('navGuides')}</a><a href="./updates.html" data-text="navUpdates">${text('navUpdates')}</a><a class="game-link nav-play" href="https://game.playbeyondthesignal.com/">PLAY ↗</a></nav>`;
const patterns=()=>`<figure class="charge-examples" role="group" aria-label="${text('site.patterns')}" data-label="site.patterns">${[['site.patternFour',[5,6,7,8]],['site.patternShape',[0,1,2,6,11]],['site.patternFive',[5,6,7,8,9]]].map(([id,lit])=>`<div><div class="example-grid" aria-hidden="true">${Array.from({length:15},(_,i)=>`<span>${lit.includes(i)?'<img src="./tiles/crystal.png" alt="" width="40" height="40" loading="lazy"/>':''}</span>`).join('')}</div>${node('figcaption',id)}</div>`).join('')}</figure>`;

for(const page of sitePages){
 const schema=JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:english[`web.${page.id}.title`],description:english[`web.${page.id}.description`],url:mainSiteOrigin+'/'+page.file,inLanguage:'en',isPartOf:{'@type':'WebSite',name:'Beyond the Signal',url:mainSiteOrigin+'/'}}).replaceAll('<','\\u003c');
 const sections=page.sections.map(id=>`<section id="${id}" class="article-section">${node('h2',page.id+'.'+id+'.title')}${node('p',page.id+'.'+id+'.body')}${english[`web.${page.id}.${id}.extra`]?node('p',page.id+'.'+id+'.extra'):''}${page.patterns&&id==='charges'?patterns():''}${page.id==='saving'&&id==='transfer'?`<a class="transfer-link" href="https://game.playbeyondthesignal.com/transfer.html" data-text="transferLink">${text('transferLink')}</a>`:''}</section>`).join('\n');
 const html=`<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#080f18"/>
<title>${text(page.id+'.title')} — Beyond the Signal</title><meta name="description" content="${text(page.id+'.description')}"/>
<link rel="canonical" href="${mainSiteOrigin}/${page.file}"/><link rel="icon" href="./tiles/star.png"/><link rel="stylesheet" href="/src/site-articles.css"/>
<script type="application/ld+json">${schema}</script>
</head><body data-page="${page.id}">
<a class="skip" href="#article" data-text="skip">${text('skip')}</a>
<header class="site-header wrap"><a class="brand" href="./welcome.html" aria-label="Beyond the Signal"><span class="brand-mark" aria-hidden="true">✦</span><span>BEYOND <span>THE SIGNAL</span></span></a><div class="header-actions"><div class="languages" role="group" aria-label="Language"><button type="button" data-language="en" aria-pressed="true">EN</button><button type="button" data-language="cs" aria-pressed="false">CZ</button></div><a class="header-play game-link" href="https://game.playbeyondthesignal.com/" data-text="playShort">${text('playShort')}</a></div></header>
${nav()}
<main id="article" class="article wrap"><header class="article-heading"><p class="eyebrow">BEYOND THE SIGNAL</p>${node('h1',page.id+'.title')}${node('p',page.id+'.intro',' class="article-intro"')}</header>
${page.image?`<figure class="article-image"><img src="${page.image}" alt="${text('airlockAlt')}" data-alt="airlockAlt" width="600" height="800"/><figcaption data-text="tileNote">${text('tileNote')}</figcaption></figure>`:''}
${page.sections.length>2?`<nav class="article-contents" aria-label="${text('site.guides')}" data-label="site.guides">${page.sections.map(id=>node('a',page.id+'.'+id+'.title',` href="#${id}"`)).join('')}</nav>`:''}
<div class="article-copy">${sections}${page.news?'<div id="update-list">'+news()+'</div>':''}</div>
<aside class="related-guides" aria-labelledby="related-title">${node('h2','site.related',' id="related-title"')}<div>${sitePages.filter(item=>item.id!==page.id).map(item=>node('a',item.id+'.title',` href="./${item.file}"`)).join('')}${node('a','site.contact',' href="./contact.html"')}</div></aside>
<section class="closing"><div>${node('h2','site.ready')}</div><a class="button game-link" href="https://game.playbeyondthesignal.com/" data-text="play">${text('play')}</a></section>
</main>
<footer class="wrap"><span>© <span id="year">2026</span> Beyond the Signal</span>${node('span','site.author')}${node('a','contact',' href="./contact.html"')}${node('a','privacy',' href="./privacy.html"')}<button type="button" class="privacy-choices" data-text="adChoices">${text('adChoices')}</button><span class="privacy-choice-status" role="status" hidden></span></footer>
<script type="module" src="/src/welcome.js"></script></body></html>
`;
 outputs.set(page.file,html);
}
console.log(`${check?'Checked':'Generated'} ${sitePages.length} static information pages.`);
// Keep the home page's no-JavaScript news fallback current as well.
const home=readFileSync('welcome.html','utf8').replaceAll('\r\n','\n'),start=home.indexOf('<div id="update-list">'),end=home.indexOf('\n    </section>',start);
if(start<0||end<0)throw Error('Home news container is missing');
const updated=home.slice(0,start)+'<div id="update-list">'+news()+'</div>'+home.slice(end);
outputs.set('welcome.html',updated);
for(const file of ['privacy.html','contact.html'])outputs.set(file,readFileSync(file,'utf8').replaceAll('\r\n','\n'));
const templates=[...outputs];
for(const locale of websiteLocales)for(const [source,html] of templates){
 const file=source==='welcome.html'?'index.html':source;
 const target=locale.code==='en'?source:`${locale.code}/${file}`;
 outputs.set(target,localizeSitePage(html,locale.code,file));
}
for(const [file,html] of outputs){
 if(check){if(readFileSync(file,'utf8').replaceAll('\r\n','\n')!==html)throw Error(`${file} is out of date. Run npm run site:generate.`);}
 else {mkdirSync(dirname(file),{recursive:true});writeFileSync(file,html);}
}
console.log(`${check?'Checked':'Generated'} ${outputs.size} website pages in ${websiteLocales.length} languages.`);
