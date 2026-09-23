# Speciální kameny — implementace 2026-09-23

Uživatel schválil zavedení boosterů a další přitvrzení. Následující pravidla
nahrazují původní návrh níže:

- 4 v řadě nebo T/L: Pulse charge, exploze 3 × 3.
- 5 a více v řadě: Nova cross, celý řádek a sloupec.
- Jedno propojené spojení vytvoří jednu nálož. Přednost má cílové políčko
  přesunu, pak výchozí; kaskády používají deterministické pořadí.
- Nálož se nepřesouvá ani nespojuje jako barva, aktivuje se klepnutím za tah.
  Zasažené nálože spustí řetěz bez dalších tahů. Každé pole se započte jednou
  v rámci stejné exploze. Díry se zachovají, Nova zasáhne i část za dírou.
- Kryt praskne, kámen zůstane; další kaskáda jej již může běžně sebrat.
- Kámen přeměněný na nálož se při vytvoření nepočítá do barevného cíle.
  Samotné nálože se nepočítají do sběru kamenů, jejich zásahy ano.
- Výhra i vyčerpání tahů čekají na dokončení celé reakce. Dostupná nálož
  brání zbytečné obnově desky bez tahu. Retry vytvoří čistou desku.
- Kokpit bez náloží; ostatní úkoly včetně finále s náložemi. Návod je
  v úvodní bublině i minihře, nezávisle na pořadí návštěv místností.
- Implementace src/boosters.js, testy tests/boosters.test.js.
  Nové vyvážení zatím pouze ubikace, viz docs/crew-balance.md.

## Archiv původního návrhu

# Speciální kameny — návrh 2026-09-19

Návrh k odsouhlasení, zatím není implementovaný. Týká se miniher
v místnostech za koridorem, samotná chodba zůstane rozcestím.

## První jednoduchá varianta

- Čtyři stejné v rovné řadě vytvoří jeden Pulse charge (pulzní nálož).
- Nálož vznikne na cílovém poli tahu; při kaskádě na jednoznačně určeném
  poli spojení. Vytvoření samo nálož neodpálí.
- Klepnutí na nálož spotřebuje jeden tah a zasáhne okolí 3 × 3 včetně středu.
- Běžné kameny v dosahu se seberou a počítají podle cíle levelu.
- Zasaženému krytému kameni pouze praskne kryt; kámen zůstane.
  Jde o výslovně vysvětlenou výjimku vůči běžnému spojení stejného typu.
- Další zasažené nálože explodují v řetězci bez dalších tahů. Každé pole
  se v jedné explozi/řetězci vyhodnotí jednou, aby kryt i kámen nezmizely
  týmž řetězcem. Celá reakce doběhne před vyhodnocením posledního tahu.
- Nepravidelné okraje a díry zůstanou zachované.
- Nejprve pouze tento jeden typ. Pět v řadě, T/L kombinace a kombinace
  dvou boosterů navrhnout později. Pro první verzi delší přímá řada také
  vytvoří jednu nálož, ne několik překrývajících se odměn.

## Naučení a vyvážení

Kokpit ponechat bez speciálních kamenů. První vstup do kterékoli místnosti
za koridorem ukáže krátkou nápovědu; hráč si pořadí místností volí sám.
Zavedení nesmí být závislé pouze na návštěvě ubikací. Nálože jsou odměnou
za spojení, ne placený inventář. Po implementaci znovu simulovat obtížnost,
zejména třetí opravy s kryty a finále. Hledání platného tahu musí počítat
s možností odpálit nálož, aby se deska zbytečně neobnovovala.

## Následující etapy dle uživatele

1. Dokončit aktuální herní úpravy a rozhodnout pravidla náloží.
2. Přidat ukládání výsledků pro příští spuštění a přihlašování; navázat
   na preferovanou Supabase. Oddělit uložené opravy, přečtený deník,
   energii/čas obnovy a verzi uložených dat. Konkrétní přihlášení vybrat
   podle webu/Telegramu; Telegram ověřovat na backendu.
3. Až potom další levely a kapitoly.

2026-09-23: Vizuální efekty boosterů: Pulse má rozpínající se kruhy, jiskry a rozsvícení zasažených polí; Nova výboj přes řádek/sloupec. Každá nálož v řetězci má vlastní efekt. SVG vrstva neblokuje dotyk, animace trvá 620 ms před doplněním desky; reduced-motion bez prodlevy a pohybu. Herní pravidla a limity beze změn.
