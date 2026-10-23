# Android na novém PC — 2026-10-22

Aktuální pracovní větev je `codex/android-current`, založená na současném
webovém zdroji `e1dc9cd`. Ze starší `codex/google-play` / `d1fa153` převzaty
nativní podklady a testovací AdMob adaptér; celé staré herní komponenty se
nevracely. Nové opravy, 200 levelů, přesouvání náloží, rezonátory, bonus za
kaskádu, ochrana energie i pravidla souhlasu se statistikami jsou zachované.
Nasazený web se touto pracovní větví nemění.

## Připraveno a ověřeno

- Capacitor 8.5.3, CLI 8.4.3, AdMob plugin 8.2.1; pouze oficiální Google
  demo App ID a rewarded jednotka. Release úlohy jsou záměrně blokované.
- `npm run android:apk` opravdu dokončilo nativní Gradle kompilaci:
  `BUILD SUCCESSFUL`, 125 úloh, první sestavení přibližně 4 minuty.
- Výstup `android/app/build/outputs/apk/debug/app-debug.apk`, 49 107 016 B
  (46,8 MiB). Debug applicationId `com.playbeyondthesignal.game.preview`,
  verze `0.1.0-preview`; min SDK 24, target SDK 36, portrét.
- Hra je přibalená v aplikaci. `dist-android` obsahuje pouze herní HTML,
  potřebné obrázky a zvuky, bez dashboardu, webových článků a zdrojových
  ilustrací. Android HTML neobsahuje ověřovací značku AdSense.
- 259 unit testů a kontrola lokalizace prošly. Android Vite build, sync
  i standardní webový build prošly. Chromium ověřilo EN/CS úvod, nastavení,
  místní hraní a vstup do první opravy. Dalších 16 Chromium testů pro
  přístupnost a webové reklamy prošlo, včetně pokračování stejné desky.
- Npm audit po kompatibilních aktualizacích bez nálezů. Vite 8.3.5 a
  source-map-js opravené v rámci původních povolených verzí.

Jde zatím o sestavený balíček, nikoli ověřené hraní nebo reklamu na fyzickém
telefonu. Připojené zařízení ADB při kontrole zatím nenašlo.

## Místní nástroje

Nové Android Studio Rabbit 1 / 2026.2.1 dodává JBR 25. Ten nelze použít
se zděděným Gradlem 8.14.3. Pro tento projekt je připravena přenosná Java 21
z oficiálního Microsoft OpenJDK v `.local/jdk21/`. Systémová Java ani globální
JAVA_HOME se neměnily. SDK je v obvyklé místní cestě Android/Sdk.

`scripts/android-environment.mjs` hledá JAVA_HOME nebo přenosnou Javu,
ověřuje kompatibilitu 21–24, SDK 36 a Build-Tools 36.0.0. Samotný AGP si při
první kompilaci doplnil také svou výchozí verzi Build-Tools 35.0.0.
`android-build.mjs` předává prostředí Gradlu a vytváří ignorované místní
`android/local.properties`, `.gradle/config.properties` a `.idea/gradle.xml`.
Android Studio má použít `GRADLE_LOCAL_JAVA_HOME` z tohoto nastavení.

Tyto strojové cesty, JDK, buildy a podepisovací klíče nepatří do Gitu.
Při přesunu na jiný PC je připrav znovu a spusť `npm run android:doctor`.

## Teď v Android Studiu

1. Na úvodní obrazovce Open, vybrat složku `telegram_hra/android`.
2. Potvrdit důvěru vlastnímu projektu a nechat dokončit Gradle sync.
3. Pokud IDE nenajde JDK samo, v nastavení Build Tools → Gradle vybrat
   `GRADLE_LOCAL_JAVA_HOME`, případně místní `.local/jdk21/jdk-21…`.
4. Po načtení projektu použít Pair Devices Using Wi-Fi v nabídce zařízení.
   V telefonu zapnout bezdrátové ladění a párovat QR kódem nebo párovacím kódem.
   PC na LAN a telefon na Wi-Fi stejné místní sítě jsou použitelné;
   hostovská síť nebo izolace klientů může bránit spojení.
5. Až ADB uvidí spárovaný telefon, spustit konfiguraci app / Run.

## Co náhled zatím nabízí

Místní ukládání hosta, bez Google přihlášení a bez převodu webových zásob.
Viditelné vysvětlení v nastavení; odkaz na skutečný kontakt a soukromí.
Statistiky se i zde sbírají až po dobrovolném souhlasu. Testovací kampaň
`googleplay / android_preview / current_device_test` rozlišuje Android
náhled, ale nedokazuje instalaci z obchodu ani nepoužívá Install Referrer.

Nativní testovací reklama je pouze za +5 tahů, jednou za pokus; odměna až
po Rewarded a pokračování až po Dismissed. Zavření bez odměny, výpadek či
chyba nepřidávají tahy. Chybu převzetí lze opakovat bez další reklamy.
Před načtením probíhá UMP. Doplnění energie, pomůcek a další nápověda
zatím nejsou v Android náhledu nabízené, první bezplatná nápověda zůstává.

Na telefonu zbývá ověřit hraní a uložení po ukončení, pozadí, systémové
Zpět, výřezy/lištové okraje, výkon, zvuk a skutečný testovací reklamní dialog.
Potom řešit Google přihlášení, obnovu postupu a teprve následně podepsané
AAB, vlastní grafiku, AdMob/Play nastavení a uzavřený test. AdSense webové
schválení tyto kroky nenahrazuje. Žádný release ani upload do Play neproveden.

Zdroje:
- https://docs.gradle.org/current/userguide/compatibility.html
- https://developer.android.com/build/jdks
- https://learn.microsoft.com/en-us/java/openjdk/download
- https://developer.android.com/studio/run/device

## První fyzický test a systémové lišty — 2026-10-22

POCO F7 (24117RK2CG) se spárovalo přes Wi-Fi s PC na LAN. Instalace nejprve
selhala s INSTALL_FAILED_USER_RESTRICTED; volba Instalace přes USB je v
HyperOS potřebná i při bezdrátovém ADB. Hra pak běží a uživatel potvrdil
uložení první opravy po zavření a opětovném spuštění. Úvodní nabídka
statistik není slepý test.

Na snímku čas a stavové ikony překrývaly název hry a Nastavení. Příčina:
viewport-fit=cover umožňuje obsah pod lištami, ale všechny obrazovky hry
nemají jednotnou CSS správu nativních okrajů. Jen v Android buildu se proto
viewport-fit=cover odstraní. Použitý Capacitor 8.5.3 pak uplatňuje systémové
lišty a výřez jako nativní padding okna. Platí i pro dialogy, úvod a dostupnou
výšku WebView. Webový viewport zůstává původní. SystemBars style DARK dává
světlé ikony, postSplashScreenTheme přechází na tmavý aplikační motiv.

Opravné APK úspěšně sestavené; ověřeno Android HTML, nativní config a
nezměněný webový viewport-fit. Před potvrzením skutečného vzhledu je nutné
aktualizaci spustit přes Run na telefonu. Aplikace se v této opravě sama
neodinstalovávala a její data se nemazala. Sestavovací pomocník už také
nepřepisuje existující IDE Gradle nastavení při každé kompilaci; počáteční
mapování modulů používá skutečné cesty do node_modules.

## Možnost předběžného přístupu na Google Play — 2026-10-22

Uživatel upozornil na možnost přidat hru na Google Play rovnou do
předběžného přístupu (Early Access), podle jeho informace jde o novinku.
Zahrnout tuto variantu do plánování vydání Android hry. Před volbou
publikačního postupu ověřit aktuální dostupnost a podmínky pro náš účet
v Play Console, včetně vztahu k otevřenému/uzavřenému testování.
Jde o zaznamenaný podnět uživatele, zatím bez ověření a bez publikace.

## 2026-10-23 — Google účet připravený k fyzickému testu

Předchozí poznámka o verzi pouze pro hosta již pro nové APK neplatí.
Přidáno Google OAuth přes systémový prohlížeč, návrat do aplikace pomocí
PKCE a cloudové ukládání stejného účtu jako na webu. Host zůstává oddělený,
převzetí výslovné. Energie/pomůcky místní; přihlášení nevytváří nový starter
balíček. Uživatel potvrdil obě Supabase Redirect URLs. 275unit,4AndroidUI
s mockovaným OAuth/backendem,9regresí produkčníhoAndroidbundle aAPK pass.
Finální debug APK49587184B sestaveno23.10.2026 19:27. ŽivýGoogleprůchod
naPOCO a skutečný přenos telefon↔web čekají na fyzický test poRun.
Postup a omezení: docs/android-google-cloud.md. Žádné novéSQL, webovýdeploy,
změna ostrýchreklam nebo publikace naGooglePlay.

## 2026-10-23 — Doplnění boostů za reklamu

Android rewardPolicy povolovala pouze tahy a Undo, takže prázdné boosty
byly šedé. Povoleno také helper: stejný nativní AdMob tok připíše jeden
vybraný boost až po dokončení reklamy a zavření celé obrazovky. Nabídka
má vlastní EN/CS titulek a vysvětlení následného ručního použití.
Zůstává jedno reklamní doplnění boostu na pokus; vlastní zásoba jiných
boostů je použitelná dál. Přihlášení nevytváří novou zásobu.
Nejde o nákup za peníze; stále oficiální testovací reklamní jednotka.
275 unit testů a 6 Android UI testů s mockovaným reklamním adaptérem
(EN/CS × dokončení/zavření/chyba) prošlo, debug APK sestaveno.
Fyzické zobrazení reklamy ověří uživatel po aktualizaci přes Run.
