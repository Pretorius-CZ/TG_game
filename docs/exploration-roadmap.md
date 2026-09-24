# Průzkum soustavy — schválený směr a první implementace

## Směr (2026-09-24)

Po odletu pokračuje příběh pilota vlastní havarované zásobovací lodi.
Fiktivní soustava Kepler Reach dovoluje odlišné planety a měsíce. Signál
ztracené výpravy vede na opuštěná zařízení a později k velké stanici.
Cyklus: přílet → průzkum → match-3 úkol → viditelná změna → deník/zásilka
→ další cíl. Tři plánované kategorie zásilek: konstrukční materiál,
energetické články, výzkumná data. Bez obchodu, craftingových řetězců,
převodu skóre z dlaždic na sklad nebo farmení opakovaných levelů.

## Roadmapa

1. **Mapa soustavy — implementována.** Přístup až po odletu, horní hvězda,
   návrat na původní měsíc a loď. Důl je první dostupná expedice.
2. **Tichý důl — implementován.** Šest úkolů, bubliny, deník, nálože,
   postupné obrazové opravy, replay a dev Complete level.
3. **Skener — implementován.** Po naložení zásilky výslovná instalace za
   jeden materiál a jedny výzkumné údaje; svítící panel na mapě a změna
   konzole v kokpitu. Odhalí dvě souřadnice, zatím nehratelné.
4. **Dvě cesty — implementovány 2026-09-24.** Icebound relay (výzkumná stanice na ledovém měsíci)
   a Drifting archive (vrak v asteroidech), volné pořadí, odlišné mechaniky.
   Další postup bude vyžadovat obě. Obě lokace mají šest úkolů, vlastní grafiku, deník a odměny; viz docs/planet-expeditions.md.
5. **Zdroj signálu — plán.** Nalezení velké orbitální stanice a příběhové
   finále průzkumu. Dopracovat vztah posledního vysílání k výpravě.
6. **Budování základny — plán.** Dok, energie, obytné části a výzkum;
   nové expedice z vlastní stanice. Volnější spotřebu zásob řešit až zde.

## Hratelný důl

| Úkol | Cíl | Kryty | Tahy |
|---|---|---|---|
| Landing beacons | 18 krystalů | 0 | 14 |
| Station entrance | 18 komet | 0 | 14 |
| Power grid | 21 krystalů | 4 | 17 |
| Extraction rig | 24 asteroidů | 0 | 16 |
| Control terminal | 18 komet + 18 hvězd | 4 | 17 |
| Cargo elevator | 21 paliv + 21 krystalů | 6 | 19 |

Pátý úkol poskytne data; čtvrtý nachystá materiál, šestý jej naloží.
Zásoby se odvozují z postupu a instalace skeneru, nemají samostatný
inkrementovatelný čítač. Replay ani souběh dvou karet zásilky neduplikuje.

Simulace `node scripts/balance-crew.mjs 300 mine`: cílený automat
89/84/78/71/73/57 %, náhodný 45/38/24/22/17/18 %. Jde o orientační
porovnání strategií, nikoli záruku lidské úspěšnosti.

## Ukládání a nasazení

- `mineCompleted` (0–6), `scannerInstalled`, scény `system`/`mine` a šest
  nových ID deníku rozšiřují dosavadní save. Staré soubory začnou od nuly.
- Odlet je podmínkou kapitoly; šest úkolů podmínkou skeneru.
- Místní i cloudové sloučení používá maximum postupu, OR skeneru a stejnou
  resetRevision. Novější reset má přednost před dokončenou expedicí.
- Pro cloud spustit `supabase/004_exploration.sql` po 003. Při chybějící
  migraci se nový postup uchová místně a UI nesmí tvrdit, že je online.
- Aktuální migrace je 005_planet_expeditions.sql a zahrnuje 004. Provedení na živé databázi zatím nepotvrzeno.
  Přenos nové kapitoly mezi zařízeními ještě nebyl živě ověřen.

## Grafika a ověření

`public/scenes/silent-mine-source.png` a `silent-mine-restored-source.png`
vytvořeny pomocí imagegen. První prompt: portrétový opuštěný důl, šest
čitelných zařízení, tmavá scéna bez UI. Druhý: zachovat kompozici, zapnout
světla plošiny, otevřít průlez, generátor/drill/terminál online, naložit výtah.
WebP varianty mají šířku 900 px a kvalitu 85. Obraz opravené lokace se
odhaluje po jednotlivých oblastech; po všech úkolech je vidět celý.

Kontroly: testy validačních podmínek, sloučení/resetu, zásob a generování
desek; mobilní průchod šesti úkoly pomocí vývojového přeskočení, otevření
minihry, šest zápisů, skener, návrat na mapu a reload. Skutečná obtížnost
je zatím ověřená simulací, ne kompletním ručním průchodem.

2026-09-24: Ledový měsíc a archivní vrak jsou hratelné v libovolném pořadí. Dokončení obou odhalí Haven a společný závěrečný deník; samotná stanice dosud není hratelná. Obtížnost nových levelů na přání uživatele zůstává pracovní.
