# Balíček itch.io

První balíček připraven 2026-10-05. Obsahuje všech 150 miniher včetně
hodnocení hvězdami. Plný ZIP má přibližně 152 MiB (154 MiB rozbalený,
209 souborů); optimalizace a postupné načítání grafiky nejsou součástí této dávky.

## Sestavení

Spustit `npm run build:itch`. Výstup je `releases/beyond-the-signal-itch.zip`.
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
Samotný upload a chování na skutečném itch.io zatím nejsou ověřené.
