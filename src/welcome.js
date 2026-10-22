import {updates} from './welcomeUpdates.js';
import {gameAddress,hasOriginalSave,ORIGINAL_ORIGIN} from './gameAddress.js';
import {attachAdChoices} from './consentUI.js';

// Finish callbacks on their original origin, where the PKCE verifier is stored.
const callback=new URLSearchParams(location.search);
if(location.origin===ORIGINAL_ORIGIN&&(callback.has('code')||callback.has('error')||callback.has('error_code')||/access_token=/.test(location.hash))){
 location.replace(new URL(`./legacy-game.html${location.search}${location.hash}`,location.href));
}

import {message} from './i18n/webMessages.js';
import {LANGUAGE_KEY,initialLanguage,applyDocumentLanguage,releasedLocales,addressLanguage,syncAddressLanguage} from './i18n/locales.js';
const nodes=[...document.querySelectorAll('[data-text],[data-alt],[data-label]')];
let restore=false;try{restore=location.origin===ORIGINAL_ORIGIN&&hasOriginalSave(localStorage);}catch{}
function setLanguage(requested){
 const language=applyDocumentLanguage(requested,document);
 syncAddressLanguage(language,location,history);
 for(const node of nodes){
  const id=node.dataset.text||node.dataset.alt||node.dataset.label;
  const text=message('web.'+id,{},language);
  if(node.hasAttribute('data-alt'))node.alt=text;
  else if(node.hasAttribute('data-label'))node.setAttribute('aria-label',text);
  else node.textContent=text;
 }
 for(const button of document.querySelectorAll('[data-language]'))button.setAttribute('aria-pressed',String(button.dataset.language===language));
 const page=document.body.dataset.page;
 document.title=page?message(`web.${page}.title`,{},language)+' — Beyond the Signal':message('web.pageTitle',{},language);
 const description=document.querySelector('meta[name="description"]');if(description)description.content=message(page?`web.${page}.description`:'web.homeDescription',{},language);
 const list=document.getElementById('update-list');if(list){list.replaceChildren();
 for(const update of updates){
  const article=document.createElement('article');article.className='update';
  const time=document.createElement('time');time.dateTime=update.date;time.textContent=new Intl.DateTimeFormat(language,{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(update.date+'T12:00:00Z'));
  const body=document.createElement('div'),tag=document.createElement('span'),title=document.createElement('h3'),text=document.createElement('p');tag.className='update-tag';
  tag.textContent=message('news.'+update.id+'.tag',{},language);title.textContent=message('news.'+update.id+'.title',{},language);text.textContent=message('news.'+update.id+'.body',{},language);body.append(tag,title,text);article.append(time,body);list.append(article);
 }
 }
 try{localStorage.setItem(LANGUAGE_KEY,language);}catch{}
 // The game has a separate origin, so carry the explicit selection in PLAY links.
 for(const link of document.querySelectorAll('.game-link'))link.href=gameAddress(location.href,{transfer:restore,language});
 for(const link of document.querySelectorAll('.transfer-link'))link.href=gameAddress(location.href,{transfer:true,language});
 for(const link of document.querySelectorAll('.direct-game-link'))link.href=gameAddress(location.href,{language});
 const savedBanner=document.getElementById('saved-game-banner');if(savedBanner)savedBanner.hidden=!restore;
}
// The selector uses the same release registry as the game.
for(const group of document.querySelectorAll('.languages')){
 group.replaceChildren(...releasedLocales.map(locale=>{const button=document.createElement('button');button.type='button';button.dataset.language=locale.code;button.lang=locale.code;button.textContent=locale.short;button.setAttribute('aria-label',locale.name);button.addEventListener('click',()=>setLanguage(locale.code));return button;}));
}
let storage;try{storage=localStorage;}catch{}
setLanguage(initialLanguage({storage,languages:navigator.languages,requested:addressLanguage(location.href)}));
window.addEventListener('storage',event=>{if(event.key===LANGUAGE_KEY)setLanguage(initialLanguage({storage,languages:navigator.languages}));});
document.getElementById('year').textContent=String(new Date().getFullYear());
attachAdChoices();
