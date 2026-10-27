# app-ads.txt pro AdMob

Vývojářský web: https://playbeyondthesignal.com/
Soubor: https://playbeyondthesignal.com/app-ads.txt

Obsah public/app-ads.txt:

```
google.com, pub-4627613906098117, DIRECT, f08c47fec0942fa0
```

Publisher ID odpovídá uživatelem doloženému App ID a reklamní jednotce
AdMob. Je stejné jako v dosavadním webovém ads.txt; soubory mají odlišný
účel a oba musí zůstat dostupné. Nevkládat App ID s vlnovkou ani ID jednotky
s lomítkem do app-ads.txt. Běžný Vite webový build kopíruje soubor do kořene
dist; Android APK tento webový soubor nepotřebuje.

Samotné zveřejnění souboru neověří nezveřejněnou aplikaci a nezapne ostré
reklamy. Google hledá vývojářský web z veřejného záznamu aplikace v obchodě.
Po vyřešení registrace Play Console a zpřístupnění záznamu:

1. Do kontaktních údajů aplikace v Google Play zadat vývojářský web
   https://playbeyondthesignal.com/ (nikoli URL souboru ani game. subdoménu).
2. Propojit správný záznam aplikace s AdMob.
3. V AdMob Aplikace → Zobrazit všechny aplikace → app-ads.txt ověřit stav.
   Při nabídnutém Ověřit aplikaci → Zkontrolovat aktualizace požádat o kontrolu.
4. Po změně webu v Google Play může detekce trvat až 24 hodin; následné
   ověření a kontrola připravenosti aplikace jsou samostatné procesy.

Zdroje (ověřeno 27. 10. 2026):
- https://support.google.com/admob/answer/9363762
- https://support.google.com/admob/answer/14538460
- https://developers.google.com/admob/android/app-ads
