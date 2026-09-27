# Elysium — kapitola 4: Spící město

## Přechod z Aster Veil
Po bóji 3/3 a obou planetách 6/6 hráč sestaví přibližovací trasu v jedné
minihře (7 × 8, dva barevné cíle, 4 kryty, 30 tahů). Poté může sledovat
signál skrz prachový oblak. Osmisekundový přílet odhalí velikou stanici;
lze jej přeskočit nebo zrušit, omezené animace jsou respektované.
Sestavená trasa se ukládá odděleně od příletu.

## Šest sektorů — pevné pořadí
1. **Příletový dok — implementováno:** navádění, spojovací tunel, tlak, náklad (4 hry).
2. **Energetické jádro — implementováno:** chlazení, rozvod, zážeh, bezpečnost (4 hry).
3. **Centrální prstenec — další práce:** propojit stanici a obnovit její dopravu.
4. **Obytný sektor — plán:** připravit obyvatelné město, zjistit příčinu evakuace.
5. **Biosféra — plán:** skutečná výstavba s využitím výzkumu ze třetí kapitoly.
6. **Observatoř — plán:** spojení, odpověď na signál a další příběhový směr.

Haven zůstává malým útočištěm s bránou. Elysium je město v úsporném
ochranném režimu. Deník po každém úkolu odhaluje, že systémy byly odstaveny
záměrně. Žádná nová měna, volný obchod ani opakované těžení.

## Provedení
`src/elysium.js`: 9 miniher, 10 zápisů, brány postupu.
`ElysiumApproach.jsx`: bublina, hra, připravená trasa a přílet.
`Elysium.jsx`: portrétový celkový pohled, 6 označených sektorů.
Interiéry používají sdílené Exploration. Každý úkol odhalí příslušnou
část opravené grafiky; dokončený sektor se rozsvítí i na celkovém pohledu.
Neimplementované sektory jsou označené jako připravované.

## Ukládání a nasazení
Nové čítače: elysiumRouteCompleted, elysiumArrival (0–1),
elysiumDockCompleted a elysiumCoreCompleted (0–4).
Reset/merge/validace zachovávají předchozí postup a hlídají návaznosti.
**Pro cloud spustit `supabase/009_elysium.sql`.** Kumulativní migrace zahrnuje
004–008; živé provedení zatím nepotvrzené. Klient odmítne vydávat ztracená
nová pole ze starého serveru za úspěšné uložení, místní kopie zůstává.

## Ověření
68 unit testů; izolovaný mobilní průchod: trasa, odložení příletu, obnovení,
přílet, 4 opravy doku, 4 opravy jádra, návraty, reload, deník a načtení grafiky.
Obsah EN/CZ. Nové limity jsou návrh k testování, staré levely se neměnily.
