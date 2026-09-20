# Roadmapa dalšího vývoje

Aktualizace: 2026-09-20. Návrh pořadí práce, nikoli požadavek vše ihned
implementovat. Tento dokument je aktuální plán pokračování; starší
časové poznámky v roadmap-ship.md zachycují historii první kapitoly.

## Výchozí stav

- Portrétová webová hra, testovací verze publikovaná přes GitHub Pages.
- 28 oprav: kokpit4, komora3, ubikace4, kuchyňka4, strojovna5,
  navigace4, exteriér4 včetně podvozku a tankování.
- Limity tahů, kryty kamenů, pět energetických článků, zvuk a deník.
- Místní ukládání oprav, paliva, finále, čteného deníku a poslední scény.
- Finální HARD level existuje, odletová sekvence zatím chybí.
- Cloud, přihlášení, reklamy a speciální kameny zatím nejsou zapojené.

## 1. Uzavřít první kolo testování

Cíl: hráč sám pochopí, kam jít, a může hru opakovaně bezpečně zavřít.

- Sepsat nálezy testerů: zařízení/prohlížeč, místnost/úkol, co čekali a co
  se stalo. Oddělit chyby od přání na nové funkce.
- Prověřit ukládání po zavření karty i prohlížeče, návrat po aktualizaci
  hry, dvě otevřené karty a chování při odmítnutí úložiště.
- Prověřit čitelnost vstupu do komunikace/navigace, venkovních oprav a
  podmínky tankování. Udržet jednotné ovládání přímo v grafice.
- Zaznamenat obtížná i zbytečně snadná místa podle skutečných pokusů.
  Vyvážení nemá cíleně vytvářet neřešitelné situace kvůli reklamě.
- Upravit zjištěné překryvy tlačítek, malé dotykové plochy a dlouhé texty.

Hotovo, když: nejsou známé blokující chyby ani běžná ztráta uloženého
postupu a tester projde kapitolu bez vysvětlování od autora.

## 2. Účet a cloudové ukládání

Navazuje na původní požadavek: ukládání a přihlášení před dalšími levely.
Místní ukládání zůstane pro hosty a jako základ práce bez připojení.

- Připravit Supabase projekt, datový model a verzování uložené hry.
  Rozlišit postup oprav, deník, finále, energii a čas obnovy.
- Začít Google přihlášením pro web; konkrétní poskytovatele ještě potvrdit.
  Hraní bez účtu zachovat. Facebook zatím odložit.
- Přenést hostův postup k účtu bez ztráty již existující cloudové hry.
- Vyřešit konflikt dvou zařízení, opakované požadavky, výpadek internetu,
  stav synchronizace a bezpečné odhlášení/střídání účtů.
- Přístup k datům pouze vlastníkovi účtu; soukromé serverové klíče nikdy
  neposílat do klienta. Úložiště není důvěryhodný zdroj placených odměn.
- Při distribuci přes Telegram přidat přihlášení s ověřením initData na
  backendu a promyslet propojení s existujícím Google účtem.

Hotovo, když: stejný účet pokračuje na dvou zařízeních, host nepřijde
přihlášením o postup a výpadek spojení nepřepíše novější uloženou hru.
Před realizací potřebujeme konkrétní projekt a konfiguraci poskytovatele;
neřešíme nyní tarif ani slibovanou cenu služeb.

## 3. Dokončit odlet a uzavření první kapitoly

- Po 28 opravách a vítězství ve finále nabídnout srozumitelný start.
- Krátká sekvence: odpojení palivové hadice, aktivace motorů, vzlet,
  přechod k signálu. Zkrácená varianta při omezených animacích a přeskočení.
- Závěrečný zápis deníku a jasné zakončení kapitoly.
- Uložit dokončení tak, aby návrat po přerušení animace nezablokoval hru
  ani neopakoval odměny. Pokud další kapitola chybí, jasně to zobrazit.

Hotovo, když: hráč vidí výsledek všech oprav a bezpečně se vrátí i po
zavření během odletu.

## 4. Jedna nová mechanika: speciální kameny

Podklad: special-pieces-proposal.md. Pravidla jsou návrh k rozhodnutí.

- Vybrat první typ, například 4 stejné v řadě → pulzní nálož 3×3.
- Ujasnit vznik, aktivaci, spotřebu tahu, reakci na kryty a řetězení.
- Naučit mechaniku krátkým úkolem; nespoléhat na pevné pořadí místností.
- Ověřit hledání dostupných tahů, kaskády a výhru na posledním tahu.
- Znovu vyvážit levely. Teprve potom uvažovat o dalších kombinacích.

Hotovo, když: hráč chápe vznik i použití nálože a mechanika nezavádí
nekonečné řetězení nebo nutnost kupovat boostery.

## 5. Další kapitola: signál a první část základny

Směr stanice/základny je schválený; konkrétní místo a příběhové detaily
ještě rozhodnout. Nenavrhovat hned desítky místností.

- Navrhnout návaznost na živou odpověď a maják ztracené výpravy.
- První malý celek: přílet, přístup do opuštěného modulu, obnovení energie
  a zprovoznění jednoho prostoru. Pracovně 4–6 levelů, počet není schválený.
- Každý level má výraznou změnu prostředí, krátkou bublinu a stopu v deníku.
- Budování odměňovat přímo výhrou, bez návratu k surovinové ekonomice.
- Připravit strukturu kapitol/scén/úkolů tak, aby další obsah šel přidávat
  datově a nemusel rozšiřovat řetězec podmínek v hlavní komponentě.
- Ukládat stabilní identifikátory úkolů a migrovat dosavadní číselný postup
  před změnami pořadí nebo počtu existujících oprav.

Hotovo, když: funguje jeden kompletní nový celek od příletu po viditelnou
obnovu a přidání dalšího nepřepisuje již uložený postup.

## 6. Dobrovolné reklamy a nápověda

Plánovat až nad vyzkoušenou obtížností a účty; žádná falešná reklamní tlačítka.

- První kandidát: dobrovolná reklama za další tahy po prohře.
- Nápověda: rozhodnout, zda radí tah v minihře, nebo další cíl na lodi.
  Navigaci a vysvětlení základních pravidel doporučuji nechat bez reklamy.
- Současné Show a hint zůstává zdarma, dokud nebude schválen jiný model.
- Stanovit počet odměn za pokus a chování při nedostupné/přerušené reklamě.
- Udělit odměnu právě jednou po potvrzeném dokončení. Vybrat poskytovatele
  podle skutečné platformy; dostupnost pro web, Telegram a Android ověřit
  až při výběru. Platební nákupy nejsou součástí tohoto kroku.

Hotovo, když: odmítnutí či selhání reklamy neztrácí postup a odměna se
neduplikuje. Bezplatný základ zůstává hratelný.

## 7. Příprava samostatné mobilní aplikace

- Po ověření hry rozhodnout způsob zabalení webu pro Android.
- Ověřit přihlášení, zvuk, ukládání, tlačítko Zpět, pozastavení aplikace,
  malé displeje a návrat z reklamy.
- Připravit ikonu, úvodní obrazovku, verze sestavení a interní testování.
- Před publikací ověřit aktuální požadavky Google Play a použitých služeb.

Tento krok nevyžaduje nyní přepisovat hru mimo webové technologie.

## Nejbližší pracovní balíček

1. Vyhodnotit první hlášení testerů a opravit konkrétní blokující chyby.
2. Navrhnout cloudový save a přenos host → účet.
3. Zapojit Supabase a první způsob přihlášení.
4. Dokončit odlet; pak speciální kameny a malý celek další kapitoly.

Bez pevných termínů: rozsah odhadnout po vyhodnocení testů a volbě přihlášení.
