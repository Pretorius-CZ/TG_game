# Veřejný web hry

## Stav 2026-10-22 — web zveřejněný na hlavní doméně

Nasazeno: https://playbeyondthesignal.com/ je informační web,
https://game.playbeyondthesignal.com/ je hra. Obě adresy zveřejňují
zdrojový commit 2d91eb8f1e737370e90783ce34e249929973b04b.
Trvalé MAIN_SITE_MODE=website a výchozí ruční website chrání další nasazení.
Hlavní Pages39812552554 success včetně kontroly veřejných stránek a obnovy.
Herní Pages39812475694 již zveřejnilo build; poslední zaznamenaný stav
instaluje browser pro kontrolu. Stejný startup skript spuštěný samostatně
na živém game root/index prošel: artwork, úvod a první oprava, 0 chyb.

Živě ověřeno všech8veřejnýchstránek v EN/CS Chromium/WebKit320/1440,
obsah bez JS, původní hráč/bannery, přenos guest+oddělené kopie účtu,
hvězdy/deník/energie/pomůcky/BOTmarker i zákaz opakovaného refillu.
OAuth callback byl testovacím kódem vrácen na původní legacy origin;
automat nepoužíval skutečný Google účet. Robots/sitemap/ads.txt i obě
obnovovací stránky vracejí200. Nová kontrola AdSense nebyla odeslána.

Uživatel po zamítnutí AdSense „Obsah nízké hodnoty“ zadal dokončení webu.
Hlavní web má úvod a pět samostatných stránek: about.html, how-to-play.html,
tools-and-obstacles.html, saving-and-progress.html a updates.html. Kontakt
a soukromí zůstávají. Články i publikované novinky mají čitelný anglický
HTML obsah bez JavaScriptu; česká verze používá společné jazykové katalogy.
Nové jazyky DE/FR/ES/PT-BR jsou nadále pouze rozpracované a skryté.

Obsah vychází ze skutečných pravidel 200 levelů: platné přesuny náloží,
samostatné kombinace u rezonátoru, kaskádový Pulse, hvězdy a místní zásoby
oproti cloudovému postupu. Nezavádí se nové herní funkce ani změna obtížnosti.
Původní prohlížeč se save dostane nabídku přenosu a přímý vstup pro případ,
že již přenos provedl. PLAY zachovává jazyk a podporované UTM.

Katalogy: src/i18n/catalogs/web/en.json a cs.json. Struktura článků:
src/sitePages.js. `npm run site:generate` obnoví statické stránky a novinky
úvodu, `site:check` před buildem hlídá synchronizaci. Text se vykresluje
bez vkládání HTML z překladů. Obrázky používají stávající podklady hry.

Website režim vytváří robots.txt a sitemap.xml, zachovává transfer.html
a legacy-game.html pro původní data a OAuth callbacky. Veřejné informační
stránky mají canonical na hlavní doménu; pomocné vstupy noindex.
Změny nezaručují schválení AdSense. Žádost o novou kontrolu se nyní neodesílá.

Ověřeno: 252 unit, build/site/i18n kontroly, 10 browser případů článků a
přístupnosti Chromium/WebKit EN/CS 320/1440 (dvě WebKit kontroly po opravě
čekání testu na lazy obrázky úspěšně zopakovány). Produkční náhled všech
8 stránek v 8 kombinacích + bez-JS obsah obou enginů; 4 kontroly nového/
původního hráče na simulované původní HTTPS doméně zachovaly save a UTM.
Živé přepnutí a jeho ověření je potvrzené výše.

## Historie původního náhledu

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
