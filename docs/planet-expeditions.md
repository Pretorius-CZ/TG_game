# Ledový měsíc a archivní vrak — 2026-09-24

Uživatel upřednostnil další obsah; přesné ladění obtížnosti odkládá.
Implementované dvě expedice po instalaci skeneru, dostupné v libovolném
pořadí. Každá má šest navazujících úkolů, bubliny, šest deníkových zápisů,
poškozený a obnovený obraz, samostatný postup a replay. Důl zůstává beze změny.

## Icebound Relay

1. Approach beacons — obnovit osvětlení přistávací plošiny.
2. Frozen airlock — otevřít vstupní průlez.
3. Thermal loop — obnovit ohřev stanice, čtyři ochranné kryty.
4. Research laboratory — načíst první pozorování orbitálního útočiště.
5. Relay dish — synchronizovat záznam s živým signálem, čtyři kryty.
6. Reserve energy cells — naložit energii a data, šest krytů.

Odměna za celou expedici: jedna zásilka energie a jeden archiv výzkumných
dat. Příběh: stanice byla úmyslně uspána a posádka přešla do útočiště.
Někdo se nedávno vrátil změnit signál a nyní varuje pilota před vysíláním identity.

## Drifting Archive

1. Docking clamps — bezpečně připojit nástupní plošinu.
2. Emergency bulkhead — otevřít archivní sekci.
3. Auxiliary reactor — zapnout pouze nezbytné obvody, čtyři kryty.
4. Navigation archive — získat druhé pozorování a jméno Haven.
5. Passive antenna — ověřit čas záznamu, čtyři kryty.
6. Recovery cradle — zajistit kontejnery a odvézt archiv, šest krytů.

Odměna: jedna zásilka konstrukčního materiálu a jeden archiv. Vrak zůstává
poškozený; opravují se pouze zařízení potřebná k záchraně dat, ne celá loď.

## Společný závěr

Dokončení obou expedic odhalí Haven a společný zápis `haven-coordinates-log`.
Mapa nabídne Receive station signal. Jde o zakončení průzkumu, ne zatím
hratelnou stanici. Příští obsah: přístup k vnějšímu doku a obnova Havenu.
Texty obou lokací fungují v obou pořadích; definitivní souřadnice a živé
přivítání se objeví až po obou 6/6.

Zásoby se odvozují z dokončených expedic: na konci 1 materiál, 2 archivy,
1 energie (zásilky z dolu již použité na skener). Replay nic nepřidává.
Zatím se neutrácí za další budovy. Původní energetické životy jsou jiný
systém; zásilka energie je příběhová odměna, nikoli doplnění pokusů.

## Technika a ukládání

- `src/destinations.js`: konfigurace, texty, deník, odměny, podmínka Havenu.
- Sdílená `Exploration.jsx` umí důl i obě nové lokace, grafické hotspoty,
  obrazové opravy, minihry a návrat na mapu. Horní zpět vrací na mapu.
- Nová pole `iceCompleted` a `wreckCompleted` (0–6), scény `ice`/`wreck`.
- Normalizace je zamyká bez skeneru. Sloučení zachovává obě nezávislá maxima;
  nový reset vyhraje nad starým dokončeným postupem.
- Cloud: **supabase/005_planet_expeditions.sql** zahrnuje i definice migrace
  004. Lze použít po 003 nebo 004; nemění existující uložené opravy. Nepouštět
  následně starší 004, která by přepsala nové synchronizační funkce.
- Provedení SQL005 na živém serveru není potvrzené. Do té doby se nový
  postup drží lokálně a chybějící cloudová pole nejsou vydávána za úspěšné uložení.

Minihry používají šest typů, desky 7×7 (část s vykrojenými rohy), poslední
7×8, stávající nálože. Pracovní limity 23/24/27/26/28/30 tahů, různě barevné
jednoduché/dvojité cíle. Neprobíhalo optimalizační ladění obtížnosti.

## Grafika

Imagegen: `icebound-relay-source.png` a `drifting-archive-source.png`, jejich
`-restored-source.png` varianty; nasazení přes odpovídající WebP (900 px, 85 %).
Prompty: vertikální filmová sci-fi scéna se šesti oddělenými zařízeními,
vypnutá stanice / archivní vrak. Editace zachovává kameru a rozložení, zapíná
světla, otevírá průlez, zprovozňuje zařízení a zajišťuje kontejnery. Vrak
si ponechává protržený plášť. Obnova se odhaluje po oblastech; šestý úkol
ukáže celý obnovený obraz. Žádná grafika závislá na dočasných cestách mimo projekt.

## Ověření

50 unit testů prošlo včetně gate skeneru, obou pořadí, sloučení, resetu,
Haven deníku a generování všech desek. Build prošel. Mobilní průchod
oběma pořadími otevřel všech 12 miniher, ověřil kryty, dokončení přes
dev přeskočení, každý deník, obnovení, replay a odhalení Havenu až po obou
lokacích. Mapa zkontrolovaná v šířkách 320 a 390 px. Živé cloudové
uložení nových lokací dosud nebylo ověřeno; migrace je připravená.
