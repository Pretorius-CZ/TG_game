# Audit obtížnosti a pomůcek — 2026-09-28

Návrh, limity ve hře se nemění. Uživatel zvládá prakticky vše na první pokus.
Simulace: scripts/audit-balance.mjs 50. Cílený krátkozraký automat, bez
placených pomůcek, bez +5 tahů. Používá nálože vznikající na desce.
50 seedů na level je orientační screening, nikoli lidská úspěšnost.
Audit zahrnuje opravy/expedice a přílet k Elysium, nikoli launch-check.

## Návrh prvního testu
- Inner hatch 12 → 9, Airlock seals 12 → 10.
- Communications 12 → 9, Star chart 30 → 25, Flight route 12 → 10.
- Engine nacelles 15 → 11, Landing gear 30 → 18, Fuel depot 30 → 26.
- Ice laboratory / Wreck archive 26 → 22, Haven outer dock 24 → 20.
- Computer, Diagnostics, Crew ventilation zatím nesnižovat: automat má
  nízkou úspěšnost, uživatelův průchod porovnat s využitím náloží/pomůcek.
- Návrhy nových limitů ještě nejsou samostatně nasimulované.

## Pomůcky a odměny
Návrh: ruční pomůcky až od kapitoly 2, postupné odemykání Laser → Shuffle
→ Swap → Beam → EMP. První odemčení dá jednorázově 1 kus; dokončení celé
lokace později může odměnit jedním vybraným kusem, replay odměnu neduplikuje.
Nálože za 4/5 kamenů na desce zachovat: tvoří strategii, nejsou inventář.
Dosavadní testovací zásobu zavedenou všude později převést bez mazání účtů.
Reklama dobrovolně +5 tahů na stejné desce nebo 1 pomůcka; hra má jít
vyhrát i bez ní. Žádné skryté přitvrzování podle odmítnutí reklamy.
Před reklamními odměnami potřebujeme serverový inventář a jednorázové
udělení odměny až po potvrzení poskytovatelem. Současný lokální stav
není ochrana placeného inventáře.

Při testu zaznamenat: level, pokus, zbylé tahy, použité pomůcky a +5.
Cílový rytmus k ověření lidmi: lehký úvod, několik běžných levelů,
jeden těžší závěr lokace; nikoli souvislá řada blokujících obtížných her.

## Výsledky současné verze

| Level | Tahy | Výhry automatu | Průměr zbývajících tahů při výhře |
|---|---:|---:|---:|
| airlock-power | 20 | 90 % | 5 |
| airlock-inner-hatch | 12 | 100 % | 6.6 |
| airlock-seals | 12 | 98 % | 4.1 |
| lights | 14 | 78 % | 2.7 |
| windows | 16 | 92 % | 3.8 |
| computer | 24 | 42 % | 3.8 |
| diagnostics | 24 | 30 % | 3.2 |
| nav-antenna | 20 | 68 % | 3.9 |
| nav-receiver | 12 | 98 % | 4.7 |
| nav-chart | 30 | 94 % | 8.9 |
| nav-route | 12 | 100 % | 4.1 |
| crew-ventilation | 10 | 26 % | 1.2 |
| crew-filters | 14 | 82 % | 2.2 |
| crew-bunk | 16 | 62 % | 2 |
| crew-cabin | 18 | 36 % | 2.1 |
| galley-water | 12 | 64 % | 2.8 |
| galley-cold | 10 | 96 % | 3.4 |
| galley-racks | 20 | 68 % | 3.6 |
| galley-food | 13 | 100 % | 4.6 |
| engine-cooling | 19 | 66 % | 3.8 |
| engine-fuel | 20 | 72 % | 4.1 |
| engine-power | 22 | 68 % | 3.4 |
| engine-drive | 25 | 78 % | 6.1 |
| engine-test | 13 | 96 % | 4 |
| exterior-hull | 25 | 60 % | 5.3 |
| exterior-engines | 15 | 100 % | 7.7 |
| exterior-landing-gear | 30 | 100 % | 18.9 |
| exterior-refuel | 30 | 86 % | 8 |
| mine-pad | 14 | 92 % | 4.1 |
| mine-hatch | 14 | 82 % | 4.1 |
| mine-power | 17 | 82 % | 3.7 |
| mine-drill | 16 | 66 % | 4 |
| mine-terminal | 17 | 70 % | 3.4 |
| mine-lift | 19 | 58 % | 2.8 |
| ice-beacons | 23 | 88 % | 7.1 |
| ice-airlock | 24 | 90 % | 7.5 |
| ice-heater | 27 | 58 % | 5.3 |
| ice-lab | 26 | 94 % | 7.5 |
| ice-dish | 28 | 62 % | 6.3 |
| ice-cells | 30 | 82 % | 5.2 |
| wreck-dock | 23 | 82 % | 6.6 |
| wreck-bulkhead | 24 | 88 % | 7.2 |
| wreck-reactor | 27 | 58 % | 5.3 |
| wreck-records | 26 | 94 % | 7.5 |
| wreck-antenna | 28 | 78 % | 6.3 |
| wreck-cargo | 30 | 76 % | 6.9 |
| haven-dock | 24 | 96 % | 6.9 |
| haven-power | 25 | 66 % | 4.9 |
| haven-ring | 28 | 78 % | 7.5 |
| haven-coupler | 28 | 82 % | 6.2 |
| haven-route-coordinates | 29 | 64 % | 5.7 |
| haven-stabilize | 34 | 70 % | 7.6 |
| buoy-power | 22 | 64 % | 4.2 |
| buoy-antenna | 24 | 74 % | 5.7 |
| buoy-archive | 26 | 82 % | 7.6 |
| verdant-pad | 23 | 92 % | 5.2 |
| verdant-water | 24 | 78 % | 5.4 |
| verdant-power | 25 | 58 % | 5.4 |
| verdant-habitat | 26 | 60 % | 4.5 |
| verdant-scanner | 28 | 64 % | 4.8 |
| verdant-sample | 30 | 70 % | 6.3 |
| fracture-bridge | 24 | 80 % | 5.1 |
| fracture-generator | 25 | 62 % | 4 |
| fracture-drill | 27 | 66 % | 5.3 |
| fracture-spectrum | 28 | 72 % | 6.4 |
| fracture-sorter | 29 | 56 % | 3.5 |
| fracture-probe | 31 | 74 % | 6.4 |
| elysium-route | 30 | 62 % | 5.6 |
| elysium-dock-guidance | 25 | 82 % | 4.9 |
| elysium-dock-tunnel | 26 | 84 % | 5.5 |
| elysium-dock-pressure | 28 | 70 % | 4.1 |
| elysium-dock-cargo | 29 | 80 % | 6.2 |
| elysium-core-cooling | 27 | 80 % | 6.1 |
| elysium-core-grid | 28 | 78 % | 6.8 |
| elysium-core-ignition | 30 | 62 % | 4.5 |
| elysium-core-safeguards | 33 | 88 % | 8.6 |
| elysium-ring-bulkhead | 27 | 80 % | 5.3 |
| elysium-ring-transit | 28 | 80 % | 5.6 |
| elysium-ring-junction | 30 | 54 % | 5.6 |
| elysium-ring-lighting | 32 | 78 % | 6.4 |
| elysium-homes-air | 28 | 80 % | 5.6 |
| elysium-homes-water | 29 | 64 % | 5.3 |
| elysium-homes-quarters | 31 | 70 % | 8.1 |
| elysium-homes-commons | 32 | 76 % | 5.5 |
| elysium-garden-irrigation | 29 | 74 % | 5.2 |
| elysium-garden-climate | 30 | 80 % | 6 |
| elysium-garden-nursery | 32 | 66 % | 5.4 |
| elysium-garden-balance | 34 | 74 % | 7.3 |
| elysium-observatory-optics | 30 | 72 % | 6.2 |
| elysium-observatory-uplink | 31 | 76 % | 5.8 |
| elysium-observatory-chart | 33 | 66 % | 5.1 |
| elysium-observatory-beacon | 35 | 72 % | 6 |
| rift-echo-listen | 25 | 72 % | 4 |
| rift-echo-clock | 27 | 60 % | 4.1 |
| rift-echo-bearing | 29 | 58 % | 4.3 |
| rift-echo-route | 31 | 74 % | 5.2 |
| rift-platform-receiver | 27 | 74 % | 5.3 |
| rift-platform-recorder | 29 | 56 % | 4.6 |
| rift-platform-probe | 31 | 66 % | 5.3 |
| rift-platform-shield | 33 | 78 % | 5.9 |
| rift-beacons-anchor | 29 | 68 % | 4.6 |
| rift-beacons-phase | 31 | 66 % | 5.5 |
| rift-beacons-return | 33 | 64 % | 4.8 |
| rift-beacons-stabilize | 35 | 66 % | 5 |

## Schváleno a nastaveno
Uživatel schválil výše uvedených 11 změn tahů pro ostrý mobilní test.
Limity implementovány; tabulka simulace výše zachycuje původní stav.
Odemykání pomůcek a odměny zůstávají návrhem, nejsou součástí této úpravy.
