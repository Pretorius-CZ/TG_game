# Pevný průchod první kapitolou

Schváleno a implementováno 2026-09-25 na základě testování: volný výběr
místností byl nepřehledný. Toto rozhodnutí nahrazuje původní souběžné opravy.

## Pořadí

1. Exteriér: pouze vstup do lodi, venkovní opravy zatím nejsou dostupné.
2. Přechodová komora: napájení, vnitřní průlez, těsnění.
3. Kokpit: světla, okna, počítač, diagnostika.
4. Navigační konzole v kokpitu: anténa, spojení, mapa, kurz.
5. Koridor: nejdřív ubikace, potom kuchyňka, nakonec strojovna.
6. Exteriér: plášť, kryty motorů, podvozek a nakonec tankování.
7. Závěrečný HARD level a tlačítko Launch přímo u lodi venku.

Všechny existující úkoly zůstávají, neměníme jejich ID, limity ani počty.
Po dokončení místnosti Continue vede na další etapu nebo zpět do koridoru,
kde je označená pouze následující místnost. Během první kapitoly není
volná navigace přes mapu ani tlačítko Zpět; mapa je seřazený přehled s
jediným pokračováním. Replay hotových úkolů aktuální etapy zůstává.
Mezi opravami komory/navigace se nevyžaduje odskok na náhled exteriéru.
Po odletu jsou prohlídky a návraty do dřívějších místností znovu volné.

## Uložené hry

Průvodce vybere první nedokončenou etapu. Opravy provedené ve starém
pořadí se nemažou ani neopakují. Pokud je hráč uložený mimo aktivní
etapu, dostane jasné pokračování k nejbližšímu nedokončenému kroku.
Hráči po odletu mohou pokračovat v expedicích jako dosud.

Komora nyní předchází kokpitu, proto lokální validace dovoluje
samostatné airlockCompleted i při completed=0. Pro cloud je nutné
spustit **supabase/007_linear_chapter.sql**. Obsahuje také 004–006,
lze jej spustit po 003 či novější migraci. Poté nepřepisovat funkce
staršími migracemi. Živé nasazení zatím není potvrzené.
Klient při starém serveru nehlásí komoru jako uloženou online a zachová
místní postup. Server stále slučuje opravy atomicky a chrání resetRevision.

## Ověření

57 automatických testů prošlo. Izolovaný mobilní průchod pomocí vývojového
Complete level prošel všemi 28 opravami v novém pořadí, ověřil obnovu
komory po reloadu ještě před kokpitem, pouze jedny aktivní dveře v koridoru,
HARD level venku a otevření odletu z exteriéru. Nejde o test vyvážení obtížnosti.
Implementace: src/chapterFlow.js, main.jsx, CrewQuarters.jsx, progressStorage.js.
