// Only complete, checked languages belong in the public selectors.
export const LANGUAGE_KEY='to-the-stars-language';
export const locales=Object.freeze([
 {code:'en',name:'English',short:'EN',direction:'ltr',status:'released'},
 {code:'cs',name:'Čeština',short:'CZ',direction:'ltr',status:'released'},
 {code:'de',name:'Deutsch',short:'DE',direction:'ltr',status:'released'},
 {code:'fr',name:'Français',short:'FR',direction:'ltr',status:'released'},
 {code:'es',name:'Español',short:'ES',direction:'ltr',status:'released'},
 {code:'pt-BR',name:'Português (Brasil)',short:'PT-BR',direction:'ltr',status:'draft'},
].map(Object.freeze));
export const releasedLocales=Object.freeze(locales.filter(locale=>locale.status==='released'));
export function matchLocale(value,{includeDrafts=false}={}){
 if(typeof value!=='string')return null;
 const tag=value.trim().replaceAll('_','-').toLowerCase();
 const available=includeDrafts?locales:releasedLocales;
 const exact=available.find(locale=>locale.code.toLowerCase()===tag);
 if(exact)return exact.code;
 // A bare Portuguese preference targets our Brazilian edition; pt-PT does not.
 if(tag==='pt')return available.find(locale=>locale.code==='pt-BR')?.code??null;
 return available.find(locale=>!locale.code.includes('-')&&locale.code===tag.split('-')[0])?.code??null;
}
export const validLanguage=value=>matchLocale(value)??'en';
export function preferredLanguage({saved,languages=[],fallback='en'}={}){
 const stored=matchLocale(saved);if(stored)return stored;
 for(const value of languages){const locale=matchLocale(value);if(locale)return locale;}
 return validLanguage(fallback);
}
export function initialLanguage({storage,storageKey=LANGUAGE_KEY,languages=[],fallback='en',requested}={}){
 const explicit=matchLocale(requested);if(explicit)return explicit;
 let saved;try{saved=storage?.getItem(storageKey);}catch{}
 return preferredLanguage({saved,languages,fallback});
}
export function addressLanguage(href){try{return matchLocale(new URL(href).searchParams.get('lang'));}catch{return null;}}
export function syncAddressLanguage(language,location,history){
 try{const url=new URL(location.href);if(url.searchParams.has('lang')){url.searchParams.set('lang',validLanguage(language));history.replaceState(history.state,'',url.href);}}catch{}
}
export function applyDocumentLanguage(language,document){
 const code=validLanguage(language),locale=releasedLocales.find(item=>item.code===code);
 document.documentElement.lang=code;document.documentElement.dir=locale.direction;
 return code;
}
