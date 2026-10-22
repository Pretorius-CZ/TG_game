import {websiteLocales} from './i18n/websiteLocales.js';
// Public information pages. Player-facing copy lives in i18n/catalogs/web.
export const sitePages=[
 {id:'about',file:'about.html',image:'./scenes/airlock-corridor-door.webp',sections:['adventure','changes','creator']},
 {id:'basics',file:'how-to-play.html',sections:['controls','goals','moves','stars','stuck']},
 {id:'mechanics',file:'tools-and-obstacles.html',sections:['charges','moving','tools','covers','rings','cascades'],patterns:true},
 {id:'saving',file:'saving-and-progress.html',sections:['guest','account','local','transfer','recovery','privacy']},
 {id:'updates',file:'updates.html',sections:[],news:true},
];
export const mainSiteOrigin='https://playbeyondthesignal.com';
export const websiteFiles=['index.html',...sitePages.map(page=>page.file),'contact.html','privacy.html'];
export const localizedSiteFiles=websiteLocales.filter(locale=>locale.code!=='en').flatMap(locale=>websiteFiles.map(file=>`${locale.code}/${file}`));
export const publicSitePaths=websiteLocales.flatMap(locale=>websiteFiles.map(file=>(locale.code==='en'?'/':`/${locale.code}/`)+(file==='index.html'?'':file)));
