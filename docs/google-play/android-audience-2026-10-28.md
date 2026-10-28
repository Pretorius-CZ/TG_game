# Android: místní režim a věková volba — 28. 10. 2026

Uživatel výslovně schválil první dětskou verzi bez reklam, Google přihlášení a odesílání statistik, s místním postupem. Pro technický první návrh používáme skupiny méně než 18 / 18 a více / nechci uvést. Nejde o finální rozhodnutí o všech věkových skupinách cílení ani o ověření souladu v každé zemi; místní věkové hranice a skutečné cílení se před publikací ještě posuzují.

## Implementace

- AndroidAudienceGate se zobrazuje před AccountProvider a herními analytickými efekty. Všechny možnosti jsou stejně zobrazené, bez předvolby a bez slibu odměny za volbu dospělého. Základní hra dostupná v každé skupině. Ukládá se jen verze + skupina do místního úložiště, žádné datum narození ani odeslání věkové skupiny.
- Neznámá, poškozená nebo nedostupná volba neopravňuje online služby. Méně než18 a neuvedený věk používají lokální režim. Chyba zápisu nabízí lokální režim pouze pro aktuální běh, včetně ochrany před starou uloženou volbou dospělého.
- Supabase Auth pro neznámý/místní režim nepersistuje relaci a nemá auto-refresh. AccountProvider neobnovuje účet a neinstaluje native OAuth listener. Staré účty a jejich uložené místní kopie se nemažou ani automaticky nepřevádějí do hosta.
- analyticsAllowed má skutečnou kontrolu režimu, ne jen skrytý souhlas. Uploady, presence, country lookup a volitelné souhlasy tak nefungují ani s dřívějším granted. Automatické opakování starých žádostí o smazání statistik se v tomto režimu rovněž nespouští. Volba místního režimu vypne statistiky a vyprázdní volitelné fronty, ne herní postup.
- Reklamní nabídky jsou zablokované v rewardAvailable i přímo v androidMovesAd/androidPrivacy před UMP a Mobile Ads voláním. Není automatická odměna zdarma ani změna tahů, energie nebo zásob. Dostupné pomůcky fungují nadále a všechny levely zůstávají přístupné běžným postupem.
- Nastavení nabízí věkovou volbu znovu s upozorněním na ztrátu neuložené minihry. Po uložené změně se aplikace obnoví, aby nevycházela ze starého Auth klienta. Dospělá volba sama nepovoluje statistiky ani neuděluje reklamní souhlas.
- Webová hra se věkovou obrazovkou nemění; politika je omezená na Android mode.

## Kontroly

302 unit testů, 19 Android-mode browser testů: skutečný vstup do minihry a zachování místního postupu po reloadu, starý Google token a legacy analytics-granted bez síťových požadavků v neznámém/místním režimu, selhání zápisu nad starou adult volbou, 6 jazyků na320px, dospělé PKCE přihlášení a testovací reklamy viewed/dismissed/error. Kontaktní stránka: 12 mobilních kontrol v6 jazycích s/bez JS. Zkompilované AAB internal2 a APK.

To je kontrola aplikace v prohlížeči s Android build mode a nativním buildem. **Není to hotová certifikace Families ani zachycení všech síťových přenosů nativního SDK na telefonu.** AdMob plugin load podle zdrojů nevolá MobileAds.initialize; manifest má DELAY_APP_MEASUREMENT_INIT=true. Před publikací ověřit na fyzickém zařízení také nativní síťový provoz při čistém startu bez volby a při místním režimu, i po předchozím dospělém použití reklamy. Podle výsledku případně odložit/omezit také nativní SDK registraci nebo zvolit samostatný build bez SDK.

Dále: posouzení cílových věkových skupin a regionů, IARC, Data safety včetně SDK disclosure, odkaz na živou žádost o smazání a ověření ručního smazání na zvlášť založeném testovacím účtu. Play registrace stále čeká na podporu (uživatel potvrdil28.10.). Placené reklamy nejsou zapnuté. Žádné herní účty ani data hráčů se při této práci nesmazaly.

Oficiální pravidla: https://support.google.com/googleplay/android-developer/answer/9893335?hl=en a https://support.google.com/googleplay/android-developer/answer/9867159?hl=en .
