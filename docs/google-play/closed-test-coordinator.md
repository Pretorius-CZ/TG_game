# Organizace uzavřeného testu Google Play

Stav 28. 10. 2026: podklady připravené, nábor lze předběžně domluvit. Termín placeného běhu ani 14denní období se zatím nepotvrzuje; čekáme na registraci Play účtu a dostupný uzavřený track.

## Rozsah objednávky

Požadovat skutečné hraní, evidované problémy a soukromý závěrečný report. Neobjednávat veřejné hvězdičky/recenze ani službu garantující schválení. Doporučená rezerva je 16–20 dospělých Android testerů; oficiální minimum pro náš nový osobní účet je 12 nepřetržitě přihlášených po 14 po sobě jdoucích dní. Větší počet je naše provozní rezerva, ne další podmínka Googlu. [Požadavky Google](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en), [hodnocení a recenze](https://support.google.com/googleplay/android-developer/answer/9898684?hl=en).

Žádné oslovování, objednávka, platba nebo rozeslání nebyly tímto dokumentem provedené. Vlastník předá testerům `tester-brief-en.md`, až bude znát skutečné odkazy a termíny.

## Před ostrým startem

1. Dokončit účet vývojáře, údaje aplikace, správný upload podpis, aktuální AAB a požadované formuláře. Nezaměňovat interní a uzavřený test.
2. Nejdříve zkusit interní instalaci přes Play, release callback Google, upgrade a zachování místních dat. Paket je odlišný od `.preview`.
3. Připravit e-mailový seznam nebo Google Group s přístupem do konkrétního uzavřeného tracku. Vygenerovat skutečný opt-in odkaz a ověřit instalaci. Adresy testerů držet soukromě, ne v repozitáři.
4. Domluvit soukromý kanál zpětné vazby a cenu/rozsah práce. Zadání nemusí požadovat přihlášení přes Google ani povolení statistik pro všechny; jejich odmítnutí není neplatný tester.
5. Start potvrdit podle Play Console, ne podle prvního zaslání APK. Evidovat datum opt-in každého testera a případná přerušení. Uvolnění do produkce po splnění testu není automatické.

## Evidence

Pro každého testera soukromě vést: kód, kontakt potřebný pro přístup do testu, telefon/Android, jazyk, verzi app, datum potvrzeného opt-in, případné opt-out, potvrzení instalace/aktualizace, reportované chyby a jejich stav. Google má skutečný počet a způsobilost v Console; naše tabulka je nenahrazuje. Nezakládat žádné falešné řádky ani vymyšlenou aktivitu.

Pracovní stavy: pozván → potvrzený opt-in → první instalace → průběžné testování → závěrečný report. Průběžné hlášení chyby může nastat v každém stavu.

Požadavek 12/14 je nutné kontrolovat v Console před žádostí o produkci. Zpětná vazba se promítá do oprav a seznamu změn. Podklady pro žádost: co bylo testované, jak byli testeři získaní, jak byli aktivní, jaké problémy našli a co jsme opravili. Nic z toho nevyplňovat předem jako údaj o dosud neproběhlém testu.

## Připravená přejímka

- Aplikace nainstalovaná/aktualizovaná přes Play bez ztráty místního postupu.
- Dospělý host i přihlášený účet; cloud ukládá a obnovuje skutečný postup.
- Místní režim nevyžaduje účet ani reklamy/statistiky.
- Soukromí a žádost o odstranění účtu dostupné.
- Reklamní chyba/přerušení nedává odměnu a neničí pokus; dokončená demo odměna právě jednou.
- Čitelnost a ovládání alespoň malý/velký telefon; ideálně tablet a více verzí Androidu.
- Bez blokující chyby, s evidovanými opravami a poctivým souhrnem otevřených problémů.

Termín, skutečné odkazy a tester data zůstávají nevyplněné, dokud nejsou dostupné.
