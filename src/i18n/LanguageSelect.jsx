import React from 'react';
import {releasedLocales} from './locales.js';
import {useLanguage} from './Language.jsx';
export default function LanguageSelect({compact=false}){
 const {language,setLanguage,t}=useLanguage();
 return <select aria-label={t('Language')} value={language} onChange={event=>setLanguage(event.target.value)}>
  {releasedLocales.map(locale=><option key={locale.code} value={locale.code} lang={locale.code}>{compact?locale.short:locale.name}</option>)}
 </select>;
}
