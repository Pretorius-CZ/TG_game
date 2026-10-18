import {crazyGames} from '../platform.js';
import {crazyGamesLanguage} from '../crazyGames.js';
import React,{createContext,useContext,useMemo,useState,useEffect} from 'react';
import {translate,validLanguage,LANGUAGE_KEY} from './translate.js';
const Context=createContext({language:'en',setLanguage:()=>{},t:v=>v});
export const useLanguage=()=>useContext(Context);
export function LanguageProvider({children,storageKey=LANGUAGE_KEY,defaultLanguage='en'}){
 const [language,setLanguage]=useState(()=>{try{const saved=localStorage.getItem(storageKey);if(saved==='en'||saved==='cs')return saved;return crazyGames?crazyGamesLanguage():defaultLanguage;}catch{return crazyGames?crazyGamesLanguage():defaultLanguage;}});
 useEffect(()=>{document.documentElement.lang=language;try{localStorage.setItem(storageKey,language);}catch{}},[language,storageKey]);
 useEffect(()=>{const sync=e=>{if(e.key===storageKey)setLanguage(validLanguage(e.newValue));};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[storageKey]);
 const value=useMemo(()=>({language,setLanguage:l=>setLanguage(validLanguage(l)),t:v=>translate(v,language)}),[language]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
