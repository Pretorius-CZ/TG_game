# Ověření interního balíčku 1 — 27. 10. 2026

- `npm test`: 299/299.
- `npm run android:aab`: release build úspěšný; po nahrazení výchozí ikony úspěšně přestavěn.
- `jarsigner -verify`: podpis ověřen. Upload certifikát je záměrně vlastní (self-signed); Play App Signing se nastavuje při nahrání.
- Google bundletool 1.18.3 `validate`: bez chyby. Nástroj stažen z oficiálního google/bundletool release.
- Manifest vyčtený přímo z AAB: `com.playbeyondthesignal.game`, versionCode 1, `0.1.0-internal.1`, minSDK 24, targetSDK 36; není `debuggable=true`.
- OAuth callback: `com.playbeyondthesignal.game://auth/callback`.
- Vlastní AdMob App ID pro UMP, kompilovaná rewarded funkce vybírá `.test.rewardedId`. Produkční ID je pouze součástí konfiguračního objektu, do požadavku se nepředává.
- AAB nemá žádné přibalené `.so` knihovny. Nejde o potvrzení fyzického testu na 16KB zařízení; systémový WebView dodává Android.
- Přibalené lokalizace DE/FR/ES/PT-BR i základ EN/CS; katalogy 2484/2484 v každém z šesti jazyků.
- Běžné `bundleRelease` bez interního přepínače vyzkoušeno: záměrně odmítnuto.
- Oprávnění obsahují INTERNET, ACCESS_NETWORK_STATE, Google AD_ID a AdServices identifikátory/attribution/topics, WAKE_LOCK, FOREGROUND_SERVICE a privátní receiver permission. Tvrzení „nesbírá žádná data“ by nebylo správné.
- Grafika ověřena rozměry, formátem a vizuálně: RGBA 512×512 ikona (44 kB), RGB 1024×500 feature graphic; 4 RGB screenshoty 1080×1920 (každý pod 8 MB).
- Screenshoty pocházejí ze skutečného Android webového sestavení vykresleného lokálně v izolovaném Edge/Chromium. Nejsou to fotografie/fyzické screenshoty telefonu. Seednutý postup slouží pouze zachycení scén v odděleném profilu; statistiky vypnuté, požadavky na Supabase blokované.
- Návrhy popisků EN/CS/DE/FR/ES/PT-BR validované: název do 30 znaků, krátký popis do 80, plný do 4000.

Neověřeno: nahrání do Play, instalace z Play, přihlášení a upgrade právě tohoto release package, Families režim, veřejný Data safety formulář, produkční reklamní provoz. Existující preview APK a UMP byly uživatelem ověřeny samostatně; není to náhrada uvedeného release testu.

AAB SHA-256: `d4187743273020fb1332baf86589dbb26fd306d6727cb2d307a98dc9736800f1`.
