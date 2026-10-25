import {crazyGames} from '../platform.js';
import {crazyGamesLanguage} from '../crazyGames.js';
import React,{createContext,useContext,useMemo,useState,useEffect} from 'react';
import {translate,dataText} from './translate.js';
import {message,loadLocaleCatalog} from './messages.js';
import {validLanguage,matchLocale,locales,releasedLocales,LANGUAGE_KEY,initialLanguage,applyDocumentLanguage,addressLanguage,syncAddressLanguage} from './locales.js';
const Context=createContext({language:'en',setLanguage:()=>{},t:v=>v,msg:id=>id});
export const useLanguage=()=>useContext(Context);
export function LanguageProvider({children,storageKey=LANGUAGE_KEY,defaultLanguage}){
 // Draft languages are available only in a local Vite development preview.
 const preview=import.meta.env.DEV?matchLocale(new URLSearchParams(globalThis.location?.search).get('previewLanguage'),{includeDrafts:true}):null;
 const [revision,setRevision]=useState(0);
 const [language,setLanguage]=useState(()=>{let storage;try{storage=localStorage;}catch{}return preview??initialLanguage({storage,storageKey,requested:storageKey===LANGUAGE_KEY?addressLanguage(globalThis.location?.href):null,languages:defaultLanguage?[defaultLanguage]:crazyGames?[crazyGamesLanguage()]:globalThis.navigator?.languages??[],fallback:defaultLanguage??'en'});});
 useEffect(()=>{let current=true;loadLocaleCatalog(language).then(()=>{if(current)setRevision(n=>n+1);}).catch(()=>{if(current)setLanguage('en');});return()=>{current=false;};},[language]);
 useEffect(()=>{if(preview){document.documentElement.lang=language;document.documentElement.dir='ltr';return;}applyDocumentLanguage(language,document);if(storageKey===LANGUAGE_KEY)syncAddressLanguage(language,location,history);try{localStorage.setItem(storageKey,language);}catch{}},[language,storageKey,preview]);
 useEffect(()=>{const sync=e=>{if(e.key===storageKey)setLanguage(validLanguage(e.newValue));};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[storageKey]);
 const value=useMemo(()=>({language,availableLocales:preview?locales:releasedLocales,setLanguage:l=>setLanguage(matchLocale(l,{includeDrafts:Boolean(preview)})??'en'),t:v=>translate(v,language),dataText:v=>dataText(v,language),msg:(id,values)=>message(id,values,language)}),[language,revision,preview]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
