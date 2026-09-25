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

## Aktualizace 2026-09-24 — Haven

Hratelná stanice Haven a skoková brána navazují na obě dokončené expedice.
Šest oprav, závěrečný HARD level, průlet a návrat zdarma jsou implementované.
Viz [Haven a cesta mezi soustavami](haven-gate.md).
Nejbližší práce: nasadit SQL006 a ověřit cloud na druhém zařízení,
poté první hratelný průzkum Survey buoy v Aster Veil. Následují
Shattered moon a Verdant world; současná mapa je označuje Coming next.
Obtížnost ladit následně podle hraní, předchozí pořadí cloud/odlet/boostery
v tomto historickém dokumentu už není aktuálním seznamem nedodělků.

## Na příště — zadání uživatele 2026-09-24

Dnešní práci ukončit; následující body jsou backlog, nikoli pokyn pokračovat dnes.

1. **Dokončit soustavu Aster Veil**, do které jsme přiletěli: hratelný obsah
   pro Survey buoy, Shattered moon a Verdant world, návazné úkoly,
   obrazové změny, deník a ukládání postupu.
2. **Zpětně upravit počty tahů podle dalších informací od uživatele.**
   Začátek hry má podle jeho hraní absurdně mnoho tahů. Počkat na jeho
   konkrétní zpětnou vazbu; nyní plošně neměnit limity.
3. **Dodělat boosty:** vlastní zvukové efekty a boost za řadu pěti kamenů.
   Technická poznámka pro navázání: src/boosters.js již obsahuje NOVA
   pro 5+ v řadě (zásah řádku i sloupce), mimo čtyři úvodní kokpitové úkoly.
   Při další práci prověřit vznik a čitelnost tohoto boostu v reálné hře,
   dotáhnout jeho chování/podobu podle požadavku; neoznačovat bod za hotový
   pouze proto, že existuje pravidlo v kódu. Zvuky patří k tomuto úkolu.

Haven a warp byly pushnuté v commitu d367e58 na codex/cockpit-stage.
Nasazení SQL006 uživatel zatím nepotvrdil; ponechat jako neověřenou položku.

## 2026-09-25 — Mobilní opravy ovládání

- Výsledek při vyčerpání tahů nahradí desku, s návratem scrollu a fokusu
  nahoru. Retry a návrat jsou přímo ve výsledku.
- Replay v komoře vlevo, pravé dveře Corridor mají volný prostor.
- Horní ? a 3 nápovědy na pokus, obnovení při Retry. První výukové
  zvýraznění kokpitu zdarma. Jde o výchozí nastavení pro testování;
  neimplementuje reklamy ani nákup nápověd.

Upřesnění uživatele 2026-09-25: běžná hra se má vejít na displej,
posun delšího obsahu je přípustný. Nápověda pouze 1 zdarma na pokus,
další za odměňovanou reklamu (nahrazuje návrh tří). Reklamní služba
zatím nepřipojená, UI ji označuje coming soon a nepředstírá odměnu.

## 2026-09-25 — Zpětná vazba: jednotná cesta lodí

Implementované pevné pořadí celé první kapitoly viz [Pevný průchod](linear-chapter.md).
Nahrazuje dřívější volný výběr místností. Před publikováním spustit SQL007
pro ukládání komory před kokpitem; staré postupy se zachovají.
Další obsah Aster Veil a ladění tahů podle hráče zůstávají v backlogu.

2026-09-25: Počty tahů první kapitoly upravené podle konkrétního zadání;
kokpit zvětšený, s boosty a novými cíli. Viz [Limity tahů](move-budgets-2026-09-25.md).
Další krok v této oblasti: zpětná vazba uživatele na navržený kokpit.

### EN/CZ — dokončeno 2026-09-25
Přepínač v nastavení, místní uložení volby a překlad současného obsahu
včetně deníku a expedic. Obrazové nápisy se nemění. Viz localization.md.
Nový obsah doplňovat rovnou v obou jazycích; obtížnost tím není změněna.
