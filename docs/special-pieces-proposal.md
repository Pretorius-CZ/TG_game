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
