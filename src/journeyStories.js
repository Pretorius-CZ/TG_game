export const journeyStoryTranslations={};
const text=(en,cs)=>(journeyStoryTranslations[en]=cs,en);
const panel=(image,enTitle,csTitle,en,cs)=>({image,title:text(enTitle,csTitle),caption:text(en,cs)});
export const journeyStories=[
 {id:'return-route',chapter:'refuge',scene:'return-corridor',ready:p=>p.refugeMedicalCompleted===5,title:text('A home ready. A route blocked.','Domov je připravený. Trasa zablokovaná.'),finishLabel:text('Survey the return corridor','Prozkoumat návratový koridor'),panels:[
 panel('refuge-medical-restored','Ready for their return','Připraveno na návrat','Rooms, supplies and medical support are ready. The rescue pilot confirms the crew is aboard.','Pokoje, zásoby i zdravotní péče jsou připravené. Pilot záchranné lodi potvrzuje posádku na palubě.'),
 panel('return-corridor','One obstacle remains','Zbývá jedna překážka','The attached passenger module cannot pass the drifting wreckage. The pilot sends coordinates for an old traffic station.','Připojený modul s cestujícími neproletí mezi unášenými troskami. Pilot posílá souřadnice staré stanice řízení provozu.'),
 panel('return-corridor','Make a safe way home','Vytvořit bezpečnou cestu domů','We must survey the debris, restore the barrier controls and mark a route wide enough for both parts of the craft.','Musíme zaměřit trosky, obnovit ovládání zábrany a vyznačit trasu dost širokou pro obě části lodi.') ]},
 {id:'rescue-approach',chapter:'refuge',scene:'refuge-arrival',ready:p=>p.returnCorridorCompleted===6,title:text('The craft is through','Loď proletěla'),finishLabel:text('Prepare the boarding bridge','Připrav nástupní most'),panels:[
 panel('return-corridor-restored','Past the last beacon','Za posledním majákem','The rescue craft clears the corridor. Its passenger module follows safely behind.','Záchranná loď prolétla koridorem. Modul s cestujícími bezpečně následuje.'),
 panel('refuge-arrival','The Refuge takes over','Útočiště přebírá navádění','The final approach is ours. We hold the ship opposite the boarding bridge and keep the hatch sealed.','Závěrečné přiblížení řídíme my. Loď držíme naproti nástupnímu mostu a průlez necháváme uzavřený.'),
 panel('refuge-arrival','One careful connection','Poslední opatrné připojení','Secure both clamps, connect power and check the air pressure. Then the crew can enter the home we prepared.','Zajistíme obě svorky, připojíme napájení a ověříme tlak vzduchu. Potom posádka vstoupí do připraveného domova.') ]},
 {id:'refuge-welcome',chapter:'refuge',scene:'archive-entry',ready:p=>p.refugeArrivalCompleted===6,title:text('Home, with one more question','Doma, s další otázkou'),finishLabel:text('Investigate the archive','Prozkoumat archiv'),panels:[
 panel('refuge-arrival-restored','The door opens','Dveře se otevírají','The rescued crew steps into the Refuge. The rooms and medical team are waiting.','Zachráněná posádka vstupuje do Útočiště. Pokoje i zdravotní tým čekají.'),
 panel('journey-crew-welcome','Someone answered','Někdo odpověděl','For a moment, there is no signal to decode and no machine to repair. The people we followed are finally safe.','Na chvíli není potřeba luštit signál ani opravovat stroje. Lidé, za kterými jsme šli, jsou konečně v bezpečí.'),
 panel('journey-navigator','The navigator’s record','Navigátorův záznam','Their navigator hands us an archive bearing. It may explain the identity warning and the strange timestamps. With the crew home, we can look for the answer.','Navigátor předává souřadnice archivu. Možná vysvětlí varování před vysíláním identity i podivné časové značky. Posádka je doma a my můžeme hledat odpověď.') ]},
 {id:'archive-answer',chapter:'archive',scene:'archive-core',ready:p=>p.archiveCoreCompleted===5,title:text('An answer for the network','Odpověď pro záchrannou síť'),finishLabel:text('View the completed chapter','Prohlédnout dokončenou kapitolu'),panels:[
 panel('archive-simulation','The records agree','Záznamy souhlasí','The crew’s account and our recordings match. Obsolete routes and cached message headers explain the misleading guidance.','Vyprávění posádky souhlasí s našimi záznamy. Zastaralé trasy a uložené hlavičky zpráv vysvětlují zavádějící navádění.'),
 panel('archive-core','A call still travelling','Volání stále putuje','A human request for help travelled through an older rescue network. Its central station cannot receive reliable news of the crew’s return.','Lidská žádost o pomoc putovala starší záchrannou sítí. Její hlavní stanice nemůže spolehlivě přijmout zprávu o návratu posádky.'),
 panel('journey-navigator','The next journey','Další cesta','Three broken beacon links stand between us and that station. The archive has recovered their coordinates. The crew is home; now we can take their answer along a verified route.','Od stanice nás oddělují tři přerušená spojení majáků. Archiv obnovil jejich souřadnice. Posádka je doma; teď můžeme její odpověď doručit po ověřené trase.') ]}
];
journeyStories.push(
 {id:'signal-departure',chapter:'signal',scene:'signal-solar',ready:p=>p.archiveCoreCompleted===5,title:text('A safe path for the answer','Bezpečná cesta pro odpověď'),finishLabel:text('Restore the first beacon','Obnovit první maják'),panels:[
 panel('archive-core','The message is ready','Zpráva je připravená','The rescued crew is home. Their navigator has confirmed the original distress call, and the archive has preserved its route.','Zachráněná posádka je doma. Její navigátor potvrdil původní nouzové volání a archiv uchoval jeho cestu.'),
 panel('signal-orbit','Three broken links','Tři přerušená spojení','The central rescue station still has no verified return notice. Three silent links stand between its register and the people waiting in the Refuge.','Hlavní záchranná stanice dosud nemá ověřenou zprávu o návratu. Od lidí čekajících v Útočišti ji oddělují tři ztichlá spojení.'),
 panel('signal-solar','Start with a fresh survey','Začít čerstvým měřením','We carry the crew’s report to the first beacon. This time we will verify each link ourselves, and leave a way for the station to answer.','Vezeme zprávu posádky k prvnímu majáku. Tentokrát každé spojení sami ověříme a ponecháme cestu i pro odpověď stanice.') ]},
 {id:'signal-arrival',chapter:'signal',scene:'signal-station',ready:p=>p.signalGardenCompleted===3,title:text('The receiving hall','Přijímací sál'),finishLabel:text('Prepare the final connection','Připravit závěrečné spojení'),panels:[
 panel('signal-garden','The third link holds','Třetí spojení drží','The caretaker holds the garden channel open. Test messages cross all three repaired links in both directions.','Správce udržuje zahradní kanál otevřený. Zkušební zprávy procházejí všemi třemi opravenými spojeními tam i zpět.'),
 panel('signal-station','An expedition still listed as missing','Výprava stále vedená jako pohřešovaná','The central station’s duty operator welcomes us. The old distress call is still open in the rescue register. We have brought the evidence needed to close it.','Službu konající operátor hlavní stanice nás vítá. Staré nouzové volání zůstává v záchranném rejstříku otevřené. Přivezli jsme podklady potřebné k jeho uzavření.'),
 panel('journey-crew-welcome','People, not just a packet','Lidé, ne jen paket','The Refuge is ready to speak for itself. Restore the receiver, compare the records and let the crew deliver the last words.','Útočiště je připravené promluvit samo za sebe. Obnovíme přijímač, porovnáme záznamy a poslední slova necháme na posádce.') ]},
 {id:'signal-delivered-200',chapter:'signal',scene:'signal-station',terminal:true,ready:p=>p.signalStationCompleted===4,title:text('Beyond the signal','Za signálem'),finishLabel:text('Celebrate level 200','Oslavit level 200'),panels:[
 panel('signal-station','Acknowledgement received','Přijetí potvrzeno','The station receives the verified return report. The rescue register changes from missing to safely returned. The original call remains in the archive, but it no longer repeats as an unanswered emergency.','Stanice přijímá ověřenou zprávu o návratu. Záchranný rejstřík mění pohřešovanou výpravu na bezpečně navrácenou. Původní volání zůstává v archivu, ale už se neopakuje jako nevyslyšená nouze.'),
 panel('journey-crew-welcome','“We are home.”','„Jsme doma.“','The navigator speaks from the Refuge. The operator answers in real time. After all the broken routes and old recordings, there is nothing left to decipher in those three words.','Navigátor promlouvá z Útočiště. Operátor odpovídá v reálném čase. Po všech přerušených trasách a starých záznamech už v těch dvou slovech není co luštit.'),
 panel('signal-solar','A network that can answer','Síť, která dokáže odpovědět','Haven, Elysium, the garden and the Refuge confirm the restored path. The network is not magically repaired everywhere. But this rescue is complete, and its safe route is recorded for whoever needs it next.','Haven, Elysium, zahrada a Útočiště potvrzují obnovenou cestu. Celá síť se zázrakem neopravila všude. Tahle záchrana je ale dokončená a její bezpečná trasa zůstává zaznamenaná pro další, kdo ji bude potřebovat.'),
 panel('departure-flight','200 steps toward an answer','200 kroků k odpovědi','We were a supply pilot who took a detour for an impossible signal. We found people beyond it. For now, the ship can rest, and so can we. Thank you for bringing them home.','Začalo to zásobovacím letem a odbočkou za nečekaným signálem. Za ním jsme našli lidi. Loď si teď může odpočinout a my také. Děkujeme, že jsi je pomohl přivést domů.') ]}
);
text('The answer','Odpověď');
export function availableJourneyStories(p,chapter){return journeyStories.filter(s=>(!chapter||s.chapter===chapter)&&s.ready(p));}

export function chapterStoryOptions(p,chapter){
 const old=[
  ['departure','ship',p.launchDone,'Replay the departure story'],
  ['jump','kepler',p.jumpDone,'Replay the Aster Veil arrival'],
  ['arrival','aster',p.elysiumArrival===1,'Replay arrival'],
  ['echo','elysium',p.elysiumObservatoryCompleted===4,'Replay the Elysium departure'],
  ['rift','rift',p.riftCrossed===1,'Replay the Rift story'],
  ['research','ring',p.gardenCompleted===6,'Replay the research arrival'],
  ['relay','night',p.relayCompleted===4,'Replay the descent story'],
  ['caretaker','night',p.caretakerMet===1,'Replay the encounter']
 ];
 return [...old.filter(([id,c,ready])=>c===chapter&&ready).map(([id,c,ready,title])=>({id,title})),...availableJourneyStories(p,chapter).map(s=>({id:s.id,title:s.title}))];
}
text('Replay arrival','Přehrát přílet');

text('Archive of echoes','Archiv ozvěn');text('The Refuge','Útočiště');text('Revisit the Rift →','Znovu navštívit Trhlinu →');
