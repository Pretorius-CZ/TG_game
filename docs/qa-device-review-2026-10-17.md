# Společný rozbor zařízení — 2026-10-17

**Aktualizace po podrobném rozboru:** všech devět ZIPů včetně staršího
Pixelu/CZ je zpracovaných, všech 1367 snímků prošlo přehledovou vizuální
kontrolou na 60 kontaktních listech a vybrané případy zvětšením.
Konečný seznam 16 položek, důkazy, priority a podmínky ověření jsou v
[qa-fix-backlog-2026-10-17.md](qa-fix-backlog-2026-10-17.md).
Níže jsou zachované původní poznámky z příjmu dávek; tehdejší omezení
rozsahu vizuální kontroly již nahrazuje tento dokončený rozbor.

Stav: obě dávky připravené a sloučené. Zatím bez oprav hry,
změn obtížnosti nebo úprav botů. Cílem je sloučit nálezy podle příčiny,
nikoli opravovat každé zařízení odděleně.

## Dávka 1

ZIPy dodané z Downloads, všechny v EN; běhy začaly 2026-10-16 kolem
23:31 UTC (2026-10-17 kolem 01:31 v Praze). Jde o novější běhy než původní
souhrn a dříve analyzovaný Pixel7/CZ; jejich výsledky se nesmějí zaměnit.

| ZIP / zařízení | CSS viewport | Výhry | Screenshoty | Konzole / JS / HTTP chyby |
|---|---|---:|---:|---|
| full-Galaxy-S9-Android-en-.zip / Galaxy S9+ | 320×658 | 187 | 215 | žádné zaznamenané |
| full-Notebook-1366x768-en-.zip / notebook | 1366×768 | 187 | 203 | žádné zaznamenané |
| full-Desktop-Firefox-en-.zip / Firefox | 1440×900 | 187 | 207 | žádné zaznamenané |
| full-Desktop-1920x1080-en-.zip / desktop | 1920×1080 | 187 | 208 | žádné zaznamenané |

Celkem 4 JSON reporty, 833 screenshotů v původních archivech, 748 výher.
Všechny čtyři průchody rozpoznaly konec hry. Výhry zahrnují pomůcky,
testovací reklamní odměny a případné retry; nejsou měřením lidské obtížnosti.
Všechny reporty mají analytics=true.

Připravené pracovní podklady mimo zdrojový repozitář:
`C:/Users/preto/.codex/visualizations/2026/10/16/01a14548-408c-7f41-a4d0-21c89b0de166/qa-batch-1/`.
Obsahují index.json, pro každé zařízení celý report.json, seznam všech
položek ZIPu a vybrané screenshoty první desky a závěru. Ostatní obrazy
zůstávají dostupné v původních ZIPech; nejsou všechny vizuálně prohlédnuté.

## Společný registr nálezů

| ID | Nález | Zařízení / zdroj | Stav a další ověření |
|---|---|---|---|
| UI-01 | Po konci průchodu dvě hlášení zakrytého tlačítka, název prázdný; zakrývá section.game.expedition návratového koridoru | Notebook, Firefox, desktop | Jedna společná skupina. Desktop screenshot skutečně ukazuje historický návratový koridor po rozpoznání konce, trasa bota končí Visit the previous area. Samotný návrat není chyba. Určit konkrétní tlačítka a jejich hit testing; screenshot sám příčinu nepotvrzuje. |
| UI-02 | Po konci dvě hlášení zakrytého tlačítka prvkem span.rating-stars, 3 of 3 stars | Galaxy S9+ | Kandidát na falešný nález auditu: může jít o potomka tlačítka. Nutné ověřit konkrétní DOM a pravidlo auditu použité verze botů. |
| UI-03 | Využití displeje a velikost desek | Uživatelská zpětná vazba; celá sada zařízení | Absence automatických vizuálních nálezů na deskách není potvrzení optimální velikosti. Po druhé dávce porovnat shodné levely, rozměry desek, delší EN/CZ titulky a cíle. |
| UI-04 | Telefon na šířku, malé kameny, případná výzva k otočení | Původní souhrn; reporty teprve čekají | Bez implementace; vyhodnotit druhou dávku. |
| BOT-01 | Pixel7/CZ po výhře168 skončil v otevřeném deníku | Starší samostatně dodaný ZIP | Ověřit zavření deníku a level169, blokace hry zatím neprokázaná. Tuto EN dávku problém nezastavil. |
| DATA-01 | HTTP400 na record_balance_attempt | Starší Pixel7/CZ report | Chybí tělo odpovědi, příčina neurčená. Nové čtyři reporty mají prázdné console/pageErrors/failedRequests; to samo nepotvrzuje opravu původní příčiny. |

## Co již bylo přečteno

Kompletní strukturované reporty: souhrny výsledků, koncové trasy, nálezy,
konzole, pageErrors, failedRequests, inventář screenshotů. Vizuálně první
deska Galaxy a závěr desktopu1920×1080. Úplná vizuální kontrola všech
833 screenshotů neproběhla a není nutná před seskupením druhé dávky.

## Dávka 2

Stejná časová skupina běhů 2026-10-16 23:31 UTC, všechny EN.

| ZIP / zařízení | CSS viewport | Výhry | Screenshoty | Ukončení |
|---|---|---:|---:|---|
| full-iPhone-SE-maly-telefon-en-.zip | 320×568 | 49 | 54 | Celkový timeout testu19800000ms |
| full-iPhone-15-Pro-Max-en-.zip | 430×739 | 43 | 46 | Stejný celkový timeout |
| full-Telefon-na-sirku-en-.zip | 863×360 | 187 | 211 | Rozpoznaný konec hry |
| full-iPad-Mini-en-.zip | 768×1024 | 34 | 40 | Stejný celkový timeout |

V této dávce také žádné zaznamenané console/pageErrors/failedRequests.
Celkově obě dávky: **8reportů, 1184screenshotů, 1061zaznamenaných výher**.
Pět průchodů dokončilo všech187, tři skončily na časovém limitu. Starší
Pixel7/CZ je samostatný devátý podklad, do těchto součtů nezahrnutý.

Pracovní adresář vedle první dávky: `qa-batch-2/` ve stejné vizualizační
složce. Stejná struktura: index.json, úplné report.json, inventáře ZIPů,
vybrané první/poslední/problemové screenshoty. Původní ZIPy zachované.

### Sloučené nálezy a priority

1. **UI-03, priorita vysoká: velikost desky na malém portrétu.**
   iPhoneSE uvádí21×21 nebo22×22CSSpx, 692opakování varování
   v317deduplikovaných záznamech. Varování byla na13snímcích desek.
   Screenshot `08-deska-what-lies-ahead.png` potvrzuje, že dlouhý nadpis,
   HUD a cíle spotřebují velkou část výšky a deska nevyužije šířku dialogu.
   Nejde o692nezávislých chyb. Velké displeje vyžadují také vizuální
   posouzení; čistý automatický audit nepotvrzuje dobré využití prostoru.
2. **UI-04, priorita vysoká: šířka telefonu.**
   Bot dohrál187, ale všechny187snímky desek mají varování. Kameny mají
   podle různých konfigurací9–14CSSpx, první level13×14px. Celkem9774
   výskytů malých cílů v1571záznamech. Závěrečná scéna má i navigaci13×13
   a audio9×9px. První screenshot vizuálně potvrzuje extrémně malou desku
   proti obrovskému HUD a cílům. Zvážit výzvu k otočení na telefonech;
   neaplikovat mechanicky na desktopové široké okno. Zatím neimplementované.
3. **RUN-01, priorita vysoká: postupné zpomalování / čekání v iOS profilech.**
   Všechny tři skončily `page.evaluate: Test timeout of 19800000ms exceeded`
   (5,5h), nikoli JavaScriptovou výjimkou hry. Poznámky20levelů SE,
   12levelů ProMax a12levelů iPadu uvádějí selhání kliků/pomůcek po3s.
   Vykázané délky pozdějších levelů často rostou na desítky minut; iPad má
   u `A message beneath the loop` asi76,7min. Jsou to časy testu, nikoli
   důkaz čistého výpočetního času hry. Oddělit pomalé evaluate/klikání,
   čekání na overlay/animaci a přetížení běhového prostředí. Nepřičítat
   problém konkrétně levelům50/44/35: poslední screenshoty již ukazují
   další otevřenou minihru (Close the circle / A borrowed heartbeat /
   Bring it home). Potřebný krátký izolovaný běh se záznamem trvání akcí
   a počtem souběžných workerů, ideálně Playwright trace. Z dodaných ZIPů
   není konkrétní příčina prokázaná.
4. **UI-01 doplněno:** stejný překryv dvěma výskyty na konci má i telefon
   na šířku. Sdílený problém či audit, nikoli samostatná chyba zařízení.
5. **UI-02:** Galaxy rating-stars stále jen kandidát na falešný nález.
6. **BOT-01 / DATA-01:** starší Pixel/CZ zůstává zvlášť, nová EN sada
   nepotvrzuje jeho původní problém ani jeho odstranění.

Přístroje jsou názvy automatizovaných profilů. Lokální config volí WebKit
jen s FULL_BROWSERS=1; obsah ZIPu sám neuvádí přesnou verzi engine ani
konfiguraci vzdáleného běhu. Není to důkaz testování na fyzických iPhonech.
Lokální botí zdroje se navíc liší od logů (jiné timeouty a report formát),
proto je nelze bez kontroly považovat za přesný zdroj těchto běhů.

### Rozsah vizuální kontroly druhé dávky

Prohlédnuté: první deska telefonu na šířku, iPhoneSE What lies ahead,
iPad poslední deska Bring it home. U ostatních snímků je zatím inventář
a strukturované nálezy. Všechny1184screenshoty nebyly ručně zkontrolované.

## Následuje

Obě dávky převzaté; další ZIPy pro toto kolo nejsou potřeba. Nejprve
ověřit RUN-01 krátkým izolovaným testem a UI-01/02 proti skutečným prvkům.
Pro velikost zvolit reprezentativní desky6×7,7×7,7×8,8×8, delší nadpis,
více cílů a rezonátory na320×568,430×739,768×1024,1366×768,1920×1080
a863×360; EN/CZ, ne jen jeden úvodní level. Potom společné opravy UI
a cílené opakování dotčených případů. Plné187levelové průchody až na závěr.
