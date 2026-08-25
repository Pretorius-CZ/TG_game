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
