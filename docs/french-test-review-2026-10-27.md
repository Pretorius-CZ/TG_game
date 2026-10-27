# Francouzština — zastavení robota, 27. 10. 2026

Zdroj: uživatelem přiložený `francouzstina-3.zip`, report ze 7:05.
Uživatel zmiňuje level 25; přiložený desktopový běh ale výslovně
uvádí 53 odehraných a 53 vyhraných úrovní. Snímky 50–53 dokládají
plášť i následnou opravu motorů. Snímek 108-kapitoly potvrzuje první
kapitolu 29/29 a druhou 24/24. Poslední hra je stabilizace Havenu,
„Un dernier alignement · DIFFICILE“, nikoli plášť na úrovni 25.

Report uvádí 0 zbylé angličtiny, 0 přetečení a 0 JS chyb. Zastavil se
na dokončení expedice, kde nabízí aktivní „Poursuivre l’histoire“.

## Prověření

Nový `tests/browser/french-continuation.spec.js` prošel šesti scénáři:
šířky 320, 430 a 1920 px, v každé dokončení 25 → spuštění 26 a
dokončení 53 → brána → příběh → mapa → spuštění 54. Dokončení
výchozího levelu používá vývojové Complete level, další deska se
spouští normálně. Kontroluje uložený postup a JS chyby.

Samostatně ověřeno na skutečně nasazené
`https://game.playbeyondthesignal.com/?lang=fr`, s izolovanými profily
a uloženým postupem po 25 nebo 53 (ne přepisem hráčova profilu):

- 320×568: po 25 se otevře „Prêt à l’extérieur aussi“ (26), po 53
  „Alimentation de la bouée“ (54).
- 1920×1080: stejné oba výsledky.
- Ve všech čtyřech případech je skutečná deska připravená a žádná
  JavaScriptová chyba. Použit Chromium; skutečný iPhone/Safari tím
  není ověřený.

Hra na těchto místech nemá reprodukovanou blokaci. Přiložený automat
ukončil průchod před dostupným pokračováním. Archiv neobsahuje log
jeho rozhodování ani jeho implementaci, takže nelze přesně určit,
která podmínka robota pokračování odmítla. Produkční hru není důvod
podle tohoto reportu měnit; přibylo pouze ověření a dokumentace.

## Pokračování pro automatický test

Nerozhodovat o konci hry pouze podle počtu nalezených nových hotspotů
nebo podle anglického názvu tlačítka. Po poslední opravě oblasti je
nejprve potřeba potvrdit výsledek a případně projít přechod kapitoly.

Konkrétně po 53:

1. Kliknout `.repair-reveal .primary` („Poursuivre l’histoire“).
2. Počkat na `.transit-dialog`; nechat průlet doběhnout nebo použít
   `.transit-actions .primary`.
3. Projít `.caretaker-comic` přes její `.primary`, případně použít
   `.comic-skip`.
4. Na mapě kliknout `[data-node="buoy"]`.
5. Otevřít nedokončený `[data-repair-id]` a použít
   `.repair-bubble .primary` (francouzské „Jouer“).

Po 25 stačí potvrzení `.repair-reveal .primary`, které přímo otevře
zadání motorů (26), a pak `.repair-bubble .primary`.

Selektory jsou jazykově nezávislé. Při nové kontrole zachytit stav
na konci každého kroku a případné chyby, ne pouze finální seznam
viditelných tlačítek. Běh 53/200 neoznačovat jako celé otestování.

## Opravený test — francouzstina-4.zip, 17:24

Nový desktopový běh dokončil všech 200 úrovní (200 výher), poslední
„Transmettre la réponse · 200“. Snímek 410-kapitoly.png potvrzuje
všech deset kapitol: 29/29, 24/24, 16/16, 24/24, 12/12, 15/15,
20/20, 27/27, 20/20 a 13/13. Zastavení po 200 je konec aktuálního
obsahu, nikoli pokračující blokace po 25 nebo 53.

Katalog 2475/2475 bez problémů, zdrojová kontrola 1116 textů bez
chybějícího překladu, jazyková kontrola 2477 textů bez označených
cizojazyčných textů. Osm francouzských webových stránek prošlo.
Ve hře na Desktop 1920×1080: 0 zbylé angličtiny, 0 useknutí či
přetečení a 0 JS chyb.

Z reportu neplyne další oprava hry. Výsledek podporuje předchozí
zjištění, že zastavení bylo v postupu automatu. Tento běh nepotvrzuje
celý průchod na mobilu/Safari, nativní Android integrace, stylistickou
redakci rodilým mluvčím ani vhodnou obtížnost pro lidské hráče.
