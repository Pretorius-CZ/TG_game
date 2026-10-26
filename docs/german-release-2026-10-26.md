# Německé vydání — 26. 10. 2026

Uživatel požadoval dokončit pouze němčinu a zachovat herní rozložení.
Nabídka hry nově obsahuje English / Čeština / Deutsch. DE lze otevřít
přímo přes `?lang=de`, z německého webu, uloženou volbou nebo německou
preferencí prohlížeče při prvním spuštění. Existující volba EN/CS má přednost
před jazykem prohlížeče. FR, ES a PT-BR zůstávají ve hře nedostupné.

## Rozsah

- Kompletní katalog všech 200 levelů, 10 kapitol, deníků, příběhu,
  ovládání, cílů, nápověd, reklam, souhlasů a Android přihlášení.
  Kontrola 2478/2478 zpráv na Android větvi; webová větev nemá šest
  specifických zpráv nativního přihlášení (2472/2472).
- Německý načítaný katalog nyní zahrnuje i webové zprávy. Redakčně
  sjednoceny názvy Riss, popisy Undo a odkazy na Einstellungen.
- Německé PLAY a přenos na informačním webu vedou na `lang=de`.
  Změněny jen odpovídající německé texty a generované německé stránky.
- Stránka přenosu má německé vysvětlení, tlačítka, souhrn importu,
  obnovení přerušeného přenosu a chybová hlášení. Popup zachová jazyk.
- Validace zálohy přijímá přesné kódy vydaných jazyků včetně `de`.
  Slučování postupu, spotřeba zásob, identita účtu ani pravidla obnovy
  se nemění. Opakovaný import stále nedoplňuje energii či pomůcky.
- Slepý test má volbu německé herní desky a německou akci hodnocení.
  Dosavadní české instrukce výzkumného rozhraní i jeho pravidla zůstávají.

## Ověření

- 285 Android unit testů včetně všech 200 německých cílů a jejich
  změněných čísel, pokrytí kapitol, katalogu a přenosu preference DE.
- Přímý veřejný vstup DE, reload a zachování uloženého postupu.
- Přepnutí DE → CS → EN → DE během rozehrané minihry zachovává
  přesně index, typ, x/y a velikost každé dlaždice, tahy, cíle a energii.
- Německá nápověda na 320/430/1024 px; 36 dokončených expedičních
  oblastí na DE320/DE430 a kontrolně CS320. Původní x/y značek,
  názvy, hvězdy, dostupnost tlačítek a replay ověřené.
- Německý přenos mezi dvěma originy a souborová chyba, původní
  přenosové scénáře EN/CS, jazykové vstupy webu a izolace slepého testu.
- Německé Undo se zkušební reklamou na 320 px: reklama sama tah
  nevrátí; až potvrzení obnoví přesně původní desku.
- 11 Android-mode scénářů včetně Google mocku, německého přihlášení
  a zrušení přihlášení se zachovaným hostem. Nejde o fyzický telefon.
- Produkční web i Android: DE funguje bez vývojového parametru;
  `previewLanguage=fr&lang=fr` nezpřístupní nedokončenou francouzštinu.
- APK sestavené přes `npm run android:apk`. Instalaci na telefon
  provede uživatel běžným Run v Android Studiu.

## Zachovaný rozsah hry

Žádné změny CSS, rozměrů desek, souřadnic značek, konfigurací levelů,
počtu tahů, cílů, pravidel match-3, odměn, verze balancu ani herních scén.
`main.jsx`, `MiniGame.jsx`, `CrewQuarters.jsx`, `CompletedRepairs.jsx`,
`repairLabels.js`, `match3.js` a `levelRules.js` zůstaly beze změny.
Není potřeba SQL migrace.
