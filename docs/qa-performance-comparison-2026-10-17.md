# Výkon po opravách — perf-2 proti perf-1

Vyhodnocen nový report ze17.10.2026 v18:12. Přečteno všech12JSON
a souhrn, všech66snímků přehledově na třech kontaktních listech.
Porovnání a náhledy v `.local/perf-2-review/`.
Tento krok nemění herní kód, obtížnost ani neprovádí push.

## Výsledek

Nový běh podporuje účinnost opravy přednačítání a renderování minihry.
Všech šest průchodů dokončilo prvních10levelů výhrou, bez zaznamenané
JS chyby. V náhledech není nová zjevná chyba rozvržení. Nejde o test
všech187levelů ani dlouhého iOS/WebKit průchodu.

| Profil | FPS1× před→po | FPS4× před→po | Nejhorších10 %1× před→po | Nejhorších10 %4× před→po |
|---|---:|---:|---:|---:|
|GalaxyS9+|60→60|59→59|57→59|54→55|
|Notebook1366×768|26→49|27→47|24→45|24→42|
|Pixel7|44→58|46→55|39→54|39→45|

Notebook přibližně+88%/74%FPS, Pixel+32%/20%; Galaxy si drží původní
vysoký medián. Zlepšuje se i spodní část rozdělení, nejen medián.
Je to srovnání botích profilů; serverový renderer nenahrazuje fyzický telefon.

## Načtení

Ve všech šesti měřeních4,61→0,50MB (přibližně−89,2%) a25→9požadavků.
Mezi největšími soubory už nejsou budoucí opravené místnosti: signal.webp
194kB, client188kB, game102kB, CSS23kB. To odpovídá cíli odstranit
16nepotřebných scén z úvodu, nikoli přenést jejich náklady do prvního obrázku.

| Profil | PLAY1× před→po | PLAY4× před→po | LCP1× před→po | LCP4× před→po |
|---|---:|---:|---:|---:|
|GalaxyS9+|406→551ms|2457→2513ms|380→488ms|2384→2476ms|
|Notebook|408→491ms|2346→2561ms|388→448ms|18652→2476ms|
|Pixel7|625→502ms|2460→2630ms|600→464ms|2396→2552ms|

Úspora přenesených dat je výrazná. Běžné časy prvního zobrazení se však
nezlepšily jednotně; při zpomalení CPU/sítě jsou PLAY i běžné LCP mírně
vyšší. Nelze tvrdit, že se každý start zrychlil o89%. Lokální předchozí
A/B měření mělo jiné podmínky a není náhradou tohoto produkčního běhu.
Původních18,652s notebooku se neopakovalo; samotný jeden nový vzorek
nedokládá definitivní objasnění původního odlehlého výsledku.

## Zbývající krátké záseky

| Profil/CPU | Úlohy nad50ms před→po | Nad200ms před→po | Maximum před→po |
|---|---:|---:|---:|
|Galaxy1×|21→27|0→2|123→238ms|
|Galaxy4×|32→38|0→3|159→285ms|
|Notebook1×|1→3|0→0|59→90ms|
|Notebook4×|14→35|0→1|155→375ms|
|Pixel1×|0→22|0→0|0→89ms|
|Pixel4×|17→52|0→1|149→227ms|

Počty vzrostly ve všech profilech: součet85→177, z toho nad200ms0→7.
To je nový bod ke sledování, nesmí být přehlédnutý kvůli lepším FPS.
Plynulé vykreslování a občasná dlouhá JS úloha mohou nastat zároveň.

Chybí časové značky, level/akce, stacky a délka měřicího okna/počet tahů.
Odlišné zbytky tahů na výhrách ukazují rozdílné hrané pokusy; samotný
počet10levelů tedy neznamená stejný objem práce. Není možné určit,
kolik úloh připadá na jeden tah, nebo příčinu připsat kaskádám, GC,
ukládání, změně scény či činnosti bota bez dalšího důkazu.

Další cílené měření: značky úloh s levelem/akcí a trace pro notebook4×
a Galaxy1×/4×. Oddělit běžný tah, nálož, odměnu/uložení, změnu scény
a screenshot/solver. Srovnat alespoň tři opakování stejné sekvence,
počty na tah a p95/p99 trvání akce. Teprve potom konkrétní optimalizace;
nevracet blur a neoslabovat herní mechaniky podle agregovaného maxima.

## Paměť a průkaznost verze

Heap po první výhře6,2–6,3MB, na konci6,9–7,0MB; trend0,07–0,08MB/level
je podobný původnímu běhu. Listenery kolísají, start375–379 a konec371–380.
DOM301→418 je změna mezi různými deskami a cíli; po7.levele367uzlů,
po8.jen326. Nejde o prokázaný leak ani potvrzení jeho nepřítomnosti.
Pravidlo souhrnu „nad1MB/level znamená leak“ nadále není důkazem.

Report stále nemá explicitní verzi hry, commit bota, přesné síťové hodnoty,
identitu browseru/rendereru ani Performance trace. Soubor CSS
game-itVhoX1f.css odpovídá místnímu výslednému buildu a9požadavků místo25
odpovídá nasazené opravě. Jsou to podpůrné znaky, ne úplná provenance
všech šesti herních běhů. FPS z headless serveru nelze prezentovat jako
naměřené FPS skutečného Galaxy/Pixelu.

## Další postup

Ponechat nasazené optimalizace. Pro oddělené dlouhodobé iOS zpomalování
zopakovat původní úplný WebKit průchod, nejprve jeden profil samostatně.
Perf-2 tento problém netestuje: obsahuje jen prvních10levelů a žádný
iPhone/iPad profil. Výše uvedené krátké záseky řešit cílenou trace,
nikoli dalším neurčitým plným testem nebo změnou obtížnosti.
