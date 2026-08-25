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
aplikovaný na sci-fi/space téma, s holografickým/blueprint vizuálním
stylem (viz sekce 6).

## 2. Cílová skupina a platforma

- Platforma: Telegram Mini App
- Cílovka: casual hráči match-3 her, kteří chtějí krátké herní seance
  (jednotky minut) víckrát denně — typicky širší demografie, ne jen
  "hardcore" gameři
- Distribuce: silně závislá na Telegram sociálních kanálech (sdílení do
  chatů/skupin, referral) — viz sekce 10

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

- **TODO:** přesná povaha mise, kvůli které hráč na planetě byl
- **TODO:** kdo/co je AI lodi (jméno, osobnost, tón dialogů)
- **TODO:** detaily kapitoly 2 — řešit až po dokončení návrhu kapitoly 1

## 4. Core loop

1. Hráč jde do sekce **Hrát** a odehraje match-3 level → získá Mince, v
   množství podle výkonu (viz 5.3)
2. V **Obchodě** mince utrácí za konkrétní suroviny (viz 5.4)
3. Na hlavní obrazovce **Raketa** investuje suroviny do opravy libovolné
   odemčené součásti — hráč si vybírá podle toho, na co má nastřádáno
   (viz 5.5)
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

Tyhle tři kroky (1–3) jsou tři samostatné, nezávislé obrazovky/smyčky —
viz sekce 6 pro detailní UX rozpad a důležitou opravu (levely nejsou
vázané na konkrétní opravovanou součást).

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
- Energie se váže **výhradně na hraní levelů** (obrazovka Hrát) — samotná
  oprava součásti (útrata surovin) je okamžitá a zdarma, energii
  nespotřebovává.

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
| Tutoriál (viz 7) | ~95–100 % — téměř nejde prohrát |
| Volná fáze (výběr součástí) | ~70–80 %, s občasným těžším levelem pro pocit výzvy (pilovité tempo, ne monotónní nárůst) |
| Finále (reaktor) | ~50–60 % — náročnější, ale ne "pay wall" |

- **TODO:** přesné prahy hvězdičkového hodnocení (kolik zbývajících
  tahů = jaký bonus mincí)
- **TODO:** rozhodnout, jestli je v MVP i nabídka "pokračovat za pár
  tahů navíc" (za reklamu/nákup) při neúspěchu

### 5.4 Ekonomika: mince → obchod → suroviny

**Rozhodnuto:** dvouvrstvá ekonomika — jednoduchá měna pro monetizaci,
suroviny pro herní hloubku.

1. Match-3 level (obrazovka Hrát) → **Mince**, množství podle výkonu
   (viz 5.3) — **obecný mix, nezávislý na tom, co hráč zrovna opravuje**
2. Mince se utrácí v **obchodě** za konkrétní suroviny — **pevná
   nabídka**: všechny suroviny jsou vždy dostupné za pevnou cenu v
   mincích (zvoleno kvůli jednoduchosti pro MVP; rotující/omezená
   nabídka je kandidát na post-MVP retention mechaniku)
3. Suroviny se spotřebovávají na opravu součástí rakety podle jejich
   "receptu" (viz 5.5)

**Zdůvodnění:** spojuje výhody obou dřívějších variant — monetizace
zůstává jednoduchá (jediná nakupitelná věc za Telegram Stars jsou Mince,
viz sekce 9), ale nákupní rozhodování a strategická hloubka (co koupit
teď, na co šetřit) se vrací díky víc druhům surovin v obchodě. Oddělení
od konkrétních levelů (viz sekce 6) drží ekonomiku jednoduchou na
balancing — jedna křivka odměn, ne desítky tematických variant.

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

**Struktura součástí a podsoučástí (5×3):**

| Součást | Podsoučásti | Orientační "levely" (viz poznámka níže) |
|---|---|---|
| **Plášť** | Vnější obšívka, tepelný štít, poklopy a okna | 5 |
| **Navigace** | Senzory/radar, palubní počítač, komunikační anténa | 6 |
| **Pohon/motor** | Palivové nádrže, tryska/spalovací komora, chladicí systém | 7 |
| **Kokpit** | Podpora života, sedačky, přístrojová deska | 6 |
| **Reaktor** *(zamčeno, odemkne se až po dokončení ostatních 4)* | Jádro reaktoru, chlazení reaktoru, hlavní řídicí jednotka | 7 |

> Zamčený je pouze **Reaktor** — ostatní 4 součásti (plášť, navigace,
> pohon, kokpit) jsou od začátku volně dostupné v libovolném pořadí.

**Důležitá poznámka k číslům:** sloupec "orientační levely" je odhad,
kolik odehraných levelů (kdekoliv na cestě, viz sekce 6–7) v průměru
vygeneruje dost mincí na danou podsoučást — je to ekonomický/tuning
odhad (kolikrát si hráč v průměru "zahraje", ne konkrétní přiřazené
levely). Levely samotné nejsou vázané na konkrétní podsoučást — viz
sekce 6.

- **TODO:** přesná množství surovin v receptu každé podsoučásti

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

## 6. UI/UX a struktura obrazovek

**Rozhodnuto — orientace:** na výšku (portrait). Telegram Mini Apps se
prakticky vždy hrají na výšku (otevírají se jako sheet uvnitř Telegram
appky, hraje se jednou rukou mezi chatováním) a je to i genre standard
(Candy Crush, Homescapes, Toon Blast). Tvar rakety (vysoká, úzká) navíc
portrétu přirozeně sedí — jde ukázat celou od trysek po špičku.

**Rozhodnuto — vizuální styl:** holografické schéma/blueprint — svítící
linky na tmavém pozadí. Poškození = praskliny/přerušené obvody/červené
varovné symboly; oprava = plynule svítící čisté linky. Levnější a
konzistentnější na produkci než malovaná ilustrace (jeden vektorový styl,
"poškození" jako přidané/odebrané vrstvy nad základní kresbou, ne
kompletně nové obrázky pro každý stav).

**Rozhodnuto — tři nezávislé obrazovky** (stejný princip jako u
Homescapes/Gardenscapes — cesta levelů je vizuálně i mechanicky oddělená
od domu/rakety):

1. **Raketa (hub)** — izometrický/průřezový holografický pohled na
   raketu. Tapnutím na součást/podsoučást se otevře **karta s receptem**
   (potřebné suroviny, co hráč má, tlačítko "Opravit" — aktivní jen při
   dostatku surovin). **Žádná minihra se odsud nespouští.** Oprava je
   okamžitá a zdarma. Po opravě všech podsoučástí dané součásti se
   aktualizuje i celkový pohled na raketu (dvojitá vizuální odměna —
   detail i celek).
2. **Hrát** — persistentní záložka/tlačítko vedoucí na **cestu levelů**,
   vizuálně nezávislou na raketě (např. "cesta troskami/okolím
   havárie" s očíslovanými zastávkami). Kosmic prostředí v pozadí se
   mění podle **pozice na cestě** (časná zastávka = trosky/kráter,
   pozdější = hlouběji v troskách lodi) — **ne podle toho, co hráč zrovna
   opravuje** (taková vazba by naznačovala, že levely jsou tematické,
   což neplatí, viz 5.4). Levely jsou opakovaně hratelné — po dohrání
   cesty do konce lze tapnout na libovolný starší level a zahrát si ho
   znovu pro další mince (viz sekce 8).
3. **Obchod** — mince se tu mění za suroviny (pevná nabídka, viz 5.4).

**Tok hráče:** vidím raketu → chci ji opravit → jdu **vydělávat**
(Hrát) → jdu **nakoupit** (Obchod) → vrátím se na **Raketu** a opravím
(instantní akce).

- **TODO:** zvážit rychlou zkratku z karty receptu na raketě přímo do
  Hrát/Obchod (např. tlačítko "Chybí suroviny → jít nakoupit/vydělat")
- **TODO:** kdo/co bude grafiku vyrábět (AI generování, freelancer,
  hotové assety) — ovlivní tempo produkce, ne design samotný

## 7. Obsah a tempo kapitoly 1

**Rozhodnuto — cílové tempo:** cca **1–2 týdny** běžné, neplacené,
přiměřeně aktivní hraní na kompletní opravu rakety (celá kapitola 1).
Tohle je hlavní tuning cíl, podle kterého se nastavují ceny surovin a
výdělek mincí — ne počet levelů.

**Klíčový princip:** velikost obsahové knihovny (kolik unikátních levelů
existuje) **není totéž** co délka hry. Levely jsou opakovaně hratelné —
30+ levelů (viz tabulka v 5.5, součet ≈ 31 + tutoriál) je odhad, kolikrát
si hráč average v průměru "zahraje" (včetně opakování), ne strop na
počet odehrání. Skutečné tempo řídí tři páky dohromady:

1. **Energie** (5 životů, ~30 min/život) — fyzický limit, kolik levelů
   lze odehrát za hodinu/den bez reklam/Stars
2. **Ceny surovin v obchodě** vs. **průměrný výdělek mincí za level**
3. **Denní transport** — malý trvalý přísun zdarma, motivuje k
   pravidelnému návratu, ale sám o sobě postup nevyřeší

### 7.1 Konkrétní čísla — ceny surovin a recepty

**Rozhodnuto:** první konkrétní pracovní čísla pro ceny surovin a recepty
všech 15 podsoučástí jsou spočítaná a uložená jako živá ladicí tabulka:
[`docs/ekonomika-oprav.xlsx`](./ekonomika-oprav.xlsx). Tenhle soubor je od
teď **autoritativní zdroj přesných čísel** (ceny, množství, výsledné
tempo) — v GDD držíme jen shrnutí a principy, ne kopie čísel, co by se
musely ručně synchronizovat na dvou místech.

**Shrnutí výchozího nastavení (viz xlsx pro detail a možnost ladění):**

| Surovina | Cena/jednotka (mince) |
|---|---|
| Hliník | 0,2 |
| Deuterium | 0,4 (nejdražší — exotické palivo) |
| Elektronika | 0,25 |
| Šrot | 0,1 (nejlevnější — univerzální) |

| Součást | Cena celkem (mince) | Podíl na kapitole 1 |
|---|---|---|
| Plášť | 85 | 14 % |
| Navigace | 95 | 16 % |
| Pohon/motor | 122 | 20 % |
| Kokpit | 95 | 16 % |
| Reaktor (zamčeno) | 210,5 | 35 % |
| **Celkem** | **607,5** | 100 % |

Při výchozích předpokladech (8 pokusů o level/den, 70% úspěšnost, 15
mincí/vyhraný level v průměru) vychází kompletní oprava na **~7,2 dne
(~1 týden)** — v rámci cíleného rozmezí 1–2 týdny, ale při dolní hranici.

### 7.2 Otevřené riziko — subjektivní vnímání délky hry

Matematický model (7.1) říká, že tempo sedí do cíle, ale **subjektivně
to i tak působí jako krátká hra** (řádově dny, ne týdny) — na tohle
upozornil při review této kapitoly sám autor designu. Možné vysvětlení
k ověření: referenční hry (Homescapes, Toon Blast) mají řádově **stovky
očíslovaných levelů** mezi jednotlivými renovacemi, takže postup je
vnímán jako delší i při podobné "mincové" ekonomice — to je jiná osa než
cena/odměna, kterou tahle tabulka řeší. Bez zahraní referenčních her a
srovnání pocitu z postupu se to nedá spolehlivě posoudit jen na papíře.

- **TODO:** zahrát referenční hry (Homescapes, Toon Blast a podobné) a
  porovnat subjektivní pocit délky/tempa s tímhle modelem
- **TODO:** podle toho případně přehodnotit buď ceny/odměny (7.1), nebo
  počet levelů mezi jednotlivými opravami (8), nebo obojí

## 8. Generování levelů a obtížnost

**Rozhodnuto:** levely se negenerují ručně jeden po druhém do
nekonečna — použije se **generátor s křivkou obtížnosti**, parametrizovaný
podle pozice na cestě (viz sekce 6). Tohle škáluje bez problémů i na
stovky levelů a na budoucí kapitoly, bez lineárního nárůstu práce.

**Rozdělení:**

- **Prvních ~10–15 levelů** (tutoriál + začátek volné fáze) — **ručně
  navržené a doladěné**. Kvalita první zkušenosti je kritická, generátor
  by mohl náhodou vyprodukovat něco nezáživného nebo frustrujícího hned
  na startu.
- **Vše za tím** — **generované** podle křivky obtížnosti.

**Parametry generátoru** (rostou postupně s pozicí na cestě):

- Velikost/tvar herní desky
- Počet barev/typů políček (víc typů = těžší)
- Počet tahů vůči cíli (přísnější limit = těžší)
- Překážky (blokovaná políčka, "led", vícevrstvé kameny...) — přidávají
  se postupně, ne od začátku
- Typ cíle (posbírej N políček, vyčisti překážky, dosáhni skóre...) —
  střídání typů drží levely rozmanité

**"Hard" levely:** stejný generátor, tvrdší preset (víc typů políček,
přísnější limit tahů), **násobič odměny v mincích** (~1,5–2×). Nabízené
jako explicitní volitelná odbočka na cestě levelů (ne povinná) — pro
hráče, co chtějí risknout těžší výzvu za lepší výdělek.

**Technická poznámka pro `architecture.md`:** generátor musí mít
kontrolu řešitelnosti — vygenerovaná deska musí mít zaručeně aspoň jeden
platný tah a jít dohrát, jinak riskujeme "mrtvé" levely. Běžný,
zdokumentovaný problém u match-3 generátorů, řešit až při implementaci.

- **TODO:** přesná tabulka/vzorec křivky obtížnosti (jaké parametry se
  mění na jaké pozici)
- **TODO:** frekvence/umístění hard levelů na cestě
- **TODO:** stejný přístup (ruční start + generátor) potvrdit i pro
  budoucí kapitoly

## 9. Monetizace

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

## 10. Sociální/virální prvky *(mimo MVP, ale architektura by s tím měla počítat)*

Telegram je silný virální kanál (viz např. Hamster Kombat) — sdílení do
chatů/skupin a referral fungují nativně bez app store friction. Kandidáti
pro post-MVP:

- Pozvání přátel → bonus mince
- Darování mincí/surovin příteli
- Žebříček mezi přáteli (kdo má víc opravenou raketu)

## 11. MVP scope

**Rozhodnuto:** MVP obsahuje pouze kapitolu 1 (oprava rakety, cílové
tempo ~1–2 týdny, viz sekce 7), s nelineárním výběrem součástí,
dvouvrstvou ekonomikou (mince → obchod s pevnou nabídkou → suroviny →
oprava podle receptu) a třemi nezávislými obrazovkami (Raketa/Hrát/
Obchod, viz sekce 6). Levelový obsah: ~10–15 ručně navržených + generátor
pro zbytek (viz sekce 8) — nepotřebujeme ručně navrhovat desítky/stovky
levelů předem. Kapitola 1 musí být kompletně dokončená (všech 5
součástí), než se odemkne kapitola 2 — ta je zatím jen narativní zárodek
(viz 3), detaily se řeší až později.

Rotující/omezená nabídka obchodu a tematické levely vázané na konkrétní
surovinu jsou mimo MVP — kandidáti na pozdější retention/strategickou
hloubku.

Sociální/virální vrstva (sekce 10) je mimo MVP, ale technická
architektura (datový model uživatele, friend/referral hooks) by s ní
měla počítat dopředu, ať se nepřidává narychlo.

## 12. Otevřené otázky

- **Subjektivní pocit krátké hry i přes matematicky "V CÍLI" tempo — ověřit
  proti referenčním hrám (viz 7.2). Nejdůležitější otevřená otázka teď.**
- Přesná množství surovin v receptu každé podsoučásti — první návrh
  hotový v `docs/ekonomika-oprav.xlsx` (5.5, 7.1), čeká na ověření dle 7.2
- Ceny surovin v obchodě, v mincích — první návrh hotový v
  `docs/ekonomika-oprav.xlsx` (5.4, 7.1), čeká na ověření dle 7.2
- Přesné prahy hvězdičkového hodnocení výkonu → mince (5.3)
- Finální název herní měny (5.4)
- Přesný denní limit reklam (na mince i na životy zvlášť), cena Stars za
  okamžité doplnění životů (5.2, 5.7)
- Globální vs. lokální čas denní výzvy, řešení zmeškání (5.6)
- Rychlá zkratka z karty receptu do Hrát/Obchod (6)
- Kdo/co bude vyrábět grafiku (6)
- Přesná tabulka/vzorec křivky obtížnosti, frekvence hard levelů (8)
- Směnný kurz Stars → Mince, velikosti balíčků (9)
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
- 2026-08-24: **UI/UX a obsah** — orientace na výšku, holografický
  blueprint styl, rozdělení na 3 nezávislé obrazovky (Raketa/Hrát/
  Obchod) s opravou nekonzistence (levely nejsou vázané na konkrétní
  součást, tapnutí na součást otevírá jen kartu receptu, ne minihru);
  5×3 struktura podsoučástí; cílové tempo kapitoly 1 ~1–2 týdny jako
  hlavní tuning KPI; princip "obsahová knihovna ≠ délka hry"; generování
  levelů (ručně prvních ~10–15, pak generátor s křivkou obtížnosti),
  hard levely s násobičem odměny, poznámka o kontrole řešitelnosti pro
  architecture.md
- 2026-08-24: **konkrétní čísla ekonomiky** — ceny surovin a recepty
  všech 15 podsoučástí spočítané v `docs/ekonomika-oprav.xlsx` (živá
  ladicí tabulka, autoritativní zdroj přesných čísel); výchozí nastavení
  dává celkovou cenu kapitoly 1 = 607,5 mincí, ~7,2 dne při výchozích
  předpokladech; zaznamenáno otevřené riziko — subjektivní pocit krátké
  hry i přes matematicky "V CÍLI" tempo, čeká na ověření proti
  referenčním hrám (sekce 7.2)
