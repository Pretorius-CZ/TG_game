# Herní design dokument (GDD)

> Sem se zapisují výstupy z teoretických/design diskuzí (ať už proběhnou
> v tomhle chatu, nebo jinde). Cíl: kdykoliv otevřu novou session, mám tu
> celý aktuální stav rozhodnutí — nemusím nic dolovat ze staré konverzace.

## 1. Elevator pitch

Sci-fi meta-progresní hra pro Telegram: hráč začíná u ztroskotané rakety na
cizí planetě a pomocí match-3 miniher postupně opravuje její součásti. Po
opravě rakety pokračuje budováním vesmírné stanice (kapitola 2, mimo MVP).
Hra kombinuje match-3 mechaniku (zdroj surovin/pokroku) s vizuální
meta-progresí (raketa/stanice se hráči doslova "staví před očima") —
ověřený vzorec ve stylu Homescapes/Toon Blast, aplikovaný na sci-fi/space
téma.

## 2. Cílová skupina a platforma

- Platforma: Telegram Mini App
- Cílovka: casual hráči match-3 her, kteří chtějí krátké herní seance
  (jednotky minut) víckrát denně — typicky širší demografie, ne jen
  "hardcore" gameři
- Distribuce: silně závislá na Telegram sociálních kanálech (sdílení do
  chatů/skupin, referral) — viz sekce 6

## 3. Core loop

1. Hráč odehraje match-3 level → získá náhodný, ale spravedlivě vyvážený
   mix všech surovin (viz 4.4)
2. Suroviny investuje do opravy **libovolné odemčené součásti** rakety —
   hráč si vybírá podle toho, na co má zrovna dost materiálu (viz 4.5)
3. Vizuální/narativní odměna — viditelný kus rakety se opraví
4. Po opravě všech "volitelných" součástí se odemkne finální, dříve
   zamčená součást (reaktor/řídicí systém) — vrchol kapitoly 1
5. Energie dojde → hráč čeká na doplnění, sleduje denní výzvu, nebo
   dobije energii za reklamu
6. V daný čas dne: denní výzva ("transportní raketa") — zdarma balíček
   surovin, motivace vrátit se v konkrétní čas
7. Opakuje se, dokud není raketa kompletně opravená (konec MVP obsahu)

## 4. Herní mechaniky

### 4.1 Match-3 jádro

**Rozhodnuto:** klasický swap match-3 (styl Candy Crush — prohazování
sousedních políček).

**Zdůvodnění:** pro webový/Telegram Mini App vývoj existuje víc hotových
open-source/HTML5 knihoven a referenčních implementací pro swap mechaniku
než pro tap/blast styl (Toon Blast), balancing desky je předvídatelnější a
hráči mechanismus dobře znají — bez učicí křivky. Tap/blast zůstává
možnost pro pozdější odlišení (např. jako varianta v kapitole 2), ale pro
MVP dává swap nejrychlejší cestu k hratelné verzi.

### 4.2 Energie (životy)

- Ano — omezený počet pokusů/levelů najednou.
- Doplňuje se časem.
- Lze doplnit dřív: sledování odměněné reklamy nebo (později) za Stars.
- **TODO:** přesný počet životů, doba doplnění jednoho života, max. capacity.

### 4.3 Fail state v levelech

- Ano — omezený počet tahů. Dojdou tahy bez splnění cíle = level neúspěšný,
  spotřebuje se 1 život, level lze zopakovat.
- Přirozený bod pro nabídku "pokračovat za odměnu/nákup" (např. pár tahů
  navíc za reklamu) — **TODO** rozhodnout, jestli je tahle nabídka v MVP.

### 4.4 Suroviny

**Rozhodnuto — 4 druhy surovin:**

| Surovina    | Použití                              |
|-------------|---------------------------------------|
| Hliník      | Plášť (a částečně kokpit)             |
| Deuterium   | Pohon/motor                           |
| Elektronika | Navigace (a částečně kokpit)          |
| Šrot        | Univerzální — potřebný pro všechny součásti jako základ |

**Rozhodnuto — zdroj surovin (MVP):** obecný mix. Každý dohraný level dá
odměnu ve všech 4 surovinách zároveň, v náhodném, ale férově vyváženém
množství (žádný level tedy není "tematický" — to je post-MVP rozšíření
pro strategičtější hloubku, viz sekce 8). Přesný rozsah/vzorec pro
náhodnost je **TODO** (např. základní množství + náhodný bonus v rámci
rozumného rozptylu, tak aby hráč dlouhodobě nebyl "uzamčen" na jedné
surovině).

### 4.5 Oprava rakety (meta-progrese kapitoly 1)

**Rozhodnuto:** nelineární výběr — hráč si vybírá, kterou odemčenou
součást bude opravovat, podle toho, na co má nasbírané suroviny. Jedna
finální součást zůstává zamčená, dokud nejsou opravené všechny ostatní —
dává kapitole jasný vrchol.

**Návrh struktury součástí (k potvrzení):**

1. **Plášť** — Hliník + Šrot
2. **Pohon/motor** — Deuterium + Šrot
3. **Navigace** — Elektronika + Šrot
4. **Kokpit** — Hliník + Elektronika + Šrot (kombinace, protože je
   konstrukční i elektronický)
5. **Reaktor / řídicí systém** *(zamčeno, odemkne se až po dokončení 1–4)*
   — potřebuje všechny 3 specializované suroviny + víc šrotu — finální,
   nejnáročnější součást, po jejímž dokončení je raketa opravená

> Tenhle konkrétní seznam (5 součástí, jejich názvy a přesné poměry
> surovin) je návrh k potvrzení, ne finální rozhodnutí — viz otevřené
> otázky.

- **TODO:** potvrdit/upravit seznam součástí výše
- **TODO:** přesné poměry surovin potřebné na každou součást

### 4.6 Denní výzva — "transportní raketa"

- V pevně daný čas dne se objeví časově omezená událost s balíčkem surovin
  zdarma.
- **TODO:** globální pevný čas (např. 18:00 UTC) vs. čas odvozený od
  časového pásma hráče?
- **TODO:** co se stane při zmeškání — propadá se, nebo je možné dohnat?
- Technická poznámka: Telegram bot může poslat notifikaci přímo do chatu
  jako připomínku — netřeba spoléhat na OS push.

### 4.7 Odměněná reklama

- Sledování reklamy → odměna (surovina nebo balíček surovin, případně
  doplnění energie — viz 4.2).
- **TODO:** frekvenční limit (kolikrát denně lze reklamu takhle použít).

## 5. Monetizace

- Primárně: odměněné reklamy (viz 4.7).
- **TODO:** Telegram Stars jako platební vrstva pro premium měnu / skip
  timerů / kosmetiku — zvážit pro post-MVP.
- **TODO:** rozhodnout, jestli budou v MVP i přímé nákupy balíčků surovin.

## 6. Sociální/virální prvky *(mimo MVP, ale architektura by s tím měla počítat)*

Telegram je silný virální kanál (viz např. Hamster Kombat) — sdílení do
chatů/skupin a referral fungují nativně bez app store friction. Kandidáti
pro post-MVP:

- Pozvání přátel → bonus surovina
- Darování suroviny příteli
- Žebříček mezi přáteli (kdo má víc opravenou raketu)

## 7. MVP scope

**Rozhodnuto:** MVP obsahuje pouze kapitolu 1 (oprava rakety), s
nelineárním výběrem součástí a obecným mixem surovin (viz 4.4–4.5).
Budování vesmírné stanice (kapitola 2) přijde jako update po launchi, až
ověříme, že základní smyčka (match-3 → oprava → denní výzva) funguje a
hráče baví.

Sociální/virální vrstva (sekce 6) je mimo MVP, ale technická architektura
(datový model uživatele, friend/referral hooks) by s ní měla počítat
dopředu, ať se nepřidává narychlo.

Tematické levely vázané na konkrétní surovinu (viz 4.4) jsou také mimo
MVP a jsou kandidátem na strategickou hloubku později.

## 8. Otevřené otázky

- Potvrdit/upravit návrh 5 součástí rakety a jejich poměry surovin (4.5)
- Přesný vzorec náhodnosti pro drop surovin (4.4)
- Přesné parametry energie (počet životů, doba obnovy)
- Globální vs. lokální čas denní výzvy, řešení zmeškání
- Vizuální styl a způsob narativní prezentace (statické ilustrace vs.
  animace vs. postupně se měnící scéna)
- Frekvenční limit odměněných reklam
- Telegram Stars — rozsah použití, zavést v MVP nebo až post-MVP?

## 9. Změny a historie

- 2026-08-24: založen skeleton dokumentu
- 2026-08-24: doplněn core loop, rozhodnutí o match-3 typu (swap),
  energii, fail state a MVP scope (jen kapitola 1 — oprava rakety);
  přidány sociální/virální nápady jako post-MVP backlog
- 2026-08-24: nelineární oprava rakety, 4 druhy surovin (hliník,
  deuterium, elektronika, šrot), obecný mix dropu pro MVP, návrh 5
  součástí rakety s jednou zamčenou finální součástí
