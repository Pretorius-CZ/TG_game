// The first terrace beyond the Rift; English story and Czech catalog together.
export const gardenTranslations={};
const text=(en,cs)=>(gardenTranslations[en]=cs,en);
const title=text('The waking garden','Probouzející se zahrada');
const source=text('Ring expedition log','Deník výpravy na prstenec');
const labels=['Coolant charges','Energy modules','Data chips','Alloy components','Light cells','Biocapsules'];
const tasks=[
 ['terrace',text('Secure the landing terrace','Zajisti přistávací terasu'),
 text('The terrace can support our ship, but its guidance lights are asleep. Connect the landing markers before entering the garden.','Terasa naši loď unese, ale její naváděcí světla spí. Než vstoupíme do zahrady, propojíme přistávací značky.'),
 text('A ring of lights marks a safe landing zone.','Světelný kruh označuje bezpečné místo přistání.'),
 text('A welcome without words','Přivítání beze slov'),
 text('The terrace answered our landing pulse. No weapons, no password. Perhaps arrival itself is an invitation. We are keeping the ship ready to leave.','Terasa odpověděla na náš přistávací impulz. Žádné zbraně, žádné heslo. Možná je samotný přílet pozváním. Loď však necháváme připravenou k odletu.'),[[3,24],[4,24]],23,53,77],
 ['beacon',text('Anchor the return signal','Ukotvi zpáteční signál'),
 text('The expedition beacon holds the Rift route. Link this terrace to it before we explore further.','Maják výpravy drží cestu Trhlinou. Než půjdeme dál, připojíme k němu terasu.'),
 text('The terrace beacon answers Elysium. The way home is secure.','Maják terasy odpovídá Elysiu. Cesta domů je zajištěná.'),
 text('Two ends of the thread','Dva konce vlákna'),
 text('Elysium confirms our position. The delay changes slightly with each pulse, but the link remains stable. We leave an independent recorder beside the beacon.','Elysium potvrzuje naši polohu. Zpoždění se s každým impulzem trochu mění, ale spojení zůstává stabilní. Vedle majáku necháváme nezávislý záznamník.'),[[1,27],[2,24]],24,17,65],
 ['bridge',text('Wake the light bridge','Probuď světelný most'),
 text('The bridge is intact. Release its protective locks and send a matching pulse through the dormant guide rails.','Most je celý. Uvolníme jeho ochranné pojistky a pošleme sladěný impulz do spících vodicích pásů.'),
 text('Light runs across the bridge, connecting the two terraces.','Světlo přebíhá po mostě a propojuje obě terasy.'),
 text('Someone walked here','Někdo tudy šel'),
 text('A human survey marker hangs beneath the first arch. The missing expedition crossed before us. Their note reads: follow the water, leave the roots undisturbed.','Pod prvním obloukem visí lidská průzkumná značka. Ztracená výprava tudy prošla před námi. Jejich poznámka říká: sledujte vodu, kořeny nechte na pokoji.'),[[4,30],[1,24]],27,49,48],
 ['water',text('Restore the water channels','Obnov vodní kanály'),
 text('Water still falls through the valley, but the upper beds are dry. Open the distribution gates without disturbing the river below.','Údolím stále padají vodopády, ale horní záhony jsou suché. Otevřeme rozdělovací stavidla, aniž bychom narušili řeku pod nimi.'),
 text('Turquoise channels carry water back to the upper gardens.','Tyrkysové kanály znovu přivádějí vodu do horních zahrad.'),
 text('A patient machine','Trpělivý stroj'),
 text('The channels feed the roots before the towers. This place keeps its gardens alive without visitors. The expedition adjusted one valve and carefully recorded the original setting.','Kanály napájejí kořeny dříve než věže. Toto místo udržuje zahrady při životě i bez návštěvníků. Výprava upravila jedno stavidlo a pečlivě zaznamenala původní nastavení.'),[[0,30],[5,24]],28,64,36],
 ['archive',text('Read the seed archive','Přečti semenný archiv'),
 text('The tower stores patterns alongside living seeds. Decode its catalogue gently; we are here to learn, not to empty its shelves.','Věž uchovává vzory spolu s živými semeny. Opatrně rozluštíme její katalog. Jsme tu, abychom se učili, ne abychom vyprázdnili police.'),
 text('The archive opens a living catalogue and an expedition message.','Archiv otevírá živý katalog a zprávu výpravy.'),
 text('The gardeners moved on','Zahradníci šli dál'),
 text('A recorded human voice confirms that the expedition left voluntarily. They followed a caretaker signal toward the inner ring. Their warning: wake one system at a time.','Nahraný lidský hlas potvrzuje, že výprava odešla dobrovolně. Sledovala signál správce směrem k vnitřnímu prstenci. Jejich varování: probouzejte vždy jen jeden systém.'),[[2,30],[5,27]],29,81,37],
 ['heart',text('Awaken the garden heart · HARD','Probuď srdce zahrady · TĚŽKÉ'),
 text('The five systems are ready. Send one synchronized pulse to wake this garden sector while keeping our return link open.','Pět systémů je připravených. Jedním sladěným impulzem probudíme tento sektor zahrady a zachováme zpáteční spojení.'),
 text('The garden blooms with light. A caretaker signal answers from the inner ring.','Zahrada rozkvétá světlem. Z vnitřního prstence odpovídá signál správce.'),
 text('An answer from within','Odpověď zevnitř'),
 text('Light moves through the roots and climbs the towers. The returning pulse contains a map, not an order. Elysium receives a copy. One terrace is awake; the expedition trail leads deeper into this world.','Světlo se pohybuje kořeny a stoupá po věžích. Vracející se impulz obsahuje mapu, nikoli rozkaz. Kopii dostává Elysium. Jedna terasa je probuzená a stopa výpravy vede hlouběji do tohoto světa.'),[[1,27],[4,27],[5,24]],32,40,32]
];
const repairs=tasks.map(([slug,name,thought,result,logTitle,logText,goals,moves,x,y],i)=>({
 id:'garden-'+slug,name,lesson:name,thought,result,room:title,action:text('Activate the system','Aktivuj systém'),icon:'✦',x,y,moves,tileSet:'elysium',
 level:{cols:7,rows:i>=3?8:7,types:6,...(i===1?{mask:Array.from({length:49},(_,n)=>![0,6,42,48].includes(n))}:i===4?{mask:Array.from({length:56},(_,n)=>![0,6,7,13,42,48,49,55].includes(n))}:{})},
 ice:i<2?[]:i===5?[9,12,22,26,37,40,44,46]:i===4?[16,18,23,25,37,39]:[15,19,29,33],
 goals:goals.map(([type,target])=>({type,target,label:labels[type]})),target:goals.reduce((n,g)=>n+g[1],0),targetType:null,
 objective:'Collect '+goals.map(([type,target])=>target+' '+labels[type].toLowerCase()).join(', ')+'.'+(i>=2?' Break all protective covers.':'')
}));
const logs=tasks.map((r,i)=>({id:repairs[i].id+'-log',repair:repairs[i].id,title:r[4],text:r[5],source,time:title,unlockAt:110+i}));
export const gardenDestination={title,key:'gardenCompleted',system:'rift',chapter:text('CHAPTER 06 / THE LIVING RING','KAPITOLA 06 / ŽIVÝ PRSTENEC'),
 image:'rift-beyond',restoredImage:'rift-beyond',dimInitial:true,repairs,logs,
 complete:text('The terrace is awake. The inner ring has answered.','Terasa je probuzená. Vnitřní prstenec odpověděl.'),
 clips:repairs.map(()=> 'inset(0)'),restorationMasks:repairs.map(r=>'radial-gradient(ellipse 42% 30% at '+r.x+'% '+r.y+'%, #000 35%, transparent 100%)')};

text('Explore the living ring →','Prozkoumat živý prstenec →');
text('Awaken one system at a time','Probouzej systémy jeden po druhém');
