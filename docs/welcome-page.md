# Prezentační stránka hry

Jednoduchá samostatná stránka `welcome.html`: představení, příběhový úvod,
herní scény, novinky a přímý vstup do hry. EN/CZ sdílí jazykovou preferenci
se hrou. Nepřipojuje analytiku ani nenačítá herní aplikaci.

Spuštění: `npm run dev`, potom `/welcome.html`. Produkce: `npm run build`.
Webový build obsahuje stránku; itch a CrazyGames mají nadále pouze hru.
Stávající hra zůstává na kořeni domény. Stránka nepřesměrovává existující
hráče ani Bounty testery. Případnou změnu hlavní adresy řešit samostatně.

Novinky: `src/welcomeUpdates.js`, nejnovější první. Každá má datum a texty
EN/CZ (tag/title/body). Uvádět pouze skutečně vydané změny nebo jasně popsaný
aktuální stav. Vzhled: `src/landing-page.css`, obsah: `welcome.html` a `src/welcome.js`.
Tlačítka Hrát zachovávají UTM parametry z adresy stránky.

Ověření 2026-10-10: produkční build, náhled 1440/390/320 px v EN/CZ,
načtení všech obrázků, zachování UTM, preference jazyka po reloadu,
bez vodorovného přetékání a chyb JavaScriptu. Herní mechaniky beze změn.
