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

### Aster Veil — obsah 2026-09-26
Dokončena bóje a dvě výpravy (3+6+6 úkolů), dvě místní dlaždice, deník a
obrazové opravy. Viz aster-veil.md. Následuje nasazení SQL008, ověření
cloudového přenosu a lidské ladění obtížnosti. Další příběhový cíl po
porovnání vzorků zatím pouze naznačen na mapě, není hratelný.

## Elysium — navazující práce (2026-09-27)
Přílet a první dvě etapy implementované; detaily docs/elysium.md.
Následuje centrální prstenec, obytný sektor, biosféra a observatoř.
Uživatel požádal zveřejnit testovatelný stav a poté pokračovat.
Cloud nových kapitol vyžaduje SQL009, zatím nepotvrzeno.

Aktualizace po pushi a6fa895: centrální prstenec je lokálně hotový
(4úkoly a deník, rozsvícení venku). Pokračovat obytným sektorem,
pak biosférou a observatoří. Publikovaná verze má zatím dok a jádro.
SQL010 kumulativně pokrývá všechny lokální etapy, živě dosud nepotvrzeno.

## Dokončení Elysia (2026-09-27)
Všech6sektorů je nyní lokálně hratelných, včetně závěru kapitoly.
Viz docs/elysium-city.md; SQL011 dosud na serveru nepotvrzeno.
Další práce: testování nové kapitoly, doladění limitů podle hraní,
a návrh pokračování až po zpětné vazbě. Obytný/biosféra/observatoř už
nejsou plánované prázdné sektory. Následně pushnuto v commitu 63713fc.

## Další směr po Elysiu — Trhlina (2026-09-27)
Uživatel požádal uchovat návrh a pro dnešek skončit. Podrobnosti:
[Trhlina a prostor za ní](rift-roadmap.md). Elysium jako základna,
záhadná ozvěna, průzkum hranice soustavy, stabilizační majáky a průlet
červí dírou; za ní samostatná kapitola s aktivací cizí stavby.
Zvážit portálová pole a rezonátory. Zatím pouze návrh, ne implementace.

## Trhlina — implementace 2026-09-28
Dokončená kapitola5: tři lokace po4úkolech,13deníků EN/CZ, obrazové
aktivace a průlet do nového prostoru s návratem na Elysium. Viz
[Trhlina](rift-chapter.md). Lokální změny, bez pushe; cloud vyžaduje
SQL012 (zahrnuje011), zatím neprovedeno.
Příště testování a zpětná vazba, potom vlastní průzkum zahradního
prstence. Nové mechaniky portálů/rezonátorů zatím nejsou součástí hry.
## Nejbližší krok — testovací reklamy (schváleno 2026-09-29)

Implementovat simulované reklamní okno a odměny: +5 tahů jednou za pokus,
+1 energie při nule, jeden vybraný booster se společným limitem jedné
reklamní odměny za pokus, jedna další nápověda za reklamu. Zachovat desku
i společnou zásobu boosterů. Evidovat využitou pomoc pro ladění obtížnosti.
Přesná schválená pravidla jsou v [deníku rozhodnutí](decisions-log.md).
Zatím plán, nikoli hotová implementace nebo skutečná reklamní integrace.


2026-09-29: Testovací reklamy implementované lokálně: +5 tahů, +1 energie při nule, jeden vybraný booster a další nápověda dle schválených limitů. Podrobnosti docs/decisions-log.md (Testovací reklamy lokálně implementované). Místní diagnostika použitých pomůcek pro ladění. Bez reklamního SDK a bez pushe.


## 2026-09-30 — Hratelná zahrada za Trhlinou
Šest úkolů v beyond-rift: terasa, zpáteční maják, most, voda, semenný archiv, HARD srdce zahrady. EN/CZ deník, viditelné aktivace, replay a místní ukládání gardenCompleted. Detaily docs/garden-chapter.md. Cloud vyžaduje supabase/013_garden.sql, zatím neprovedeno. Lokální změny bez pushe.


## 2026-09-30 — Výzkum na Elysiu a nové dlaždice
Po zahradě6/6 hratelný výzkum5úkolů, vlastní laboratoř, deník EN/CZ a tři nové dlaždice (semeno, vzorek, navigační hranol). researchCompleted0–5, cloud vyžaduje SQL014 včetně013; neprovedeno. Nová cesta ke Zhasínajícímu světu zatím rozluštěná v příběhu, její tři lokace a rezonátory jsou další krok. Detaily docs/research-and-fading-world.md. Lokální, bez pushe.

## 2026-09-30 — Retranslační stanice a rezonátory
Po výzkumu5/5 je hratelná fading-relay: čtyři úkoly, vlastní grafika,
výzkumné dlaždice, EN/CZ deník a rezonátory nabíjené sousedním přirozeným
spojením (nikoli výbuchem). Výhra vyžaduje všechny rezonátory; +5 tahů
zachová jejich náboj. relayCompleted0–4, cloud vyžaduje kumulativní
supabase/015_relay.sql včetně013/014; živé nasazení nepotvrzené.
91 testů a build prošly, mobilní průchod a reklamní pokračování ověřeny.
Lokální, bez pushe. Další obsah: Noční zahrada, potom útočiště výpravy.
Detaily docs/relay-chapter.md. Nahrazuje poznámku o pouze plánovaných rezonátorech.


## 2026-10-01 — Mobilní scény, katalog, měření a dlouhodobý plán
Odstraněny zbývající scene-caption v celé kapitole1 i spodní departure-invite
po odletu (mapa dostupná nahoře). Obrazové scény jednotně9/16, základ i
opravené vrstvy contain, odstraněno top110 expedic; hlavičky s rezervou
pod ovladači. Mapy se samostatným rozvržením zachované. Uživatelův nově
avizovaný screenshot zatím nepřiložen.
Katalog src/levelCatalog.js obsahuje120jedinečných miniher včetně
HARD finále a přístupové trasy Elysium. Animace/skener nejsou levely.
Testovací panel balance.html přes Nastavení: místní úspěšnost, výhry
bez pomoci, využití pomoci, zbývající tahy, odchody/chyby, export/importJSON.
Nové pokusy jedinečnéID, vyčerpání tahů zápis ihned; výsledek pokračování
aktualizuje tentýž pokus. Konfigurace a cíle v exportu, aktuální tahy/rozměry
výchozí filtr. Max2000místních záznamů; žádná centrální analytika.
Bez20pokusů panel nenavrhuje obtížnost. Detaily docs/development-plan.md.
Dlouhodobý plán: stabilita→měření→prezentace→platformníbuildy→Noční
zahrada/útočiště→obsahové balíčky. Větší desky podle mechaniky, nikoli
plošně; mohou usnadnit hru.94testů/build, šestmobilníchscén a zapisování
vyčerpání/reklamního pokračování ověřeny. Lokálně bezpushe.


## 2026-10-01 — Společná analytika Supabase připravena
Automatická anonymní/pseudonymní hlášení pokusů i pro hosty, trvalá fronta
max2000, retry po online/focus/30s, backfill místních záznamů při prvním
spuštění. StejnéID a monotónnírevize pro pokračování +5. ServerRPC zapisuje
omezený payload, tajný tokenreportéra chrání aktualizace. Čtení pouze
účtem v balance_admins; panel umí načíst všechny testery. Žádné jméno/e-mail
v herních záznamech. Migrace supabase/016_balance_analytics.sql nezávislá
na postupu; správce přidat SQLpodle docs/balance-analytics.md.
97testů/build a browser test se simulovanýmRPC prošly. Živá migrace/role
zatím neověřeny, vyžadují zásah správceSupabase. Zatím místně, nepushnuto.
Nahrazuje poznámku, že centrální sběr není implementovaný; aktivace chybí.

## 2026-10-10 — Příprava vydání na Google Play (backlog)

Uživatel požádal o zapsání dalších činností, nikoli o zahájení implementace.
Před realizací chce probrat další nápady. Níže je navržený postup;
Capacitor a AdMob jsou doporučené varianty, nikoli již zapojené služby.

- [ ] Ověřit existenci, typ a datum založení Play Console účtu. Registrace
  stojí dle aktuální dokumentace jednorázově 25 USD; dokončit ověření účtu.
- [ ] Připravit samostatný Android build přes Capacitor se společným React/Vite
  kódem, přibalenými herními soubory a bez administrátorského dashboardu.
  Změřit velikost balíku a odstranit nepotřebné podklady; podle výsledku
  rozhodnout o případném dodatečném stahování obsahu.
- [ ] Nastavit Android Studio, trvalé applicationId, verzování, podpis,
  Play App Signing a bezpečnou zálohu upload klíče. APK pro přímý test,
  podepsané AAB pro Google Play. Aktualizace webu sama neaktualizuje aplikaci.
- [ ] Ověřit aktuální target API (k 10. 10. 2026 dokumentace uvádí API 36),
  kompatibilitu použitých SDK a nativních knihoven včetně 16KB stránek.
- [ ] Otestovat portrétové UI, výřezy a systémové lišty, tlačítko Zpět,
  různé telefony a výkon. Ošetřit zamčení, pozadí, návrat a zvuk během reklamy.
- [ ] Prověřit trvalé ukládání při aktualizaci a ukončení aplikace systémem;
  navrhnout obnovu rozehrané desky, kterou dnes neukládáme. Ověřit offline
  hraní a následnou synchronizaci bez ztráty postupu.
- [ ] Přizpůsobit Google přihlášení a návrat do aplikace; ověřit cloudový
  přenos pod stejným účtem. Lokální host z webu se automaticky nepřenese.
- [ ] Oddělit Android/web a verzi aplikace ve statistikách.
- [ ] Připojit skutečné odměňované reklamy přes nativní SDK; první kandidát
  AdMob, definitivní výběr otevřený. Zachovat schválené odměny a limity
  (+5 tahů, energie při nule, pomůcka, nápověda). Zpočátku návrh bez bannerů
  a nucených reklam. Odměnu udělit jednou až po potvrzení SDK, ne při zavření;
  chyba nebo nedostupnost reklamy nesmí poškodit rozehranou hru.
- [ ] Nejprve testovací reklamní jednotky; pro ostré AdMob nastavit UMP,
  dostupné nastavení soukromí, app-ads.txt na vlastní doméně a schválení aplikace.
- [ ] Připravit zásady soukromí, Data safety podle skutečných dat/SDK,
  deklaraci reklam, cílové publikum a hodnocení obsahu. Při vytváření účtů
  zajistit smazání účtu/dat v aplikaci i webovou cestu; restart hry nestačí.
- [ ] Připravit ikonu, grafiku, popisy a screenshoty skutečné Android verze.
- [ ] Interní test, poté uzavřený test a žádost o produkční vydání.
  Pro osobní účty založené po 13. 11. 2023 aktuálně platí alespoň 12 testerů
  přihlášených nepřetržitě 14 dní a následné posouzení produkčního přístupu.
  Současný webový Bounty playtest tuto podmínku neplní.

Navržené pořadí: Capacitor → APK na fyzický telefon → ukládání/přihlášení
→ testovací reklamy → podepsaný AAB → uzavřený test → vydání.
Požadavky znovu ověřit při realizaci; schválení Play a AdMob jsou samostatná.

Zdroje ověřené 10. 10. 2026:
- https://capacitorjs.com/docs/android
- https://developer.android.com/google/play/requirements/target-sdk
- https://developer.android.com/guide/app-bundle
- https://support.google.com/googleplay/android-developer/answer/6112435
- https://support.google.com/googleplay/android-developer/answer/14151465
- https://support.google.com/googleplay/android-developer/answer/13327111
- https://developers.google.com/admob/android/rewarded
- https://developers.google.com/admob/android/privacy
- https://support.google.com/admob/answer/14538460
