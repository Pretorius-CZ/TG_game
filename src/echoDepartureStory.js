import {elysiumComplete} from './elysium.js';
export const echoDepartureTranslations={};
const text=(en,cs)=>(echoDepartureTranslations[en]=cs,en);
export const echoDeparturePanels=[
 {image:'echo-departure-signal',title:text('The message returns','Zpráva se vrací'),caption:text('With Elysium awake, its receivers hear our welcome message twice. The second copy carries an older timestamp. We preserve the recording. First, we must rule out a fault.','Probuzené přijímače Elysia zachytí naši uvítací zprávu dvakrát. Druhá kopie má starší časovou značku. Záznam uchováme. Nejprve musíme vyloučit závadu.')},
 {image:'echo-departure-dock',title:text('A station worth returning to','Stanice, kam se chceme vrátit'),caption:text('Haven will oversee the returning crew. We prepare a survey probe and keep Elysium listening. This time we leave a working home behind us.','Haven dohlédne na vracející se posádku. Připravíme průzkumnou sondu a Elysium necháme naslouchat. Tentokrát za sebou zanecháváme fungující domov.')},
 {image:'echo-departure-flight',title:text('One question beyond the chart','Otázka za hranicí mapy'),caption:text('Something has changed the signal on its way to us. Before we fly beyond the surveyed system, we will check the clocks and establish a reliable bearing. The way home stays open.','Něco změnilo signál na cestě k nám. Než vyletíme za hranici prozkoumané soustavy, ověříme hodiny a určíme spolehlivý směr. Cesta domů zůstává otevřená.')}
];
export const echoDepartureReady=p=>elysiumComplete(p);
export const shouldShowEchoDeparture=p=>echoDepartureReady(p)&&['rift','rift-echo'].includes(p.scene)&&(p.riftEchoCompleted??0)===0;
text('Elysium departure story','Příběh odletu z Elysia');
text('Investigate the echo','Prozkoumat ozvěnu');
text('Replay the Elysium departure','Přehrát odlet z Elysia');
