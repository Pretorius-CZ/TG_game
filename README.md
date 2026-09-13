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

Enter the ship → Inspect repair → Play. Čtyři opravy v pevném pořadí:

| Oprava | Deska | Cíl | Viditelný výsledek |
|---|---|---|---|
| Emergency lights | 6 × 6 | 18 všech | Osvětlený strop a opravené kabely |
| Window seals | Vykrojené rohy | 12 modrých | Obnovené rámy a těsnění |
| Flight computer | 6 řádků × 5 sloupců | 15 zelených | Centrální displej online |
| Ship diagnostics | Otvor uprostřed | 30 všech | Boční displeje a zakryté kabely |

Výměna sousedů klepnutím nebo tažením. Spojení tří a více v řadě či
sloupci. Nápověda, kaskády a doplnění; bez boosterů, bez limitu tahů/času.
Po splnění cíle tlačítko opravy zobrazí změnu scény s tlačítkem pokračování.
Po poslední opravě See your ship ukáže osvětlený kokpit zvenku.
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
