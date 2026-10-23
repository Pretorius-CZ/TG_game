# Opakování dokončených segmentů lodi před odletem

Uživatel nahlásil v APK zamčené dokončené segmenty. Příčina byla společná
webu i Androidu: `chapterSectionOpen` a `canVisitChapter` dovolovaly před
odletem pouze aktuální scénu, `openRepair` blokoval kokpit po přechodu na
navigaci a `CrewQuarters` skrýval všechny značky mimo aktivní etapu.
Vítězství při replay navíc nemohlo zavřít minihru v neaktivní místnosti.

Oprava:
- Kapitoly, mapa i průchody lodi dovolují navštívit segment s dokončenými
  opravami i před odletem. Chodba je dostupná také pro návrat do takové místnosti.
- V neaktivním segmentu se nabízí pouze dokončené opravy, nikoli další
  neodemčený level. Kokpit dovoluje replay dokončené opravy i po přechodu dál.
- Replay v neaktivní místnosti ukončí minihru bez zvýšení počtu oprav.
  Hvězdy používají dosavadní systém a lze si je opakováním zlepšovat.
- Lineární pořadí nových úkolů, cíle, limity, energie a ukládání se nemění.

Ověření: 267 unit testů Android větve; 9 Chromium integračních scénářů
nad vývojovým webem a stejných9 nad produkčním Android sestavením z APK.
Všech7segmentů lze z kapitol otevřít a spustit Replay lesson s deskou před
odletem. Další scénáře ověřují zámky budoucích místností a historický částečný
postup v neaktivní místnosti (jen dokončené značky). Žádné JS chyby a při
spuštění replay se dokončený postup nemění. Sestavení APK prošlo.
Test Android sestavení v Chromium nenahrazuje fyzické potvrzení na POCO.

Telefon je nutné aktualizovat přes Android Studio Run nad stejnou aplikací;
neodinstalovávat ani nemazat data. Webový přenos a publikace následují.

## Vydání a živá kontrola

Android oprava254879d je pushnutá; debug APK49109172B, sestavené
23.10.2026 18:59. Telefon fyzicky nebyl aktualizován nástroji tohoto úkolu.
Webová oprava222c4837b495 je zveřejněná: main1792774937354,
game1792774940445. Vlastní živých9Chromium scénářů výše prošlo9/9 i na
produkci, s analytikou blokovanou. MainCI39991703730 success;
gameCI39991703352 při poslední kontrole po publikaci instalovalo browser.
Webové unit264/264, build a dalších5Chromium regresí ukládání replayhvězd
(zavření/reload/nižší výsledek, izolace prvního dokončení a slepého testu)
prošly. Společné opravené soubory jsou v Androidu i webu stejné.
