# Obtížnost od levelu 20 — porovnání tabulky a průchodů

Stav 23. 10. 2026. **Rozbor a konkrétní návrh pro další test, nikoli
nasazené limity.** Herní zdroj na `codex/android-current`; společná pravidla
Androidu a webu jsou nyní shodná. Předchozí rozbor:
[blind-playtest-review-2026-10-23.md](blind-playtest-review-2026-10-23.md).

## Podklady a kontrola jejich shody

- Google Sheets `hvezdy-boti-vs-simulace`, list `hvezdy-boti-vs-simulace.csv`,
  gid25763010, všech 200 datových řádků A2:L201. Zdroj:
  https://docs.google.com/spreadsheets/d/1zZbNN0uBxG-6sh_nxYdAmb92wycLOMWHiYIASFaUnLc/edit#gid=25763010
- `chybove_hlasky/zprava-pro-programatora.md`: 13 úplných botích průchodů
  a samostatná simulace 100 pokusů na level/politiku, pravidla
  `2026-10-19-cascade-pulse-v1`.
- Export `beyond-signal-blind-playtest.json`: 3 292 pokusů, z toho 412
  neoznačených BOT a 2 880 botích. Novější než tabulka, obsahuje další běhy.
- Osobní zkušenost uživatele: téměř všech 200 napoprvé i bez pomůcek.
  Nezaměňovat s průměrem několika průchodů v exportu.

**Všech 200 limitů v tabulce odpovídá současnému katalogu.** Rozdíl tedy
není způsoben jinými limity mezi tabulkou a místním zdrojem.

Ve sloupci E tabulky se 12 průměrů při importu změnilo na datum:
levely **15, 29, 38, 44, 88, 105, 106, 140, 148, 149, 159, 167**.
Formátovaný výpis ukazuje `02.08` / `01.08`, neformátovaný 46236 / 46235.
Tyto hodnoty nejsou průměry hvězd; pro rozhodování je vynecháváme.
Původní report uvádí například pro 167 průměr 1,08. Případnou opravu Sheets
provést z původního CSV se sloupcem jako číslo, nikoli jen změnou formátu
již převedeného data. Zdrojový Sheet v tomto kroku nezměněn.

Tabulkové procento „jedna hvězda nebo prohra“ není procento proher.
Starší botí hodnocení navíc obsahuje chyby popsané v předchozím rozboru;
v exportu se hvězdy přepočítávají z tahů. Lidská hodnocení zůstávají
subjektivní. Neprůměrovat oba zdroje do jedné úspěšnosti.

## Závěr pro křivku obtížnosti

Lidské první pokusy: 21–40 **38/39**, 41–60 **34/35**, 81–100 **33/34**.
V první stovce je tedy prostor pro ztížení, shodný s osobní zkušeností.
Úseky 121–140 mají 28/37 a 181–200 25/34; ty už nelze stejným procentem
zkrátit jako snadné začátky. Jde o malé vzorky opakovaných zkušených
testerů, nikoli reprezentativní populaci nových hráčů.

Tabulka nabízí limity pro přibližně 75% úspěšnost konkrétní slabší
simulační politiky. Není to požadovaný produktový cíl ani příkaz přidat
tahy. Nepřebírat například 149:37→57, 154:36→62 nebo HARD167:27→41.

Pro první změnu ponechat 1–19; od 20 individuálně zkrátit prokazatelně
štědré limity. Zachovat snazší vstupy do nových mechanik a výrazné vrcholy
HARD. Nedělat každou další úroveň těžší než předchozí bez oddechu.

## Konkrétní první sada — běžné levely

Čísla jsou testovací kandidáti, ne změřená výsledná úspěšnost. Sloupec
„lidské tahy“ uvádí první výhry bez použití skladové pomůcky, nápovědy a
bonusových tahů; dostupnost pomůcek v testu přesto zůstávala. Nejde o
všechny výhry ani o garantované minimum. Přirozené Pulse/Nova se povolují.

| Level | Název | Dnes → kandidát | Lidské tahy / podklad |
|---:|---|---:|---|
| 20 | Cooling circuit | 19 → 16 | 10, 11; oba Lehké |
| 23 | Engine assembly | 25 → 20 | 10; simulace 94 % výher |
| 25 | Hull panels | 25 → 21 | 14, 16; oba Lehké |
| 28 | Emergency fuel depot | 26 → 21 | 16; simulace 94 % výher |
| 31 | Station entrance | 14 → 12 | 6; simulace 93 % výher |
| 36 | Approach beacons | 23 → 18 | 11, 14; oba Lehké, sim. 98 % |
| 37 | Frozen airlock | 24 → 18 | 12, 12; oba Lehké, sim. 98 % |
| 42 | Docking clamps | 23 → 16 | 4, 12, 14; tři Lehké, sim. 98 % |
| 43 | Emergency bulkhead | 24 → 18 | 11, 14, 16; tři Lehké, sim. 99 % |
| 45 | Navigation archive | 22 → 19 | 12, 15; oba Lehké |
| 48 | Outer dock | 20 → 17 | 9, 10, 12; tři Lehké |
| 54 | Buoy power | 22 → 19 | 10, 11; oba Lehké |
| 55 | Survey antenna | 24 → 20 | 13; simulace 94 % výher |
| 57 | Survey walkway | 24 → 20 | 10, 16; oba Lehké |
| 63 | Research landing pad | 23 → 18 | Shoda bot/simulace; sim. 97 %. Lidská první výhra použila pomoc, nedokládá čistý průchod. |
| 71 | Docking tunnel | 26 → 22 | 17, 17; oba Lehké |
| 74 | Reactor cooling | 27 → 23 | 15, 17, 18, 20; čtyři Lehké |
| 75 | Power distribution | 28 → 24 | 17, 22; simulace 98 % výher |
| 78 | Ring bulkhead | 27 → 24 | 13, 22; oba Lehké |
| 79 | Ring transit | 28 → 24 | 20, 22; oba Lehké |
| 82 | Habitat atmosphere | 28 → 25 | 14, 24; oba Lehké, menší zásah kvůli rozptylu |
| 95 | Synchronize the clocks | 27 → 24 | 17, 17; oba Lehké |
| 117 | Wake the signal resonator | 24 → 20 | 12, 13; oba Lehké, shoda bot/simulace |
| 118 | Align the relay dish | 27 → 23 | 16, 17; oba Lehké |
| 144 | Secure the entrance walkway | 38 → 34 | 17, 25, 31; 3/3 čisté první výhry, dvě Lehké |

Levely 24 a 27 sice také mají lehké průchody, ale krátký limit / rozdíl
simulace a člověka je důvod nechat je v prvním kole jako kontrolní body.
Nezkracovat všechny běžné úrovně jen proto, že jsou od čísla20 výše.

## HARD a finále — ztížit jen slabé vrcholy

| Level | Název | Dnes → kandidát | Důvod / riziko |
|---:|---|---:|---|
| 29 | Launch sequence | 30 → 25 | První finále; čisté první výhry za16 a23, celkem4/4 prvních výher. Simulace je slabší, další pokles zatím ne. |
| 53 | Stabilize the jump gate | 34 → 30 | HARD v lesson; čistá první výhra23, Lehké. Zatím jediný lidský vzorek. |
| 93 | Welcome beacon · HARD | 35 → 31 | Čistá první výhra27, Lehké; zatím jediný lidský vzorek. |
| 105 | Stabilize the Rift · HARD | 35 → 32 | Oba čisté první pokusy vyhrány za28 a30. |
| 120 | Secure the descent corridor · HARD | 32 → 29 | 3/3 prvních výher, všichni Lehké; čisté za18 a27. |
| 145 | Pressurise the refuge entry · HARD | 40 → 34 | Čistá první výhra28, Lehké. |
| 150 | Secure the living block · HARD | 40 → 33 | Obě první výhry Lehké; čistá za22, druhá s pomocí. |
| 155 | Prepare the refuge for return · HARD | 41 → 35 | Obě první výhry Lehké; čistá za25, druhá s pomocí. |

**33 navržených změn**, ostatních167 limitů zatím ponechat. Zkrácení je
první krok, u několika HARD nemusí samo stačit k požadované obtížnosti.
Pokud po testu stále chybí plánování, upravit konkrétní kombinaci cílů či
rozložení překážek; nezhoršovat skrytě přísun barev a nevytvářet nucený nákup.

HARD111/116/125/130/135/140/161/167/172/177/182/187 v první sadě nekrátit.
Například 130 má čisté výhry s velkou rezervou, ale také lidskou prohru a
hodnocení Těžké; nejprve ověřit rozptyl. 135 a187 mají oba první sledované
lidské pokusy prohrané, 167 jen1/3 prvních výher. Tam je náročnost již
viditelná. Samotné HARD v názvu ani špatné hvězdy bota nejsou důvod ke změně.

## Samostatně zkontrolovat frustraci desky

- **165:** skutečné kryty po `spacedResonatorCovers` jsou41/46/1, nikoli
  původní17/22/41/46; kryt1 je na horní hraně vedle vykrojeného rohu.
  Odpovídá poznámce o nepříjemném horním krytu. Prověřit lepší polohu,
  nikoli automaticky přidat8tahů. Geometrická možnost trojice existuje;
  není prokázáno, že je level nemožný bez Laseru.
- **110/128/129/132/135/147/167/174/186/187 a závěr200:** prohlédnout
  konkrétní zbytky cílů a opakovatelnost proher. Ne všechny jsou rozbité;
  většinou chybějí barevné dílky, ne nabití kruhů. 129 navíc kryty.
- Uvedená testová výbava obnovuje každý pokus jeden kus každé pomůcky.
  Tím se liší od běžného skladu. Nové Undo do dosavadního slepého testu
  nevstupuje. Výsledky s pomocí vést zvlášť, nikoli vyřadit prohru proto,
  že vítězné pokusy používaly pomůcky.

## Jak kandidáty ověřit před společným nasazením

1. Samostatná verze konfigurace s původními a kandidátními limity; stejná
   pravidla pro Android i web. První sada mění jen tahy, nikoli zároveň
   zásoby, cíle, kryty, přísun barev nebo bonus za kaskády.
2. Párované seedy, shodná politika, nejméně200pokusů na změněný level a
   variantu. Běh bez skladových pomůcek, reklam a Undo; přirozené nálože
   a kaskádový Pulse povolené. Měřit výhru zvlášť od hvězd, zbytky cílů,
   kryty/kruhy a selhání obnovy desky. Počet není záruka lidské obtížnosti.
3. Neužívat starý `scripts/audit-balance.mjs` jako finální autoritu: neumí
   současné přesuny náloží, neřeší nabití rezonátorů a nepokrývá všech200.
   Nový porovnávací běh musí odpovídat aktuální MiniGame, včetně úvodní
   desky `makeGoalBoard`, doplňování a podmínek vítězství.
4. Nový lidský slepý průchod; oddělit čistou variantu a asistovanou hru.
   Hodnotit první pokus, retry, subjektivní frustraci a rezervu tahů.
   Žádné garantované procento nelze odvodit jen odečtením starých tahů.
5. Produktový cíl k ověření, nikoli změřený výsledek: běžné levely
   přibližně75–85 % prvních výher reprezentativních hráčů, HARD45–65 %.
   Pokud chybí barva dlouho navzdory rozumnému hraní, řešit mechanismus,
   nikoli cílit počet reklam. Vzorek nyní pro takový populační odhad nestačí.
6. Před vydáním zvýšit verzi balancu. Rozehrané slepé testy mají konfiguraci
   uloženou při založení (`playtestStorage.js`), proto zůstanou na starých
   limitech; nové průchody založit odděleně. Zachovat postup i staré hvězdy.

V tomto rozboru neproběhla nová herní simulace ani změna aplikace či Sheets.
Číselná shoda všech200limitů ověřena strojově. Plán není nasazen na webu
ani součástí nového APK.

## Provedení schválené uživatelem — 23. 10. 2026

Na následný výslovný pokyn změnit a nasadit je všech33kandidátů výše
nastaveno přímo ve zdrojových datech. Historický rozbor nahoře popisuje
stav před schválením. Nová verze metrik: `2026-10-23-moves-v2`.
Přesné porovnání serializovaných konfigurací všech200oprav potvrdilo pouze
33schválených změn `moves` a aktualizaci textu limitu finále29 na25.
Cíle, ID, pořadí, kryty, rezonátory, zásoby a ukládání zůstávají stejné.

Ověření Android větve:265unit testů, produkční build,5Chromium scénářů
slepého testu (reload, pevné pořadí, izolace běžných savů, rating/prohra,
dokončení200) a sestavení debug APK prošly. Dva historické katalogové
hashe v testech aktualizovány po kontrole, že ostatní konfigurace jsou shodné.
Nová simulace úspěšnosti se neprováděla; uživatel výslovně zvolil nasadit
první sadu a ověřit ji hraním. Závěry o nové lidské úspěšnosti teprve vzniknou.

Nový oddělený průchod:
https://game.playbeyondthesignal.com/playtest.html?run=moves-v2-20261023
Starý odkaz a již rozehrané průchody ponechávají své uložené konfigurace.
Publikace a kontrola skutečně nasazené verze následují.

## Produkční nasazení ověřeno

Webový zdroj `44df8c18f897079ec048e5d2c6c21e0e05dc8608`, Android `e725265`.
Živé verze: hlavní web `1792773988569-44df8c18f897`, hra
`1792773988470-44df8c18f897`. Herní workflow39989506323 skončilo success.
Hlavní39989505713 má publikováno, při poslední kontrole ještě instalovalo
prohlížeč pro CI; nezávislá místní kontrola živé hlavní domény prošla.

Živý nový slepý průchod: všech200limitů odpovídá novému katalogu a pravidla
jsou moves-v2. Izolovaný starý uložený průchod zachoval všech200původních
limitů. V obou vykreslena deska a správný počet tahů,0JS chyb.
Živé EN/CS Undo nadále po reklamě jen připraví kredit a dalším klepnutím
vrací tah. Obě domény root/index prošly, žádné chybějící místní zdroje;
hlavní doména zůstala webem. Tyto kontroly blokovaly analytické zápisy.
Webový Chromium slepý test5/5, unit262/262. APK49554132B sestaveno
23.10.2026 18:44; pro telefon je nutná aktualizace přes Android Studio Run.
