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
