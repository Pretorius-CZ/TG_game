import {getAdConsent} from './adConsent.js';
import {suspendGameDialogs} from './googleH5Ads.js';
import {message} from './i18n/messages.js';
let opening;
export function showAdConsent(change=false,{pause=()=>{},loadingText}={}){
 if(opening)return opening;
 const opener=document.activeElement,resume=suspendGameDialogs();pause(true);
 const owned=[...document.body.querySelectorAll(':scope > #root,:scope > main,:scope > header,:scope > footer,:scope > nav,:scope > .skip')].map(node=>[node,node.inert]);
 for(const [node] of owned)node.inert=true;
 const waiting=document.createElement('div');waiting.className='consent-loading';waiting.setAttribute('role','status');
 waiting.textContent=loadingText??message('consent.loading',{},document.documentElement.lang);
 waiting.style.cssText='position:fixed;inset:0;z-index:1000;display:grid;place-items:center;background:#06111de6;color:#e6f1ef;font:16px system-ui;padding:24px;text-align:center';
 document.body.append(waiting);
 opening=getAdConsent().request({change}).finally(()=>{
  waiting.remove();for(const [node,inert] of owned)node.inert=inert;
  resume();pause(false);if(opener?.isConnected)opener.focus({preventScroll:true});opening=null;
 });
 return opening;
}
export function consentFeedback(status,language='en'){
 // Retain boolean callers while moving UI to locale codes.
 const code=typeof language==='boolean'?(language?'cs':'en'):language;
 return message(status==='unavailable'?'consent.unavailable':status==='not-required'?'consent.not-required':'consent.received',{},code);
}
export function attachAdChoices(messages){
 for(const button of document.querySelectorAll('.privacy-choices'))button.addEventListener('click',async()=>{
  const language=document.documentElement.lang,feedback=document.querySelector('.privacy-choice-status');
  button.disabled=true;if(feedback){feedback.hidden=false;feedback.textContent=messages?.opening??message('ui.AdChoicesButton.opening-advertising-choices',{},language);}
  try{const status=await showAdConsent(true,{loadingText:messages?.loading});if(feedback)feedback.textContent=messages?.[status]??messages?.received??consentFeedback(status,language);}
  finally{button.disabled=false;}
 });
}
