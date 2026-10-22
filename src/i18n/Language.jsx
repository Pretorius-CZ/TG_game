import {crazyGames} from '../platform.js';
import {crazyGamesLanguage} from '../crazyGames.js';
import React,{createContext,useContext,useMemo,useState,useEffect} from 'react';
import {translate} from './translate.js';
import {message} from './messages.js';
import {validLanguage,LANGUAGE_KEY,initialLanguage,applyDocumentLanguage,addressLanguage,syncAddressLanguage} from './locales.js';
const Context=createContext({language:'en',setLanguage:()=>{},t:v=>v,msg:id=>id});
export const useLanguage=()=>useContext(Context);
export function LanguageProvider({children,storageKey=LANGUAGE_KEY,defaultLanguage}){
 const [language,setLanguage]=useState(()=>{let storage;try{storage=localStorage;}catch{}return initialLanguage({storage,storageKey,requested:storageKey===LANGUAGE_KEY?addressLanguage(globalThis.location?.href):null,languages:defaultLanguage?[defaultLanguage]:crazyGames?[crazyGamesLanguage()]:globalThis.navigator?.languages??[],fallback:defaultLanguage??'en'});});
 useEffect(()=>{applyDocumentLanguage(language,document);if(storageKey===LANGUAGE_KEY)syncAddressLanguage(language,location,history);try{localStorage.setItem(storageKey,language);}catch{}},[language,storageKey]);
 useEffect(()=>{const sync=e=>{if(e.key===storageKey)setLanguage(validLanguage(e.newValue));};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[storageKey]);
 const value=useMemo(()=>({language,setLanguage:l=>setLanguage(validLanguage(l)),t:v=>translate(v,language),msg:(id,values)=>message(id,values,language)}),[language]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
