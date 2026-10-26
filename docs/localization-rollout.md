# Rozšíření jazyků — stav a postup 2026-10-22

Aktuálně 26. 10. 2026: němčina dokončena a zpřístupněna ve hře pro web
i Android. Veřejné jazyky EN/CS/DE/FR; ES/PT-BR zůstávají draft.
Rozsah a ověření: `docs/german-release-2026-10-26.md`.
Francouzština: úplný pracovní překlad 200 úrovní, deníků, závěru,
ovládání, runtime a přenosu postupu; 2481/2481 zpráv bez chyb auditu.
Na žádost uživatele zpřístupněna k online testu přes `?lang=fr`.
Úplný externí robotický a mobilní průchod teprve následuje. Rozsah:
`docs/french-release-2026-10-26.md` a
`docs/french-localization-complete-2026-10-26.md`.
Níže uvedené pracovní stavy z 25. října jsou historické.

Schválený první rozsah: EN, CS, DE, FR, ES a brazilská portugalština PT-BR
pro hru i informační web. Další výhled: PL, IT, JA, KO; později ZH-Hans,
TR, ID, RU, UK a AR podle publika. Jde o pořadí práce, nikoli o již vydané jazyky.

## 2026-10-25 — Německá první kapitola a společné ovládání

Uživatel určil pořadí dokončování hry **DE → FR → ES → PT-BR**.
Německý pracovní katalog teď obsahuje texty oprav první kapitoly1–29,
její deník a odlet, úvod, hlavní ovládání, nastavení/statistiky, nápovědy
a Undo. Parametrické cíle byly ověřené na všech200úrovních včetně změny
čísel; to neznamená překlad příběhu všech200úrovní. Celá německá hra ještě
není vydaná. Francouzština/španělština/portugalština zůstávají herní drafty.

Společná migrace:

- `catalogs/runtime/en.json`, `cs.json`, `de.json`: sémantická ID pro
  nápovědy, souhlasy, parametry a dříve pevně větvené UI. Registry a kontrola
  katalogů započítávají i tento namespace; nové texty se nemusejí přidávat
  do historického `legacy` seznamu.
- `sourceMessage` vyhledává překlad přes všechna existující ID stejného
  anglického textu; nepřečísluje původní zprávy. Slovník cílových počtů
  je oddělený od názvů kamenů v HUD, aby se české „Hvězdy“ nezměnilo
  na genitiv „hvězd“.
- `dynamic.js`: vícejazyčné skládání cílů, souřadnic, energie, navigace
  a parametrů z katalogů. Dosavadní česká gramatika zůstává zachovaná.
- `dataText`: adaptér starších příběhových dvojic/polí en/cs. Použitý pro
  průvodce, rekapitulaci, názvy kapitol a footer; původní česká redakce
  se nepřepisuje. Data obtížnosti ani ID se nemění.
- Odstraněna většina přímých větvení EN/CS v ovládání (aktuální audit30,
  před prací116). Zbývají zejména příběhové komponenty pozdějších kapitol,
  přenos uložené hry a samostatný česky orientovaný testovací nástroj.
- Načítání návrhů používá dynamické JS adaptéry se statickým JSON exportem:
  Vite dev vrací transformované JSON jako JS a nešlo je načítat s původním
  dynamickým JSON import atributem v Chromium. Sestavení i Node kontroly
  používají stejné katalogy.
- Pracovní náhled: pouze lokální `npm run dev` a `?previewLanguage=de`.
  Nezapisuje draft do veřejné jazykové preference, při přepnutí nepřemontuje
  hru. Produkční build parametr ignoruje a dál nabízí pouze EN/CS.
- Opravena zastaralá krátká nápověda „nálož nelze přesouvat“ v EN/CS;
  nová DE nápověda říká stejné platné pravidlo. Android toolsHelp již
  odpovídá možnosti doplnění pomůcky reklamou. Na320px se zmenšují
  pouze ilustrační mřížky, nikoli text a ovládací plochy.

Audit v Android větvi:794/2413registrovaných zpráv pro DE,1619chybějících
ID. Číslo zahrnuje samostatný web a historické statické cíle; není to
procento hotového příběhu. Veřejný release má nadále pojistku proti
pouhému přepnutí příznaku draft→released.

Nejbližší obsah: německá kapitola2 (důl, ledová retranslace, archiv,
Haven a průlet), pak další kapitoly až200; dokončit zbývající příběhové
větve a jazykovou kontrolu celého průchodu. Teprve po dokončení a UI
kontrole všech kapitol DE povolit veřejně a přesměrovat německý PLAY
z webu na německou hru. Poté stejný postup FR→ES→PT-BR.

Ověření této etapy:281unit testů;16Chromium scénářů (DE320/430/1024,
změna jazyka při rozehraném pokusu, EN/CS nápovědy a první souhlas),
14Android-mode scénářů (včetně GooglePKCE a odměn), produkční pojistka
EN/CS a sestavení debugAPK. Android-mode je Chromium s mockovaným
nativním adaptérem, nikoli fyzický test nové lokalizace na telefonu.

## Hotová technická první etapa

- Společný registr `src/i18n/locales.js`, veřejný stav `released` versus
  rozpracovaný `draft`. Veřejně zůstávají EN/CS. Čtyři nové katalogy obsahují
  první návrhy základních ovládacích textů, nikoli hotový překlad hry.
- Katalogy v `src/i18n/catalogs/` používají stálé identifikátory. Web a
  novinky mají vlastní soubory `catalogs/web/`; samostatný web nestahuje
  texty celé hry. Novinky mají stálé ID, pořadí vydání nemění klíče překladů.
- Kontext nabízí `msg('common.movesLeft', {count})`. Formátování podporuje
  pojmenované proměnné a množná čísla přes `Intl.PluralRules`. Výsledek je
  obyčejný text, vykreslovat přes React/textContent, nikdy jako HTML.
- Původní `t('English source')` zůstává kompatibilní pro dosavadní EN/CS
  a dynamické cíle. Klíče `legacy.0001` atd. jsou zachované migrační ID;
  nepřečíslovat ani znovu negenerovat podle pořadí vět. Nové texty dostávají
  významové ID jako `help.resonators.body`, ne anglickou větu jako klíč.
- První návštěva respektuje jazyky prohlížeče, uložená volba má přednost.
  Nepodporovaný jazyk skončí v angličtině; rozpracované edice se samy
  nezapnou. Playtest zachovává výslovný vlastní výchozí jazyk i klíč.
- Odkaz PLAY přenáší zvolený jazyk přes `lang`, protože hlavní doména a
  game mají oddělené úložiště. Výslovná platná volba v odkazu má přednost;
  ruční přepnutí aktualizuje také tento parametr, aby refresh nevracel
  starý jazyk. Přihlašovací kódy ani jiné libovolné parametry se nepřenášejí.
- Nastavení a úvod hry používají výběr z registru, s názvy jazyků v jejich
  vlastní podobě. První souhlas se statistikami má přepínač z téhož seznamu.
- `npm run i18n:check` kontroluje ID, povinné překlady, proměnné, množná
  čísla, zprávy webu i novinky. Spouští se před běžným produkčním buildem.
  `npm run i18n:report` aktualizuje pracovní přehled `localization-audit.json`.

První převod zaregistroval 2 131 položek; aktuální počty uvádí audit JSON.
To není počet všech textů
v produktu: část dynamických textů a vložené dvojjazyčné struktury stále
potřebují převést. První audit našel 117 větvení/výběrů EN/CS s cestou a řádkem;
jde o pracovní seznam, nikoli úplný důkaz pokrytí každého viditelného textu.

## Zbývající práce před vydáním DE/FR/ES/PT-BR

1. Převést přímé podmínky EN/CS v komponentách do kontextových ID; neztratit
   odlišné významy stejného anglického slova. První na řadě: úvod, nastavení,
   analytické a reklamní volby, chyby, převod uložené hry a orientace telefonu.
2. Převést příběhová pole `en/cs`, dvojice polí v průvodci/rekapitulaci,
   výukové popisky a přístupné názvy včetně hlášení počtu hvězd. Nestačí
   doplnit překlad anglické věty, pokud komponenta vybírá pevné pole `cs`.
3. Nahradit české regulární výrazy pro dynamické cíle parametrickými
   zprávami odvozenými ze skutečných goals. Slova pro barvy, kryty, tahy
   a rezonátory musejí mít vhodné gramatické tvary v každém jazyce.
4. Doplnit DE/FR/ES/PT-BR v katalozích: všechny kapitoly 1–200, deník,
   přechody, nápovědy, UI, chybové a přístupné popisky. Vytvořit i webové
   katalogy čtyř jazyků, návody, nové i historické novinky a metadata.
5. Přeložit kontakt a informace o soukromí v HTML, přenos uložené hry a
   ostatní veřejné vstupy. Administrační `/balance` může zůstat české;
   slepý playtest je samostatný testovací nástroj, jeho rozsah uvést výslovně.
6. Jazykově zkontrolovat návrhy a slovník. Nepublikovat automatický první
   překlad jako jazykově ověřený text. Zkontrolovat názvy v rastrových obrázcích.
7. UI kontrola každého jazyka: 320×568, běžný telefon, tablet a desktop;
   dlouhá němčina, akcenty, řádky tlačítek, dialogy, nápovědy a změna jazyka
   během pokusu. Později JA/KO/ZH ověřit písma a zalamování, AR také RTL.
8. Teprve potom nahradit dočasnou pojistku EN/CS v kontrolním skriptu
   skutečnými kontrolami pokrytí nové edice a změnit její stav na `released`.
   Pouhá úprava registru dnes správně neprojde buildem.

## Překladatelská pravidla

- Styl: krátké, srozumitelné pokyny, žádný technický slovník bez vysvětlení.
  Pilot mluví stručně a lidsky; základ příběhu a jeho fakta se nemění.
- Pulse, Nova, EMP, Beyond the Signal, Haven, Kepler Reach a Aster Veil
  zatím zachovat jako vlastní názvy. Terminologii pomůcek domluvit před
  hromadným překladem. Rozlišovat nálož na desce a spotřební pomůcku.
- Proměnné `{count}`, `{total}` apod. nepřekládat ani neodstraňovat. Každá
  větev množného čísla musí zachovat všechny proměnné dané zprávy.
- Neměnit herní ID, pořadí levelů, cíle, počty tahů ani uložený postup.
  Jazykové katalogy jsou obsah prezentace; nepatří do konfigurace obtížnosti.
- Španělština pro první vydání neutrální, připravená na pozdější regiony.
  Portugalština výslovně `pt-BR`; `pt-PT` není totéž. Bez vlajek jako jazyků.

První etapa byla původně lokální. Stav webu a přechodu domén níže tento
historický stav aktualizuje.

## 2026-10-22 — Samostatné jazykové vydání webu

Na přání uživatele dokončeny webové edice DE/FR/ES/PT-BR vedle EN/CS,
včetně všech návodů, novinek, kontaktu a soukromí. Jejich PLAY dočasně
otevírá anglickou hru; CS vede do české. Herní lokalizace zůstává EN/CS,
čtyři nové herní katalogy nadále draft. Podrobnosti a další údržba:
`docs/website-localization.md`. Výše uvedený seznam zbývající práce teď
platí zejména pro hru a přenos, nikoli pro již přeložený informační web.

## 2026-10-25 — Německá druhá kapitola

Doplněno 24 oprav levelů 30–53: důl, ledová retranslace, archiv a Haven,
jejich deníky, mapa/skener, průlet a tři příletové panely Aster Veil.
Exploration používá parametrické zprávy i pro dřívější pevné EN/CS větve.
Audit Android: DE 1045/2430 zpráv (včetně webu), 1385 chybí;
19 bilingvních větví zbývá. Nejde o dokončenou německou hru.

Přímý vývojový náhled:
`http://127.0.0.1:5187/tests/browser/chapter-two-preview.html?previewLanguage=de`.
Umožňuje volit oblast a počet oprav, prohlížet skutečné bubliny a deník.
Postup pouze v paměti, vlastní practice klíče, bez cloudových zápisů a výsledků.
Běžná jazyková preference se nemění. V produkci zůstává DE nedostupná.

Ověření: 282 Android unit testů; 12 německých přehledů/replay na
320/430/1024 px, průlet včetně zrušení a příběhu, skener a izolace náhledu.
CS320 a EN1024 kontrola všech 36 hotových expedičních oblastí prošla.
Průlet/skener/izolace prošly také v Android režimu Chromium;
nejde o fyzický telefon ani Safari. Herní ID, limity a uložený postup beze změny.
Další etapa: německá kapitola 3 a následně zbývající kapitoly před zveřejněním.

## 2026-10-25 — Kompletní německý pracovní katalog

Doplněny kapitoly 3–10: Aster Veil, Elysium, Trhlina, Živá mapa,
Noční zahrada, Útočiště, Archiv ozvěn a Odpověď. Všech 200 oprav,
jejich deníky, průlety, příběhové mezníky a závěr mají pracovní DE text.
Doplněny i starší scénové popisky první kapitoly a map. Číselné cíle
v dosud nevyplněných ID jsou odvozené ze společných parametrických
německých zpráv; každá změna čísel se ověřuje na všech 200 levelech.

Katalogová kontrola: Android DE **2475/2475**, včetně již přeloženého
webu; webová větev má o šest Android autentizačních zpráv méně.
Nula chybějících zpráv, nula chyb parametrů. Stav zůstává `draft`.
Není to tvrzení o rodilé redakční kontrole nebo fyzickém testu telefonu.
Produkční jazyková nabídka stále EN/CS; webové DE PLAY stále míří na EN.

Zobecněn Elysium pokračovací popisek, reklamní dialog Googlu, čekání
na souhlasy a hlášení aktualizace. EN/CS texty zachované. Zbývají tři
bilingvní místa: izolovaný slepý test EN/CS, migrační stránka a záměrná
kompatibilita původních českých příběhových dvojic v translate.js.
Přenos na původní doméně a kontrolu dalších distribučních režimů zahrnout
před veřejným německým vydáním; stav katalogu je jen jedna podmínka.

Nový vývojový náhled:
`http://127.0.0.1:5187/tests/browser/localization-preview.html?previewLanguage=de`.
Pro kapitoly 2–10 lze volit oblast, hotové opravy, deník a příběhovou scénu.
Používá skutečné herní komponenty, průběh pouze v paměti, vlastní practice
klíče a vlastní profil pro příznaky zhlédnutého příběhu. Nemění běžné
uložení, jazyk, energii ani pomůcky; výsledky neodesílá. První kapitolu
lze procházet v běžném dev vstupu `/?previewLanguage=de`.

Ověřeno: 283 Android unit testů; audit oprav, deníků a příběhu 1–200,
kontrola všech dynamických cílů i po změně čísel. Německé přehledy
všech 36 expedičních oblastí na 320 a 430 px: názvy, hvězdy, překryvy,
přístupnost značek a replay poslední kapitoly. Samostatný náhled ověřuje
závěrečné příběhy i izolaci úložiště. Test blokované reklamy, pět výsledků
Google testové reklamy, tři herní CMP průchody a přechod EN→CS soukromí
prošly. Starý test přepínače soukromí opraven na nynější menu a čekání
na skutečné načtení nové stránky. Osm Android-mode scénářů prošlo
(náhled, skener, brána, čtyři přehledy 320 a změna jazyka s nápovědou).
APK sestavené, produkční Android pojistka proti zapnutí draftu prošla.

Herní pravidla, limity, ID, verze balancu a uložený postup se nemění.
Další práce: redakční průchod němčiny a příprava vydání, potom FR → ES → PT-BR.
