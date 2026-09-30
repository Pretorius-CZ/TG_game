# Kapitola 6 — Probouzející se zahrada
Implementováno lokálně 2026-09-30. Dosavadní prázdný pohled za Trhlinou
(scéna beyond-rift) je nyní první hratelnou terasou Živého prstence.

| Úkol | Deska (sloupce × řádky) | Tahy | Kryty |
|---|---|---|---|
| Přistávací terasa | 7×7 | 23 | 0 |
| Zpáteční signál | 7×7, vykrojené rohy | 24 | 0 |
| Světelný most | 7×7 | 27 | 4 |
| Vodní kanály | 7×8 | 28 | 4 |
| Semenný archiv | 7×8, vykrojené kraje | 29 | 6 |
| Srdce zahrady — HARD | 7×8 | 32 | 8 |

Každý úkol má dva barevné cíle, finále tři. Používá technické dlaždice
Elysia, stávající nálože a pomocné boostery včetně testovacích reklam.
Limity jsou výchozí návrh k hraní, nikoli změřená lidská obtížnost.
Portály a rezonátory zatím nejsou implementovány.

## Příběh a ovládání
Šest anglických/českých bublin, výsledků a zápisů deníku. Výprava
postupně zajišťuje přistání a spojení, rozsvěcí most a obnovuje kanály.
Archiv potvrzuje dobrovolný odchod původní výpravy za signálem správce.
Finále odhalí další stopu ve vnitřním prstenci; další sektor zatím není hratelný.

Kliká se na aktuální zařízení přímo ve scéně. Po příletu se otevře první
úkol; z mapy Trhliny lze znovu vstoupit bez opakování průletu.
Replay nezvyšuje postup a nepřidává duplicitní deník. Po šestém úkolu
návrat na mapu; původní kapitoly zůstávají přístupné.

## Vizuální postup
Původní rift-beyond.webp se používá bez duplikování. Měkké masky
postupně obnovují barvy a jas. GardenArt doplňuje kruh terasy, maják,
světelné pásy mostu, proudící kanály, archiv a závěrečná světla zahrady.
Vrstvy sdílejí souřadnice pozadí. Bez tvrdého rozdělení obrazu na poloviny.
Omezené animace respektovány.

## Ukládání
gardenCompleted (0–6), dostupné jen při platném riftCrossed=1.
Lokální normalizace, slučování, reset i čtený deník zahrnují nové úkoly.
Pro cloud spustit supabase/013_garden.sql v Supabase SQL Editoru.
Migrace je kumulativní po003–012 a zachovává zámek účtu, RLS a resetRevision.
Živé SQL zatím není provedeno ani ověřeno. Klient starší server rozpozná,
místní postup zůstane uložený, ale nenahlásí falešné cloudové uložení.

Data: src/garden.js; grafika src/GardenArt.jsx a garden.css.
Průběh používá sdílené Exploration a MiniGame.

## Ověření
84 automatických testů a produkční build prošly. Nové testy zahrnují
180 generovaných desek, EN/CZ, odemykání, save, merge, reset a replay.
Izolovaný mobilní průchod všech šesti úkolů: skutečný tah a vývojové
dokončení, šest aktivací grafiky, návrat přes mapu, reload a replay.
Živá databázová migrace tímto ověřena není.
