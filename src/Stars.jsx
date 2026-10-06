import React,{createContext,useContext} from 'react';
import {useLanguage} from './i18n/Language.jsx';
import {earnedStars} from './starRating.js';
import './stars.css';
const Context=createContext({stars:{},award:()=>{}});
export const useStars=()=>useContext(Context);
export function StarProvider({progress,onProgress,children}){
 const award=(id,budget,moves)=>onProgress(p=>({...p,stars:{...p.stars,[id]:Math.max(p.stars?.[id]??1,earnedStars(budget,moves))}}));
 return <Context.Provider value={{stars:progress.stars??{},award}}>{children}</Context.Provider>;
}
export default function Stars({id,value,hero=false}){
 const {stars}=useStars(),{language}=useLanguage(),n=value??stars[id]??1;
 return <span className={`rating-stars${hero?' hero-rating':''}`} aria-label={language==='cs'?`${n} ze 3 hvězd`:`${n} of 3 stars`}>{[0,1,2].map(i=><svg key={i} className={i<n?'earned':'empty'} viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/></svg>)}</span>;
}
