import {matchLocale} from './i18n/locales.js';
export const GAME_ORIGIN='https://game.playbeyondthesignal.com';
export const ORIGINAL_ORIGIN='https://playbeyondthesignal.com';
export function gameAddress(href,{transfer=false,language}={}){
 const current=new URL(href),game=new URL(transfer?'/transfer.html':'/',GAME_ORIGIN);
 for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'])if(current.searchParams.has(key))game.searchParams.set(key,current.searchParams.get(key));
 const locale=matchLocale(language);if(locale)game.searchParams.set('lang',locale);
 return game.href;
}
export function hasOriginalSave(storage){
 try{for(let i=0;i<storage.length;i++)if(/^to-the-stars-progress-v1(?::user:|$)/.test(storage.key(i)))return true;}catch{}
 return false;
}
