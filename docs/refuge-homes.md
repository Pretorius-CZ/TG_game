# Útočiště — obytný blok, levely 146–150

Implementace 2026-10-04. Odemčení po pěti opravách příletového doku; původní postup zůstává zachovaný.

| Level | Úkol | Deska | Tahy | Mechaniky |
| --- | --- | --- | ---: | --- |
| 146 | Čistý vzduch | 7×8 | 27 | filtry a energie, 4 kryty |
| 147 | Recyklace vody | 7×8 s rohovými výřezy | 28 | chladicí náplně a filtry, 4 kryty |
| 148 | Topný okruh | 8×8 | 30 | energie a živá semena, 1 rezonátor, oddělené kryty |
| 149 | Spací oddíly | 8×8 | 29 | zásobovací kapsle a energie, 6 krytů |
| 150 | Zajištění obytného bloku | 8×8 | 34 | tři sběrné cíle, 1 rezonátor a kryty |

Používá stávající dlaždice Útočiště. Vlastní výchozí a opravená portrétová WebP scéna, pět obrazových odhalení s měkkými maskami, pět EN/CZ zápisů. Ošetřovna je další příběhový směr, zatím nehratelná.

Postup `refugeHomesCompleted` 0–5: lokální ukládání, merge, reset a validace návaznosti. Pro účet spustit kumulativní `supabase/023_refuge_homes.sql` v Supabase SQL editoru; migrace je připravená, živé nasazení nebylo provedeno. Kontrola cloudové odpovědi chrání místní postup, pokud server nové pole ještě nepodporuje.

Ověřeno: 143 testů, produkční build; izolovaný mobilní náhled 390×780 — všech pět oprav, návrat do doku, reload a replay. Přeskočení používá vývojové tlačítko, není měřením lidské obtížnosti.

Grafika vytvořená imagegen: malý praktický obytný modul, ventilace vlevo, vodní recyklace vlevo dole, lůžka vpravo, tepelné potrubí vpravo dole, kulaté okno a společný stůl. Opravená varianta zachovává kompozici a doplňuje provozní osvětlení a vybavení. Runtime soubory jsou WebP v public/scenes.
