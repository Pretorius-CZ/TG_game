# Log rozhodnutí

> Chronologický, append-only log. Když v diskuzi (tady v chatu, nebo ve
> VS Code) padne netriviální rozhodnutí, přidej sem záznam. Díky tomu jde
> zpětně dohledat *proč* je něco tak, jak je — ne jen *co* je aktuálně
> platné (to je v `game-design.md` / `architecture.md`).

Formát záznamu:

```
## YYYY-MM-DD — Krátký název rozhodnutí

**Rozhodnutí:** co bylo rozhodnuto
**Kontext/důvod:** proč, jaké byly alternativy
**Dopad:** co to mění v GDD/architektuře (odkaz na sekci)
```

---

## 2026-08-24 — Založení projektu

**Rozhodnutí:** Projekt bude Telegram Mini App postavená na React + Vite.
Zdroj pravdy = GitHub repo; teoretické/design diskuze probíhají v Cowork
chatu a jejich výstupy se průběžně zapisují sem a do `game-design.md` /
`architecture.md`. `CLAUDE.md` v rootu dává Claude Code (VS Code) kontext
na začátku každé session.

**Kontext/důvod:** Potřeba spolehlivé "paměti" napříč dlouhým projektem a
napříč nástroji (Cowork chat vs. VS Code) — chat historie sama o sobě není
spolehlivá (session může skončit, kontext je omezený). Git repo jako
jediný zdroj pravdy tohle řeší.

**Dopad:** Zakládá strukturu `/docs` a `CLAUDE.md`.

---

## 2026-08-24 — Základní herní koncept a MVP scope

**Rozhodnutí:**
- Téma: sci-fi, hráč opravuje ztroskotanou raketu pomocí match-3 miniher
  (kapitola 1), následně buduje vesmírnou stanici (kapitola 2, post-MVP).
- Match-3 mechanika: klasický swap (styl Candy Crush), ne tap/blast.
- Energiový systém: ano, omezený počet pokusů, doplňuje se časem nebo za
  reklamu.
- Fail state levelů: ano, omezený počet tahů.
- Denní výzva ("transportní raketa") v pevný čas dne s odměnou zdarma.
- Odměněné reklamy jako zdroj surovin/doplnění energie.
- MVP obsahuje pouze kapitolu 1 (oprava rakety); stanice a
  sociální/virální vrstva (pozvánky, dary, žebříčky) jsou post-MVP.

**Kontext/důvod:** Swap match-3 zvolen kvůli dostupnosti hotových
webových knihoven a předvídatelnému balancingu desky — rychlejší cesta k
hratelnému MVP než tap/blast. Energie + fail state jsou standardní
retention/monetizační páky pro žánr. Omezení MVP na kapitolu 1 sníží
rozsah před launchem a ověří, jestli základní smyčka hráče baví, než se
investuje do stanice. Sociální vrstva zůstává v backlogu, protože Telegram
je silný virální kanál a architektura by s ní měla počítat dopředu, i
když se implementuje později.

**Dopad:** Aktualizuje `game-design.md` sekce 3–8 (core loop, mechaniky,
MVP scope, otevřené otázky). Otevřené otázky k dořešení: struktura
součástí rakety, typy surovin, přesné parametry energie, časování denní
výzvy, vizuální styl, frekvence reklam, role Telegram Stars.

---

## 2026-08-24 — Nelineární oprava rakety a suroviny

**Rozhodnutí:**
- Oprava rakety je nelineární — hráč si vybírá, kterou odemčenou součást
  opravuje, podle nasbíraných surovin. Jedna finální součást (reaktor/
  řídicí systém) zůstává zamčená, dokud nejsou hotové ostatní.
- 4 druhy surovin: hliník (plášť), deuterium (pohon), elektronika
  (navigace), šrot (univerzální, potřebný všude).
- Zdroj surovin pro MVP: obecný mix — každý level dá odměnu ve všech
  surovinách zároveň, v náhodném, ale férově vyváženém množství.
  Tematické levely vázané na konkrétní surovinu jsou post-MVP.
- Navržena (k potvrzení) konkrétní struktura 5 součástí rakety — viz
  `game-design.md` sekce 4.5.

**Kontext/důvod:** Nelineární výběr dává hráči pocit kontroly a
prodlužuje engagement. Obecný mix zvolen místo tematických levelů, protože
tematické levely by vyžadovaly výrazně víc práce na level design a
balancing bez jistoty, že to MVP potřebuje — jednodušší cesta k
hratelné verzi. 4 suroviny (3 specializované + univerzální šrot) jsou
kompromis mezi variabilitou a čitelností — víc druhů by riskovalo pocit
"grindwallu" (mám suroviny, ale ne ty, co zrovna potřebuju).

**Dopad:** Aktualizuje `game-design.md` sekce 3, 4.4, 4.5, 7, 8.

---

## 2026-08-24 — Revize: jednotná herní měna místo 4 surovin

**Rozhodnutí:** Systém 4 surovin (hliník/deuterium/elektronika/šrot, viz
záznam výše) se **ruší a nahrazuje** jednotnou herní měnou — pracovní
název "Mince". Mince se získávají za dokončené match-3 levely a utrácí za
opravu vybrané odemčené součásti (cena v mincích na součást). Nelineární
výběr součástí a zamčená finální součást (reaktor) zůstávají beze změny —
mění se jen to, čím se "platí". Mince budou také přímo nakupitelné za
Telegram Stars (mikrotransakce).

**Kontext/důvod:** Čtyři suroviny přinášely riziko "grindwallu" a
výrazně složitější balancing (čtyři nezávislé křivky odměn/cen). Jedna
měna je jednodušší na vývoj i vyvažování, a hlavně se přímo napojuje na
monetizaci — nákup mincí za Stars je standardní, hráčům známý
mikrotransakční vzorec. Zvažována byla varianta zachovat materiály jen
jako narativní/UI popisky nad jednotnou měnou (např. "Koupit hliníkový
plát za 150 mincí") — ponecháno jako otevřená volba, ne rozhodnuto.

**Dopad:** Aktualizuje `game-design.md` sekce 3, 4.4, 4.5, 5, 7, 8.
Předchozí záznam o 4 surovinách zůstává v logu kvůli historii rozhodování
(proč jsme k tomu nejdřív došli a proč se to změnilo), ale v `game-design.md`
už neplatí.

---

## 2026-08-24 — Finální revize ekonomiky: mince + obchod + suroviny

**Rozhodnutí:** Ekonomika je dvouvrstvá, ne buď-anebo mezi mincemi a
surovinami:
- Match-3 level dává **mince**, v množství odstupňovaném podle výkonu
  (čím víc zbývajících tahů při splnění cíle, tím víc mincí — obdoba
  hvězdičkového hodnocení).
- Mince se utrácí v **obchodě** za suroviny (hliník, deuterium,
  elektronika, šrot — návrat ke čtyřem surovinám z dřívějšího
  rozhodnutí). Obchod má pro MVP **pevnou nabídku** — všechny suroviny
  vždy dostupné za pevnou cenu.
- Suroviny se spotřebovávají na opravu součástí rakety podle receptu
  (kombinace surovin na součást) — struktura 5 součástí a nelineární
  výběr + zamčený finální díl zůstávají beze změny.
- Jediná věc nakupitelná za reálné peníze (Telegram Stars) zůstávají
  mince — suroviny se kupují jen za mince, monetizace tedy zůstává
  jednoduchá i s návratem víc surovin.

**Kontext/důvod:** Čistě jednotná měna (viz předchozí záznam) byla
jednoduchá, ale ztrácela strategickou hloubku a nákupní rozhodování,
které dávaly smysl pro budoucí opravy vyžadující víc druhů surovin.
Dvouvrstvý model (mince → obchod → suroviny) tohle řeší — hloubka se
vrací, ale jen jako útrata mincí v obchodě, ne jako náhodný drop čtyř
nezávislých surovin z levelů, takže balancing zůstává zvládnutelný.
Pevná nabídka obchodu zvolena místo rotující/omezené kvůli jednoduchosti
pro MVP; rotující nabídka (propojitelná s denní výzvou) zůstává jako
kandidát na post-MVP retention mechaniku.

**Dopad:** Aktualizuje `game-design.md` sekce 3, 4.3, 4.4, 4.5, 5, 7, 8.

---

## 2026-08-24 — Narativní rámec, mapa levelů, obtížnost a životy

**Rozhodnutí:**
- **Příběh:** hráč je pilot/průzkumník, jehož loď havaruje na neznámé
  planetě. AI/systémy lodi se s opravou každé součásti částečně
  "probouzí" a odhalují příběh. Po opravě finální součásti (reaktoru) se
  odhalí neznámý signál z vesmíru — vyvrcholení kapitoly 1.
- **Zárodek kapitoly 2:** cílem je dostat se blíž k signálu; budovaná
  vesmírná stanice je prostředek k tomu (základna/odpalovací bod), ne
  samoúčelný cíl. Detaily kapitoly 2 se řeší až později — teď je fokus
  na kapitole 1.
- **Mapa levelů kapitoly 1:** cíl ~30 match-3 levelů celkem — tutoriál
  (2–3, lineární), volný výběr 4 součástí (~20, nelineární), zamčené
  finále reaktoru (~5–7), narativní přechod (0 levelů, cutscene). Celá
  raketa musí být opravená, než se odemkne kapitola 2 — žádný přeskok.
- **Cílový rámec obtížnosti:** tutoriál ~95–100 % úspěšnost na 1. pokus,
  volná fáze ~70–80 %, finále ~50–60 %. Startovní odhad k doladění podle
  reálných dat z hraní, ne finální čísla.
- **Životy:** max 5, doplňování časem (~30 min/život, plně za ~2,5 h).
  Rychlejší doplnění: odměněná reklama (+1 život, denní limit) nebo
  Telegram Stars (okamžité doplnění všech, za reálné peníze). Žádná
  nová "prémiová" měna (diamanty apod.) — Stars tuhle roli plní přímo,
  jako alternativa pro hráče, kteří nechtějí čekat ani sledovat reklamy.

**Kontext/důvod:** Příběh dává hráči důvod, proč mu na opravě záleží, a
propojuje kapitolu 1 s kapitolou 2 (stanice teď má narativní účel, ne je
to jen "další fáze"). Mapa levelů dává konkrétní tuning cíl pro délku
kapitoly 1. Cílová obtížnost je nutná, aby hra nebyla ani nudná, ani
frustrující — bez reálných dat z hraní se přesně nastavit nedá, proto je
to rámec k doladění, ne pevná čísla. Diamanty/nová prémiová měna byly
zvažovány, ale zamítnuty — Telegram Stars už strukturálně dělají přesně
tohle (reálné peníze → herní hodnota), přidávat další vrstvu by jen
zbytečně komplikovalo ekonomiku.

**Dopad:** Aktualizuje `game-design.md` — nová sekce 3 (Příběh), nová
sekce 6 (Mapa levelů), rozšířené sekce 5.2 (Energie) a 5.3 (Obtížnost),
aktualizovaná sekce 7 (Monetizace), renumerace navazujících sekcí.

---

## 2026-08-24 — UI/UX, oddělení obrazovek a generování levelů

**Rozhodnutí:**
- **Orientace:** na výšku (portrait) — genre standard pro Telegram Mini
  Apps, tvar rakety se do portrétu přirozeně vejde.
- **Vizuální styl:** holografické schéma/blueprint (svítící linky na
  tmavém pozadí), ne malovaná ilustrace — levnější a konzistentnější
  produkce.
- **Tři nezávislé obrazovky:** Raketa (hub s kartami receptů, oprava je
  okamžitá a zdarma, nespouští minihru), Hrát (persistentní, cesta
  levelů, sem se váže energie), Obchod (mince → suroviny, pevná
  nabídka). Stejný princip jako Homescapes/Gardenscapes.
- **Oprava nekonzistence:** levely na cestě NEJSOU vázané na konkrétní
  opravovanou součást — dávají obecný mix mincí (viz záznam o ekonomice
  výše). Tapnutí na součást v hubu proto nikdy nespouští minihru, jen
  otevírá kartu receptu. Kosmic prostředí v pozadí cesty levelů se mění
  podle pozice na cestě, ne podle vybrané opravy.
- **Cílové tempo kapitoly 1:** ~1–2 týdny běžného neplaceného hraní —
  hlavní tuning KPI. Klíčový princip: velikost obsahové knihovny (počet
  unikátních levelů) ≠ délka hry — levely jsou opakovaně hratelné, tempo
  řídí ekonomika (ceny vs. výdělek) + energie.
- **Generování levelů:** prvních ~10–15 levelů ručně navržených
  (tutoriál + začátek), zbytek generovaný podle křivky obtížnosti
  (parametry: velikost desky, počet typů políček, počet tahů, překážky,
  typ cíle). Škáluje se to i na budoucí kapitoly bez lineárního nárůstu
  práce.
- **Hard levely:** stejný generátor, tvrdší preset, násobič odměny
  (~1,5–2×), volitelná odbočka na cestě, ne povinná.
- **Technická poznámka:** generátor musí kontrolovat řešitelnost
  vygenerované desky (zaručený aspoň 1 platný tah) — pro `architecture.md`.

**Kontext/důvod:** Uživatel upozornil na nekonzistenci — dřívější popis
implikoval, že tapnutí na podsoučást spouští "její" minihru, což
odporovalo už dřív rozhodnutému obecnému mixu mincí. Oddělení na 3
obrazovky tohle řeší čistě a odpovídá ověřenému vzoru žánru. Cílové
tempo (1–2 týdny) bylo potřeba jako explicitní KPI, protože "počet
levelů" sám o sobě délku hry neurčuje. Generování levelů řeší
škálovatelnost (stovky levelů pro budoucí kapitoly) bez lineárního
nárůstu autorské práce.

**Dopad:** Výrazně přepisuje `game-design.md` — nová sekce 6 (UI/UX),
nová sekce 7 (Obsah a tempo), nová sekce 8 (Generování levelů),
aktualizovaná sekce 5.5 (poznámka k číslům v tabulce podsoučástí),
renumerace navazujících sekcí (Monetizace, Sociální prvky, MVP scope,
Otevřené otázky, Změny a historie).

---

## 2026-08-24 — Konkrétní čísla ekonomiky (ceny, recepty) a otevřené riziko tempa

**Rozhodnutí:** Vytvořena živá ladicí tabulka `docs/ekonomika-oprav.xlsx`
se 4 listy (Suroviny, Recepty, Ekonomika, Souhrn) — od teď **autoritativní
zdroj přesných čísel** pro ceny surovin, recepty všech 15 podsoučástí a
výpočet výsledného tempa; v `game-design.md` je jen shrnutí a princip, ne
kopie čísel.

Výchozí nastavení: Hliník 0,2 mince/ks, Deuterium 0,4 (nejdražší),
Elektronika 0,25, Šrot 0,1 (nejlevnější). Recepty v jednotkách řádu
stovek na podsoučást (dle zadání uživatele). Výsledná cena kapitoly 1:
Plášť 85, Navigace 95, Pohon/motor 122, Kokpit 95, Reaktor 210,5 — celkem
**607,5 mincí**. Při výchozích předpokladech (8 pokusů/den, 70%
úspěšnost, 15 mincí/vyhraný level) vychází kompletní oprava na **~7,2
dne**, což tabulka vyhodnotí jako "V CÍLI" vůči cíli 1–2 týdny (na dolní
hranici).

**Otevřené riziko (nevyřešeno, záměrně zapsáno jako otevřené):** i přes
matematicky "V CÍLI" výsledek autor designu subjektivně vnímá hru jako
krátkou (řádově dny). Hypotéza k ověření: referenční hry (Homescapes,
Toon Blast) mají řádově stovky očíslovaných levelů mezi renovacemi, což
může subjektivní pocit délky ovlivňovat víc než cena/odměna samotná — to
je jiná osa než tahle tabulka řeší. Rozhodnuto zahrát referenční hry pro
porovnání, než se čísla/počet levelů dál dolaďují.

**Kontext/důvod:** Explicitní čísla (ne jen framework) byla potřeba,
protože uživatel chtěl vědět konkrétně "kolik bude co stát" — tabulka
místo statických čísel v markdownu umožňuje živé ladění bez nutnosti
přepisovat GDD při každé změně ceny. Otevřené riziko se záměrně
nezavírá unáhleně — subjektivní pocit hráče je stejně důležitý signál
jako matematický model, a matematika sama nemůže nahradit reálnou
zkušenost s referenčními hrami.

**Dopad:** Aktualizuje `game-design.md` sekce 7 (nová 7.1 a 7.2), sekce
12 (Otevřené otázky). Nový soubor `docs/ekonomika-oprav.xlsx` uložen do
repozitáře jako trvalý nástroj pro budoucí ladění (i pro další kapitoly).

---

## 2026-08-26 — Revize ekonomiky pro celou hru: Kredity + Mince, zrušení obchodu a surovin

**Rozhodnutí:** Dvouvrstvý model mince → obchod → suroviny (viz předchozí
záznamy) se **ruší a nahrazuje** jednovrstvým modelem se dvěma oddělenými
měnami — rozhodnutí platí pro **celou hru**, ne jen kapitolu 1:

- **Kredity** — hlavní progresní měna. Match-3 level dá Kredity přímo,
  Kredity se přímo utrácí za opravu položky rakety. Žádný obchod, žádné
  suroviny, žádný mezikrok.
- **Mince** — nová, samostatná měna výhradně pro boostery uvnitř
  match-3 levelu (extra tahy apod.). Nemá vliv na postup opravy rakety.
  Ekonomika Mincí (zdroj, ceny) zatím není navržená — TODO.

Obchod jako samostatná UI obrazovka odpadá — zůstávají dvě nezávislé
obrazovky (Raketa, Hrát) místo tří.

**Kontext/důvod:** Po zahrání referenčních her (Homescapes apod.) autor
designu usoudil, že model byl navrhovaný zbytečně složitě — obchod s
pevnou nabídkou v praxi nepřidával rozhodování (hráč stejně nakupoval
postupně všechno), jen extra klikání navíc. Oddělení progresní měny
(Kredity) od volitelné herní pomoci (Mince, boostery) je čitelnější a
odpovídá běžnému vzorci žánru (Homescapes apod. mají typicky přesně
tohle rozdělení: postupová měna + herní boostery).

**Dopad:** Zásadně přepisuje `game-design.md` sekci 5.4 (Ekonomika) a
navazující sekce (6 UI/UX, 9 Monetizace, 11 MVP scope). Platí pro celou
hru, ne jen kapitolu 1.

---

## 2026-08-26 — Struktura místností: 12 místností, 60 položek, room-by-room postup

**Rozhodnutí:** Model 5 volně vybíraných součástí (viz dřívější
záznamy) se ruší a nahrazuje **12 místnostmi v pevném pořadí**
(room-by-room, styl Homescapes/Gardenscapes): Plášť → Ubikace →
Koupelny → Jídelna a kuchyň → Ošetřovna → Kokpit → Navigace →
Nákladový prostor → Strojovna → Sklad paliva → Serverovna/jádro AI →
Komunikace. Každá místnost má 5 položek (celkem **60 položek**), další
místnost se odemyká až po kompletním dokončení té předchozí — v rámci
místnosti je pořadí položek volné. Zavedena levná/drahá varianta opravy
u normálních položek (drahá = levná × 1,6, kosmetická volba).

Plášť zvolen jako první místnost (objevovací, "co je vidět zvenku
první"), Komunikace jako poslední (narativně navazuje na odhalení
signálu a upgrade denního transportu, viz níže).

**Kontext/důvod:** Volný výběr mezi 5 součástmi nedával hráči přirozený
pocit postupu ani vizuální strukturu na úrovni typické pro žánr (kde se
prochází dům/loď pokoj po pokoji). Room-by-room struktura navíc řeší
škálovatelnost obsahu — jemnější dělení (60 položek místo 15) dává
menší, četnější kroky postupu, což cílí na dřív zaznamenané otevřené
riziko subjektivně krátké hry (viz záznam z 2026-08-24). Stejný celkový
tuning rozpočet (cena kapitoly 1), jen jemněji rozdělený mezi víc
položek.

**Dopad:** Zásadně přepisuje `game-design.md` sekci 5.5 (nová struktura
místností), sekci 6 (Raketa jako room hub), sekci 7 (nová tabulka
`docs/ekonomika-mistnosti.xlsx`).

---

## 2026-08-26 — Vylepšení místností jako explicitní MVP scope

**Rozhodnutí:** Volitelné vylepšení dokončených místností (např.
hibernační kapsle v Ubikacích) je **explicitní součást MVP**, ne
odloženo na post-MVP. Čistě volitelný sink, nepodmiňuje postup dál.

**Kontext/důvod:** Slouží jako retention buffer po dokončení viditelné
části obsahu a zároveň jako narativní most ke kapitole 2 — vylepšení
lodi na budoucí dlouhý let za signálem, potenciálně nahrazující/
sjednocující s dřívější myšlenkou "budovat vesmírnou stanici" jako
samostatnou fázi.

**Dopad:** Nová sekce 5.9 v `game-design.md`. Detailní seznam vylepšení
a jejich cena zůstávají TODO.

---

## 2026-08-26 — Povinné boss levely jako brána na konci každé místnosti

**Rozhodnutí:** Poslední (5.) položka každé ze 12 místností se **nedá
koupit za Kredity vůbec** — jde získat jen výhrou dedikovaného, výrazně
těžšího "boss levelu" (výchozí cíl ~30–35% úspěšnost, vs. ~60 % u
normálních levelů). Tohle je **striktní, neobejitelná podmínka**
dokončení místnosti — explicitně NENÍ možné ji nahradit grindem
libovolného množství normálních levelů. Výhra boss levelu dá navíc
bonusovou odměnu Kreditů (výchozí násobič 2× průměrné odměny za
normální level) — zatím čistě informativní "kapesné", nezapočítané do
výpočtu tempa kapitoly 1.

Boss levely jsou mechanicky odlišené od dřív zavedených volitelných
Hard levelů (nepovinná odbočka s lepší odměnou) — boss levely jsou
povinné, Hard levely ne.

**Kontext/důvod:** Autor designu zvažoval nejdřív měkčí variantu (boss
level jako alternativní cestu k odemčení vedle Kreditů), ale explicitně
ji zamítl — cílem je skutečná, neobejitelná brána na konci každé
místnosti, ne jen další způsob, jak "koupit" poslední položku. Přidává
to druhý typ friction (dovednost/štěstí), nezávislý na tom, kolik má
hráč Kreditů, a dělá z konce místnosti zapamatovatelný beat.

**Dopad:** Nová sekce 5.8 v `game-design.md`, aktualizace 5.3
(obtížnost), 5.5 (struktura položek), 7.1 (tabulka), 8 (generování —
boss preset odlišen od Hard levelů). Nová ladicí tabulka
`docs/ekonomika-mistnosti.xlsx` (v3, nahrazuje v2) — 48 normálních + 12
boss položek; při výchozích hodnotách (15 Kreditů/level, 60% win rate
normal, 8 pokusů/den, 35% win rate boss, cena normálních položek 550
Kreditů) vychází kompletní oprava na ~95,4 pokusů → ~11,9 dne → ~1,7
týdne — v cíleném rozmezí 1–2 týdny ("V CÍLI"). Otevřeno: finální
hodnoty win rate/bonusu, a jestli bonus Kreditů z boss výher má
financovat budoucí Mince (viz záznam o ekonomice výše) místo zůstat
čistě informativní.

---

## 2026-08-26 — Poznámka k architektuře: platformní portabilita

**Rozhodnutí:** Zaznamenána dlouhodobá architektonická preference (ne
MVP scope, ale rozhodnutí ovlivňující strukturu kódu od začátku): jádro
hry (herní logika, stav, UI) by mělo být oddělené od Telegram-specifické
vrstvy (Web App SDK, Stars platby, Telegram auth) tenkým adaptérem, aby
budoucí port na Google Play/App Store (přes Capacitor nebo podobný
WebView wrapper) při úspěchu hry nevyžadoval přepis, jen výměnu
adaptéru.

**Kontext/důvod:** Autor designu se ptal na proveditelnost budoucího
portu mimo Telegram "jen k zamyšlení" — nejde o okamžitou prioritu, ale
o rozhodnutí, které je výrazně levnější udělat správně od začátku než
předělávat zpětně.

**Dopad:** Poznámka doplněna do `game-design.md` sekce 1. Detailní
technické rozpracování (jak přesně adaptér vypadá, výběr Capacitor vs.
alternativy) patří do `architecture.md` — zatím jen zaznamenáno jako
otevřená otázka tam.

---

## 2026-08-26 — Pivot na jednodušší cestu levelů (branch `simple-path`)

**Rozhodnutí:** Vytvořena nová git větev `simple-path`, ve které se dál
vyvíjí **zásadně zjednodušená verze hry** — lineární cesta levelů ve
stylu Candy Crush, sci-fi téma, **bez** interaktivního hubu, ekonomiky
položek a druhé (progresní) měny. Struktura: **60 levelů / 12
tematických zón** po 5 levelech (stejná jména a pořadí jako místnosti na
`main` — Plášť → ... → Komunikace — recyklovaná jako čistě kosmetický
motiv zóny, ne jako nákupní systém), poslední level každé zóny je boss
level (~30–35 % úspěšnost). Jediná měna: **Mince**, výhradně na 3 typy
boosterů (extra tahy, odstranění políčka, zamíchání), jednotná cena 1
Mince/použití. UI zjednodušeno na dvě obrazovky — **Cesta** (aktivní
hraní) a **Loď** (pasivní, jen vizuální/narativní odměna po dokončení
zóny — hologram s odebíratelnými vrstvami poškození, 13 stavů). Řešení
vylepšení místností (5.9 na `main`) se pro tuhle verzi ruší — bez
interaktivního hubu nedává smysl.

Zásadní historie ale **zůstává zachovaná beze změny na větvi `main`** —
místnosti jako interaktivní hub, Kredity+Mince ekonomika, cheap/
expensive varianty, boss levely jako nákupní brána, room upgrades. Tenhle
model je kandidát na budoucí, komplexnější/ambicióznější titul (možná i
navazující kapitola, nebo úplně jiná hra), ne zahozený nápad.

Při diskuzi vyplynula i důležitá oprava mechaniky energie: **život se
ztrácí jen při neúspěchu levelu, ne za každý odehraný pokus** (žánrový
standard, stejný jako Candy Crush/Homescapes) — dřívější ladicí tabulka
(`ekonomika-mistnosti.xlsx` na `main`) počítala nesprávně s modelem, kde
energii stojí každý pokus. Tohle vysvětluje i dřív zaznamenané otevřené
riziko "hra se subjektivně zdá krátká i při matematicky V CÍLI tempu" —
u fail-only modelu energie tempo skoro neřídí, hlavní pákou je počet
levelů a obtížnostní křivka, ne ceny/odměny.

**Kontext/důvod:** Autor dělá svůj první herní projekt, sólo, s
omezeným rozpočtem. Cíl je vydat jednodušší, dobře prošlapanou a levnou
na výrobu mechaniku (žádné animace, hotové knihovny pro swap match-3,
žádná komplexní ekonomika k vyladění), naučit se na tom stavět a vydat
hru, a komplexnější meta-progresní model nechat na příště, až bude
zkušenost i případně rozpočet. Zvažováno bylo i srovnání s Candy Crush
(dnes tisíce levelů) — vyjasněno, že to je výsledek let přídavků po
launchi, ne startovní rozsah; díky procedurálnímu generátoru (viz GDD
sekce 8) je škálování nad rámec 60 autorských levelů prakticky bez
dalších nákladů na ruční práci.

**Dopad:** Nový, výrazně přepsaný `game-design.md` na větvi `simple-path`
(sekce 1–13 přepsané nebo upravené — ekonomika, struktura zón, UI,
tempo, generování levelů). `architecture.md` a poznámka o portabilitě
zůstávají platné beze změny. `main` zůstává nedotčená jako záznam
původního, komplexnějšího návrhu.
