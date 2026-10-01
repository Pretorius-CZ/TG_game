# Plán pokračování: levely 121–240 a epilog 241–250

Zapsáno 2026-10-01 na žádost uživatele jako podklad pro další vývoj. Jde o obsahový návrh, nikoli implementované levely ani definitivní konfigurace. Původní návrh vycházel ze 120 unikátních miniher. Aktualizace 2026-10-01: Noční zahrada 121–140 je nyní implementovaná, katalog má 140 miniher; zbývající rozsah 141–250 je stále plán. Nový obsah navazuje na živou mapu, výzkum a rezonátory v poslední oblasti. Dosavadní číslování kapitol a názvy scén je před implementací nutné sladit s tímto návrhem.

## Směr příběhu

Hlavní otázka: kdo vysílá signál a proč nás vede touto cestou? Postup mění význam hráčových akcí: nejprve zachraňuje sebe, pak ostatní a nakonec obnovuje síť světů. Match-3 zůstává základem, bez složité surovinové ekonomiky, správy zásob či obchodu. Získané vzorky a moduly jsou pevné příběhové odměny a podmínky postupu.

## 121–140: Noční zahrada

Živá mapa vede na svět, jehož světélkující organismy reagují na rezonátory a zařízení naší lodi.

| Levely | Lokace | Úkoly a význam |
| --- | --- | --- |
| 121–125 | Přistávací mýtina | Obnovit průzkumné sondy a zajistit bezpečnou cestu. |
| 126–130 | Světélkující porost | Získat vzorky a zjistit reakci rostlin na signál. |
| 131–135 | Kořenová komora | Odkrýt staré zařízení prorostlé živou strukturou. |
| 136–140 | Svatyně správce | Obnovit kontakt, odhalit živou výpravu a získat souřadnice Útočiště; třípanelový přeskočitelný komiks. |

Vizuálně tmavá krajina rozkvétá světelnými cestami. Závěr odhalí souřadnice ztracené výpravy. Dva typy dlaždic obměnit na světelná semena a biologické vzorky; zachovat rozlišitelné barvy a siluety. Využít současné rezonátory, nejprve jeden, potom dva na dostatečně velké desce. Nepřidávat další povinnou mechaniku, upevnit pochopení dosavadních pravidel.

Implementace a pravidla: docs/night-garden.md, docs/night-grove.md, docs/night-root.md a docs/caretaker-encounter.md.

## 141–160: Útočiště výpravy

Poškozená základna má sloužit jako domov pro přeživší. Její obyvatelé odešli hledat další členy výpravy.

| Levely | Oblast | Úkoly a význam |
| --- | --- | --- |
| 141–145 | Přístup a přetlak | Vstupní uzávěry, chodby a bezpečnost. |
| 146–150 | Obytný blok | Vzduch, voda, lůžka a osvětlení. |
| 151–155 | Skleník a ošetřovna | Zásobování a péče o posádku. |
| 156–160 | Řídicí centrum | Komunikace a přehled pohřešovaných lodí. |

Opuštěné místo se mění na fungující domov. Závěr přinese skutečnou zprávu od přeživších. Dlaždice: filtrační moduly, zásobovací kapsle a zdravotní materiál, s využitím části staniční sady.

Navržená novinka: obnova podlahových panelů. Poškozený podklad opraví spojení přímo na označeném políčku; podklad zůstává na místě, dlaždice normálně padají. Jde o prostorový cíl odlišný od krytů. Pravidla zásahů výbuchem a pomůckami rozhodnout před implementací a vysvětlit při prvním setkání.

## 161–180: Ztracený konvoj

Několik lodí uvízlo v pásu trosek. Zachraňujeme jiné lodě, nikoli opět vlastní.

| Levely | Oblast | Úkoly a význam |
| --- | --- | --- |
| 161–165 | Průzkumná loď | Nouzový vysílač a nalezení posádky. |
| 166–170 | Zásobovací transport | Zajištění nákladu a obnovení řízení. |
| 171–175 | Evakuační loď | Podpora života a uvolnění dokování. |
| 176–180 | Společný odlet | Bezpečná trasa do útočiště. |

Každá zachráněná loď přibude do společného pohledu na konvoj. Závěrem dorazí k základně a její okolí ožije. Člen výpravy pozná signál jako navigační protokol, který neměl být aktivní. Pestrost tvořit tvary desek, kryty a prostorovými cíli; bez další nové mechaniky.

## 181–200: Archiv ozvěn

Starý orbitální archiv uchovává historii sítě. Zápisy začnou skládat vysvětlení dosavadních událostí.

| Levely | Oblast | Úkoly a význam |
| --- | --- | --- |
| 181–185 | Vnější prstenec | Získání přístupu do archivu. |
| 186–190 | Datové sály | Obnovení poškozených záznamů. |
| 191–195 | Simulační komora | Rekonstrukce poslední cesty výpravy. |
| 196–200 | Centrální paměť | Identifikace původního účelu signálu. |

Odhalení: signál vysílá starý záchranný systém, který obnovuje rozpadlou síť, ale má neúplné informace. Proto nás vede i nebezpečnými místy. Vizuální odměnou jsou ožívající projekce dřívějšího propojení světů.

Navržená novinka: datové kapsle padající gravitací k označenému spodnímu výstupu. Nespojují se jako běžné dlaždice. Nejprve jedna kapsle a jasný výstup; až potom složitější rozložení. Před implementací určit pravidla generování, průchodnosti a obnovy desky, aby kapsle nemohla uváznout bez řešení.

## 201–220: Síť majáků

Obnovíme bezpečnou cestu ke zdroji signálu také pro ostatní lodě.

| Levely | Oblast | Úkoly a význam |
| --- | --- | --- |
| 201–205 | Maják v troskách | Obnova prvního navigačního uzlu. |
| 206–210 | Maják bouřkového světa | Stabilizace napájení. |
| 211–215 | Maják na opuštěném měsíci | Propojení ztracené větve sítě. |
| 216–220 | Spojovací stanice | Synchronizace všech tří uzlů. |

Na mapě se rozsvěcují spojnice mezi opravenými uzly. Část dlaždic obměnit na navigační jádra a signální moduly. Kombinovat známé cíle, nejvýše dvě náročné mechaniky v běžném levelu. Rezonátory zde synchronizují majáky a mají jasnou příběhovou funkci.

## 221–240: Za signálem

Obnovená síť otevře bezpečný průchod k obrovské záchranné stanici na druhé straně trhliny.

| Levely | Oblast | Úkoly a význam |
| --- | --- | --- |
| 221–225 | Přílet a dok | Přiblížení, připojení a bezpečný vstup. |
| 226–230 | Záchranné centrum | Obnovení systémů pro celé výpravy. |
| 231–235 | Jádro navigační inteligence | Oprava paměti a chybných navigačních dat. |
| 236–240 | Obnovení sítě | Finální série úkolů a spuštění stanice. |

Zdroj signálu pochopí, že výprava přežila. Nouzové volání se změní v otevřený maják pro další cestovatele. Stanice se rozsvítí, přiletí konvoj a mapa ukáže obnovenou cestu. Level 240 má uspokojivě uzavřít tento příběhový oblouk. Náročný závěr nesmí znamenat pouze únavné opakování jednoho extrémního levelu.

## 241–250: Volitelný epilog

Deset úkolů ukáže následky našich oprav: příjem lodí, nový obytný modul, observatoř a první zpráva z neznámého prostoru. Přesné rozdělení úkolů není rozhodnuté. Epilog otevírá možnost pokračování, ale není podmínkou uspokojivého konce na levelu 240.

## Pravidla dalšího rozpracování

- Každých pět levelů uzavřít jeden viditelný projekt, každých dvacet změnit prostředí a posunout příběh.
- Nové sady tvořit obměnou dvou až tří typů dlaždic, nikoli pokaždé všech.
- Obtížnost vést ve vlnách: přístupnější úvod, pestřejší prostředek a náročnější závěr.
- Tahy zatím neurčovat; ladit je podle skutečné analytiky testerů.
- Nové mechaniky zavádět postupně a s kontextovým vysvětlením.
- Před každou etapou rozepsat konkrétní úkoly, deník, obrazové změny, pravidla cílů a ukládání. Poté teprve tvořit grafiku a implementovat.
- Zachovat mobilní čitelnost, postup napříč zařízeními a funkční opakování levelů.

Rozsah: šest etap po 20 nových levelech = 120 nových + 120 současných = 240. Volitelný epilog přidá 10, celkem 250.
