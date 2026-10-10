# Android / Google Play — první technický náhled

Stav 10. 10. 2026, pracovní větev `codex/google-play`. Nejde o verzi připravenou
k publikování. Web a Bounty zůstávají ve svém buildu; Android nepoužívá jejich
simulované reklamní okno. Schvalování účtu AdMob ještě probíhá.

## Hotová příprava

- Capacitor 8, nativní projekt `android/`, compile/target SDK 36, min SDK 24.
- Pracovní applicationId `com.playbeyondthesignal.game`, debug má příponu
  `.preview`. Definitivní ID potvrdit před prvním publikováním. Verze 0.1.0-preview.
- `npm run build:android` sestaví pouze hru do `dist-android`, bez statistik,
  uvítací stránky, prototypů a zdrojových PNG scén. WebP scény, mapové PNG,
  dlaždice a zvuky se přibalují. Aktuálně cca 35,3 MiB bez nativních knihoven;
  není to změřená velikost APK ani download z Google Play.
- `npm run android:sync` zkopíruje sestavení a synchronizuje nativní pluginy.
- `@capacitor-community/admob` používá oficiální Google demo App ID a rewarded
  jednotku. Žádné produkční ID ani platební údaje nejsou v projektu.
- +5 tahů jednou za pokus až po události Rewarded, pokračování po zavření
  reklamy; samotné zavření nedává odměnu. Chyby nedávají náhradní bonus.
  Při chybě převzetí odměny lze v témže dialogu opakovat převzetí bez další reklamy.
- Android nemá reklamní doplnění energie, pomůcek ani nápovědy. Běžná obnova,
  počáteční zásoba pomůcek a první bezplatná nápověda zůstávají.
- Před inicializací reklam probíhá UMP a kontrola `canRequestAds`. Nastavení
  obsahuje vstup do soukromí reklam. Native consent a reklamní okno dosud
  nebyly ověřeny na zařízení; testovací ID není záruka dostupné reklamy.
- Android náhled je pouze host s místním postupem. Nefunkční webový Google
  OAuth není nabízen; přihlášení se doplní jako samostatný krok.
- Stávající pseudonymní analytika je zachovaná, zdroj Android testů je
  `googleplay / android_preview / initial_test`. Nejde o ověřenou instalaci
  z obchodu ani měření akvizice přes Play Install Referrer.
- Release Gradle úlohy jsou blokované proti omylu. Webový Pages workflow
  je omezen i při ručním spuštění na `codex/cockpit-stage`.

## Jak sestavit a spustit

1. Nainstalovat Android Studio Otter 2025.2.1 nebo novější a JDK 21
   (lze použít vhodné `jbr` dodané s Android Studiem).
2. V SDK Manageru doplnit Android SDK Platform 36 a Android SDK Build-Tools.
3. Nastavit `JAVA_HOME` na JDK a `ANDROID_HOME` na SDK; otevřít nový terminál.
4. `npm run android:doctor` prověří nástroje.
5. `npm run android:apk` na Windows vytvoří debug APK, po úspěchu v
   `android/app/build/outputs/apk/debug/app-debug.apk`.
6. Alternativně `npm run android:sync` a `npm run android:open`, potom Run
   v Android Studiu na telefonu s USB debugging nebo v emulátoru.

Tento počítač má podle kontroly Java 8, nemá SDK platform 36 ani Build-Tools.
APK/AAB proto zatím nebylo sestaveno. Nezaměňovat úspěšný Vite build a Capacitor
sync za ověřenou nativní kompilaci nebo funkční reklamu na telefonu.

## Ověření

- 181 unit testů prošlo. Nové testy: povolené odměny podle platformy,
  odměna versus zavření, duplicita události, chyba načtení/zobrazení,
  čekání na zavření před obnovením hry a odstranění listenerů.
- Webový i Android Vite build a Capacitor sync prošly.
- Izolovaný prohlížeč: Android bez nativní reklamy nepřidá tahy; ostatní
  odměny se neotevřou; nejsou nabízeny Google přihlášení ani doplnění zásoby;
  bezplatná nápověda zůstává. Síťové zápisy při této kontrole blokované.
- Závislosti: npm audit po úpravě CLI a source-map-js bez nálezů.

## Před ostrým vydáním zbývá

- Skutečný native build, telefon/emulátor, test reklamy a UMP; stabilita při
  zamčení, pozadí, systémovém Zpět a znovuvytvoření procesu, výkon a safe areas.
- Dotáhnout nativní přihlášení, přenos a obnovu postupu; rozhodnout a ověřit
  ukládání rozehrané desky. Zatím její stav při ukončení aplikace nepersistujeme.
- Finální ikona/splash (zatím výchozí Capacitor), podpis, applicationId,
  verzování, aktuální Play podmínky a testování 16KB paměťových stránek.
- AdMob schválení, vlastní App ID a rewarded ad unit, UMP zprávy,
  app-ads.txt a fyzické otestování. Testovací jednotky nepřepínat na ostré
  při lokálním hraní vývojáře; používat testovací zařízení.
- Soukromí, Data safety, mazání účtu (pokud bude účet), Play metadata,
  uzavřený test a posouzení produkčního přístupu.
- Až po těchto kontrolách cíleně nahradit demo ID, upravit popisky a odblokovat
  release. Fungující reklama za tahy je uživatelem stanovená podmínka vydání.

Zdroje: https://capacitorjs.com/docs/updating/8-0,
https://github.com/capacitor-community/admob,
https://developers.google.com/admob/android/rewarded,
https://developers.google.com/admob/android/privacy.

## Převzetí na novém PC — 10. 10. 2026

Instalaci nástrojů odkládáme na nový PC. Zdrojová větev je `codex/google-play`, web zůstává na `codex/cockpit-stage`.

1. Nainstalovat Git, Node.js 24 LTS, Android Studio, JDK 21 a SDK Platform 36 + Build-Tools podle postupu výše.
2. Přihlásit Git ke GitHubu a obnovit projekt:

```powershell
git clone https://github.com/Pretorius-CZ/TG_game.git
cd TG_game
git switch codex/google-play
npm ci
npm run android:doctor
npm test
npm run android:sync
npm run android:open
```

3. Připojit telefon s USB debugging a vytvořit první debug APK. Ověřit reklamu: dokončení přidá +5 tahů jednou; zavření bez odměny ani chyba tahy nepřidají. Ověřit souhlasy a návrat do hry.
4. Zkontrolovat schválení AdMob; produkční ID a vydání řešit následně.

Git zálohuje kód a dokumentaci, nikoli node_modules, buildy, .local ani soubory prostředí. Potřebné lokální nastavení přenést samostatně bezpečnou cestou, tajné údaje necommitovat. Podpisový klíč zatím nebyl vytvořen. Lokální postup hosta v prohlížeči se klonováním repozitáře nepřenese. APK dosud nebylo sestaveno ani ověřeno na telefonu.
