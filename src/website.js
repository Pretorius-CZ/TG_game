import {gameAddress,hasOriginalSave,ORIGINAL_ORIGIN} from './gameAddress.js';
import {attachAdChoices} from './consentUI.js';
import {WEBSITE_LANGUAGE_KEY,websiteAddress,websiteRoute,initialWebsiteLanguage,requestedWebsiteLanguage,gameLanguageForWebsite} from './i18n/websiteLocales.js';

export function initializeWebsite(){
 // Finish OAuth where the PKCE verifier lives, before any language redirect.
 const callback=new URLSearchParams(location.search);
 if(location.origin===ORIGINAL_ORIGIN&&(callback.has('code')||callback.has('error')||callback.has('error_code')||/access_token=/.test(location.hash))){
  location.replace(new URL(`/legacy-game.html${location.search}${location.hash}`,location.href));return;
 }
 let storage;try{storage=localStorage;}catch{}
 const route=websiteRoute(location.href),language=initialWebsiteLanguage({storage,languages:navigator.languages,requested:requestedWebsiteLanguage(location.href)??(route.language!=='en'?route.language:null)});
 if(language!==route.language){location.replace(websiteAddress(location.href,language));return;}
 try{storage?.setItem(WEBSITE_LANGUAGE_KEY,language);}catch{}
 for(const select of document.querySelectorAll('[data-website-language]')){
  select.value=language;
  select.addEventListener('change',()=>{try{storage?.setItem(WEBSITE_LANGUAGE_KEY,select.value);}catch{}location.assign(websiteAddress(location.href,select.value));});
 }
 let restore=false;try{restore=location.origin===ORIGINAL_ORIGIN&&hasOriginalSave(storage);}catch{}
 const gameLanguage=gameLanguageForWebsite(language);
 for(const link of document.querySelectorAll('.game-link'))link.href=gameAddress(location.href,{transfer:restore,language:gameLanguage});
 // transfer-link is also a visual style on ordinary article links.
 for(const link of document.querySelectorAll('.transfer-link[href*="/transfer.html"]'))link.href=gameAddress(location.href,{transfer:true,language:gameLanguage});
 for(const link of document.querySelectorAll('.direct-game-link'))link.href=gameAddress(location.href,{language:gameLanguage});
 if(language==='en')for(const link of document.querySelectorAll('a[href^="./"]')){
  const url=new URL(link.href);url.searchParams.set('lang','en');link.href=url.href;
 }
 const banner=document.getElementById('saved-game-banner');if(banner)banner.hidden=!restore;
 const year=document.getElementById('year');if(year)year.textContent=String(new Date().getFullYear());
 const copy=document.getElementById('website-consent-copy');
 attachAdChoices(copy?JSON.parse(copy.textContent):undefined);
}
