# Dlaždice Elysia

Vlastní společná sada pro všechny interiéry kapitoly4. Přibližovací level
`elysium-route` stále patří do Aster Veil a používá původní sadu.

| Typ v pravidlech | PNG v public/tiles | EN | CZ |
|---|---|---|---|
|0|elysium-coolant.png|Coolant charge|Chladicí náplň|
|1|elysium-power.png|Energy module|Energetický modul|
|2|elysium-chip.png|Data chip|Datový čip|
|3|elysium-alloy.png|Alloy component|Slitinový díl|
|4|elysium-light.png|Light cell|Světelný článek|
|5|elysium-bio.png|Biocapsule|Biokapsle|

Čísla typů, cíle, tahy, desky, kryty a boostery zachované. Změna je
vizuální a textová, ne nový inventář či ekonomika. Identifikátory oprav
ani ukládaný postup se nemění, není nutná další SQL migrace.

`src/tileSets.js` určuje sprite a přístupné názvy, `src/elysium.js` označuje
levely `tileSet: elysium` a obsahuje nové popisy a názvy cílů. Český katalog
pokrývá jednotná i množná čísla a dynamické cíle při budoucím ladění počtů.
Budoucí obytný sektor a biosféra budou více využívat biokapsle.

Grafika: vestavěný imagegen, jednotlivé PNG s alfa kanálem. Původní generované
PNG zachované, herní kopie optimalizované na256×256. Promptová sada a původ
jsou v public/tiles/elysium-assets.md.

Ověření: 70unit testů, produkční build, izolovaný prohlížeč320/390px,
šest načtených obrázků, české cíle a skutečný platný tah. Kontrola před/po
potvrdila shodu typů a počtů cílů, tahů, desek, krytů iID všech12oprav.
