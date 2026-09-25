import React,{createContext,useContext,useMemo,useState,useEffect} from 'react';
import {translate,validLanguage,LANGUAGE_KEY} from './translate.js';
const Context=createContext({language:'en',setLanguage:()=>{},t:v=>v});
export const useLanguage=()=>useContext(Context);
export function LanguageProvider({children}){
 const [language,setLanguage]=useState(()=>{try{return validLanguage(localStorage.getItem(LANGUAGE_KEY));}catch{return 'en';}});
 useEffect(()=>{document.documentElement.lang=language;try{localStorage.setItem(LANGUAGE_KEY,language);}catch{}},[language]);
 useEffect(()=>{const sync=e=>{if(e.key===LANGUAGE_KEY)setLanguage(validLanguage(e.newValue));};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
 const value=useMemo(()=>({language,setLanguage:l=>setLanguage(validLanguage(l)),t:v=>translate(v,language)}),[language]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
