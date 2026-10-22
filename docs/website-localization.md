# Lokalizace informačního webu — 2026-10-22

Web má šest samostatných jazykových verzí: EN, CS, DE, FR, ES a PT-BR.
Každá pokrývá úvod, představení hry, první kroky, mechaniky, ukládání,
novinky, kontakt a soukromí. Je to 48 veřejných stránek. Překlady jsou
první redakční verzí; neoznačovat je za kontrolu rodilým mluvčím.
Historická zpráva o 187 levelech zůstává historická; aktuální hra má 200.

## Jazyk webu a hry

- Anglický úvod je na `/`, ostatní na `/cs/`, `/de/`, `/fr/`, `/es/`,
  `/pt-BR/`. Články mají stejná jména souborů pod příslušným prefixem.
  `welcome.html` je zachovaný anglický vstup pro místní Vite náhled.
- Nativní rozbalovací přepínač zachovává aktuální článek i kotvu.
  Výběr se ukládá do `beyond-signal-website-language-v1`.
- Při prvním vstupu rozhoduje explicitní `lang`, jazyková adresa,
  uložená volba webu, starší herní preference a potom jazyky prohlížeče.
  Regionální varianty DE/FR/ES se přijímají. Portugalština je brazilská;
  `pt-PT` se za ni nevydává.
- Jazyk webu nepřepisuje `to-the-stars-language` ani jazyk rozehrané hry.
  České PLAY/přenos předá `lang=cs`; všechny ostatní edice `lang=en`.
  U hlavního PLAY a na kontaktní stránce je viditelná informace o jazyku.
  Hra, její příběh, přenos a Google rozhraní tím nezískávají další jazyky.
- Přenos nadále respektuje jazyk již importované hry při pokračování;
  odkaz nesmí následně přepsat obnovenou preferenci.
- Angličtina nemá vlastní adresář. Ruční přepnutí proto používá
  `?lang=en` a předá jej interním odkazům, aby fungovalo i s blokovaným
  úložištěm a například německým jazykem prohlížeče.

## Obsah a sestavení

`src/i18n/websiteLocales.js` určuje samostatnou nabídku webu. Herní
`releasedLocales` stále obsahuje jen EN/CS. Čtyři herní katalogy zůstávají
rozpracované a jejich zpřístupnění nadále blokuje kontrolní skript.

- `src/i18n/catalogs/web/*.json`: 156 položek každého webového jazyka.
- `src/i18n/catalogs/legal/*.json`: 51 částí kontaktu a soukromí. Odkazy
  a adresa podpory jsou strukturou HTML, nikoli obsahem překladu.
- `scripts/generate-site-pages.mjs` a `scripts/localize-site-pages.mjs`
  generují statický obsah. Překladové hodnoty se escapují jako text;
  katalog nemůže vložit HTML, skript ani změnit adresu odkazu.
- Generované adresáře `cs`, `de`, `fr`, `es`, `pt-BR` jsou ve zdrojích,
  aby Vite mělo skutečné HTML vstupy. Po změně textů spusť
  `npm run site:generate`; `site:check` před buildem odhalí rozpor.
- Každá stránka má vlastní jazyk, title, description, canonical a sedm
  alternativ (šest jazyků + x-default). Sitemap v režimu website obsahuje
  všech 48 adres. Text, novinky a odkazy jsou čitelné i bez JavaScriptu;
  pro výběr jazyka bez JS jsou samostatné odkazy.
- Web načítá jen svůj statický obsah a malý společný ovladač, nikoli
  všechny herní překlady. Společné hlášky načítání a nedostupnosti
  reklamních voleb mají vlastní překlady; skutečný dialog Google je
  nezávislá služba s vlastním jazykovým nastavením.

## Ochrana existujících hráčů

Callback Google na hlavní doméně má přednost před jazykovým přesměrováním;
celý query/fragment zůstává na `/legacy-game.html` stejného originu.
Banner původního postupu a PLAY pro navracející se hráče vedou na přenos,
odkaz pro již přenesené přímo do hry. Původní save, účty, energie a pomůcky
se při přepínání webu nemění. UTM/BOT parametry se nesmějí ztratit.

Třída `transfer-link` se používá i pro vzhled odkazu na článek. Nový ovladač
přepisuje jen skutečné adresy `transfer.html`, nikoli všechny odkazy s touto
třídou. Opraveno tak dřívější nechtěné přesměrování běžných návodů.

## Ověření

255 unit testů, produkční build, kontrola úplnosti katalogů a generátoru.
48 browser testů prošlo v jediné sadě Chromium + WebKit: šest jazyků,
320/1440 px, návody, úvod/kontakt/soukromí, základní přístupnost článků,
čitelnost bez JS, oddělení preference od hry, zakázané localStorage a
stávající scénáře přenosu včetně zachování importovaného jazyka.

První dva souběžné Playwright běhy sdílely výstupní adresář a server;
ukončení jednoho narušilo druhý. Celá sada pak zopakována samostatně:
48/48 pass. Nešlo o důvod měnit herní nebo přenosová pravidla.

Produkční sestavení navíc prošlo 192 načteními stránek (48 × 320/1440 px
× Chromium/WebKit), včetně skutečně načtených obrázků a nulového vodorovného
přetékání. Čtyři HTTPS-mapped scénáře potvrdily původní save/BOT parametry,
návrat na přenos a přednost OAuth callbacku před německou autodetekcí.
Vizuálně zkontrolován německý mobilní úvod, francouzský desktop a brazilský
kontakt. Jde o emulaci prohlížečů, nikoli nové měření fyzických zařízení.

Obtížnost, 200 levelů, schválený příběh, SQL a reklamní režim beze změny.
Překlady samy o sobě nezaručují schválení AdSense; novou kontrolu neposíláme.

## Nasazení

Zdroj `dcf0c6b88fa37b47b0dde7f5ef9a6cbd1afc65de` je zveřejněný na
obou doménách. GitHub Pages web `39818922248` a hra `39818950413`
potvrdily success. Verze main `1792688472455-dcf0c6b88fa3`, game
`1792688485883-dcf0c6b88fa3`. Hlavní doména zůstává informační web.

Živá kontrola ověřila HTTP 200, jazyková metadata a přepínač na všech
48 adresách, všech 48 záznamů sitemap a v Chromiu i WebKitu navigaci
úvod → článek → soukromí ve všech šesti jazycích. PLAY vždy předává
správné EN/CS. Samostatný startup smoke na skutečné game doméně ověřil
`/` i `/index.html`: úvodní grafiku a první úkol, bez chyb zdrojů.
Při tom nebyl použit skutečný Google účet ani vytvořen herní report.
