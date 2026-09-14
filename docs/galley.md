# Galley & Supplies — hratelná kuchyňka

Po čtyřech opravách kokpitu se současně odemykají ubikace i kuchyňka.
Hráč může libovolně přecházet; každá má vlastní postup, pevné pořadí čtyř
oprav a osobní deník. Strojovna ještě není implementovaná. Žádná místnost
nenahrazuje podmínku kompletní opravy celé lodi pro budoucí odlet.

| Oprava | Cíl | Typy |
|---|---|---|
| Water system | 18 komet | 5 |
| Cold storage | 42 všech, představení červeného orbu | 6 |
| Supply racks | 18 červených orbů | 6 |
| Food station | 48 všech | 6 |

Všechny desky 7×7, poslední má vykrojené rohy. Bez měny, zásob v inventáři,
hladu, boosterů a limitu tahů. Grafika vody/jídla představuje jednorázovou
opravu, nikoli průběžnou spotřebu. Příběh nepředpokládá dokončené ubikace.

Data src/galleyRepairs.js, sdílený parametrizovaný průběh v CrewQuarters.jsx
(prop room), archiv v ShipLog.jsx. Dokončení rozsvítí jantarový rám; tyrkysový
závisí výhradně na ubikacích. Hlavní světla chodby čekají ještě na strojovnu.
Navigace zachová postup, refresh jej stále resetuje.

## Grafika a prompty

Vestavěný imagegen, public/scenes/galley-0.png až galley-4.png, herní WebP.
Základ: Portrait 9:16 damaged compact spaceship galley, ivory panels and orange
trim, cinematic painterly 3D realism, dim amber lighting and blue shadows.
Upper left broken water pipe and tank; upper right damaged refrigerator;
middle left tilted supply shelves; middle right broken counter and cooker.
Moon porthole, no people or text, quiet ceiling and floor for mobile UI.

Kumulativní editace předchozího obrázku, vždy stejná kamera, výřez a geometrie:
1. Repair pipe, stop leak, intact transparent tank half full of clean water,
   dry floor. Preserve all other damage.
2. Repair refrigerator with closed glass door, softly cyan-lit shelves,
   straight casing. Preserve water and remaining damage.
3. Upright secure shelves, neatly stowed sealed food containers, clear floor;
   right counter and cooker remain broken.
4. Restore clean counter and cabinet doors, working cooker, pot and warm meal,
   upright cup, brighter warm overhead light. Preserve previous repairs.

Ověření 2026-09-14: build, 13 testů pravidel, prohlížečový průchod kokpit → kuchyňka bez dokončených ubikací a samostatně kokpit → ubikace. Ověřeny čtyři opravy, odchod bez odměny, replay, zápisy a oddělená světla rámů.
