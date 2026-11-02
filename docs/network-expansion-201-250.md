# Nová síť — pokračování po levelu 200

Pracovní návrh a izolovaný prototyp, 2. 11. 2026. Uživatel schválil směr
dalšího postupu a požádal o obměnu dílků. Nejde o vydanou kapitolu.

## Návaznost a odměna

Level 200 uzavírá původní nouzové volání: expedice je v bezpečí a hlavní
stanice má potvrzení. Nezavádět dalšího zapomenutého člena stejné výpravy.
Útočiště, zahrada i přílet posádky už existují. Nová část je rozšíření sítě
pro budoucí návštěvníky, nikoli opakování jejich objevení a záchrany.

Pilot zůstává pilotem zásobovací lodi. Operátor mu zadá dodávku zařízení
na novou servisní plošinu. Každá minihra přímo realizuje konkrétní opravu
nebo montáž, bez inventáře stavebních surovin, cen a časovačů výstavby.
První přílet na konci padesátky je nová údržbová/zásobovací posádka.

## Rozsah 201–250

| Levely | Místo / změna | Výsledek |
|---|---|---|
| 201–205 | Předání služby v hlavní stanici | Původní trasa zůstává funkční, loď přebírá nový náklad. |
| 206–210 | Vnější servisní plošina | Nový rám, nezávislé napájení a malá dílna. |
| 211–215 | Zázemí pracovní posádky | Voda, vzduch, obytný modul; žádná kopie nouzového Útočiště. |
| 216–220 | Živý dvůr | Přesazení místních rostlin pod dohledem správce, prostor ztrácí provizorní vzhled. |
| 221–225 | Blízký maják | Krátká výprava, první nová odbočka sítě. |
| 226–230 | Vzdálený maják | Druhá výprava s jiným tvarem desek; návrat ukáže rozšířenou mapu. |
| 231–235 | Zásobovací plavidlo | Domluvený přílet potřebuje přesměrovat kvůli technické závadě, nejde o staré volání. |
| 236–240 | Náhradní příletová trasa | Hráč využije síť, kterou právě postavil. |
| 241–245 | Příprava doku plošiny | Osvětlení, spojení, navádění, bezpečné oddělení provozu. |
| 246–250 | První služba nové stanice | Přílet pracovní posádky a předání dílny, společný závěrečný deník. |

Každý pátý level má být výrazný závěr s vlastní odměnou; označení HARD
musí potvrdit test obtížnosti. Pracovní limity nejsou navázané na reklamu
ani předpoklad použití pomůcek. Nejprve lidské průchody bez pomůcek a bot,
teprve potom cílová čísla. Nezvyšovat obtížnost původních 200 levelů.

## Nové dílky

Nová sada: tyrkysová trojúhelníková signální spojka, zlatá čtvercová solární
destička, fialová kosočtvercová čočka, oranžový válcový izolátor, zelená
oválná servisní kapsle, bílá křížová obytná patrona. Tvar je druhé rozlišení
vedle barvy. Herní typy 0–5 zachovat konzistentní uvnitř nové části.
Nové obrázky patří pouze novým úkolům; staré barevné cíle se nesmějí změnit.
Schválení vzhledu vyžaduje náhled skutečné desky na 320px, ne jen velké PNG.

## Směrování energie — první pravidla

- Pevné očíslované uzly zabírají nehratelná pole, gravitace je nepřesouvá.
- Září jen aktuální uzel. Spojení vedle něj přidá jeden impulz.
- Dvě nezávislé kombinace mohou přidat dva impulzy v jedné vlně.
- T/L/kříž se společným dílkem jsou jediná kombinace.
- Další uzel se aktivuje až po vyhodnocení vlny. Kaskáda jej už nabít může.
- Uzly se nepřednabíjejí; stav a pořadí jsou na desce viditelné.
- Obnova nehratelné desky neodebere další tah ani hotové uzly.

Prototyp záměrně nepřidává alternativní pravidla do MiniGame. Před zapojením
musíme rozhodnout chování náloží/pomůcek, krytů a nápovědy; undo musí
obnovovat i náboje uzlů a generátor náhodných čísel. Následně regresní test
posledního tahu, kaskády, retry a skutečné desky bez platného tahu.

## Hotové první pracovní podklady

- `src/experimental/networkChapter.js`: 201–210, EN/CS názvy, úvodní úkol,
  výsledek, dvě barevná zadání a návrhy uzlů.
- `src/experimental/networkRoute.js`: samostatná čistá pravidla pořadí.
- `/tests/browser/network-preview.html`: hratelný náhled bez přihlášení,
  persistování, statistik a reklam. Není součástí produkční navigace.
- Překlady DE/FR/ES/PT-BR až po ustálení příběhu a mechaniky; nenabízet
  nedokončenou kapitolu hráčům s anglickými zbytky.

## Další implementace

1. Ověřit šest dílků na malé desce a pravidlo uzlů.
2. Připravit pozadí nové plošiny a její postupné opravy; navrhnout konkrétní
   souřadnice podle obrázku, nepřenášet automatické řádky úkolů ze seznamu.
3. Doplnit zbývajících 40 skutečných úkolů, bubliny a deník.
4. Integrovat po úsecích do sdíleného jádra, šest jazyků a katalog.
5. Rozšířit lokální/cloudové schéma atomickým merge a explicitními GRANT.
   Staré verze nesmějí při ukládání nová pole zahodit. Připravit migraci
   před veřejnou nabídkou kapitoly; současný postup ani cloud neměnit.
6. Testy 200→201, návrat do starých kapitol, opakování, hvězdy, pokračování
   po aktualizaci webu/APK. Teprve pak nový AAB a společné vydání.

Grafika vzniká vestavěným imagegen. Prompty: jeden samostatný sci-fi match-3
dílek na průhledném pozadí, čitelný v48px, centrovaný, stříbrné konstrukční
materiály, bez textu/rámu. Konkrétní tvary a barvy jsou uvedené výše.

## Zapojení do hry — 2026-11-02

Prvních deset úkolů 201–210 je nyní zapojených do společné webové a Android
hry. Zbývajících čtyřicet je stále návrh. Původní konec na úrovni 200 zůstává
milníkem záchrany expedice; nový třípanelový komiks otevírá zásobovací službu
v síti. Dvě scény mají samostatné pozadí, opravený stav a pevné souřadnice
zařízení. Šest nových ikon se používá pouze v nové kapitole. Všech šest jazyků
obsahuje nové úkoly, deník, přechod i vysvětlení uzlů.

Produkční data: src/networkLevels.js, networkExpansion.js, networkRoute.js,
networkStory.js. Experimentální soubory přesměrovávají na stejná pravidla.
Uzly nabíjí sousední běžná spojení, pouze aktuální uzel na začátku vlny;
oddělená spojení se počítají samostatně. Přebytek nepřetéká. Výbuchy samy
uzel nenabíjejí; následná běžná kaskáda může. Undo používá uložený stav
rezonátorů, retry jej obnoví. Původní rezonátory pravidla nemění.

SQL035 uživatel 2. 11. potvrdil jako nasazenou bez chyb. Přidává dvě pole
postupu a deset ID hvězd; staré klienty ani uložené hry nemaže. Živé ukládání
nových levelů mezi dvěma zařízeními ještě vyžaduje hráčské ověření.
Nové slepé testy zahrnují 210 úloh; dříve rozehrané 200úlohové běhy zůstávají
zmrazené na 200.

Kontroly: 308 unit testů, katalog 2555/2555 ve všech šesti jazycích,
48 webových stránek, produkční build. Prohlížeč ověřuje komiks, skutečnou
minihru, šest jazyků nových scén a regresi rozložení původního archivu.
Android sestavení 5: APK preview + podepsaný AAB, obě obsahují všech šest
ikon a čtyři nové scény se shodnými SHA256. Reklamy zůstávají testovací.
Soubory jsou v releases/google-play/internal-5; AAB není automaticky nahraný
na Google Play a novou APK musí uživatel instalovat jako aktualizaci.

Simulace scripts/balance-network.mjs, 100 pokusů/level bez pomůcek:
97/96/98/79/49/98/84/87/64/27 % výher. Jde o jednoduchého cíleného robota,
nikoli odhad lidské úspěšnosti. HARD jsou 205 a 210; po lidském testu zejména
210 znovu vyhodnotit.

Nová grafika vznikla vestavěným imagegen. Portrétní pozadí: klidná malířská
sci-fi místnost síťové služby / orbitální servisní plošina, námořnická modrá,
stříbro, jantar a tyrkys, horních 28 % volných pro ovládání, bez textu/UI/lidí.
Opravené varianty byly editované ze základního obrazu se zachováním kamery
a geometrie, aktivací pěti existujících zařízení a jemných indikátorů.
Výstupy public/scenes/network-{handover,platform}{,-restored}.png.
Ikony: jeden samostatný předmět, průhledné pozadí, čitelná silueta při 48 px,
bez textu/rámu, stříbrné konstrukční materiály a vlastní barevné jádro;
public/tiles/network-{coupler,solar,lens,insulator,capsule,habitat}.png.

Nasazení: společný obsah Android 9a7ffb5, Android balení b8524b1;
web c2c3549. Webový build má 292 unit testů a katalog 2535/2535 (20 native
zpráv je pouze v APK). Produkční game hosting run 41445910473 úspěšný,
živá version.json obsahuje c2c3549fdc24. Lokální mobilní kontrola 26/26
(archiv + nová kapitola), webová větev 8/8. Živá kontrola se provádí bez
přihlášení/statistik, s izolovaným postupem. Zdrojové zálohy obou commitů
jsou v .local/backups/2026-11-02-network. Google Play stále vyžaduje
samostatné nahrání nového AAB, stávající vydání se pushem Gitu nezmění.

Oprava po obrázku uživatele: aktivní značka se ve 34px vysokém flex obalu
smršťovala z 52px do oválu. Pouze nová kapitola nyní nastavuje obě strany
34px a zakazuje flex smrštění. Test zahrnuje obě scény, postup 0/2/4/5 a
šířky 320/393/465; předchozí test jen hotových scén tento stav nepokrýval.
