# Archiv ozvěn — levely 168–187

Místní implementace na codex/cockpit-stage, 14.10.2026. Jedna ucelená kapitola9, čtyři oblasti po pěti opravách. Otevře se až po příchodu celé posádky do Útočiště (refugeArrivalCompleted6). Produkce dosud obsahuje167 levelů; klient s archivem potřebuje SQL031 před nasazením.

## Příběhová návaznost

Zachráněný navigátor přináší souřadnice starého archivu. Záchranný let tam nemohl zastavit; posádka je nyní v bezpečí, takže pilot může prozkoumat původ zpráv. Elysium zůstává partnerem pro zálohy a srovnání, Haven bezpečným zázemím a Útočiště potvrzuje návrat. Nezavádíme nového nepřítele ani paradox.

- Přístupový prstenec: oprava vstupu a odděleného napájení, žádné předčasné spuštění všech pamětí.
- Datové sály: původní pakety se nejdřív zálohují. Síť rozlišuje lidské zprávy od automaticky vybíraných tras. Varování před identifikací chránilo návštěvníky před zastaralým automatickým přiřazením cíle, nikoli před pronásledovatelem.
- Simulační komora: čas na lodi, Havenu a Elysiu souhlasí. Retranslátor opakoval staré hlavičky; nešlo o cestování do minulosti. Rekonstrukce potvrzuje cestu výpravy a odděluje staré nebezpečné trasy od skutečně ověřených.
- Centrální paměť: archiv popisuje starší záchrannou naváděcí síť sdílenou stanicemi a správci zahrad. Lidská žádost putovala systémem s neúplnými aktualizacemi. Správce zahrady je místní účastník, nikoli celá síť. Zprávu o návratu zapisujeme místně; její hlavní stanice ji ještě nedostala.

Závěr poskytne souřadnice tří přerušených spojení majáků. Jejich průzkum/obnova a centrální záchranná stanice jsou další obsah, ne implementované scény. Archiv tedy odhalí účel signálu, ale automaticky neopraví celou síť.

## Konfigurace a první odhad obtížnosti

Využíváme známé nálože, kryty a rezonátory; žádné nové neotestované pravidlo pro padající kapsle. Sada Elysium odpovídá archivním modulům a datům. Čtyři vlastní portrétové WebP scény; postupné světelné a holografické efekty v ArchiveArt reagují pouze na dokončené opravy, respektují reduced-motion a neblokují ovládání. Projektové originály zůstávají v generated_images, herní soubory jsou v public/scenes.

|Level|Oblast / oprava|Deska|Tahy|Kryty|Rezonátory|Výhry automatu|
|---|---|---|---:|---:|---|---:|
|168|Trace the archive approach|7×7|25|0|—|97%|
|169|Isolate the archive power|7×8|28|4|—|93%|
|170|Steady the archive service dock|8×8|30|0|3,3|97%|
|171|Restore the archive air loop|7×8|29|4|—|97%|
|172|Open the archive entry lock · HARD|8×8|29|3|4,4|63%|
|173|Copy the untouched records|7×7|25|0|—|93%|
|174|Rebuild the route index|7×8|28|4|3|70%|
|175|Repair the packet checksums|7×8|30|4|—|87%|
|176|Decode the identity warning|8×8|29|0|3,3|87%|
|177|Recover the expedition handover · HARD|8×8|29|3|4,4|70%|
|178|Synchronise the recording clocks|7×7|25|0|—|97%|
|179|Restore the recorded probe track|7×8|28|4|—|97%|
|180|Reconstruct the crew’s route|8×8|30|0|3,3|100%|
|181|Compare the safe and obsolete routes|7×8|29|4|3|77%|
|182|Verify the reconstructed journey · HARD|8×8|31|3|4,4|50%|
|183|Isolate the central memory reader|7×7|25|0|—|90%|
|184|Recover the routing authority|8×8|28|0|3,3|83%|
|185|Record the crew’s confirmed return|7×8|30|4|—|97%|
|186|Recover the missing beacon links|8×8|29|0|3,3|87%|
|187|Save the answer for the network · HARD|8×8|29|3|4,4|53%|

Simulace30 pokusů/level cíleným automatem bez pomůcek a bonusových tahů. Nejde o lidskou úspěšnost; finále simulační komory bylo změněno29→31 tahů a znovu simulováno. Člověk využívá i pomůcky, které automat nemá. Osobní hraní a ladění z živé analytiky následuje. `node scripts/balance-archive.mjs 30`.

## Kapitoly po sjednocení

|Kapitola|Celek|Levely|Počet|
|---|---|---|---:|
|1|Loď|1–29|29|
|2|Kepler Reach|30–53|24|
|3|Aster Veil|54–69|16|
|4|Elysium|70–93|24|
|5|Trhlina|94–105|12|
|6|Živá mapa (prstenec, výzkum, retranslátor)|106–120|15|
|7|Noční zahrada|121–140|20|
|8|Útočiště (domov, návratová trasa, přílet)|141–167|27|
|9|Archiv ozvěn|168–187|20|

ID scén, oprav a uložená pole původních oblastí se nemění. Číslování kapitol je prezentační; hra nepoužívá číslo kapitoly jako klíč účtu. Prvních167 položek katalogu je porovnáno hashem s produkcí065b30c, včetně ID, pořadí, názvů, limitů a rozměrů. Podmínky přístupu zůstávají pro jednotlivé oblasti; souhrnná otevřená kapitola neodemkne pozdější sekce.

## Cloud a nasazení

Čtyři pole archiveEntryCompleted, archiveDataCompleted, archiveSimulationCompleted a archiveCoreCompleted0–5. Normalizace/sloučení/reset zachovávají předpoklady, deníky a hvězdy. Další oblast až po5/5 předchozí, replay nezvyšuje postup. Nové místní scény nejsou vydávány za uložené online, pokud starý server tato pole nepodporuje.

Spustit `supabase/031_archive_echoes.sql` v Supabase SQL Editoru po030. Kumulativní herní migrace v transakci rozšiřuje pole, povolené scény, hodnocení187 a reset. Nezasahuje do samostatné analytiky026–028. Živé provedení SQL031 zatím nepotvrzené; produkční push až po potvrzení.

## Ověření

186 unit testů a build prošly. 400 počátečních desek archivu prověřeno na platné tahy a nepřítomnost úvodních spojení, přeložený obsah všech oprav a deníků, přístup/pořadí/replay/reset/sloučení, současný SQL katalog a zachování původních167 levelů.

Izolovaný mobilní browser390×844 prošel20 úkolů v EN/CZ přes vývojové dokončení, přechody mezi čtyřmi oblastmi i reload. Síť mimo lokální server blokovaná: žádné testové zápisy do živé analytiky. Screenshoty vstupu a centrální paměti zkontrolované. Nejde o ruční odehrání všech miniher; cloud mezi skutečnými zařízeními zbývá ověřit.
