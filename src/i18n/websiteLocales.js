import {locales,matchLocale,LANGUAGE_KEY} from './locales.js';
export const WEBSITE_LANGUAGE_KEY='beyond-signal-website-language-v1';
// Website releases are independent of the in-game translation rollout.
export const websiteLocales=Object.freeze(locales.filter(locale=>['en','cs','de','fr','es','pt-BR'].includes(locale.code)));
export function matchWebsiteLocale(value){const code=matchLocale(value,{includeDrafts:true});return websiteLocales.some(locale=>locale.code===code)?code:null;}
export const websiteLanguage=value=>matchWebsiteLocale(value)??'en';
export const gameLanguageForWebsite=value=>matchLocale(websiteLanguage(value))??'en';
export function initialWebsiteLanguage({storage,languages=[],requested}={}){
 const explicit=matchWebsiteLocale(requested);if(explicit)return explicit;
 try{for(const key of [WEBSITE_LANGUAGE_KEY,LANGUAGE_KEY]){const saved=matchWebsiteLocale(storage?.getItem(key));if(saved)return saved;}}catch{}
 for(const value of languages){const code=matchWebsiteLocale(value);if(code)return code;}
 return 'en';
}
export function websiteRoute(href){
 const url=new URL(href),parts=url.pathname.split('/').filter(Boolean);
 const prefix=websiteLocales.find(locale=>locale.code!=='en'&&locale.code.toLowerCase()===parts[0]?.toLowerCase());
 const file=(prefix?parts[1]:parts[0])??'index.html';
 return {language:prefix?.code??'en',file:file==='welcome.html'?'index.html':file};
}
export function websiteAddress(href,language){
 const url=new URL(href),{file}=websiteRoute(url.href),code=websiteLanguage(language);
 // welcome.html is also safe in development, where / is the game.
 url.pathname=(code==='en'?'/':`/${code}/`)+(file==='index.html'?(code==='en'?'welcome.html':''):file);
 url.searchParams.delete('lang');
 // English has no folder prefix. Keep its explicit choice usable even when
 // browser storage is blocked and the browser prefers another language.
 if(code==='en')url.searchParams.set('lang','en');
 return url.href;
}
export function requestedWebsiteLanguage(href){try{return matchWebsiteLocale(new URL(href).searchParams.get('lang'));}catch{return null;}}
