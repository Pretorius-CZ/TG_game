# Herní design dokument (GDD)

> Sem se zapisují výstupy z teoretických/design diskuzí (ať už proběhnou
> v tomhle chatu, nebo jinde). Cíl: kdykoliv otevřu novou session, mám tu
> celý aktuální stav rozhodnutí — nemusím nic dolovat ze staré konverzace.
>
> **Větev `simple-path`:** tenhle dokument popisuje zjednodušenou verzi
> hry (viz sekce 1, 13). Původní, komplexnější návrh (místnosti jako
> interaktivní hub, ekonomika Kredity+Mince, nákup položek, oprava
> rakety) zůstává beze změny na větvi `main` a v `decisions-log.md` —
> nezahazuje se, jen se teď nepoužívá.
>
> **Aktuální fokus:** kapitola 1 (jedna galaxie). Kapitola 2 (další
> galaxie, za signálem) má zatím jen narativní zárodek (viz sekce 3).

## 1. Elevator pitch

Sci-fi match-3 hra pro Telegram ve stylu Candy Crush — hráč prochází
lineární cestu levelů napříč galaxií. Každý level = jedna planeta;
výhra v minihře = úspěšné vyjednání, planeta se přidá k hráčově alianci.
Cesta je rozdělená na 12 planetárních soustav (po 5 planetách), každá
soustava končí těžším "vyjednávacím" levelem u obzvlášť nedůvěřivé
civilizace. Žádný obchod, žádná ekonomika položek — jen boostery (Mince)
jako herní pomoc. Odměna je vidět přímo na mapě cesty — spojenecké
planety a soustavy zůstávají viditelně odlišené od nedobytých. Po
spojenectví s celou galaxií (kapitola 1) aliance společně objeví
tajemný signál a hra pokračuje kapitolou 2 (další galaxie, mimo MVP).

**Kontext rozhodnutí (viz 13):** tohle je autorův první herní projekt,
sólo, s omezeným rozpočtem. Cíl je vydat jednoduchou, dobře prošlapanou
mechaniku (žádné animace, jednoduchý vizuál, hotové knihovny pro swap
mechaniku, jediná měna), naučit se na tom stavět a vydávat hru.
**Komplexnější meta-progresní model** (interaktivní hub, ekonomika
položek — zachovaný na `main`) je kandidát na budoucí, ambicióznější
titul.

## 2. Cílová skupina a platforma

- Platforma: Telegram Mini App
- Cílovka: casual hráči match-3 her, krátké herní seance (jednotky
  minut) víckrát denně
- Distribuce: silně závislá na Telegram sociálních kanálech (sdílení do
  chatů/skupin, referral) — viz sekce 10
- **Rychlá tržní kontrola (2026-08-26):** širší žánr match-3 je silně
  nasycený a ovládaný giganty (Candy Crush, Homescapes, Gardenscapes) a
  mobilní trh jako celek v roce 2025 stagnuje, placená akvizice hráčů je
  pro malé týmy nevýhodná. Telegram Mini App prostředí je ale
  srovnatelně málo obsazené klasickým match-3 obsahem a spoléhá na
  virální distribuci zdarma (viz sekce 10), ne na placenou reklamu —
  tohle riziko se tím z velké části obchází. Podobné hry (space
  match-3 s galaxiemi, např. "Space Matchers") existují, ale jsou malé
  (řádově desítky tisíc stažení) — koncept je ověřený, ne přeplněný.
- **Rozhodnuto — dlouhodobá poznámka k architektuře:** jádro hry
  oddělené od Telegram-specifické vrstvy tenkým adaptérem, pro budoucí
  portabilitu (Google Play/App Store přes Capacitor). Detaily viz
  `architecture.md`.

## 3. Příběh a narativní rámec

**Rozhodnuto:** Hráč vede loď/alianci na misi napříč galaxií (přesná
povaha mise — TODO). Cesta vede od planety k planetě; každá úspěšně
dohraná minihra představuje **úspěšné vyjednání** — planeta se
připojí k hráčově alianci, ne že by byla "dobyta" násilím (vědomě
zvolený smířlivější tón, viz `decisions-log.md`).

**Soustavy a boss/vyjednávací levely:** planety jsou seskupené do 12
**soustav** po 5 planetách. Poslední planeta soustavy je vždy obzvlášť
nedůvěřivá/opatrná civilizace — těžší, "vyjednávací" level (viz 5.8).
Jejím připojením se celá soustava stává součástí aliance.

**Vyvrcholení kapitoly 1:** po spojenectví s celou galaxií (všech 12
soustav) aliance společně odhalí **tajemný signál** odjinud z vesmíru —
kapitola 1 tím vrcholí. Kapitola 2 (mimo MVP) vede alianci za signálem
do další galaxie.

- **TODO:** přesná povaha mise hráče
- **TODO:** jména galaxie/soustav/hry (viz 12) — aktuálně žádná
  finální sci-fi jména, jen strukturní zástupné názvy
- **TODO:** kdo/co hráč vlastně je (kapitán? diplomat lodi?), tón
  dialogů při vyjednávání
- **TODO:** detaily kapitoly 2

## 4. Core loop

1. Hráč otevře jedinou hlavní obrazovku **Cesta** — mapu galaxie s
   planetami jako zastávkami, spojenecké planety/soustavy viditelně
   odlišené od nedobytých (viz 6)
2. Odehraje další level (planetu) — klasický swap match-3 (viz 5.1),
   volitelně použije odemčený booster za Mince nebo Stars (viz 5.4)
3. Výhra = úspěšné vyjednání → planeta se připojí k alianci, postup na
   další planetu, hvězdičkové hodnocení (viz 5.3). Neúspěch → ztráta 1
   života, level lze zopakovat (viz 5.2), postup se nemění
4. Každá 5. planeta v soustavě je těžší vyjednávací level (viz 5.8) —
   jeho úspěch připojí celou soustavu k alianci, na mapě se to viditelně
   projeví
5. Energie dojde → hráč čeká na doplnění, sleduje denní výzvu, nebo
   dobije energii za reklamu/Stars (viz 5.2)
6. V daný čas dne: denní výzva ("transportní raketa") — malá odměna
   zdarma (Mince, případně život)
7. Opakuje se, dokud není spojenectví se všemi 12 soustavami — pak se
   odemyká kapitola 2. Za hranicí 60. planety cesta pokračuje
   generovanými levely bez omezení (viz 8)

## 5. Herní mechaniky

### 5.1 Match-3 jádro

**Rozhodnuto:** klasický swap match-3 (styl Candy Crush). Existuje víc
hotových knihoven pro swap mechaniku, balancing je předvídatelnější a
dobře se parametrizuje pro procedurální generaci (viz 8) — důležité
vzhledem k omezenému rozpočtu a sólo vývoji.

### 5.2 Energie (životy)

**Rozhodnuto:** Max **5 životů**, doplňování časem (~30 minut/život,
plné doplnění ≈ 2,5 hodiny). Rychlejší doplnění: **odměněná reklama →
okamžitě +1 život** (denní limit, jediná funkce reklamy — viz 5.7),
nebo Telegram Stars (okamžité doplnění všech, za reálné peníze).

**Klíčové upřesnění mechaniky (žánrový standard, Candy Crush/
Homescapes):** **život se ztrácí jen při neúspěchu**, výhra život
nestojí. Energie funguje hlavně jako pojistka proti smolným sériím a
jako skutečná brzda u vyjednávacích levelů, ne jako plošný strop na
počet odehraných levelů denně — viz sekce 7.

### 5.3 Fail state a hodnocení výkonu

- Levely mají omezený počet tahů. Dojdou tahy bez splnění cíle = level
  neúspěšný, ztráta 1 života, level lze zopakovat.
- Výkon se hodnotí **hvězdami (1–3)** podle zbývajících tahů. Hvězdy
  neodemykají nic (žádná ekonomika) — motivace hrát znovu pro lepší
  skóre, základ pro budoucí žebříčky (viz 10). 3hvězdičková výhra dává
  vyšší šanci na drop Mince (viz 5.4).

**Rozhodnuto — obtížnost je "pilovitá", ne monotónně rostoucí:**
liché levely v soustavě o něco lehčí, sudé o něco těžší, s celkově
rostoucím trendem napříč soustavami — drží to pocit "zase to dávám" i
"tohle byla fuška" místo uspávajícího plynulého nárůstu.

| Typ levelu | Cílová úspěšnost na 1. pokus |
|---|---|
| Tutoriál (1 level, viz 8) | ~95–100 % |
| Normální level — lichý v soustavě | ~65–70 % |
| Normální level — sudý v soustavě | ~45–55 % |
| Volitelný Hard level (viz 8) | o něco níž než normální, vyšší odměna |
| **Vyjednávací/boss level** (5. planeta soustavy, viz 5.8) | **~30–35 %** |

- **TODO:** přesné prahy hvězdičkového hodnocení

### 5.4 Ekonomika: jediná měna — Mince (boostery)

**Rozhodnuto:** žádný obchod, žádná položková ekonomika. **Mince** jsou
jediná herní měna, výhradně na **boostery** použitelné v libovolném
levelu (normálním i vyjednávacím).

**Boostery (3 typy, jednotná cena 1 Mince/použití):**

| Booster | Efekt |
|---|---|
| Dodatečný impulz | +5 tahů navíc |
| Plazmový řezač | odstraní 1 zvolené políčko/překážku |
| Rekalibrace pole | zamíchá desku |

**Rozhodnuto — postupné odemykání** (ne všechny najednou): každý
booster se odemyká samostatně, na jiné planetě, ať si ho hráč osvojí
zvlášť — návrh: Dodatečný impulz na 3. planetě, Plazmový řezač na 8.,
Rekalibrace pole na 13. (čísla k doladění). Jakmile je booster
odemčený, jde koupit **dvěma cestami zároveň** — za nastřádané Mince,
nebo **rovnou za Stars** (přímý nákup balíčku bez nutnosti napřed
směňovat na Mince).

**Zdroje Mincí:** malá šance (~10–15 %) na +1 Minci za vyhraný level
(vyšší při 3 hvězdách), denní transport (viz 5.6), Telegram Stars.
Reklama Mince **nedává** — reklama je vyhrazená jen pro životy (viz
5.2, 5.7).

- **TODO:** přesná pravděpodobnost dropu, ceny balíčků za Stars, bonus
  za vyjednávací level (viz 5.8)

### 5.5 Soustavy a galaxie — struktura cesty

**Rozhodnuto:** kapitola 1 = **jedna galaxie** o **60 planetách,
rozdělených do 12 soustav po 5 planetách**. Soustavy jsou kosmetické/
narativní seskupení (vlastní pozadí a tematické dlaždice, viz 6), bez
ekonomiky. Poslední (5.) planeta soustavy je vždy vyjednávací/boss
level (viz 5.8); její připojení dokončí celou soustavu.

**Pořadí a jména soustav — TODO.** Struktura (12 skupin po 5) je
převzatá z dřívějšího návrhu místností na `main`, ale jejich jména
(Plášť, Ubikace...) na téma "planetární soustava" tematicky nesedí —
potřebují nové sci-fi názvy (soustavy, galaxie, i případně finální
název hry, viz sekce 12). Zatím se pracuje se stejným počtem a pořadím
(Survival/Funkčnost/Vrchol fáze), jen bez konkrétních jmen.

Za 60. planetou (konec galaxie) cesta pokračuje **generovanými levely
bez omezení** (viz 8), recyklujícími vizuál poslední soustavy.

### 5.6 Denní výzva — "transportní raketa"

- V pevně daný čas dne se objeví časově omezená událost s malou odměnou
  zdarma (Mince, případně život).
- **TODO:** globální pevný čas vs. lokální, řešení zmeškání

### 5.7 Odměněná reklama

**Rozhodnuto:** reklama má jedinou funkci — **+1 život** (denní limit),
zpět k původnímu plánu. Mince se z reklam nezískávají (viz 5.4) — čisté
oddělení: reklama řeší energii, Stars/hraní řeší boostery.

- **TODO:** přesný denní limit

### 5.8 Vyjednávací (boss) levely

**Rozhodnuto:** poslední (5.) planeta každé ze 12 soustav je zvlášť
nedůvěřivá/opatrná civilizace — výrazně těžší level (cíl ~30–35 %
úspěšnost). Protože je cesta striktně lineární (musíš uspět, abys
postoupil — platí pro každou planetu), nepotřebuje zvláštní "gate"
logiku navíc — je to prostě obtížnostní vrchol na konci soustavy.
Úspěšné vyjednání připojí k alianci celou soustavu najednou.

- **TODO:** bonusová odměra (extra Mince? silnější narativní beat?)

### 5.9 Hvězdy, skóre a opakovatelnost

Levely jsou opakovaně hratelné i po prvním dokončení — hráč se může
vrátit pro lepší hvězdičkové hodnocení nebo drop Mincí (viz 5.3–5.4).
Základ pro budoucí žebříčky (viz 10).

## 6. UI/UX a struktura obrazovek

**Rozhodnuto — orientace:** na výšku (portrait) — genre standard pro
Telegram Mini Apps.

**Rozhodnuto — jediná hlavní obrazovka** (obrazovka Loď se ruší úplně,
viz `decisions-log.md`): **Cesta** — mapa galaxie s planetami jako
zastávkami, hvězdné pole/galaxie v pozadí, měnící se podle aktuální
soustavy. Spojenecké planety a soustavy zůstávají na mapě **viditelně
odlišené** (jiná barva/rozsvícený stav) od nedobytých — odměna je vidět
přímo v hlavní interakční ploše, žádná zvláštní obrazovka na to není
potřeba. Vyjednávací levely vizuálně odlišené (výraznější ikona
zastávky). Volitelné Hard levely jako odbočka mimo hlavní linii (viz 8).

**Rozhodnuto — vizuální styl:**

- **UI chrome:** holografické schéma/blueprint — svítící linky na
  tmavém pozadí, statické, "komixové" podání (bez animace).
- **Herní dlaždice (na desce):** samostatný styl od holografického UI
  — potřebují být barevně odlišné a čitelné (žánrová nutnost). Návrh
  (k doladění): energetický krystal, kovový šrot, plazmová koule,
  ledový krystal, obvodový čip, hvězdné jádro — 6 typů, ploché
  vektorové ikony, bez animace. **Otevřeno, zda navrhnout sami, nebo
  zadat externě** (freelancer/AI generování) — obě cesty jsou na
  stole, nerozhodnuto.

**Tok hráče:** otevřu appku → **Cesta** → hraju další planetu → vidím
postup přímo na mapě → pokračuju dál.

- **TODO:** kdo/co bude vyrábět grafiku
- **TODO:** finální sada tematických dlaždic a jejich vazba na soustavy

## 7. Obsah a tempo kapitoly 1

**Rozhodnuto — cílové tempo:** cca **1–2 týdny** běžné, neplacené,
přiměřeně aktivní hraní na spojenectví s celou galaxií (60 planet).

**Jak tempo skutečně vzniká (viz 5.2):** energie se ztrácí jen při
neúspěchu, není hlavní pákou tempa. Skutečné tempo řídí:

1. **Celkový počet levelů** (60 pro kapitolu 1) — hlavní páka
2. **Realistický denní herní návyk** — hráč přirozeně přestává hrát z
   vlastní vůle dávno předtím, než mu dojde všech 5 životů
3. **Vyjednávací levely** (12, ~30–35 % úspěšnost) — tady energie
   skutečně reálně dochází (odhad ~12% šance na vyčerpání všech 5
   životů u jednoho konkrétního levelu → 1–2 opravdové "musím počkat"
   momenty za celou kapitolu, soustředěné na konci soustav)

**Otevřené riziko:** bez skutečného playtestu nejde spolehlivě
odhadnout, jestli 60 levelů + 12 vyjednávacích zastávek dá pocitově
1–2 týdny — hlavní pákou k doladění je počet levelů/soustav, ne
ceny/odměny (ty v tomhle modelu neexistují).

- **TODO:** po prvním hratelném prototypu ověřit skutečné tempo

## 8. Generování levelů a obtížnost

**Rozhodnuto:** levely se negenerují ručně donekonečna — generátor s
křivkou obtížnosti, parametrizovaný podle pozice na cestě.

**Rozdělení:**

- **Tutoriál = 1 level.** Ne blok víc levelů — jediný level s
  **kontextovou nápovědou** (nápovědy se objevují za chodu podle toho,
  co se zrovna děje — "tohle je speciální dlaždice, vznikne spojením
  4+", "tahle překážka se zničí sousedním spojením" apod.), skoro nejde
  prohrát (~95–100 %). Cíl je naučit, ne otestovat.
- **Od 2. levelu** — generátor už může nastupovat s jemným startem
  obtížnosti, nepotřebujeme kvůli tomu držet velký ručně dělaný blok.
- **Prvních cca 60 levelů (1 galaxie)** — generované podle křivky
  obtížnosti, s tematickým vizuálem podle příslušné soustavy.
- **Nad 60. levelem** — generátor pokračuje bez omezení, recykluje
  vizuál poslední soustavy. Jednou hotový generátor umí produkovat
  stovky až tisíce levelů prakticky zadarmo — na rozdíl od ručně
  tvořeného obsahu. Referenční hry (Candy Crush) mají dnes tisíce
  levelů, ale to je výsledek let přídavků po launchi, ne startovní
  rozsah.

**Parametry generátoru:** velikost/tvar desky, počet typů políček,
počet tahů vůči cíli, překážky, typ cíle — rostou postupně, s pilovitým
střídáním (viz 5.3).

**Dva typy těžších levelů:**

- **Hard levely** — volitelná odbočka mimo hlavní linii, tvrdší preset,
  násobič odměny (Mince, ~1,5–2×)
- **Vyjednávací/boss levely** (viz 5.8) — na hlavní linii, povinné, 5.
  planeta každé soustavy, ještě tvrdší preset (~30–35 % win rate)

**Technická poznámka pro `architecture.md`:** generátor musí
garantovat řešitelnost vygenerované desky (aspoň 1 platný tah,
dohratelnost) — i u těžších presetů.

- **TODO:** přesná tabulka/vzorec křivky obtížnosti
- **TODO:** frekvence/umístění Hard levelů na cestě

## 9. Monetizace

- **Mince nakupitelné za Telegram Stars** — balíčky různé velikosti,
  hlavní mikrotransakční kanál na boostery.
- **Přímý nákup konkrétního odemčeného boosteru za Stars** (viz 5.4) —
  bez nutnosti napřed směňovat na Mince.
- **Telegram Stars také přímo za okamžité doplnění životů** (viz 5.2).
- Odměněná reklama (viz 5.7) — pouze životy, free-to-play cesta k
  energii, ne k boosterům.
- **TODO:** směnný kurz Stars → Mince, velikosti balíčků

## 10. Sociální/virální prvky *(mimo MVP, architektura by s tím měla počítat)*

- Pozvání přátel → bonus Mincí
- Darování Mincí příteli
- Žebříček mezi přáteli (kdo je dál v galaxii, kdo má víc hvězd/kdo má
  větší alianci)

## 11. MVP scope

**Rozhodnuto:** MVP obsahuje kapitolu 1 jako **jednu galaxii, 60 planet
v 12 soustavách po 5** (poslední planeta soustavy vždy vyjednávací/boss
level), s **jedinou měnou Mince** na boostery (žádný obchod, žádná
ekonomika položek). UI: **jediná hlavní obrazovka Cesta** — mapa
galaxie, odměna vidět přímo na mapě (spojenecké planety/soustavy
odlišené), žádná samostatná pasivní obrazovka. Levelový obsah: 1
tutoriál level + generátor od 2. levelu dál (viz 8), aktivní i nad 60.
levelem bez omezení. Kapitola 1 musí být kompletně dokončená (všech 12
soustav), než se odemkne kapitola 2 — ta zůstává jen narativní zárodek.

Komplexnější meta-progresní model (interaktivní hub, ekonomika položek,
oprava rakety) zůstává navržený a zachovaný na větvi `main` jako
kandidát na budoucí, ambicióznější titul.

## 12. Otevřené otázky

- **Jména** — hry samotné (Galaxia/Galaxies obsazené jinými appkami),
  galaxie, jednotlivých 12 soustav, případně planet — nic finálního,
  potřeba kreativní pass
- Skutečné tempo 60 levelů / 12 vyjednávacích zastávek — ověřit po
  prvním hratelném prototypu (7)
- Tematické dlaždice — navrhnout sami vs. zadat externě/AI, finální
  sada a vazba na soustavy (6)
- Přesná pravděpodobnost dropu Mincí, ceny balíčků za Stars, přesná
  čísla odemykání boosterů (3./8./13. planeta — návrh, ne finální) (5.4)
- Bonusová odměna za vyjednávací/boss level (5.8)
- Přesné prahy hvězdičkového hodnocení (5.3)
- Kdo/co bude vyrábět grafiku (6)
- Přesná tabulka/vzorec křivky obtížnosti, frekvence Hard levelů (8)
- Přesný denní limit reklam (5.7)
- Globální vs. lokální čas denní výzvy, rozdíl mezi základním a
  vylepšeným majákem (5.6)
- Přesná povaha mise hráče (3)
- Detaily kapitoly 2 (3, 11)

## 13. Změny a historie

> Historie před pivotem na `simple-path` je beze změny zachovaná v
> `decisions-log.md` a na větvi `main`.

- 2026-08-26: **pivot na `simple-path`** — lineární cesta levelů,
  60 levelů/12 zón, jediná měna Mince, opravený model energie (viz
  `decisions-log.md` pro detail).
- 2026-08-26: **doladění simple-path a přerámování na galaxii/alianci.**
  Tutoriál zjednodušen na 1 level s kontextovou nápovědou. Obtížnost
  potvrzena jako pilovitá (liché/sudé levely v soustavě). Boostery se
  odemykají postupně (ne najednou) a jdou koupit i přímo za Stars.
  Reklama zjednodušena zpět na čistě životy, Mince z reklam odpadají.
  **Zásadní přerámování:** obrazovka Loď se ruší, nahrazena jediným
  modelem "level = planeta, soustava = 5 planet, galaxie = kapitola",
  s odměnou viditelnou přímo na mapě cesty. Tón přerámován z "dobývání"
  na **vyjednávání/alianci** — výhra = úspěšné vyjednání, boss level =
  nedůvěřivá civilizace. Název hry (Galaxia/Galaxies) zůstává otevřený.
  Rychlá tržní kontrola provedena — koncept ověřený, ne přeplněný,
  Telegram jako kanál obchází problém drahé placené akvizice.
