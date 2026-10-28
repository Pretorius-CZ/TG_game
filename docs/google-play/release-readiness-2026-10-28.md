# Google Play — připravený balíček 28. 10. 2026

## Hotovo nyní

- Aktuální schválená ikona, feature graphic a pět 1080 × 1920 screenshotů.
- Popisky pro šest jazyků, oddělená pole title/short/full pro vložení do Console.
- Anglické zadání testerům a český postup koordinace uzavřeného testu.
- IARC podklady podle současného příběhu a funkcí; konečné odpovědi závisí na otázkách Console.
- Aktualizovaný inventář Data safety a read-only SQL pro ověření názvů Google Auth metadata.
- Připnuté již otestované Mobile Ads 25.4.0 a UMP 4.0.0; žádná změna pravidel hry.

## Co čeká na externí krok

1. Dokončení registrace Play účtu: stále řeší podpora Googlu.
2. Spustit auth-metadata-audit.sql v Supabase SQL Editoru; sdílet stačí seznam názvů polí, ne osobní data. Dotaz nic nemění. Nemáme administrátorské připojení, proto jej nelze označit za provedený.
3. Uzavřít zbylé položky Data safety (přesný SDK disclosure, podtypy diagnostiky a role country.is), Families a skutečný IARC dotazník před uzavřeným testem.
4. Po zpřístupnění Console nahrát aktuální podepsaný AAB internal.3, nejprve ověřit instalaci a upgrade přes Play a release návrat Googlu. Dosavadní preview APK má jiné package ID.
5. Teprve potom domluvit start a rozeslat skutečné opt-in odkazy uzavřeného testu. Nebyla objednána služba ani nikdo kontaktován.

## Artefakty

Generování: scripts/create-play-art.py a scripts/capture-play-store.mjs s výstupem releases/google-play/store-kit-2026-10-28/assets; zabalení a kontrola scripts/package-play-store-kit.py.

Současný podepsaný AAB je v releases/google-play/internal-3/beyond-the-signal-internal-3.aab. Není uvnitř balíčku textů/grafiky. Soukromý podpisový klíč ani hesla do něj nepatří.

Screenshoty jsou aktuální skutečné UI z lokálního sestavení dist-android v izolovaném prohlížeči Edge, viewport 360 × 640 při 3× rozlišení. Nejde o fyzický screenshot telefonu ani potvrzení testu přes Play. Postup v náhledu byl nasazen jen pro ukázání scén, ne hrán testerem. Věková volba je z čistého profilu bez předvýběru. Nepřidávaly se překreslené ovládací prvky ani sliby budoucích funkcí.

Popisky zůstávají návrhem pro současné demo reklamy; před ostrým vydáním je potřeba upravit stav reklamy podle skutečného buildu. Žádný formulář ani release nebyl touto přípravou odeslán do Play.
