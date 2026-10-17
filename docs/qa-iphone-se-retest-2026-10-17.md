# iPhone SE — opakovaný úplný průchod, 2026-10-17

Nový podklad: `C:\Users\preto\Downloads\full-iPhone-SE-maly-telefon-en- (1).zip`.
Srovnání: původní `full-iPhone-SE-maly-telefon-en-.zip`.
Zpracován celý JSON a přehledově všech 205 PNG; samostatně zvětšen první
nález rezonátoru a závěrečná obrazovka. Profil EN, viewport 320 × 568.

## Výsledek

| Ukazatel | Původní běh | Nový běh |
| --- | ---: | ---: |
| Dokončené různé levely | 49 | 187 |
| Ukončení | limit testu 5,5 hodiny | záznam „konec hry“ |
| Nejdelší zaznamenaný level | 27 min 10,7 s | 45,7 s |
| Součet zaznamenaných časů vyhraných levelů | 5 h 14 min 46,2 s | 40 min 16,6 s |

Součty nejsou celková doba běhu: JSON nemá endedAt a nemusí započítávat
navigaci nebo všechny přechody. Nejde ani o měření čisté doby enginu.
Nový běh nemá poznámky o timeoutech, konzolové záznamy, JS chyby ani
neúspěšné síťové požadavky. Všechny levely mají stalls=0; samotný tento
čítač není důkaz výkonu, protože byl nulový i v původním pomalém běhu.

Původní výrazné prodlužování akcí se v novém úplném průchodu neopakovalo.
Medián doby levelu je přibližně 12 s. Mediány skupin 1–20 / 21–49 /
50–100 / 101–150 / 151–187 jsou 7,0 / 8,7 / 9,9 / 14,9 / 15,1 s.
Pozdější levely mají jiné cíle, počty tahů a pokračování; z těchto hodnot
nelze vyvozovat rostoucí prodlevu jednotlivého tahu.

Bot používá pomůcky a reklamní pokračování. U tří levelů potřeboval druhý
pokus: 156 Recover the debris tracks, 165 Balance the boarding pressure,
176 Decode the identity warning. Celkem 190 pokusů na 187 dokončených
levelů. Výsledek nepotvrzuje 100% úspěšnost běžného člověka a není důvodem
pro další změnu obtížnosti.

## Zbývající oprava

Jediný deduplikovaný vizuální nález: `button.resonator-help-button` má
dotykový cíl 30 × 20 CSS px. Opakuje se na 36 snímcích; nejde o 36 různých
chyb. První důkaz: `119-deska-wake-the-signal-resonator.png`.

Zdroj potvrzuje příčinu v `src/compactGame.css`: základní rozměr 30 × 26,
v kompaktním režimu výška 20. Zvětšit skutečnou klikací plochu alespoň nad
auditovaný práh 24 px, ideálně blíže 44 px, při zachování místa pro cíle a
desku. Ověřit level se čtyřmi cíli na 320 × 568 i běžném telefonu, otevření
nápovědy a absenci překryvu s počítadlem. V tomto kroku se kód neměnil.

Report nehlásí malé buňky desky, oříznutí ani překryté ovládání. Přehledová
kontrola snímků neukázala další zjevnou vadu tohoto typu. Nejde o nový
úplný audit kontrastu, čteček obrazovky nebo všech možných dialogů.

## Omezení důkazů a další postup

Profil se jmenuje iPhone SE, ale JSON nemá identitu/verzi prohlížeče,
engine, renderer, commit hry ani bota. Nelze tvrdit, že jde o fyzický iPhone
nebo prokázaný Safari/WebKit. Nový běh proto uzavírá reprodukci původního
zpomalování pro tento test, nikoli všechny příčiny na všech iOS zařízeních.

Závěrečné PNG 203 a 204 ukazují dokončený návratový koridor kapitoly 08,
nikoli samotnou závěrečnou příběhovou animaci. Dokončení 187 různých levelů
potvrzuje JSON; značka „konec hry“ pochází z rozhodnutí bota o navigaci.

Ponechat výkonové opravy. Doplnit opravu dotykového cíle rezonátoru a
ověřit ji cíleně; SE kvůli samotnému zpomalování nyní není nutné znovu
opakovat beze změny podmínek. Při dalších plných bězích zaznamenat engine
a build. Krátké dlouhé úlohy z perf-2.zip zůstávají samostatným otevřeným
nálezem — tento report neobsahuje Performance trace ani FPS.
