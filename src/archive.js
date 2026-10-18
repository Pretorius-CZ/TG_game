import {spacedResonatorCovers} from './resonators.js';
export const archiveTranslations={};
const text=(en,cs)=>(archiveTranslations[en]=cs,en);
const sections=[
 [
  "archive-entry",
  "archiveEntryCompleted",
  "The outer archive ring",
  "Vnější prstenec archivu",
  [
   [
    "approach",
    "Trace the archive approach",
    "Zaměř přílet k archivu",
    "Compare the crew’s bearing with the old approach lights.",
    "Porovnej souřadnice posádky se starými příletovými světly.",
    "The rescued navigator brought a copy of the archive bearing. Their rescue flight could not stop here. With the crew safe in the Refuge, we can investigate it.",
    "Zachráněný navigátor přinesl kopii souřadnic archivu. Záchranný let se tu nemohl zastavit. Teď je posádka v Útočišti a můžeme archiv prozkoumat."
   ],
   [
    "power",
    "Isolate the archive power",
    "Odděl napájení archivu",
    "Wake only the access controls. Leave the memory banks disconnected.",
    "Probuď pouze vstupní ovládání. Paměťové banky nech odpojené.",
    "The access system asks for a rescue route, not a visitor’s name. The expedition used the same anonymous channel. We preserve its settings before changing anything.",
    "Vstupní systém žádá záchrannou trasu, nikoli jméno návštěvníka. Výprava použila stejný anonymní kanál. Než cokoli změníme, uchováme jeho nastavení."
   ],
   [
    "dock",
    "Steady the archive service dock",
    "Ustál servisní dok archivu",
    "Charge both docking regulators before connecting the ship.",
    "Před připojením lodi nabij oba dokovací regulátory.",
    "The dock accepts our supply ship on manual guidance. Its public route list is obsolete. The navigator warns us to check every route against a fresh survey.",
    "Dok přijímá naši zásobovací loď s ručním naváděním. Veřejný seznam tras zastaral. Navigátor doporučuje porovnat každou trasu s novým měřením."
   ],
   [
    "air",
    "Restore the archive air loop",
    "Obnov vzduchový okruh archivu",
    "Clear the filter safeguards and restore the sealed gallery’s air.",
    "Uvolni kryty filtrů a obnov vzduch v uzavřené galerii.",
    "The expedition sealed this gallery to protect its records. They left a service note: make a copy before waking the index. We have brought empty storage for that purpose.",
    "Výprava uzavřela galerii, aby ochránila záznamy. Zanechala servisní poznámku: před probuzením rejstříku vytvořte kopii. Přivezli jsme pro ni prázdné úložiště."
   ],
   [
    "lock",
    "Open the archive entry lock · HARD",
    "Otevři vstupní zámek archivu · TĚŽKÉ",
    "Confirm the paired access circuits and open the path into the data halls.",
    "Ověř oba vstupní okruhy a otevři cestu do datových sálů.",
    "The seal opens onto intact shelves. This archive stores traffic history for an older rescue network. It may explain why the expedition’s beacon reached our ship.",
    "Za otevřenou uzávěrou stojí neporušené regály. Archiv uchovává historii provozu starší záchranné sítě. Možná vysvětlí, proč maják výpravy dosáhl naší lodi."
   ]
  ]
 ],
 [
  "archive-data",
  "archiveDataCompleted",
  "The data halls",
  "Datové sály",
  [
   [
    "backup",
    "Copy the untouched records",
    "Zkopíruj původní záznamy",
    "Power the backup reader without overwriting the original banks.",
    "Napájej záložní čtečku bez přepsání původních bank.",
    "We save the raw packets, including their errors. A damaged entry can still be evidence. Elysium receives a second copy before we begin decoding.",
    "Ukládáme původní pakety včetně chyb. Poškozený záznam může být stále důkazem. Než začneme dekódovat, Elysium obdrží druhou kopii."
   ],
   [
    "index",
    "Rebuild the route index",
    "Obnov rejstřík tras",
    "Match the navigation records and restore the index regulator.",
    "Spoj navigační záznamy a obnov regulátor rejstříku.",
    "The index separates messages from routes. A human voice can travel through several automatic relays. Hearing someone does not tell us which relay chose the path.",
    "Rejstřík rozlišuje zprávy od tras. Lidský hlas může projít několika automatickými retranslátory. Když někoho slyšíme, nevíme ještě, který retranslátor vybral cestu."
   ],
   [
    "checksum",
    "Repair the packet checksums",
    "Oprav kontrolní součty paketů",
    "Clear the reader safeguards and compare both preserved copies.",
    "Uvolni kryty čtečky a porovnej obě uchované kopie.",
    "Several packets were copied correctly but filed under the wrong route version. Their contents are intact. We can recover the sequence without inventing the missing entries.",
    "Několik paketů bylo správně zkopírováno, ale zařazeno pod chybnou verzí trasy. Obsah zůstal neporušený. Posloupnost obnovíme bez vymýšlení chybějících položek."
   ],
   [
    "privacy",
    "Decode the identity warning",
    "Rozlušti varování před vysíláním identity",
    "Align the two record readers and recover the expedition’s warning.",
    "Slaď obě čtečky záznamů a obnov varování výpravy.",
    "The expedition found that an old automatic identity lookup linked visitors to obsolete destination records. “Do not transmit your identity” was a workaround, not a warning about a pursuer. They kept manual guidance while the lookup remained unreliable.",
    "Výprava zjistila, že staré automatické vyhledávání identity přiřazuje návštěvníkům zastaralé cílové záznamy. Varování před vysíláním identity bylo provizorním řešením, ne výstrahou před pronásledovatelem. Dokud vyhledávání nebylo spolehlivé, používali ruční navádění."
   ],
   [
    "message",
    "Recover the expedition handover · HARD",
    "Obnov předávací zprávu výpravy · TĚŽKÉ",
    "Read the protected cartridge after both record channels agree.",
    "Přečti chráněný modul, až budou oba záznamové kanály souhlasit.",
    "Their message asks the next supply ship to follow a manually checked beacon chain. The route was meant to bring help to the Refuge. The older network kept forwarding it without understanding which legs were still safe.",
    "Jejich zpráva žádá další zásobovací loď, aby sledovala ručně ověřenou řadu majáků. Trasa měla přivést pomoc do Útočiště. Starší síť zprávu předávala dál, aniž věděla, které úseky jsou stále bezpečné."
   ]
  ]
 ],
 [
  "archive-simulation",
  "archiveSimulationCompleted",
  "The simulation chamber",
  "Simulační komora",
  [
   [
    "clocks",
    "Synchronise the recording clocks",
    "Slaď hodiny záznamů",
    "Compare archive time with independent readings from Haven and Elysium.",
    "Porovnej čas archivu s nezávislými měřeními z Havenu a Elysia.",
    "Our clocks still agree. The older timestamp is attached to a relayed copy, not to an earlier physical arrival. We keep the original recording alongside the comparison.",
    "Naše hodiny stále souhlasí. Starší časová značka patří předané kopii, nikoli dřívějšímu fyzickému příletu. Původní záznam uchováváme vedle srovnání."
   ],
   [
    "probe",
    "Restore the recorded probe track",
    "Obnov zaznamenanou dráhu sondy",
    "Clear the probe reader and rebuild its verified return path.",
    "Uvolni čtečku sondy a obnov její ověřenou zpáteční dráhu.",
    "The probe crossed the distortion and returned on our own clock. A relay near the passage was replaying cached headers. The strange message is evidence of faulty forwarding, not proof of travel into the past.",
    "Sonda prolétla deformací a vrátila se podle našich vlastních hodin. Retranslátor poblíž průchodu opakoval uložené hlavičky. Podivná zpráva dokládá chybu při předávání, nikoli cestu do minulosti."
   ],
   [
    "sequence",
    "Reconstruct the crew’s route",
    "Zrekonstruuj trasu posádky",
    "Charge both chronology regulators to place the recovered records in order.",
    "Nabij oba regulátory časové osy a seřaď obnovené záznamy.",
    "The sequence matches the rescued navigator’s account: Haven, Aster Veil, Elysium, the garden and the Refuge. Their notes explain the stops. The network’s public map still lacks several of them.",
    "Posloupnost odpovídá vyprávění zachráněného navigátora: Haven, Aster Veil, Elysium, zahrada a Útočiště. Poznámky vysvětlují zastávky. Ve veřejné mapě sítě několik z nich stále chybí."
   ],
   [
    "routes",
    "Compare the safe and obsolete routes",
    "Porovnej bezpečné a zastaralé trasy",
    "Test the old guidance against the routes we actually travelled.",
    "Ověř staré navádění proti trasám, kterými jsme skutečně proletěli.",
    "One highlighted corridor now cuts through debris. We have just repaired its replacement. The archive must keep the old route as history, but it must never offer it as current guidance.",
    "Jedna zvýrazněná trasa dnes prochází troskami. Právě jsme opravili její náhradu. Archiv má starou trasu uchovat jako historii, ale nesmí ji nabízet pro současné navádění."
   ],
   [
    "replay",
    "Verify the reconstructed journey · HARD",
    "Ověř zrekonstruovanou cestu · TĚŽKÉ",
    "Complete the simulation with both return channels preserved.",
    "Dokonči simulaci se zachováním obou zpátečních kanálů.",
    "The projection ends with the passenger module entering the Refuge. For the first time, the archive can distinguish the expedition’s old departure from its confirmed return. We send the difference to Elysium.",
    "Projekce končí příletem modulu cestujících do Útočiště. Archiv poprvé rozlišuje starý odlet výpravy od potvrzeného návratu. Rozdíl posíláme Elysiu."
   ]
  ]
 ],
 [
  "archive-core",
  "archiveCoreCompleted",
  "The central memory",
  "Centrální paměť",
  [
   [
    "reader",
    "Isolate the central memory reader",
    "Odděl čtečku centrální paměti",
    "Connect a read-only channel before waking the memory core.",
    "Před probuzením paměťového jádra připoj kanál pouze pro čtení.",
    "The oldest records describe a rescue-routing service shared by stations and garden custodians. It was built to keep travellers connected when individual outposts failed. The garden caretaker is one local participant, not the whole system.",
    "Nejstarší záznamy popisují záchranné navádění společné stanicím a správcům zahrad. Mělo udržet cestovatele ve spojení při výpadku jednotlivých stanovišť. Správce zahrady je jedním místním účastníkem, nikoli celým systémem."
   ],
   [
    "authority",
    "Recover the routing authority",
    "Obnov záznam řízení tras",
    "Restore both authority regulators without enabling unverified departures.",
    "Obnov oba regulátory řízení bez povolení neověřených odletů.",
    "The routing service can forward a call without knowing its sender is already safe. Its central station stopped receiving reliable updates. We have been hearing human messages carried by a system with incomplete information.",
    "Naváděcí služba může předávat volání, aniž ví, že je jeho odesílatel už v bezpečí. Její hlavní stanice přestala dostávat spolehlivé aktualizace. Slyšeli jsme lidské zprávy přenášené systémem s neúplnými informacemi."
   ],
   [
    "return",
    "Record the crew’s confirmed return",
    "Zaznamenej potvrzený návrat posádky",
    "Clear the receiver safeguards and preserve the Refuge’s acknowledgement.",
    "Uvolni kryty přijímače a uchovej potvrzení z Útočiště.",
    "The Refuge confirms the crew is inside, with medical support ready. We update the local archive, not every remote receiver. The wider network still needs working links before this news can reach its centre.",
    "Útočiště potvrzuje posádku uvnitř a připravenou zdravotní péči. Aktualizujeme místní archiv, nikoli všechny vzdálené přijímače. Než zpráva dosáhne centra, širší síť potřebuje funkční spojení."
   ],
   [
    "coordinates",
    "Recover the missing beacon links",
    "Obnov souřadnice chybějících majáků",
    "Charge both link regulators and compare their bearings with the simulation.",
    "Nabij oba regulátory spojení a porovnej jejich směry se simulací.",
    "Three broken beacon links separate the archive from the central rescue station. Their coordinates are recoverable, but their routes are not yet verified. Our next task is to survey and restore those links.",
    "Archiv od hlavní záchranné stanice oddělují tři přerušená spojení majáků. Jejich souřadnice lze obnovit, ale trasy ještě nejsou ověřené. Dalším úkolem bude spojení prozkoumat a obnovit."
   ],
   [
    "answer",
    "Save the answer for the network · HARD",
    "Ulož odpověď pro záchrannou síť · TĚŽKÉ",
    "Seal the crew’s return report and the verified route copy for transmission.",
    "Zajisti zprávu o návratu posádky i kopii ověřené trasy pro odeslání.",
    "We now understand the call: a human request for help travelling through an older rescue network. Its central station is still waiting for news it cannot receive. The crew is home; next we will make a safe path for the answer.",
    "Teď volání rozumíme: lidská žádost o pomoc putovala starší záchrannou sítí. Její hlavní stanice stále čeká na zprávu, kterou nemůže přijmout. Posádka je doma; příště vytvoříme bezpečnou cestu pro odpověď."
   ]
  ]
 ]
];
const results=[["Archive approach verified.", "Přílet k archivu je ověřený."], ["The access controls have isolated power.", "Vstupní ovládání má oddělené napájení."], ["Both service dock regulators hold steady.", "Oba regulátory servisního doku drží stabilně."], ["The sealed gallery has clean air.", "Uzavřená galerie má čistý vzduch."], ["The archive entry is open.", "Vstup do archivu je otevřený."], ["The original records have a safe backup.", "Původní záznamy mají bezpečnou zálohu."], ["The route index is readable again.", "Rejstřík tras je znovu čitelný."], ["Both packet copies pass their checks.", "Obě kopie paketů prošly kontrolou."], ["The identity warning has an explanation.", "Varování před vysíláním identity má vysvětlení."], ["The expedition handover has been recovered.", "Předávací zpráva výpravy je obnovená."], ["The recording clocks agree.", "Hodiny záznamů souhlasí."], ["The probe’s return track is verified.", "Zpáteční dráha sondy je ověřená."], ["The crew’s journey is in the correct order.", "Cesta posádky je seřazená ve správném pořadí."], ["Obsolete routes are separated from verified ones.", "Zastaralé trasy jsou oddělené od ověřených."], ["The reconstructed journey passes its checks.", "Zrekonstruovaná cesta prošla kontrolou."], ["The central memory is readable through an isolated channel.", "Centrální paměť lze číst odděleným kanálem."], ["The routing service’s role is now clear.", "Úloha naváděcí služby je teď jasná."], ["The local archive records the crew’s safe return.", "Místní archiv zaznamenal bezpečný návrat posádky."], ["The missing beacon coordinates have been recovered.", "Souřadnice chybějících majáků jsou obnovené."], ["The report is ready for the wider rescue network.", "Zpráva je připravená pro širší záchrannou síť."]];
const labels=['Coolant charges','Energy modules','Data chips','Alloy components','Light cells','Biocapsules'];
const csLabels=['chladicích náplní','energetických modulů','datových čipů','slitinových dílů','světelných článků','biokapslí'];
const positions=[[[20,39],[80,39],[20,58],[80,58],[50,63]],[[17,34],[83,34],[17,53],[83,53],[50,67]],[[16,38],[84,38],[16,51],[84,51],[50,66]],[[18,43],[82,43],[18,61],[82,61],[50,73]]];
const layouts=[
 {cols:7,rows:7,holes:[],covers:[],devices:[]},
 {cols:7,rows:8,holes:[0,6,49,55],covers:[9,12,37,40],devices:[]},
 {cols:7,rows:8,holes:[],covers:[8,12,43,47],devices:[{at:24,target:3}]},
 {cols:8,rows:8,holes:[0,7,56,63],covers:[],devices:[{at:26,target:3},{at:29,target:3}]},
 {cols:8,rows:8,holes:[0,7,56,63],covers:[9,14,49],devices:[{at:26,target:4},{at:29,target:4}]}
];
const objectives=[[[2,24],[1,21]],[[1,27],[3,24]],[[2,24],[4,24]],[[0,27],[2,24]],[[2,27],[1,24],[4,21]]];
export const archiveDestinations=Object.fromEntries(sections.map(([scene,key,en,cs,rows],section)=>{
 const title=text(en,cs);
 const repairs=rows.map(([slug,enName,csName,enThought,csThought,enLog,csLog],i)=>{
  const {cols,rows:height,holes,covers,devices}=layouts[[[0,1,3,1,4],[0,2,1,3,4],[0,1,3,2,4],[0,3,1,3,4]][section][i]];
  const resonators=devices.map(r=>({...r}));
  const level={cols,rows:height,types:6,mask:Array.from({length:cols*height},(_,n)=>!holes.includes(n)&&!resonators.some(r=>r.at===n))};
  const ice=spacedResonatorCovers(covers,resonators,level),[x,y]=positions[section][i];
  const specs=objectives[i].map(([type,target])=>[(type+section)%6,target]);
  const goals=specs.map(([type,target])=>({type,target,label:labels[type]}));
  return {id:scene+'-'+slug,name:text(enName,csName),lesson:text(enName,csName),thought:text(enThought,csThought),result:text(...results[section*5+i]),room:title,action:text('Continue the archive investigation','Pokračuj v průzkumu archivu'),icon:'⌘',x,y,moves:section===2&&i===4?31:[25,28,30,29,29][i],tileSet:'elysium',level,ice,resonators,goals,target:goals.reduce((n,g)=>n+g.target,0),targetType:null,
   objective:text('Collect '+specs.map(([type,n])=>n+' '+labels[type].toLowerCase()).join(', ')+'.'+(ice.length?' Break all protective covers.':'')+(resonators.length?' Charge every resonator.':''),'Nasbírej '+specs.map(([type,n])=>n+' '+csLabels[type]).join(', ')+'.'+(ice.length?' Rozbij všechny ochranné kryty.':'')+(resonators.length?' Nabij všechny rezonátory.':''))};
 });
 return [scene,{title,key,system:section?sections[section-1][0]:'refuge-arrival',chapter:text('CHAPTER 09 / ARCHIVE OF ECHOES','KAPITOLA 09 / ARCHIV OZVĚN'),hotspotOffset:0,image:scene,art:'archive',repairs,clips:[],
  logs:rows.map((r,i)=>({id:repairs[i].id+'-log',repair:repairs[i].id,title:repairs[i].name,source:text('Archive investigation log','Deník průzkumu archivu'),time:title,unlockAt:168+section*5+i,text:text(r[5],r[6])})),
  complete:section===3?text('The crew’s return is recorded. Three beacon links remain to be restored.','Návrat posádky je zaznamenaný. Zbývá obnovit tři spojení majáků.'):text('Records verified. The next archive section is accessible.','Záznamy jsou ověřené. Další oblast archivu je přístupná.'),
  ...(section<3?{nextScene:sections[section+1][0],nextLabel:text('Continue to '+sections[section+1][2].toLowerCase()+' →','Pokračovat: '+sections[section+1][3]+' →')}:{nextScene:'signal-solar',nextLabel:text('Continue to the solar beacon →','Pokračovat ke slunečnímu majáku →')})}];
}));
export const archiveScenes=Object.keys(archiveDestinations);
export function canVisitArchive(p,scene){
 const index=archiveScenes.indexOf(scene);return index>=0&&p.refugeArrivalCompleted===6&&archiveScenes.slice(0,index).every(s=>p[archiveDestinations[s].key]===5);
}
