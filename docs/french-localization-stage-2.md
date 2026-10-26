# Francouzština — kapitoly 4–8, 26. 10. 2026

Navazuje na `french-localization-stage-1.md`. Uživatel rozšířil zadání
z prvních tří kapitol až do kapitoly 8. FR zůstává draft; veřejné menu,
automatická volba jazyka i odkazy webu se nemění.

## Doplněný obsah

- Elysium: šest sektorů, 24 úrovní, deníky a příběh opětovného odletu.
- Trhlina: tři expedice, 12 úrovní, stabilizace, návratová vazba, průlet
  a první dojem ze světa za průchodem.
- Živá mapa: zahrada, výzkum na Elysium a ztichlý reléový uzel,
  15 úrovní, výzkumné přechody a sestup do noční zahrady.
- Noční zahrada: čtyři oblasti, 20 úrovní, kořenový systém, paměť
  a setkání se správcem/gardien.
- Útočiště: dok, bydlení, ošetřovna, návratový koridor a přílet,
  27 úrovní; příprava domova, bezpečný návrat a uvítání zachráněných.

Celkem přibylo 98 úrovní, dohromady jsou přeložené kapitoly 1–8,
tedy 167/200 úrovní. Překlady obsahují názvy, myšlenky, výsledky,
akce, deníky, příběhové panely, místní navigaci a stavová hlášení.

FR katalog má 1675 game ID + 226 runtime ID. Včetně samostatného webu
je dostupných 2065/2481 zpráv v Android větvi, zbývá 416 ID. To není
počet chybějících slov ani úrovní: audit zahrnuje i historické statické
varianty cílů, které se ve hře skládají dynamicky.

## Ověření

- 289 unit testů prošlo. Audit kapitol 4–8 kontroluje všechna textová
  pole i související příběhy, bez chybějících překladů a se zachovanými čísly.
- Cíle všech nových 98 úrovní zachovávají také uměle změněné počty.
- 21 oblastí kapitol 4–8 zkontrolovaných na 320 a 430px (42 kombinací):
  přesné původní x/y značek, jména, hvězdy, viditelnost a klikatelnost,
  žádné překryvy popisků. Jde o dva hromadné Chromium scénáře.
- Samostatný test vykreslil devět příběhových sekvencí (přílet Elysium,
  odlet Elysium, Faille, výzkum, sestup, gardien a tři přechody Refuge),
  všechny jejich panely a pokračování. Zachované kontrolní hodnoty
  běžného postupu, energie, pomůcek, preference jazyka a statistik;
  žádné výsledky se neodesílaly.
- Android-mode ověřuje 21 oblastí na 320px a stejný příběhový průchod;
  jde o Chromium s Android adaptérem, nikoli fyzický telefon.
- Lokalizační audit a produkční build prošly.

Produkční komponenty, CSS, souřadnice, limity, cíle, herní pravidla,
save model ani databáze nebyly změněny. Přeložený obsah je pouze v FR
katalozích; nové soubory mimo ně jsou kontrolní testy a dokumentace.

## Zbývá

Kapitoly 9–10 (Archiv ozvěn a Odpověď), tedy posledních 33 úrovní,
závěr příběhu a zbývající textová místa mimo kapitolový obsah.
Potom samostatný přenos postupu, kontrola webových a právních názvů
ovládání, úplný audit a robotický průchod 200 úrovněmi na desktopu
i mobilu. Teprve po dokončení povolit FR veřejně pro web a Android.
