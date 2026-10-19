# Zkušební odměna za kaskádu

2026-10-19 — uživatel schválil vyzkoušet nálož na desce místo bodování či pomůcek do zásoby.

- Po třech dalších vlnách spojení po úvodní akci, tedy nejdříve při čtvrté celkové vlně, vznikne jeden bonusový Pulse.
- Nejvýše jeden za celý tah, bez dalšího odečtu tahu. Podporované obyčejné výměny včetně přesunu nálože i přímé odpálení. Akce placenou pomůckou bonus nedávají. V levelech s vypnutými náložemi není odměna.
- Pulse vznikne až po skončení kaskád. Nemůže automaticky pokračovat ve výbuších ani odměnit sám sebe. Klepnutí pro pozdější aktivaci dál stojí jeden tah.
- Umístění přednostně na platném obyčejném kameni v oblasti poslední kaskády, jinak jiný obyčejný kámen. Nepřepisuje kryty, díry/rezonátory, Pulse ani Novu. Pokud není místo, nic se nezmění. Původní obyčejný kámen se změnou na bonus nesbírá do cíle.
- Již vyhraný level bonus nevytváří; hráč odměnu nemá kde použít. Samotná odměna nemění cíle/limity/energii/zásobu pomůcek.

Implementace: čistá funkce awardCascadePulse v boosters.js, práh CASCADE_PULSE_THRESHOLD=3. MiniGame počítá přirozená spojení pouze po úvodní vlně, vytvoří bonus jednou po smyčce, označí kámen zlatě a ukáže zprávu. Resetuje oznámení při dalším tahu/retry/chybě. Krátký EN/CZ tutoriál Cascade reward až při prvním získání; dostupný také přes ⓘ. Žádná nová grafika, body, inventář ani SQL.

Verze analytiky 2026-10-19-cascade-pulse-v1 zahrnuje i dosud místní změnu rezonátorů na +1 za samostatnou kombinaci. Slepý playtest zachovává konfiguraci a initialRules průchodu; aktuální runtime pravidla jsou v build. Počet vytvořených náloží v playtestu zahrnuje bonus, samostatné cascadePulses je v configuration.playtest a exportu. Při porovnání starých pokusů rozlišovat build.

Šest místních simulátorů doplněno o bonus po doběhnutí tahu, před dalším tahem. Počet vln bez úvodní je cascade-1. Jejich dosavadní strategie výběru tahů se nemění, stále nejde o garantovaný model člověka. Externí bot musí novou odměnu do svého vyhodnocování zahrnout; samotné volání wave nepokrývá konec tahu.

Ověření:245unit/build/diffcheck prošlo; čisté testy prahu, max1, disabled/used, žádného místa a ochrany krytů/Pulse/Novy. Skutečný čtyřvlnový tah se deterministickým doplňováním ve Chromium/WebKit320×568 vytvořil jeden klidný Pulse a odečetl jediný tah. Screenshot viz .local/cascade-pulse-webkit.png zkontrolovaný. Souběžně v obou enginách prošel +2rezonátor. Jednovzorkový běh balance-signal ověřil pouze funkčnost skriptu, není výsledkem obtížnosti. Žádná nová plná balance simulace ani fyzický test uživatele. Změny zatím místní, bez pushe.
