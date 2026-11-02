# Síť 211–230: osm kratších zastávek

Implementace 2. 11. 2026, společná pro web a Capacitor Android. Uživatel
upřesnil, že chce hlavně více míst v příběhu, nikoli více uzlů na malé desce.

| Levely | Zastávka | Opravy |
|---|---|---|
| 211–212 | Vodní dílna | recyklace a zásoba vody |
| 213–215 | Obytný modul | tlak, lůžka, společná kontrola HARD |
| 216–217 | Pěstírna | voda a osvětlení sazenic |
| 218–220 | Živý dvůr | záhony, klenba, otevření HARD |
| 221–222 | Dok blízkého majáku | kotvení a samostatné napájení |
| 223–225 | Stožár blízkého majáku | konstrukce, čočka, spoj HARD |
| 226–227 | Vzdálený přílet | průzkum a příletové značky |
| 228–230 | Věž vzdáleného majáku | chlazení, živý kanál, spoj HARD |

Každé místo má dvě nebo tři opravy, vlastní výchozí a aktivovaný obraz,
pevné značky podle zařízení, deník a návrat/replay. Tři dvoupanelové komiksy
otevírají zázemí posádky, výpravu k blízkému majáku a přelet ke vzdálenému.
Původní konec 200 zůstává příběhovým milníkem. Levely 231–250 stále jen plán.

Desky střídají rozměry 6×8, 7×8 a 8×7, vykrojené rohy, zúžení a stupně,
jeden až tři barevné cíle, kryty a pořadové uzly. Stavební ekonomika nepřibyla.
Běžné levely nemusí mít uzly. Kryty nechávají uzlům volné sousedství a
zachovávají pravidla fairness.test.js.

## Zmírnění uzlů od 201

Na přání uživatele už žádný level 201–230 nemá tři postupné uzly. Úzké
šestisloupcové desky mají nejvýše jeden, ostatní nejvýše dva; celkem nejvýše
čtyři impulzy. Staré počty tahů 201–210 se nemění. Požadavky:
204:1+1, 205:2+2, 208:1+2, 209:2+1, 210:2+2. Jednotlivé uzly 203/207 beze
změny. Původních 200 konfigurací a souřadnic se úprava netýká.
Slepé nové běhy mají 230 levelů, existující 200/210 běhy zůstávají zmrazené.
Pravidla analytiky: 2026-11-02-network-short-stops-v2.

## Ukládání a překlady

SQL037 uživatel potvrdil jako nasazené. Zachovává řádkový/advisory zámek,
resetRevision a všechny staré opravy/hvězdy; nových osm skupin má vlastní
počítadla a kontrolu pořadí. Limit hvězd je 230. Reset je rozdělen do více
jsonb_build_object, aby nepřekročil limit 100 argumentů PostgreSQL.
Generátor: scripts/generate-network-stops-sql.mjs. Staré SQL035/036 se již
na nové schéma nemají znovu pouštět; historické migrace zůstávají v projektu.

Všech šest jazyků má názvy, zadání, výsledky/deník, místa, komiksy i novinky.
Registrace: scripts/register-network-stops-localization.mjs; přeložené zdroje
network-stops-translations.mjs a network-stops-copy.mjs. Aktuální katalog
2657/2657 v APK (web má o 20 nativních zpráv méně). Web uvádí celkem 230.

## Ověření

313 unit testů, i18n kontrola a produkční build prošly. Skutečný PostgreSQL
běh přes PGlite ověřil SQL037, 230 tříhvězdičkových výsledků, druhé zařízení,
starého klienta bez nových polí, opakovanou migraci, reset a odmítnutí starého
pokusu po resetu. Nové jednotkové testy generují 400 desek s legálním tahem.
Browser: všech osm zastávek a jejich popisky v šesti jazycích na 320px,
kulatost značek při různém postupu ve třech šířkách, průchod všemi 20 opravami
přes DEV dokončení, tři komiksy a reload. DEV průchod nenahrazuje lidský
průchod match-3; herní pravidla samostatně zkouší simulace bez pomůcek.

Simulace: scripts/balance-network.mjs, 100 pokusů na level, cílený robot
vidí pouze okamžitý tah, bez pomůcek. Běžné nové úkoly 50–94 %; HARD
215/220/225/230: 56/55/47/48 %. Level 210 po změně uzlů 48 % (dříve 27 %).
Čísla nejsou odhadem lidské úspěšnosti. Nutný další lidský průchod.

## Grafika a balíčky

Vestavěný imagegen, nová grafika public/scenes/network-{water,quarters,
nursery,courtyard,beacon-dock,beacon-mast,far-approach,far-core}{,-restored}.png.
Každý výchozí obraz: portrét 9:16, malířsky realistická sci-fi, námořnická
modrá, stříbrné konstrukce, jantar a tyrkys, horních 28 % volných pro HUD,
bez lidí, textu a UI. Dvě až tři zřetelná zařízení ve spodní části podle
funkce místa. Vodní dílna: filtry/nádrže; habitat: lůžka/přetlakový průlez;
pěstírna: sadbové skříně/závlaha; dvůr: záhony/klenba/podstavec; dok:
přistávací kolébka/přípojka; stožár: vysílač/čočka/konzole; měsíční přílet:
dvě naváděcí značky/věž; věž: chlazení/archiv/vysílač.

Opravený obraz vznikl editací příslušného výchozího obrázku: přesně zachovat
kameru, všechny konstrukce, podlahu, okno/terén, planetu a kompozici; aktivovat
jen existující zařízení tyrkysovými schématy a zelenými indikátory, oběh vody,
pěstební světla, přistávací značky nebo optický paprsek. Žádná nová geometrie.
Výstupy zůstaly v projektu, originály v .codex/generated_images. Změny se
odhalují maskou opravy a navazujícími indikátory.

Android sestavení 6: preview APK a podepsaný AAB, nadále testovací reklamy.
Výstupy releases/google-play/internal-6. Google Play vyžaduje samostatné
nahrání AAB; push Gitu neaktualizuje již distribuovaný balíček.
