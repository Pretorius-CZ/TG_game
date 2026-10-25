# Návrat hotových oprav k zařízením — 2026-10-25

Uživatel výslovně požaduje původní umístění úkolů podle pozadí i po
úplném dokončení oblasti. Tato změna nahrazuje mřížku zavedenou
23. října při opravě chybějících názvů a hvězd.

- Všech 36 hotových expedičních oblastí opět používá původní `repair.x`,
  `repair.y` a `hotspotOffset`. Žádné souřadnice v herních datech se nemění.
- `CompletedRepairs` vykresluje původní značky s fajfkou, názvem a uloženými
  hvězdami. Pokud se texty střetnou, posouvá se jen popisek; jemná spojnice
  ukáže jeho značku. Malý omezený vyhledávač umístění bere v úvahu nadpis,
  ostatní názvy a skutečné značky. Není to další seznam nebo mřížka.
- Kruhová značka i popisek spouštějí opakování správné opravy. Klávesnice
  zachovává tlačítka a zvýraznění fokusu. Průhledné mezery značek neblokují
  popisky ostatních oprav.
- Navigace dokončené oblasti je pod obrazem, aby nepřekrývala zařízení
  dole. U rozehraných oblastí zůstává původní vykreslování beze změny.
- Pravidla, cíle, limity, pořadí, hvězdy, ID, cloudové ukládání ani verze
  balancu se nemění.

Ověřeno 284 Android unit testů včetně hustého rozmístění popisků.
Audit všech 36 dokončených oblastí: CS320, DE320, EN1024, dále DE430
během ladění a produkční Android CS430. Kontroluje původní souřadnice
s tolerancí zaokrouhlení pod 1 CSS pixel, názvy, hvězdy, překryvy,
dostupnost popisků a kliknutí na všech 13 oprav poslední kapitoly.
Finální CS320/DE320/EN1024 a Android CS430 bez překryvů i chyb.
APK sestaveno: 49 599 584 B, 2026-10-25 20:26 místního času.
Navazující průchody koncem, bránou a webový přenos se dokončují.

Navazující 4 průchody prošly: celý konec 13 oprav v EN/CS včetně příběhů,
replay a reloadu; brána včetně zrušení a prvního průletu; izolovaný náhled.

