import './saveTransferPage.css';
import {exportBackup,validateBackup,planImport,importBackup,readPending,recoverTransfer,summarizeBackup} from './saveTransfer.js';
import {transferOrigins,validTransferMessage} from './transferOrigins.js';
import {initialLanguage,addressLanguage,applyDocumentLanguage} from './i18n/locales.js';

const origins=transferOrigins(location,import.meta.env.DEV);
const target=location.origin===origins.target,source=location.origin===origins.source;
const sourceReady=import.meta.env.DEV||import.meta.env.VITE_LEGACY_TRANSFER_READY==='true';
const snapshot=()=>exportBackup(storage,{includeUnusedStock:source});
const fragment=new URLSearchParams(location.hash.slice(1));
const sourceNonce=fragment.get('nonce');
history.replaceState(null,'',location.pathname+location.search);
let storage;try{storage=localStorage;}catch{}
const language=initialLanguage({storage,languages:navigator.languages,requested:addressLanguage(location.href)}),cs=language==='cs';
const text=(en,cz,de)=>language==='de'?de:cs?cz:en;
applyDocumentLanguage(language,document);
const transferErrors={
 'Invalid or unsupported save backup.':'Die Sicherungsdatei ist ungültig oder wird nicht unterstützt.',
 'Transfer history is unreadable.':'Der Übertragungsverlauf kann nicht gelesen werden.',
 'Backup is too large.':'Die Sicherungsdatei ist zu groß.',
 'Could not verify the saved data.':'Die gespeicherten Daten konnten nicht überprüft werden.',
 'Unknown recovery action.':'Diese Wiederherstellungsaktion wird nicht unterstützt.',
 'Recover the interrupted transfer first.':'Stelle zuerst die unterbrochene Übertragung wieder her.',
 'Browser storage is unavailable. Open this page in the original browser with storage enabled.':'Der Browserspeicher ist nicht verfügbar. Öffne diese Seite im bisherigen Browser und erlaube das Speichern von Daten.',
 'This transfer page is not configured for this address.':'Diese Übertragungsseite ist für diese Adresse nicht eingerichtet.'
};
const main=document.getElementById('transfer');
function el(tag,content,parent=main){const node=document.createElement(tag);if(content)node.textContent=content;parent.append(node);return node;}
function button(label,action,parent=main){const b=el('button',label,parent);b.type='button';b.addEventListener('click',()=>{try{action();}catch(error){status(error.message,true);}});return b;}
function link(label,url,parent=main){const a=el('a',label,parent);a.href=url;a.className='transfer-link';return a;}
el('h1',text('Keep your saved game','Zachovat uloženou hru',"Deinen Spielstand behalten"));
el('p',target?text('Copy your saved game from the original address, or restore a backup file.','Zkopíruj uloženou hru z původní adresy nebo obnov zálohu ze souboru.',"Kopiere deinen Spielstand von der bisherigen Adresse oder stelle eine Sicherungsdatei wieder her."):text('Your original saved game stays in this browser. This page copies it; it does not delete it.','Původní uložená hra zůstává v tomto prohlížeči. Tato stránka ji kopíruje, nemaže.',"Dein bisheriger Spielstand bleibt in diesem Browser. Diese Seite kopiert ihn, ohne ihn zu löschen."));
el('p',text('First transfer your saved game, then sign in with the same Google account if you used one before. Guest players can continue without signing in. Energy and helpers are included. Close other game tabs here before importing; unfinished puzzles are not saved.','Nejdřív přenes uloženou hru a potom se přihlas stejným Google účtem, pokud jsi ho používal. Host může pokračovat bez přihlášení. Přenáší se i energie a pomůcky. Před importem zavři ostatní karty hry na této adrese; rozehrané desky se neukládají.',"Übertrage zuerst deinen Spielstand. Wenn du bisher ein Google-Konto genutzt hast, melde dich danach mit demselben Konto an. Als Gast kannst du ohne Anmeldung weiterspielen. Energie und Hilfsmittel werden ebenfalls übertragen. Schließe vor dem Import andere Spieltabs unter dieser Adresse. Laufende Rätsel werden nicht gespeichert."));
const statusNode=el('p');statusNode.id='status';statusNode.setAttribute('role','status');statusNode.setAttribute('aria-live','polite');
function status(message,error=false){if(error&&language==='de')message=transferErrors[message]??(Object.values(transferErrors).includes(message)?message:'Die Übertragung konnte nicht abgeschlossen werden. Deine bisherige Kopie bleibt erhalten. Prüfe die Datei und die Speichereinstellungen des Browsers.');statusNode.textContent=message;statusNode.dataset.error=String(error);}
function download(backup){const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`beyond-signal-save-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function hasPending(){if(!storage)throw Error(text('Browser storage is unavailable. Open this page in the original browser with storage enabled.','Úložiště prohlížeče není dostupné. Otevři stránku v původním prohlížeči s povoleným ukládáním.',"Der Browserspeicher ist nicht verfügbar. Öffne diese Seite im bisherigen Browser und erlaube das Speichern von Daten."));return readPending(storage);}
function refresh(){location.reload();}
try{
 if(!source&&!target)throw Error('This transfer page is not configured for this address.');
 if(hasPending()){
  const box=el('section');el('h2',text('Interrupted transfer','Přerušený přenos',"Unterbrochene Übertragung"),box);
  el('p',text('The game is paused until the local transfer is recovered. The original website still has its copy.','Hra čeká na obnovu místního přenosu. Na původním webu je stále původní kopie.',"Das Spiel wartet, bis die lokale Übertragung wiederhergestellt wurde. Die bisherige Website hat weiterhin ihre Kopie."),box);
  button(text('Finish transfer','Dokončit přenos',"Übertragung abschließen"),()=>{recoverTransfer(storage,'finish');refresh();},box);
  button(text('Undo transfer','Vrátit přenos',"Übertragung rückgängig machen"),()=>{recoverTransfer(storage,'rollback');refresh();},box);
 }else{
  let incoming=null,peer=null,nonce=null;
  const preview=el('section');preview.hidden=true;
  el('h2',text('Review before importing','Kontrola před importem',"Vor dem Import prüfen"),preview);
  const summary=el('p','',preview);
  const replaceLabel=el('label','',preview),replace=document.createElement('input');replace.type='checkbox';replaceLabel.append(replace,document.createTextNode(text('Use the original copy instead of conflicting local data. A rollback copy is kept during the import.','Použít původní kopii místo odlišných místních dat. Během importu se uchová kopie pro návrat.',"Die bisherige Kopie anstelle abweichender lokaler Daten verwenden. Während des Imports wird eine Kopie zum Wiederherstellen aufbewahrt.")));
  const apply=button(text('Import saved game','Importovat uloženou hru',"Spielstand importieren"),()=>{
   if(!incoming)return;
   // Preserve a downloadable target backup before any intentional replacement.
   if(replace.checked)download(exportBackup(storage));
   const result=importBackup(storage,incoming,{replace:replace.checked});
   if(!result.already&&!result.changes.length&&result.conflicts.length){status(text('Nothing was changed. The existing saved game was kept.','Nic se nezměnilo. Současná uložená hra zůstala zachována.',"Es wurde nichts geändert. Dein vorhandener Spielstand bleibt erhalten."));return;}
   preview.hidden=true;
   updateGameLink();
   const accounts=summarizeBackup(incoming).accounts;
   status(text(`Saved and verified. ${accounts?'Continue to the game and sign in with the same Google account to open your account save.':'You can continue playing as a guest.'}${result.skipped.length?' Some existing settings or saved data were kept.':''}`,`Uloženo a ověřeno. ${accounts?'Pokračuj do hry a přihlas se stejným Google účtem, aby se otevřel jeho postup.':'Můžeš pokračovat jako host.'}${result.skipped.length?' Část stávajících nastavení nebo dat zůstala zachovaná.':''}`,`Gespeichert und überprüft. ${accounts?'Öffne das Spiel und melde dich mit demselben Google-Konto an, um deinen Kontospielstand zu laden.':'Du kannst als Gast weiterspielen.'}${result.skipped.length?' Einige vorhandene Einstellungen oder Daten wurden beibehalten.':''}`));
   if(peer&&!peer.closed)peer.postMessage({channel:'beyond-signal-transfer-v1',type:'saved',nonce},origins.source);
  },preview);
  function offer(input){
   incoming=validateBackup(input);const plan=planImport(storage,incoming);
   if(plan.already){status(text('This backup has already been imported. No energy or helpers were restored again.','Tato záloha už byla importována. Energie ani pomůcky se znovu nedoplnily.',"Diese Sicherung wurde bereits importiert. Energie und Hilfsmittel wurden nicht erneut aufgefüllt."));preview.hidden=true;return;}
   replace.checked=false;replaceLabel.hidden=!plan.conflicts.length;
   const details=summarizeBackup(incoming);
   summary.textContent=text(`${details.guest?'Guest progress found. ':''}${details.accounts?`Saved Google accounts: ${details.accounts}. `:''}${details.energy!==null?`Original energy: ${details.energy}/5. `:''}${plan.conflicts.length?'There is also saved data here. Existing conflicting data is kept unless you choose the original copy below.':'Your saved data is ready to import. Account progress is combined safely; used energy and helpers are not refilled.'}`,`${details.guest?'Nalezen postup hosta. ':''}${details.accounts?`Uložené Google účty: ${details.accounts}. `:''}${details.energy!==null?`Původní energie: ${details.energy}/5. `:''}${plan.conflicts.length?'Na této adrese už jsou uložená data. Odlišná stávající data se zachovají, pokud níže nezvolíš původní kopii.':'Uložená data jsou připravená k převzetí. Postup účtu se bezpečně spojí; spotřebovaná energie a pomůcky se nedoplňují.'}`,`${details.guest?'Gastspielstand gefunden. ':''}${details.accounts?`Gespeicherte Google-Konten: ${details.accounts}. `:''}${details.energy!==null?`Bisherige Energie: ${details.energy}/5. `:''}${plan.conflicts.length?'Unter dieser Adresse sind bereits Daten gespeichert. Abweichende vorhandene Daten bleiben erhalten, sofern du unten nicht die bisherige Kopie auswählst.':'Dein Spielstand kann importiert werden. Kontofortschritte werden sicher zusammengeführt. Verbrauchte Energie und Hilfsmittel werden nicht aufgefüllt.'}`);
   preview.hidden=false;apply.focus();
  }
  const online=el('section');el('h2',text('Transfer between addresses','Přenos mezi adresami',"Zwischen den Adressen übertragen"),online);
  if(target){
   if(!sourceReady){
    el('p',text('Transfer from the original website is being prepared. Your existing game is still there; please continue there for now.','Přenos z původního webu připravujeme. Tvoje dosavadní hra zůstává tam; zatím v ní prosím pokračuj na původní adrese.',"Die Übertragung von der bisherigen Website wird vorbereitet. Dein Spielstand ist weiterhin dort. Spiele bitte vorerst unter der bisherigen Adresse weiter."),online);
    link(text('Continue on the original website','Pokračovat na původním webu',"Auf der bisherigen Website weiterspielen"),`${origins.source}/`,online);
   }
   const openOriginal=button(text('Open original saved game','Otevřít původní uloženou hru',"Bisherigen Spielstand öffnen"),()=>{
    if(peer&&!peer.closed)peer.close();nonce=crypto.randomUUID();
    peer=window.open(`${origins.source}/transfer.html?lang=${language}#nonce=${encodeURIComponent(nonce)}`,'_blank','popup,width=500,height=720');
    if(!peer){status(text('The popup was blocked. Allow it, or download a backup on the original website and import it below.','Nové okno bylo zablokováno. Povol ho nebo na původním webu stáhni zálohu a níže ji importuj.',"Das neue Fenster wurde blockiert. Erlaube es oder lade auf der bisherigen Website eine Sicherung herunter und importiere sie unten."),true);return;}
    status(text('In the opened window, choose “Send saved game”. Keep this page open.','V otevřeném okně zvol „Odeslat uloženou hru“. Tuto stránku nech otevřenou.',"Wähle im geöffneten Fenster „Spielstand senden“. Lass diese Seite geöffnet."));
   },online);
   openOriginal.disabled=!sourceReady;
   window.addEventListener('message',event=>{
    if(!validTransferMessage(event,{origin:origins.source,source:peer,nonce},'backup'))return;
    try{offer(event.data.backup);}catch(error){status(error.message,true);}
   });
  }else{
   if(window.opener&&sourceNonce&&sourceNonce.length>=32){
    button(text('Send saved game','Odeslat uloženou hru',"Spielstand senden"),()=>{
     const backup=snapshot();window.opener.postMessage({channel:'beyond-signal-transfer-v1',type:'backup',nonce:sourceNonce,backup},origins.target);
     status(text('Sent for review. Return to the new website to confirm the import. The original copy is unchanged.','Odesláno ke kontrole. Vrať se na nový web a potvrď import. Původní kopie se nezměnila.',"Zur Prüfung gesendet. Kehre zur neuen Website zurück und bestätige den Import. Die bisherige Kopie bleibt unverändert."));
    },online);
    window.addEventListener('message',event=>{if(validTransferMessage(event,{origin:origins.target,source:window.opener,nonce:sourceNonce},'saved'))status(text('The new website confirmed saving your data. The original copy is still here.','Nový web potvrdil uložení dat. Původní kopie zůstává zde.',"Die neue Website hat das Speichern deiner Daten bestätigt. Die bisherige Kopie bleibt hier erhalten."));});
   }else{
    el('p',text('Open the new website first and start the transfer there. Alternatively, use the backup file below.','Nejdřív otevři nový web a zahaj přenos tam. Případně použij záložní soubor níže.',"Öffne zuerst die neue Website und starte die Übertragung dort. Alternativ kannst du unten eine Sicherungsdatei verwenden."),online);
    link(text('Open new transfer page','Otevřít přenos na novém webu',"Übertragung auf der neuen Website öffnen"),`${origins.target}/transfer.html?lang=${language}`,online);
   }
  }
  const files=el('section');el('h2',text('Backup file','Záložní soubor',"Sicherungsdatei"),files);
  button(text('Download this browser’s backup','Stáhnout zálohu z tohoto prohlížeče',"Sicherung dieses Browsers herunterladen"),()=>download(snapshot()),files);
  const label=el('label',text('Restore a backup file','Obnovit záložní soubor',"Sicherungsdatei wiederherstellen"),files),file=document.createElement('input');file.type='file';file.accept='.json,application/json';label.append(file);
  file.addEventListener('change',async()=>{try{const selected=file.files[0];if(!selected)return;if(selected.size>4*1024*1024)throw Error('Backup is too large.');offer(JSON.parse(await selected.text()));}catch(error){status(error.message,true);}finally{file.value='';}});
  const game=new URL('./',location.href),campaign=new URLSearchParams(location.search);
  for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'])if(campaign.has(key))game.searchParams.set(key,campaign.get(key));
  const continueGame=link(text('Continue to the game','Pokračovat do hry',"Zum Spiel"),game.href);
  function updateGameLink(){game.searchParams.set('lang',initialLanguage({storage,languages:[language]}));continueGame.href=game.href;}
  updateGameLink();
 }
}catch(error){status(error.message,true);}
