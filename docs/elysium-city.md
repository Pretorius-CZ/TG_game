# Elysium — dokončení tří sektorů

Implementováno 2026-09-27. Pevné pořadí celé kapitoly:
dok4 → jádro4 → prstenec4 → obytný sektor4 → biosféra4 → observatoř4.
Celkem24oprav + přibližovací level, 26deníků včetně trasy a příletu.

| Sektor | Čtyři úkoly | Tahy |
|---|---|---|
|Obytný|Atmosféra, voda, byty, společné prostory|28/29/31/32|
|Biosféra|Zavlažování, klima, živý vzorek, ekosystém|29/30/32/34|
|Observatoř|Optika, spojení, návratový koridor, uvítací maják HARD|30/31/33/35|

Každá etapa: první3desky7×7, poslední7×8; druhý level má vykrojené rohy.
Šest dlaždic Elysia, Pulse/Nova. Kryty až ve třetím levelu4, poslední6.
Číselné cíle a limity jsou návrh k testování; staré levely nezměněné.

Příběh: ochranný režim zachoval domovy pro návrat. Biosféra využije vzorek
ze Zeleného světa (bez další spotřební ekonomiky). Observatoř obnoví spojení
s Havenem a bezpečný návratový koridor. Poslední deník potvrzuje přípravu
návratové posádky. Dokončení zobrazuje Probuzené město / A city awake,
všech6sektorů v provozu a tlačítko na odpověď. Další kapitola se nevymýšlí
jako falešně hratelný obsah; všechny sektory zůstávají dostupné pro replay.

## Implementace
Data `src/elysiumLater.js`, společné registry a brány `src/elysium.js`.
Mapa `Elysium.jsx`, interiéry sdílené `Exploration.jsx`. Nové sedmice WebP
scén v public/scenes. Dílčí opravy měkkými alfa maskami, plný obraz při4/4.
Nižší hotspoty mají název nad značkou, aby jej neschovala spodní nápověda.
Mapa má min740px, na malém displeji lze posunout; závěrečná karta nesmí
překrýt vstupy do sektorů.

## Ukládání
Nová pole elysiumHomesCompleted/elysiumGardenCompleted/
elysiumObservatoryCompleted, všechna0–4. Validace vyžaduje předchozí etapu,
merge zachová postup a resetRevision zabrání návratu starých oprav.
Dokončení kapitoly se odvozuje ze všech6čítačů, žádná další proměnná.

**Cloud potřebuje supabase/011_elysium_city.sql.** Je kumulativní po003–010,
tedy nahradí také potřebné definice009/010. Obsahuje sync a reset, stejnou
návaznost jako klient a limit256čtených deníků pro rozšířený archiv.
Živé spuštění migrace nepotvrzené; lokální ukládání ověřené.

## Ověření
71 unit testů: návaznosti, všechny25desky, cíle EN/CZ, serializace,
slučování, replay a reset. Izolovaný mobilní průchod všech12nových oprav,
platný běžný tah v každém sektoru, uložení/reload, závěrečný deník a mapa6/6.
Grafika bez404 a JS chyb. Vizuální kontrola dílčích i hotových scén.
