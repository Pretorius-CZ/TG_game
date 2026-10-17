# Výkon — perf-1.zip, 2026-10-17

Stav: rozbor reportu a zdrojového kódu, seznam optimalizací a ověření.
Tento krok nemění herní kód ani nic nepublikuje.

Následná implementace načítání, reprodukce drahého blur efektu a ověření:
[společné opravy](qa-complete-fixes-2026-10-17.md).

## Rozsah a důvěryhodnost

Report ze 17.10. v16:12: šest měření načtení a šest průchodů prvními
10levely, GalaxyS9+, Pixel7 a notebook1366×768, vždy1× a4×CPU.
Všechny průchody mají10výher a prázdné jsErrors. Přečteno všech12JSON
a souhrn; všech66PNG prohlédnuto přehledově na třech kontaktních listech
v `.local/perf-review`. Úvod, desky a výsledky bez nové zjevné rozpadlé
obrazovky. Statické snímky nedokládají plynulost animací.

Názvy profilů nejsou důkazem měření na fyzických telefonech. Souhrn sám
upozorňuje na server bez grafické karty. ZIP neobsahuje zdroj testu,
verzi hry/prohlížeče, renderer/GPU, přesné nastavení sítě, časové průběhy
ani Performance trace. Screenshoty nemají oddělené1×/4×varianty.
Chybí iOS/WebKit, dlouhý průchod i pozdní efekty a desky.

## Naměřeno

| Profil | FPS medián1×/4× | Nejhorších10 %1×/4× | Dlouhé úlohy1×/4× | Nejdelší1×/4× |
|---|---:|---:|---:|---:|
|GalaxyS9+|60 /59|57 /54|21 /32|123 /159ms|
|Notebook|26 /27|24 /24|1 /14|59 /155ms|
|Pixel7|44 /46|39 /39|0 /17|0 /149ms|

V žádném běhu není zaznamenaná úloha přes200ms. Minima FPS5–17 bez
časového průběhu neurčují četnost nebo okamžik záseků. Počty dlouhých
úloh nejsou normalizované na počet tahů či délku měření.

Načtení ve všech variantách uvádí4,61MB/25požadavků:

| Profil | PLAY1×/4× | LCP1×/4× |
|---|---:|---:|
|GalaxyS9+|406 /2457ms|380 /2384ms|
|Notebook|408 /2346ms|388 /18652ms|
|Pixel7|625 /2460ms|600 /2396ms|

## Seznam práce

### P1 — Omezit úvodní přednačítání a oddělit připravenost scén

Potvrzeno v `src/main.jsx`: mount efekt hromadně načítá16obrazů
`allScenes` přes `Promise.all`, i když App právě zobrazuje Welcome.
Jsou mezi nimi všechny stavy kokpitu/komory, exteriéry a chodba.
Pět největších souborů reportu tvoří čtyři opravené kokpity a airlock-3,
dohromady přibližně1,675MB. Ty první uvítací obrazovka nepotřebuje.

Navíc globální `loaded` podmiňuje některé dveře/hotspoty a loading panel.
Selhání jednoho nepotřebného budoucího obrazu tak může blokovat části
ovládání; report toto selhání netestoval, riziko plyne z kódu.

Navržená úprava: upřednostnit úvod a aktuální scénu, další pravděpodobný
stav předehřát později. Připravenost/chybu/retry vztáhnout k potřebným
assetům konkrétní scény. Zachovat opravy složené z několika vrstev,
odměny a návraty bez blikání nebo předčasného odkrytí opravy.

Přijetí: srovnat alespoň5studených načtení stejného buildu/profilu,
síťový waterfall, čas prvního skutečně použitelného ovládání a obrazů;
otestovat chybu budoucího assetu, retry aktuálního a rychlou navigaci.
Z reportu nelze slíbit konkrétní zrychlení ani úsporu celé4,61MB.

### P1 — Vysvětlit notebook26FPS a LCP18,652s

Notebook má málo dlouhých JS úloh a FPS se po4×CPU téměř nemění;
u Pixelu se dokonce nepatrně zlepší. To podporuje prověření vykreslování,
softwarového rendereru a režie testu. Nepotvrzuje konkrétní příčinu
a nevylučuje problém renderování samotné hry.

LCP notebooku4× je výrazný odlehlý výsledek. PLAY ve2,346s nepotvrzuje
načtený hlavní obraz: `Welcome.jsx` tlačítko vykreslí před stavem `ready`.
Potřebujeme konkrétní LCP element/URL a časové záznamy, aby šlo rozlišit
pozdní úvodní obrázek, změnu obrazovky během měření a chybu sběru.
Příčinná souvislost s přednačítáním zatím doložená není.

Přijetí: opakovat samostatně na stejném stroji, uložit verzi/renderer,
síťové podmínky, LCP entry a Performance trace. Oddělit načtení úvodu
od následné navigace. Během měřených animací vypnout screenshoty
a výpočet tahů bota nebo jejich čas označit. Porovnat klidnou desku,
swap/kaskády a exploze; přidat fyzický telefon a notebook s GPU.

Teprve podle trace optimalizovat konkrétní paint/layout/JS práci.
`useSceneFit` kombinuje zápisy stylů a čtení geometrie a sleduje ResizeObserver;
jde o kandidáta k profilování, nikoli prokázaný zdroj tohoto FPS problému.

### P2 — Delší test paměti a pozdních kapitol

Heap mezi výhrou1 a10 roste o0,7–0,8MB; trend0,07–0,08MB/level.
Úvodní vzorek level0 má4,8–5,0MB, tedy není uvedeným `memory.startMB`.
Listeners381→376, počty DOM uzlů317→419 během průchodu kolísají,
například388→327 mezi7.a8.levelem. Různé desky/cíle mají různý DOM.
Nejde o důkaz úniku ani o důkaz jeho nepřítomnosti.

Tvrzení souhrnu „nad1MB/level ukazuje na únik“ nepřebírat jako rozhodovací
pravidlo. Nutné srovnávat stejný ustálený stav a zohlednit garbage collection.
JS heap také nezahrnuje celou paměť obrázků, GPU a procesu prohlížeče.

Přijetí:50–100cyklů replay/quit/retry/navigace se vzorky stejné obrazovky,
odděleně běžné použití a diagnostické snapshoty po GC; prověřit zachované
objekty/detachedDOM/timery. Doplnit delší postup do pozdních kapitol,
nálože/řetězení, rezonátory, mapy a opakované otevření dialogů. Tím teprve
prověřit i dřívější výrazné zpomalování dlouhých iOS běhů.

## Pořadí

Nejdřív upravit plán načítání s měřením před/po; souběžně připravit
reprodukovatelný notebook trace a důkaz k LCP. Následně cílená optimalizace
podle trace a dlouhý paměťový test. Dosavadní data nejsou důvodem ke
snižování velikosti desek, vypnutí všech efektů nebo změně obtížnosti.
