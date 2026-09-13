# To the Stars — první etapa kokpitu

React + Vite, hra na výšku. Herní texty anglicky, dokumentace česky.
Pracovní název; Supabase a Telegram přihlášení zatím nejsou připojené.

## Spuštění a ověření

```sh
npm install
npm run dev
npm test
npm run build
```

## Průchod kokpitem

Enter the ship → Airlock → Enter cockpit → Inspect repair → Play. Čtyři opravy v pevném pořadí:

| Oprava | Deska | Cíl | Viditelný výsledek |
|---|---|---|---|
| Emergency lights | 6 × 6 | 18 všech | Osvětlený strop a opravené kabely |
| Window seals | Vykrojené rohy | 12 komet | Obnovené rámy a těsnění |
| Flight computer | 6 × 6 | 15 krystalů | Centrální displej online |
| Ship diagnostics | 6 sloupců × 7 řádků | 30 všech | Boční displeje a zakryté kabely |

Výměna sousedů klepnutím nebo tažením. Spojení tří a více v řadě či
sloupci. Nápověda, kaskády a doplnění; bez boosterů, bez limitu tahů/času.
Po splnění cíle tlačítko opravy zobrazí změnu scény s tlačítkem pokračování.
Po poslední opravě Return to airlock vrátí do komory; přes Exterior lze vidět osvětlený kokpit zvenku.
Motory se nezapnou a poškozený plášť zůstává pro budoucí etapu.

Repairs otevře přehled hotových, dostupných a zamčených oprav. Dokončené
opravy lze prohlížet a minihry opakovat bez přidání další odměny.
Odchod před výhrou opravu nedá. Obnovení stránky resetuje postup:
ukládání do databáze ještě není implementované.

## Struktura

- `src/main.jsx`: scény, přehled oprav a jejich vizuální odměny.
- `src/MiniGame.jsx`: parametrizovaný match-3 level.
- `src/match3.js`: nezávislá pravidla včetně masek a gravitačních úseků.
- `src/repairs.js`: pořadí oprav a konfigurace jednotlivých levelů.
- `tests/`: pravidla, konkrétní desky oprav, barevné cíle a ochrana postupu.
- `public/scenes/`: PNG návrhy a sedm optimalizovaných WebP stavů pro hru.
- `Images/`: původní grafické podklady.

Kokpit je pouze první etapa opravy celé lodi. Další etapa pláště není
hratelná. Historie a plán jsou v `docs/game-design.md` a `docs/decisions-log.md`.

Porovnání před/po bylo odstraněno. docs/story-proposal.md obsahuje
schválenou logiku lodního deníku (2026-09-12); deník je implementovaný pro čtyři opravy kokpitu.

Příběh schválen: pilot zásobovací lodi, odbočení za majákem ztracené výpravy,
nouzové přistání chránící pilota. Opravy odhalují deník; později živá odpověď
a odlet za signálem. Kapitola 1 vysvětlí havárii, kapitola 2 hledá vysílajícího.
Další úpravy příběhu pouze kosmetické, základní logiku znovu neotevírat.

Lodní deník: Ship log pod navigací, New log entry po opravě. Čtyři anglické
zápisy, zamčené budoucí útržky, nepřečtené značky a nepovinné čtení.
Data src/logEntries.js, UI src/ShipLog.jsx. Odemykání plyne z oprav; replay
zápisy neduplikuje. Čtení ani přeskočení nemění postup. Stav jen v paměti.

Před opravou se nad kokpitem otevře komiksová bublina pilota s krátkou
anglickou myšlenkou, cílem a tlačítkem Play. Dostupná přes zařízení i přehled
oprav; replay používá kratší text. Odhalení příběhu zůstává v deníku po výhře.
Komponenta src/RepairBubble.jsx, texty v src/repairs.js.

Aktualizace 2026-09-13: vesmírné PNG dlaždice v public/tiles (prompty v README).
První tři desky mají 6 sloupců × 6 řádků (okna mají vykrojené rohy),
diagnostika plných 6 sloupců × 7 řádků a pět typů. Ostatní levely čtyři typy.
Cíle oken a počítače jsou 12 komet a 15 krystalů. Šestý orb připraven pro později.

Plán dalších místností a oprav: [roadmapa lodi](docs/roadmap-ship.md).
