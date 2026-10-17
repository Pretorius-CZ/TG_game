# Návrh zkušebního změkčení pozdních levelů — 2026-10-17

Stav: původní návrh níže; na následný výslovný pokyn uživatele
implementována kombinovaná varianta C a připravená k nasazení.
Zadání: promyslet doporučení z testu obtížnosti, následně provést a pushnout.

## Implementace

- Všechny limity v tabulce zapojené přímo do dat levelů:19změn.
  Levely156a159 i všechny limity mimo uvedený seznam zachované.
- Kryty138nově[9,12,37,40],149a154nově[9,14,49,54].
  Barevné cíle, rezonátory, geometrie desek, ID a ukládání zachované.
- Nové pokusy se zapisují s verzí pravidel
  `2026-10-17-refuge-balance-v1`; historické záznamy se nepřepisují.
- Zkontrolována shoda všech187ID/pořadí a limitů s původním reportem
  kromě19schválených změn;300výchozích desek změněných úkolů mělo
  platný tah a žádnou úvodní kombinaci. Nový úplný balance test provede uživatel.
- Test katalogu má aktualizovaný snapshot pro schválené limity;
  změna nebyla považována za nechtěný zásah do dřívějších kapitol.

## Podklad

Přečten celý `C:/Users/preto/Downloads/balanc-1.zip`:
balance.json/CSV/souhrn,187levelů,200her na profil a level.
Čísla, ID a limity všech187levelů odpovídají současnému levelCatalog.
Nejsou dostupné zdroje tohoto simulátoru ani průběhy jednotlivých her.
Starší skripty v projektu nepředstavují tentýž model běžného hráče.
Živá data skutečných hráčů z balance.html tímto rozborem ověřena nejsou.

| Levely | Průměr výher běžného profilu | Zkušený profil | Průměr stuck |
|---|---:|---:|---:|
|1–100|80,3 %|93,2 %|1,4 %|
|101–120|66,0 %|87,0 %|2,6 %|
|121–140|57,7 %|80,5 %|4,9 %|
|141–160|51,7 %|77,4 %|8,2 %|
|161–187|62,6 %|82,6 %|4,1 %|

Propad začíná už po100, nikoli až141. Úsek141–160 je ale rozumná první
priorita. Procenta popisují heuristické profily, nikoli změřenou lidskou
úspěšnost. S200pokusy je nejistota míry kolem50 % přibližně±7procentních
bodů; jednotlivá těsná pořadí nepřeceňovat. Řada špatných levelů je
silnější signál než rozdíl44vs48 % na dvou úkolech.

## Dvě korekce výkladu

1. `stuck` není samo o sobě důkaz neřešitelné desky ani zamrznutí hry.
   Report tak označuje nedohrání při delším testu; bez kódu neznáme
   přesnou hranici a důvod zastavení. Hra má ensurePlayableBoard pro
   stav bez platného tahu. Ten však nezaručuje snadný postup k cíli.
   Nový test má oddělit vyčerpání limitu, technickou chybu, obnovu desky
   a dlouhé setrvání bez pokroku; zapisovat chybějící barvy/kryty/nabití.
2. Přesný seznam17levelů s casual.stuck>10 % je:
   **53,67,120,125,134,138,144,148,149,150,153,154,155,158,164,174,177**.
   Zkratka148–155 nesprávně zahrnuje151a152 (stuck4 % a3 %).
   Levely139a165 mají přesně10 % a do této sedmnáctky nepatří.

## Konkrétní první varianta

Nezvyšovat každý level141–160 stejně. Část už má slušnou míru výher;
zejména156a159 ponechat. Největší navýšení pro první pokus omezit
na8tahů. Limity48–56ze simulace nejsou návrh k přímému nasazení.

| Level | Nyní | Kandidát | Poznámka |
|---:|---:|---:|---|
|138|29|35|Dále varianta krytů6→4: odstranit krajní0a14, ponechat9,12,37,40. Rezonátor3 zatím zachovat.|
|141|25|29| |
|142|27|32| |
|143|28|34| |
|144|30|38|Sledovat chybějící nabití kruhu.|
|145|34|40| |
|146|27|33| |
|147|28|31| |
|148|30|38|4kryty, kruh3, cíle30energie+24semen; zatím bez zásahu do těchto cílů.|
|149|29|37|Dále varianta krytů6→4: ponechat9,14,49,54.|
|150|34|40| |
|151|28|31|Bez strukturálního zásahu podle dosavadních dat.|
|152|29|34|Bez strukturálního zásahu podle dosavadních dat.|
|153|31|39|4kryty, kruh3; zatím bez změny kruhu a barevných cílů.|
|154|30|36|Prioritně porovnat také variantu krytů6→4, ponechat9,14,49,54.|
|155|35|41|HARD nevyrovnávat automaticky na obtížnost běžného levelu.|
|156|24|24|Ponechat.|
|157|28|33| |
|158|30|38| |
|159|27|27|Ponechat.|
|160|31|37| |

**154:** nemá rezonátor. Deska8×8/6typů, šest krytů
[9,14,25,30,49,54], cíle30semen a27chladicích náplní.
Současná data:38 % běžný profil,27 % stuck; medián dokončení35tahů,
75.percentil chybí. Kandidát4krytů ponechá oba barevné cíle i identitu
úkolu. Není zatím prokázáno, že právě kryty způsobují selhávání.
Pokud v novém testu zbývají především barvy, teprve potom porovnat
alternativu24+24, nesnižovat vše zároveň bez odděleného měření.

## Jak porovnat varianty

- A: pouze nové limity. B: pouze uvedené změny krytů138/149/154.
  C: kombinace. Stejné seedy a stejný model tahu mezi variantami;
  každý pokus má samostatný RNG pro výběr tahů a padání kamenů.
- První screening200pokusů na profil; finální kandidát alespoň500,
  pokud výpočetní náklady dovolí. Hlásit obě strategie a jejich definici,
  žádné předstírání lidské kalibrace nebo očekávaného nového win-rate.
- Nejen výhry: délka výher, co zůstává při prohře, regenerace desky,
  skutečné chyby. Nepřidávat tahy tam, kde se bez postupu jen prodlouží hra.
- Zachovat lehké36,37,42,43,63,71. Zbývající obtížné levely zaregistrovat
  do další dávky; zejména167a187 mají také nízké míry výher.
- Pro lidské porovnání v balance.html zvolit Hráči, oddělit testery,
  stejné verze konfigurace, čisté a asistované pokusy; uvést počty pokusů
  i nezávislých hráčských zařízení. Bez těchto dat jde o hypotézu simulace.

Při budoucí implementaci změnit identifikaci pravidel v záznamu pokusu:
MiniGame nyní zapisuje konstantu2026-10-06-fair-refill-v4. Staré a nové
limity nesmí být vyhodnocované jako tatáž sada pravidel. Konfigurace
pokusu již ukládá desku, cíle, kryty a základní limit. Zachovat ID levelů
a uložený postup; při změně barevných cílů odvozovat i text objective.
