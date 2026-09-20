# Exteriér — implementace 2026-09-20

Po čtyřech opravách kokpitu jsou z vnějšího pohledu dostupné postupné opravy:

| Úkol | Cíl | Tahy | Viditelná změna |
|---|---|---|---|
| Hull panels | 24 palivových článků | 38 | Zacelený plášť |
| Engine nacelles | 45 libovolných kamenů | 24 | Opravené kryty, prstence trysek, cyan pohotovostní světla |
| Landing gear | 45 kamenů a 4 kryty | 38 | Loď stojí na hydraulických nohách |

Všechny desky 7×7 / 6 typů. Kryty až ve třetím úkolu. Simulace 100 her
jednoduchým automatem: 83/100, 100/100, 86/100; nejde o lidskou úspěšnost.
Každý úkol má bublinu, výhru, deník a preview dokončení. Vstupní průlez
zůstává dostupný. Finále vyžaduje všechny oblasti včetně exteriéru.

Plášť se neopravuje dvakrát: z komory byl přesunut ven. Komora má napájení,
vnitřní průlez a těsnění (3), ostatní etapy beze změny. Celkem 27 oprav:
kokpit4 + komora3 + exteriér3 + ubikace4 + kuchyňka4 + strojovna5 + navigace4.
Vnitřní pohon ve strojovně a vnější kryty motorů jsou různé úkoly.

## Grafika a nezávislé pořadí

ExteriorArt.jsx vybírá obraz pláště/motorů/podvozku dle exteriéru.
Těsnění průlezu a anténa jsou nezávislé rastrové detaily odhalené měkkou
SVG maskou. Anténa už není kreslený symbol. Raster pochází z
exterior-landing-gear-concept.png, optimalizovaný exterior-antenna-source.webp.
Anténa až po nav-antenna, těsnění až po třetí opravě komory.

Nové imagegen soubory (PNG originály + WebP pro hru):
- exterior-gear: reference exterior-landing-gear-concept.png; opravit
  zadní gondoly, čisté panely a oranžové pruhy, tmavé prstence trysek,
  jemné cyan světlo; odstranit anténu pro samostatné odemykání; zachovat
  nohy, perspektivu, krajinu a portrét.
- exterior-engines: reference exterior-sealed.webp a exterior-gear.png;
  stejná oprava motorů, loď stále na zemi bez nohou, bez antény.

Kontroly: 25 unit testů; produkční build; kompletní mobilní průchod
27 opravami a finále v obou pořadích komora/exteriér/navigace; prohlédnut
finální mobilní obraz. Ukládání stále pouze plán; herní postup je v paměti.

## 2026-09-20 — Palivové depo

Čtvrtý venkovní úkol Emergency fuel depot: 24 palivových článků / 38 tahů,
7×7 / 6 typů, bez krytů. Nouzový zásobník a čerpadlo loď vyložila po
přistání; nejde o cizí infrastrukturu ani sběr surovin. Vnější opravy
zůstávají postupné. Tankování vyžaduje dokončený podvozek a druhý úkol
strojovny engine-fuel. Zamčený hotspot vysvětluje požadavek. Guard je
na úkolu i při dokončení včetně preview. Dokončení opraví pumpu a označí
loď jako natankovanou; FuelDepot.jsx přehraje šestisekundový tok hadicí
pouze při změně stavu, ne při opětovném vstupu. Reduced motion bez pohybu.
Fuel log má vlastní zápis. Celkem 28 oprav, finále vyžaduje exterior4.
Palivový systém ve strojovně není totéž jako venkovní doplnění paliva.
