import './saveTransferPage.css';
import {exportBackup,validateBackup,planImport,importBackup,readPending,recoverTransfer,summarizeBackup} from './saveTransfer.js';
import {transferOrigins,validTransferMessage} from './transferOrigins.js';
import {initialLanguage,addressLanguage,applyDocumentLanguage,matchLocale} from './i18n/locales.js';

const origins=transferOrigins(location,import.meta.env.DEV);
const target=location.origin===origins.target,source=location.origin===origins.source;
const sourceReady=import.meta.env.DEV||import.meta.env.VITE_LEGACY_TRANSFER_READY==='true';
const snapshot=()=>exportBackup(storage,{includeUnusedStock:source});
const fragment=new URLSearchParams(location.hash.slice(1));
const sourceNonce=fragment.get('nonce');
history.replaceState(null,'',location.pathname+location.search);
let storage;try{storage=localStorage;}catch{}
const previewLanguage=import.meta.env.DEV?matchLocale(new URL(location.href).searchParams.get('previewLanguage'),{includeDrafts:true}):null;
const language=previewLanguage??initialLanguage({storage,languages:navigator.languages,requested:addressLanguage(location.href)}),cs=language==='cs';
const text=(en,cz,de,fr)=>language==='fr'?fr:language==='de'?de:cs?cz:en;
applyDocumentLanguage(language,document);
if(previewLanguage)document.documentElement.lang=previewLanguage;
const transferErrors=language==='fr'?{
 "Invalid or unsupported save backup.": "Le fichier de sauvegarde est invalide ou incompatible.",
 "Transfer history is unreadable.": "L’historique des transferts est illisible.",
 "Backup is too large.": "Le fichier de sauvegarde est trop volumineux.",
 "Could not verify the saved data.": "Impossible de vérifier les données enregistrées.",
 "Unknown recovery action.": "Cette action de récupération est inconnue.",
 "Recover the interrupted transfer first.": "Récupère d’abord le transfert interrompu.",
 "Browser storage is unavailable. Open this page in the original browser with storage enabled.": "Le stockage du navigateur est indisponible. Ouvre cette page dans le navigateur d’origine et autorise le stockage des données.",
 "This transfer page is not configured for this address.": "Cette page de transfert n’est pas configurée pour cette adresse."
}:{
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
el('h1',text('Keep your saved game','Zachovat uloženou hru',"Deinen Spielstand behalten","Conserver ta partie sauvegardée"));
el('p',target?text('Copy your saved game from the original address, or restore a backup file.','Zkopíruj uloženou hru z původní adresy nebo obnov zálohu ze souboru.',"Kopiere deinen Spielstand von der bisherigen Adresse oder stelle eine Sicherungsdatei wieder her.","Copie ta sauvegarde depuis l’ancienne adresse ou restaure un fichier de sauvegarde."):text('Your original saved game stays in this browser. This page copies it; it does not delete it.','Původní uložená hra zůstává v tomto prohlížeči. Tato stránka ji kopíruje, nemaže.',"Dein bisheriger Spielstand bleibt in diesem Browser. Diese Seite kopiert ihn, ohne ihn zu löschen.","Ta sauvegarde d’origine reste dans ce navigateur. Cette page la copie sans la supprimer."));
el('p',text('First transfer your saved game, then sign in with the same Google account if you used one before. Guest players can continue without signing in. Energy and helpers are included. Close other game tabs here before importing; unfinished puzzles are not saved.','Nejdřív přenes uloženou hru a potom se přihlas stejným Google účtem, pokud jsi ho používal. Host může pokračovat bez přihlášení. Přenáší se i energie a pomůcky. Před importem zavři ostatní karty hry na této adrese; rozehrané desky se neukládají.',"Übertrage zuerst deinen Spielstand. Wenn du bisher ein Google-Konto genutzt hast, melde dich danach mit demselben Konto an. Als Gast kannst du ohne Anmeldung weiterspielen. Energie und Hilfsmittel werden ebenfalls übertragen. Schließe vor dem Import andere Spieltabs unter dieser Adresse. Laufende Rätsel werden nicht gespeichert.","Transfère d’abord ta sauvegarde, puis connecte-toi au même compte Google si tu en utilisais un. En tant qu’invité, tu peux continuer sans te connecter. L’énergie et les outils sont inclus. Ferme les autres onglets du jeu à cette adresse avant l’importation. Les grilles en cours ne sont pas sauvegardées."));
const statusNode=el('p');statusNode.id='status';statusNode.setAttribute('role','status');statusNode.setAttribute('aria-live','polite');
function status(message,error=false){if(error&&['de','fr'].includes(language))message=transferErrors[message]??(Object.values(transferErrors).includes(message)?message:language==='fr'?'Le transfert n’a pas pu être terminé. Ta copie d’origine est conservée. Vérifie le fichier et les paramètres de stockage du navigateur.':'Die Übertragung konnte nicht abgeschlossen werden. Deine bisherige Kopie bleibt erhalten. Prüfe die Datei und die Speichereinstellungen des Browsers.');statusNode.textContent=message;statusNode.dataset.error=String(error);}
function download(backup){const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`beyond-signal-save-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function hasPending(){if(!storage)throw Error(text('Browser storage is unavailable. Open this page in the original browser with storage enabled.','Úložiště prohlížeče není dostupné. Otevři stránku v původním prohlížeči s povoleným ukládáním.',"Der Browserspeicher ist nicht verfügbar. Öffne diese Seite im bisherigen Browser und erlaube das Speichern von Daten.","Le stockage du navigateur est indisponible. Ouvre cette page dans le navigateur d’origine et autorise le stockage des données."));return readPending(storage);}
function refresh(){location.reload();}
try{
 if(!source&&!target)throw Error('This transfer page is not configured for this address.');
 if(hasPending()){
  const box=el('section');el('h2',text('Interrupted transfer','Přerušený přenos',"Unterbrochene Übertragung","Transfert interrompu"),box);
  el('p',text('The game is paused until the local transfer is recovered. The original website still has its copy.','Hra čeká na obnovu místního přenosu. Na původním webu je stále původní kopie.',"Das Spiel wartet, bis die lokale Übertragung wiederhergestellt wurde. Die bisherige Website hat weiterhin ihre Kopie.","Le jeu attend la récupération du transfert local. Le site d’origine conserve sa copie."),box);
  button(text('Finish transfer','Dokončit přenos',"Übertragung abschließen","Terminer le transfert"),()=>{recoverTransfer(storage,'finish');refresh();},box);
  button(text('Undo transfer','Vrátit přenos',"Übertragung rückgängig machen","Annuler le transfert"),()=>{recoverTransfer(storage,'rollback');refresh();},box);
 }else{
  let incoming=null,peer=null,nonce=null;
  const preview=el('section');preview.hidden=true;
  el('h2',text('Review before importing','Kontrola před importem',"Vor dem Import prüfen","Vérifier avant l’importation"),preview);
  const summary=el('p','',preview);
  const replaceLabel=el('label','',preview),replace=document.createElement('input');replace.type='checkbox';replaceLabel.append(replace,document.createTextNode(text('Use the original copy instead of conflicting local data. A rollback copy is kept during the import.','Použít původní kopii místo odlišných místních dat. Během importu se uchová kopie pro návrat.',"Die bisherige Kopie anstelle abweichender lokaler Daten verwenden. Während des Imports wird eine Kopie zum Wiederherstellen aufbewahrt.","Utiliser la copie d’origine à la place des données locales en conflit. Une copie de récupération est conservée pendant l’importation.")));
  const apply=button(text('Import saved game','Importovat uloženou hru',"Spielstand importieren","Importer la sauvegarde"),()=>{
   if(!incoming)return;
   // Preserve a downloadable target backup before any intentional replacement.
   if(replace.checked)download(exportBackup(storage));
   const result=importBackup(storage,incoming,{replace:replace.checked});
   if(!result.already&&!result.changes.length&&result.conflicts.length){status(text('Nothing was changed. The existing saved game was kept.','Nic se nezměnilo. Současná uložená hra zůstala zachována.',"Es wurde nichts geändert. Dein vorhandener Spielstand bleibt erhalten.","Aucune modification. La sauvegarde existante a été conservée."));return;}
   preview.hidden=true;
   updateGameLink();
   const accounts=summarizeBackup(incoming).accounts;
   status(text(`Saved and verified. ${accounts?'Continue to the game and sign in with the same Google account to open your account save.':'You can continue playing as a guest.'}${result.skipped.length?' Some existing settings or saved data were kept.':''}`,`Uloženo a ověřeno. ${accounts?'Pokračuj do hry a přihlas se stejným Google účtem, aby se otevřel jeho postup.':'Můžeš pokračovat jako host.'}${result.skipped.length?' Část stávajících nastavení nebo dat zůstala zachovaná.':''}`,`Gespeichert und überprüft. ${accounts?'Öffne das Spiel und melde dich mit demselben Google-Konto an, um deinen Kontospielstand zu laden.':'Du kannst als Gast weiterspielen.'}${result.skipped.length?' Einige vorhandene Einstellungen oder Daten wurden beibehalten.':''}`,`Sauvegarde enregistrée et vérifiée. ${accounts?'Ouvre le jeu et connecte-toi au même compte Google pour retrouver ta progression.':'Tu peux continuer à jouer en tant qu’invité.'}${result.skipped.length?' Certains paramètres ou certaines données existantes ont été conservés.':''}`));
   if(peer&&!peer.closed)peer.postMessage({channel:'beyond-signal-transfer-v1',type:'saved',nonce},origins.source);
  },preview);
  function offer(input){
   incoming=validateBackup(input);const plan=planImport(storage,incoming);
   if(plan.already){status(text('This backup has already been imported. No energy or helpers were restored again.','Tato záloha už byla importována. Energie ani pomůcky se znovu nedoplnily.',"Diese Sicherung wurde bereits importiert. Energie und Hilfsmittel wurden nicht erneut aufgefüllt.","Cette sauvegarde a déjà été importée. L’énergie et les outils n’ont pas été rechargés une nouvelle fois."));preview.hidden=true;return;}
   replace.checked=false;replaceLabel.hidden=!plan.conflicts.length;
   const details=summarizeBackup(incoming);
   summary.textContent=text(`${details.guest?'Guest progress found. ':''}${details.accounts?`Saved Google accounts: ${details.accounts}. `:''}${details.energy!==null?`Original energy: ${details.energy}/5. `:''}${plan.conflicts.length?'There is also saved data here. Existing conflicting data is kept unless you choose the original copy below.':'Your saved data is ready to import. Account progress is combined safely; used energy and helpers are not refilled.'}`,`${details.guest?'Nalezen postup hosta. ':''}${details.accounts?`Uložené Google účty: ${details.accounts}. `:''}${details.energy!==null?`Původní energie: ${details.energy}/5. `:''}${plan.conflicts.length?'Na této adrese už jsou uložená data. Odlišná stávající data se zachovají, pokud níže nezvolíš původní kopii.':'Uložená data jsou připravená k převzetí. Postup účtu se bezpečně spojí; spotřebovaná energie a pomůcky se nedoplňují.'}`,`${details.guest?'Gastspielstand gefunden. ':''}${details.accounts?`Gespeicherte Google-Konten: ${details.accounts}. `:''}${details.energy!==null?`Bisherige Energie: ${details.energy}/5. `:''}${plan.conflicts.length?'Unter dieser Adresse sind bereits Daten gespeichert. Abweichende vorhandene Daten bleiben erhalten, sofern du unten nicht die bisherige Kopie auswählst.':'Dein Spielstand kann importiert werden. Kontofortschritte werden sicher zusammengeführt. Verbrauchte Energie und Hilfsmittel werden nicht aufgefüllt.'}`,`${details.guest?'Progression d’invité trouvée. ':''}${details.accounts?`Comptes Google sauvegardés : ${details.accounts}. `:''}${details.energy!==null?`Énergie d’origine : ${details.energy}/5. `:''}${plan.conflicts.length?'Des données sont déjà enregistrées à cette adresse. Les données existantes en conflit sont conservées, sauf si tu choisis la copie d’origine ci-dessous.':'Ta sauvegarde est prête à être importée. Les progressions des comptes sont fusionnées en toute sécurité. L’énergie et les outils utilisés ne sont pas rechargés.'}`);
   preview.hidden=false;apply.focus();
  }
  const online=el('section');el('h2',text('Transfer between addresses','Přenos mezi adresami',"Zwischen den Adressen übertragen","Transfert entre les adresses"),online);
  if(target){
   if(!sourceReady){
    el('p',text('Transfer from the original website is being prepared. Your existing game is still there; please continue there for now.','Přenos z původního webu připravujeme. Tvoje dosavadní hra zůstává tam; zatím v ní prosím pokračuj na původní adrese.',"Die Übertragung von der bisherigen Website wird vorbereitet. Dein Spielstand ist weiterhin dort. Spiele bitte vorerst unter der bisherigen Adresse weiter.","Le transfert depuis le site d’origine est en préparation. Ta partie y est toujours disponible. Continue à y jouer pour le moment."),online);
    link(text('Continue on the original website','Pokračovat na původním webu',"Auf der bisherigen Website weiterspielen","Continuer sur le site d’origine"),`${origins.source}/`,online);
   }
   const openOriginal=button(text('Open original saved game','Otevřít původní uloženou hru',"Bisherigen Spielstand öffnen","Ouvrir la sauvegarde d’origine"),()=>{
    if(peer&&!peer.closed)peer.close();nonce=crypto.randomUUID();
    peer=window.open(`${origins.source}/transfer.html?${previewLanguage?'previewLanguage='+previewLanguage:'lang='+language}#nonce=${encodeURIComponent(nonce)}`,'_blank','popup,width=500,height=720');
    if(!peer){status(text('The popup was blocked. Allow it, or download a backup on the original website and import it below.','Nové okno bylo zablokováno. Povol ho nebo na původním webu stáhni zálohu a níže ji importuj.',"Das neue Fenster wurde blockiert. Erlaube es oder lade auf der bisherigen Website eine Sicherung herunter und importiere sie unten.","La fenêtre a été bloquée. Autorise son ouverture ou télécharge une sauvegarde sur le site d’origine, puis importe-la ci-dessous."),true);return;}
    status(text('In the opened window, choose “Send saved game”. Keep this page open.','V otevřeném okně zvol „Odeslat uloženou hru“. Tuto stránku nech otevřenou.',"Wähle im geöffneten Fenster „Spielstand senden“. Lass diese Seite geöffnet.","Dans la fenêtre ouverte, choisis « Envoyer la sauvegarde ». Garde cette page ouverte."));
   },online);
   openOriginal.disabled=!sourceReady;
   window.addEventListener('message',event=>{
    if(!validTransferMessage(event,{origin:origins.source,source:peer,nonce},'backup'))return;
    try{offer(event.data.backup);}catch(error){status(error.message,true);}
   });
  }else{
   if(window.opener&&sourceNonce&&sourceNonce.length>=32){
    button(text('Send saved game','Odeslat uloženou hru',"Spielstand senden","Envoyer la sauvegarde"),()=>{
     const backup=snapshot();window.opener.postMessage({channel:'beyond-signal-transfer-v1',type:'backup',nonce:sourceNonce,backup},origins.target);
     status(text('Sent for review. Return to the new website to confirm the import. The original copy is unchanged.','Odesláno ke kontrole. Vrať se na nový web a potvrď import. Původní kopie se nezměnila.',"Zur Prüfung gesendet. Kehre zur neuen Website zurück und bestätige den Import. Die bisherige Kopie bleibt unverändert.","Sauvegarde envoyée pour vérification. Reviens sur le nouveau site pour confirmer l’importation. La copie d’origine reste inchangée."));
    },online);
    window.addEventListener('message',event=>{if(validTransferMessage(event,{origin:origins.target,source:window.opener,nonce:sourceNonce},'saved'))status(text('The new website confirmed saving your data. The original copy is still here.','Nový web potvrdil uložení dat. Původní kopie zůstává zde.',"Die neue Website hat das Speichern deiner Daten bestätigt. Die bisherige Kopie bleibt hier erhalten.","Le nouveau site a confirmé l’enregistrement de tes données. La copie d’origine est toujours ici."));});
   }else{
    el('p',text('Open the new website first and start the transfer there. Alternatively, use the backup file below.','Nejdřív otevři nový web a zahaj přenos tam. Případně použij záložní soubor níže.',"Öffne zuerst die neue Website und starte die Übertragung dort. Alternativ kannst du unten eine Sicherungsdatei verwenden.","Ouvre d’abord le nouveau site et lance le transfert depuis celui-ci. Tu peux aussi utiliser un fichier de sauvegarde ci-dessous."),online);
    link(text('Open new transfer page','Otevřít přenos na novém webu',"Übertragung auf der neuen Website öffnen","Ouvrir le transfert sur le nouveau site"),`${origins.target}/transfer.html?${previewLanguage?'previewLanguage='+previewLanguage:'lang='+language}`,online);
   }
  }
  const files=el('section');el('h2',text('Backup file','Záložní soubor',"Sicherungsdatei","Fichier de sauvegarde"),files);
  button(text('Download this browser’s backup','Stáhnout zálohu z tohoto prohlížeče',"Sicherung dieses Browsers herunterladen","Télécharger la sauvegarde de ce navigateur"),()=>download(snapshot()),files);
  const label=el('label',text('Restore a backup file','Obnovit záložní soubor',"Sicherungsdatei wiederherstellen","Restaurer un fichier de sauvegarde"),files),file=document.createElement('input');file.type='file';file.accept='.json,application/json';label.append(file);
  file.addEventListener('change',async()=>{try{const selected=file.files[0];if(!selected)return;if(selected.size>4*1024*1024)throw Error('Backup is too large.');offer(JSON.parse(await selected.text()));}catch(error){status(error.message,true);}finally{file.value='';}});
  const game=new URL('./',location.href),campaign=new URLSearchParams(location.search);
  for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'])if(campaign.has(key))game.searchParams.set(key,campaign.get(key));
  const continueGame=link(text('Continue to the game','Pokračovat do hry',"Zum Spiel","Continuer vers le jeu"),game.href);
  function updateGameLink(){game.searchParams.set('lang',initialLanguage({storage,languages:[language]}));continueGame.href=game.href;}
  updateGameLink();
 }
}catch(error){status(error.message,true);}
