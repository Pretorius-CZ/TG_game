import {readFileSync} from 'node:fs';
import {websiteLocales,gameLanguageForWebsite} from '../src/i18n/websiteLocales.js';
import {mainSiteOrigin} from '../src/sitePages.js';
import {updates} from '../src/welcomeUpdates.js';

const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function websiteCatalog(code){return {...JSON.parse(readFileSync(`src/i18n/catalogs/web/${code}.json`,'utf8')),...JSON.parse(readFileSync(`src/i18n/catalogs/legal/${code}.json`,'utf8'))};}
const address=(code,file)=>mainSiteOrigin+(code==='en'?'/':`/${code}/`)+(file==='index.html'?'':file);
function replaceContainer(html,id,content){
 const start=html.indexOf(`<div id="${id}">`);if(start<0)return html;
 let depth=0;for(const match of html.slice(start).matchAll(/<div\b[^>]*>|<\/div>/g)){
  depth+=match[0].startsWith('</')?-1:1;
  if(depth===0)return html.slice(0,start)+`<div id="${id}">${content}</div>`+html.slice(start+match.index+match[0].length);
 }
 throw Error(`Unclosed container ${id}`);
}

// Templates are controlled project HTML. All translated values are escaped;
// catalog text can never add markup, URLs or scripts.
export function localizeSitePage(source,code,file){
 const catalog=websiteCatalog(code),copy=id=>{const value=catalog[id];if(typeof value!=='string')throw Error(`${code}: missing ${id}`);return escape(value);};
 let html=source.replace(/<html lang="[^"]+"/,'<html lang="'+code+'"');
 // Legal source templates keep stable semantic spans, including link fragments.
 html=html.replace(/<article data-copy="cs"[^>]*>[\s\S]*?<\/article>/g,'').replace(/data-copy="en"/g,`data-copy="${code}"`);
 html=html.replace(/<([a-z][\w-]*)([^>]*\sdata-text="([^"]+)"[^>]*)>[^<]*<\/\1>/g,(_,tag,attributes,id)=>`<${tag}${attributes}>${copy('web.'+id)}</${tag}>`);
 html=html.replace(/<[a-z][^>]*\sdata-(alt|label)="[^"]+"[^>]*>/g,tag=>{
  const [,kind,id]=tag.match(/data-(alt|label)="([^"]+)"/),attribute=kind==='alt'?'alt':'aria-label';
  return tag.replace(new RegExp(` ${attribute}="[^"]*"`),` ${attribute}="${copy('web.'+id)}"`);
 });
 const selector=`<div class="languages"><select data-website-language aria-label="${copy('web.site.language')}">${websiteLocales.map(locale=>`<option value="${locale.code}" lang="${locale.code}"${code===locale.code?' selected':''}>${escape(locale.name)}</option>`).join('')}</select></div>`;
 html=html.replace(/<div class="languages"[^>]*>[\s\S]*?<\/div>/g,selector);
 html=html.replace(/<noscript data-website-languages>[\s\S]*?<\/noscript>/g,'');
 const alternatives=websiteLocales.map(locale=>`<a href="${address(locale.code,file)}" hreflang="${locale.code}" lang="${locale.code}">${escape(locale.name)}</a>`).join(' · ');
 html=html.replace('</header>',`</header><noscript data-website-languages><nav class="wrap language-links" aria-label="${copy('web.site.language')}">${alternatives}</nav></noscript>`);
 if(file==='privacy.html'||file==='contact.html'){
  html=html.replace('<a class="brand" href="./welcome.html">✦ BEYOND THE SIGNAL</a>','<a class="brand" href="./welcome.html" aria-label="Beyond the Signal"><span class="brand-mark" aria-hidden="true">✦</span><span>BEYOND <span>THE SIGNAL</span></span></a>');
  html=html.replace('>Privacy / Soukromí</a>',` data-text="privacy">${copy('web.privacy')}</a>`);
  html=html.replace(/class="button" href="https:\/\/game\.playbeyondthesignal\.com\//g,'class="button game-link" href="https://game.playbeyondthesignal.com/');
 }
 // Notes appear with the main PLAY controls and survive disabled JavaScript.
 html=html.replace(/<p class="play-note game-language-note"[^>]*>[\s\S]*?<\/p>/g,'');
 const note=`<p class="play-note game-language-note" data-text="site.gameLanguage">${copy('web.site.gameLanguage')}</p>`;
 if(file==='index.html')html=html.replace('<p class="play-note migration-play-note"',note+'<p class="play-note migration-play-note"');
 html=html.replace(/(<section class="closing[^>]*>)([\s\S]*?)(<\/section>)/g,(_,open,content,close)=>open+content+note+close);
 if(file==='contact.html')html=html.replace('</article>',note+'</article>');
 const news=updates.map(update=>`<article class="update"><time datetime="${update.date}">${escape(new Intl.DateTimeFormat(code,{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(update.date+'T12:00:00Z')))}</time><div><span class="update-tag">${copy(`news.${update.id}.tag`)}</span><h3>${copy(`news.${update.id}.title`)}</h3><p>${copy(`news.${update.id}.body`)}</p></div></article>`).join('');
 html=replaceContainer(html,'update-list',news);
 const id=html.match(/body data-page="([^"]+)"/)?.[1];
 const title=file==='index.html'?copy('web.pageTitle'):file==='privacy.html'?copy('web.legal.privacy.01'):file==='contact.html'?copy('web.legal.contact.01'):copy(`web.${id}.title`);
 const description=file==='index.html'?copy('web.homeDescription'):id?copy(`web.${id}.description`):copy(file==='privacy.html'?'web.site.privacy':'web.site.contact')+' — Beyond the Signal';
 html=html.replace(/<title>[^<]*<\/title>/,`<title>${title}${file==='index.html'?'':' — Beyond the Signal'}</title>`).replace(/(<meta name="description" content=")[^"]*("\s*\/?>)/,`$1${description}$2`);
 html=html.replace(/<link rel="canonical"[^>]*>/,`<link rel="canonical" href="${address(code,file)}"/>`).replace(/<link rel="alternate"[^>]*>/g,'');
 html=html.replace('</head>',websiteLocales.map(locale=>`<link rel="alternate" hreflang="${locale.code}" href="${address(locale.code,file)}"/>`).join('')+`<link rel="alternate" hreflang="x-default" href="${address('en',file)}"/></head>`);
 html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(_,json)=>{
  const schema=JSON.parse(json);schema.description=catalog[id?`web.${id}.description`:'web.homeDescription'];
  if(schema['@type']==='WebPage'){schema.name=catalog[`web.${id}.title`];schema.url=address(code,file);schema.inLanguage=code;}
  return `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`;
 });
 html=html.replace(/<script id="website-consent-copy"[^>]*>[\s\S]*?<\/script>/g,'');
 const consent=Object.fromEntries(['loading','opening','unavailable','not-required','received'].map(key=>[key,catalog['web.consent.'+key]]));
 html=html.replace('</body>',`<script id="website-consent-copy" type="application/json">${JSON.stringify(consent).replaceAll('<','\\u003c')}</script></body>`);
 // Only real transfer URLs are rewritten; article links share the CSS class.
 html=html.replace(/<a\b[^>]*class="[^"]*(?:game-link|direct-game-link|transfer-link)[^"]*"[^>]*>/g,tag=>{
  if(!/class="[^"]*(?:game-link|direct-game-link)/.test(tag)&&!tag.includes('/transfer.html'))return tag;
  return tag.replace(/href="[^"]*"/,`href="https://game.playbeyondthesignal.com/${tag.includes('/transfer.html')?'transfer.html':''}?lang=${gameLanguageForWebsite(code)}"`);
 });
 if(code!=='en')html=html.replace(/(src|href)="\.\/(intro|tiles|scenes)\//g,'$1="../$2/').replaceAll('href="./welcome.html"','href="./index.html"');
 return html;
}
