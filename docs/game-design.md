# Herní design dokument (GDD)

> Sem se zapisují výstupy z teoretických/design diskuzí (ať už proběhnou
> v tomhle chatu, nebo jinde). Cíl: kdykoliv otevřu novou session, mám tu
> celý aktuální stav rozhodnutí — nemusím nic dolovat ze staré konverzace.
>
> **Aktuální fokus:** kapitola 1 (oprava rakety). Kapitola 2 má zatím jen
> narativní zárodek (viz sekce 3), detaily se řeší až později.

## 1. Elevator pitch

Sci-fi meta-progresní hra pro Telegram: hráč začíná u ztroskotané rakety na
cizí planetě a pomocí match-3 miniher postupně opravuje její součásti. Po
opravě rakety pokračuje budováním vesmírné stanice jako základny pro cestu
za tajemným signálem, který se odhalí na konci kapitoly 1 (kapitola 2,
mimo MVP). Hra kombinuje match-3 mechaniku (zdroj mincí, obchod se
surovinami) s vizuální meta-progresí (raketa/stanice se hráči doslova
"staví před očima") — ověřený vzorec ve stylu Homescapes/Toon Blast,
aplikovaný na sci-fi/space téma.

## 2. Cílová skupina a platforma

- Platforma: Telegram Mini App
- Cílovka: casual hráči match-3 her, kteří chtějí krátké herní seance
  (jednotky minut) víckrát denně — typicky širší demografie, ne jen
  "hardcore" gameři
- Distribuce: silně závislá na Telegram sociálních kanálech (sdílení do
  chatů/skupin, referral) — viz sekce 8

## 3. Příběh a narativní rámec

**Rozhodnuto:** Hráč je pilot/průzkumník na misi (přesná povaha mise —
TODO, např. sledování starého nouzového signálu, průzkum neprobádaného
systému), jehož loď havaruje na neznámé planetě. Motivace opravit raketu
není jen "chci pryč" — palubní AI/systémy lodi se s každou opravenou
součástí částečně "probouzí" a průběžně odhalují útržky příběhu (levný,
ale účinný způsob narativní odměny bez animací — text/dialog navázaný na
dokončení každé součásti).

**Vyvrcholení kapitoly 1:** po opravě finální zamčené součásti (reaktor)
se senzory/AI naplno aktivují a odhalí **neznámý signál** odjinud z
vesmíru. Místo prostého odletu domů se hráč (spolu s AI) rozhodne signál
prozkoumat.

**Zárodek kapitoly 2 (detaily zatím neřešíme):** cílem kapitoly 2 je
dostat se blíž k signálu — vesmírná stanice, kterou hráč staví, slouží
jako základna/odpalovací bod pro tuhle cestu, ne jako samoúčelný cíl.
Tohle sjednocuje dřívější pitch ("budování stanice") s novým narativním
hákem ("let za signálem") — stanice je prostředek k cíli, ne cíl sám o
sobě.

- **TODO:** přesná povaha mise, kvůli které hráč na planetě byl
- **TODO:** kdo/co je AI lodi (jméno, osobnost, tón dialogů)
- **TODO:** detaily kapitoly 2 — řešit až po dokončení návrhu kapitoly 1

## 4. Core loop

1. Hráč odehraje match-3 level → získá Mince, v množství podle výkonu
   (viz 5.3)
2. Mince utrácí v **obchodě** za konkrétní suroviny (viz 5.4)
3. Suroviny investuje do opravy **libovolné odemčené součásti** rakety —
   hráč si vybírá podle toho, na co má nastřádáno (viz 5.5)
4. Vizuální i narativní odměna — viditelný kus rakety se opraví, AI/loď
   prozradí kus příběhu (viz 3)
5. Po opravě všech "volitelných" součástí se odemkne finální, dříve
   zamčená součást (reaktor) — vrchol kapitoly 1, odhalení signálu
6. Energie dojde → hráč čeká na doplnění, sleduje denní výzvu, nebo
   dobije energii za reklamu/Stars (viz 5.2)
7. V daný čas dne: denní výzva ("transportní raketa") — zdarma balíček
   mincí/surovin, motivace vrátit se v konkrétní čas
8. Opakuje se, dokud není raketa kompletně opravená — **teprve pak se
   odemyká kapitola 2** (žádný postup dál bez kompletní opravy)

## 5. Herní mechaniky

### 5.1 Match-3 jádro

**Rozhodnuto:** klasický swap match-3 (styl Candy Crush — prohazování
sousedních políček).

**Zdůvodnění:** pro webový/Telegram Mini App vývoj existuje víc hotových
open-source/HTML5 knihoven a referenčních implementací pro swap mechaniku
než pro tap/blast styl (Toon Blast), balancing desky je předvídatelnější a
hráči mechanismus dobře znají — bez učicí křivky. Tap/blast zůstává
možnost pro pozdější odlišení (např. jako varianta v kapitole 2), ale pro
MVP dává swap nejrychlejší cestu k hratelné verzi.

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

- **TODO:** přesný denní limit reklam, cena Stars za okamžité doplnění

### 5.3 Fail state, hodnocení výkonu a cílová obtížnost

- Levely mají omezený počet tahů. Dojdou tahy bez splnění cíle = level
  neúspěšný, spotřebuje se 1 život, level lze zopakovat.
- Odměna v mincích se odstupňuje podle výkonu — čím víc tahů zbyde při
  splnění cíle, tím víc mincí (obdoba "hvězdičkového" hodnocení z
  klasických match-3 her, jen napojená přímo na měnu místo na hvězdičky).
  I těsné dokončení dá aspoň základní odměnu, ať to nepůsobí trestajícím
  dojmem.

**Rozhodnuto — cílový rámec obtížnosti** (startovní odhad k doladění po
playtestech, ne finální čísla — přesně se to bez reálných dat nastavit
nedá):

| Fáze | Cílová úspěšnost na 1. pokus |
|---|---|
| Tutoriál (viz 6) | ~95–100 % — téměř nejde prohrát |
| Volná fáze (výběr součástí) | ~70–80 %, s občasným těžším levelem pro pocit výzvy (pilovité tempo, ne monotónní nárůst) |
| Finále (reaktor) | ~50–60 % — náročnější, ale ne "pay wall" |

- **TODO:** přesné prahy hvězdičkového hodnocení (kolik zbývajících
  tahů = jaký bonus mincí)
- **TODO:** rozhodnout, jestli je v MVP i nabídka "pokračovat za pár
  tahů navíc" (za reklamu/nákup) při neúspěchu

### 5.4 Ekonomika: mince → obchod → suroviny

**Rozhodnuto:** dvouvrstvá ekonomika — jednoduchá měna pro monetizaci,
suroviny pro herní hloubku.

1. Match-3 level → **Mince**, množství podle výkonu (viz 5.3)
2. Mince se utrácí v **obchodě** za konkrétní suroviny — **pevná
   nabídka**: všechny suroviny jsou vždy dostupné za pevnou cenu v
   mincích (zvoleno kvůli jednoduchosti pro MVP; rotující/omezená
   nabídka je kandidát na post-MVP retention mechaniku)
3. Suroviny se spotřebovávají na opravu součástí rakety podle jejich
   "receptu" (viz 5.5)

**Zdůvodnění:** spojuje výhody obou dřívějších variant — monetizace
zůstává jednoduchá (jediná nakupitelná věc za Telegram Stars jsou Mince,
viz sekce 7), ale nákupní rozhodování a strategická hloubka (co koupit
teď, na co šetřit) se vrací díky víc druhům surovin v obchodě.

**Suroviny:**

| Surovina    | Použití                                         |
|-------------|--------------------------------------------------|
| Hliník      | Plášť (částečně kokpit)                          |
| Deuterium   | Pohon/motor                                       |
| Elektronika | Navigace (částečně kokpit)                        |
| Šrot        | Univerzální — potřebný pro všechny součásti jako základ |

- **TODO:** finální název měny (Mince zní spíš fantasy než sci-fi —
  zvážit např. Kredity, Nanity, Šrouby...)
- **TODO:** ceny jednotlivých surovin v obchodě (v mincích)

### 5.5 Oprava rakety (meta-progrese kapitoly 1)

**Rozhodnuto:** nelineární výběr — hráč si vybírá, kterou odemčenou
součást bude opravovat, podle nakoupených surovin. Jedna finální součást
zůstává zamčená, dokud nejsou opravené všechny ostatní. **Celá raketa
musí být opravená (všech 5 součástí), než se odemkne kapitola 2** — v
rámci kapitoly 1 je volnost jen v pořadí, ne v tom, jestli se něco dá
přeskočit.

**Návrh struktury součástí a receptů (k potvrzení, množství jsou zástupná):**

1. **Plášť** — hliník + šrot
2. **Pohon/motor** — deuterium + šrot
3. **Navigace** — elektronika + šrot
4. **Kokpit** — hliník + elektronika + šrot (kombinace — konstrukčně i
   elektronicky náročnější)
5. **Reaktor / řídicí systém** *(zamčeno, odemkne se až po dokončení 1–4)*
   — potřebuje všechny 3 specializované suroviny + víc šrotu — finální,
   nejnáročnější součást; po jejím dokončení je raketa opravená a
   odhalí se signál (viz 3)

- **TODO:** potvrdit/upravit seznam součástí výše
- **TODO:** přesná množství surovin v receptu každé součásti

### 5.6 Denní výzva — "transportní raketa"

- V pevně daný čas dne se objeví časově omezená událost s balíčkem mincí
  nebo surovin zdarma.
- **TODO:** globální pevný čas (např. 18:00 UTC) vs. čas odvozený od
  časového pásma hráče?
- **TODO:** co se stane při zmeškání — propadá se, nebo je možné dohnat?
- Technická poznámka: Telegram bot může poslat notifikaci přímo do chatu
  jako připomínku — netřeba spoléhat na OS push.

### 5.7 Odměněná reklama

- Sledování reklamy → odměna (mince, nebo +1 život — viz 5.2).
- **TODO:** frekvenční limit (kolikrát denně lze reklamu takhle použít
  na mince, odděleně od limitu na životy)

## 6. Mapa levelů kapitoly 1

**Rozhodnuto:** cílem je cca **30 match-3 levelů** na kompletní opravu
rakety (orientační tuning cíl, ne tvrdé pravidlo — reálný počet závisí na
tom, jak se doladí ceny surovin a odměny v mincích).

| Krok | Co se děje | Orientační počet levelů | Volnost |
|---|---|---|---|
| 0. Havárie / tutoriál | Lineární, učí mechaniku match-3, žádný výběr | 2–3 | Ne (povinné, lineární) |
| 1–4. Volný výběr | Plášť, Pohon, Navigace, Kokpit — hráč volí pořadí podle nastřádaných surovin | ~20 (rozložení mezi součásti nemusí být rovnoměrné — např. plášť kratší, pohon/kokpit delší) | Ano, plná volnost pořadí |
| 5. Reaktor (finále) | Odemkne se až po dokončení 1–4, nejnáročnější, potřebuje všechny suroviny | ~5–7 | Ne (zamčeno do splnění předchozích) |
| 6. Přechod do kapitoly 2 | Narativní beat — odhalení signálu (viz 3) | 0 (cutscene/dialog, ne level) | — |

Poznámka: protože ekonomika jde přes mince→obchod→suroviny (ne přímý
drop na součást), "počet levelů na součást" je orientační — reálně jde o
to, kolik levelů v průměru vygeneruje dost mincí na potřebné suroviny.
Přesné rozložení je věc tuningu, ne herního designu jako takového.

## 7. Monetizace

- Primárně: **Mince nakupitelné za Telegram Stars** — přímé
  mikrotransakce, balíčky mincí různé velikosti. Jediný bod přímého
  nákupu za reálné peníze — suroviny se kupují jen za mince v obchodě
  (viz 5.4), takže monetizace zůstává jednoduchá i s víc druhy surovin.
- **Telegram Stars také přímo za okamžité doplnění životů** (viz 5.2) —
  alternativa ke sledování reklamy, ne nová měna.
- Sekundárně: odměněné reklamy (viz 5.7) jako free-to-play cesta k
  mincím/životům.
- **TODO:** směnný kurz Stars → Mince a velikosti balíčků
- **TODO:** kosmetika / skip timerů za Stars zvážit pro post-MVP

## 8. Sociální/virální prvky *(mimo MVP, ale architektura by s tím měla počítat)*

Telegram je silný virální kanál (viz např. Hamster Kombat) — sdílení do
chatů/skupin a referral fungují nativně bez app store friction. Kandidáti
pro post-MVP:

- Pozvání přátel → bonus mince
- Darování mincí/surovin příteli
- Žebříček mezi přáteli (kdo má víc opravenou raketu)

## 9. MVP scope

**Rozhodnuto:** MVP obsahuje pouze kapitolu 1 (oprava rakety, cca 30
levelů dle mapy v sekci 6), s nelineárním výběrem součástí a dvouvrstvou
ekonomikou (mince → obchod s pevnou nabídkou → suroviny → oprava podle
receptu). Kapitola 1 musí být kompletně dokončená (všech 5 součástí),
než se odemkne kapitola 2 — ta je zatím jen narativní zárodek (viz 3),
detaily (budování stanice, cesta za signálem) se řeší až později.

Rotující/omezená nabídka obchodu a tematické levely vázané na konkrétní
surovinu jsou mimo MVP — kandidáti na pozdější retention/strategickou
hloubku.

Sociální/virální vrstva (sekce 8) je mimo MVP, ale technická architektura
(datový model uživatele, friend/referral hooks) by s ní měla počítat
dopředu, ať se nepřidává narychlo.

## 10. Otevřené otázky

- Potvrdit/upravit návrh 5 součástí rakety a jejich recepty (5.5)
- Přesná množství surovin v receptu každé součásti (5.5)
- Ceny surovin v obchodě, v mincích (5.4)
- Přesné prahy hvězdičkového hodnocení výkonu → mince (5.3)
- Finální název herní měny (5.4)
- Přesný denní limit reklam (na mince i na životy zvlášť), cena Stars za
  okamžité doplnění životů (5.2, 5.7)
- Globální vs. lokální čas denní výzvy, řešení zmeškání (5.6)
- Vizuální styl a způsob narativní prezentace (statické ilustrace vs.
  animace vs. postupně se měnící scéna)
- Směnný kurz Stars → Mince, velikosti balíčků (7)
- Přesná povaha mise hráče, osobnost AI lodi (3)
- Detaily kapitoly 2 (budování stanice, cesta za signálem) — odloženo,
  řešíme až po dokončení kapitoly 1

## 11. Změny a historie

- 2026-08-24: založen skeleton dokumentu
- 2026-08-24: doplněn core loop, rozhodnutí o match-3 typu (swap),
  energii, fail state a MVP scope (jen kapitola 1 — oprava rakety);
  přidány sociální/virální nápady jako post-MVP backlog
- 2026-08-24: nelineární oprava rakety, 4 druhy surovin (hliník,
  deuterium, elektronika, šrot), obecný mix dropu pro MVP, návrh 5
  součástí rakety s jednou zamčenou finální součástí
- 2026-08-24: revize — 4 suroviny dočasně nahrazeny jednotnou herní
  měnou (Mince)
- 2026-08-24: finální revize ekonomiky — dvouvrstvý model mince → obchod
  (pevná nabídka) → suroviny → oprava podle receptu; odměna v mincích
  odstupňovaná podle výkonu (zbývající tahy)
- 2026-08-24: přidán narativní rámec (havárie, AI lodi, odhalení signálu
  jako vyvrcholení kapitoly 1, zárodek kapitoly 2 = cesta za signálem,
  stanice jako prostředek k cíli); mapa levelů kapitoly 1 (~30 levelů:
  tutoriál → volný výběr 4 součástí → zamčené finále → narativní
  přechod); cílový rámec obtížnosti (95–100 % / 70–80 % / 50–60 %);
  finalizace ekonomiky životů (5 životů, ~30 min/život, reklama nebo
  Stars pro rychlejší doplnění — bez nové "prémiové" měny)
