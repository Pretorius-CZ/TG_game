import {getAdConsent} from './adConsent.js';
import {suspendGameDialogs} from './googleH5Ads.js';
let opening;
export function showAdConsent(change=false,{pause=()=>{}}={}){
 if(opening)return opening;
 const opener=document.activeElement,resume=suspendGameDialogs();pause(true);
 const owned=[...document.body.querySelectorAll(':scope > #root,:scope > main,:scope > header,:scope > footer,:scope > nav,:scope > .skip')].map(node=>[node,node.inert]);
 for(const [node] of owned)node.inert=true;
 const waiting=document.createElement('div');waiting.className='consent-loading';waiting.setAttribute('role','status');
 waiting.textContent=document.documentElement.lang==='cs'?'Načítání voleb soukromí…':'Loading privacy choices…';
 waiting.style.cssText='position:fixed;inset:0;z-index:1000;display:grid;place-items:center;background:#06111de6;color:#e6f1ef;font:16px system-ui;padding:24px;text-align:center';
 document.body.append(waiting);
 opening=getAdConsent().request({change}).finally(()=>{
  waiting.remove();for(const [node,inert] of owned)node.inert=inert;
  resume();pause(false);if(opener?.isConnected)opener.focus({preventScroll:true});opening=null;
 });
 return opening;
}
export function consentFeedback(status,cs){
 if(status==='unavailable')return cs?'Volby souhlasu se nepodařilo načíst. Zpráva možná ještě není zveřejněná, nebo ji blokuje prohlížeč či připojení. Nepovažujeme to za souhlas. Ve hře můžeš pokračovat.':'Consent choices could not load. The message may not be published yet, or your browser or connection may be blocking it. We do not treat this as consent. You can continue playing.';
 if(status==='not-required')return cs?'Google pro tuto návštěvu nevyžaduje evropskou zprávu souhlasu.':'Google does not require the European consent message for this visit.';
 return cs?'Tvoje reklamní volby byly přijaty Googlem. Kdykoli je můžeš změnit.':'Google received your advertising choices. You can change them again at any time.';
}
export function attachAdChoices(){
 for(const button of document.querySelectorAll('.privacy-choices'))button.addEventListener('click',async()=>{
  const cs=document.documentElement.lang==='cs',feedback=document.querySelector('.privacy-choice-status');
  button.disabled=true;if(feedback){feedback.hidden=false;feedback.textContent=cs?'Otevírám reklamní volby…':'Opening advertising choices…';}
  try{const status=await showAdConsent(true);if(feedback)feedback.textContent=consentFeedback(status,document.documentElement.lang==='cs');}
  finally{button.disabled=false;}
 });
}
