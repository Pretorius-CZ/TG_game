import './landing-page.css';
import './legal.css';
import {attachAdChoices} from './consentUI.js';
import {LANGUAGE_KEY,initialLanguage,applyDocumentLanguage,releasedLocales,addressLanguage,syncAddressLanguage} from './i18n/locales.js';
function setLanguage(language){
 language=applyDocumentLanguage(language,document);
 syncAddressLanguage(language,location,history);
 for(const section of document.querySelectorAll('[data-copy]'))section.hidden=section.dataset.copy!==language;
 for(const button of document.querySelectorAll('[data-language]'))button.setAttribute('aria-pressed',String(button.dataset.language===language));
 for(const button of document.querySelectorAll('.privacy-choices'))button.textContent=language==='cs'?'Reklamní souhlasy':'Advertising privacy choices';
 const heading=document.querySelector(`[data-copy="${language}"] h1`);if(heading)document.title=heading.textContent+' — Beyond the Signal';
 try{localStorage.setItem(LANGUAGE_KEY,language);}catch{}
}
for(const group of document.querySelectorAll('.languages'))group.replaceChildren(...releasedLocales.map(locale=>{const button=document.createElement('button');button.type='button';button.dataset.language=locale.code;button.lang=locale.code;button.textContent=locale.short;button.setAttribute('aria-label',locale.name);button.addEventListener('click',()=>setLanguage(locale.code));return button;}));
let storage;try{storage=localStorage;}catch{}
setLanguage(initialLanguage({storage,languages:navigator.languages,requested:addressLanguage(location.href)}));
window.addEventListener('storage',event=>{if(event.key===LANGUAGE_KEY)setLanguage(initialLanguage({storage,languages:navigator.languages}));});
attachAdChoices();
