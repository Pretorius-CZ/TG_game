import {elysiumComplete} from './elysium.js';

// Text pairs keep this chapter's story and Czech translation together.
export const riftTranslations={};
const text=(en,cs)=>(riftTranslations[en]=cs,en);
const chapter=text('CHAPTER 05 / THE RIFT','KAPITOLA 05 / TRHLINA');
const labels=['Coolant charges','Energy modules','Data chips','Alloy components','Light cells','Biocapsules'];
const action=text('Follow the echo','Sleduj ozvěnu');
const source=text('Rift expedition log','Deník výpravy k Trhlině');
const definitions=[
 {id:'rift-echo',key:'riftEchoCompleted',title:text('The impossible echo','Nemožná ozvěna'),image:'rift-echo',
  complete:text('The echo points beyond the last survey buoy.','Ozvěna ukazuje za poslední průzkumnou bóji.'),
  tasks:[
   ['listen',text('Isolate the echo','Odděl ozvěnu'),text('Elysium received our welcome message twice. The second copy carries an older timestamp. Let us check the receiver before we invent a miracle.','Elysium přijalo naši uvítací zprávu dvakrát. Druhá kopie má starší časovou značku. Než začneme věřit na zázraky, prověříme přijímač.'),text('The receiver is sound. A faint second signal remains.','Přijímač je v pořádku. Slabý druhý signál zůstává.'),text('A second voice','Druhý hlas'),text('The duplicate is real, but its timestamp proves nothing yet. Haven asks us to preserve the raw recording.','Druhá zpráva skutečně existuje, ale její časová značka zatím nic nedokazuje. Haven nás žádá, abychom uchovali původní záznam.'),[[2,24],[4,18]],25,25,50],
   ['clock',text('Synchronize the clocks','Srovnej hodiny'),text('Compare station time with Haven. We need a reliable reference before following the signal.','Porovnáme čas stanice s Havenem. Než vyrazíme za signálem, potřebujeme spolehlivou referenci.'),text('Both clocks agree. The old timestamp belongs to the incoming signal.','Oboje hodiny souhlasí. Starší časová značka patří příchozímu signálu.'),text('An unresolved delay','Nevysvětlené zpoždění'),text('Our clocks agree with Haven. Something along the transmission path has altered the echo. We mark it as unexplained, not as proof of time travel.','Naše hodiny souhlasí s Havenem. Něco na cestě signálu ozvěnu změnilo. Zapisujeme nevysvětlený jev, nikoli důkaz cestování časem.'),[[1,24],[2,24]],27,50,61],
   ['bearing',text('Triangulate the source','Zaměř zdroj'),text('Three receivers can separate the true bearing from the reflections. Clear their protective interlocks.','Tři přijímače oddělí skutečný směr od odrazů. Uvolníme jejich ochranné pojistky.'),text('A bearing emerges at the edge of the surveyed system.','Na okraji prozkoumané soustavy se objevuje přesný směr.'),text('Beyond the chart','Za hranicí mapy'),text('The bearing intersects an abandoned research platform. Its identifier matches the expedition records recovered at Haven.','Směr protíná opuštěnou výzkumnou plošinu. Její označení odpovídá záznamům výpravy nalezeným v Havenu.'),[[2,27],[4,21]],29,75,50],
   ['route',text('Prepare the survey flight','Připrav průzkumný let'),text('Leave Elysium online for the returning crew. Take a survey probe and keep a channel open to home.','Elysium necháme v provozu pro vracející se posádku. Vezmeme průzkumnou sondu a zachováme spojení s domovem.'),text('The survey route is ready. Elysium will guide us back.','Průzkumná trasa je připravená. Elysium nás dovede zpět.'),text('A home behind us','Domov za námi'),text('We are leaving a living station, not abandoning another wreck. Haven will oversee the arrival of the first crew while we investigate the echo.','Opouštíme živou stanici, ne další vrak. Haven dohlédne na přílet první posádky, zatímco my prověříme ozvěnu.'),[[0,24],[1,24],[2,18]],31,50,70]
  ]},
 {id:'rift-platform',key:'riftPlatformCompleted',title:text('The last outpost','Poslední stanoviště'),image:'rift-platform',
  complete:text('The expedition crossed here. Its stabilizers are still responding.','Výprava prošla tudy. Její stabilizátory stále odpovídají.'),
  tasks:[
   ['receiver',text('Wake the relay dish','Probuď spojovací anténu'),text('The platform is intact, but silent. Restore the dish to keep Elysium within reach.','Plošina je celá, ale mlčí. Obnovíme anténu, abychom neztratili spojení s Elysiem.'),text('A clear home channel cuts through the interference.','Rušením proniká čistý signál z domova.'),text('No one left behind',"Nikdo nezůstal pozadu"),text('No distress beacon, no signs of a struggle. The expedition powered this platform down deliberately before moving on.','Žádný nouzový maják ani známky boje. Výprava tuto plošinu před pokračováním cesty záměrně vypnula.'),[[1,24],[3,21]],27,24,46],
   ['recorder',text('Recover the flight recorder','Obnov letový záznamník'),text('The recorder may explain what the expedition found beyond the platform. Rebuild its data channel.','Záznamník může prozradit, co výprava našla za plošinou. Obnovíme jeho datový kanál.'),text('The last recording shows a chain of stabilizer beacons.','Poslední záznam ukazuje řetězec stabilizačních majáků.'),text('They chose to go','Rozhodli se pokračovat'),text('The expedition described a traversable aperture near the dark gravity well. They called it the Rift. Their final order was to establish a return link.',"Výprava popsala průchod poblíž temného gravitačního pole. Nazvala jej Trhlina. Jejím posledním pokynem bylo zřídit zpáteční spojení."),[[2,30],[4,18]],29,76,47],
   ['probe',text('Launch the survey probe','Vyšli průzkumnou sondu'),text('Send the probe ahead. We need a measured safe corridor, not a heroic guess.','Pošleme sondu napřed. Potřebujeme změřený bezpečný koridor, ne hrdinský odhad.'),text('The probe maps a stable approach outside the dangerous gravity well.','Sonda vyznačuje stabilní přístup mimo nebezpečné gravitační pole.'),text('A passage, not a plunge','Průchod, ne pád'),text('The dark object is not our destination. The probe found a separate passage beside it, held open by artificial beacons. Someone built this route.','Temný objekt není náš cíl. Sonda vedle něj našla samostatný průchod držený umělými majáky. Tuto cestu někdo vybudoval.'),[[0,27],[3,24]],31,26,66],
   ['shield',text('Tune the transit shield','Vylaď průletový štít'),text('Use the probe readings to configure the ship shield for the approach. Keep the retreat route clear.','Podle měření sondy nastavíme štít lodi pro přiblížení. Ústupová cesta musí zůstat volná.'),text('The shield is calibrated. The beacon field can be approached safely.','Štít je nastavený. Můžeme se bezpečně přiblížit k poli majáků.'),text('Permission to turn back','Můžeme se vrátit'),text('Elysium has our route and probe telemetry. If the corridor becomes unstable, we return. The expedition left enough guidance for us to make that choice.','Elysium má naši trasu i telemetrii sondy. Pokud se koridor rozkolísá, vrátíme se. Výprava zanechala dost údajů, abychom měli na výběr.'),[[0,24],[1,27],[3,18]],33,75,67]
  ]},
 {id:'rift-beacons',key:'riftBeaconsCompleted',title:text('The stabilizer field','Pole stabilizátorů'),image:'rift-beacons',
  complete:text('The passage is stable. The far-side beacon is answering.','Průchod je stabilní. Maják na druhé straně odpovídá.'),
  tasks:[
   ['anchor',text('Restore the near anchor','Obnov blízkou kotvu'),text('The nearest beacon drifts out of alignment. Restore its control link before energizing the field.','Nejbližší maják se vychýlil. Před zapnutím pole obnovíme jeho ovládání.'),text('The first anchor holds its position.','První kotva drží polohu.'),text('An engineered horizon','Vybudovaný horizont'),text('The beacons are expedition equipment attached to something much older. Their engineers did not create the passage; they learned how to steady it.','Majáky jsou vybavením výpravy připojeným k něčemu mnohem staršímu. Její technici průchod nevytvořili; naučili se ho stabilizovat.'),[[3,27],[1,24]],29,24,48],
   ['phase',text('Align the distant beacons','Slaď vzdálené majáky'),text('Bring the distant anchors into phase. The probe will measure the corridor between them.','Sladíme vzdálené kotvy. Sonda změří koridor mezi nimi.'),text('The scattered arcs join into a continuous passage.','Roztříštěné oblouky se spojují v souvislý průchod.'),text('A thread through the dark','Vlákno temnotou'),text('There is a route through the distortion. The probe crossed its first boundary and returned intact, carrying a star field absent from our charts.','Deformací vede cesta. Sonda překročila první hranici a vrátila se nepoškozená, se snímkem hvězdného pole, které na našich mapách chybí.'),[[2,27],[4,27]],31,77,46],
   ['return',text('Secure the return beacon','Zajisti zpáteční maják'),text('A faint expedition beacon answers from the far side. Synchronize it with Elysium before we cross.','Z druhé strany odpovídá slabý maják výpravy. Než proletíme, spojíme jej s Elysiem.'),text('The return handshake is confirmed on both sides.','Zpáteční spojení je potvrzené na obou stranách.'),text('The way home','Cesta domů'),text('The far-side beacon still remembers Haven. It now recognizes Elysium as well. We are following the expedition, but we will not vanish without a trace.','Maják na druhé straně si stále pamatuje Haven. Teď rozpoznává i Elysium. Sledujeme výpravu, ale nezmizíme beze stopy.'),[[2,30],[0,24]],33,50,62],
   ['stabilize',text('Stabilize the Rift · HARD','Stabilizuj Trhlinu · TĚŽKÉ'),text('Synchronize every anchor for a single stable crossing window. All systems must hold together.','Sladíme všechny kotvy pro jediné stabilní průletové okno. Všechny systémy musí spolupracovat.'),text('The Rift is open. A different sky waits beyond it.','Trhlina je otevřená. Za ní čeká jiná obloha.'),text('A door left open','Otevřené dveře'),text('The field is steady and the return beacon is locked. Elysium wishes us a safe crossing. Beyond the aperture, something enormous catches the light.','Pole drží a zpáteční maják je zaměřený. Elysium nám přeje bezpečný průlet. Za otvorem zachycuje světlo něco obrovského.'),[[1,30],[2,27],[4,24]],35,50,40]
  ]}
];
export const riftDestinations=Object.fromEntries(definitions.map((s,index)=>{
 const repairs=s.tasks.map(([slug,name,thought,result,logTitle,logText,goals,moves,x,y],i)=>({
  id:`${s.id}-${slug}`,name,lesson:name,thought,result,action,room:s.title,icon:'✦',x,y,moves,tileSet:'elysium',
  level:{rows:i===3?8:7,cols:7,types:6,...(i===1?{mask:Array.from({length:49},(_,n)=>![0,6,42,48].includes(n))}:{})},
  ice:i<2?[]:i===2?[15,19,29,33]:[9,12,22,26,37,40],
  goals:goals.map(([type,target])=>({type,target,label:labels[type]})),target:goals.reduce((n,g)=>n+g[1],0),targetType:null,
  objective:`Collect ${goals.map(([type,target])=>`${target} ${labels[type].toLowerCase()}`).join(', ')}.${i>1?' Break all protective covers.':''}`
 }));
 const positions=[[[20,47],[50,40],[80,49],[50,66]],[[20,30],[80,40],[22,58],[80,60]],[[20,28],[80,32],[50,60],[50,38]]][index];
 repairs.forEach((r,i)=>{[r.x,r.y]=positions[i];});
 const logs=s.tasks.map((r,i)=>({id:`${repairs[i].id}-log`,repair:repairs[i].id,title:r[4],text:r[5],source,time:s.title,unlockAt:97+index*4+i}));
 return [s.id,{title:s.title,key:s.key,image:s.image,complete:s.complete,system:'rift',chapter,repairs,logs,dimInitial:index!==2,
  clips:repairs.map(()=> 'inset(0)'),restorationMasks:index===2?['radial-gradient(ellipse 25% 24% at 10% 30%, #000 45%, transparent 100%)','radial-gradient(ellipse 25% 24% at 90% 38%, #000 45%, transparent 100%)','radial-gradient(ellipse 30% 26% at 50% 70%, #000 45%, transparent 100%)','linear-gradient(#000,#000)']:repairs.map(r=>`radial-gradient(ellipse 38% 27% at ${r.x}% ${r.y}%, #000 40%, rgba(0,0,0,.6) 70%, transparent 100%)`)}];
}));
export const riftOrder=Object.keys(riftDestinations);
export const riftScenes=['rift',...riftOrder,'beyond-rift'];
export const riftReady=p=>elysiumComplete(p)&&riftOrder.every(id=>p[riftDestinations[id].key]===4);
export function canVisitRift(p,scene){
 if(!elysiumComplete(p)||!riftScenes.includes(scene))return false;
 if(scene==='rift')return true;
 if(scene==='beyond-rift')return riftReady(p)&&p.riftCrossed===1;
 return riftOrder.slice(0,riftOrder.indexOf(scene)).every(id=>p[riftDestinations[id].key]===4);
}
export const riftArrivalLog={id:'rift-arrival-log',title:text('The garden beyond','Zahrada na druhé straně'),source,time:text('Beyond the Rift','Za Trhlinou'),unlockAt:109,
 text:text('An immense ring curves across an unfamiliar sky. Gardens cover its inner terraces; bridges lie dark between geometric towers. The expedition beacon holds our return path. Elysium receives our first image. This place is not a wreck waiting to be repaired. It is a world waiting to be understood.','Neznámou oblohu protíná obrovský prstenec. Jeho vnitřní terasy pokrývají zahrady a mezi geometrickými věžemi leží temné mosty. Maják výpravy drží zpáteční cestu. Elysium přijímá náš první snímek. Tohle není vrak čekající na opravu. Je to svět, kterému se teprve musíme naučit rozumět.')};
export function crossRift(p){return riftReady(p)?{...p,riftCrossed:1,scene:'beyond-rift'}:p;}
[
 ['Approaching the aperture','Přiblížení k průchodu'],['Between two skies','Mezi dvěma oblohami'],['The garden emerges','Zahrada se vynořuje'],
 ['The anchors hold. Moving beyond the threshold.','Kotvy drží. Překračujeme práh.'],
 ['Space folds around the ship. Follow the return signal.','Prostor se skládá kolem lodi. Sleduj zpáteční signál.'],
 ['Elysium receives our signal from the other side.','Elysium přijímá náš signál z druhé strany.'],
 ['The Rift','Trhlina'],['An echo beyond the chart.','Ozvěna za hranicí mapy.'],
 ['Trace the impossible signal. Keep a way home.','Sleduj nemožný signál. Zachovej cestu domů.'],
 ['Complete the previous expedition first','Nejprve dokonči předchozí výpravu'],
 ['Cross the Rift →','Proletět Trhlinou →'],['Return to Elysium →','Zpět na Elysium →'],
 ['Investigate the echo →','Prozkoumat ozvěnu →'],['Return to the expedition chart →','Zpět na mapu výpravy →'],
 ['Return beacon online','Zpáteční maják v provozu'],['A world waiting to wake.','Svět čekající na probuzení.'],
 ['The return link is secure. Exploration of the great ring comes next.','Zpáteční spojení drží. Příště prozkoumáme velký prstenec.'],
 ['Read the first impression →','Přečíst první dojmy →'],['CHAPTER 05 COMPLETE','KAPITOLA 05 DOKONČENA'],
 ['Locking the anchors','Zaměřování kotev'],['Through the Rift','Průlet Trhlinou'],['Beyond the familiar sky','Za známou oblohou'],
 ['All beacons aligned · return channel secured','Všechny majáky sladěny · zpáteční kanál zajištěn'],
 ['Following the probe through the aperture','Sledujeme sondu průchodem'],['Far-side beacon acquired · Elysium link online','Maják na druhé straně zachycen · spojení s Elysiem aktivní'],
 ['Stay at the Rift','Zůstat u Trhliny'],['ELYSIUM LINK / ONLINE','SPOJENÍ S ELYSIEM / AKTIVNÍ'],
 ['THE RIFT','TRHLINA'],['UNKNOWN SPACE','NEZNÁMÝ PROSTOR'],['EXPEDITION ROUTE','TRASA VÝPRAVY'],
 ['Passage secured. Cross when you are ready.','Průchod zajištěn. Proleť, až budeš připraven.'],
 ['Complete each site to reveal the next bearing.','Dokonči každé stanoviště a odhal další směr.']
].forEach(([en,cs])=>text(en,cs));
