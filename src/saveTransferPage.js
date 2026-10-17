import './saveTransferPage.css';
import {exportBackup,validateBackup,planImport,importBackup,readPending,recoverTransfer} from './saveTransfer.js';
import {transferOrigins,validTransferMessage} from './transferOrigins.js';

const origins=transferOrigins(location,import.meta.env.DEV);
const target=location.origin===origins.target,source=location.origin===origins.source;
const fragment=new URLSearchParams(location.hash.slice(1));
const sourceNonce=fragment.get('nonce');
history.replaceState(null,'',location.pathname+location.search);
let storage,cs=false;
try{storage=localStorage;cs=storage.getItem('to-the-stars-language')==='cs';}catch{}
const text=(en,cz)=>cs?cz:en;
document.documentElement.lang=cs?'cs':'en';
const main=document.getElementById('transfer');
function el(tag,content,parent=main){const node=document.createElement(tag);if(content)node.textContent=content;parent.append(node);return node;}
function button(label,action,parent=main){const b=el('button',label,parent);b.type='button';b.addEventListener('click',()=>{try{action();}catch(error){status(error.message,true);}});return b;}
function link(label,url,parent=main){const a=el('a',label,parent);a.href=url;a.className='transfer-link';return a;}
el('h1',text('Keep your saved game','Zachovat uloženou hru'));
el('p',target?text('Copy your saved game from the original address, or restore a backup file.','Zkopíruj uloženou hru z původní adresy nebo obnov zálohu ze souboru.'):text('Your original saved game stays in this browser. This page copies it; it does not delete it.','Původní uložená hra zůstává v tomto prohlížeči. Tato stránka ji kopíruje, nemaže.'));
el('p',text('Close other game tabs here before importing. Account sign-in is separate; use the same Google account after the transfer. Energy, helper stock and guest saves are included. Unfinished puzzles are not saved.','Před importem zavři ostatní karty s hrou na této adrese. Přihlášení je samostatné; po přenosu použij stejný Google účet. Přenáší se i energie, zásoba pomůcek a postup hosta. Rozehrané desky se neukládají.'));
const statusNode=el('p');statusNode.id='status';statusNode.setAttribute('role','status');statusNode.setAttribute('aria-live','polite');
function status(message,error=false){statusNode.textContent=message;statusNode.dataset.error=String(error);}
function download(backup){const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`beyond-signal-save-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function hasPending(){if(!storage)throw Error(text('Browser storage is unavailable. Open this page in the original browser with storage enabled.','Úložiště prohlížeče není dostupné. Otevři stránku v původním prohlížeči s povoleným ukládáním.'));return readPending(storage);}
function refresh(){location.reload();}
try{
 if(!source&&!target)throw Error('This transfer page is not configured for this address.');
 if(hasPending()){
  const box=el('section');el('h2',text('Interrupted transfer','Přerušený přenos'),box);
  el('p',text('The game is paused until the local transfer is recovered. The original website still has its copy.','Hra čeká na obnovu místního přenosu. Na původním webu je stále původní kopie.'),box);
  button(text('Finish transfer','Dokončit přenos'),()=>{recoverTransfer(storage,'finish');refresh();},box);
  button(text('Undo transfer','Vrátit přenos'),()=>{recoverTransfer(storage,'rollback');refresh();},box);
 }else{
  let incoming=null,peer=null,nonce=null;
  const preview=el('section');preview.hidden=true;
  el('h2',text('Review before importing','Kontrola před importem'),preview);
  const summary=el('p','',preview);
  const replaceLabel=el('label','',preview),replace=document.createElement('input');replace.type='checkbox';replaceLabel.append(replace,document.createTextNode(text('Use the original copy instead of conflicting local data. A rollback copy is kept during the import.','Použít původní kopii místo odlišných místních dat. Během importu se uchová kopie pro návrat.')));
  const apply=button(text('Import saved game','Importovat uloženou hru'),()=>{
   if(!incoming)return;
   // Preserve a downloadable target backup before any intentional replacement.
   if(replace.checked)download(exportBackup(storage));
   const result=importBackup(storage,incoming,{replace:replace.checked});
   if(!result.already&&!result.changes.length&&result.conflicts.length){status(text('Nothing was changed. The existing saved game was kept.','Nic se nezměnilo. Současná uložená hra zůstala zachována.'));return;}
   preview.hidden=true;
   status(text(`Saved and verified. ${result.skipped.length} existing entries were kept. You can continue playing.`,`Uloženo a ověřeno. Zachováno ${result.skipped.length} stávajících položek. Můžeš pokračovat ve hře.`));
   if(peer&&!peer.closed)peer.postMessage({channel:'beyond-signal-transfer-v1',type:'saved',nonce},origins.source);
  },preview);
  function offer(input){
   incoming=validateBackup(input);const plan=planImport(storage,incoming);
   if(plan.already){status(text('This backup has already been imported. No energy or helpers were restored again.','Tato záloha už byla importována. Energie ani pomůcky se znovu nedoplnily.'));preview.hidden=true;return;}
   replace.checked=false;replaceLabel.hidden=!plan.conflicts.length;
   summary.textContent=text(`${Object.keys(incoming.entries).length} entries; ${plan.conflicts.length} conflicts. Existing entries are kept unless you choose otherwise.`,`${Object.keys(incoming.entries).length} položek; ${plan.conflicts.length} konfliktů. Stávající položky se zachovají, pokud nezvolíš jinak.`);
   preview.hidden=false;apply.focus();
  }
  const online=el('section');el('h2',text('Transfer between addresses','Přenos mezi adresami'),online);
  if(target){
   button(text('Open original saved game','Otevřít původní uloženou hru'),()=>{
    if(peer&&!peer.closed)peer.close();nonce=crypto.randomUUID();
    peer=window.open(`${origins.source}/transfer.html#nonce=${encodeURIComponent(nonce)}`,'_blank','popup,width=500,height=720');
    if(!peer){status(text('The popup was blocked. Allow it, or download a backup on the original website and import it below.','Nové okno bylo zablokováno. Povol ho nebo na původním webu stáhni zálohu a níže ji importuj.'),true);return;}
    status(text('In the opened window, choose “Send saved game”. Keep this page open.','V otevřeném okně zvol „Odeslat uloženou hru“. Tuto stránku nech otevřenou.'));
   },online);
   window.addEventListener('message',event=>{
    if(!validTransferMessage(event,{origin:origins.source,source:peer,nonce},'backup'))return;
    try{offer(event.data.backup);}catch(error){status(error.message,true);}
   });
  }else{
   if(window.opener&&sourceNonce&&sourceNonce.length>=32){
    button(text('Send saved game','Odeslat uloženou hru'),()=>{
     const backup=exportBackup(storage);window.opener.postMessage({channel:'beyond-signal-transfer-v1',type:'backup',nonce:sourceNonce,backup},origins.target);
     status(text('Sent for review. Return to the new website to confirm the import. The original copy is unchanged.','Odesláno ke kontrole. Vrať se na nový web a potvrď import. Původní kopie se nezměnila.'));
    },online);
    window.addEventListener('message',event=>{if(validTransferMessage(event,{origin:origins.target,source:window.opener,nonce:sourceNonce},'saved'))status(text('The new website confirmed saving your data. The original copy is still here.','Nový web potvrdil uložení dat. Původní kopie zůstává zde.'));});
   }else{
    el('p',text('Open the new website first and start the transfer there. Alternatively, use the backup file below.','Nejdřív otevři nový web a zahaj přenos tam. Případně použij záložní soubor níže.'),online);
    link(text('Open new transfer page','Otevřít přenos na novém webu'),`${origins.target}/transfer.html`,online);
   }
  }
  const files=el('section');el('h2',text('Backup file','Záložní soubor'),files);
  button(text('Download this browser’s backup','Stáhnout zálohu z tohoto prohlížeče'),()=>download(exportBackup(storage)),files);
  const label=el('label',text('Restore a backup file','Obnovit záložní soubor'),files),file=document.createElement('input');file.type='file';file.accept='.json,application/json';label.append(file);
  file.addEventListener('change',async()=>{try{const selected=file.files[0];if(!selected)return;if(selected.size>4*1024*1024)throw Error('Backup is too large.');offer(JSON.parse(await selected.text()));}catch(error){status(error.message,true);}finally{file.value='';}});
  const game=new URL('./',location.href),campaign=new URLSearchParams(location.search);
  for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'])if(campaign.has(key))game.searchParams.set(key,campaign.get(key));
  link(text('Continue to the game','Pokračovat do hry'),game.href);
 }
}catch(error){status(error.message,true);}
