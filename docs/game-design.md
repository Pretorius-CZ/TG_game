# Herní design dokument (GDD)

> Sem se zapisují výstupy z teoretických/design diskuzí (ať už proběhnou
> v tomhle chatu, nebo jinde). Cíl: kdykoliv otevřu novou session, mám tu
> celý aktuální stav rozhodnutí — nemusím nic dolovat ze staré konverzace.
>
> **Větev `simple-path`:** tenhle dokument popisuje zjednodušenou verzi
> hry (viz sekce 1, 13). Původní, komplexnější návrh (místnosti jako
> interaktivní hub, ekonomika Kredity+Mince, nákup položek) zůstává beze
> změny na větvi `main` a v `decisions-log.md` — nezahazuje se, jen se
> teď nepoužívá. Důvod větvení: viz `decisions-log.md`, záznam
> "Pivot na jednodušší cestu levelů (branch `simple-path`)".
>
> **Aktuální fokus:** kapitola 1 (oprava rakety). Kapitola 2 má zatím jen
> narativní zárodek (viz sekce 3), detaily se řeší až později.

## 1. Elevator pitch

Sci-fi match-3 hra pro Telegram ve stylu Candy Crush — hráč prochází
lineární cestu levelů a průběžně sleduje, jak se v pozadí opravuje
ztroskotaná raketa. Žádný obchod, žádná ekonomika položek — čistě
"odehraj level → postup dál", s boostery (Mince) jako jedinou herní
pomocí. Cesta je rozdělená do 12 tematických zón (podle částí rakety),
každá zóna končí těžším "boss levelem"; po dokončení zóny se na
samostatné, čistě pasivní obrazovce Loď viditelně opraví další kus
rakety a odemkne se kus příběhu. Po dokončení všech 12 zón (kapitola 1)
se odhalí tajemný signál a hra pokračuje kapitolou 2 (mimo MVP).

**Kontext rozhodnutí (viz 13):** tohle je autorův první herní projekt,
sólo, s omezeným rozpočtem. Cíl je vydat jednoduchou, dobře prošlapanou
mechaniku (žánr match-3 s cestou levelů je nasycený, ale funkční a
levný na výrobu — žádné animace, jednoduchý vizuál, hotové knihovny pro
swap mechaniku), naučit se na tom stavět a vydávat hru, a **komplexnější
meta-progresní model** (místnosti jako interaktivní hub, ekonomika
položek — navržený a zachovaný na větvi `main`) nechat na budoucí,
ambicióznější titul.

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
  Detaily viz `architecture.md`.

## 3. Příběh a narativní rámec

**Rozhodnuto:** Hráč je pilot/průzkumník na misi (přesná povaha mise —
TODO), jehož loď havaruje na neznámé planetě. Palubní AI/systémy lodi se
s dokončením **každé zóny** (viz 5.5) částečně "probouzí" a odhalují
útržky příběhu — krátký text/dialog navázaný na dokončení zóny,
zobrazený na obrazovce Loď (viz 6).

**Denní transport a Komunikace:** od prvního dne funguje slabý "základní
maják" — zdroj denní výzvy (viz 5.6) i bez opravené komunikace. Až se
dokončí zóna **Komunikace** (poslední, viz 5.5), maják se vylepší a
zároveň se přes něj naplno odhalí signál (viz níže).

**Vyvrcholení kapitoly 1:** po dokončení poslední zóny (Komunikace,
včetně jejího boss levelu) se senzory/AI naplno aktivují a odhalí
**neznámý signál** odjinud z vesmíru. Místo prostého odletu domů se hráč
(spolu s AI) rozhodne signál prozkoumat.

**Zárodek kapitoly 2 (detaily zatím neřešíme):** cílem kapitoly 2 je
dostat se blíž k signálu. Detailní návrh (např. vesmírná stanice,
vylepšení lodi) je zatím jen zárodek — bude se řešit až po MVP, případně
navazovat na komplexnější model z větve `main`.

- **TODO:** přesná povaha mise, kvůli které hráč na planetě byl
- **TODO:** kdo/co je AI lodi (jméno, osobnost, tón dialogů)
- **TODO:** detaily kapitoly 2

## 4. Core loop

1. Hráč otevře obrazovku **Cesta** a vidí svou pozici na lineární cestě
   levelů (viz 6)
2. Odehraje další level na cestě — klasický swap match-3 (viz 5.1),
   volitelně použije booster za Mince (viz 5.4)
3. Výhra → postup na další level, drobná odměna (hvězdy za výkon,
   šance na Minci, viz 5.3–5.4). Neúspěch → ztráta 1 života, level lze
   zopakovat (viz 5.2), postup se nemění
4. Každý 5. level v zóně je **boss level** — těžší preset, nižší
   úspěšnost (viz 5.8). Jeho výhra dokončí zónu
5. Po dokončení zóny (5 levelů, poslední = boss) se na obrazovce **Loď**
   viditelně opraví další kus rakety a odemkne se krátký narativní beat
   (viz 3, 6) — čistě pasivní, žádná interakce/nákup
6. Energie dojde → hráč čeká na doplnění, sleduje denní výzvu, nebo
   dobije energii za reklamu/Stars (viz 5.2)
7. V daný čas dne: denní výzva ("transportní raketa") — malá odměna
   zdarma (Mince, případně život), motivace vrátit se v konkrétní čas
8. Opakuje se, dokud není dokončena poslední zóna (Komunikace) — pak se
   odemyká kapitola 2. Za hranicí 12 zón (60 levelů) cesta pokračuje
   generovanými levely bez omezení (viz 8), pro hráče, co chtějí hrát dál

## 5. Herní mechaniky

### 5.1 Match-3 jádro

**Rozhodnuto:** klasický swap match-3 (styl Candy Crush — prohazování
sousedních políček).

**Zdůvodnění:** existuje víc hotových open-source/HTML5 knihoven a
referenčních implementací pro swap mechaniku než pro tap/blast styl,
balancing desky je předvídatelnější, hráči mechanismus dobře znají a
dobře se parametrizuje pro procedurální generaci (viz sekce 8) — důležité
i vzhledem k omezenému rozpočtu a sólo vývoji.

### 5.2 Energie (životy)

**Rozhodnuto a upřesněno:** Max **5 životů**, doplňování časem (~30
minut/život, plné doplnění z nuly ≈ 2,5 hodiny). Rychlejší doplnění:
odměněná reklama (+1 život, denní limit) nebo Telegram Stars (okamžité
doplnění všech, za reálné peníze) — žádná samostatná "prémiová měna".

**Klíčové upřesnění mechaniky (žánrový standard, stejný jako Candy
Crush/Homescapes):** **život se ztrácí jen při neúspěchu** (dojdou tahy
bez splnění cíle) — **výhra život nestojí**, hráč pokračuje na další
level bez čekání. Tohle je vědomé rozhodnutí, ne detail: znamená to, že
energie funguje hlavně jako pojistka proti smolným sériím a jako
skutečná brzda u těžších (boss) levelů, ne jako plošný strop na počet
odehraných levelů denně — viz sekce 7 pro dopad na tempo hry.

### 5.3 Fail state a hodnocení výkonu

- Levely mají omezený počet tahů. Dojdou tahy bez splnění cíle = level
  neúspěšný, ztráta 1 života, level lze zopakovat.
- Výkon při výhře se hodnotí **hvězdami (1–3)** podle zbývajících tahů —
  standardní žánrová konvence. Hvězdy zatím neslouží k odemykání ničeho
  (žádná ekonomika, viz 5.4) — jsou to primárně motivace hrát level znovu
  pro lepší skóre a základ pro budoucí sociální prvky (žebříčky, viz 10).
  3hvězdičková výhra dává o něco vyšší šanci na drop Mince (viz 5.4).

**Rozhodnuto — cílový rámec obtížnosti** (startovní odhad k doladění po
playtestech):

| Typ levelu | Cílová úspěšnost na 1. pokus |
|---|---|
| Tutoriál (viz 8) | ~95–100 % |
| Normální level | ~60–70 % |
| Volitelný Hard level (viz 8) | o něco níž než normální, vyšší odměna |
| **Boss level** (5. level každé zóny, viz 5.8) | **~30–35 %** |

- **TODO:** přesné prahy hvězdičkového hodnocení (kolik zbývajících
  tahů = kolik hvězd)

### 5.4 Ekonomika: jediná měna — Mince (boostery)

**Rozhodnuto:** žádný obchod, žádná položková ekonomika, žádná druhá
(progresní) měna. **Mince** jsou jediná herní měna, výhradně na
**boostery** použitelné uvnitř libovolného levelu (normálního i boss).

**Boostery (návrh, 3 typy, jednotná cena 1 Mince/použití):**

| Booster | Efekt |
|---|---|
| Dodatečný impulz | +5 tahů navíc |
| Plazmový řezač | odstraní 1 zvolené políčko/překážku |
| Rekalibrace pole | zamíchá desku |

**Zdroje Mincí (hybrid):**

- Malá šance (~10–15 %) na +1 Minci za vyhraný level, vyšší šance při
  3hvězdičkové výhře (viz 5.3)
- Denní transport — pevná malá dávka (viz 5.6)
- Odměněná reklama (viz 5.7)
- Telegram Stars — přímý nákup balíčků Mincí

**Odemyká se:** po prvním boss levelu (konec zóny Plášť) — hráč tou
dobou přesně pozná, k čemu boostery jsou.

- **TODO:** přesná pravděpodobnost dropu, ceny balíčků za Stars, jestli
  bonus za výhru boss levelu (viz 5.8) dává Mince navíc

### 5.5 Zóny — struktura cesty (meta-vrstva kapitoly 1)

**Rozhodnuto:** cesta kapitoly 1 má **60 levelů, rozdělených do 12 zón
po 5 levelech**. Zóny jsou čistě **kosmetické/narativní** — každá má
vlastní pozadí a tematické dlaždice (viz 6), ale žádnou ekonomiku ani
nákup. Poslední (5.) level každé zóny je vždy **boss level** (viz 5.8);
jeho výhra dokončí zónu a spustí update na obrazovce Loď (viz 3, 6).

**Pořadí zón (stejné jako navržená struktura místností na `main`,
recyklováno jako kosmetické téma):**

| # | Zóna | Fáze |
|---|---|---|
| 1 | Plášť | Survival |
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
| 12 | Komunikace | Vrchol |

Za 60. levelem (konec zóny Komunikace) cesta pokračuje **generovanými
levely bez omezení** (viz 8), vizuálně recyklujícími téma poslední zóny
— pro hráče, kteří chtějí hrát dál, aniž by to vyžadovalo další ruční
obsah předem.

### 5.6 Denní výzva — "transportní raketa"

- V pevně daný čas dne se objeví časově omezená událost s malou odměnou
  zdarma (Mince, případně život).
- Od začátku hry funguje přes **základní maják** (slabší verze); po
  dokončení zóny Komunikace se vylepší (viz 3).
- **TODO:** globální pevný čas vs. čas dle časového pásma hráče, řešení
  zmeškání, přesný rozdíl mezi základním a vylepšeným majákem

### 5.7 Odměněná reklama

- Sledování reklamy → odměna (Mince, nebo +1 život — viz 5.2, 5.4).
- **TODO:** frekvenční limit (na Mince, odděleně od limitu na životy)

### 5.8 Boss levely

**Rozhodnuto:** poslední (5.) level každé ze 12 zón je **boss level** —
samostatný, výrazně těžší preset (cíl ~30–35 % úspěšnost). Protože je
cesta striktně lineární (musíš vyhrát level, abys postoupil na další —
platí pro všechny levely, ne jen boss), boss level nepotřebuje žádnou
zvláštní "gate" logiku navíc oproti běžnému postupu — je to prostě
výrazný obtížnostní vrchol na konci každé zóny, který dokončí zónu a
spustí update Lodi (viz 3, 6).

- **TODO:** bonusová odměna za výhru boss levelu (extra Mince?
  silnější narativní beat?) — k doladění

### 5.9 Hvězdy, skóre a opakovatelnost

Levely jsou opakovaně hratelné i po prvním dokončení — hráč se může
vrátit a zahrát si starší level znovu pro lepší hvězdičkové hodnocení
nebo drop Mincí (viz 5.3–5.4). Základ pro budoucí sociální prvky
(žebříčky mezi přáteli, viz 10).

## 6. UI/UX a struktura obrazovek

**Rozhodnuto — orientace:** na výšku (portrait) — genre standard pro
Telegram Mini Apps.

**Rozhodnuto — dvě obrazovky, jedna aktivní a jedna pasivní:**

1. **Cesta** — hlavní, aktivní obrazovka. Lineární cesta levelů s
   očíslovanými zastávkami, galaxie/hvězdné pole v pozadí, měnící se
   podle **pozice na cestě / aktuální zóny**. Boss levely vizuálně
   odlišené (např. výraznější ikona zastávky). Volitelné Hard levely
   jako odbočka mimo hlavní linii (viz 8).
2. **Loď** — pasivní, sekundární obrazovka. Holografický/blueprint
   pohled na raketu (viz níže), který se **aktualizuje po dokončení
   každé zóny** (13 stavů: start + 12 zón) — poškození jako odebíratelná
   vrstva nad jedním základním obrázkem (levnější na výrobu než 13
   samostatných kreseb). Tap na obrazovku zobrazí narativní text/dialog
   navázaný na dokončenou zónu (viz 3). Žádná interakce/nákup zde neprobíhá.

**Rozhodnuto — vizuální styl:**

- **UI chrome a Loď:** holografické schéma/blueprint — svítící linky na
  tmavém pozadí, statické, "komixové" podání (bez animace), poškození
  jako praskliny/přerušené obvody, oprava jako čisté svítící linky.
- **Herní dlaždice (na desce):** samostatný styl od holografického UI —
  potřebují být barevně odlišné a čitelné na první pohled (žánrová
  nutnost pro match-3, hologram-linky by se špatně rozlišovaly). Návrh
  (k doladění s grafikem/AI generováním): energetický krystal, kovový
  šrot, plazmová koule, ledový krystal, obvodový čip, hvězdné jádro —
  6 typů, ploché vektorové ikony, bez animace.

**Tok hráče:** otevřu appku → **Cesta** → hraju další level → příležitostně
mrknu na **Loď**, jak to vypadá a co se dozvím → zpátky na Cestu.

- **TODO:** kdo/co bude grafiku vyrábět (AI generování, freelancer,
  hotové assety)
- **TODO:** finální sada tematických dlaždic a jejich vazba na zóny
  (mění se dlaždice podle zóny, nebo zůstávají stejné celou kapitolu 1?)

## 7. Obsah a tempo kapitoly 1

**Rozhodnuto — cílové tempo:** cca **1–2 týdny** běžné, neplacené,
přiměřeně aktivní hraní na dokončení všech 12 zón (60 levelů).

**Jak tempo skutečně vzniká (viz 5.2):** protože energie se ztrácí jen
při neúspěchu, není hlavní pákou tempa — je to spíš pojistka. Skutečné
tempo řídí kombinace:

1. **Celkový počet levelů** (60 pro kapitolu 1) — hlavní páka, stejná
   jako u referenčních her (Candy Crush, Toon Blast)
2. **Realistický denní herní návyk** — běžný hráč přirozeně přestává hrát
   z vlastní vůle (jiná aktivita) dávno předtím, než by mu reálně došlo
   všech 5 životů — energie tohle nijak nezrychluje ani nezpomaluje u
   normálních levelů
3. **Boss levely** (12, ~30–35 % úspěšnost) — tady energie skutečně
   reálně dochází. Odhad: cca 12% šance na vyčerpání všech 5 životů u
   jednoho konkrétního boss levelu → v průměru 1–2 opravdové "musím
   počkat" momenty za celou kapitolu 1, soustředěné přesně tam, kde to
   dává smysl (konec zóny)

**Otevřené riziko (přeneseno z dřívějšího modelu, přeformulováno):**
bez skutečného playtestu nejde spolehlivě odhadnout, jestli 60 levelů +
12 boss zastávek dá pocitově 1–2 týdny, nebo je to málo/moc — hlavní
pákou k doladění je tady **počet levelů**, ne ceny/odměny (ty už v
tomhle modelu neexistují).

- **TODO:** po prvním hratelném prototypu ověřit skutečné tempo a podle
  potřeby upravit počet zón/levelů, nebo win rate

## 8. Generování levelů a obtížnost

**Rozhodnuto:** levely se negenerují ručně donekonečna — **generátor s
křivkou obtížnosti**, parametrizovaný podle pozice na cestě.

**Rozdělení:**

- **Prvních ~10–15 levelů** (tutoriál + začátek zóny Plášť) — ručně
  navržené a doladěné.
- **Zbytek prvních 60 levelů** (zóny 1–12) — generované podle křivky
  obtížnosti, s tematickým vizuálem podle příslušné zóny.
- **Nad 60. levelem** — generátor pokračuje **bez omezení**, recykluje
  vizuál poslední zóny (Komunikace/hluboký vesmír). Tohle je klíčové pro
  škálovatelnost bez lineárního nárůstu práce — jednou hotový generátor
  umí produkovat stovky až tisíce levelů prakticky zadarmo (na rozdíl od
  ručně tvořeného obsahu). Referenční hry (Candy Crush) mají dnes
  tisíce levelů, ale to je výsledek let průběžných přídavků po launchi,
  ne startovní rozsah — stejný přístup (vydat s pevným, zvládnutelným
  obsahem + generátor jako pojistka, případně přidávat nové tematické
  epizody později) sedí i sem.

**Parametry generátoru** (rostou postupně s pozicí na cestě): velikost/
tvar desky, počet typů políček, počet tahů vůči cíli, překážky, typ cíle.

**Dva typy těžších levelů:**

- **Hard levely** — volitelná odbočka mimo hlavní linii cesty, tvrdší
  preset, násobič odměny (Mince, ~1,5–2×)
- **Boss levely** (viz 5.8) — na hlavní linii, povinné, 5. level každé
  zóny, ještě tvrdší preset (~30–35 % win rate)

**Technická poznámka pro `architecture.md`:** generátor musí garantovat
řešitelnost vygenerované desky (aspoň 1 platný tah, dohratelnost) — i u
těžších presetů (Hard, Boss).

- **TODO:** přesná tabulka/vzorec křivky obtížnosti, včetně boss/hard
  presetů
- **TODO:** frekvence/umístění Hard levelů na cestě

## 9. Monetizace

- **Mince nakupitelné za Telegram Stars** — balíčky různé velikosti,
  jediný přímý mikrotransakční kanál na boostery.
- **Telegram Stars také přímo za okamžité doplnění životů** (viz 5.2).
- Sekundárně: odměněné reklamy (viz 5.7) jako free-to-play cesta k
  Mincím/životům.
- **TODO:** směnný kurz Stars → Mince, velikosti balíčků

## 10. Sociální/virální prvky *(mimo MVP, architektura by s tím měla počítat)*

- Pozvání přátel → bonus Mincí
- Darování Mincí příteli
- Žebříček mezi přáteli (kdo je dál na cestě, kdo má víc hvězd)

## 11. MVP scope

**Rozhodnuto:** MVP obsahuje kapitolu 1 jako **lineární cestu 60 levelů
(12 tematických zón po 5, poslední vždy boss level)**, s **jedinou
měnou Mince** výhradně na boostery (žádný obchod, žádná ekonomika
položek). UI: dvě obrazovky — **Cesta** (aktivní, hraní) a **Loď**
(pasivní, vizuální/narativní odměna). Levelový obsah: ~10–15 ručně
navržených + generátor pro zbytek (viz 8), aktivní i nad 60. levelem
bez omezení. Kapitola 1 musí být kompletně dokončená (všech 12 zón), než
se odemkne kapitola 2 — ta zůstává jen narativní zárodek.

Tohle je vědomě **zjednodušený first-project scope** — komplexnější
meta-progresní model (interaktivní hub, ekonomika položek, room
upgrades) zůstává navržený a zachovaný na větvi `main` jako kandidát
na budoucí, ambicióznější titul, ne jako součást tohohle MVP.

## 12. Otevřené otázky

- Skutečné tempo 60 levelů / 12 boss zastávek — ověřit až po prvním
  hratelném prototypu (7)
- Přesná pravděpodobnost dropu Mincí, ceny balíčků za Stars (5.4, 9)
- Bonusová odměna za výhru boss levelu (5.8)
- Přesné prahy hvězdičkového hodnocení (5.3)
- Finální sada tematických dlaždic, jejich vazba na zóny (6)
- Kdo/co bude vyrábět grafiku (6)
- Přesná tabulka/vzorec křivky obtížnosti, frekvence Hard levelů (8)
- Přesný denní limit reklam, cena Stars za doplnění životů (5.2, 5.7)
- Globální vs. lokální čas denní výzvy, rozdíl mezi základním a
  vylepšeným majákem (5.6)
- Přesná povaha mise hráče, osobnost AI lodi (3)
- Detaily kapitoly 2 (3, 11)

## 13. Změny a historie

> Historie před pivotem na `simple-path` (místnosti, Kredity+Mince,
> ekonomika položek, boss levely jako nákupní brána) je beze změny
> zachovaná v `decisions-log.md` a na větvi `main` — zde pokračuje jen
> historie relevantní pro tuhle, zjednodušenou verzi.

- 2026-08-26: **pivot na `simple-path`.** Po zvážení, že autor dělá svůj
  první herní projekt sólo s omezeným rozpočtem, se ekonomika položek a
  interaktivní hub (místnosti, Kredity, nákup, cheap/expensive varianty,
  room upgrades) nahrazují lineární cestou levelů ve stylu Candy Crush —
  60 levelů / 12 tematických zón (recyklované jméno a pořadí z modelu
  na `main`), poslední level zóny vždy boss level. Ekonomika se scvrkla
  na jedinou měnu (Mince) čistě na boostery. Upřesněn a opraven model
  energie — život se ztrácí jen při neúspěchu (žánrový standard), ne za
  každý pokus; tempo hry teď primárně řídí počet levelů a boss zastávky,
  ne ceny. Přidána pasivní obrazovka Loď (13 vizuálních stavů, vrstvený
  hologram) místo interaktivního hubu. Generátor levelů potvrzen jako
  klíčový nástroj pro škálování nad 60 levelů bez lineárního nárůstu
  práce. Detailní zdůvodnění a alternativy viz `decisions-log.md`.
