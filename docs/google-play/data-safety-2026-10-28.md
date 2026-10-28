# Google Play — věkové skupiny a Data safety

Podklad z 28. 10. 2026 pro Android `0.1.0-internal.2`, versionCode2.
**Pracovní návrh pro ruční vyplnění, nikoli odeslaný formulář.** Play účet zatím čeká na podporu. Nezapíná se produkční reklama ani se nemění hra.

## 1. Cílové publikum — schváleno uživatelem 28. 10. 2026

| Skupina v Play Console | Návrh | Důvod v naší hře |
|---|---|---|
| 5 a méně | Nezahrnovat nyní | Příběh a cíle vyžadují čtení, omezené tahy a plánování; hra není navržená pro nečtenáře. |
| 6–8 | Zatím nezahrnovat | Dosud nemáme přizpůsobený ani ověřený průchod začínajících čtenářů. Nejde o závadnost obsahu. |
| 9–12 | Schváleno zahrnout | Prostorové spojování, plánování oprav a postupné čtení příběhu. Vyžaduje dokončení posouzení Families a vhodnosti pro tuto skupinu. |
| 13–15 | Schváleno zahrnout | Logické úkoly a delší sci-fi příběh. |
| 16–17 | Schváleno zahrnout | Stejná hra, místní režim bez online služeb. |
| 18 a více | Schváleno zahrnout | Celá hra; dobrovolné cloudové ukládání, statistiky a odměňované reklamy. |

Uživatel 28. 10. 2026 výslovně schválil cílení od 9 let: 9–12, 13–15, 16–17 a 18+. Jde o schválené zadání pro cílové skupiny, ne automatické věkové hodnocení ani rozhodnutí blokovat mladší hráče. V aplikaci se minimální věk hraní nenastavuje. Provozní rozdělení pod18/18+ chrání online funkce; nenahrazuje deklaraci cílových skupin, regionální posouzení ani IARC dotazník. Původní záměr uživatele zpřístupnit nezávadnou hru všem zůstává zaznamenaný; tabulku dosud nevybral v Play Console.

[Google: cílové skupiny a vhodnost pro věk](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en).

## 2. Souhrn odpovědí do formuláře

| Otázka | Připravená odpověď / stav |
|---|---|
| Sbírá nebo sdílí aplikace data? | **Ano.** Dospělý může použít Google, cloud, statistiky a reklamu. Místní režim tuto odpověď nemění. |
| Vytváření účtu | **Ano, Google OAuth** přes Supabase, volitelně v dospělém režimu. Základní hra funguje bez účtu. |
| Způsob odstranění účtu | **Žádost**, v nastavení účtu odkaz na veřejnou stránku; vyřízení správcem po ověření vlastnictví. Není okamžité automatické smazání. Na zvláštním testovacím účtu uživatel28.10. ověřil odstranění Auth i cloudového save (oba dotazy bez řádků). |
| Web pro odstranění | https://playbeyondthesignal.com/contact.html#delete-account — nasazeno a ověřeno. |
| Samostatné odstranění statistik | Ano, Nastavení → Vypnout a smazat moje statistiky pro identitu tohoto zařízení/adresy; offline žádost čeká na opakování. |
| Soukromí | https://playbeyondthesignal.com/privacy.html — živá Android sekce a šest jazyků. |
| Šifrování při přenosu | **Návrh ano**: vlastní síťové adresy jsou HTTPS, AdMob uvádí TLS. Před odesláním ověřit celý finální build a všechny poskytovatele. Nejde o tvrzení end-to-end šifrování. |
| Nezávislé bezpečnostní ověření | **Ne.** Automatické testy a PCAPdroid nejsou certifikace MASA. |
| Reklamy | **Ano**, odměňované reklamy pro dospělé, aktuálně pouze Google demo jednotka. |
| Nákupy | Nejsou implementované. Nezaměňovat reklamu za in-app platbu. |

Samotná interní testovací větev má výjimku z Data safety formuláře; tento podklad připravujeme pro uzavřené/veřejné vydání. U formuláře se zohledňuje celý rozsah distribuovaných verzí, nikoli jen dětská cesta. [Pokyny Play Data safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en).

## 3. Inventář dat pro výběr kategorií

Účely níže popisují naši implementaci. „Volitelné“ znamená návrh podle dostupného hraní bez online funkcí; zvlášť u nativních SDK musí být možnost vyhnout se sběru ověřená pro všechny distribuované varianty a regiony.

| Kategorie ve formuláři | Co konkrétně máme | Collected | Shared | Účel / volitelnost / stav |
|---|---|---|---|---|
| Personal info → Email address | E-mail Google účtu v Supabase Auth | Ano při přihlášení | Návrh ne pro čistě zpracovatelský tok; viz poznámka A | Account management, App functionality; volitelné přihlášení. |
| Personal info → Name | Jméno/profil, pokud je Google předá do Auth metadata | Návrh ano | Stejně jako e-mail | Account management; volitelné. Ověřit názvy skutečných metadata polí na testovacím účtu, nejen to, že UI ukazuje pouze e-mail. |
| Personal info → User IDs | Supabase user ID a návaznost cloudového save | Ano | Backend jako poznámka A; zvlášť ověřit případné account identifiers reklamního SDK | Account management, App functionality; volitelné přihlášení. Neodesíláme Supabase ID přímo do reklamního adaptéru. |
| Device or other IDs | Náhodný reporting ID pro statistiky; AdMob může používat advertising/app-set identifikátory | Ano podle zapnuté funkce | Ano pro reklamní SDK; backend jako A | Naše statistiky: Analytics; reklamní tok: Advertising or marketing, Analytics, Fraud prevention/security. Volitelnost nativní části před finálním vyplněním zkontrolovat. |
| App activity → App interactions | Návštěvy, aktivní časy, kliknutí/zhlédnutí reklamního SDK | Ano podle funkce | Ano pro reklamní SDK; backend jako A | Naše měření Analytics; reklamní tok účely uvedené výše. Naše statistiky jen po explicitním povolení. |
| App activity → Other actions | Výsledky levelů, tahy, délka pokusu, použitá pomoc; cloudový postup, hvězdy a deník | Ano podle funkce | Do backendu jako A | Statistiky: Analytics; cloud: App functionality. Statistiky a přihlášení jsou oddělené volby. Herní pokusy nejsou anonymní jen proto, že nemají jméno. |
| Location → Approximate location | Kód země z api.country.is při statistikách; AdMob může odvozovat oblast z IP | Ano podle funkce | Reklamní SDK ano; country.is zvlášť ověřit, nepředpokládat A | Statistiky Analytics; reklamní tok reklamní/analytické/bezpečnostní účely. Nepoužíváme GPS oprávnění. |
| App info and performance → Diagnostics | AdMob výkonové údaje; případné technické údaje v našem hlášení chyb | Návrh ano v reklamní cestě | Ano v reklamní cestě | Podle disclosure konkrétní verze SDK. „Chyba při hraní“ není automaticky crash log. |
| App info and performance → Crash logs / Other app performance data | Nemáme vlastní Crashlytics/Sentry ani sběr stack trace pádů | Zatím neurčeno pro SDK | Zatím neurčeno pro SDK | Nezaškrtávat tyto podtypy automaticky jen z obecného slova Diagnostics; dořešit verzi SDK a její disclosure. |
| Personal info → Other info / Photos | Auth profil může obsahovat avatar URL; hra fotografii nenahrává | Otevřená klasifikace konkrétních metadata | Otevřené | Ověřit na testovacím účtu. Samotný profilový URL není důkaz, že naše aplikace sbírá obrazové soubory; nevyplnit ale bez kontroly „žádný profil“. |

**A — backend není automaticky „Shared“ jen proto, že jde o cizí server.** Výjimku pro zpracovatele lze použít pouze pro zpracování naším jménem a podle našich pokynů. Před označením Shared=No pro Supabase potvrdit odpovídající podmínky a účel. Naopak reklamní tok je podle Google disclosure sdílení; nepoužít plošně výjimku pro všechny dodavatele. [Supabase DPA](https://supabase.com/legal/customer-resources/data-processing-addendum), ověřené28.10., výslovně popisuje Supabase jako processor/service provider. To podporuje navrženou backendovou výjimku při použití standardních podmínek pro náš projekt; nejde o výjimku pro reklamní SDK. [country.is](https://country.is/) uvádí, že požadavky neloguje, a popisuje MaxMind/Cloudflare zdroje. Vlastní smluvní roli poskytovatele ani všechny infrastrukturní logy jsme tím neověřili; jeho Shared klasifikaci proto nepřevádět automaticky na „ne“.

Další kategorie: naše hra nečte kontakty, SMS, kalendář, mikrofon, zdravotní či platební data ani seznam nainstalovaných aplikací. Nemá interní chat, hledání nebo přístup k historii prohlížeče. Podmínky a chování reklamních SDK je třeba zahrnout zvlášť; seznam oprávnění sám nenahrazuje inventář dat. Podpora e-mailem se otevírá v externím poštovním klientu; hra poštu nečte.

Místní věková skupina, energie, zásoby a místní save se samy neodesílají. Cloud a statistiky jsou jiné toky. Cloudové a analytické záznamy nejsou jen krátké zpracování v paměti: ukládají se. U reklamního poskytovatele bez ověření netvrdit ephemeral=Yes.

## 4. SDK a doklady

- `@capacitor-community/admob`8.2.1; Gradle releaseRuntimeClasspath ověřeno28.10.: **Google Mobile Ads25.4.0**, **UMP4.0.0**. Zdrojový plugin používá dynamický požadavek25.4.+; další sestavení může být jiné. Před finálním vydáním zachytit a případně připnout ověřenou verzi. Tímto podkladem se žádná závislost nemění.
- [Google Mobile Ads disclosure](https://developers.google.com/admob/android/privacy/play-data-disclosure) nyní výslovně popisuje nejnovější Legacy SDK25.5.0. Uvádí přenos IP, interakcí, diagnostiky a identifikátorů pro reklamní, analytické a bezpečnostní účely a šifrování TLS. **Není to nezávislé ověření verze25.4.0 v našem AAB.** Tabulka je pracovní konzervativní podklad, rozdíl verze je otevřený bod před odesláním.
- UMP není souhlas s naší analytikou a věková volba není UMP souhlas. [Google UMP](https://developers.google.com/admob/android/privacy/gdpr).
- Naše zdroje: `src/Account.jsx`, `src/supabase.js`, `src/useProgressSave.js`, `src/analyticsPrivacy.js`, `src/campaignTracking.js`, `src/countryTracking.js`, `src/androidAudience.js`, `src/androidAds.js`, `src/analyticsDeletion.js`; retence a cascade viz SQL001/033 a již nasazené veřejné soukromí.

## 5. Retence a smazání — údaje pro kontrolora

Cloudový postup a Auth účet odstraní správce na ověřenou žádost; reset hry není odstranění účtu. Ruční odstranění bylo28.10. ověřeno na vyhrazeném testovacím účtu: po smazání Auth uživatele nebyl nalezen ani auth.users účet, ani game_progress řádek. Podrobná analytika má90dní plus doběhnutí denního cleanupu; lokálně max.2000 pokusů a prořezání po spuštění. Smazání analytiky přes zařízení je jiné než smazání Google herního účtu. Bezpečnostní revokace, provozní logy a zálohy mají účely a retence popsané v soukromí/poskytovateli; neslibovat, že tlačítko smaže všechny kopie všech partnerů okamžitě.

## 6. Co zbývá před odesláním formuláře

1. Cílové skupiny jsou uživatelem potvrzené (9–12,13–15,16–17,18+); dokončit Families/regionální posouzení a přesný IARC dotazník. Žádná konkrétní PEGI/ESRB známka se nyní neurčuje.
2. Ověřit přesná Auth metadata na odděleném testovacím účtu. Ruční odstranění Auth a cloudového save už je ověřené; celá e-mailová cesta žádosti není tímto databázovým testem samostatně ověřena. Není potřeba posílat hesla ani tokeny.
3. Sjednotit disclosure s přesnou finální verzí Mobile Ads/UMP v AAB; dořešit diagnostické podtypy a případné account identifiers.
4. Potvrdit použitelnost standardního Supabase DPA pro projekt a dořešit roli country.is. Jeho webové tvrzení o nelogování samo neřeší všechny právní role. Pak uzavřít Shared/Optional/Ephemeral u sporných řádků.
5. Zkontrolovat formulář i build před uzavřeným testem. Žádný CSV import se nyní nevytváří ani nespouští; nesmí přepsat odpovědi neověřenými hodnotami.

Telefonní PCAPdroid kontrola: dítě bez zachycených spojení hry; dospělý s reklamou se spojeními hry; po přepnutí zpět a úplném ukončení opět dítě bez zachycených spojení hry. Jde o uživatelské pozorování při třech průchodech, ne certifikaci ani rozšifrovaný obsah přenosu. Provoz systémových služeb a všechny možné stavy tím nejsou samostatně auditované.
