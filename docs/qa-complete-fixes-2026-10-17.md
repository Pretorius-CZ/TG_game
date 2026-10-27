# Společné opravy po QA reportech — 2026-10-17

Navazuje na registr zařízení, chaos-2, oba balance reporty, cestina-1,
a11y-1 a perf-1. Nové opravy jsou místní; tento krok neprovádí push
ani nasazení. SQL migrace není potřeba.

## Zapracované změny

| Oblast | Výsledek |
|---|---|
| Velikost miniher a otočení | Předchozí nasazené opravy G01–G06 zachované: adaptivní deska, čitelné výsledky, použitelné ovládání a modální výzva na telefonu na šířku. |
| Horní ovládání pozdních kapitol | Nově reprodukovaný překryv: při1280×720 a čtyřech navigačních ovladačích energie zakrývala příběhový úkol. Šířka prostoru HUD se nyní počítá podle navigace i energie/audio, nezávisle na zmenšení ilustrace. |
| Nápověda a pomůcky | Přístupný název vychází z viditelného názvu a skutečného počítadla1/1,1,REKL./AD nebo0. Instrukce jsou oddělené v přístupném popisu. Název není prázdný a nehlásí0 při dostupné reklamě. České reklamní badge pomůcek sjednocené s nápovědou. |
| Hvězdy a hotspoty | Hodnocení má roli jedné pojmenované grafiky, vnitřní SVG jsou dekorativní. Hotspoty čtou skutečný název opravy a hodnocení; dekorativní symboly mají aria-hidden. Navigační konzole a odlet nepřepisují viditelný text jiným názvem. |
| Nastavení | Close má explicitní kontrastní vzhled a44px výšku. Otevření zaměří nadpis, Escape i zavření vracejí fokus na Settings. Nadpisy místností skryté kvůli prostoru zůstávají dostupné čtečce. |
| Potvrzení odchodu | Fokus začíná na Keep playing, Tab zůstává mezi oběma akcemi, Escape vrací do hry. Návrat fokusu funguje i ve WebKitu, kde samotný klik nemusí zaměřit tlačítko. |
| Úvod | Ilustrace se označuje jako připravená po dekódování; má vysokou prioritu načtení, viditelný stav chyby a skutečný retry. Bot může čekat na data-art-ready, nikoli odhadovaných400ms. |
| Scény a přednačítání | Odstraněné společné načítání16budoucích obrazů při úvodu. Kokpit a sdílené místnosti vykreslují aktuální stav; potřebné vrstvy exteriéru se načítají společně. Nejbližší budoucí stav se může předehřát po připravení aktuálního; save-data jej vypíná. Jeho chyba neblokuje aktuální scénu. |
| Přepočet scény | Přepočet nemění zoom na1 a zpět při každém měření. Styly zapisuje jen při změně; sleduje také rozměry obou skupin HUD. |
| Plynulost | Drahý celoplošný blur za minihrou nahrazen statickým tmavým překrytím. Rozměry desky a její efekty zůstávají zachované. |
| Energie | Dříve nasazená rezervace při prvním platném tahu zůstává, včetně refundu výhry/chyby a jediného odečtu při refreshi/odchodu/prohře. Nová sada znovu ověřuje stejné případy. |
| Analytika | Doplněn regresní test HTTP400 → zachovaná fronta → úspěšný retry stejného ID/revize; diagnostika neobsahuje token reportéra. Žádná spekulativní změna živého SQL. |
| Boti | Auditor místní předávací sady upřednostní skutečnou výzvu k otočení před deskou pod ní; pořadí DOM není pořadí nativní top layer. Předchozí opravy navigace/timeoutů/důkazů zachované. |

Obtížnost zůstává na poslední odsouhlasené kombinované sadě
`2026-10-17-refuge-balance-v1`. Balance-2 nepotvrdil potřebu plošného
dalšího zlehčení. Varianty149/154 v porovnání nejsou automaticky další
navýšení tahů nebo souběžné snížení všech cílů. Czech-1 neměl další
potvrzené textové chyby; nový nález REKL. vznikl při rozšíření stavů.

## Reprodukce výkonu

Na stejném lokálním Chromiu/SwiftShaderu,1366×768, skutečná první
minihra nad lodní scénou, běžné animace, bez screenshotů a výpočtu tahů:
výchozí starý blur přibližně33,3ms/snímek, po vypnutí16,7ms,
po opětovném zapnutí33,3ms. To vysvětluje lokálně reprodukovaný
limit přibližně30FPS a odpovídá charakteru notebookového reportu.
Nejde o měření fyzického telefonu ani důkaz totožného rendereru
na původním GitHub runneru.

V závěrečném A/B běhu stejného testu Chromium naměřilo50ms se starým
efektem,16,7ms bez něj a50ms po návratu efektu. WebKit přibližně40ms
ve všech variantách: odstranění blur není tvrzením o vyřešení všech
omezení tohoto runneru ani všech původních iOS timeoutů.

Regresní diagnostika ukládá identitu rendereru, surové časy snímků,
verzi browseru a Chromium Performance trace. A/B test umí původní5px
blur výslovně zapnout; produkční výchozí hodnota je none. Příprava,
solver a screenshoty nejsou součástí měřeného intervalu.

## Kontroly

Nové browser kontroly jsou v `tests/browser/`:

- EN/CZ, desktop/SE: příslušná pravidla axe nad deskou, nápovědou,
  dostupnou/vyčerpanou reklamou, pomůckami, návodem, potvrzením odchodu,
  výhrou a nastavením; klávesnice a návrat fokusu.
- Studený úvod bez budoucích scén, dekódovaná ilustrace, chyba obrázku
  a retry; selhání budoucího obrázku neblokuje současnou místnost.
- Obrazový přechod0→1 všech sedmi oblastí první kapitoly, včetně
  nezávislých vrstev exteriéru. Dokončení v tomto testu využívá dev preview,
  jde o ověření scén a postupu, nikoli nové měření obtížnosti.
-168→169 EN/CZ po otevření konkrétního zápisu, návratu do seznamu
  a zavření deníku; skutečné kliknutí na příběhový úkol bez force.
-50opakovaných otevření, skutečných vítězných tahů a zavření minihry;
  srovnávají se stejné ustálené obrazovky. Chromium navíc vzorkuje heap,
  DOM a listenery po GC, WebKit počet prvků a animací.
- Pět studených načtení s URL/elementem LCP a resource timingy,
  stabilizace rozměrů scény a výše uvedená renderovací diagnostika.

Každý běh ukládá `run-environment.json` se zdrojovou revizí a seznamem
změněných sledovaných souborů, Node/platformou, enginy a workers.
Paměťová, načítací a renderovací data se ukládají jako JSON do výstupů
testů; Linux CI je přikládá jako artefakt.

### Výsledek konečného ověření

- `npm test`:196/196.
- `npm run build`: úspěch.
- `npx playwright test --project=chromium --project=webkit`:104/104,
 52kontrol pro každý engine,4,8minuty. Nové automatické a11y kontroly
  nemají nález v ověřovaných pravidlech/stavech.
- Při50cyklech Chromium: stejná zavřená obrazovka má21prvků,
 52DOM uzlů a334listenerů ve vzorcích5/25/50; po zavření0animací.
 Heap po GC13,08→13,65MB mezi5.a50.cyklem. Jde o vývojový build
  a uložené výsledky postupně přibývají; není to přímé srovnání s6MB
  původního produkčního reportu ani záruka nulové retence.
- WebKit:21prvků a0animací po zavření ve všech třech vzorcích.
 Heap/GC neposkytuje použitý CDP protokol; hodnoty nejsou vydávané za0.
- Ručně zkontrolované nové screenshoty reklamního stavu naSE EN/CZ
  a opraveného exteriéru. Základní rozměry, výsledky, energie a rotace
  mají zároveň původní cílené regrese.

Firefox má připravený stejný Linux workflow; nová sada na místním
Windows Firefoxu neběžela kvůli již dříve doloženému problému se spuštěním
binárky. Předchozí zelené CI není vydáváno za ověření těchto nových změn.

### Pět studených načtení před/po

Sestaven původní commit6182768 a upravený produkční build, obě varianty
ze stejného lokálního statického serveru bez gzip, nový browser context
pro každý vzorek,1366×768, CPU4×,50mslatence,750000B/s v obou směrech.
Externí služby stubované. Resource timing nezahrnuje HTML dokument.

| Metrika | Před | Po |
|---|---:|---:|
|Přenesené prostředky při úvodu|5549985B|1243701B|
|Požadavky|25|9|
|Požadavky na budoucí scény|16|0|
|Medián připravené ilustrace|3807ms|2336ms|
|Medián LCP|3588ms|2296ms|

Ve stejném měření tedy přibližně77,6%úspora dat a38,6%kratší čas
připravené ilustrace. Procenta nejsou zárukou stejného zrychlení na
produkčním CDN nebo každém telefonu; původních4,61MB bylo naměřeno
jiným serverem. LCP všech deseti vzorků ukazuje na welcome-art/signal.webp.
Odlehlých18,652s se zde neopakovalo, původní příčina zůstává nedoložená.

Surová data a srovnávací skript jsou v `.local/perf-review/load-comparison.json`
a `.local/qa-load-compare.mjs`; původní sestavení v `.local/perf-baseline-source`.
Aktualizovaná místní předávací sada botů:
`C:/Users/preto/.codex/visualizations/2026/10/16/01a14548-408c-7f41-a4d0-21c89b0de166/qa-bot-update-2026-10-17-v2.zip`.

## Co musí potvrdit nový úplný běh

Původní5,5h iOS zastavení nemá přiloženou trace ani fyzické zařízení.
Krátké WebKit průchody a opakované cykly ověřují opravené chování,
nenahrazují187levelů na všech zařízeních. Totéž platí pro odlehlý
LCP18,652s: další měření musí určit konkrétní element a podmínky.

Příčina historických HTTP400 z Pixel/CZ zůstává bez původní serverové
odpovědi neznámá; nyní je dostupná diagnostika a ověřený retry.
Čtečka obrazovky a fyzické Safari nejsou tímto automatickým auditem
prohlášeny za kompletně ověřené. Neupravujeme obtížnost kvůli chybě
testovacího runneru ani neoznačujeme zbylé simulované prohry za softlock.

Nasazení: uživatel následně zadal push. Commit9c75024f46d6 publikovaný,
Pages39047111015 success, živá verze1792252501390-9c75024f46d6 ověřená.
Nové Browser layout checks39047110990 při předání ještě běží; nejde
zatím o potvrzení nového Firefox CI. Tento odstavec nahrazuje stav
pouze místních oprav z úvodu dokumentu.
