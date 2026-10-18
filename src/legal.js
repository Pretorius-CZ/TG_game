import './landing-page.css';
import './legal.css';
import {attachAdChoices} from './consentUI.js';
const key='to-the-stars-language';
function setLanguage(language){
 document.documentElement.lang=language;
 for(const section of document.querySelectorAll('[data-copy]'))section.hidden=section.dataset.copy!==language;
 for(const button of document.querySelectorAll('[data-language]'))button.setAttribute('aria-pressed',String(button.dataset.language===language));
 for(const button of document.querySelectorAll('.privacy-choices'))button.textContent=language==='cs'?'Reklamní souhlasy':'Advertising privacy choices';
 const heading=document.querySelector(`[data-copy="${language}"] h1`);if(heading)document.title=heading.textContent+' — Beyond the Signal';
 try{localStorage.setItem(key,language);}catch{}
}
let language='en';try{if(localStorage.getItem(key)==='cs')language='cs';}catch{}
setLanguage(language);
for(const button of document.querySelectorAll('[data-language]'))button.addEventListener('click',()=>setLanguage(button.dataset.language));
attachAdChoices();
