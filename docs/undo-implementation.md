# Krok zpět — implementace 2026-10-23

Uživatel zadal implementaci pro Android i web. Pravidlo první verze:
jedna dokončená dobrovolná reklama umožní vrátit jeden poslední běžný tah
za pokus. Žádná nová cena, nákup, zásoba pomůcek ani změna limitů levelů.

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
