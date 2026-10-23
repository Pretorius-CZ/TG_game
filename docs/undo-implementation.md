# Krok zpět — implementace 2026-10-23

Uživatel zadal implementaci pro Android i web. Pravidlo první verze:
jedna dokončená dobrovolná reklama připraví jeden Krok zpět pro daný pokus.
Tah vrátí až další výslovné klepnutí na zvýrazněné tlačítko. Žádná nová
cena, nákup, zásoba pomůcek ani změna limitů levelů.

## Upřesnění ovládání po zpětné vazbě

Původní vydání cfa4092 vracelo tah ihned po reklamě. Uživatel to zaměnil
za špatně dostupnou pomůcku, protože tlačítko rovnou zešedlo. Na jeho
pokyn bylo ovládání rozděleno: reklama jen připraví, druhé klepnutí použije.
Deska, cíle, tahy a energie po pouhém převzetí reklamní odměny zůstávají
stejné. Tlačítko dostane zelené zvýraznění, odznak1 a viditelnou zprávu
Krok zpět připraven. Po skutečném použití je5sekund vidět Tah vrácen.

Připravený kredit zůstává i při dalším běžném tahu; potom vrátí právě
poslední tah. Pomůcka zruší snímek, ale nezruší kredit: ten lze použít
po následujícím běžném tahu bez další reklamy. Retry, odchod/reload,
změna účtu nebo úrovně kredit nepřenášejí do nového pokusu. Metrika
undoUses vzroste až při skutečném použití, nikoli při zhlédnutí reklamy.

Ověřeno265unit testy,15Chromium undo scénáři (včetně původních kaskád,
last-life, Google viewed/dismissed/blocked i nového potvrzení, odložení,
pomůcky, zahození nepoužitého kreditu při retry a českých hlášek), dalších
13regresí energie/hvězd a6Android UI mock kontrol EN/CS. Připravený stav
vizuálně zkontrolován na393×780, testy měří i minimálně24px polí na320×568.
Níže uvedené starší release SHA a ověření popisují první vydání, nikoli
novější potvrzovací ovládání; nové zveřejnění zaznamenat po dokončení.

## Chování

Tlačítko ↶ Zpět / Undo je šestým prvkem lišty pomůcek, po vyčerpání tahů
je také v panelu prohry. Aktivuje se po dokončeném platném běžném tahu
nebo odpalu nálože. Vrací celou akci, včetně kaskád, barevných cílů,
krytů, nabití kruhů, vytvořených náloží, kaskádového Pulse, obnovy mrtvé
desky a počtu spotřebovaných tahů. Zvýraznění/rozpracovaný výběr se zruší.

Vítězný výsledek se nevrací, takže se neodebírá uložené hodnocení ani
oprava. Použití skladové pomůcky zneplatní starý vratný snímek; následující
běžný tah už vrátit lze, bez vracení spotřebované pomůcky. Nápovědy,
reklamní odměny, přidané tahy ani skutečně vykonané akce se neodmazávají.

Nedokončená/nedostupná reklama nic nevrátí ani nespotřebuje jediné použití.
Opakovaný reklamní callback neudělí druhý návrat. Snímek žije pouze v paměti
pokusu; zneplatní se při restartu, chybě, změně levelu/účtu či reloadu.
Slepý playtest má undo vypnuté a zásoby/pravidla zůstávají jako dosud.

## Stejné kameny při opakování

`turnUndo.js` drží hluboký snímek před tahem a proud skutečných náhodných
hodnot pro doplňování. Po návratu se čtou stejné hodnoty znovu; stejná
akce tak nedává nový los kaskád. Vrací se i historie ochrany proti nedostatku
barev. Náhodnost doplňování mimo návrat zůstává původní Math.random,
nejde o zvýhodňování platících hráčů. Při dalším běžném tahu se starý prefix
náhodných hodnot zahazuje. Data se neukládají do běžného postupu.

## Energie

Vrácení nezvyšuje počet energetických článků. Po prohře `resumeAttempt`
obnoví právo vrátit původně rezervovaný článek až při následné výhře,
bez dalšího odečtu. Funguje i při nule po spotřebování posledního článku.
Opakovaná prohra/odchod ponechá právě jeden odečet, reload neobnovuje
refundovací práva. Ostatní pravidla pokračování za +5 tahů zůstávají.

## Reklamy a metriky

Web využívá současný RewardAdProvider (simulace / výslovný Google test),
žádná ostrá reklama se tím nepovoluje. Android rozšiřuje testovací nativní
AdMob odměny z moves také na undo; skutečný Rewarded musí být následovaný
Dismissed, teprve potom se obnoví deska. Titulek/odměna odpovídají undo,
nikoli nabídce +5 tahů. Testovací reklamní ID beze změny.

`configuration.assistance.undoUses` a `actions` jsou součástí výsledku.
Konfigurace prochází dosavadním SQL allowlistem, nová migrace není potřeba.
`actions` počítá vykonané platné akce včetně vrácené, `moves` je herní počet
tahů po návratu. Undo se ukazuje v přehledu pomoci a vylučuje pokus
ze statistik bez pomoci. Verze metrik `2026-10-23-undo-v1`.

## Ověření před převzetím do webové větve

- 265 jednotkových testů včetně hlubokého návratu, náhodných hodnot,
  jednorázového čerpání, bariér, energie a čistých analytických pokusů.
- 48 Chromium scénářů: 11 nových undo, energie, mobilní rozměry EN/CS,
  orientace, hvězdy, izolace slepého testu. Undo scénáře pokrývají kryty,
  kruh, nálož, opakování stejného tahu, poslední život, retry, skladovou
  pomůcku a Google test viewed/dismissed/blocked.
- Šest kontrol Android režimu EN/CS s mock nativním adaptérem
  viewed/dismissed/error; vizuálně zkontrolován snímek 393×780.
- APK úspěšně sestavené. Fyzický telefon a skutečná nová AdMob odměna
  tím nejsou ověřené; uživatel provede aktualizaci přes Run.
- WebKit dnes padá před načtením stránky při browserType.launch,
  exitCode3236495362. Jeho kontrolu ani fyzický Safari neoznačovat za pass.

Zveřejnění a převzetí do webové větve zaznamenat až po dokončení. Nativní
balíčky ani AndroidRewardAd nekopírovat do webu; sdílený herní kód a
reklamní provider pro web mají samostatné sestavení.

## Převzetí do webu

Do codex/cockpit-stage převzata společná implementace z Android commitu
2d7b22e, včetně dřívější opravy ukládání replay hvězd f9fb288. MiniGame,
turnUndo, energie a metriky používají stejný zdroj; webový RewardAdProvider
si ponechává pouze webové adaptéry. Nativní závislosti, APK projekt ani
AndroidRewardAd se do webové větve nepřevzaly.

Samostatně na webové větvi: 262 unit testů, build/site/i18n check a
43 Chromium scénářů (undo, Google reklamy, mobilní layout, replay hvězdy)
pass. Živé nasazení bude ověřené samostatně po pushi.

## Živé ověření a Android APK

Webový commit cfa40923e3a7ebced12b52cc4c00c6f83eb88148 byl pushnutý a
nasazený na obě domény. Hlavní doména zůstala informačním webem.
Veřejné version.json: main1792771179135-cfa40923e3a7,
game1792771184264-cfa40923e3a7. Na živém game. EN i CS ověřeno otevření
levelu, dokončená simulovaná reklama, obnova přesné desky i tahů, zákaz
druhého použití a žádné JS chyby. Test měl izolovaný hostovský save,
zamítnuté statistiky a blokované analytické endpointy, žádný účet ani
skutečná reklama nebyly použity.

Finální Android APK je sestavené ze zdroje 2d7b22e a synchronizované
v android/app/src/main/assets/public; výstup
android/app/build/outputs/apk/debug/app-debug.apk. Uživatel jej dostane
do telefonu novým Run v Android Studiu, bez odinstalace a mazání dat.
Pracovní složka je opět ve větvi codex/android-current. Fyzické potvrzení
undo a nativní reklamy na POCO ještě zbývá; šest mock kontrol není jeho
náhrada. Obtížnost, zásoby a placení zůstaly beze změny.

## Zveřejnění potvrzovacího ovládání

Nová webová verze3110978430045a99ccc7ce163d248f076f8660df nahradila
okamžité vracení po reklamě. Veřejné verze:
main1792772275088-311097843004, game1792772257524-311097843004.
Na živém game. EN/CS ověřeno, že po reklamě je stejná deska i počet tahů,
zelené tlačítko1 a hláška připraveno. Teprve druhé klepnutí obnoví přesnou
desku/tahy, zobrazí Tah vrácen a vyčerpá jediné použití. Bez JS chyb,
bez skutečného účtu, analytických zápisů a skutečné reklamy.
Živý startup root/index prošel bez chybných zdrojů. Herní workflow
39985516342 success, hlavní39985517055 v poslední kontrole dokončuje
instalaci prohlížeče po úspěšném zveřejnění.

Android implementace cfec605 je pushnutá; aktuální synchronizované APK má
49 554 107 B a obsahuje stejné potvrzování. Web262/Android265 unit testů,
15undo browser scénářů na obou větvích a6Android mock kontrol pass.
Na fyzickém telefonu aktualizovat přes Run a potvrdit novou nativní odměnu.
Rozpracované jiné místní soubory zachovány, pracovní větev opět Android.
