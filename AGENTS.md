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

2026-09-20: Odlet implementován (src/Departure.jsx), po finále Launch v kokpitu, přeskočení/replay, reduced-motion, závěrečný deník a lokální launchDone. Cloud vyžaduje spuštění supabase/002_departure.sql; zatím na serveru neprovedeno. Podrobnosti docs/departure.md.

2026-09-20: Uživatel potvrdil spuštění supabase/002_departure.sql. Migrace pro cloudové uložení odletu je podle jeho potvrzení nasazena; přenos odletu na druhé zařízení ještě samostatně neověřen.

2026-09-22: Odlet nově animuje zatažení antény před zážehem, čímž navazuje na letovou grafiku bez antény. Běžný exteriér beze změny.

2026-09-22: Bezpečná obnova MiniGame: Recalibrating board před obnovou bez platného tahu, sdílený limit 128 generování, pojistka 40 kaskád / 60 s aktivní karty. Chyba generování/vyhodnocení nabízí restart a návrat bez odečtu energie; neprovádí se předčasná prohra podle šance na splnění cíle. Poslední tah se vyhodnotí až po kaskádách.

2026-09-22: Restart game v nabídce účtu s potvrzením. Host lokálně, účet přes reset RPC; resetRevision chrání před obnovou starým zařízením. Obnoví 5 místních energií, zachová přihlášení/zvuk a ostatní profily. Vyžaduje novou migraci supabase/003_restart_game.sql, zatím neprovedena. Viz docs/restart-game.md.

2026-09-23: Nabídka účtu přejmenována na Settings i pro hosta; Restart entire game je výrazné první tlačítko panelu. Potvrzení stále nutné. Restart a oprava viditelnosti Replay jsou dosud lokální; migrace 003 dosud uživatelem nepotvrzena.

2026-09-23: Pilot obtížnosti v ubikacích: cíle barev, dva současné cíle ve filtrech a obytném modulu, kryty od třetí opravy (4/6), limity 17/17/23/26. MiniGame podporuje goals přes src/objectives.js, ostatní levely zachovány. Speciální nálože zatím odložené. Simulace scripts/balance-crew.mjs a výsledky docs/crew-balance.md. Dokončený postup se nemění, testovat přes Replay. Změny lokální.

2026-09-23: Nálože implementované mimo úvodní kokpit: 4 nebo T/L → Pulse 3×3, 5+ → Nova řádek/sloupec. Tap za tah, řetězení zdarma, kryty se pouze rozbijí, nálože jsou platná akce proti obnově desky. Src/boosters.js. Ubikace přitvrzeny na 15/15/18/20 tahů, cíle 21 krystalů / 18+18 / 24 krystalů+4 kryty / 24+24+6 krytů. Simulace s náložemi: cílený automat 82/80/74/55 %, 300 pokusů. Ostatní místnosti nové limity zatím nemají. 44 testů; mobilní vznik, aktivace posledním tahem a výhra po kaskádách ověřeny pro běžné i omezené animace. Lokální, bez pushe.
`n2026-09-23: Další jemné přitvrzení ubikací: limity 14/14/17/19, cíle i boosty zachovány. Stejná simulace 300 pokusů: cílený automat 72/69/65/49 % (dříve 82/80/74/55 %). Podrobnosti docs/crew-balance.md. Build ověřen, změny lokální.

2026-09-23: MiniGame má SVG/CSS exploze Pulse a Nova včetně řetězených náloží. Efekty před pádem kamenů, vyčištění při chybě/retry, reduced-motion respektován. Build a mobilní aktivace posledním tahem ověřeny. Lokální změny.

Uživatel po pushi ffb0b02 potvrdil provedení supabase/003_restart_game.sql bez chyb. Migrace restartu účtu je podle jeho potvrzení nasazena; samotný cloudový reset a jeho převzetí druhým zařízením zbývá ověřit.

2026-09-24: Uživatel potvrdil funkčnost cloudového restartu po SQL003. Schválil průzkum fiktivní soustavy, pevné zásilky a následné budování stanice. Implementována mapa po odletu (horní hvězda), Tichý důl se 6 úkoly, dvě generované scény a postupné obrazové opravy, deník, replay, materiál/data a instalace skeneru. Další dvě destinace pouze souřadnice Coming next. Data src/exploration.js, UI Exploration.jsx, roadmapa docs/exploration-roadmap.md. Ukládání rozšířeno o mineCompleted/scannerInstalled; SQL004 nutno nasadit, zatím nepotvrzeno. 47 testů, build a mobilní průchod ověřeny. Lokální, nepushnuto.

2026-09-24: Na přání uživatele rozšířen obsah bez ladění obtížnosti: Icebound Relay a Drifting Archive, každá 6 miniher, 6 zápisů, dvě vlastní generované scény a obrazové opravy. Odemknuté po skeneru, pořadí volné. Obě 6/6 odhalí Haven a společný deník; stanice ještě nehratelná. Src/destinations.js, sdílené Exploration.jsx, docs/planet-expeditions.md. Zásilky z nových lokací: energie/data a materiál/data, replay je neduplikuje. Ukládání iceCompleted/wreckCompleted, SQL005 zahrnuje004; živé provedení nepotvrzené. Lokální změny.

Ověření dvou expedic: 50 testů a build prošly. Mobilní průchod ice→wreck i wreck→ice přes preview, všech 12 miniher/krytů/deníků, Haven až po obou, reload a replay ověřeny; mapa 320/390 px bez překryvu. SQL005 na serveru dosud nepotvrzené.

2026-09-24 — Haven a brána mezi soustavami implementované. Šest oprav
(dok, energie, prstenec, propojení, souřadnice, HARD stabilizace), dvě nové
generované scény, postupné proměny, šest deníků, průlet a deník příletu.
Odemčení po ice6/wreck6; pevné zásilky použity jednou, opakované průlety
zdarma. Mapa Aster Veil s návratem do Haven; její planetární mise jsou
zatím Coming next. Save havenCompleted/jumpDone, reset a validace rozšířené.
Cloud vyžaduje SQL006 (zahrnuje004/005), na serveru zatím nepotvrzené.
Podrobnosti docs/haven-gate.md. Lokální změny, zatím bez pushe.
Ověřeno 54 testů, build a izolovaný mobilní průchod všech šesti úkolů,
průlet (cancel/skip/automat/reduced-motion), návrat a reload. Opravená
klikatelnost tlačítek v scene-caption; mapy 320/390 bez překryvu ovládání.
2026-09-24: GateTransit nově perspektivní Canvas warp (~7 s): nabití, hvězdné stopy, zpomalení. Bez kreslené lodičky. Skip/cancel a reduced-motion zachovány; lokální náhled, bez pushe.

## Na příště — poslední zadání 2026-09-24

Dnes skončit, pouze zapsat backlog. Příště dokončit obsah Aster Veil
(Survey buoy, Shattered moon, Verdant world). Po další zpětné vazbě
uživatele zpětně snížit/upravit počty tahů, zvlášť na začátku hry,
kde jich je podle něj absurdně moc; zatím limity neměnit.
Dodělat boosty: zvuky a boost za pět kamenů v řadě. NOVA již v kódu
existuje mimo úvodní kokpit; prověřit a dotáhnout hráčské fungování,
nikoli jen znovu přidat duplicitní pravidlo. Detaily docs/roadmap-next.md.
Haven a warp už pushnuté: d367e58, codex/cockpit-stage; starší poznámky
„bez pushe“ pro tuto etapu neplatí. SQL006 na serveru nadále nepotvrzené.

## 2026-09-25 — Mobilní ovládání miniher

Vyčerpání tahů po doběhnutí kaskád nahrazuje desku výsledkovým panelem,
resetuje scroll dialogu a přesouvá fokus na výsledek. Zkrácená hlavička
nezakrývá Retry ani Back to ship; výsledek již není pod deskou.
Stejné vrácení nahoru platí pro výhru a bezpečnou obnovu při chybě.
Nápověda je v horním sticky HUD jako ? s počítadlem 3/3 na pokus.
Platná nápověda odebere jedno použití, nikoli tah nebo energii. Během
zvýrazněné nápovědy nelze opakovaně čerpat stejnou radu. Retry obnoví 3.
Úvodní kokpit si ponechává bezplatné výukové zvýraznění prvního tahu.
Reklamy za další nápovědu zatím nejsou zapojené.
Replay v komoře přesunut doleva pod hlavní ovládání; titulek má omezenou
šířku, aby nezasahoval do pravých dveří Corridor. Lokální změny, bez pushe.

Upřesnění uživatele 2026-09-25: běžná hra se má vejít na displej,
posun delšího obsahu je přípustný. Nápověda pouze 1 zdarma na pokus,
další za odměňovanou reklamu (nahrazuje návrh tří). Reklamní služba
zatím nepřipojená, UI ji označuje coming soon a nepředstírá odměnu.
Ověřeno v izolovaném prohlížeči 320×568: kliknutí Corridor, jedna nápověda, výsledek bez desky a viditelné Retry/Back to ship, obnovení nápovědy při Retry. Build prošel. Mobilní komora má jen stručný horní štítek místo nadpisu přes hotspoty.

## 2026-09-25 — Pevné pořadí první kapitoly (nahrazuje volný výběr)

Uživatel schválil exteriér → komora3 → kokpit4 + navigace4 → koridor:
ubikace4 → kuchyňka4 → strojovna5 → exteriér4 (plášť/motory/podvozek/palivo)
→ HARD → Launch venku. Mapa před odletem jen přehled, jedna další etapa;
koridor nabízí jediné aktivní dveře. Po odletu volné návraty zachované.
Starý postup se nemaže; currentShipStage vybere první nedokončenou etapu.
Komora se nově ukládá i před kokpitem. Cloud vyžaduje SQL007 (zahrnuje004–006),
živé nasazení nepotvrzené. Viz docs/linear-chapter.md a src/chapterFlow.js.
57 testů a izolovaný mobilní průchod všech28 oprav, HARD i Launch prošly.
Změny zatím místní, bez pushe. Limity tahů se tímto neměnily.

2026-09-25: Uživatel zadal nové limity první kapitoly: komora20/12/12,
navigace20/12/30/12, crew10/14/16/18, galley12/10/20/13,
engine15/20/22/25/13, exterior25/15/30/30, launch30. Nastaveno přímo
v datech oprav; staré tuned výjimky v moveBudget odstraněné.
Kokpit už není tutoriál: boostery povolené, 7×7 první tři a 7×8 finále,
5/5/6/6 typů, cíle21krystalů /18komet+18hvězd /24krystalů+4kryty /
24paliv+24komet+6krytů, návrh14/16/20/22 tahů. Podrobnosti
 docs/move-budgets-2026-09-25.md. Uživatel obtížnost ještě osobně otestuje.
ID a postup zachované, expedice beze změny. 57 testů a build prošly.
2026-09-25: Další úprava kokpitu podle uživatele: limity nyní 14/16/24/24, diagnostika pouze 4 kryty [9,12,37,40]. Rozměry a barevné cíle zachované. Nahrazuje předchozí návrh 14/16/20/22 a šest krytů diagnostiky.

## 2026-09-25 — Přepínání EN/CZ
Hotový přepínač v nastavení; výchozí angličtina, čeština pokrývá UI,
opravy, příběh a deník všech současných kapitol. Nápisy v obrázcích beze změny.
Jazyk se ukládá místně odděleně od postupu; změna nerestartuje minihru.
Podrobnosti a rozšíření katalogu: docs/localization.md. Opraveno také
přetékání scén a překryv horních ikon s energií na úzkém telefonu.

## 2026-09-25 — Pokračování pokusu a gravitace pod kryty
Při vyčerpání tahů zůstává deska připojená, pouze skrytá za výsledkem;
+5 tahů obnoví stejnou desku bez nového vykreslení kamenů od začátku.
Kryty jsou pevně na políčkách, ale kameny pod nimi nyní podléhají gravitaci.
Zásah krytu stále pouze rozbije kryt a nesečte jeho kámen; tento kámen
může propadnout spolu s ostatními. Díry v masce stále oddělují sloupce.
Nahrazuje dřívější chování, kdy krytý kámen blokoval propad sloupce.

## 2026-09-26 — Aster Veil
Hratelná bóje (3 opravy) a po ní dvě volitelné výpravy Zelený svět a
Rozlámaný měsíc (6+6 oprav). Celkem 15 miniher a zápisů EN/CZ, generované
obrazy s proměnami zařízení. Sada Aster nahrazuje asteroid rudou a orb
biologickým jádrem; první soustava beze změny. Návrat po výpravách vede
na mapu Aster Veil. Data src/aster.js, dokumentace docs/aster-veil.md.
Lokální uložení, slučování a reset rozšířené. Pro cloud je nutné spustit
supabase/008_aster_veil.sql — dosud nepotvrzeno. Zatím bez commitu/pushe.

## 2026-09-27 — Elysium: přechod a první dvě části stanice
Implementován závěrečný level Aster Veil, přílet k obří stanici Elysium,
šest sektorů v celkovém pohledu a první dvě hratelné etapy: dok4/jádro4.
Devět miniher, deset deníků, šest generovaných scén, EN/CZ, lokální postup.
Další práce: centrální prstenec → obytný sektor → biosféra → observatoř.
Cloud vyžaduje supabase/009_elysium.sql (zahrnuje 004–008), živé nasazení
nepotvrzené. Viz docs/elysium.md. 68 testů a mobilní průchod ověřeny.

2026-09-27: Push a6fa895 na codex/cockpit-stage a GitHub Pages nasazení
ověřeny jako úspěšné. Poté lokálně přibyl centrální prstenec (4opravy,
4deníky, 3obrazy včetně rozsvíceného exteriéru). Vstup až po jádru4.
Nové elysiumRingCompleted; cloud SQL010 zahrnuje009 i předchozí migrace,
živé provedení nepotvrzené. Prstenec zatím nepushnutý. 69testů, build,
průchod13novými minihrami/reload/deník a320px ověřeny. Další: obytný
sektor → biosféra → observatoř. Viz docs/elysium.md.

2026-09-27: Na základě testu odstraněny ostré obdélníkové přechody mezi
poškozenou a opravenou grafikou Elysia. src/elysium.js má restorationMasks
s plynulým alfa okrajem; Exploration je respektuje, 4/4 ukazuje celou scénu.
Dílčí jádro/dok/prstenec vizuálně ověřeny, oprava zatím lokální.

2026-09-27: Schválena a zapojena vlastní šestice dlaždic Elysia:
chladicí náplň / energetický modul / datový čip / slitinový díl /
světelný článek / biokapsle. Společná sada v doku, jádru i prstenci,
přibližovací level ponechává Aster Veil. Mění se obrázky a EN/CZ texty,
ne typová ID cílů, počty, tahy, kryty, boostery nebo uložený postup.
Žádný nový inventář ani SQL. Viz docs/elysium-tiles.md. Změny lokální.

2026-09-27: Nabídka opakování má sjednocená plnošířková tlačítka,
čitelný font, ohraničený neprůhledný panel a klávesnicový fokus; nahrazuje
výchozí šedá tlačítka prohlížeče. Chladicí okruh ve strojovně
(engine-cooling) na přání uživatele zvýšen z15 na19tahů.

## 2026-09-27 — Elysium kompletní lokálně
Přidány zbývající3sektory: obytný, biosféra, observatoř, každý4opravy,
4deníky EN/CZ a dvojice scén; navíc kompletně osvětlený exteriér.
Postup pevně dok→jádro→prstenec→obytný→biosféra→observatoř.
Po24opravách Probuzené město a odpověď Havenu; celkem25miniher s trasou.
Data src/elysiumLater.js. Nová pole homes/garden/observatory (elysium...Completed).
Cloud vyžaduje kumulativní SQL011, zatím živě nepotvrzeno. Viz docs/elysium-city.md.
71testů, průchod12nových oprav/reload/deník a mobilní grafika ověřeny.
Následně pushnuto jako 63713fc na codex/cockpit-stage; nasazení Pages
neověřeno kvůli limitu GitHub API. SQL011 stále uživatelem nepotvrzeno.

## 2026-09-27 — Na příště: Trhlina
Uživatel chce dnes skončit a uchovat návrh dalšího směru. Viz
docs/rift-roadmap.md: Elysium zůstává základnou, observatoř zachytí ozvěnu,
výprava přes výzkumnou oblast a stabilizační majáky do červí díry.
Za ní samostatná kapitola objevování/aktivace cizího prstence-zahrady.
Pracovní rozsah Trhliny 3 lokace po4–5 úkolech; zvážit portálová pole
a rezonátory. Bez nové ekonomiky, návratový maják umožní další výpravy.
Jde o zaznamenaný návrh, ne hotový obsah; dnes nic neimplementovat.

## 2026-09-28 — Trhlina implementovaná
Uživatel navázal pokynem pracovat na návrhu. Po dokončení Elysia vstup
Prozkoumat ozvěnu → mapa Trhliny. Tři postupné výpravy po4úkolech:
Nemožná ozvěna, Poslední stanoviště, Pole stabilizátorů.13deníků EN/CZ,
nová portrétová grafika, postupné aktivace a samostatný neaktivní stav
majáků. Po12úkolech průlet, první pohled na zahradní prstenec a návraty.
Prstenec sám ještě nehratelný; portály na deskách/rezonátory odložené.
src/rift.js, Rift.jsx, rift.css; sdílené Exploration a GateTransit.
Nové save čítače riftEchoCompleted/Platform/Beacons (0–4),riftCrossed(0–1).
Cloud vyžaduje supabase/012_rift.sql, kumulativní po003–011; živé provedení
neověřeno.74testů, build a izolovaný mobilní průchod12úkolů včetně
reloadu, deníků, návratů a průletu. Viz docs/rift-chapter.md.
Změny lokální, bez commitu/pushe; poslední push63713fc.

2026-09-28: Trhlina pushnuta39d3db4. Následně na přání uživatele
vlastní RiftTransit místo recyklovaného GateTransit: obrazové přiblížení,
vlnící se zakřivený prostor, odhalení zahrady; 9,4s, pauza skryté karty,
skip/cancel/Escape. Reduced-motion staticky s tlačítkem Pokračovat.
Mobilní průchod a build ověřeny, tato úprava zatím nepushnutá.

2026-09-28 — Návrh pomůcek: public/prototypes/boosters.html je samostatný
interaktivní design, ne změna MiniGame. Uživatelovi se líbí ikony cílů
s počty a lištami; chce5dlaždic pomůcek přímo pod deskou (bez kufříku)
a nápovědu označenou Hint. Prototyp upraven, mobilní320×568/390×844
bez scrollu, deska při zaměřování stabilní. Viz docs/booster-ui-proposal.md.
Reklamy/platby ani skutečné účinky pomůcek zatím nejsou implementované.

2026-09-28: Mapy kapitol 2/3 používají SystemChart.jsx: volně rozmístěné cíle ve vesmírné scéně s oběžnými drahami, nikoli tabulku karet. Skener je viditelná akce po mine6, otevírá archiv/ledovou stanici. Haven a Elysium jsou přímo cíle mapy; žádné aktivační tlačítko pod obrazovkou. Minihry mají kompaktní obrazové cíle, Hint a kryty, bez spodních vysvětlujících odstavců. Ověřen průchod skener→archiv a Haven, mobilní rozměry 320×568/390×844 a minihra se čtyřmi cíli. 74 testů prošlo. Změny místní, bez pushe.

2026-09-28: Pět testovacích pomůcek skutečně zapojeno v MiniGame (Laser, Shuffle, Swap, Beam, EMP), každá 1 kus na pokus. Bez odečtu tahu, retry obnoví zásobu; +5 tahů nikoli. Zaměřování lze zrušit. Kryty pouze rozbíjí, výbuchy řetězí nálože, cíle a kaskády sdílené. Zásoba je pouze stav pokusu, nikoli cloudový inventář. Viz docs/booster-ui-proposal.md. Mobilní použití všech pěti ověřeno; zatím bez pushe.

2026-09-28: Hudba a efekty přesunuty ze spodních textových tlačítek ke stavové energii ve scénách i minihře. Dvě SVG ikony (nota/reproduktor), vypnutý stav přeškrtnutý, přístupné názvy EN/CZ a aria-pressed, původní ukládání preferencí zachované. Ověřen přepínač, mobil 320×568 a build.

2026-09-28: Zásoba pomůcek je nově trvalá napříč levely, retry i reloadem, nikoli 1 kus na pokus. helperStock.js/useHelperStock.js, místní úložiště oddělené pro účet/hosta a resetRevision; spotřeba před účinkem, synchronizace karet a Web Locks. Cloud pomůcek zatím není zaveden.

2026-09-28: Audit obtížnosti docs/difficulty-audit.md a scripts/audit-balance.mjs: 50 pokusů na level, bez inventářových pomůcek/+5. Konkrétní snížení tahů zatím pouze návrh, hra nezměněná kvůli mobilnímu testu. Uživatel chce postupné pomůcky od kapitoly 2 či jednorázové odměny; navržené pořadí a pravidla v dokumentu, dosud neimplementováno.

2026-09-28: Uživatel schválil snížení 11 limitů z auditu pro mobilní test: komora hatch9/seals10, navigace receiver9/chart25/route10, exterior engines11/gear18/refuel26, ice-lab22/wreck-records22, haven-dock20. Ostatní pravidla a limity zachované.

2026-09-28: Schválen nový název Beyond the Signal, primární EN a přepínání jazyků v menu. Připravují se tři vizuální varianty titulní obrazovky A/havárie, B/signál, C/kokpit. Viz docs/concepts/title-screen.md. Aktuálně pouze koncepty, menu/intro zatím nezapojené.

2026-09-28: Beyond the Signal titulní menu a tříscénové intro zapojené (Welcome.jsx/css, public/intro). EN/CZ, Next/Skip, 7s/scéna, pause při skryté kartě, reduced-motion, místní seen podle účtu/resetRevision, Continue zachovává postup, replay intra v menu. Klik na herní značku vrací menu. Podrobnosti docs/concepts/title-screen.md. Změny zatím místní.

2026-09-29: Podle pěti screenshotů chybove_hlasky odstraněn obecný spodní panel 'Tap the marked equipment…' ze všech nedokončených expedic v Exploration.jsx. Překrýval hotspoty ice5/wreck0/wreck5/haven0. Návrat a skok branou po dokončení zachované. Ověřeno kliknutí všech pěti stavů screenshotů a průlet z hotového Havenu na 390×740; build prošel. Bez pushe.

2026-09-29: Obnova energie před prvním odletem 10 minut, po launchDone 30 minut. Rozběhnutý odpočet se při odletu neprodlužuje; návrat do první kapitoly interval nemění. Lokální save energie ukládá interval pro obnovu po zavření hry. Starý 30min odpočet se před odletem zkrátí. Maximum stále 5, cloud beze změny.
## Další krok schválený 2026-09-29: testovací reklamy

Implementovat simulované reklamní okno s pozastavením hry a tlačítkem
pro zavření a získání odměny. +5 tahů jednou za pokus bez změny desky;
+1 energie při nule; 1 vybraný booster do trvalé společné zásoby
(jedna reklamní odměna za pokus společná pro všech pět druhů);
1 další nápověda za reklamu vedle první zdarma. Bez balíčku boosterů.
Zaznamenávat použitou pomoc pro ladění obtížnosti. Podrobnosti
docs/decisions-log.md a docs/roadmap-next.md. Pouze plán, zatím neimplementováno.


2026-09-29: Testovací reklamy implementované lokálně: +5 tahů, +1 energie při nule, jeden vybraný booster a další nápověda dle schválených limitů. Podrobnosti docs/decisions-log.md (Testovací reklamy lokálně implementované). Místní diagnostika použitých pomůcek pro ladění. Bez reklamního SDK a bez pushe.

2026-09-29: MiniGame zobrazuje 1,5s překryv Shuffling/Míchání při automatické obnově i boosteru Shuffle. Deska animuje kameny a blokuje vstup; reduced-motion má statický překryv se stejnou čitelnou dobou. Obnova bez tahu se vyhodnotí i na posledním tahu před výsledkem, aby pokračování +5 mělo hratelnou desku. Lokální změna, bez pushe.


## 2026-09-30 — Hratelná zahrada za Trhlinou
Šest úkolů v beyond-rift: terasa, zpáteční maják, most, voda, semenný archiv, HARD srdce zahrady. EN/CZ deník, viditelné aktivace, replay a místní ukládání gardenCompleted. Detaily docs/garden-chapter.md. Cloud vyžaduje supabase/013_garden.sql, zatím neprovedeno. Lokální změny bez pushe.


## 2026-09-30 — Výzkum na Elysiu a nové dlaždice
Po zahradě6/6 hratelný výzkum5úkolů, vlastní laboratoř, deník EN/CZ a tři nové dlaždice (semeno, vzorek, navigační hranol). researchCompleted0–5, cloud vyžaduje SQL014 včetně013; neprovedeno. Nová cesta ke Zhasínajícímu světu zatím rozluštěná v příběhu, její tři lokace a rezonátory jsou další krok. Detaily docs/research-and-fading-world.md. Lokální, bez pushe.

## 2026-09-30 — Retranslační stanice a rezonátory
Po výzkumu5/5 je hratelná fading-relay: čtyři úkoly, vlastní grafika,
výzkumné dlaždice, EN/CZ deník a rezonátory nabíjené sousedním přirozeným
spojením (nikoli výbuchem). Výhra vyžaduje všechny rezonátory; +5 tahů
zachová jejich náboj. relayCompleted0–4, cloud vyžaduje kumulativní
supabase/015_relay.sql včetně013/014; živé nasazení nepotvrzené.
91 testů a build prošly, mobilní průchod a reklamní pokračování ověřeny.
Lokální, bez pushe. Další obsah: Noční zahrada, potom útočiště výpravy.
Detaily docs/relay-chapter.md. Nahrazuje poznámku o pouze plánovaných rezonátorech.

2026-09-30: Rezonátory mají úvodní vysvětlení, znovu dostupné přes ◎ ?, zvýrazněné ortogonální sousedy a viditelný nabíjecí impulz +1. Dva rezonátory nově na plné desce 8×8 na pozicích26/45, cíle a tahy zachovány. 91 testů a build prošly. Lokální, nepushnuto. Viz docs/relay-chapter.md.


## 2026-10-01 — Mobilní scény, katalog, měření a dlouhodobý plán
Odstraněny zbývající scene-caption v celé kapitole1 i spodní departure-invite
po odletu (mapa dostupná nahoře). Obrazové scény jednotně9/16, základ i
opravené vrstvy contain, odstraněno top110 expedic; hlavičky s rezervou
pod ovladači. Mapy se samostatným rozvržením zachované. Uživatelův nově
avizovaný screenshot zatím nepřiložen.
Katalog src/levelCatalog.js obsahuje120jedinečných miniher včetně
HARD finále a přístupové trasy Elysium. Animace/skener nejsou levely.
Testovací panel balance.html přes Nastavení: místní úspěšnost, výhry
bez pomoci, využití pomoci, zbývající tahy, odchody/chyby, export/importJSON.
Nové pokusy jedinečnéID, vyčerpání tahů zápis ihned; výsledek pokračování
aktualizuje tentýž pokus. Konfigurace a cíle v exportu, aktuální tahy/rozměry
výchozí filtr. Max2000místních záznamů; žádná centrální analytika.
Bez20pokusů panel nenavrhuje obtížnost. Detaily docs/development-plan.md.
Dlouhodobý plán: stabilita→měření→prezentace→platformníbuildy→Noční
zahrada/útočiště→obsahové balíčky. Větší desky podle mechaniky, nikoli
plošně; mohou usnadnit hru.94testů/build, šestmobilníchscén a zapisování
vyčerpání/reklamního pokračování ověřeny. Lokálně bezpushe.


## 2026-10-01 — Společná analytika Supabase připravena
Automatická anonymní/pseudonymní hlášení pokusů i pro hosty, trvalá fronta
max2000, retry po online/focus/30s, backfill místních záznamů při prvním
spuštění. StejnéID a monotónnírevize pro pokračování +5. ServerRPC zapisuje
omezený payload, tajný tokenreportéra chrání aktualizace. Čtení pouze
účtem v balance_admins; panel umí načíst všechny testery. Žádné jméno/e-mail
v herních záznamech. Migrace supabase/016_balance_analytics.sql nezávislá
na postupu; správce přidat SQLpodle docs/balance-analytics.md.
97testů/build a browser test se simulovanýmRPC prošly. Živá migrace/role
zatím neověřeny, vyžadují zásah správceSupabase. Zatím místně, nepushnuto.
Nahrazuje poznámku, že centrální sběr není implementovaný; aktivace chybí.


## 2026-10-01 — Viditelné a potvrzené převzetí hosta
AccountButton má čekání a výsledkovou zprávu pro import: uložen online,
převzat pouze místně / chyba cloudu, prázdný host nebo chyba místního
uložení. useProgressSave.importGuest explicitně čte hosta, slučuje vyšší
postup do účtu a ověřuje RPC výsledek; při posunu přebírá i scénu.
Originální hostovský profil se nemění. Reset se nevolá, resetRevision
účtu se zachovává. Výpadek zachová import místně a dovolí zkusit znovu;
chybějící postup na serveru není označen úspěchem. Browser test s mockRPC
ověřil success/offline/empty a původní guest save; build prošel.

2026-10-01: Vlastní doména playbeyondthesignal.com funguje, uživatel ověřil Google přihlášení, obnovení postupu, historická data balance a zapnutí HTTPS. Lokálně přidána automatická kontrola verze hry s odložením na bezpečný uložený stav a verzováním obrázků. Podrobnosti docs/automatic-updates.md. Bez pushe.

2026-10-01: Kontextové EN/CZ bubliny pro nálože, kryty, rezonátory a pomůcky v MiniGame; pouze první relevantní setkání místně pro profil, opětovné otevření přes ⓘ. Blokují herní akce bez spotřeby zdrojů, neduplikují automatickou rezonátorovou pomoc. Docs/mechanic-tutorials.md; lokální, bez pushe.

2026-10-01: Mobilní kapitoly přizpůsobené dostupné výšce přes visualViewport/useSceneFit (proporce zachované, minihry beze změny). Balance dashboard má živé mini-statistiky, heartbeat pouze viditelné hry, společná pseudonymní identita analytiky, přístup správce. Nutná migrace supabase/017_player_presence.sql; dosud nepotvrzená. Podrobnosti docs/player-presence.md. Lokální, bez pushe.

2026-10-01: Obsahový plán pokračování po 120 levelech uložen v docs/progression-121-250.md, odkaz v docs/decisions-log.md. Rozsah 121–240 (šest etap po 20) + volitelný epilog 241–250. Pouze plán, nové levely/grafika nejsou implementované; před etapou rozpracovat úkoly a pravidla, tahy ladit analytikou.

2026-10-01: Noční zahrada má první hratelnou dávku 121–125 (night-glade, nightGladeCompleted 0–5), navazuje po relay4. Pět EN/CZ úkolů/deník, dvě generované portrétové scény, postupné světelné proměny. Pyl zaveden ve 122, kořenové uzly ve 123, další čtyři typy výzkumné sady zachované. Katalog125. Dále plánované 126–140 se stejnou sadou, další obměna až Útočiště. Docs/night-garden.md. Cloud018_night_garden.sql musí provést uživatel; zatím lokálně/nepushnuto.

2026-10-01: Druhá dávka Noční zahrady 126–130: Světélkující porost (night-grove, nightGroveCompleted 0–5), odemčení po mýtině5. Pět EN/CZ úkolů a deník, dvě nové generované scény, stejná sada night, katalog130. Cloud vyžaduje kumulativní supabase/019_night_grove.sql (zahrnuje018), živé provedení nepotvrzené. Docs/night-grove.md. 105 testů a mobilní průchod prošly. Lokální, bez pushe; předchozí dávka121–125 pushnutá f7d1d4b.

2026-10-01: Kořenová komora131–135 (night-root/nightRootCompleted0–5) navazuje po porostu5. Pět EN/CZ úkolů a zápisů, dvě generované scény, sada night zachovaná, katalog135. Cloud vyžaduje kumulativní supabase/020_night_root.sql; živě nepotvrzené. Docs/night-root.md. Další dávka136–140 setkání se správcem zatím plán. Lokální bez pushe.

2026-10-01: Noční zahrada zakončená svatyní136–140 a třípanelovým komiksem správce. nightSanctuaryCompleted0–5, caretakerMet0–1; po potvrzení140 automatické setkání, swipe/Další/přeskočení, replay z deníku, EN/CZ texty mimo obrazy. Skip ukládá stejné setkání, žádná energie. Tři komiksové ilustrace a samostatný opravený obraz svatyně; první komiksová ilustrace také výchozí prostředí oprav. Cloud021_caretaker.sql kumulativně zahrnuje020–018; živě nepotvrzené. Docs/caretaker-encounter.md. Katalog140, 112 testů a EN/CZ mobilní kontrola prošly. Lokální bez pushe; Útočiště141+ zatím plán.

2026-10-01: Útočiště kapitola9 začíná dokem141–145 (refuge-dock/refugeDockCompleted0–5), až po svatyni5 a uloženém/přeskočeném setkání. Nová sada postupně: filtr místo kořenů142, zásobovací kapsle místo pylu143; čtyři známé typy zachované. Dvě generované scény, dvě alfa PNG dlaždice, EN/CZ a deník. Cloud022_refuge_dock.sql kumulativní včetně021–018; živě nepotvrzené. Docs/refuge-dock.md. Katalog145, 115 testů a mobilní průchod prošly. Lokální bez pushe; další obytný blok146–150 zatím plán.


## 2026-10-02 — Přehled kapitol a přímé opakování
Lokálně implementován dialog Chapters/Kapitoly s devíti kapitolami, dostupnými lokacemi a dokončením všech145 miniher. Kapitoly dostupné z horního ovládání i úvodního menu, přímý přesun přes původní goTo a pravidla odemčení. Výzkum Elysia zařazen do kapitoly7, Útočiště označeno jako rozpracované5/5. Přehled nahrazuje redundantní horní tlačítka map; místní šipka a deník zůstávají. Dokončené úkoly ve scénách expedic, místností a kokpitu mají ✓ a přímé otevření, nabídky Replay v místnostech/expedicích odstraněné. Příběhový replay v deníku zachován. Hodnocení hvězdami dosud pouze plán. Testy117 prošly; izolovaný mobilní průchod320×568 ověřil skok z Útočiště do kapitoly3 a zpět, devět položek a otevření hotové minihry bez Replay. Bez pushe.


## 2026-10-02 — Samplované efekty boostů
Na přání uživatele nahrazeny výchozí syntetické boost efekty sedmi lokálními vrstvenými WAV samply: laser, Pulse, Nova, EMP, promíchání, výměna, paprsek. Podklady Kenney Sci-fi Sounds a Spring Spring Mechanical Explosion, CC0; původ, licence a použité vrstvy public/audio/README.md. Pulse0,40s bez dlouhého doběhu; souhrnná velikost150688B. Hudba a kaskády zachované. První zvuková aktivace načte/dekóduje pouze7 souborů, při chybě syntetický fallback, rate/voice limit a kompresor. Vypnutí efektů zastaví aktivní samplované zdroje. Build a browser OfflineAudioContext ověřily7 načtených efektů, potlačení rychlého opakování, chybějící soubor a nepřebuzené výstupy. Poslechová kvalita zatím k posouzení uživatelem. Náhled opět běží127.0.0.1:5173. Změny lokální, bez pushe. Pravidla krytů u rezonátorů a ochrana proti smůle dosud nejsou implementována.

2026-10-03: Přílet k Elysiu má tři nové WebP ilustrace a přeskočitelný komiks, replay z deníku. Sdílený StoryComic zachovává pozdější setkání se správcem. Uložení využívá elysiumArrival, nová SQL migrace není nutná. Viz docs/elysium-arrival-comic.md.

2026-10-03: Po první odletové animaci nový třípanelový komiks EN/CZ (místo havárie → signál → Kepler Reach), replay v departure-log. Odlet uložen před komiksem, skip přejde na mapu, bez nové SQL. Viz docs/departure-comic.md.

2026-10-03: První skok Haven → Aster Veil zakončuje nový třípanelový komiks EN/CZ (brána → modrá hvězda → poškozená bóje). Další cesty jej nevynucují; replay ve first-jump-log nemění scénu. Existující jumpDone, bez SQL. Viz docs/aster-jump-comic.md.

2026-10-03: Před prvním průletem Trhlinou komiks observatoř → kotvy → výhled na živý prstenec, EN/CZ. Skip/dočtení spouští původní RiftTransit, milník až po průletu. Replay v rift-arrival-log jen příběh. Bez SQL. Uživatel autorizoval okamžité pushování dalších předělů po ověření. Viz docs/rift-story-comic.md.

2026-10-03: Přidán komiks relé → Noční zahrada, tři přeskočitelné EN/CZ panely, replay v relay-descent-log. Místní preference zhlédnutí podle účtu a resetRevision, bez změny cloudového schématu. 126 testů, build a mobilní průchod ověřeny. Podrobnosti docs/relay-story-comic.md.

2026-10-03: Komiks návratu na Elysium spouštěný před první opravou výzkumu po garden6, replay v garden-heart-log. EN/CZ, skip, místní preference podle účtu/resetu, bez SQL. 127 testů, build a mobilní průchod ověřeny. Viz docs/research-story-comic.md.

2026-10-04: Elysium → Trhlina má třípanelový komiks odletu, EN/CZ, skip/replay z posledního zápisu observatoře. Spouští se při prvním vstupu rift/rift-echo před opravami po obnovení všech sektorů; místní preference podle účtu/resetu, bez SQL. 131 testů/build/mobilní průchod ověřeny. Viz docs/echo-departure-comic.md.


2026-10-04: Rezonátorové levely mají kryty mimo osm sousedních polí a od sebe, při dvou kruzích max.3 kryty. MiniGame používá src/goalRefill.js pro mírnou ochranu nesplněných, vzácných cílových barev proti dlouhému výpadku při doplňování. Stav na pokus, +5 jej zachová, retry resetuje. Nákup/reklama pravidla neovlivňuje. Případná pomoc po opakovaných prohrách pouze návrh v decisions-log.md. Ověřeno 135 testů. Změny lokální.

2026-10-04: Pojistka cílových barev zesílena: nulová dostupná zásoba znamená doplnění při nejbližším pádu, při 1–2 kamenech max.6 jiných nových kamenů před dalším. Kryté kameny se nepočítají jako dostupné. Analytika fair-refill-v3, lokální.

2026-10-04: BalanceDashboard automaticky načítá cloudový report každých 30 s a při návratu na kartu, ukazuje čas načtení. Dříve se obnovovala jen přítomnost hráčů. Živé ověření: 533 záznamů, všech pět night-* úkolů má novou výhru. Build prošel; oprava zatím lokální.

2026-10-04: Balance přehled řazen podle kapitol s čísly levelů, samostatné poslední pokusy a filtr zaznamenané verze pravidel. Kokpit ponechán na 14/16/24/24 po kontrolní simulaci 300 pokusů na level; viz docs/balance-review-2026-10-04.md. Audit distribučních assetů: scripts/audit-assets.mjs a docs/distribution-assets-audit.md. 140 testů a build prošly, přehled ověřen v izolovaném prohlížeči na 390 px. Změny zatím lokální.


2026-10-04 — Na žádost uživatele ulehčen začátek: počítač 24 → 28 tahů, diagnostika 24 → 32. Cíle, kryty, rozměry i boosty zachované. Simulace fair-v3, 300 pokusů: počítač 206/300 (69 %, dříve 50 %), diagnostika 250/300 (83 %, dříve 35 %). Jde o automat, ne lidskou úspěšnost. Nahrazuje předchozí doporučení tyto limity zachovat. Změna lokální.


2026-10-04 — Doplněn obytný blok Útočiště, levely 146–150, EN/CZ, vlastní grafika a deník. Dok vede přímo do nové lokace; katalog a kapitoly mají 150 miniher. Ukládání refugeHomesCompleted 0–5, kumulativní migrace supabase/023_refuge_homes.sql čeká na spuštění uživatelem. 143 testů, build a izolovaný mobilní průchod s reload/replay prošly. Podrobnosti docs/refuge-homes.md. Změny lokální, bez pushe.


2026-10-05 — Hodnocení 1–3 hvězd společné pro všech 150 miniher: 15/30 % zbývajících původních tahů (ceil), +5 limit nezvyšuje. Nejlepší výsledek v progress.stars, staré dokončené levely jedna hvězda, reset smaže hodnocení. Výsledky, hotové hotspoty a součty kapitol; zvláštní replay pro odletový test a Elysium approach. Kumulativní SQL024 připraveno, zatím neprovedeno. 147 testů/build a izolovaný mobilní browser prošly. docs/star-ratings.md. Lokálně bez pushe.

2026-10-05 — Připraven samostatný itch.io ZIP přes npm run build:itch: 150 miniher, 152 MiB, host s místním ukládáním, skryté Google přihlášení a administrace. Webový build zachován. 147 testů, oba buildy, CRC ZIP a produkční iframe s reálným tahem/reload prošly. Nahrání na itch.io zatím neprovedeno. Postup docs/itch-release.md. Lokálně bez pushe.
2026-10-06 — Na žádost uživatele připraveno publikování hodnocení všech 150 levelů a samostatného itch.io režimu. Znovu prošlo 147 testů a produkční build. Migrace SQL024 na serveru dosud nepotvrzená. Lokální videa, screenshoty a ZIP nejsou součástí commitu.

2026-10-06 — Opravy místností koridoru a dostupnosti cílových barev: kompaktní název místnosti pod navigací nepřekrývá hotspoty v ubikacích, kuchyňce ani strojovně. Nedokončená Zkouška systémů má vlastní ikonu; fajfka pouze po výhře. Sdílené generování úvodní desky vybírá z nejvýše 12 hratelných kandidátů dostatečné zastoupení cílových barev. Pojistka doplňování reaguje dříve i na tři dostupné krystaly; při 1–2 doplní nejpozději třetím novým kamenem. Tahy, cíle a placené odměny beze změny. 149 testů, produkční build a 12 izolovaných kontrol místností na 320/390/540 px prošly. Lokálně, bez pushe.


2026-10-06 — Pojistka barev v4: úvodní deska preferuje alespoň průměrné zastoupení nesplněných cílových barev a dostupný tah sbírající každou z nich, s omezením na 12 kandidátů a nejlepším dostupným výsledkem. Doplnění reaguje při 1–3 dostupných kamenech do třetího nového kamene; při podprůměrné zásobě bez cílového tahu do pátého, jinak do devátého. Počet volných kamenů nezahrnuje kryty ani právě sbírané kameny. Rozmístění doplnění nadále určuje gravitace; kombinace ani výhra nejsou garantované. Dokončené cíle a hojné barvy zůstávají náhodné, reklamy nemění pojistku. Analytická verze 2026-10-06-fair-refill-v4. Lokální, bez pushe.

2026-10-06 — Dokončena ošetřovna Útočiště (151–155): sterilizace, zásoby, diagnostika, kultura a HARD připravenost. Dvě vlastní imagegen WebP scény, pět EN/CZ deníků, známé dlaždice Útočiště a pojistka barev v4. Obnova kapitoly nyní 15/15, závěr potvrzuje spojení se záchrannou lodí a nové souřadnice. refugeMedicalCompleted 0–5 zapojený do resetu/merge/hvězd/kapitol/statistik; kumulativní SQL025 je připravené, živě nenasazené. 153 testů a build prošly; izolovaný dev průchod všech pěti oprav, reload/replay/návrat a rozložení na 320/390/540 px ověřeny. Viz docs/refuge-medical.md. Lokálně bez pushe; itch ZIP stále 0.1.1 se 150 levely.


2026-10-06 — Reklamní návštěvy: UTM zdroj/medium/kampaň, pseudonymní relace s 30minutovou obnovou při neaktivitě, nezávislá lokální fronta a UUID/revize proti duplicitám. MiniGame měří otevřené pokusy i jejich konečný výsledek; +5 aktualizuje tentýž pokus. Balance obsahuje agregace návštěv, zařízení, spuštění, výher a pokračování. SQL026 vyžaduje016, čtení pouze správci, nemění postup. gameVersion po aktualizačním načtení mizí z adresy bez ztráty UTM. 156 testů a build prošly; Uživatel potvrdil provedení SQL026 na serveru. Viz docs/campaign-tracking.md. Lokální, bez pushe.


2026-10-06 — Země návštěvníků: Country.is z browseru poskytuje orientační dvoupísmenný kód, bez ukládání IP/města/celé odpovědi. Bez cookies/refereru, limit4s, známá země na relaci, výpadek Neznámá a neblokuje hraní. itch build geolokaci nepoužívá. Balance má tabulku země × zdroj/kampaň s filtry a metrikami návštěv/spuštění/výher/pokračování/pokusů. SQL027 zachovává026 a doplňuje agregace pro správce; živé provedení nepotvrzené. 158 testů a build prošly, browser ověřil úspěch/výpadek, filtry a nepřítomnost IP. Viz docs/country-tracking.md. Lokální, bez pushe.


2026-10-06 — Oprava posledních pokusů: latestAttempts přijímá skutečné číselné milisekundy z MiniGame i starší ISO řetězce; Date.parse(number) dříve platné pokusy skryl. Nejde samo o důkaz ztracených dat. Geolokace po výpadku opakuje nejdříve za60s, balance ukazuje stav místní geolokace/fronty a chyby RPC. Balance upload má8s timeout.159 testů a build prošly; browser ověřil číselný čas, geo retry a diagnostiku. Veřejná produkce33fc7bf obsahuje trackování; skutečný browser lookup vrátilCZ. Bez nové SQL, lokální bez pushe.


2026-10-08 — Boost nápovědy až po prvním úspěšném použití: sedm samostatných EN/CZ témat Pulse/Nova/Laser/Shuffle/Swap/Beam/EMP. Žádné boostové okno při otevření první minihry, otevření až po animacích. Vytvoření nálože, výběr cíle, zrušení a chyba nic nespouštějí; skutečný řetězový výbuch ano. Potvrzení místně po profilu, kryty a rezonátory zachované. Docs/mechanic-tutorials.md. Lokálně, bez pushe.

2026-10-08 — CrazyGames Basic: samostatný build npm run build:crazygames a ZIP v releases. SDK v3 init před Reactem, gameplayStart/Stop podle minihry; LocalStorage pro Automatic Progress Save. Bez Google účtu, administrace, Supabase analytiky, geolokace a automatického webového reloadu. Dobrovolné bonusy zdarma, bez simulovaných reklam; Full monetizace dosud nezapojena. 160 testů a oba buildy prošly. Browser se simulovaným SDK: první minihra 1,60 MiB lokálních souborů, start event, žádné chyby, reload obnovil postup. Reálné SDK a portálové QA čekají na upload.

2026-10-08 — Oprava velikosti minihry v širokém iframe: MiniGame je React portál přímo pod body, proto nepřebírá CSS zoom rodičovské lodní scény. Sdíleno pro všechny edice. CrazyGames ZIP0.1.1. Browser kontroly900×560,390×844,320×568.

2026-10-08 — CrazyGames0.1.2: první jazyk dle SDK.user.systemInfo.locale (cs → čeština, ostatní/chyba → EN), uložená ruční volba má přednost. Zkompaktněna minihra pro široké rámce do620px výšky; při821×462/800×450 mají dlaždice28,7/27px namísto13,3/11,5px, bez scrollu. Browser se simulovaným SDK ověřil EN/CZ/DE fallback a ruční EN přes reload. Reálné SDK/čitelnost na dalších zařízeních ověřuje portálové QA.

2026-10-08: Přehled analytiky rozšířen o posledních 20 pokusů s délkou, použitými a zbývajícími tahy, pomůckami/nápovědou a chybějícími cíli. Souhrn levelů ukazuje počet známých zařízení a medián délky dokončených pokusů. Kampaně mají konverzní procenta a návštěvy bez spuštění; vše ze stávajících dat, bez SQL migrace. Délka zahrnuje čekání; zařízení nejsou osoby a UTM není důkaz placeného kliknutí.

2026-10-08 — Kvalita analytiky: společné vratné označení testovacích zařízení (jen správci), výchozí vynechání z pokusů/kampaní/zemí, průchod prvních10 levelů po zařízeních s volbou nových vs historických, mobil/desktop/unknown a těsné prohry. Návraty nových zařízení D1 a dny1–7 až po celém UTC období, vždy bez testerů. Nová SQL028 navazuje na027; nasazení na živé DB dosud nepotvrzené. Relace po30min pauze vzniká i bez reloadu, heartbeat zvyšuje revizi, souběžná karta neshodí dokončený výsledek na start a nový výsledek odešleme hned po rozpracovaném requestu. Doporučení obtížnosti vyžaduje20 dokončených pokusů a5 známých zařízení. Viz docs/analytics-quality.md. Herní limity nezměněné.

2026-10-08: Uživatel potvrdil provedení supabase/028_analytics_quality.sql na živém Supabase. Nahrazuje předchozí stav nepotvrzeného nasazení. Živé označení testerů a načtení rozšířeného přehledu zatím samostatně neověřené; návraty vyžadují uplynutí celého měřeného období.

2026-10-08 — Oprava Pages nasazení analytiky: a6ed9e6 prošlo CI testy/buildem, ale Deploy nejprve neviděl nahraný artifact; rerun nalezl dvě stejnojmenné kopie. Workflow nově používá jméno artifactu podle run_id/run_attempt a před deployem nejvýše60s ověřuje jeho jednoznačnou dostupnost. Veřejný web proto před opravou zůstal na2e938e0; chybějící označení testera nebylo způsobeno Brave.

2026-10-09 — Jazyková revize EN → CZ: ručně přečteno 1 634 katalogových položek a návody/rozhraní mimo katalog. Opraveny významové překlady, zastaralé pokyny a hlášky ukládání, sjednoceny kameny/pomůcky, upřesněny rezonátory a počty pylu. Nové kontroly překladů všech 155 levelů a příběhových panelů, cíle zachovávají čísla i po změnách limitů. Konfigurace všech 155 levelů proti výchozímu stavu shodné; příběhová logika beze změny. 175 testů a build prošly; EN/CZ mobilní a široký náhled ověřen. Nadpisy miniher vyhrazují prostor ikonám, česká Nápověda se vejde do HUD. Soupis před/po: docs/text-review-2026-10-09.md. Změny místní, bez commitu/pushe.

2026-10-10 — Dashboard má společný filtr zdroj/médium/kampaň pro návštěvy, země, průchod úvodem, typ zařízení, poslední pokusy, obtížnost a export JSON. Pokusy se vážou přes reporter + attemptId, nikoli všechny hry zařízení. Nepřiřazené pokusy zůstávají ve všech kampaních; pokus přes více kampaní může být v obou. Nová zařízení zachovávají první návštěvu z celé historie. Živá aktivita a serverové návraty jsou výslovně globální. Bez SQL migrace nebo změny hry. Testy a build prošly; izolovaný browser ověřil Bounty → všechny kampaně a neunikání jiných pokusů. Změny lokální.

2026-10-10 — Připravená prezentační stránka welcome.html (EN/CZ): představení hry, příběhový úvod, herní obrázky, datované novinky a Hrát zdarma. Samostatný vstup webového buildu; původní hra a Bounty odkazy na kořeni zachované, UTM se přenášejí. Novinky src/welcomeUpdates.js. Build a prohlížeč 1440/390/320 px v obou jazycích ověřeny. Detaily docs/welcome-page.md. Lokální, bez nasazení.

2026-10-11 — Návratový koridor na samostatné větvi codex/return-corridor (z webové cockpit-stage, bez Android změn). Kapitola 10, šest nových levelů156–161 po ošetřovně5/5; sledování trosek, napájení, zábrana, majáky, chlazení, HARD návratové okno. EN/CZ bubliny a deníky, dvě vlastní generované WebP scény, dílčí odhalování. Ukládání returnCorridorCompleted0–6, kapitoly, hvězdy a analytický katalog propojené. SQL029 připravená, nenasazená. 179 unit testů/build, EN/CZ browser průchod přes preview, replay/reload ověřeny; 100 simulací/level91/81/71/91/63/63% (nejde o lidskou obtížnost). Osobní hraní a živý cloud zbývají. Podrobnosti docs/return-corridor.md. Lokální prototyp, nepushnutý; Bounty/web beze změny. Android větev codex/google-play zůstává samostatně uložená na GitHubu (d1fa153), instalace nástrojů až na novém PC.

2026-10-11 — Na výslovnou žádost uživatele přeneseny levely156–161 do codex/cockpit-stage pro produkční web. SQL029 nově v transakci a opravuje limit cloudových hodnocení150→161; nasazení migrace čeká na potvrzení uživatele. Push produkce je autorizovaný, navazuje po SQL. Android kód se nepřenáší. Po nasazení uživatel chce projít nové výsledky Bounty.

2026-10-11 — Uživatel potvrdil úspěšné provedení SQL029 bez chyb. Migrace návratového koridoru je podle potvrzení nasazená; přenos mezi dvěma skutečnými účty/zařízeními ještě samostatně neověřen. Webová kapitola je v commitu1c88fb3, následuje autorizovaný produkční push.

2026-10-13 — Bounty úpravy MAGG/SoloRaven/Brave: nápověda pěti pomůcek při prvním výběru před spotřebou (další kliknutí teprve použije), Pulse/Nova při vytvoření a pojistka před prvním odpálením. Obrázkové vzory4/5/T/L a účinky3×3/kříž, explicitní tap/nepřesouvat, výběr tématu v ⓘ, zavření bez použití. U výhry dobrovolnost hvězd a cesta k replay. Pulse/Nova/EMP ztišené a změkčený nástup i syntetická záloha; hudba/obtížnost beze změny.180 testů/build a izolovaný EN/CZ browser prošly; offline audio render potvrzuje nižší špičky/RMS. Bez SQL. Podrobnosti docs/mechanic-tutorials.md. Změny lokální, bez pushe.

2026-10-14 — Webový Příletový dok, kapitola11, levely162–167 po koridoru6/6. Šest úkolů, párové regulátory, vlastní dvě WebP scény, EN/CZ a deník, refugeArrivalCompleted0–6, kapitoly/replay/hvězdy/analytika. Celkem167 levelů, staré parametry zachované.183 testů, simulace30/level a build prošly; detaily docs/refuge-arrival.md. SQL030 připravená, na serveru nenasazená. Produkční push čeká na SQL.

2026-10-14 — Uživatel potvrdil provedení SQL030 bez chyb. Migrace Příletového doku je podle potvrzení nasazená; autorizován produkční push levelů162–167. Živý přenos postupu mezi zařízeními zbývá ověřit.

2026-10-14 — Archiv ozvěn168–187 místně na webové větvi: čtyři oblasti×5levelů, EN/CZ, vlastní4WebP, živé světelné/holografické efekty, čtyři uložená pole0–5. Po příletu posádky, objasnění zpráv/identity/časových hlaviček a starší záchranné sítě, souřadnice tří dalších majáků. Kapitoly sjednocené: Živá mapa106–120, Noční zahrada121–140, Útočiště141–167, Archiv168–187; celkem9kapitol. Původních167 konfigurací zachováno a ověřeno.186testů/build, simulace30/level a izolovaný EN/CZ browser20oprav/reload prošly. SQL031 připravená, živě nenasazená; push po potvrzení. Detail docs/archive-echoes.md.

2026-10-14 — SQL031 uživatel potvrdil jako hotovou na živém Supabase. Archiv168–187 a UX průchodu připravené pro autorizovaný push. Sdílený journeyFor určuje další úkol bez změny při historické návštěvě; uvítání pokračuje k úkolu, scény ukazují místo/smysl/úkol, Zpět používá historii. Čtyři nové EN/CZ komiksy propojují návrat, přílet, přivítání a odpověď Archivu; existující sekvence jsou obnovitelné a přehratelné z kapitol. Preference zhlédnutí místní pro profil/restart, bez dalšího SQL. Po187 výslovný konec vydaného příběhu. Dialogy portálem mimo měřítko scény.188testů/build a izolovaný EN/CZ průchod32oprav prošly. Detaily docs/journey-guidance.md.


2026-10-16 — Balance má společný přepínač Hráči/Boti/Všichni, výchozí Hráči. Botí zařízení určuje návštěva source=automated_test a medium=bot v libovolné kampani; klasifikace celé historie reporter ID včetně přímých návratů. Všechny přehledy/export respektují výběr; živá aktivita a návraty i přepínač interních testerů. Nová čtecí migrace supabase/032_bot_traffic.sql vyžaduje028/017, živě zatím nenasazená. Docs/bot-traffic.md. Změny lokální, bez pushe.

2026-10-16 — Uživatel potvrdil úspěšné provedení supabase/032_bot_traffic.sql na živém Supabase. Rozdělení Hráči/Boti/Všichni připravené k nasazení webu; živé přepnutí a serverové součty ještě samostatně neověřené. Ověřeno191 unit testů a build.


2026-10-16 — Rozdělení analytiky Hráči/Boti/Všichni nasazeno na produkční web, commit b8e6788, GitHub Pages běh38927923908 úspěšný. Veřejná verze a nový balance bundle ověřené; uživatel potvrdil viditelnost přepínače. SQL032 podle jeho potvrzení nasazená. Nahrazuje starší stav pouze lokálních změn. Správnost živých součtů všech skupin dosud samostatně neověřená.

Navazující práce: rozbor GitHub botích reportů po zařízeních. Pixel7/CZ ZIP:168 výher, bot skončil v otevřeném lodním deníku po prvním úkolu Archivu; nejde zatím o prokázané zablokování levelu169.27 chyb HTTP400 míří na record_balance_attempt, chybí tělo odpovědi; žádné pageErrors ani vizuální nálezy. Ověřit zavření deníku/pokračování169 a příčinu analytických400, pak další zařízení (překryvy na konci, iOS, malé kameny). Hru ani obtížnost jsme podle reportů zatím neměnili. Telegram rozpracovaný na samostatné codex/telegram-stars (d614c8e, f27b4fe), nyní odložen ve prospěch webu.

2026-10-17 — Připravena první dávka QA ZIPů EN: GalaxyS9+320×658, notebook1366×768, Firefox1440×900, desktop1920×1080. Všechny187výher/konec hry, celkem833screenshotů; žádné zaznamenané konzolové/pageErrors/HTTPchyby. Jediný automatický vizuální nález v každém běhu:2×zakryté tlačítko na konci (Galaxy rating-stars, ostatní section návratového koridoru). Jde o novější běhy než včerejší Pixel/CZ; nezaměňovat s původním souhrnem. Inventář a společný registr docs/qa-device-review-2026-10-17.md. Čeká se na druhou dávku; zatím žádné opravy hry, botů ani obtížnosti. Všechny screenshoty ještě nejsou vizuálně prohlédnuté.

2026-10-17 — Druhá EN dávka QA převzatá: SE49výher/54snímků, ProMax43/46, iPad34/40, telefonnašířku187/211. Oba iPhony/iPad skončily na celkovém5,5h timeoutu s opakovanými3s timeouty kliků a rostoucími délkami levelů; příčina hry vs botů/runneru neprokázaná, poslední snímky už ukazují další desku. Na SE kameny21–22CSSpx (692varování), našířku9–14px (9774varování) a zmenšené scénové ovládání. Všechny nové reporty bez console/pageErrors/HTTPchyb. Celkem obě dávky8reportů/1184snímků, pět úplných187levelovýchprůchodů; starší Pixel/CZ samostatně. Sloučený registr a priority docs/qa-device-review-2026-10-17.md, podklady qa-batch-2 ve vizualizační složce. Další ZIPy tohoto kola už nejsou potřeba; pokračovat krátkou reprodukcí iOS zpomalování a cílenými opravami velikosti/šířky/překryvů. Zatím bez změn hry/botů/obtížnosti; všechny screenshoty nejsou ručně prohlédnuté.


2026-10-17 — Dokončen podrobný rozbor všech9 QA ZIPů:8nových EN + starší Pixel/CZ. Přečteny celé strukturované logy/poznámky/nálezy, všech1367snímků přehledově na60kontaktníchlistech, vybrané zvětšené případy a porovnání s kódem. Seznam16položek s důkazy/prioritou/přijetím: docs/qa-fix-backlog-2026-10-17.md (6UIúprav,4diagnostiky,6testovacíchúprav). Hlavní: malá deska SE a pevný strop velkých displejů, telefonnašířku/desky/rezonátory/scénovýzoom, výsledky a0energie. iOS zpomalování a koncové překryvy dosud nemají prokázanou příčinu. Korekce: místní auditor už ignoruje potomky tlačítek, proto Galaxy rating-stars nelze bez DOM důkazu odmítnout jako potomka; prověřit i skryté předky/details. ProMax úvod bez ilustrace může být předčasný screenshot. Testy nedokumentují systematicky výhry/komiksy/dialogy/animace; nenahrazují fyzická zařízení. Podklady qa-detailed (index/screens.json, levels.csv, evidence,60listů) ve vizualizační složce. Zatím žádné změny herního/botího kódu, obtížnosti, commity ani push oprav.

2026-10-17 — Implementovány společné opravy podle QA backlogu: větší adaptivní minihry (max680×1040), přímé měření desky místo cqh/size containment, minimum buněk, kompaktní HUD na krátkém telefonu, opravené pořadí CSS a výchozí max-width dialogu. Výhry mají hlavní akci před vysvětlivkami, výsledky i vstup bez energie automatickou výšku. Scéna se zmenšuje samostatně, horní navigace/energie/audio zachovají rozměry. Dotykový telefon na šířku má modální výzvu k otočení bez resetu pokusu. Zavřený journey panel explicitně skrytý, průvodce má data-journey-kind. Diagnostika balance-cloud-error bez tokenu/request payloadu; příčina starých400 stále nepotvrzená. 191unit testů/build a38browser kontrol Chromium/WebKit prošly, včetně20tahů+pomůcky, výsledků, +5na stejné desce a konečného postupu. Firefox binárky na tomto Windows nespustitelné; samostatné Linux CI pro3enginy. Upravená místní kopie botů: navigace z deníku, bezpečnější pomůcky, timeouty/provenance/důkazy; Galaxy/CZ2výhry bez nálezů. Cizí QA GitHub tím není automaticky aktualizovaný. Podrobnosti docs/qa-fixes-2026-10-17.md; iOS úplné běhy a analytické400 zůstávají k potvrzení. Obtížnost a uložený postup beze změny.

2026-10-17 — QA opravy publikované: commit e9edfa24e3b58231b5a446ff2c80aa852b5570ee, nasazení39021923594 success; živý version.json1792229950707-e9edfa24e3b5. Browser layout checks39021923681 úspěšné na Linuxu včetně Firefoxu (lokální Windows problém s binárkou tím neblokuje ověření). Navíc8kontrol skutečného produkčního dist Chromium/WebKit prošlo. Připravený předávací ZIP botů: C:/Users/preto/.codex/visualizations/2026/10/16/01a14548-408c-7f41-a4d0-21c89b0de166/qa-bot-update-2026-10-17.zip; obsahuje4upravené soubory a návod k integraci do novějšího QA repozitáře, ten jsme neměnili. Pro nový běh lze použít utm_campaign=qa_02 se stejným automated_test/bot. Úplných187levelů po těchto opravách ještě neproběhlo; staré iOS/HTTP400 zůstávají k potvrzení.

2026-10-17 — Chaos-2 report potvrdil refresh exploit energie na všech4zařízeních. Opraveno rezervací článku při prvním platném tahu, synchronně před animací; výhra a technická chyba jej vrátí právě jednou, refresh/odchod/prohra ponechají jediný odečet. Otevření/neplatná výměna/pomůcka před placeným tahem zdarma. +5znovu umožní refund za výhru bez dalšího čistého odečtu; retry nový pokus. Energie nyní viditelně klesá při prvním tahu a vrací se při výhře, obnova běží od rezervace. Bez beforeunload a SQL. Src/attemptEnergy.js; docs/refresh-energy-2026-10-17.md. 196unit testů a16cílených browser kontrol Chromium/WebKit prošly včetně reload během animace, poslední energie, prohry/quit/retry/continue a technického faultu. Ostatní reportované překryvySE při rotaci jsou záměrný modální prompt auditovaný pod špatným kořenem; horizontální údaj je samostatná diagnostika. Úplné průchody a nasazení této energetické opravy zatím následovat.

2026-10-17 — Energetická oprava nasazená: bc56aeb523947d74d80cf9d8b507e5101958cba7, Pages39024872362 success, živá verze1792232778766-bc56aeb52394 ověřená. Úplné Browser layout checks39024872358 success včetně Firefoxu/Chromia/WebKitu. Pro další chaos test srovnávat5před prvnímtahem →4po tahu →4po refreshi; refresh už nestrhává druhou energii.196unit testů/build a16cílených reload/energie kontrol prošlo také místně.

2026-10-17 — Na žádost promyslet návrh obtížnosti přečten i nalezený Downloads/balanc-1.zip (187levelů,200her/profil). VšechnaID/čísla/limity odpovídajíaktuálnímu katalogu. Úspěšnostcasual80,3% do100;66%101–120;57,7%121–140;51,7%141–160. Připraven konkrétní návrh limitů a oddělených variant krytů v docs/balance-proposal-2026-10-17.md; zatím pouze návrh, herní data nebyla změněna. Nedoporučeno slepě+5–8všem a přebrat limity48–56;156/159 ponechat.154 nemá rezonátor:8×8/6typů,6krytů,30semen+27chladiva, kandidat36tahů/kryty4. Stuck není doložený softlock bez zdrojůsimulátoru. Přesných17nad10%:53,67,120,125,134,138,144,148,149,150,153,154,155,158,164,174,177;151/152 do nich nepatří. Živá hráčská data neověřena. Při budoucím nasazení změnitverzipravidel v recordResult, zachovatID/postup a porovnat stejnéseedy A=tahy,B=kryty,C=obojí.

2026-10-17 — Uživatel výslovně zadal provést a pushnout návrh balance. Implementována kombinovaná varianta C z docs/balance-proposal-2026-10-17.md:19limitů (138+vybrané141–160), čtyři kryty138=[9,12,37,40],149/154=[9,14,49,54].156/159 bezezměny; barevné cíle/rezonátory/desky/ID/postup zachované. Nová analytická verze2026-10-17-refuge-balance-v1 v BALANCE_RULES_VERSION.196unit testů/build prošly,300otevření upravených desek platných, všech187ID/pořadí a ostatní limity ověřené proti balanc-1.zip. Snapshot katalogu aktualizovaný pro schválené limity. Nový úplný balance běh provede uživatel; zlepšení win-rate zatím neměřené.
