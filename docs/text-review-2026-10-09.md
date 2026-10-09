# Jazyková revize hry — 9. 10. 2026

Ruční čtení 1 634 položek z hlavního katalogu a překladových modulů: nejprve EN, potom CZ. Dále zkontrolovány návody v `tutorials.js`, texty nastavení, odměn, kapitol, deníku a minihry vložené přímo v JSX a dynamické cíle. Rozsah: hráčské texty všech devíti současných kapitol; nikoli text zapečený do obrázků ani redakční revize administrátorské analytiky. Část starších katalogových položek už není aktivně zobrazovaná; jejich opravy jsou zahrnuté, aby se chyby nevracely při opětovném použití.

Příběhový základ, identifikátory, odemykání, cíle, tahy, desky, kryty, rezonátory a ukládání postupu se nemění. Porovnání konfigurace před/po potvrdilo shodu všech 155 úrovní.

## Angličtina a význam společných hlášek

| Soubor | Před | Po | Důvod |
|---|---|---|---|
| src/i18n/cs.json | This resets all repairs, the ship log and departure for this account on every device. | This resets all game progress for this account on every device, including repairs, the ship log and completed chapters. | Restart už zahrnuje všechny kapitoly. |
| src/i18n/cs.json | This resets all guest repairs, the ship log and departure on this browser. | This resets all guest progress in this browser, including repairs, the ship log and completed chapters. | Stejné upřesnění úplného restartu pro hosta. |
| src/i18n/cs.json | Energy and unfinished puzzles remain on this device. | Energy is saved only in this browser. Unfinished puzzles are not saved. | Uložený postup neobsahuje rozehranou desku. |
| src/i18n/cs.json | Back to ship | Back to exploration | Sdílené tlačítko vrací do aktuální lokace, ne vždy k lodi. |
| src/i18n/cs.json | Back to the ship | Back to exploration | Zavření deníku nevrací automaticky na loď. |
| src/i18n/cs.json | Ready to repair. | Objective complete. | Výhra se používá i při výzkumu a průzkumu. |
| src/i18n/cs.json | Now bring your ship back to life. | Continue your journey. | Pozdní kapitoly už neopravují pilotovu loď. |
| src/i18n/cs.json | Back to the ship? | Leave this level? | Potvrzení odchodu platí ve všech lokacích. |
| src/i18n/cs.json | The archive is quiet. Restore the emergency lights to begin your first entry. | The archive is quiet. Complete your first repair to unlock the first entry. | První oprava je servisní napájení komory, ne světla kokpitu. |
| src/i18n/cs.json | Launch check complete. Chapter one restored. | Launch check complete. The ship is ready for departure. | Kapitola končí až odletem; kapitola se neopravuje. |
| src/i18n/cs.json | Repair these systems in order. This is just the first stage of restoring the whole ship. | Repair these systems in order. This is one stage of restoring the whole ship. | Kokpit už není první etapou. |
| src/i18n/cs.json | After the cockpit: hull, living quarters, supplies, navigation, fuel and engines. Departure comes at the end of the ship chapter. | After the cockpit: navigation, living quarters, supplies, the engine room and exterior repairs. Departure comes at the end of the ship chapter. | Aktuální pevné pořadí první kapitoly. |
| src/i18n/cs.json | The ring is lit from end to end. Our ship looks tiny through the glass. We have restored a way into the city; now we must give it somewhere to live. | The ring is lit from end to end. Our ship looks tiny through the glass. We have restored a way into the city; now we must prepare homes for its people. | Bydlet budou lidé, nikoli město. |
| src/i18n/cs.json | Repair the apartment modules and install their living-support capsules. | Repair the apartment modules and install their life-support capsules. | Standardní anglický termín life-support. |
| src/relayStory.js | The relay separates a human recording from the strange pulse. Follow the irrigation lights. The refuge is sealed. We cannot tell how old the message is. | The relay separates a human recording from the strange pulse: “Follow the irrigation lights. The refuge is sealed.” We cannot tell how old the message is. | Relay není elektrické relé; oddělení citované zprávy. |
| src/refuge.js | Air filter modules replace root nodes here. Fit fresh cartridges and restore the intake before pressurising the entry. | Fit fresh filter cartridges and restore the air intake before pressurising the entry. | Odstranění technické poznámky o přejmenování kamenů z pilotovy repliky. |
| src/refuge.js | Supply capsules replace luminous pollen. Release the locker covers and check the sealed emergency packs. | Release the locker covers and check the sealed emergency supply capsules. | Stejná oprava rušivé poznámky o výměně sady kamenů. |
| src/nightSanctuary.js | The expedition left supplies beside the living seed shelter. Restore its clean flow. | The expedition left supplies beside the seed nursery. Restore the water supply so the shelter and nursery are ready for visitors again. | Živý semenný úkryt a čisté proudění nemají jasný význam. |
| src/nightSanctuary.js | Human blankets, sealed water and medical cases: the team rested here, then continued together. | Human blankets, sealed water containers and medical cases: the team rested here, then continued together. | Voda nemůže být sama uzavřená; jasný význam sealed water. |
| src/relay.js | Match 3 so that at least one matched tile touches the ring above, below, left or right. Each match adds +1. Blasts do not count. | Match at least 3 identical pieces so that one touches the ring above, below, left or right. Each matching wave adds +1 per ring. Blasts do not count. | Nabíjení se počítá za vlnu, ne zvlášť za každou řadu. |

## České překlady

| Soubor | Před | Po | Důvod |
|---|---|---|---|
| src/i18n/cs.json | Těsnění oken dostalo zabrat. Opravím ho a pořádně se rozhlédnu venku. | Těsnění oken dostalo zabrat. Opravím ho a pořádně se podívám ven. | Pilot se dívá z opraveného okna, nejde ven. |
| src/i18n/cs.json | Únik plýtvá našimi zásobami. Utěsním potrubí a opravím nádrž na čistou vodu. | Netěsným potrubím ztrácíme vodu. Utěsním ho a opravím nádrž na čistou vodu. | Přirozený popis úniku vody. |
| src/i18n/cs.json | Odtud dosáhnu na poškozené opláštění. Je čas vrátit lodi její kůži. | Odtud dosáhnu na poškozené panely. Je čas vrátit lodi pevný plášť. | Doslovná kůže lodi nahrazena srozumitelným opláštěním. |
| src/i18n/cs.json | Zpráva pod smyčkou | Zpráva za opakovaným voláním | Smyčka znamená opakovanou nahrávku majáku. |
| src/i18n/cs.json | Sklo je utěsněné. Za ním se přes vzdálený hřeben táhne řada světel. Myslel jsem, že jsou to hvězdy. Hvězdy ale nesledují povrch. | Sklo je utěsněné. Za ním se přes vzdálený hřeben táhne řada světel. Myslel jsem, že jsou to hvězdy. Hvězdy ale nekopírují terén. | Upřesnění významu poslední věty. |
| src/i18n/cs.json | Chladicí kapalina opět proudí potrubím. Slyším ji pod nouzovým hučením. Tichý začátek pro místnost určenou k pohybu celé lodi. | Chladicí kapalina opět proudí potrubím. Slyším ji přes hučení nouzových systémů. Tichý začátek pro strojovnu, která má rozhýbat celou loď. | Odstranění doslovného nouzového hučení a místnosti určené k pohybu. |
| src/i18n/cs.json | Pod jizvami nárazu jsou tenké rozvětvené spáleniny. Ještě před přistáním se trupu dotklo něco silně energetického. Stopa, ale ne vysvětlení. | Pod stopami nárazu jsou tenké rozvětvené spáleniny. Ještě před přistáním zasáhl trup jakýsi energetický výboj. Stopa, ale ne vysvětlení. | Přirozenější popis energetického zásahu bez určení jeho původu. |
| src/i18n/cs.json | Retranslátor automaticky odpovídá už roky. Pod smyčkou je novější časová značka — ze stejného dne, kdy někdo navštívil důl. | Retranslátor automaticky odpovídá už roky. Mezi opakovanými zprávami je novější časová značka — ze stejného dne, kdy někdo navštívil důl. | Srozumitelný význam vysílací smyčky. |
| src/i18n/cs.json | Hlas za smyčkou | Hlas za opakovaným voláním | Sjednocení významu vysílací smyčky. |
| src/i18n/cs.json | Archivní loď se pomalu převrací mezi skalami. Žádný nouzový maják, žádný čerstvý náraz. Nechali ji tu záměrně, s chladnými motory. | Archivní loď se pomalu převaluje mezi asteroidy. Žádný nouzový maják, žádné čerstvé stopy nárazu. Nechali ji tu záměrně, s vypnutými motory. | Vesmírný kontext, cold engines jsou vypnuté motory. |
| src/i18n/cs.json | Po připojení se dokončil uložený pozdrav: „Nenapájejte hlavní prstenec, dokud ho nezarovnáte.“ Hlas patří správci Havenu. Udržoval malé obydlí v chodu, zatímco výprava pátrala dál. | Po připojení se dokončil uložený pozdrav: „Nenapájejte hlavní prstenec, dokud ho nezarovnáte.“ Hlas patří řídicímu systému Havenu. Udržoval malé obydlí v chodu, zatímco výprava pátrala dál. | Haven caretaker je systém, nikoli další lidská postava. |
| src/i18n/cs.json | Palivová hadice odpadla. Chvíli jsem slyšel jen motory. Pak pod námi zmizela zem. Tato loď mě dostala dolů živého. Dnes jsme ji vrátili k životu. Signál tam stále je — a na druhém konci už někdo čeká. Kurz nastaven. Letíme. | Palivová hadice se odpojila. Chvíli jsem slyšel jen motory. Pak pod námi zmizela zem. Tato loď mě dostala dolů živého. Dnes jsme ji vrátili k životu. Signál tam stále je — a na druhém konci už někdo čeká. Kurz nastaven. Letíme. | Řízené odpojení při odletu, ne závada hadice. |
| src/i18n/cs.json | Tím se smažou všechny opravy, lodní deník a odlet tohoto účtu na všech zařízeních. | Tím se smaže veškerý herní postup tohoto účtu na všech zařízeních, včetně oprav, deníku a dokončených kapitol. | Restart už zahrnuje všechny kapitoly. |
| src/i18n/cs.json | Tím se smažou všechny opravy hosta, lodní deník a odlet v tomto prohlížeči. | Tím se smaže veškerý postup hosta v tomto prohlížeči, včetně oprav, deníku a dokončených kapitol. | Stejné upřesnění úplného restartu pro hosta. |
| src/i18n/cs.json | Energie a rozehrané minihry zůstávají v tomto zařízení. | Energie se ukládá pouze v tomto prohlížeči. Rozehrané minihry se neukládají. | Uložený postup neobsahuje rozehranou desku. |
| src/i18n/cs.json | Zpět k lodi | Zpět na průzkum | Sdílené tlačítko vrací do aktuální lokace, ne vždy k lodi. |
| src/i18n/cs.json | Zpět k lodi | Zpět na průzkum | Zavření deníku nevrací automaticky na loď. |
| src/i18n/cs.json | Připraveno k opravě. | Úkol splněn. | Výhra se používá i při výzkumu a průzkumu. |
| src/i18n/cs.json | Teď vrať loď k životu. | Pokračuj v cestě. | Pozdní kapitoly už neopravují pilotovu loď. |
| src/i18n/cs.json | Zpátky k lodi? | Opustit tuto úroveň? | Potvrzení odchodu platí ve všech lokacích. |
| src/i18n/cs.json | Předletová kontrola hotová. První kapitola dokončena. | Předletová kontrola hotová. Loď je připravená k odletu. | Kapitola končí až odletem; kapitola se neopravuje. |
| src/i18n/cs.json | Archiv obnoven. Haven má jméno. | Archiv obnoven. Útočiště se jmenuje Haven. | Haven má jméno je nesmyslně doslovné. |
| src/i18n/cs.json | Generátor vykopávek | Generátor průzkumného tábora | Excavation zde znamená odběr hornin, nikoli archeologické vykopávky. |
| src/i18n/cs.json | Síť vykopávek je v provozu. Pracovní světla osvětlují trhlinu. | Napájení průzkumného tábora je obnoveno. Pracovní světla osvětlují trhlinu. | Stejná terminologie geologického průzkumu. |
| src/i18n/cs.json | Uvolním chráněné ovládání a zasunu vrták. Stačí nám volná přihrádka se vzorky. | Uvolním chráněné ovládání a zasunu vrták. Stačí nám vyjímatelná přihrádka se vzorky. | Loose tray neznamená prázdnou či volnou přihrádku. |
| src/i18n/cs.json | Bez chlazení nelze startovat. Než zapneme reaktor, obnovím oběh chladiva. | Bez chlazení nemůžeme reaktor spustit. Nejdřív obnovím oběh chladiva. | Restart reaktoru není start lodi. |
| src/i18n/cs.json | Nasbírej 24 energetických krystalů a 24 hvězd a 15 modrých komet. Rozbij všechny ochranné kryty. | Nasbírej 24 energetických krystalů, 24 hvězd a 15 modrých komet. Rozbij všechny ochranné kryty. | Přirozený výčet tří cílů. |
| src/i18n/cs.json | Zpráva údržby opakuje jediný pokyn: udržujte zahrady při životě, dokud se nevrátíme. Vzorek života, který jsme získali, tady může být důležitý. | Zpráva údržby opakuje jediný pokyn: udržujte zahrady při životě, dokud se nevrátíme. Živý vzorek, který jsme získali, tady může být důležitý. | Vzorek života nahrazen živým vzorkem. |
| src/i18n/cs.json | Prstenec svítí od jednoho konce k druhému. Naše loď vypadá skrz sklo nepatrně. Obnovili jsme cestu do města; teď mu musíme vrátit místa k životu. | Prstenec svítí od jednoho konce k druhému. Naše loď vypadá skrz sklo nepatrně. Obnovili jsme cestu do města; teď musíme připravit domovy pro jeho obyvatele. | Bydlet budou lidé, nikoli město. |
| src/i18n/cs.json | První byty jsou vytopené, utěsněné a připravené pro návštěvníky. | První byty jsou vyhřáté, utěsněné a připravené pro návštěvníky. | Vytopené může znamenat zaplavené. |
| src/i18n/cs.json | Než otevřeme kapsle školky, vyrovnej teplotu, vlhkost a osvětlení. | Než otevřeme pěstební kapsle, vyrovnej teplotu, vlhkost a osvětlení. | Nursery zde znamená pěstírnu sazenic. |
| src/i18n/cs.json | Vedle uchovaných semen založ novou školku ze vzorku ze Zeleného světa. | Vedle uchovaných semen založ novou pěstírnu ze vzorku ze Zeleného světa. | Sjednocení pěstební terminologie. |
| src/i18n/cs.json | Školkou se šíří zelené výhonky. Výzkum výpravy začíná přinášet skutečný život. | V pěstírně se objevují zelené výhonky. Výzkum výpravy začíná přinášet skutečný život. | Sjednocení pěstební terminologie. |
| src/i18n/cs.json | Získaný organismus stabilizuje záhony školky. Výprava nám nezanechala jen souřadnice: zanechala nám začátek nového ekosystému. | Získaný organismus stabilizuje záhony v pěstírně. Výprava nám nezanechala jen souřadnice: zanechala nám začátek nového ekosystému. | Sjednocení pěstební terminologie. |
| src/i18n/cs.json | Uvítací maják · TĚŽKÁ | Uvítací maják · TĚŽKÉ | Jednotné označení obtížnosti. |
| src/i18n/cs.json | Hint | Nápověda | Chybějící český překlad tlačítka. |
| src/i18n/cs.json | Skener je v provozu. Přístup k vysílači i archivu je otevřený. | Skener je v provozu. Ledová stanice i Unášený archiv jsou přístupné. | Použití názvů skutečných lokací. |
| src/i18n/cs.json | Míchat | Míchání | Sjednocení názvu pomůcky s návodem. |
| src/i18n/cs.json | Vyber jednu dlaždici. | Vyber jeden kámen. | Jednotné označení herních kamenů. |
| src/i18n/cs.json | Promíchat pole. | Promíchat desku. | Jednotné označení hrací desky. |
| src/i18n/cs.json | Vyber dvě sousední odkryté dlaždice. | Vyber dva sousední kameny bez krytů. | Jednotné označení herních kamenů. |
| src/i18n/cs.json | Jsem naživu. Loď sotva drží pohromadě. A signál pořád vysílá. | Jsem naživu. Loď sotva drží pohromadě. A signál se pořád ozývá. | Signál sám nevysílá. |
| src/refugeHomes.js | Ručně psaný servisní seznam přiděluje každému návštěvníkovi dávku vody. Útočiště vzniklo pro malou posádku, ne pro nekonečnou populaci. | Ručně psaný servisní seznam přiděluje každému návštěvníkovi dávku vody. Útočiště vzniklo pro malou posádku, ne pro neomezený počet lidí. | Přirozený význam kapacity útočiště. |
| src/researchStory.js | Přehrát návrat k výzkumu | Přehrát návrat na Elysium | Nepřirozený návrat k výzkumu v názvu příběhové scény. |
| src/relayStory.js | Relé oddělí lidský záznam od podivných impulzů. Sledujte světla zavlažování. Útočiště je uzavřené. Nedokážeme určit, jak je zpráva stará. | Retranslační stanice oddělí lidský záznam od podivného pulzu: „Sledujte světla podél zavlažovacích kanálů. Útočiště je uzavřené.“ Nedokážeme určit, jak je zpráva stará. | Relay není elektrické relé; oddělení citované zprávy. |
| src/relayStory.js | Elysium drží zpáteční spojení během našeho sestupu. Přerušený řetězec světel sleduje vodu do údolí na noční straně. | Elysium udržuje zpáteční spojení během našeho sestupu. Přerušovaná řada světel vede podél vody do údolí na noční straně. | Přirozenější navigační popis. |
| src/refuge.js | Kořenové uzly zde nahrazují filtrační moduly. Osadíme čerstvé vložky a obnovíme sání před natlakováním vstupu. | Osadíme nové filtrační vložky a obnovíme přívod vzduchu, než vstup natlakujeme. | Odstranění technické poznámky o přejmenování kamenů z pilotovy repliky. |
| src/refuge.js | Světelný pyl nahrazují zásobovací kapsle. Uvolníme kryty skříně a zkontrolujeme uzavřené nouzové balíčky. | Uvolníme kryty skříně a zkontrolujeme uzavřené kapsle s nouzovými zásobami. | Stejná oprava rušivé poznámky o výměně sady kamenů. |
| src/nightSanctuary.js | Zachovej zpáteční maják | Udržuj zpáteční maják v provozu | Open beacon není zachování předmětu, ale funkční spojení. |
| src/nightSanctuary.js | Výprava nechala zásoby vedle živého semenného úkrytu. Obnovíme čisté proudění. | Výprava nechala zásoby vedle pěstírny semen. Obnovíme přívod vody, aby úkryt i pěstírna mohly znovu sloužit návštěvníkům. | Živý semenný úkryt a čisté proudění nemají jasný význam. |
| src/nightSanctuary.js | Lidské přikrývky, uzavřená voda a lékařské kufry: tým zde odpočíval a potom pokračoval společně. | Přikrývky pro lidi, voda v uzavřených nádobách a lékařské kufry: tým zde odpočíval a potom pokračoval společně. | Voda nemůže být sama uzavřená; jasný význam sealed water. |
| src/nightSanctuary.js | Oko správce se otevírá stálým tyrkysovým světlem. | Oko správce se otevírá a září stálým tyrkysovým světlem. | Oko se neotevírá světlem. |
| src/nightRoot.js | Obnov dýchací průduchy | Obnov větrací průduchy | Jde o ventilaci komory, ne dýchací orgány. |
| src/nightRoot.js | Stálý tyrkysový impulz dosahuje lodního rádia. | Stálý tyrkysový pulz dorazí k lodnímu rádiu. | Přirozená vazba slovesa. |
| src/nightRoot.js | Otevři práh svatyně · TĚŽKÉ | Otevři vstup do svatyně · TĚŽKÉ | Práh se neotevírá. |
| src/nightGrove.js | Odvážený proud | Řízený průtok | Measured zde znamená uváženě regulovaný, ne zvážený proud. |
| src/nightGrove.js | Rezonátor převádí světlo na známý identifikátor výpravy. Neobsahuje nouzový příkaz. Ukazuje k úkrytu hlouběji pod porostem. | Rezonátor převádí světlo na známý identifikátor výpravy. Není v něm žádné tísňové volání. Ukazuje k úkrytu hlouběji pod porostem. | Nouzový příkaz není přirozený název distress signálu. |
| src/nightGrove.js | Pod obloukem nacházíme ručně kreslenou šipku výpravy a zapečetěnou poznámku: správce naslouchá dole. Kopírujeme trasu Elysiu a připravujeme sestup. | Pod obloukem nacházíme ručně kreslenou šipku výpravy a zapečetěný vzkaz: správce naslouchá dole. Posíláme kopii trasy Elysiu a připravujeme sestup. | Kopírujeme trasu Elysiu je chybná vazba. |
| src/nightGrove.js | Porost rozluštěn. Stopa výpravy vede do kořenové komory pod námi. | Signály porostu jsou rozluštěné. Stopa výpravy vede do kořenové komory pod námi. | Dekódovány byly signály, nikoli porost. |
| src/nightGarden.js | Stanice zůstává naší cestou domů. Zde pod zemí přenášejí kořeny stejný rytmus. Světla reagují i bez příkazového kódu. | Stanice zůstává naší cestou domů. Tady na povrchu přenáší půda stejný rytmus prostřednictvím kořenů. Světla reagují i bez příkazového kódu. | Down here znamená na povrchu pod orbitální stanicí, ne pobyt pilota pod zemí. |
| src/nightGarden.js | Maják je připojený k živým kořenům. Uvolníme ochranné pojistky a sledujeme jejich vzor, místo abychom řezali novou trasu kabelu. | Maják je připojený k živým kořenům. Uvolníme ochranné pojistky a budeme sledovat jejich uspořádání, místo abychom prosekávali novou trasu pro kabel. | Trasu kabelu nelze řezat. |
| src/nightGarden.js | Vedle průzkumného majáku září teplé kořenové uzly. | Vedle průzkumného majáku září kořenové uzly teplým světlem. | Warm označuje barvu záře v této výsledkové zprávě. |
| src/relay.js | Úzký směr | Přesné zaměření | Narrow bearing není úzký směr. |
| src/relay.js | Poškozený záznam říká: útočiště je uzavřené, sledujte světla zavlažování. Časová značka je nejistá. Máme cíl, ale žádný příslib, že tam stále někdo je. | Poškozený záznam říká: „Útočiště je uzavřené, sledujte světla podél zavlažovacích kanálů.“ Časová značka je nejistá. Máme cíl, ale nevíme, zda tam ještě někdo je. | Přirozené spojení a rozlišení nahrávky. |
| src/relay.js | Stanice nyní drží spojení s domovem i směr k útočišti. Pod mraky se objevuje přerušený řetězec zavlažovacích světel. Tudy výprava pokračovala. | Stanice nyní udržuje spojení s domovem i zaměření útočiště. Pod mraky se objevuje přerušovaná řada světel podél zavlažovacích kanálů. Tudy výprava pokračovala. | Srozumitelné naváděcí osvětlení. |
| src/relay.js | Spoj 3 kameny tak, aby se alespoň jeden dotýkal kruhu nahoře, dole, vlevo nebo vpravo. Každé spojení přidá +1. Výbuchy se nepočítají. | Spoj alespoň 3 stejné kameny tak, aby se některý dotýkal kruhu shora, zdola, zleva nebo zprava. Každá vlna spojení přidá kruhu +1. Výbuchy se nepočítají. | Nabíjení se počítá za vlnu, ne zvlášť za každou řadu. |
| src/rift.js | Nikoho tu nenecháme | Nikdo nezůstal pozadu | Nadpis popisuje minulý odchod výpravy, ne budoucí slib pilota. |
| src/rift.js | Výprava popsala průchozí otvor poblíž temného gravitačního pole. Nazvali jej Trhlina. Jejich posledním rozkazem bylo zřídit zpáteční spojení. | Výprava popsala průchod poblíž temného gravitačního pole. Nazvala jej Trhlina. Jejím posledním pokynem bylo zřídit zpáteční spojení. | Shoda podmětu a přirozený průchod místo průchozího otvoru. |

## Texty mimo katalog a generované cíle

- Nápověda k boostům výslovně říká, že zdarma je její přečtení. Odpálení nálože stále stojí tah.
- Nova vyžaduje alespoň pět stejných kamenů **v jedné řadě**; doplněno do společného návodu.
- „Dlaždice / kameny“ sjednoceny na kameny, „pole / deska“ na desku. Míchání má stejný název v liště i návodu.
- „Using a tool costs stock“ přepsáno na čerpání jednoho použití ze zásoby. Český text neslibuje spotřebu celé zásoby.
- „30 luminous pollen / 30 světelného pylu“ nahrazeno „30 grains of luminous pollen / 30 zrn světelného pylu“ v generovaných cílech. Počet ani typ kamene se nezměnil.
- Hláška importu už běžného hráče neposílá spouštět migraci Supabase 015. Český úspěch říká druhé zařízení, nikoli pouze počítač.
- Hvězdy vysvětlují zbývající tahy z původního limitu a vyloučení bonusových tahů.
- V kapitolách „Odletový test“ → „Předletová kontrola“, „Přístupová trasa Elysium“ → „Příletová trasa k Elysiu“.
- Doplněné překlady: FINAL CHALLENGE, LANDING SITE, SHIP ACCESS, SYSTEM CHART, JUMP GATE, Extra hint a bezplatné bonusy CrazyGames.
- Dynamický český překlad nyní zná i pozdější typy kamenů; při změně čísel nevynechá navigační hranoly, pyl, zásobovací kapsle ani podmínku nabití rezonátorů. Výčet tří cílů má tvar „A, B a C“.
- České tlačítko Nápověda má upravenou velikost písma a šířku pro úzký HUD. Nadpis minihry má vyhrazené místo pro obě ikony; delší český text už nepřekrývá nápovědu.

## Ověření

- `npm test`: 175/175 prošlo, včetně dvou nových kontrol skutečného obsahu všech úrovní a příběhových panelů; kontrola cílů ověřuje počty i po změně čísel mimo pevný katalog.
- `npm run build`: prošlo; zbývá stávající upozornění Vite na velikost balíčku přes 500 kB.
- Přímé porovnání herních konfigurací před/po: všech 155 beze změny.
- Izolovaný Edge/Chromium: EN a CZ při 320 × 568 a 821 × 462, vstup do první minihry a otevření pravidel. Bez chyb JavaScriptu, popisek nápovědy uvnitř tlačítka a obsah návodu bez vodorovného přetékání. Externí požadavky blokované, test neodesílal analytiku.
- Změny jsou místní, zatím bez commitu a pushe.
