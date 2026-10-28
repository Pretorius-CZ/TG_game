# Play Console — návrh prohlášení

**Aktualizace 28. 10. 2026:** aktuální sestavení je internal2 s místním režimem pro mladší/neuvádějící věk. Podrobnosti `android-audience-2026-10-28.md`; ruční cesta odstranění účtu `account-deletion.md`. Starší poznámky o chybějící věkové obrazovce tím nahrazené. Fyzické SDK ověření, Families posouzení a finální prohlášení zůstávají otevřené.

Nejde o vyplněný formulář ani potvrzení právní shody. Údaje platí pro interní build 0.1.0-internal.1 z 27. 10. 2026. Před veřejným vydáním znovu prověřit aktuální build, všechny SDK a dětské publikum.

| Položka | Podklad / návrh |
|---|---|
| Název | Beyond the Signal |
| Provozovatel | Michal Malich |
| Podpora | flambiz.cz@gmail.com |
| Web | https://playbeyondthesignal.com/ |
| Soukromí | https://playbeyondthesignal.com/privacy.html — veřejná současná webová stránka; před veřejným Android vydáním doplnit popis AdMob/UMP a dětského režimu |
| Kategorie | Hra / Logické (Puzzle) |
| Reklamy | Ano, integrovaný AdMob; tento balíček používá jen demo odměňované reklamy |
| Nákupy v aplikaci | Nejsou implementované; nezaměňovat odměnu za reklamu s nákupem |
| Přístup | Základní hra bez účtu; volitelné Google přihlášení pouze pro cloudový postup. Nevyžaduje placené členství ani administrátorský účet. |
| Instrukce pro kontrolora | Lze hrát jako host. V Settings lze volit jazyk, statistiky a reklamní soukromí. Google přihlášení je volitelné. Cloudový přenos vyžaduje stejný účet. |
| Publikum | Záměr všechny věky včetně dětí. Finální skupiny až po dokončení Families a ověření vhodnosti pro daný věk. |
| IARC / PEGI | Dotazník dosud nevyplněný, hodnocení neurčeno. Obsah: sci-fi opravy, kreslené exploze náloží, nouzové přistání a záchranný příběh. Bez hráčského chatu a veřejného UGC. Neodhadovat automaticky PEGI 3. |
| Práva k obsahu | Vlastní hra a použité podklady; před odesláním uchovat licence zvuků, grafiky a závislostí. Není ověřeno pouze existencí těchto podkladů. |

## Data safety — inventář k ověření

Nevyplňovat „žádná data“. Interní-only track je z Data safety formuláře vyňat, uzavřený/otevřený/produkční test už ne. To nezbavuje povinností soukromí.

| Tok | Údaje a účel | Volitelnost / další krok |
|---|---|---|
| Google → Supabase Auth | identifikátor účtu, e-mail a profil od Googlu, relace; autentizace | Volitelné přihlášení. Prověřit přesný profil a klasifikaci jméno/e-mail/user ID. |
| Cloudový save | postup, hvězdy a přečtený deník spojené s účtem | Funkce ukládání. Projít in-app a webové odstranění účtu, ne pouze reset postupu. |
| Herní statistiky → Supabase | náhodný identifikátor, aktivita, levely/výsledky/tahy/doba/pomoc, kategorie zařízení, URL kampaň | Pouze po explicitním povolení; lze vypnout a požádat o smazání. Detailní záznamy 90 dní, max. další den do cleanupu. Dětský režim zbývá. |
| country.is | IP při požadavku, zpět kód země pro analytiku | Jen při povolených statistikách. Posoudit přibližnou polohu a práci poskytovatele. |
| AdMob + UMP | síťové požadavky, reklamní volby, reklamní/app/device identifikátory a další data podle verze SDK | Demo není důkaz, že SDK nic neposílá. Zkontrolovat disclosure Google Mobile Ads, verzi a provoz. Rozlišit collected/shared podle definic Play, ne jen podle toho, komu patří server. |
| Místní úložiště | energie, zásoby pomůcek, místní save, jazyk a nastavení | Samotné údaje, které zůstávají výhradně v zařízení, nejsou automaticky „collected“ pro Data safety. Cloudový save a statistiky jsou oddělené. |

Ověřit šifrování přenosů u všech poskytovatelů, možnosti smazání, retenční pravidla, volitelnost, účely a klasifikaci identifikátorů podle finálního buildu. Nevydávat pseudonymní statistiky za anonymní data.

Důležité: Google login byl ověřen na preview APK; tento AAB se musí ověřit po instalaci z Play, má jiný package a produkční callback `com.playbeyondthesignal.game://auth/callback` (uživatelem již přidaný do Supabase).
