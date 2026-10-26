# Němčina — mobilní report 26. 10. 2026, 19:29

Uživatel vložil výsledky testu zalamování a viditelnosti textů:

- Zdroj: 1117 textů, bez německého překladu 0.
- Webový katalog: 2475/2475 ID, žádné problémy; /de 8/8.
- Jazyková kontrola: 2476 textů, žádný označený jako neněmecký.
- Pixel 7 / Android: 200/200 výher, poslední Die Antwort überbringen;
  zbylá angličtina 0, useknutí/přetékání 0.
- iPhone SE: 25/25 výher, poslední Eine Haut für das Schiff;
  zbylá angličtina 0, useknutí/přetékání 0. Robot nenašel pokračování.

Pixel ověřuje úplný mobilní průchod. iPhone ověřuje pouze první část;
zbývajících 175 úrovní na něm tímto reportem ověřených není.
Zastavení po 200 je očekávaný konec katalogu. Zastavení po 25 není
konec obsahu a samo nerozlišuje chybu hry od omezení robota.

## Cílené prověření návaznosti

Úroveň 25 odpovídá exterior-hull, následuje exterior-engines (26).
Přidán regresní scénář v ship-continuation.spec.js: němčina, 320×568,
dokončený interiér, dokončení pláště přes vývojové Complete level,
kontrola tlačítka další opravy, otevření jejího zadání a spuštění
skutečné desky. Uložený exteriorCompleted=1 a žádné vodorovné přetečení.
Chromium test prošel.

Tento test potvrzuje návaznost při rozměrech malého telefonu v místním
kódu. Není to skutečný iPhone/Safari ani důkaz příčiny původního
zastavení robota. Herní kód, překlady, CSS a pozice se neměnily.
Při opakování iPhone testu začít před 25, zachytit výsledek opravy,
tlačítko pokračování a stav načítání scény, potom dokončit zbytek.
