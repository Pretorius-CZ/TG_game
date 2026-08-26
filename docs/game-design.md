# Herní design dokument (GDD)

> Sem se zapisují výstupy z teoretických/design diskuzí (ať už proběhnou
> v tomhle chatu, nebo jinde). Cíl: kdykoliv otevřu novou session, mám tu
> celý aktuální stav rozhodnutí — nemusím nic dolovat ze staré konverzace.
>
> **Aktuální fokus:** kapitola 1 (oprava rakety). Kapitola 2 má zatím jen
> narativní zárodek (viz sekce 3), detaily se řeší až později.

## 1. Elevator pitch

Sci-fi meta-progresní hra pro Telegram: hráč začíná u ztroskotané rakety na
cizí planetě a pomocí match-3 miniher ji postupně opravuje — místnost po
místnosti, od pláště po komunikační vysílač. Za odehrané levely se získávají
**Kredity**, kterými se rovnou platí konkrétní součásti v dané místnosti;
poslední součást každé místnosti ale nejde koupit — musí se **vyhrát**
v těžším, povinném "boss levelu". Po opravě rakety hráč pokračuje
budováním vesmírné stanice jako základny pro cestu za tajemným signálem,
který se odhalí na konci kapitoly 1 (kapitola 2, mimo MVP). Hra kombinuje
jednoduchou, přímou match-3 ekonomiku (žádný obchod, žádné suroviny) s
vizuální meta-progresí (raketa se hráči doslova "staví před očima",
místnost po místnosti) — ověřený vzorec ve stylu Homescapes/Gardenscapes,
aplikovaný na sci-fi/space téma, s holografickým/blueprint vizuálním
stylem (viz sekce 6).

## 2. Cílová skupina a platforma

- Platforma: Telegram Mini App
- Cílovka: casual hráči match-3 her, kteří chtějí krátké herní seance
  (jednotky minut) víckrát denně — typicky širší demografie, ne jen
  "hardcore" gameři
- Distribuce: silně závislá na Telegram sociálních kanálech (sdílení do
  chatů/skupin, referral) — viz sekce 10
- **Rozhodnuto — dlouhodobá poznámka k architektuře:** hra by od začátku
  měla mít jádro (herní logika, stav, UI) oddělené od Telegram-specifické
  vrstvy (Web App SDK, Stars platby, Telegram auth) tenkým adaptérem, aby
  případný budoucí port na Google Play/App Store (přes Capacitor nebo
  podobný WebView wrapper) nevyžadoval přepis hry — jen výměnu adaptéru.
  Detaily viz `architecture.md`. Nemění to nic na designu teď, jen na tom,
  jak se to structuruje technicky.

## 3. Příběh a narativní rámec

**Rozhodnuto:** Hráč je pilot/průzkumník na misi (přesná povaha mise —
TODO, např. sledování starého nouzového signálu, průzkum neprobádaného
systému), jehož loď havaruje na neznámé planetě. Motivace opravit raketu
není jen "chci pryč" — palubní AI/systémy lodi se s opravou **každé
místnosti** částečně "probouzí" a průběžně odhalují útržky příběhu
(levný, ale účinný způsob narativní odměny bez animací — text/dialog
navázaný na dokončení každé místnosti, případně i na jednotlivé boss
levely jako silnější narativní beat).

**Denní transport a Komunikace:** od prvního dne funguje slabý "základní
maják" — zdrojem denní výzvy (transportní rakety, viz 5.6) i bez opravené
komunikace. Až se opraví místnost **Komunikace** (poslední místnost, viz
5.5), maják se vylepší — silnější/spolehlivější denní transport a zároveň
se přes něj naplno odhalí signál (viz níže). Komunikace tak má dvojí
funkci: narativní vyvrcholení i mechanický upgrade existující smyčky, ne
novou mechaniku odnikud.

**Vyvrcholení kapitoly 1:** po opravě poslední místnosti (Komunikace,
včetně jejího boss levelu) se senzory/AI naplno aktivují a odhalí
**neznámý signál** odjinud z vesmíru. Místo prostého odletu domů se hráč
(spolu s AI) rozhodne signál prozkoumat.

**Zárodek kapitoly 2 (detaily zatím neřešíme):** cílem kapitoly 2 je
dostat se blíž k signálu — vesmírná stanice, kterou hráč staví (případně
navazující na volitelná vylepšení místností, viz 5.9, např. hibernační
kapsle pro dlouhý let), slouží jako základna/odpalovací bod pro tuhle
cestu, ne jako samoúčelný cíl.

- **TODO:** přesná povaha mise, kvůli které hráč na planetě byl
- **TODO:** kdo/co je AI lodi (jméno, osobnost, tón dialogů)
- **TODO:** detaily kapitoly 2 — řešit až po dokončení návrhu kapitoly 1

## 4. Core loop

1. Hráč jde do sekce **Hrát** a odehraje match-3 level → normální level
   dá **Kredity**, v množství podle výkonu (viz 5.3); boss level (viz 5.8)
   při výhře odemkne poslední položku aktuální místnosti + bonus Kredity
2. Na hlavní obrazovce **Raketa** (room hub) hráč vidí aktuální místnost a
   utrácí Kredity na opravu jejích položek (4 normální + 1 boss, viz 5.5)
   — nákup normální položky je okamžitý a zdarma na energii
3. Poslední položku místnosti (boss) nejde koupit za Kredity — musí se
   nejdřív vyhrát boss level (viz 5.8); je to podmínka dokončení místnosti,
   ne alternativa k normálnímu hraní
4. Po dokončení všech 5 položek se místnost odemkne jako **hotová** —
   vizuální i narativní odměna (viz 3), a odemkne se **další místnost v
   pořadí** (viz 5.5 — postup je lineární, místnost od místnosti)
5. Volitelně: dokončenou místnost lze později **vylepšit** (viz 5.9) —
   čistě volitelný sink, ne podmínka postupu dál
6. Energie dojde → hráč čeká na doplnění, sleduje denní výzvu, nebo
   dobije energii za reklamu/Stars (viz 5.2)
7. V daný čas dne: denní výzva ("transportní raketa") — zdarma balíček
   Kreditů, motivace vrátit se v konkrétní čas; po opravě Komunikace
   silnější (viz 3, 5.6)
8. Opakuje se, dokud není opravena poslední místnost (Komunikace) — **teprve
   pak se odemyká kapitola 2** (žádný postup dál bez kompletní opravy
   všech 12 místností)

Kroky 1 a 2 jsou dvě samostatné, nezávislé obrazovky — viz sekce 6 pro
detailní UX rozpad (levely nejsou tematicky vázané na konkrétní
opravovanou položku).

## 5. Herní mechaniky

### 5.1 Match-3 jádro

**Rozhodnuto:** klasický swap match-3 (styl Candy Crush — prohazování
sousedních políček).

**Zdůvodnění:** pro webový/Telegram Mini App vývoj existuje víc hotových
open-source/HTML5 knihoven a referenčních implementací pro swap mechaniku
než pro tap/blast styl (Toon Blast), balancing desky je předvídatelnější a
hráči mechanismus dobře znají — bez učicí křivky. Swap se navíc dobře
parametrizuje pro procedurální generaci (viz sekce 8). Tap/blast zůstává
možnost pro pozdější odlišení (např. jako varianta v kapitole 2).

### 5.2 Energie (životy)

**Rozhodnuto:**

- Max **5 životů**.
- Doplňování časem: cca **30 minut/život** (návrh, doladit podle
  playtestů), plné doplnění z nuly ≈ 2,5 hodiny.
- Doplnění dřív, dvě cesty (žádná nová měna, jen alternativní přístup k
  téže věci):
  - **Odměněná reklama** → okamžitě +1 život, s denním limitem (např.
    3–5×), ať to nevede k nekonečnému sledování reklam.
  - **Telegram Stars** → okamžité doplnění všech životů za reálné peníze,
    pro hráče, kteří nechtějí čekat ani sledovat reklamy. Žádná
    samostatná "prémiová měna" (diamanty apod.) — Stars tuhle roli plní
    přímo.
- Energie se váže **výhradně na hraní levelů** (obrazovka Hrát, normální
  i boss levely stejně) — samotná oprava položky za Kredity (obrazovka
  Raketa) je okamžitá a zdarma, energii nespotřebovává.

- **TODO:** přesný denní limit reklam, cena Stars za okamžité doplnění

### 5.3 Fail state, hodnocení výkonu a cílová obtížnost

- Levely mají omezený počet tahů. Dojdou tahy bez splnění cíle = level
  neúspěšný, spotřebuje se 1 život, level lze zopakovat.
- Odměna v Kreditech se odstupňuje podle výkonu — čím víc tahů zbyde při
  splnění cíle, tím víc Kreditů (obdoba "hvězdičkového" hodnocení z
  klasických match-3 her, jen napojená přímo na měnu místo na hvězdičky).
  I těsné dokončení dá aspoň základní odměnu, ať to nepůsobí trestajícím
  dojmem.

**Rozhodnuto — cílový rámec obtížnosti** (startovní odhad k doladění po
playtestech, ne finální čísla — přesně se to bez reálných dat nastavit
nedá):

| Typ levelu | Cílová úspěšnost na 1. pokus |
|---|---|
| Tutoriál (viz 7) | ~95–100 % — téměř nejde prohrát |
| Normální level (4 kupované položky místnosti) | ~60 % — výchozí hodnota v ladicí tabulce (viz 7.1); záměrně sníženo z původních 70 %, ať se energie skutečně spotřebovává |
| Volitelný Hard level (viz 8) | o něco níž než normální, s vyšší odměnou — přesné číslo TODO |
| **Boss level** (poslední položka místnosti, viz 5.8) | **~30–35 %** — výrazně těžší, povinná výzva |

- **TODO:** přesné prahy hvězdičkového hodnocení (kolik zbývajících
  tahů = jaký bonus Kreditů)
- **TODO:** rozhodnout, jestli je v MVP i nabídka "pokračovat za pár
  tahů navíc" (za reklamu/nákup) při neúspěchu — u boss levelů zvlášť
  citlivé rozhodnutí, protože by mohlo oslabit smysl gate mechaniky

### 5.4 Ekonomika: Kredity + Mince

**Rozhodnuto:** jednovrstvá ekonomika, žádný obchod, žádné suroviny —
platí pro **celou hru**, ne jen kapitolu 1. Dvě oddělené měny s jasně
odlišenou rolí:

- **Kredity** — hlavní progresní měna. Match-3 level (obrazovka Hrát) dá
  Kredity, v množství podle výkonu (viz 5.3) — obecný výdělek, nezávislý
  na tom, kterou položku hráč zrovna opravuje. Kredity se utrácí přímo v
  **Raketě** za konkrétní položku (levná/drahá varianta, viz 5.5) —
  žádný mezikrok přes obchod nebo suroviny.
- **Mince** — samostatná měna výhradně pro **boostery** uvnitř match-3
  levelu (extra tahy, speciální políčka na začátek, apod.). Nemá vliv na
  postup v opravě rakety, je to čistě volitelná pomoc při hraní. **Detaily
  zatím nenavržené** — viz TODO níže.

**Zdůvodnění:** dřívější dvouvrstvý model (mince → obchod s pevnou
nabídkou → suroviny → oprava) přidával krok navíc bez jasné herní hodnoty
— hráč beztak nakupoval "všechno postupně", takže obchod byl v praxi jen
extra klikání. Přímé Kredity zjednodušují smyčku (odehraj → oprav) a
zároveň jasně oddělují progresní měnu (Kredity) od volitelné herní pomoci
(Mince), takže se dvě různé motivace nepletou do jedné měny.

- **TODO:** ekonomika Mincí — jak se získávají (drop z levelů? denní
  výzva? Stars?), ceny jednotlivých boosterů, od jaké fáze hry se
  odemykají (orientačně kolem ~10. levelu, k potvrzení)
- **Otevřené k rozhodnutí:** bonus Kredity za výhru boss levelu (viz 5.8)
  je kandidát na částečné financování Mincí místo čistě informativní
  odměny — zatím nerozhodnuto, viz `docs/ekonomika-mistnosti.xlsx`

### 5.5 Oprava rakety — místnosti (meta-progrese kapitoly 1)

**Rozhodnuto:** oprava je strukturovaná jako průchod **12 místnostmi v
pevném pořadí** (room-by-room, ve stylu Homescapes/Gardenscapes) —
nahrazuje dřívější model 5 volně vybíraných součástí. Hráč vidí a
opravuje aktuální místnost; další místnost se odemkne až po kompletním
dokončení té předchozí. V rámci jedné místnosti je pořadí 4 normálních
položek volné, poslední (5.) položka je vždy povinný **boss level** (viz
5.8).

**Pořadí místností (12, potvrzeno):**

| # | Místnost | Fáze |
|---|---|---|
| 1 | Plášť *(obal, okna, dveře, přetlaková komora — první, "objevovací" místnost)* | Survival |
| 2 | Ubikace | Survival |
| 3 | Koupelny | Survival |
| 4 | Jídelna a kuchyň | Survival |
| 5 | Ošetřovna | Survival |
| 6 | Kokpit | Funkčnost |
| 7 | Navigace | Funkčnost |
| 8 | Nákladový prostor | Funkčnost |
| 9 | Strojovna | Funkčnost |
| 10 | Sklad paliva | Funkčnost |
| 11 | Serverovna / jádro AI | Vrchol |
| 12 | Komunikace *(poslední — odemyká vylepšený maják a odhaluje signál, viz 3)* | Vrchol |

Fáze (Survival → Funkčnost → Vrchol) jsou narativní/tempová seskupení,
ne herní mechanika samotná — používají se pro barevné odlišení v
ladicí tabulce (viz 7.1) a pro postupné zvyšování cen/obtížnosti.

**60 položek celkem** (12 místností × 5 položek = 48 normálních + 12
boss). Konkrétní jména položek za jednotlivé místnosti (5 na místnost, 4
normální + 1 boss) jsou spočítaná a uložená v
[`docs/ekonomika-mistnosti.xlsx`](./ekonomika-mistnosti.xlsx) (list
Položky) — tabulka je od teď **autoritativní zdroj** pro jména a přesné
ceny položek, v GDD se drží jen struktura a principy.

**Levná/drahá varianta:** každá **normální** položka má dvě varianty
opravy — levnou (základní vzhled) a drahou (vizuálně odlišná, dražší).
Drahá varianta = levná × konfigurovatelný násobič (výchozí **1,6**, viz
tabulka). Čistě kosmetická volba, nemá vliv na postup. Boss položky
variantu nemají (nejdou koupit vůbec, viz 5.8).

**Důležitá poznámka k číslům:** "orientační počet levelů/pokusů" v
tabulce je odhad, kolikrát si hráč v průměru zahraje (normální i boss
level), aby na danou položku vydělal/vyhrál — ekonomický/tuning odhad,
ne konkrétní přiřazené levely. Levely samotné nejsou tematicky vázané na
konkrétní položku — viz sekce 6.

### 5.6 Denní výzva — "transportní raketa"

- V pevně daný čas dne se objeví časově omezená událost s balíčkem
  Kreditů zdarma.
- Od začátku hry funguje přes **základní maják** (slabší verze); po
  opravě místnosti Komunikace se vylepší (viz 3) — přesný rozdíl
  (větší balíček? kratší interval? i Mince?) — **TODO**.
- **TODO:** globální pevný čas (např. 18:00 UTC) vs. čas odvozený od
  časového pásma hráče?
- **TODO:** co se stane při zmeškání — propadá se, nebo je možné dohnat?
- Technická poznámka: Telegram bot může poslat notifikaci přímo do chatu
  jako připomínku — netřeba spoléhat na OS push.

### 5.7 Odměněná reklama

- Sledování reklamy → odměna (Kredity, nebo +1 život — viz 5.2).
- **TODO:** frekvenční limit (kolikrát denně lze reklamu takhle použít
  na Kredity, odděleně od limitu na životy)

### 5.8 Boss levely (povinná brána)

**Rozhodnuto:** poslední položka **každé** z 12 místností (12 boss
položek celkem) se **nedá koupit za Kredity vůbec** — jedinou cestou k
jejímu získání je vyhrát dedikovaný, výrazně těžší level (viz 5.3, ~30–35
% úspěšnost). Tohle je **striktní, neobejitelná podmínka** dokončení
místnosti — explicitně NENÍ možné ji obejít grindem normálních (lehčích)
levelů, ať už jich hráč odehraje jakkoli mnoho. Boss level tedy funguje
jako skutečná brána, ne jako drahá alternativa.

- Výhra boss levelu přímo odemyká danou boss položku (místnost je tím
  hotová, pokud jsou hotové i zbylé 4 normální položky) **a** k tomu dá
  **bonusovou odměnu Kreditů** navíc (výchozí násobič **2×** průměrné
  odměny za normální level, viz tabulka) — tenhle bonus se zatím počítá
  jako informativní "kapesné", **neodečítá se** z ceny/tempa kapitoly 1.
  Je kandidát na budoucí financování Mincí (viz 5.4).
- Boss levely jsou mechanicky odlišené od volitelných Hard levelů (viz
  8) — Hard levely jsou nepovinná odbočka pro lepší odměnu, boss levely
  jsou povinná brána na konci každé místnosti.

**Zdůvodnění:** čistě cenová/energetická ekonomika (jak fungovala do
teď) dávala hráči teoretickou možnost "prostě si to odehrát/vydělat", což
oslabovalo pocit výzvy u vrcholu každé místnosti. Boss level přidává
druhý typ friction (dovednost/štěstí u těžšího levelu), nezávislý na
tom, kolik má hráč Kreditů — a dělá z konce každé místnosti skutečný,
zapamatovatelný beat, ne jen další nákup.

- **TODO:** finální hodnoty win rate (výchozí 35 %) a bonus násobiče
  (výchozí 2×) — čekají na doladění v `docs/ekonomika-mistnosti.xlsx`
- **TODO:** rozhodnout, zda a jak boss level souvisí s narativním beatem
  dané místnosti (viz 3) — silnější dialog/odhalení při výhře?

### 5.9 Vylepšení místností (volitelný post-completion sink)

**Rozhodnuto — explicitní součást MVP** (ne odloženo na později): po
kompletním dokončení místnosti (všech 5 položek včetně boss) se hráč
může k místnosti kdykoliv vrátit a **volitelně ji vylepšit** — např.
hibernační kapsle v Ubikacích pro budoucí dlouhý let. Čistě volitelné,
nepodmiňuje postup do další místnosti ani do kapitoly 2.

**Účel:**

1. **Retention buffer** — dává hráči co dělat i po dokončení viditelné
   části obsahu, aniž by se musel zvyšovat počet povinných položek.
2. **Narativní most ke kapitole 2** — vylepšení místností (zejména
   Ubikace/hibernace) připravují loď na cestu za signálem, takže
   navazují přímo na zárodek kapitoly 2 (viz 3) a případně nahrazují/
   sjednocují s dřívější myšlenkou "budovat vesmírnou stanici".

- **TODO:** konkrétní seznam vylepšení (které místnosti, kolik úrovní
  vylepšení, za jakou měnu — Kredity, nebo nová sink měna?)
- **TODO:** vizuální odlišení vylepšené místnosti v hubu

## 6. UI/UX a struktura obrazovek

**Rozhodnuto — orientace:** na výšku (portrait). Telegram Mini Apps se
prakticky vždy hrají na výšku (otevírají se jako sheet uvnitř Telegram
appky, hraje se jednou rukou mezi chatováním) a je to i genre standard
(Candy Crush, Homescapes, Toon Blast). Tvar rakety (vysoká, úzká) navíc
portrétu přirozeně sedí — jde ukázat celou od trysek po špičku.

**Rozhodnuto — vizuální styl:** holografické schéma/blueprint — svítící
linky na tmavém pozadí, statické, "komixové" podání (bez animace,
narativní beaty jako komixové bubliny). Poškození = praskliny/přerušené
obvody/červené varovné symboly; oprava = plynule svítící čisté linky.
Levnější a konzistentnější na produkci než malovaná ilustrace nebo
animace (jeden vektorový styl, "poškození" jako přidané/odebrané vrstvy
nad základní kresbou, ne kompletně nové obrázky pro každý stav).

**Rozhodnuto — dvě nezávislé obrazovky** (Obchod jako samostatná
obrazovka je **zrušen** — viz 5.4, revize ekonomiky):

1. **Raketa (room hub)** — izometrický/průřezový holografický pohled na
   raketu, teď strukturovaný podle **aktuální místnosti** (viz 5.5), ne
   podle volně vybíraných součástí. Tapnutím na položku se otevře
   **karta s cenou** (levná/drahá varianta, tlačítko "Opravit" — aktivní
   jen při dostatku Kreditů), boss položka místo ceny ukazuje odkaz na
   boss level. **Žádná minihra se odsud nespouští přímo** — nákup je
   okamžitý a zdarma, boss položka odkazuje na Hrát. Po opravě všech
   položek se aktualizuje i celkový pohled na raketu (dvojitá vizuální
   odměna — detail i celek), dokončené místnosti jsou dostupné zpětně
   pro volitelné vylepšení (viz 5.9).
2. **Hrát** — persistentní záložka/tlačítko vedoucí na **cestu levelů**,
   vizuálně nezávislou na raketě (např. "cesta troskami/okolím
   havárie" s očíslovanými zastávkami). Kosmic prostředí v pozadí se
   mění podle **pozice na cestě** (časná zastávka = trosky/kráter,
   pozdější = hlouběji v troskách lodi) — **ne podle toho, co hráč zrovna
   opravuje** (taková vazba by naznačovala, že levely jsou tematické,
   což neplatí, viz 5.4). Normální levely, volitelné Hard levely a
   povinné boss levely (viz 5.8) jsou na téže cestě, boss levely vizuálně
   odlišené. Levely jsou opakovaně hratelné — po dohrání cesty do konce
   lze tapnout na libovolný starší level a zahrát si ho znovu pro další
   Kredity (viz sekce 8).

**Tok hráče:** vidím aktuální místnost → chci ji dokončit → jdu
**vydělávat** (Hrát) → vrátím se na **Raketu** a opravím (instantní
akce) → u poslední položky jdu **porazit boss level** (Hrát) → místnost
hotová → odemkne se další.

- **TODO:** zvážit rychlou zkratku z karty položky na Raketě přímo do
  Hrát (např. tlačítko "Chybí Kredity → jít vydělat", nebo přímo "Hrát
  boss level" u poslední položky)
- **TODO:** kdo/co bude grafiku vyrábět (AI generování, freelancer,
  hotové assety) — ovlivní tempo produkce, ne design samotný

## 7. Obsah a tempo kapitoly 1

**Rozhodnuto — cílové tempo:** cca **1–2 týdny** běžné, neplacené,
přiměřeně aktivní hraní na kompletní opravu rakety (celá kapitola 1,
všech 12 místností). Tohle je hlavní tuning cíl, podle kterého se
nastavují ceny položek a výdělek Kreditů — ne počet levelů.

**Klíčový princip:** velikost obsahové knihovny (kolik unikátních levelů
existuje) **není totéž** co délka hry. Levely jsou opakovaně hratelné.
Skutečné tempo řídí čtyři páky dohromady (poslední dvě nově, po zavedení
boss levelů):

1. **Energie** (5 životů, ~30 min/život) — fyzický limit, kolik levelů
   lze odehrát za hodinu/den bez reklam/Stars
2. **Ceny položek** vs. **průměrný výdělek Kreditů za normální level**
3. **Úspěšnost normálních levelů** (výchozí 60 %) — kolik energie se
   reálně "spotřebuje" i na neúspěšné pokusy
4. **Povinné boss levely** (výchozí ~35% úspěšnost, 12 celkem) — přidávají
   samostatný, neobejitelný blok pokusů navíc na konci každé místnosti

### 7.1 Konkrétní čísla — ceny položek a výsledné tempo

**Rozhodnuto:** aktuální pracovní čísla pro cenu všech 48 normálních
položek a mechaniku 12 boss levelů jsou spočítaná a uložená jako živá
ladicí tabulka: [`docs/ekonomika-mistnosti.xlsx`](./ekonomika-mistnosti.xlsx).
Tenhle soubor je **autoritativní zdroj přesných čísel** (ceny, win rate,
výsledné tempo) — v GDD držíme jen shrnutí a principy.

**Shrnutí aktuálního výchozího nastavení (list Ekonomika v tabulce):**

| Vstup | Výchozí hodnota |
|---|---|
| Průměr Kreditů za vyhraný normální level | 15 |
| Úspěšnost normálního levelu | 60 % |
| Úspěšnost boss levelu | 35 % |
| Bonus násobič odměny za výhru boss levelu | 2,0× (informativní, nezapočítáno do tempa) |
| Násobič drahé varianty | 1,6× |
| Pokusů o level / den | 8 |

**Výsledek:** cena 48 normálních položek celkem = **550 Kreditů** → ~61
pokusů na normální levely (při 60% win rate) + ~34 očekávaných pokusů na
12 boss levelů (při 35% win rate) = **~95,4 pokusů celkem → ~11,9 dne →
~1,7 týdne** při 8 pokusech/den. Padá do cíleného rozmezí 1–2 týdny —
tabulka to vyhodnocuje jako "V CÍLI".

Rozpad podle místností (list Místnosti v tabulce) — cena 4 normálních
položek roste s fází, od 28 Kreditů (Ubikace) po 80 Kreditů (Komunikace);
každá místnost má navíc svůj povinný boss level.

### 7.2 Otevřené riziko — subjektivní vnímání délky hry

Dřívější model (15 podsoučástí, 5 součástí) měl u autora designu
subjektivní pocit krátké hry i přes matematicky "V CÍLI" tempo. Přechod
na 12 místností / 60 položek (výrazně jemnější dělení) a zavedení
povinných boss levelů tenhle pocit částečně řeší tím, že postup je vidět
po menších, četnějších krocích a na konci každé místnosti je
zapamatovatelná výzva navíc — ale **bez skutečného playtestu se to
nedá spolehlivě potvrdit jen na papíře**, riziko zůstává otevřené.

- **TODO:** zahrát referenční hry (Homescapes, Toon Blast a podobné) a
  porovnat subjektivní pocit délky/tempa s tímhle modelem
- **TODO:** po prvním hratelném prototypu ověřit, jestli 12
  místností/60 položek + boss levely řeší pocit tempa, nebo jestli je
  potřeba dál upravovat ceny/win rate (7.1) nebo strukturu (8)

## 8. Generování levelů a obtížnost

**Rozhodnuto:** levely se negenerují ručně jeden po druhém do
nekonečna — použije se **generátor s křivkou obtížnosti**, parametrizovaný
podle pozice na cestě (viz sekce 6). Tohle škáluje bez problémů i na
stovky levelů a na budoucí kapitoly, bez lineárního nárůstu práce.

**Rozdělení:**

- **Prvních ~10–15 levelů** (tutoriál + začátek první místnosti) —
  **ručně navržené a doladěné**. Kvalita první zkušenosti je kritická,
  generátor by mohl náhodou vyprodukovat něco nezáživného nebo
  frustrujícího hned na startu.
- **Vše za tím** — **generované** podle křivky obtížnosti, včetně boss
  levelů (těžší preset, viz níže).

**Parametry generátoru** (rostou postupně s pozicí na cestě):

- Velikost/tvar herní desky
- Počet barev/typů políček (víc typů = těžší)
- Počet tahů vůči cíli (přísnější limit = těžší)
- Překážky (blokovaná políčka, "led", vícevrstvé kameny...) — přidávají
  se postupně, ne od začátku
- Typ cíle (posbírej N políček, vyčisti překážky, dosáhni skóre...) —
  střídání typů drží levely rozmanité

**Dva odlišné typy těžších levelů (neplést dohromady):**

- **"Hard" levely** — stejný generátor, tvrdší preset (víc typů políček,
  přísnější limit tahů), **násobič odměny v Kreditech** (~1,5–2×).
  Nabízené jako explicitní **volitelná** odbočka na cestě levelů — pro
  hráče, co chtějí risknout těžší výzvu za lepší výdělek. Nesouvisí s
  žádnou konkrétní položkou.
- **Boss levely** (viz 5.8) — samostatný, ještě tvrdší preset (cíl ~30–35%
  win rate, výrazně přísnější než Hard), **povinné** pro dokončení
  poslední položky každé místnosti, ne volitelná odbočka. Odemyká se
  automaticky po dokončení zbylých 4 normálních položek dané místnosti.

**Technická poznámka pro `architecture.md`:** generátor musí mít
kontrolu řešitelnosti — vygenerovaná deska musí mít zaručeně aspoň jeden
platný tah a jít dohrát, jinak riskujeme "mrtvé" levely. Běžný,
zdokumentovaný problém u match-3 generátorů, řešit až při implementaci.
Týká se i boss levelů — i "nefér těžký" level musí být teoreticky
dohratelný, jinak jde o čistě frustrující bránu, ne o výzvu.

- **TODO:** přesná tabulka/vzorec křivky obtížnosti (jaké parametry se
  mění na jaké pozici, včetně boss presetu)
- **TODO:** frekvence/umístění Hard levelů na cestě
- **TODO:** stejný přístup (ruční start + generátor, boss preset) potvrdit
  i pro budoucí kapitoly

## 9. Monetizace

- Primárně: **Kredity nakupitelné za Telegram Stars** — přímé
  mikrotransakce, balíčky Kreditů různé velikosti. Platí jen pro
  **normální** položky — boss položky nejdou koupit ani za Kredity
  získané tímhle způsobem, takže monetizace neobchází povinnou bránu
  (viz 5.8), jen zrychluje nákup normálních položek.
- **Telegram Stars také přímo za okamžité doplnění životů** (viz 5.2) —
  alternativa ke sledování reklamy, ne nová měna.
- **Mince (boostery)** — samostatný, zatím nenavržený monetizační/
  free-to-play kanál, viz 5.4 TODO.
- Sekundárně: odměněné reklamy (viz 5.7) jako free-to-play cesta ke
  Kreditům/životům.
- **TODO:** směnný kurz Stars → Kredity a velikosti balíčků
- **TODO:** ekonomika Mincí (viz 5.4) — zdroj, ceny, Stars kanál
- **TODO:** kosmetika / skip timerů za Stars zvážit pro post-MVP

## 10. Sociální/virální prvky *(mimo MVP, ale architektura by s tím měla počítat)*

Telegram je silný virální kanál (viz např. Hamster Kombat) — sdílení do
chatů/skupin a referral fungují nativně bez app store friction. Kandidáti
pro post-MVP:

- Pozvání přátel → bonus Kreditů
- Darování Kreditů/Mincí příteli
- Žebříček mezi přáteli (kdo má víc opravenou raketu)

## 11. MVP scope

**Rozhodnuto:** MVP obsahuje pouze kapitolu 1 (oprava rakety, cílové
tempo ~1–2 týdny, viz sekce 7), se strukturou **12 místností v pevném
pořadí** (60 položek: 48 normálních + 12 povinných boss, viz 5.5),
jednovrstvou ekonomikou **Kredity** (přímý nákup normálních položek,
žádný obchod, žádné suroviny) + samostatnou, zatím nenavrženou boosterovou
měnou **Mince** (viz 5.4), a **povinnou boss-level bránou** na konci
každé místnosti (viz 5.8). Volitelná **vylepšení dokončených místností**
(viz 5.9) jsou explicitní součást MVP jako retention buffer a narativní
most ke kapitole 2. UI: dvě nezávislé obrazovky (Raketa/Hrát, viz 6) —
Obchod jako samostatná obrazovka odpadá. Levelový obsah: ~10–15 ručně
navržených + generátor pro zbytek, včetně boss presetu (viz sekce 8) —
nepotřebujeme ručně navrhovat desítky/stovky levelů předem. Kapitola 1
musí být kompletně dokončená (všech 12 místností), než se odemkne
kapitola 2 — ta je zatím jen narativní zárodek (viz 3), detaily se řeší
až později.

Rotující/omezená nabídka a tematické levely vázané na konkrétní položku
jsou mimo MVP — kandidáti na pozdější retention/strategickou hloubku.

Sociální/virální vrstva (sekce 10) je mimo MVP, ale technická
architektura (datový model uživatele, friend/referral hooks) by s ní
měla počítat dopředu, ať se nepřidává narychlo. Stejně tak platformní
portabilita (viz sekce 1, 2) — jádro hry odděleně od Telegram adaptéru —
je architektonické rozhodnutí pro MVP, i když samotný port není součástí
MVP scope.

## 12. Otevřené otázky

- Ekonomika Mincí (boosterová měna) — zdroj, ceny, kdy se odemyká (5.4, 9)
- Finální hodnoty win rate boss levelu (35 %) a bonus násobiče (2×) —
  potvrdit po dalším ladění v `docs/ekonomika-mistnosti.xlsx` (5.8, 7.1)
- Má bonus Kreditů z boss levelů částečně financovat Mince, nebo zůstat
  čistě informativní odměna? (5.4, 5.8)
- Subjektivní pocit délky hry — nový model (60 položek, boss levely)
  pravděpodobně pomáhá, ale bez playtestu nepotvrzeno (7.2)
- Konkrétní seznam a ceny vylepšení místností (5.9)
- Souvislost boss levelu s narativním beatem dané místnosti — silnější
  dialog při výhře? (5.8)
- Přesné prahy hvězdičkového hodnocení výkonu → Kredity (5.3)
- Přesný denní limit reklam (na Kredity i na životy zvlášť), cena Stars
  za okamžité doplnění životů (5.2, 5.7)
- Globální vs. lokální čas denní výzvy, řešení zmeškání, přesný rozdíl
  mezi základním majákem a vylepšeným po Komunikaci (5.6)
- Rychlá zkratka z karty položky do Hrát (6)
- Kdo/co bude vyrábět grafiku (6)
- Přesná tabulka/vzorec křivky obtížnosti, frekvence Hard levelů, přesný
  boss preset (8)
- Směnný kurz Stars → Kredity, velikosti balíčků (9)
- Přesná povaha mise hráče, osobnost AI lodi (3)
- Detaily kapitoly 2 (budování stanice, cesta za signálem) — odloženo,
  řešíme až po dokončení kapitoly 1

## 13. Změny a historie

- 2026-08-24: založen skeleton dokumentu
- 2026-08-24: doplněn core loop, rozhodnutí o match-3 typu (swap),
  energii, fail state a MVP scope (jen kapitola 1 — oprava rakety);
  přidány sociální/virální nápady jako post-MVP backlog
- 2026-08-24: nelineární oprava rakety, 4 druhy surovin (hliník,
  deuterium, elektronika, šrot), obecný mix dropu pro MVP, návrh 5
  součástí rakety s jednou zamčenou finální součástí
- 2026-08-24: revize — 4 suroviny dočasně nahrazeny jednotnou herní
  měnou (Mince)
- 2026-08-24: finální revize ekonomiky (v2) — dvouvrstvý model mince →
  obchod (pevná nabídka) → suroviny → oprava podle receptu; odměna v
  mincích odstupňovaná podle výkonu (zbývající tahy)
- 2026-08-24: přidán narativní rámec (havárie, AI lodi, odhalení signálu
  jako vyvrcholení kapitoly 1, zárodek kapitoly 2 = cesta za signálem,
  stanice jako prostředek k cíli); mapa levelů kapitoly 1 (~30 levelů:
  tutoriál → volný výběr 4 součástí → zamčené finále → narativní
  přechod); cílový rámec obtížnosti (95–100 % / 70–80 % / 50–60 %);
  finalizace ekonomiky životů (5 životů, ~30 min/život, reklama nebo
  Stars pro rychlejší doplnění — bez nové "prémiové" měny)
- 2026-08-24: **UI/UX a obsah** — orientace na výšku, holografický
  blueprint styl, rozdělení na 3 nezávislé obrazovky (Raketa/Hrát/
  Obchod) s opravou nekonzistence (levely nejsou vázané na konkrétní
  součást, tapnutí na součást otevírá jen kartu receptu, ne minihru);
  5×3 struktura podsoučástí; cílové tempo kapitoly 1 ~1–2 týdny jako
  hlavní tuning KPI; princip "obsahová knihovna ≠ délka hry"; generování
  levelů (ručně prvních ~10–15, pak generátor s křivkou obtížnosti),
  hard levely s násobičem odměny, poznámka o kontrole řešitelnosti pro
  architecture.md
- 2026-08-24: **konkrétní čísla ekonomiky (v1)** — ceny surovin a
  recepty všech 15 podsoučástí spočítané v `docs/ekonomika-oprav.xlsx`
  (živá ladicí tabulka); výchozí nastavení dává celkovou cenu kapitoly 1
  = 607,5 mincí, ~7,2 dne při výchozích předpokladech; zaznamenáno
  otevřené riziko — subjektivní pocit krátké hry i přes matematicky
  "V CÍLI" tempo, čeká na ověření proti referenčním hrám
- 2026-08-26: **zásadní pivot — místnosti, Kredity+Mince, povinné boss
  levely.** Ekonomika přepsána na jednovrstvý model (Kredity = hlavní
  progresní měna, přímý nákup položek, žádný obchod, žádné suroviny;
  Mince = samostatná boosterová měna, zatím nenavržená) — platí pro
  celou hru. Oprava rakety přestrukturována z 5 volně vybíraných
  součástí na **12 místností v pevném pořadí** (Plášť → Ubikace →
  Koupelny → Jídelna a kuchyň → Ošetřovna → Kokpit → Navigace →
  Nákladový prostor → Strojovna → Sklad paliva → Serverovna/jádro AI →
  Komunikace), **60 položek** (48 normálních + 12 povinných). Poslední
  položka každé místnosti je **boss level** — nedá se koupit za Kredity,
  musí se vyhrát (výchozí ~35% úspěšnost), striktně neobejitelný grindem;
  výhra dá i bonus Kreditů (informativní, zatím nezapočítáno do tempa).
  Levná/drahá varianta zavedena u normálních položek (násobič 1,6×).
  Volitelná **vylepšení dokončených místností** potvrzena jako explicitní
  MVP scope (retention buffer + narativní most ke kapitole 2). Obchod
  jako samostatná obrazovka zrušen — zůstávají dvě obrazovky (Raketa/
  Hrát). Denní transport (5.6) propojen s Komunikací jako upgrade
  existujícího "základního majáku", ne nová mechanika. Zaznamenána
  poznámka k architektuře — jádro hry oddělené od Telegram adaptéru pro
  budoucí portabilitu na Google Play/App Store. Nová ladicí tabulka
  `docs/ekonomika-mistnosti.xlsx` (v3) — výsledné tempo při výchozích
  hodnotách ~11,9 dne / ~1,7 týdne, "V CÍLI".
