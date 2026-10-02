# Přehled kapitol a nejlepší výsledky — návrh implementace

Stav 2026-10-01: technický návrh k diskuzi, žádná změna hry. Navazuje na další úkol v decisions-log.md. Aktuálně 145 miniher.

## Zjištění v současném kódu

- main.jsx má centrální goTo s kontrolami odemčení a přechodem scén. Nová navigace musí používat stejnou cestu, nikoli přímo měnit scene bez validace.
- Replay existuje v jednotlivých scénách. Exploration.jsx dovoluje jen tasks.slice(0,done); completeDestination nezvyšuje postup opakováním již dokončeného úkolu.
- levelCatalog.js je katalog pro analytiku, nikoli chronologický seznam: přílet k Elysiu je před ostatními destinacemi a jejich pořadí plyne z objektu. Číslo levelu nelze odvozovat z dnešního indexu tohoto katalogu.
- progressStorage.js ukládá počty oprav, příběhové milníky a scénu. Nejlepší skóre zatím nemá. mergeProgress používá maxima počtů a resetRevision chrání před starým uložením.
- MiniGame.jsx již zaznamenává počet tahů, základní i rozšířený limit, cíle, pomoc, kryty a rezonanci do analytiky. Nemá souhrnné herní skóre za komba a nálože.
- Výhra se dnes zaznamenává až potvrzením výsledkového tlačítka. Nové hodnocení nesmí vznikat dvojitě ani záviset na tom, zda hráč stihne potvrdit výsledek před zavřením karty.

## 1. Společný registr příběhových kapitol

Navržený src/chapters.js bude obsahovat stabilní id, EN/CZ název, pořadí, náhled, vstupní scénu, skupiny levelů a podmínku odemčení. Level bude mít stabilní repair.id, příběhové číslo, scénu a podmínku dokončení. Data oprav se odkazují, nekopírují.

Kapitoly zachovají současné číslování 1–9. Návrat do Elysia za výzkumem bude samostatná položka v příběhové trase, nikoli druhá kopie celé kapitoly 4. Jeho přesné zařazení do přehledu je otevřené: doporučuji podsekci kapitoly 7 před retranslační stanicí. Registry musí zajistit, že každá ze 145 miniher patří právě do jedné hodnoticí skupiny.

Dokončení počítat z existujících uložených oprav a finaleDone. Odlet, instalace skeneru, průlety a komiks jsou milníky odemčení, nikoli další minihry. Například dokončené všechny úkoly Noční zahrady nemusí samo znamenat odemčené Útočiště, dokud není uložené setkání se správcem.

Útočiště má zatím 5 hratelných levelů: zobrazit 5/5 dostupných úkolů a označit kapitolu jako rozpracovanou. Nevydávat ji za definitivně dokončenou dvacetilevelovou kapitolu. Po přidání obsahu roste dostupný jmenovatel, staré výsledky zůstávají.

## 2. Mobilní přehled a replay

Tlačítko Chapters / Kapitoly v horním ovládání scén otevře nativní dialog: svislý seznam kompaktních řádků s náhledem, číslem, názvem, done/total a stavem. Seznam má vlastní scroll; pozadí ne. Nejde o novou tabulkovou mapu soustavy — stávající vesmírné mapy zůstávají.

Rozbalený řádek nabídne Pokračovat (první nedokončené dostupné místo), Navštívit (mapa/vstup kapitoly) a Úrovně (skupiny místností nebo lokalit a již odemčené úkoly). Úrovně dovolí přímé opakování, takže cesta na konkrétní level nepotřebuje několik dalších návratů. Rozehraná kapitola má výchozí Pokračovat, dokončená Navštívit. Přehled nesmí přeskočit příběhovou podmínku nové kapitoly.

Pro první iteraci doporučuji výběr kapitoly → její mapa/scéna + současný replay. Ve druhé iteraci přímý výběr konkrétního levelu přes požadavek {scene,repairId,mode:'replay'}; žádné umělé navyšování completed pro otevření starého úkolu. Vlastník minihry spotřebuje požadavek pouze jednou po navigaci. Přístup lze časem sjednotit, dnes je MiniGame otevíraná několika komponentami.

Šipka zůstane jako místní návrat; Chapters bude hlavní cesta mezi kapitolami. Při otevřené minihře zatím přehled neotevírat. Budoucí položka pauzy použije existující potvrzení odchodu a energetická pravidla. Nevytvářet skryté opuštění pokusu. Přechody, reklama, výhra a komiks výběr blokují; otevřený panel blokuje automatickou aktualizaci. Escape zavírá panel, fokus se vrací na Chapters.

## 3. Hodnocení — nejdřív měřit, potom nastavit hvězdy

Nedoporučuji hned násobit náhodně nasbírané kameny body: velká náhodná kaskáda nebo opakované použití pomoci může zastínit dobře odehraný level. Ani prostý absolutní počet zbylých tahů není srovnatelný mezi různými limity a cíli.

Pro první verzi doporučuji jednodušší, vysvětlitelné pravidlo:

- Výhra vždy 1 hvězda.
- 2 a 3 hvězdy podle úspory základních tahů; hranice zvlášť pro každý level, po testování.
- Pomoc je povolená a nesnižuje automaticky hodnocení. Reklamní tahy ale nejsou bonus: savedBaseMoves = max(0, baseBudget - movesUsed). Po překročení základního limitu lze stále vyhrát za 1 hvězdu.
- Komba a nálože lze později přidat do zobrazeného skóre, až bude jejich evidence a kalibrace. Zatím je nepoužívat jako netestovaný vzorec pro hvězdy.

Toto je zjednodušená alternativa k původnímu návrhu bodů za cíle, komba, nálože a tahy; volbu je potřeba probrat s uživatelem. Konkrétní hranice nyní nevolit plošným procentem bez dat. Obtížnost levelu a hranice tří hvězd jsou dvě oddělená nastavení. Po snížení limitu tahů se nemají už získané hvězdy odebrat.

Existující výhry zobrazit jako Dokončeno · hodnocení získáte opakováním. Nevymýšlet 1–3 hvězdy z počtu completed, protože neznáme tehdejší výkon. V přehledu uvést zvlášť dokončení a hvězdy; pro nehodnocené výhry neutrální značku, ne stav prohry.

## 4. Uložení a životní cyklus výsledku

Čistá funkce src/levelRatings.js vypočítá rating z konečného výsledku až po všech kaskádách. MiniGame vytvoří jeden stabilní výsledek pokusu a samostatné onResult pro uložení hodnocení; onWin zůstane potvrzením opravy a příběhu. Preview Complete level nedává hvězdy. Hodnocení může být uložené před potvrzením opravy, takže samo nesmí odemykat žádnou kapitolu.

Navržená data bestResults[repairId]: stars, savedBaseMoves, ratingVersion, configurationId, achievedAt. Bez osobních údajů a bez celé historie pokusů — ta zůstává v analytice. Při shodě ponechat původní výsledek; vyšší hvězdy vyhrávají, při stejných lepší úspora tahů. Verze pravidel a konfigurace umožní vysvětlit starý rekord po úpravě levelu; neporovnávat nekompatibilní bodová skóre.

Lokální validace přijme pouze známá repair.id, hvězdy 1–3 a omezená číselná pole. Import hosta a cloud sloučí nejlepší výsledek po jednotlivých levelech. Celkový reset smaže také hodnocení; stará zařízení je nesmí obnovit přes odlišné resetRevision.

Rozšířit Supabase synchronizační RPC a reset o nejlepší výsledky atomicky, nikoli klientským přepsáním celého objektu. Migrační číslo určit až při implementaci. Pro testování stačí validované výsledky od klienta; to není ochrana proti podvádění pro budoucí veřejný soutěžní žebříček. Žebříček nyní není součástí úkolu.

## 5. Pořadí práce a ověření

1. Registr kapitol a test úplnosti všech 145 levelů, příběhového pořadí a odemčení.
2. Dialog Chapters s dokončením, návštěvou a pokračováním; žádná změna uloženého herního postupu.
3. Přímý replay konkrétního dostupného levelu a návrat do jeho kapitoly.
4. Evidence konečného výsledku + lokální nejlepší hodnocení, nejprve interní měření úspory tahů.
5. Po dohodě pravidel hvězdy, výsledková obrazovka, Supabase migrace a import/reset.

Ověřit telefon 320×568 i 390×720, EN/CZ, dlouhé názvy, klávesnici a fokus, skok z Útočiště do kapitoly 3, návrat na nejbližší nedokončený úkol, zamčené kapitoly, replay bez změny oprav/deníku, výhru posledním tahem, +5 bez bonusu, náhodné kaskády, dev dokončení bez hodnocení, offline/import/souběh dvou zařízení a reset se starou kartou.

## Body k dohodě před implementací hodnocení

- Jednoduché hvězdy podle úspory tahů, nebo bodový systém s komby? Doporučení: úspora tahů jako první verze.
- Zpřístupnit přímý výběr konkrétního levelu rovnou v první dodávce? Doporučení: ano v rámci navazující iterace přehledu, před hvězdami.
- Zachovat energetická pravidla replay? Doporučení: ano, dokud nebude výslovně schválen jiný režim.
- Výzkum Elysia zobrazit jako podsekci kapitoly 7? Doporučení: ano, bez přepisování čísel ostatních kapitol.

## Upřesnění 2026-10-02

Dokončené kapitoly, světy a úrovně ponechat běžně viditelné se značkou ✓ a možností přímého otevření. Samostatné nabídky Replay odstranit, jakmile je nahradí přímý výběr. Příběhový komiks v deníku je samostatná funkce. První krok implementuje dokončené hotspoty expedic a místností lodi; společný přehled kapitol a kokpit navazují. Menší dokončené značky mají být klidnější než aktuální úkol. Je nutná kontrola kolizí na telefonu.
