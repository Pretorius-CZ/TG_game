# Slepý test a strojové reporty — vyhodnocení 2026-10-23

Podklady: `chybove_hlasky/zprava-pro-programatora.md` a uživatelem dodaný
`C:/Users/preto/Downloads/beyond-signal-blind-playtest.json` (4 789 681 B).
Rozbor porovnán s místním kódem `f9fb288`, větev `codex/android-current`.
Report testoval webovou větev `codex/cockpit-stage`, commit `e1dc9cd`.
Limity všech 200 položek přílohy reportu i všech pokusů exportu odpovídají
aktuálnímu katalogu. Analýza neprovádí změnu obtížnosti, SQL ani publikaci.

## Upřesnění uživatele po rozboru

**Následné zpřesnění:** osobní téměř bezchybný průchod byl i bez použití
pomůcek. Níže uvedená dostupnost plné výbavy tedy sama nevysvětluje nízkou
obtížnost pro tohoto hráče. Uživatel nově chce přitvrdit od cca levelu20
a výrazně odlišit HARD; předchozí odklad ladění tím nahrazuje. Další směr
a skutečné omezení skladu 0/1 viz `difficulty-and-helper-stock-next.md`.

Uživatel uvádí, že osobně prošel všech 200 levelů na první pokus přibližně
se dvěma výjimkami. Tento údaj je jeho přímá zkušenost, nikoli 90% souhrn
napříč pěti průchody v exportu; tyto dvě metriky nezaměňovat. Přesný
odpovídající průchod nelze bez dalšího přiřazení identifikovat jen z tohoto
sdělení. Automatický rozbor exportu tím není opravou jeho osobního tvrzení.

Důležitá podmínka: každý pokus ve slepém testu dostává znovu jednu od
každé z pěti skladových pomůcek (Laser, Shuffle, Swap, Beam, EMP), navíc
jednu nápovědu. Dostupnost se obnovuje i při retry. To nejsou jen nálože
vznikající kombinacemi na desce. Běžná hra nemá totožný neomezený přísun
pomůcek; slepý test proto měří zvládnutelnost s touto pomocí k dispozici.

Pokus bez zaznamenaného použití pomůcky lze označit za výhru bez jejího
použití, ne za kontrolní test bez dostupné pomoci. Rozhodnutí pomůcku
použít není náhodné: hráč ji může využít právě v těžším pokusu. Rozdíl
úspěšností s/bez použití neměří efekt pomůcek ani obtížnost běžného režimu.

Závěr po upřesnění: neprovádět plošné přidání tahů podle slabší simulace.
Osobní téměř bezchybný průchod zkušeného hráče podporuje další zkoumání,
zda není průchodnost s plnou výbavou příliš vysoká. Nejprve oddělit lidská
a botí data, dostupnost/použití pomůcek a konkrétní frustraci desky. Pro
srovnání s běžnou hrou navrhnout samostatnou variantu bez skladových
pomůcek nebo s omezenou zásobou; stávající rozehrané testy nepřepisovat.
Konkrétní změna pravidel ani nový limit tím zatím nejsou schválené.

## Výsledek a rozsah

Export obsahuje 3 292 unikátních pokusů, žádný duplicitní attemptId.
Časový rozsah je 18. 10. až 23. 10. 2026. Pro účely rozboru rozděleno
podle samostatného slova BOT v poznámce; všechny záznamy botích průchodů
jsou skutečně takto označené. Neoznačené záznamy považujeme za lidské,
nikoli za ověřené unikátní osoby.

| Skupina | Pokusy | Průchody | Unikátní levely | Výhry / vyčerpání / odchody |
|---|---:|---:|---:|---|
| Bez označení BOT | 412 | 5 | 200 | 361 / 40 / 11 |
| BOT | 2 880 | 22 | 200 | 2 868 / 12 / 0 |

Botí část: 14 úplných průchodů po 200 levelech a 8 krátkých po 10.
Úplné průchody mají dohromady 2 789 výher z 2 800; jeden další neúspěch
je v krátkém testu. Všech 200 levelů bot alespoň jednou vyhrál.
To potvrzuje nalezené vítězné průchody, ne zaručenou výhru z každé desky.
Ve společném exportu není žádný výsledek `fault`; není to důkaz neexistence
jiných chyb a nenahrazuje kontrolu konzole nebo nedokončených běhů.

Zpráva pracuje s 13 úplnými průchody / 2 600 pokusy. Export je novější
a obsahuje ještě čtrnáctý úplný průchod i krátké testy. V prvních 13
úplných průchodech podle času dokončení vychází stejných 11 neúspěchů
a 697 přesunů náloží, což odpovídá popisu zprávy (~700). Data nejsou
rozdílná jen kvůli údajnému počtu zařízení.

## Lidský průchod už pokrývá celou hru

Oproti exportu (2) přibylo 105 lidských pokusů: 307 → 412, pokrytí
179 → 200 levelů. Jeden průchod má všech 200 pozic odehraných i hodnocených.
Ostatní mají záznamy na 93, 52, 20 a 5 pozicích. Pět průchodů není pět
nezávislých hráčů ani automaticky pět různých zařízení.

První skutečný pokus bereme po skupinách session + slepá pozice, podle
času. Vynecháváme úvodní odchod bez tahu; retry po prohře ani opakování
po výhře nezvyšují počet prvních pokusů.

- 367 prvních skutečných pokusů: 330 výher, 34 vyčerpání, 3 odchody.
  Úspěšnost 89,9 %, včetně odchodů v jmenovateli.
- Bez pomůcky, nápovědy a bonusových tahů: 308 výher ze 341, tedy 90,3 %.
  Jde o popis vybraných pokusů, ne měření kauzálního přínosu pomůcek.
- 366 ohodnocených prvních pokusů: 230 Lehké (62,8 %), 109 Akorát
  (29,8 %), 27 Těžké (7,4 %). Jeden čeká na hodnocení.
- Medián rezervy při první výhře 7 tahů; průměr relativní rezervy 27,1 %.
- Nejdelší úplný průchod: první pokusy 181/200 výher, hodnocení
  134 Lehké / 55 Akorát / 11 Těžké.
- Alespoň jednou člověkem vyhráno 193 levelů. V exportu jsou zatím jen
  prohry u 62, 110, 128, 129, 189, 191 a 200. U většiny jen jeden pokus;
  není to seznam prokazatelně rozbitých levelů.

### Rozdělení pravidel

258 lidských pokusů má `2026-10-18-charge-swap-v1`, dalších 154
`2026-10-19-cascade-pulse-v1`. Nová verze: 133 výher, 17 vyčerpání,
4 odchody; první skutečné pokusy 125/144 výher. Starší verze: 205/223
prvních výher. Bez párování stejných levelů/desek a stejného hráče není
rozdíl důkazem ztížení či zlehčení pravidly. V novější sadě je zaznamenáno
60 kaskádových Pulse; starší sada je správně nemá. Všechny botí pokusy
mají novější pravidla.

### Kde se obtížnost mění

Souhrn lidských prvních skutečných pokusů, obě verze pravidel dohromady:

| Levely | Výhry / první pokusy | Úspěšnost |
|---|---:|---:|
| 1–20 | 36/37 | 97,3 % |
| 21–40 | 38/39 | 97,4 % |
| 41–60 | 34/35 | 97,1 % |
| 61–80 | 38/41 | 92,7 % |
| 81–100 | 33/34 | 97,1 % |
| 101–120 | 29/33 | 87,9 % |
| 121–140 | 28/37 | 75,7 % |
| 141–160 | 35/38 | 92,1 % |
| 161–180 | 34/39 | 87,2 % |
| 181–200 | 25/34 | 73,5 % |

Obecný tvar z automatického reportu se tedy v lidských datech opakuje:
skok po stovce, obtížné 121–140 a závěr, snazší 141–160 po dřívějším
ladění. Výše procent není populační odhad pro nové hráče; vzorky jsou malé,
opakované stejným zkušeným testerem a různě pokrývají levely.

## Důležité opravy interpretace reportu

1. Botí volba Lehké/Akorát/Těžké není v celém exportu jednotná. U 550
   z 2 880 botích pokusů se neshoduje s převodem aktuálních hvězd:
   327 označení Akorát místo jedné hvězdy, 75 Akorát místo tří,
   148 Lehké místo dvou. Všechny tyto rozdíly jsou ve starších botích bězích
   z 22. 10.; nové běhy z 23. 10. už souhlasí. Není to chyba lidského
   subjektivního hodnocení. Botí hvězdy přepočítat přes earnedStars z
   baseBudget a moves, prohry vést zvlášť. Staré poznámky nepřepisovat.
2. Reportové „★ nebo prohra“ směšuje dvě odlišné věci. Jedna hvězda je
   řádná výhra a stačí k postupu. Slabé hvězdy samy nejsou důvodem přidávat
   tahy všem levelům. Přesné přepočtené rozložení všech botích záznamů:
   1 432 tříhvězdových výher, 734 dvouhvězdových, 702 jednohvězdových,
   12 proher. Pro čisté srovnání nepřimíchávat krátké testy k úplným běhům.
3. „Běžný hráč“ je politika simulátoru, nikoli skutečný začátečník. Oba
   strojové zdroje sdílejí pravidla hry a příbuzný způsob výběru tahů;
   jejich shoda není druhé nezávislé lidské potvrzení.
4. Neúspěch simulátoru i s 1,8× limitem +10 není důkaz geometricky
   neřešitelné desky. Může jít o slabinu strategie či náhodu. Nenašel jsem
   žádný kryt bez možné vodorovné či svislé trojice v geometrii všech
   200 aktuálních masek. Tato statická kontrola sama nezaručuje dohratelnost.
5. Ve 40 lidských vyčerpáních chyběl 34× pouze sběr kamenů, 5× sběr
   i kryty a 1× pouze kryty. Nikdy nechyběl náboj rezonátoru. U všech 12
   botích proher chyběl jen sběr. Nezrychlovat tedy automaticky kruhy.
6. U všech zaznamenaných výher jsou podle přiložených cílů splněné počty,
   kryty i rezonátory. Časy zahrnují pauzy; nepoužívat je přímo jako výkon.

## Kandidáti na cílené ladění

Přidání tahů 15 levelům z reportu není tímto rozborem schváleno. Níže jsou
skutečné lidské výsledky v dodaném souboru, včetně retry, ne odhad populace:

| Level | Výhry / všechny lidské pokusy | Co z toho plyne |
|---|---:|---|
| 167 | 1/3 | Silný společný kandidát; dvě prohry jen o 2 a 3 kameny, kruhy i kryty hotové. Ověřit malou variantu limitu/cíle, ne automaticky 27→34. |
| 110 | 0/1 | Shoda s reportem, ale zatím jediná lidská prohra o 4 kameny. |
| 196 | 1/2 | Jedna prohra o jediný kámen; oba pokusy přesto hodnoceny Lehké. |
| 174 | 2/3 | Jedna prohra o 3 kameny; další výhry 18 a 24 z 28 tahů. |
| 116 | 1/1 | Akorát; zatím nerozhodovat z botích hvězd samotných. |
| 161 | 1/1 | Výhra 28/30 s Laserem, Akorát. Ověřit čistý průchod bez pomůcky. |
| 124 | 5/6 | Šestý záznam je přerušený pokus, nikoli vyčerpání; není potvrzenou lidskou zdí. |
| 139 | 1/1 | Akorát; cíleně ověřit před převzetím simulačního navýšení. |
| 165 | 2/2 | Obě výhry s pomůckou, konkrétní poznámka o špatném krytu. Nejprve geometrie. |
| 172 | 1/1 | Čistá výhra 24/29, Lehké; velké navýšení zatím nepodporuje lidský vzorek. |
| 188 | 1/1 | Čistá výhra 19/24, Lehké. |
| 133 | 4/4 | Třikrát Akorát, jednou Lehké; současná lidská data nepotvrzují nutnost přidat tahy. |
| 198 | 2/2 | Jedna čistá výhra 18/28, druhá 26/28 s Laserem. Samotné +8 tahů není podložené. |
| 137 | 2/2 | Lehké/Akorát; ověřit větším lidským vzorkem. |
| 199 | 2/2 | Obě výhry 24/30: jednou čistě Lehké, jednou s Beam Těžké. Subjektivní zkušenost se liší. |

Přidat na seznam i lidské signály mimo reportovou prioritní patnáctku:
15 (dvě prohry a výhra až posledním tahem), 99, 129, 132, 135, 147,
186 a 187 (opakované prohry nebo Těžké). U 187 zatím jediná výhra s Laserem.
U 200 jediná lidská prohra o 8 kamenů; sledovat závěrečný level samostatně.
Celkový agregát všech 200 levelů je v `playtest-level-review-2026-10-23.json`.
Obsahuje počty a přepočtené botí hvězdy, bez reporterů, session ID a textů poznámek.

Lehké části nechat do dalšího rozhodnutí beze změny. Přesvědčivé konkrétní
čisté výhry/poznámky: 42 za 4/23, 29 za 11/30 a 16/30, 23 za 10/25,
144 za 17/38 a 150 za 22/40. Není důvod současně plošně ulehčovat hru.

## Konkrétní technické nálezy a pořadí práce

### 1. Oddělení botů v /balance — potvrzená mezera

PlaytestReport.jsx stále nadepisuje celou smíšenou sadu „Slepý lidský
playtest“. Přepíná jen průchod, nikoli člověk/BOT. Běžné statistiky jsou
od slepého testu oddělené, takže nejde o důkaz jejich kontaminace.

Navržená oprava: výběr Lidé / BOT / Vše, výchozí Lidé, stejný filtr pro
tabulku, počty i export. Zpětná klasifikace z BOT poznámky, nový explicitní
příznak v metadatech pro budoucí roboty; zachovat původní záznamy a lidská
hodnocení. Nespoléhat jen na nové URL, protože stará data už existují.

### 2. Kryt levelu 165 — konkrétní kandidát na opravu

spacedResonatorCovers vybírá náhradní pole podle pořadí kandidátů, ne podle
jejich dostupnosti. U refuge-arrival-pressure z původních krytů
[17,22,41,46] vzniká [41,46,1]. Index 1 je horní řada, druhý sloupec;
levý horní roh masky je díra. To odpovídá lidské poznámce o bloku vlevo
nahoře, ale neprokazuje nutnost Laseru v každé desce.

Návrh: při náhradě krytu upřednostnit lépe dostupná pole a ověřit možné
trojice/výměny okolo krytu, zachovat odstup od kruhů a počet krytů.
Potom stejnými seedy porovnat původní a novou desku bez pomůcek.
Stejný generátor používají i jiné levely; neprovádět slepou globální změnu.

### 3. Energie po reloadu — historický nález, znovu neopravovat

Zpráva sama uvádí nález ze 17. 10., bez ověření na nové verzi.
Už e1dc9cd má createAttemptEnergy: první platný běžný tah/aktivace rezervuje
článek a uloží odečet ihned, výhra vrací rezervaci jen ve stejném dokumentu.
Reload ponechá odečet. Není zde nevyřízený záznam, který by se měl nově
odečítat při startu — taková změna by riskovala dvojí stržení.

Samotný slepý test používá LivesProvider practice a má úmyslně neomezenou
energii. Jeho 5→5 není podvod v běžné hře. Zpráva přesný režim starého
repro neuvádí; příčinu jejího měření nelze určit pouze z textu.

### 4. Otočení iPhonu SE — zatím nepotvrzené

OrientationGuard poslouchá matchMedia change a změny DOM, nikoli resize
či orientationchange. Pojistka těmito událostmi je rozumný samostatný
návrh, ale artefakt emulace není potvrzená chyba fyzického Safari.
Zbývá cílený test 320×568 → 568×320 → 320×568 během animace a ruční
kontrola na iPhonu. Desku ani pokus při otočení nemontovat znovu.

### 5. Výkon, čeština, přístupnost, testovací selektory

V reportu nejsou nové blokující chyby těchto oblastí. Údaje o paměti a
rychlosti jsou převzaté ze zprávy; bez původních měření nebyly znovu
nezávisle naměřené. Dlouhé úlohy na CI bez GPU nejsou přímo FPS telefonu.
Odložené načítání scén je pozdější optimalizace, ne důvod měnit pravidla.
Pro čekání testů používat board aria-busy, ne přítomnost dlouhodobé
hlášky resonator-feedback. Selektory beze změny.

## Aktuální ověření

Spuštěny existující browser energy.spec.js a layout.spec.js:
Chromium 27/27 pass, včetně odečtu před dokončením animace, opakovaného
reloadu, výhry/prohry, retry/reklamního pokračování, refundu technické
chyby a otočení 430×739 tam/zpět se zachovanou deskou.

WebKit všech 27 případů selhal již při browserType.launch (Playwright.exe,
exitCode 3236495362), před spuštěním stránky. Jde o blokaci aktuálního
ověření prostředím, nikoli o 27 nalezených chyb hry. Výsledek na iPhonu
SE tím zůstává otevřený. Fyzická Apple zařízení nebyla tímto rozborem testována.

Shrnutí rozhodnutí pro další práci: nejprve čisté rozlišení testovacích
dat a ověření problémových desek; pak malé cílené varianty obtížnosti
porovnané stejnými seedy a lidským hraním. Dosavadní požadavek dokončit
všech 200 levelů na více zařízeních stále není splněn více úplnými lidskými
průchody. Tento rozbor jej neruší a nezavádí nové limity.
