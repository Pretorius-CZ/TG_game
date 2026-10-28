# Google Play — interní balíček 1

**Aktualizace 28. 10. 2026:** aktuální sestavení je internal2 s místním režimem pro mladší/neuvádějící věk. Podrobnosti `android-audience-2026-10-28.md`; ruční cesta odstranění účtu `account-deletion.md`. Starší poznámky o chybějící věkové obrazovce tím nahrazené. Fyzické SDK ověření, Families posouzení a finální prohlášení zůstávají otevřené.

Připraveno 27. 10. 2026. Stav: podepsaný AAB pro interní test, nikoli schválené veřejné vydání.

## Soubory a sestavení

- `releases/google-play/internal-1/beyond-the-signal-internal-1.aab`
- package `com.playbeyondthesignal.game`, versionCode `1`, versionName `0.1.0-internal.1`.
- Šest jazyků, 200 levelů, vlastní AdMob App ID pro publikovanou UMP zprávu, pouze Google demo rewarded jednotka. Nezapíná placené reklamy.
- `npm run android:aab` sestaví webová data, synchronizuje Capacitor a podepíše release AAB. Běžný release bez výslovného `-PinternalTestRelease=true` je zablokovaný.
- Jednorázově `npm run android:upload-key`. Existující klíč ani konfiguraci tento příkaz nepřepíše.
- **Zálohovat šifrovaně mimo tento počítač**: `.local/play-signing/beyond-signal-upload.jks` a `android/key.properties`. Hesla nejsou v Gitu ani veřejném balíčku. Upload key je jiný než app signing key, který při prvním nahrání nastaví Google Play App Signing.

## Až bude registrace účtu opravená

1. Vytvořit aplikaci Beyond the Signal, typ Hra, hlavní jazyk angličtina. Zvolit odpovídající bezplatnou distribuci; placené nákupy současný build neobsahuje.
2. Otevřít Testování → Interní testování a vytvořit vydání. Zapnout Play App Signing podle průvodce a nahrát AAB. Zkontrolovat package, verzi a výpis SDK/oprávnění.
3. Použít poznámky z `release-notes-en.txt`. Přidat nejdřív vlastní účet a dospělé interní testery. Odkaz na přihlášení do testu vznikne až v Play Console.
4. Nainstalovat přes Google Play, nikoli přepsáním preview APK. Preview má `.preview` a samostatné místní úložiště. V nové aplikaci přihlásit stejný Google účet pro přenos cloudového postupu. Energie a zásoba pomůcek jsou místní.
5. Ověřit instalaci, nový účet/hosta, web → Android i Android → web synchronizaci, OAuth návrat do aplikace, restart, zavření/otevření, systémové lišty a návrat z reklamy. Demo odměna jen po události odměny; přerušení a chyba bez odměny. Změnit reklamní souhlas a zkontrolovat, že běžná hra pokračuje.
6. Ověřit upgrade dalšího AAB se stejným upload klíčem a vyšším versionCode. Nikdy neodinstalovávat jen kvůli upgradu, místní zásoby by se smazaly.

Interní test má až 100 testerů. Nenahrazuje uzavřený test požadovaný pro nový osobní účet. Požadavek pro přístup k produkci ověřit v konkrétní Play Console; obvykle jde o 12 průběžně přihlášených testerů po 14 dní. Platit lze za skutečné testování a soukromou zpětnou vazbu, nikoli objednaná veřejná hodnocení.

## Veřejné vydání a děti — nedokončené

Záměr uživatele: hra dostupná všem věkům včetně dětí. Vhodnost příběhu sama neznamená hotové cílení na děti ani automatické PEGI hodnocení. Současný build nemá implementovanou neutrální věkovou obrazovku ani samostatný režim pro dětské přihlášení/statistiky/reklamy.

Před zapojením dětí do testování a před veřejným vydáním dokončit kontrolu Families: věkové skupiny odpovídající skutečnému designu, nakládání s údaji a účty dětí, věkové rozlišení nebo vhodný společný režim, certifikovaná verze reklamního SDK a správné značky žádostí/reklamní filtry pro děti a neznámý věk. UMP souhlas ani odmítnutí samy neřeší věk. Nezaškrtávat všechny věkové skupiny jen kvůli dostupnosti; hra vyžaduje čtení a není zatím ověřená pro nečtenáře.

Dále dokončit Android informace o soukromí, ověřit Data safety podle skutečných SDK a síťových přenosů, zavést požadovaný postup odstranění vytvořeného účtu v aplikaci i na webu a prověřit ho. Reset postupu není odstranění účtu. Současný kontakt e-mailem není potvrzení splnění požadavku Play na in-app odstranění účtu.

Teprve poté nastavovat produkční jednotku AdMob, propojení s obchodem a kontrolu připravenosti aplikace. Schválený AdMob účet není schválení konkrétní aplikace. AdSense/H5 pro web je samostatná integrace.

## Oficiální podklady

- [Interní testování](https://support.google.com/googleplay/android-developer/answer/9845334?hl=en)
- [Požadavky testování osobních účtů](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)
- [Cílové publikum](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en)
- [Families](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en)
- [Data safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en)
- [Grafické podklady](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
