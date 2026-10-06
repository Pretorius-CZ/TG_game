# Balíček itch.io

První balíček připraven 2026-10-05. Obsahuje všech 150 miniher včetně
hodnocení hvězdami. Plný ZIP má přibližně 152 MiB (154 MiB rozbalený,
209 souborů); optimalizace a postupné načítání grafiky nejsou součástí této dávky.

## Sestavení

Spustit `npm run build:itch`. Číslo vydání spravuje `itch-release.json`.
Aktuální připravené vydání je **0.1.2**; výstup `releases/beyond-the-signal-itch-v0.1.2.zip`.
Současně se aktualizuje kopie `releases/beyond-the-signal-itch.zip` pro kompatibilitu.
Balíček obsahuje `release.json` s číslem vydání, poznámkami a zdrojovým commitem.
Číslování: poslední číslo pro opravy (0.1.1 → 0.1.2), prostřední pro nové
kapitoly či výrazné funkce (0.2.0), 1.0.0 pro dokončené první vydání.
První nečíslovaný ZIP považujeme za 0.1.0. Technické `version.json` pro
automatické aktualizace zůstává samostatné.
Samostatný režim Vite používá `dist-itch`; běžný webový build se nemění.
ZIP má index.html v kořeni, relativní cesty a neobsahuje administrátorskou
stránku, prototypy ani doprovodné textové soubory.

## Rozdíly této edice

Hra běží jako host a ukládá postup v tomto prohlížeči. Google přihlášení
a odkaz na administraci jsou skryté; OAuth v prostředí itch.io zatím není
ověřený. Hlavní web má cloudové ukládání nadále dostupné. Místní postup
hosta se mezi těmito weby automaticky nepřenáší. Statistiky pokusů a simulované
reklamy zůstávají zapojené; skutečné reklamy ani platby nejsou aktivní.

Do popisu itch.io použít místo příslibu Google přihlášení:

> Progress is saved locally in your browser. Cloud saves are available in the web edition at https://playbeyondthesignal.com/.

## Nahrání

V editaci HTML projektu vybrat Upload files, nahrát ZIP a označit
„This file will be played in the browser“. Nastavit spuštění po kliknutí,
fullscreen, Mobile friendly a Portrait. Scrollbars ponechat vypnuté.
Uložit koncept a ověřit skutečné spuštění na itch.io před zveřejněním.

Další vydání vyžaduje nové sestavení a nahrání ZIP. Samotný push na GitHub
balíček itch.io neaktualizuje.

## Ověření

147 unit testů, běžný i itch build a kontrola CRC celého ZIP prošly.
Produkční test v izolovaném iframe ověřil relativní cesty v podadresáři,
skutečný tah, obnovu místního postupu a skrytí přihlášení/administrace.
Uživatel potvrdil spuštění původního balíčku na itch.io. Nové vydání se
projeví až po nahrání nového ZIP; samotný push na GitHub nestačí.

## 0.1.1 — 2026-10-06

- Posílená dostupnost cílových barev, lepší úvodní desky.
- Opravené překryvy názvů místností a značka nedokončené Zkoušky systémů.
- Nové výbuchy Pulse/Nova založené na skutečné nahrávce.
- Herní zdrojový commit 660246a; 150 testů a webový build prošly.

## 0.1.2 — 2026-10-06

- Ošetřovna Útočiště, levely 151–155, vlastní grafika a EN/CZ příběh.
- Oddělené hotspoty navigace kokpitu, čitelné názvy a hvězdy.
- Obsahuje všechny opravy hratelnosti a zvuky v2 z 0.1.1.
- Herní zdrojový commit f045be1; 153 testů a mobilní průchod prošly.
- Itch build a kontrola CRC všech 214 souborů prošly; ZIP 152,88 MiB.
- Upload provádí uživatel; jeho dokončení dosud nepotvrzené.
