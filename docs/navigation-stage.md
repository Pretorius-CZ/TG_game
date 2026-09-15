# Spojení, navigace a příprava odletu

Pracovní design 2026-09-15. Navazuje na 21 hratelných oprav. Tato etapa
zatím není implementovaná. Zachovává schválený příběh a volbu místností.

## Vstup a průběh

Vracíme se do opraveného kokpitu. Jeho čtyři dokončené opravy zůstanou
hotové; nový boční komunikační panel nabídne Communications & Navigation.
Použít bližší pohled na konzoli v témže kokpitu, ne nové dveře v chodbě.
Návrat Back to cockpit. Základní osvětlení, okna a počítač se nikdy neresetují.

Etapa je dostupná po dokončení tutoriálu kokpitu souběžně s ostatními
místnostmi. Čtyři úkoly uvnitř jdou postupně. Živá odpověď nesmí tvrdit,
že ostatní části lodi jsou hotové. Odlet je samostatný společný milník.

## Čtyři výrazné proměny

Rozměry desek jsou sloupce × řádky. Cíle jsou návrh pro herní test.

| ID / název | Viditelná odměna | Minihra |
|---|---|---|
| nav-antenna / Signal antenna | Obnoví se velký ovladač antény; venku se vysune anténní segment a rozevře přijímací hlava | 7 × 7, 6 typů, 20 krystalů |
| nav-receiver / Communications | Velký boční displej přejde z mrtvé plochy na pohybující se průběh signálu a krátkou odpověď | 7 × 7, vykrojené rohy, 6 typů, 42 kamenů |
| nav-chart / Star chart | Nad konzolí se objeví velká modrá prostorová mapa s cílovým bodem | 7 × 8, 6 typů, 22 hvězd |
| nav-route / Flight route | Mapou se vykreslí zlatá trasa, cíl se zvýrazní a hlavní displej zobrazí Course verified | 7 × 8, vykrojené rohy, 6 typů, 50 kamenů |

Žádný krok nesmí být jen výměnou textu nebo malé kontrolky. Mapu a křivku
signálu tvořit jako samostatné animované vrstvy nad pozadím; texty jako HTML.
Po opravě antény nabídnout See your ship stejně jako po opravě pláště.

Exteriér musí skládat nezávislé stavy: osvětlený kokpit, oprava pláště,
těsnění a anténa. Anténa může být hotová před pláštěm. Použít přesně zarovnanou
samostatnou vrstvu antény nad existujícími exteriéry, případně ověřené varianty
všech relevantních kombinací. Nikdy nepřepsat opravený plášť starým obrázkem.
Motory do startu zůstávají v pohotovosti bez tahu.

## Bubliny a deník — pracovní anglické texty

### Signal antenna

Pilot: “The beacon's coordinates survived. First, I need an antenna that can hear more than static.”

Personal log — A direction in the noise:
“The receiver is picking up a pulse from the recorded bearing. It matches the old expedition beacon. The message itself is still buried in static.”

### Communications

Pilot: “There is a pattern in the noise. Let's restore the receiver and send a short reply.”

Při odhalení opravy nejprve krátce zobrazit odeslanou výzvu
“If you can hear me, repeat this code: SEVEN FOUR.” Následně příchozí text
“SEVEN FOUR. We hear you. Follow the beacon.” Tím je pro hráče srozumitelné,
že nejde jen o starý záznam. Bez portrétu a bez odhalení identity vysílajícího.
Animaci lze přeskočit; plný text zůstane v deníku.

Transmission record — An answer:
“OUTGOING: If you can hear me, repeat this code: SEVEN FOUR.
INCOMING: SEVEN FOUR. We hear you. Follow the beacon.”

### Star chart

Pilot: “Someone answered. Now I need to place those coordinates on a working chart.”

Personal log — A point among the stars:
“The beacon now has a place on the chart. Someone is waiting beyond this moon. The lights on the ridge are still another question.”

### Flight route

Pilot: “A destination is not a safe route. I'll check the approach before asking this ship to fly.”

Navigation record — Course verified:
“BEACON COORDINATES CONFIRMED. APPROACH ROUTE VERIFIED.
Departure requires completion of all ship repairs.”

Zápisy se odemykají podle oprav, čtení je nepovinné a replay nic nepřidává.
Tato etapa neobjasňuje identitu vysílajícího ani nezavádí nový důvod havárie.

## Tahy a reklama

Nová pravidla platí pro celou hru, ne jen tuto etapu. Před hrou ukázat cíl
a počet tahů, během hry zřetelné Moves left. Přesné rozpočty nastavit až
podle úspěšnosti testovacích her; z cílových počtů je nelze spolehlivě odhadnout.

Návrh pravidel: platná výměna spotřebuje jeden tah, neplatná žádný,
kaskáda ani automatické promíchání další tah nestojí. Nejprve vyřešit celou
kaskádu a výhru, teprve potom vyčerpání tahů. Výhra posledním tahem platí.

Při neúspěchu nabídnout Watch ad — extra moves a Retry level. Reklama je
dobrovolná; dostupnost a odměnu potvrzuje reklamní integrace. Při zavření,
chybě či nedostupné reklamě zachovat desku a nabídnout opakování. Odměnu
připsat pouze jednou za potvrzené zhlédnutí, nikoli za samotné kliknutí.
Počet přidaných tahů, počet reklam za pokus a výjimka tutoriálu jsou otevřené.
Bez poskytovatele reklam nesmí prototyp předstírat funkční monetizaci.

## Odlet a další kapitola

Course verified přidá v kokpitu přehled připravenosti: Cockpit 4/4,
Airlock & Hull 4/4, Crew quarters 4/4, Galley 4/4, Engine room 5/5,
Navigation 4/4. Chybějící oblast je klikací cesta k další práci.
Launch se zpřístupní až při všech 25 opravách; samotná poslední navigační
minihra nesmí přeskočit nedokončené místnosti. Start hráč spustí sám.

Krátké finále: opravená loď → náběh motorů → vzlet → hvězdy a směr majáku.
Respektovat omezené animace. Před opuštěním první kapitoly bude potřeba
trvalé ukládání postupu. Dokud další kapitola není hratelná, zakončit
Chapter complete s možností vrátit se k lodi.

Výstavba stanice / velké základny je schválená budoucí etapa. Pracovní
přechod: po nalezení zdroje signálu pomoci vybudovat bezpečné zázemí.
Konkrétní místo a vztah k vysílajícímu zůstávají otevřené. Zachovat jednoduchost:
výhra v match-3 přidá nebo obnoví viditelný modul; zatím bez zásob surovin,
časovačů výstavby a správy obyvatel. Výstavba nenahrazuje odlet za signálem.

## Postup realizace

1. Připravit přiblížený kokpit a čtyři obrazové odměny, samostatnou anténu.
2. Zapojit úkoly, bubliny, deník a navigaci; ověřit obě pořadí plášť/anténa.
3. Přidat a odladit společná pravidla tahů; reklamní integraci samostatně.
4. Přehled všech oprav, ukládání, odemčení startu a krátké finále.

Ověřit zejména: zachování předchozích oprav při návratu, výhru posledním
tahem, žádnou odměnu při nedokončené reklamě, idempotentní odměnu reklamy,
replay bez postupu a zákaz startu při libovolné chybějící opravě.

## Implementace 2026-09-15

Spojení a navigace jsou hratelné: čtyři nové opravy v detailu konzole,
čtyři match-3 levely, bubliny a zápisy. Po anténě See your ship; anténa
se skládá nezávisle nad aktuálním exteriérem včetně odměn komory/pláště.
Po přijímači krátká výměna SEVEN FOUR, po mapě velký hvězdný displej,
po kurzu animovaná trasa. Komponenta NavigationArt.jsx, data navigationRepairs.js.
Kokpit má vstup na navigaci a přehled všech šesti oblastí s odkazy.
Celkem 25 hratelných oprav. Finální vzlet, ukládání a společný limit tahů
s reklamní integrací jsou další práce; tato změna je nepředstírá.

Grafika: public/scenes/navigation-console.png a navigation-console.webp,
vestavěný imagegen podle cockpit-4-diagnostics.webp. Zadání: matching portrait
9:16 close-up of side communications/navigation console in the same repaired
supply ship cockpit; ivory metal, orange trim, cyan window seals, planet
and mountains; large inactive navigation glass and separate communications
display, antenna control on left, no people or baked text/UI, quiet top and
bottom for game overlays. Obrazové displeje a anténa jsou SVG/CSS vrstvy,
texty HTML. Při omezených animacích se křivka a trasa zobrazí staticky.
Ověření: 18 unit testů a produkční build prošly; mobilní průchod kokpit → navigace → komora (12 levelů), živá odpověď/deník, replay a nezávislé stavy antény/pláště prošly. Zkontrolovány snímky konzole, mapy a antény.
Grafický vstup (2026-09-15): v dokončeném kokpitu je na pravé konzoli samostatný svítící klikací displej s hvězdnou trasou, názvem NAVIGATION a stavem oprav. Nahrazuje původní obecnou značku; textový vstup v přehledu zůstává.
Oprava 2026-09-15: grafický panel navigace je dostupný ihned při 4/4 i během odměny Ship diagnostics. Podmínka celebration jej již neskrývá. Kliknutí přímo otevře navigaci a zavře odměnu; návrat přes komoru ani textový odkaz pod scénou nejsou nutné.

2026-09-15 — Návaznost navigace: po kokpitu 4/4 hlavní karta přímo ve
scéně nabízí aktuální úkol navigace. Po kurzu 4/4 vypíše zbývající oblasti
lodi a vede na další nedokončenou oblast. Při 25/25 nabídne prohlédnutí
kurzu, odlet zůstává připravovaný. Zobrazuje se postup navigace i celé lodi.
Živá odpověď přijímače nyní přichází po krátkém čekání (2,2 s), lze ji
okamžitě zobrazit přes Show reply; při omezených animacích je okamžitá.
Zápis v deníku je kompletní a není závislý na době čekání.
