# Francouzština — úplný pracovní překlad, 26. 10. 2026

Následná aktualizace: uživatel požádal o online test. FR je nyní
zpřístupněna v menu; další stav viz `french-release-2026-10-26.md`.
Popis draftu níže zachycuje stav před tímto zpřístupněním.

Dokončení etap 1–3 a 4–8: zbývající Archiv ozvěn (20 úrovní),
Odpověď (13 úrovní), deníky, závěrečné příběhy a ostatní chybějící
hlášení. Celkem 200/200 úrovní a 2481/2481 zpráv v Android větvi,
bez chyb lokalizačního auditu. Historické statické varianty cílů
jsou vyplněné také; živé počty nadále obsluhují dynamické překlady.

Přeložená je samostatná stránka přenosu postupu včetně chyb,
potvrzení importu, konfliktů, záloh a přerušeného přenosu.
Vývojový parametr `previewLanguage=fr` umožňuje ověřit obě strany
přenosu bez povolení draftu běžným hráčům. Předává se i do okna
původní adresy. Validace záloh, původy zpráv, nonce a pravidla
slučování zůstávají původní. Uložený jazyk draft nepřepisuje.

## Ověření

- 290 unit testů prošlo. Úplný audit textových polí všech kapitol,
  deníků a příběhů, zachování čísel i uměle změněných cílů všech
  200 úrovní; žádné chybějící překlady. Vlastní název Kepler Reach
  zůstává záměrně stejný (nemá samostatné ID ve zdrojovém katalogu).
- Chromium: rozhraní a změna jazyka rozehrané hry na 320/430/1024 px;
  úvod, nastavení a oprava; všech 36 expedičních oblastí na 320 a
  430 px; původní x/y značek, názvy, hvězdy, překryvy popisků a
  klikatelnost; replay poslední kapitoly.
- 13 příběhových sekvencí v izolovaném náhledu až po závěr úrovně
  200. Běžný postup, energie, pomůcky, jazyk a statistiky zůstávají
  zachované a výsledky se neodesílají.
- Francouzský přenos přes skutečné okno mezi dvěma místními původy:
  zachovaný postup, energie 2/5, zásoby pomůcek a česká preference;
  francouzská chyba neplatné zálohy. Regresní německý přenos také.
- Android-mode: všech 36 oblastí na 320 px a všech 13 sekvencí prošlo.
  Jde o Chromium s Android adaptérem, nikoli fyzický telefon.
- Lokalizační audit, produkční webový i Android build a produkční pojistka proti
  zapnutí draftu prošly.
- Firefox se lokálně nepodařilo spustit (`spawn UNKNOWN`), WebKit
  nebyl stabilní při vytvoření stránky. Tyto pokusy nejsou vydávány
  za úspěšné ověření těchto prohlížečů ani Safari.

Kontrola odhalila těsný překryv u Verdant world na 320 px. Název
„Water circulation“ byl zkrácen na „Circuit d’eau“. Souřadnice,
CSS, desky, cíle, limity, ekonomika, ukládání a herní pravidla se
neměnily.

## Stav před vydáním

FR je stále `draft`. Veřejné EN/CS/DE menu a produkční preference
zůstávají zachované; změny jsou místní, bez nasazení a bez nové APK.
Náhled: `/tests/browser/localization-preview.html?previewLanguage=fr`,
první kapitola: `/?previewLanguage=fr`.

Další krok je úplný robotický a lidský průchod francouzštiny, včetně
malého telefonu. Nejde o náhradu skutečně odehraných 200 úrovní.
Po vyhodnocení povolit FR veřejně a vydat do obou větví/webu/APK.
Francouzský informační web je již přeložený; zatím pravdivě uvádí
anglickou hru, proto v návodech ponechává její názvy Settings/Chapters.
Při vydání hry změnit tyto odkazy na skutečné francouzské názvy a
PLAY směrovat do FR. Doplnit aktualitu o vydání teprve při nasazení.
