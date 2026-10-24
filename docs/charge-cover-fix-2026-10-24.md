# Nálože nesmějí dosednout pod kryt — 24. 10. 2026

Uživatel ve slepém testu našel Pulse pod posledním krytem. Příčina byla
ve společné gravitaci: kryt zůstává na buňce, barevné dílky i nálože
propadávaly a nálož mohla dosednout pod kryt. Pak ji nešlo klepnutím
aktivovat ani zapojit do barevné trojice. Chyba se týká webu i Androidu.

`refill` nově přijímá seznam stále neporušených krytů. Jen pokud by nálož
dosedla pod některý kryt, umístí ji výše na nejbližší možné nekryté místo
ve stejném gravitačním segmentu. Další nálože případně také zůstanou výše,
aby se zachovalo jejich pořadí. Barevné dílky vyplní zbytek ve svém pořadí.
Kryty neubývají, nálože ani barvy se neztrácejí a nepřidává se žádný los
náhradní barvy. Díry a nově vytvořené připnuté nálože stále oddělují segmenty.
Kryt zasažený aktuálním tahem už přesunutí neblokuje. U běžných pádů bez
kolize je výsledek přesně původní.

Změna je v `match3.js` a předání zachovaných krytů v `levelRules.js`.
Platí pro kaskády, výbuchy i pomůcky a také pro rozehrané slepé testy
po načtení nového kódu. Uložené pořadí testu, limity a již odehrané výsledky
se nemění. Rozpracovaná deska se přes reload neukládá; pro nový pokus se
už použijí opravená pravidla. Analytická verze nových výsledků:
`2026-10-24-charge-cover-fix-v1`; initialRules staršího slepého průchodu
zůstávají pro dohledání jeho původní konfigurace.

Ověření: 278 unit testů v Android větvi včetně nové reprodukce Pulse/Nova,
více náloží, děr, připnutých odměn a 1000 generovaných desek. Webové UI:
oba typy nálože po pádu zůstanou nad krytem, lze je odpálit a teprve výbuch
kryt rozbije; společně s 15 regresními scénáři Undo celkem 17 prošlo.
Stejné dva nové UI scénáře prošly také v Android režimu Chromium.
Tyto browserové kontroly nejsou testem na fyzickém zařízení.
