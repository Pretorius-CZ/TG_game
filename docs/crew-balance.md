# Zkušební obtížnost ubikací — 2026-09-23

První laděná místnost po snadném kokpitu. Dosavadní dokončené opravy
zůstávají uložené; nové varianty lze vyzkoušet přes Replay v ubikacích.

| Oprava | Cíl | Kryty | Tahy |
|---|---|---|---|
| Ventilace | 18 krystalů | 0 | 17 |
| Filtry | 15 komet + 15 hvězd | 0 | 17 |
| Lůžko | 20 krystalů | 4 | 23 |
| Obytný modul | 18 palivových článků + 18 krystalů | 6 | 26 |

Dva cíle mají samostatná počítadla. Přebytek jedné barvy nenahradí druhou.
Kryty jsou povinné a začínají až třetí opravou; poslední úkol má odlišné
rozmístění. Výhra nadále čeká na dokončení všech kaskád. Obnova desky,
energie a ukládání dokončených oprav se nemění. Speciální nálož zatím
není implementovaná: nejprve vyhodnotit tuto změnu cílů a limitů.

Reprodukovatelná simulace: `node scripts/balance-crew.mjs 300`.
300 pokusů na level a strategii, deterministická semena. Cílený automat
hodnotí okamžitý příspěvek ke zbývajícím cílům a rozbití krytu (váha 5),
nezná budoucí doplňování kamenů. Náhodný vybírá mezi platnými tahy.

| Oprava | Náhodný automat | Cílený automat |
|---|---:|---:|
| Ventilace | 71 % | 88 % |
| Filtry | 73 % | 87 % |
| Lůžko | 53 % | 83 % |
| Obytný modul | 39 % | 74 % |

Jde o orientaci pro design, nikoli lidskou úspěšnost nebo garanci výhry.
Další krok: hráčsky otestovat tyto čtyři úkoly před rozšířením na další místnosti.

## Druhé ladění: nálože a postupné přitvrzení

Aktuální konfigurace nahrazuje čísla výše:

| Oprava | Cíl | Kryty | Tahy | Náhodný / cílený automat |
|---|---|---|---|---|
| Ventilace | 21 krystalů | 0 | 15 | 34 % / 82 % |
| Filtry | 18 komet + 18 hvězd | 0 | 15 | 28 % / 80 % |
| Lůžko | 24 krystalů | 4 | 18 | 19 % / 74 % |
| Obytný modul | 24 paliv + 24 krystalů | 6 | 20 | 14 % / 55 % |

300 pokusů pro každou strategii. Simulace již zahrnuje skutečné nálože,
jejich aktivaci, řetězce a vznik při kaskádách; cílený automat přičítá
hodnotu 4 za vytvořenou nálož. Náhodný vybírá rovnoměrně mezi platnými
spojeními a odpálením dostupných náloží. Výsledky nejsou lidská úspěšnost.
Speciální kameny jsou dostupné ve všech úkolech mimo čtyři úvodní opravy
kokpitu. Limity ostatních místností zatím nejsou znovu vyvážené s náložemi;
hráčské ověření začíná těmito čtyřmi úkoly přes Replay.

## Jemné přitvrzení na přání uživatele

Aktuální limity: 14 / 14 / 17 / 19 tahů (o jeden méně v každé opravě).
Cíle a boosty beze změn. Stejných 300 semen a strategií:

| Oprava | Náhodný automat | Cílený automat před → po |
|---|---|---|
| Ventilace | 25 % | 82 % → 72 % |
| Filtry | 20 % | 80 % → 69 % |
| Lůžko | 16 % | 74 % → 65 % |
| Obytný modul | 9 % | 55 % → 49 % |

Relativní pokles úspěšnosti cíleného automatu přibližně 12–13 % slouží
jako orientace pro požadovaných cca 15 % obtížnosti. Obtížnost nemá
jednotnou procentní škálu. Přímé odebrání 15 % tahů bylo příliš prudké,
proto ponecháno jemnější nastavení. Ověřen produkční build.
