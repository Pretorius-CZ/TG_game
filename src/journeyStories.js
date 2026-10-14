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
 panel('journey-navigator','The next journey','Další cesta','Three broken beacon links stand between us and that station. Their restoration will continue the story in a future update. For now, the crew is home and the report is safe.','Od stanice nás oddělují tři přerušená spojení majáků. Jejich obnova bude pokračováním příběhu v další aktualizaci. Posádka je zatím doma a zpráva je bezpečně uložená.') ]}
];
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
