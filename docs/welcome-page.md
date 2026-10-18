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

## 2026-10-18 — Hlavní web připravený pro přechod

Stránka má navigaci O hře / Novinky / Jak hrát a PLAY na game doménu.
Pět rozbalovacích návodů pokrývá cíle/hvězdy, nálože/pomůcky, kryty/kruhy,
energii a ukládání/přenos. Obsah i navigace EN/CZ; novinky doplněné podle
vydaného Archivu a mobilních/balance oprav. Čtení webu nespouští herní účet.
Návody jasně rozlišují cloudový postup a místní energii/pomůcky.

Náhled je `/welcome.html`; zatím nepřepínáme kořen domény. Až uživatel zadá
přechod, použít existující website režim podle game-cutover-checklist.md.
Původní hráč se z CTA na původní doméně dostane nejprve k přenosu;
nový návštěvník přímo do hry. Přenosový odkaz také zachovává UTM.

Ověření 2026-10-10: produkční build, náhled 1440/390/320 px v EN/CZ,
načtení všech obrázků, zachování UTM, preference jazyka po reloadu,
bez vodorovného přetékání a chyb JavaScriptu. Herní mechaniky beze změn.
