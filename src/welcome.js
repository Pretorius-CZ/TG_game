import {updates} from './welcomeUpdates.js';

const key='to-the-stars-language';
const cs={
 skip:'Přejít k obsahu',playShort:'Hrát ↗',genre:'SCI-FI DOBRODRUŽSTVÍ SE SPOJOVÁNÍM KAMENŮ',
 title1:'Vzdálený signál.',title2:'Nový začátek.',intro:'Tvoje loď je poškozená. Tajemný signál se pořád ozývá. Spojuj kameny, vrať lodi život a zjisti, co se skrývá v dálce.',
 play:'Hrát zdarma',availability:'V prohlížeči · Mobil i počítač · Bez stahování',discover:'Objev dobrodružství',
 aboutLabel:'VÍC NEŽ SPOJOVÁNÍ KAMENŮ',aboutTitle:'Každý hlavolam vrací tvému světu život.',
 story:'Obyčejný zásobovací let nabere nečekaný směr, když se vydáš za majákem ztracené výpravy. Po nouzovém přistání začíná tvoje cesta poškozenou lodí — a jednou malou opravou.',
 aboutBody:'Řeš hlavolamy se spojováním kamenů, obnovuj jednotlivé části lodi, odhaluj lodní deník a vydej se ke vzdáleným světům. S každou opravou se prostředí kolem tebe proměňuje.',
 tileNote:'Spoj kameny. Proměň svůj svět.',galleryLabel:'Pohled do hry',
 airlockAlt:'Přechodová komora poškozené lodi',iceAlt:'Výprava na ledový svět',gardenAlt:'Zářící mimozemská zahrada',
 repairTitle:'Oprav svou loď',repairBody:'Od prvního záblesku světla až po loď připravenou ke hvězdám.',
 exploreTitle:'Vydej se za signálem',exploreBody:'Opusť místo havárie a objevuj stopy ztracené výpravy.',
 restoreTitle:'Vrať světům život',restoreBody:'Objevuj nová místa, další hlavolamy a něco, co stojí za záchranu.',
 updatesLabel:'ZPRÁVY Z VÝVOJE',updatesTitle:'Co je nového',development:'Nezávislá hra, která dál roste',
 closingLabel:'TVOJE DALŠÍ KAPITOLA ZAČÍNÁ TADY',closingTitle:'Signál se pořád ozývá.',footer:'Nezávislé sci-fi dobrodružství s hlavolamy.'
};
const english=new Map();
for(const node of document.querySelectorAll('[data-text],[data-alt],[data-label]')){
 const attribute=node.hasAttribute('data-alt')?'alt':node.hasAttribute('data-label')?'aria-label':null;
 english.set(node,{attribute,value:attribute?node.getAttribute(attribute):node.textContent});
}
function setLanguage(language){
 const czech=language==='cs';document.documentElement.lang=language;
 for(const [node,{attribute,value}] of english){const id=node.dataset.text||node.dataset.alt||node.dataset.label,text=czech?cs[id]||value:value;if(attribute)node.setAttribute(attribute,text);else node.textContent=text;}
 for(const button of document.querySelectorAll('[data-language]'))button.setAttribute('aria-pressed',String(button.dataset.language===language));
 document.title=czech?'Beyond the Signal — Sci-fi dobrodružství s hlavolamy':'Beyond the Signal — A sci-fi puzzle adventure';
 const list=document.getElementById('update-list');list.replaceChildren();
 for(const update of updates){
  const content=update[language],article=document.createElement('article');article.className='update';
  const time=document.createElement('time');time.dateTime=update.date;time.textContent=new Intl.DateTimeFormat(czech?'cs-CZ':'en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(update.date+'T12:00:00Z'));
  const body=document.createElement('div'),tag=document.createElement('span'),title=document.createElement('h3'),text=document.createElement('p');tag.className='update-tag';tag.textContent=content.tag;title.textContent=content.title;text.textContent=content.body;body.append(tag,title,text);article.append(time,body);list.append(article);
 }
 try{localStorage.setItem(key,language);}catch{}
}
let language='en';try{if(localStorage.getItem(key)==='cs')language='cs';}catch{}
setLanguage(language);
for(const button of document.querySelectorAll('[data-language]'))button.addEventListener('click',()=>setLanguage(button.dataset.language));
// Carry campaign attribution into the game, without forwarding arbitrary URL parameters.
const params=new URLSearchParams(location.search),game=new URL('./',location.href);
for(const name of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'])if(params.has(name))game.searchParams.set(name,params.get(name));
for(const link of document.querySelectorAll('.game-link'))link.href=game.href;
document.getElementById('year').textContent=String(new Date().getFullYear());
