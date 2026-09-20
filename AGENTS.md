# AGENTS.md — kontext projektu pro Codex

## Projekt a aktuální směr (2026-09-10)

Telegram Mini App: sci-fi swap match-3 s postupnou opravou lodi jako
první kapitolou. Po opravě loď odletí ke hvězdám. Opravy jsou přímá
odměna za dokončené levely, bez měny, surovin a obchodu. Kosmetické
varianty se zatím neřeší. Podrobnosti: `docs/game-design.md`.

## Pracovní prostředí a větve

- Pracovat ve stejné místní složce `telegram_hra`.
- GitHub remote: https://github.com/Pretorius-CZ/TG_game.git
- Aktuální větev: `codex/cockpit-stage`, vychází z `codex/game-adjustments` / `simple-path`.
- `simple-path`: starší návrh cesty planetami; `main`: komplexní ekonomická verze.
- Archiv předchozího designu: `docs/game-design-simple-path.md`.
- Nové větve standardně s prefixem `codex/`.

## Technologie

- React + Vite; webové animace přes CSS a JavaScript / Web Animations API.
- Herní jádro oddělené od Telegram integrace.
- Externí databáze pro postup; preferována Supabase, placený tarif je možný.
- Konkrétní tarif, hosting a Telegram SDK ještě nejsou vybrané.
- Přihlášení z Telegramu ověřovat na backendu.

## Struktura a konvence

- `docs/`: design, architektura a chronologický log rozhodnutí.
- `Images/`: schválené dlaždice, překážky, VFX a pozadí; viz `Images/README.md`.
- `src/`: React/Vite prototyp exteriéru a kokpitu; spuštění viz README.md.
- Kód a komentáře anglicky; dokumentace a diskuze česky.
- Styl commit zpráv zatím není pevně určený.

## Aktuální stav

- [x] Schválen nový koncept: oprava lodi, další kapitoly, bez měny.
- [x] Vytvořena a publikována větev `codex/game-adjustments`.
- [x] Existují grafické podklady pro match-3, nikoli hotová hra.
- [ ] Doladit opravy a rozsah první kapitoly; čísla v GDD jsou návrhy.
- [x] Připravit obrazové stavy všech čtyř oprav kokpitu a osvětlený exteriér.
- [x] Založit React/Vite aplikaci a interaktivní prototyp scén na výšku.
- [x] Implementovat výukové match-3 6 × 6 a propojit výhru s napájením.
- [ ] Nastavit Supabase, autentizaci a ukládání postupu.
- [ ] Zvolit hosting a nastavit CI/CD.

Po větší práci aktualizovat tento kontext; detaily patří do dokumentace.
Životy, boostery a monetizace jsou otevřené, nepřebírat automaticky
starou ekonomiku nebo rozsah 60 planet / 12 soustav.

První scény: klepnutí na loď otevře kokpit, návrat ven navigací.
Oprava se odemyká výhrou v tutoriálu, zatím bez trvalého ukládání. Kokpit má samostatné obrazové stavy oprav; další oblasti lodi chybí.
Na telefonu i desktopovém náhledu zachovat portrétový formát.

Herní UI anglicky, dokumentace a diskuze česky. Tutoriál bez boosterů
a limitu tahů; cíl 18 kamenů. Pravidla src/match3.js, testy tests/match3.test.js.

Aktuálně čtyři postupné opravy kokpitu: světla, okna, počítač, diagnostika.
Konfigurace src/repairs.js, cíle 18 všech / 12 modrých / 15 zelených / 30 všech.
Kokpit je pouze první etapa celé lodi; plášť a ostatní etapy zatím nehratelné.

Aktuální dokončený kokpit: čtyři různě tvarované levely, čtyři výrazné
obrazové opravy, odhalení opravy a See your ship. Rozsvícený exteriér až po
4/4 opravách; plášť i motory stále poškozené. Optimalizované WebP scény.
Kontroly: npm test (9 testů) a npm run build. Postup je stále jen v paměti.

Porovnání před/po bylo odstraněno. docs/story-proposal.md obsahuje
schválenou logiku lodního deníku (2026-09-12); deník je implementovaný pro čtyři opravy kokpitu.

Příběh schválen: pilot zásobovací lodi, odbočení za majákem ztracené výpravy,
nouzové přistání chránící pilota. Opravy odhalují deník; později živá odpověď
a odlet za signálem. Kapitola 1 vysvětlí havárii, kapitola 2 hledá vysílajícího.
Další úpravy příběhu pouze kosmetické, základní logiku znovu neotevírat.

Lodní deník: Ship log pod navigací, New log entry po opravě. Čtyři anglické
zápisy, zamčené budoucí útržky, nepřečtené značky a nepovinné čtení.
Data src/logEntries.js, UI src/ShipLog.jsx. Odemykání plyne z oprav; replay
zápisy neduplikuje. Čtení ani přeskočení nemění postup. Stav jen v paměti.

Před opravou se nad kokpitem otevře komiksová bublina pilota s krátkou
anglickou myšlenkou, cílem a tlačítkem Play. Dostupná přes zařízení i přehled
oprav; replay používá kratší text. Odhalení příběhu zůstává v deníku po výhře.
Komponenta src/RepairBubble.jsx, texty v src/repairs.js.

Aktualizace 2026-09-13: vesmírné PNG dlaždice v public/tiles (prompty v README).
První tři desky mají 6 sloupců × 6 řádků (okna mají vykrojené rohy),
diagnostika plných 6 sloupců × 7 řádků a pět typů. Ostatní levely čtyři typy.
Cíle oken a počítače jsou 12 komet a 15 krystalů. Šestý orb připraven pro později.

Zvuk (2026-09-13): src/audio.js generuje jemný ambient a efekty přes Web Audio. První interakce aktivuje zvuk, minihra ztiší hudbu, skrytá karta pozastaví audio. Music a Sounds se vypínají zvlášť; preference v localStorage, herní postup stále pouze v paměti.

Roadmapa pokračování: docs/roadmap-ship.md (2026-09-13). Po kokpitu následuje komora/plášť, ubikace, kuchyňka/zásoby, spojení/navigace v kokpitu, strojovna/palivo/motory a odlet. Pracovní rozsah 25 levelů včetně 4 hotových. Nejprve zobecnit etapy a ukládání, potom dokončit levely 5–8. Další etapy jsou plán, nikoli implementace.

Připravené podklady etapy 2: docs/airlock-stage.md — čtyři opravy, cíle miniher, anglické bubliny a deník. Grafika public/scenes/airlock-0-damaged.png (imagegen). Jde o výchozí poškozenou scénu a návrh obsahu, zatím nezapojeno do hry; opravené varianty chybí.

Navigace 2026-09-13: exteriér → přechodová komora → kokpit; návrat stejnou cestou. Komora je přístupné rozcestí už před opravou kokpitu, její vlastní opravy zatím nejsou hratelné. Ubikace, kuchyňka a strojovna jsou označené jako zamčené. Dokončení kokpitu vrací do komory, odkud lze ven. Grafika airlock-0-damaged.webp zapojená. Ověřen mobilní průchod tam/zpět a spuštění minihry.

Chodba je zapojená: z komory Explore corridor, zpět Back to airlock. Výchozí grafika corridor-dark.webp má vypnutá stropní světla i rámy. CorridorArt.jsx a corridor.js připravují nezávislé rozsvícení rámů dle dokončených ID crew-quarters, galley, engine-room; hlavní světla až po všech třech. Jejich opravy dosud nejsou hratelné, proto chodba zůstává tmavá. Kokpit ji nerozsvěcí. Vstup z komory je zatím tlačítko; nový průchod není zakreslen do grafiky komory. Ověřen build, 10 testů, průchod komora–chodba–komora–kokpit.

Oprava grafického vstupu: komora používá airlock-corridor-door.webp (zdroj PNG stejného názvu). Vpravo je skutečný otevřený průchod CORRIDOR s klikací značkou Enter corridor, vlevo COCKPIT. Dostupný před i po dokončení kokpitu. Starší poznámka o chybějícím zakresleném vstupu již neplatí. Mobilní kliknutí a návrat ověřeny; build prošel.

Crew Quarters: hratelné čtyři opravy (ventilace, filtr, lůžko, obytný modul), 7×7 / 5 typů, pět obrazových stavů a čtyři zápisy. Vstup z levých dveří chodby po dokončení kokpitu; komora je v prototypu dočasně přeskočena, finální roadmapa beze změny. Dokončení rozsvítí pouze tyrkysový rám. Postup oddělený od kokpitu, zachován při navigaci, nikoli refreshi. Podrobnosti docs/crew-quarters.md.

Schválený postup: čtyři opravy kokpitu tvoří povinný tutoriál. Poté volný výběr všech implementovaných místností chodby, postup oprav uvnitř každé zůstává pevný. Odlet vyžaduje všechny opravy celé lodi včetně pláště, navigace, paliva a motorů. Zásadní příběhové události navázat na společné milníky; osobní zápisy na místní opravy. Nahrazuje dřívější pevné pořadí místností. Nehotové místnosti zatím označit jako připravované.

Kuchyňka Galley je hratelná souběžně s ubikacemi po kokpitu: voda, chladicí box, police, jídlo. Čtyři nezávislé opravy a deník, pět obrazových stavů, 7×7 a od druhého levelu šest typů včetně červeného orbu. Dokončení rozsvítí jantarový rám, ne tyrkysový ani strop. Sdílený průběh CrewQuarters.jsx má parametr room. Viz docs/galley.md. Refresh stále resetuje postup.

Strojovna (2026-09-14): pět hratelných oprav a zápisů, šest obrazových stavů, desky 7×8/6 typů. Přístup po kokpitu v libovolném pořadí s ubikacemi/kuchyňkou. Dokončení rozsvítí červený rám; teprve všechny tři místnosti rozsvítí strop chodby. Systems test není povolení odletu, plášť/navigace dosud chybí. Viz docs/engine-room.md. Počítadlo nepřečtených zápisů nyní zahrnuje všechny místnosti.


Aktualizace 2026-09-14 — komora a plášť jsou hratelné: čtyři opravy
(napájení, vnitřní průlez, plášť, těsnění), čtyři desky 6 × 7 / 5 typů,
čtyři bubliny a zápisy deníku. Opravy dostupné z komory po kokpitu,
souběžně s místnostmi chodby. Pět stavů interiéru a dva nové exteriéry;
3. oprava uzavře trhlinu pod kokpitem, 4. obnoví vnější průlez se zelenou
kontrolkou. Kokpit zůstává osvětlený. Rozcestí používá aktuální obraz komory.
Celkem 21 hratelných oprav (kokpit4, komora4, ubikace4, kuchyňka4, strojovna5).
Zbývá spojení/navigace a odlet; dokončení komory samo odlet nespouští.
Postup stále v paměti. Podrobnosti docs/airlock-stage.md.

## 2026-09-15 — Schváleno: limit tahů, reklamy a budování základny

- Minihry budou mít omezený počet tahů. Po jeho vyčerpání počítáme
  s dobrovolným zhlédnutím reklamy za další tahy a pokračování v levelu.
  Konkrétní limity, počet přidaných tahů, opakování nabídky a poskytovatel
  reklam se doladí později. Případná výjimka pro úvodní tutoriál je otevřená.
- Jednou z budoucích etap po opravě lodi bude výstavba vesmírné stanice
  nebo velké základny. Přesná podoba a zařazení do příběhu nejsou rozhodnuté.
  Jde o další využití match-3 postupu s viditelnou výstavbou; samotné schválení
  nezavádí měnu, surovinovou ekonomiku ani obchod.
- Toto rozhodnutí nahrazuje dřívější otevřenou otázku limitu tahů a reklam.
  V současném prototypu stále nejsou limity ani reklamy implementované.
  Nyní je požadováno zaznamenání směru, nikoli jeho implementace.

## 2026-09-15 — Design nejbližší etapy

Další část: Communications & Navigation v opraveném kokpitu. Pracovní
návrh je v docs/navigation-stage.md: anténa, přijímač s živou odpovědí,
hvězdná mapa, ověřený kurz, čtyři minihry a deník. Dostupné po tutoriálu
souběžně s ostatními místnostmi; odlet až po všech 25 opravách. Anténa
mění exteriér nezávisle na opravách pláště. Dokument rozpracovává také
limit tahů / reklamy a návaznost na budoucí stanici. Zatím design,
ne implementace; konkrétní obtížnost a reklamní odměny nejsou schválené.

Aktualizace 2026-09-15: Communications & Navigation implementované
(src/navigationRepairs.js, src/NavigationArt.jsx), vstup z opraveného kokpitu.
Čtyři nové minihry a deník; anténa nezávislá na plášti, živá odpověď,
mapa, kurz. Přehled připravenosti všech šesti oblastí v kokpitu.
Celkem 25 oprav. Zbývá vzlet, ukládání a pravidla limitu tahů/reklam.
Viz docs/navigation-stage.md; starší zmínka o pouze navržené etapě již neplatí.

2026-09-15 — Vývojový náhled: tlačítko Complete level v úvodní bublině
opravy a během minihry okamžitě provede standardní výhru, proměnu scény,
deník a další krok. Dostupné pro všech 25 oprav při npm run dev
(import.meta.env.DEV), v produkčním buildu skryté. Bublina replay nabídku
nemá; opakované dokončení minihry nezvyšuje postup. Během animace tahu
je tlačítko zakázané. Ukládání postupu zatím stále chybí.

2026-09-15 — Návaznost navigace: po kokpitu 4/4 hlavní karta přímo ve
scéně nabízí aktuální úkol navigace. Po kurzu 4/4 vypíše zbývající oblasti
lodi a vede na další nedokončenou oblast. Při 25/25 nabídne prohlédnutí
kurzu, odlet zůstává připravovaný. Zobrazuje se postup navigace i celé lodi.
Živá odpověď přijímače nyní přichází po krátkém čekání (2,2 s), lze ji
okamžitě zobrazit přes Show reply; při omezených animacích je okamžitá.
Zápis v deníku je kompletní a není závislý na době čekání.

Aktualizace 2026-09-15: textová navigace pod scénou odstraněna; ve scéně
ikony Zpět/Mapa/Deník a replay. Všechny minihry mají limity tahů, opakování
a dočasně zdarma +5 tahů. Led zaveden v Galley cold storage (4) a finálním
HARD levelu (8): rozbíjí se sousedním spojením, pak lze spojit uvolněný kámen.
Finále až po všech 25 opravách: 70 kamenů / 18 tahů, výhra i po rozbití všeho
ledu. Odletová animace zbývá. Supabase/ukládání uživatel výslovně odložil
na konec po designu a logice. Podrobnosti docs/levels-and-finale.md.

## 2026-09-15 — Životy a další ladění

Led až při třetí opravě: crew-bunk, galley-racks, engine-power,
airlock-hull-panels, nav-chart (4 bloky). Kokpit bez ledu. Galley cold
storage jej už nemá. Finále nadále osm bloků.

Maximálně 5 životů, srdce přímo ve scéně i minihře. Výhra neodebírá život.
Vyčerpání tahů odebere jeden; následný odchod jej neodebere podruhé.
Odchod po alespoň jednom platném tahu také jeden, před prvním tahem žádný.
Na nule nelze začít nový pokus, retry je zamčené. Výchozí návrh obnovy:
jeden život / 30 minut, max.5, odpočet viditelný. Životy a čas obnovy se
ukládají lokálně i přes refresh (opravy stále ne). Nákup/refill připraven
jako nedostupná možnost bez ceny a bez falešné platby; platební služba chybí.
Dev náhled má explicitní Preview refill a +5 moves; produkce ne.

Limity pevné podle levelu, ne podle nákupů. Simulace 100 her/level:
tutoriál 100 %, běžné 81–100 %, strojovna s barevnými cíli 87–92 %,
navigační mapa 88 %, finále 78 %. Automat hodnotí okamžitý zisk/led;
nejde o garantovanou lidskou úspěšnost. Čísla dál ladit hraním.
Ověřeno 22 unit testů, build, pět proher → 0 životů, zákaz retry na nule,
persistování životů přes refresh. Obnovu v čase ověřují unit testy.

2026-09-16: Led nahrazen průhlednými ochrannými kryty. Kryt se rozbije pouze
spojením stejného typu zahrnujícím krytý kámen; sousední match nestačí.
Krytý kámen nelze přesouvat a při rozbití se nesbírá, zůstane pro další match.
Výrazný počet tahů nad deskou, posledních 5 jantarově. Limity upraveny,
finále 70 kamenů / 8 krytů / 48 tahů. Viz docs/levels-and-finale.md.
Životy již nemají srdce: pět energetických článků, pravidla obnovy beze změny.

2026-09-16: Připraven GitHub Pages workflow pro codex/cockpit-stage; publikuje
sestavený dist, ne zdrojový kořen. Pages Source musí být GitHub Actions.
Relativní cesty obrázků a Vite base ./ podporují /TG_game/ i lokální náhled.
Produkční sestavení ověřeno v prohlížeči pod /TG_game/ včetně obrázků.

## Nejbližší pokračování — mobilní test 2026-09-16

Uživatel potvrdil funkčnost hry na mobilu. Na příště: snížit příliš štědré
limity tahů kokpitu; cíleně prověřit desku bez platného tahu (automatická
obnova už v MiniGame.jsx existuje, včetně kontroly krytů); odstranit
zbývající textové vstupy do místností v koridoru a nechat klikací dveře.
Promyslet speciální kameny pro další etapu, např. 4 v řadě → bomba;
konkrétní pravidla a význam „v koridoru“ ještě upřesnit. Neimplementováno.
Podrobnosti a pořadí práce: docs/decisions-log.md, mobilní test 2026-09-16.

## 2026-09-19 — Kokpit, koridor a další pořadí práce

Limity kokpitu sníženy na 10/16/18/14 (světla/okna/počítač/diagnostika).
Simulace 500 her na úkol: 500/498/500/500 výher jednoduchého automatu;
nejde o lidskou úspěšnost. Koridor nemá spodní textové vstupy ani návrat,
používá klikací dveře a horní ovládání. Před kokpitem informuje o uzamčení.
Obnova desky bez tahu vyčleněna do ensurePlayableBoard a ověřena testem
s kryty i bez, včetně děr masky. Skóre/tahy/kryty obnova neodebírá.
Návrh speciálních kamenů: docs/special-pieces-proposal.md, zatím neschválený.
Uživatel určil návaznost: po herních úpravách ukládání pro další spuštění
+ přihlášení, pak teprve další levely. Ukládání nyní není implementované.

2026-09-19: Dílčí rozsvícení dveří koridoru nyní odhaluje maskou skutečné
světelné prvky z corridor-concept.webp, nikoli náhradní SVG neonové čáry.
Stejný tvar, přerušení a barvy jako finální chodba; strop zůstává zhasnutý
až do dokončení všech tří místností. Ověřen build a mobilní náhled strojovny.

2026-09-19: Sjednocení scénového ovládání. Komora a její opravy jsou jedna
scéna (CrewQuarters room=airlock), dveře do kokpitu/chodby stále dostupné.
Starý cíl airlock-work z mapy se překládá na airlock. Opravy komory až po
kokpitu; všechny opravy přes hotspot zařízení, navigace přes konzoli.
Spodní akční karty nahrazeny neinteraktivním stavem/nápovědou. Po odhalení
opravy Continue pouze zavře odměnu, hráč zůstane v místnosti. Finále má
v kokpitu vlastní hotspot Launch check, dostupný až po všech 25 opravách.
Ověřeno všech 25 oprav a finále přes preview, přímé dveře komory a konzole,
24 unit testů a build. Změny zatím lokální, nejsou pushnuté.

2026-09-19 — Oprava návaznosti: značka další opravy se ve sdílených
místnostech zobrazuje už během karty předchozí výhry (kromě prohlídky
exteriéru); kliknutí kartu zavře a otevře další úkol. Inner hatch je tedy
přístupný ihned po Service power bez odchodu z komory. Po potvrzení
poslední opravy crew/galley/engine se hráč opět vrací do chodby, navigace
do kokpitu. Komora zůstává sama rozcestím. Nahrazuje předchozí obecné
pravidlo zůstat po dokončení celé místnosti. Build a cílený mobilní průchod
energie → dveře bez odchodu a dokončené ubikace → chodba ověřeny.

2026-09-19: Návrh exteriéru public/scenes/exterior-landing-gear-concept.png
(imagegen, reference exterior-sealed.webp): integrovaná anténa a vysunuté
hydraulické nohy. Zatím nezapojeno do hry. Podvozek navržen jako pozdní
oprava před odletem; přesný úkol a počet levelů otevřený. Při zapojení
zachovat nezávislé stavy antény, pláště a podvozku, neodhalit opravy předčasně.

## 2026-09-20 — Exteriér implementovaný

Venkovní pohled má tři hratelné opravy přes hotspoty: plášť, vnější kryty
motorů/trysky, podvozek. Vlastní bubliny, minihry, deník a obrazové stavy.
Plášť přesunut z komory; komora nově 3 úkoly (obrazy 0,1,2,4). Celkem
27 oprav, readiness vyžaduje i exterior3. Anténa nezávislá, nyní raster
z generované grafiky místo kresleného SVG; těsnění také nezávislé.
ExteriorArt.jsx sdílí aktuální exteriér pro venkovní scénu i odměny.
Podrobnosti docs/exterior-stage.md. Ověřeno 25 testů, build a průchod
všemi opravami/finále v obou pořadích navigace/komora/exteriér.
Změny jsou lokální, bez commitu/pushe. Příští práce stále ukládání,
přihlášení a poté další levely; speciální kameny zatím pouze návrh.

2026-09-20: Přidán 4. venkovní úkol Emergency fuel depot (24 fuel / 38 tahů).
Odemkne se po podvozku a engine-fuel (strojovna >=2). Stanice vedle lodi,
opravený stav a tok hadicí po výhře, vlastní deník. Finále nově vyžaduje
28 oprav včetně natankování (exterior4). Viz docs/exterior-stage.md.

2026-09-20: Místní ukládání implementované. src/progressStorage.js +
useProgressSave.js: verze1 localStorage to-the-stars-progress-v1,
automaticky všechny opravy (včetně tankování), finále, čtený deník a scéna.
Rozehraná minihra ne. Životy/audio mají dosavadní vlastní ukládání.
Footer zobrazuje stav uložení, chyby nejsou vydávané za úspěch.
Validace a sloučení vyššího postupu při souběhu karet. Přihlášení/cloud
stále nejsou implementované. Nápad na odměňovanou reklamu za nápovědu
zapsán v decisions-log; současná nápověda zdarma se nemění.

2026-09-20: Aktuální roadmapa pokračování je docs/roadmap-next.md.
Pouze plán, bez implementace: vyhodnocení testerů, přihlášení/cloudové
ukládání, odlet, speciální kameny, malá druhá kapitola, dobrovolné reklamy,
později Android. Podrobné návrhy nejsou automaticky schválené funkce.

## 2026-09-20 — Supabase připojení připravené
Přidán Google OAuth klient a oddělené místní kopie účtů; hosta lze výslovně importovat.
Cloud slučuje opravy/deník/finále přes atomickou SQL funkci. Energie zůstává místní.
Nastavení serveru ještě vyžaduje spuštění supabase/001_game_progress.sql a Google provider.
Postup správce: docs/supabase-setup.md. Živé přihlášení zatím neověřeno.

2026-09-20: Uživatel dokončil nastavení Supabase a Googlu a ověřil cloudový postup mezi anonymním oknem a Chromem. Přihlášení, uložení levelu a obnovení na stejném účtu fungují. Nahrazuje předchozí poznámku o neověřeném živém přihlášení.

2026-09-20: MiniGame zobrazí výhru až po dokončení všech kaskád a animací posledního tahu (busy=false). Ověřeno v prohlížeči s běžnými i omezenými animacemi, včetně výhry posledním tahem a aktivního potvrzení opravy.
