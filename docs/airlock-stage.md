# Etapa 2 — Airlock & Hull

Implementováno 2026-09-14. Výchozí scéna `public/scenes/airlock-0.webp`
vychází z komory s dveřmi COCKPIT a CORRIDOR. Čtyři opravy, minihry,
bubliny, deník a dva nové exteriéry jsou zapojené. Grafika: vestavěný imagegen.
Navazuje na dokončení čtyř oprav kokpitu, viz roadmap-ship.md.

## Grafika a orientace

Malá komora zásobovací lodi: slonovinové panely, oranžové značení,
teplá nouzová světla, skalnatý měsíc za okénkem. Vnější dveře zůstávají
zavřené. Vlevo je servisní rozvod a promáčknutý vnitřní průlez, vpravo
servisní rameno s konzolí, uprostřed vnější průlez s poškozeným těsněním.
Nouzové lampy už svítí; první oprava obnoví plné pracovní osvětlení.
Nezaměňovat to s už opravenými světly kokpitu.

## Úkoly a pracovní cíle miniher

Rozměry jsou sloupce × řádky, pět typů kamenů, bez limitu tahů a boosterů.
Cílové počty jsou návrh pro první test, nikoli definitivní obtížnost.

| Level / ID | Název | Cíl | Viditelná odměna |
|---|---|---|---|
| 5 / airlock-power | Service power | 6 × 7, spojit 24 krystalů | Zakryté kabely vlevo, velký panel online, jasná pracovní světla |
| 6 / airlock-inner-hatch | Inner hatch | 6 × 7 s vykrojenými rohy, spojit 36 kamenů | Rovné čisté dveře vlevo a opravený rám, odstraněné trosky u prahu |
| 7 / airlock-hull-panels | Hull panels | 6 × 7, spojit 24 palivových článků | Funkční konzole a rameno, potom exteriér s opravenou trhlinou přídi |
| 8 / airlock-seals | Airlock seals | 6 × 7 s vykrojenými rohy, spojit 42 kamenů | Obnovený velký průlez, nové těsnění a zelený tlakový indikátor |

Ikony v minihře jsou symbolické cíle, nevytvářejí zásoby paliva ani krystalů.
Oprava pláště zahrnuje obnovu ovládání ramene. To provede práci zvenku
přes servisní vývod; pilot nevychází do netěsné komory. Vnitřní dveře lze
provizorně izolovat už před etapou, opravou získají plnou funkčnost.

## Anglické texty pro hru

### 5 — Service power

**Bublina před hrou:** “The emergency lamps are still holding. Let's restore the service panel before we touch the hatches.”

**Objective:** “Match 24 energy crystals to restore service power.”

**Tlačítko opravy:** Restore service power

**Výsledek:** “Service power restored. The airlock controls are back online.”

**Deník — A little more light**
- ID: airlock-service-light
- Zdroj: Personal log
- Čas: After landing / 05
- Odemčení: airlock-power

“The service lights reveal a thin, branching scorch mark along the outer frame. It doesn't look like damage from the rocks. I'll inspect it when the hull camera is working.”

### 6 — Inner hatch

**Bublina před hrou:** “This hatch separates the cabin from the airlock. It needs to close properly before I test the outer seals.”

**Objective:** “Match any 36 pieces to repair the inner hatch.”

**Tlačítko opravy:** Secure the inner hatch

**Výsledek:** “The inner hatch closes securely. The cabin can be isolated from the airlock.”

**Deník — One safe room at a time**
- ID: airlock-inner-safe
- Zdroj: Personal log
- Čas: After landing / 06
- Odemčení: airlock-inner-hatch

“The inner hatch locks with a familiar, reassuring click. One more barrier between me and the cold outside. This ship is beginning to feel like shelter again.”

### 7 — Hull panels

**Bublina před hrou:** “The service arm can reach the damaged plating from outside. I'll restore its controls and let it handle the patch.”

**Objective:** “Match 24 fuel cells to power the hull repair.”

**Tlačítko opravy:** Patch the hull

**Výsledek:** “The service arm has replaced the damaged hull panels. The breach is closed.”

**Deník — Marks beneath the damage**
- ID: airlock-hull-marks
- Zdroj: Personal log / hull camera
- Čas: After landing / 07
- Odemčení: airlock-hull-panels

“The hull camera shows the same branching marks beyond the impact damage. Something energetic brushed the ship before we landed. That's a clue, not an explanation.”

### 8 — Airlock seals

**Bublina před hrou:** “The hull is patched. New seals and a pressure test will tell me whether this compartment is ready.”

**Objective:** “Match any 42 pieces to restore the airlock seals.”

**Tlačítko opravy:** Seal the airlock

**Výsledek:** “Pressure test passed. Airlock and hull secured. Choose your next room.”

**Deník — Holding steady**
- ID: airlock-pressure-safe
- Zdroj: Personal log
- Čas: After landing / 08
- Odemčení: airlock-seals

“Pressure is holding. The ship has a skin again. Whatever remains on the repair list, the cold outside can stay outside. One more step toward following that signal.”

## Další grafické stavy pro realizaci

Zachovat přesně kameru a geometrii výchozí scény při tvorbě variant:
1. airlock-1-power: panel, kabeláž a pracovní světla.
2. airlock-2-inner-hatch: předchozí oprava + levé dveře a práh.
3. airlock-3-hull: předchozí opravy + konzole a servisní rameno.
4. airlock-4-sealed: předchozí opravy + hlavní průlez a tlakový panel.
5. Samostatný nový exteriér s opraveným pláštěm, svítícím kokpitem a stále
   vypnutými motory. Nevyměňovat již hotový kokpit za původní poškozený stav.

Zápisy odemykat podle ID opravy, nikoli lokálního počtu oprav nové místnosti.
Budoucí obsah zůstává skrytý. Po kokpitu jsou opravy komory i všechny
místnosti chodby dostupné souběžně. Dokončení komory neodemkne odlet. Nezavádět zatím povlaky ani šestý typ kamenů.

## Generační zadání grafiky

Production background concept for a portrait 9:16 mobile sci-fi repair match-3
game. Interior of a small damaged supply spaceship airlock, warm hopeful
cinematic painterly 3D realism, ivory worn metal, orange trim, blue-gray shadows.
No people, text or UI. Left exposed service cabinet and buckled inner sliding
door; right folded service manipulator and damaged console; central closed
outer pressure hatch with small round window onto a rocky blue moon, cracked
gasket and amber emergency rim. Dim emergency lighting. Quiet ceiling in top
15 percent and uncluttered dark floor in bottom 20 percent for UI. No cockpit
seats, star map or powered engines. Single full scene, not a collage.

Navigace 2026-09-13: exteriér → přechodová komora → kokpit; návrat stejnou cestou. Komora je přístupné rozcestí už před opravou kokpitu, její vlastní opravy zatím nejsou hratelné. Ubikace, kuchyňka a strojovna jsou označené jako zamčené. Dokončení kokpitu vrací do komory, odkud lze ven. Grafika airlock-0-damaged.webp zapojená. Ověřen mobilní průchod tam/zpět a spuštění minihry.


## Realizace 2026-09-14 (nahrazuje staré poznámky o nezapojené komoře)

- Z rozcestí komory tlačítko Repair airlock & hull, po dokončení kokpitu.
  Dveře do kokpitu a chodby zůstávají přístupné. Opravy mají vlastní obrazovku
  nad stejnou scénou a návrat do rozcestí. Rozcestí zobrazuje aktuální opravy.
- `src/airlockRepairs.js`: čtyři konfigurace a čtyři osobní zápisy, 6 × 7 / 5 typů.
- `public/scenes/airlock-0.webp` a `airlock-1` až `airlock-4` (PNG + WebP).
- `exterior-hull` a `exterior-sealed` (PNG + WebP): po 3. opravě opravená příď,
  po 4. zavřený opravený průlez se zeleným indikátorem a uklizený spodní panel.
  Kokpit zůstává osvětlený, motory bez tahu, loď na zemi.
- Po posledních dvou opravách See your ship přepne odměnu na exteriér.
  Stejný stav je při běžné návštěvě venku. Nejde o porovnání před/po.
- Čítač komory nepřepisuje jiné místnosti ani jejich osvětlení chodby.
  Replay ani opuštění minihry neudělují další opravy. Refresh stále resetuje postup.

### Zadání nových obrazových variant (vestavěný imagegen)

Společné: editovat předchozí portrét 9:16, zachovat přesnou kameru,
polohu dveří, značení COCKPIT/CORRIDOR, žádní lidé ani UI.
1. Service power: zakrýt levé kabely panely, aktivní cyan displej, jasná bílá
   pracovní světla; ostatní poškození ponechat, chodba tmavá.
2. Inner hatch: narovnat a opravit levé dveře a rám, cyan kontrolka,
   odstranit opřený panel a trosky u prahu; zachovat první opravu.
3. Hull panels: opravit pravé servisní rameno a konzoli, cyan schéma pláště
   a světla kloubů, odstranit trosky vpravo; hlavní průlez stále poškozený.
4. Seals: nový nepoškozený hlavní průlez a černé těsnění, zelená tlaková
   kontrolka a tenký zelený lem, opravená podlaha; všechny předchozí opravy.
5. Exterior hull: z osvětleného exteriéru nahradit proražený plášť pod kokpitem
   celistvými slonovinovými panely s oranžovým pruhem. Zachovat krajinu,
   loď, osvětlený kokpit, otevřený vstup a motory bez tahu.
6. Exterior sealed: zavřít vstup opraveným průlezem s oválným okénkem,
   zelenou kontrolkou a lemem, zasunout schůdky a zarovnat spodní panel.
   Zachovat osvětlený kokpit, opravený plášť a ostatní scénu.
