import {updates} from './welcomeUpdates.js';
import {gameAddress,hasOriginalSave,ORIGINAL_ORIGIN} from './gameAddress.js';
import {attachAdChoices} from './consentUI.js';

// Finish callbacks on their original origin, where the PKCE verifier is stored.
const callback=new URLSearchParams(location.search);
if(location.origin===ORIGINAL_ORIGIN&&(callback.has('code')||callback.has('error')||callback.has('error_code')||/access_token=/.test(location.hash))){
 location.replace(new URL(`./legacy-game.html${location.search}${location.hash}`,location.href));
}

const key='to-the-stars-language';
const cs={
 skip:'Přejít k obsahu',playShort:'Hrát ↗',genre:'SCI-FI DOBRODRUŽSTVÍ SE SPOJOVÁNÍM KAMENŮ',
 navLabel:'Hlavní navigace',navAbout:'O hře',navUpdates:'Novinky',navGuides:'Jak hrát',
 contact:'Kontakt',privacy:'Ochrana soukromí',
 adChoices:'Reklamní souhlasy',
 contentNote:'187 levelů · Příběh, průzkum a opravy · Česky / anglicky',
 guidesLabel:'TVŮJ LETOVÝ MANUÁL',guidesTitle:'Malá pomoc na cestu.',
 guideMatchTitle:'01 / První hlavolam',
 guideMatch:'Prohoď sousední kameny a spoj alespoň tři stejného typu. Cíle najdeš nad deskou: někdy sbíráš konkrétní barvy, jindy rozbíjíš kryty nebo nabíjíš kruhy. Splň všechny cíle, než ti dojdou tahy.',
 guideStars:'Výhra odemkne další úkol. Tři hvězdy jsou dobrovolná výzva; dokončené opravy si můžeš zopakovat přes Kapitoly.',
 guideChargesTitle:'02 / Pulse, Nova a pomůcky',
 guideCharges:'Čtyři kameny v řadě nebo pět do T či L vytvoří Pulse, který zasáhne oblast 3×3. Pět a více v řadě vytvoří Novu, která zasáhne řádek i sloupec. Klepnutím odpálíš nálož za jeden tah; řetězové výbuchy jsou zdarma.',
 guideTools:'Pomůcky pod deskou spotřebují zásobu místo tahu. Laser zasáhne kámen, Míchání přeskupí desku, Výměna prohodí sousedy, Paprsek zasáhne řádek a EMP oblast 3×3. Obrázkovou nápovědu znovu otevřeš přes ⓘ v minihře.',
 guideObstaclesTitle:'03 / Kryty a rezonátory',
 guideCovers:'Zakrytý kámen nelze přesouvat. Zapoj ho do spojení a kryt praskne; kámen zůstane pro další spojení. Kryty rozbíjejí i výbuchy.',
 guideRings:'Kruhy nabíjíš spojením přímo vedle nich: shora, zdola, zleva nebo zprava. Každá vlna spojení přidá kruhu jeden náboj. Úhlopříčka ani přímý výbuch kruh nenabíjí.',
 guideEnergyTitle:'04 / Energie a přestávky',
 guideEnergy:'První platný tah rezervuje jeden článek energie. Výhra ho vrátí; prohra, odchod po tahu nebo obnovení stránky jej ponechá spotřebovaný. Otevření minihry bez tahu energii nestojí. U energie vidíš, kdy se článek obnoví.',
 guideSaveTitle:'05 / Uložení tvé cesty',
 guideSave:'Postup hosta se ukládá v tomto prohlížeči. Přihlášení přes Google ukládá postup do cloudu pro stejný účet na dalších zařízeních. Energie a zásoby pomůcek se ukládají místně.',
 guideTransfer:'Hrál jsi na původní adrese? Nejdřív přenes uloženou hru, potom se na nové adrese přihlas stejným Google účtem. Samotné přihlášení nepřenese místní energii a pomůcky. Původní uložená hra zůstane dostupná.',
 transferLink:'Přenést uloženou hru ↗',
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
let restore=false;try{restore=location.origin===ORIGINAL_ORIGIN&&hasOriginalSave(localStorage);}catch{}
const game=gameAddress(location.href,{transfer:restore});
for(const link of document.querySelectorAll('.game-link'))link.href=game;
for(const link of document.querySelectorAll('.transfer-link'))link.href=gameAddress(location.href,{transfer:true});
document.getElementById('year').textContent=String(new Date().getFullYear());
attachAdChoices();
