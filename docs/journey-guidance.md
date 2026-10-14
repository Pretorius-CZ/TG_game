# Srozumitelný průchod příběhem — 2026-10-14

`src/journey.js` určuje jediný další příběhový úkol z uloženého postupu. Používá jej úvodní nabídka, průvodce nad scénou a pokračování po dokončení oblasti. Prohlížení starých míst tento cíl nemění. Volný výběr zůstává jen u dvojic expedic, které je potřeba dokončit obě.

Průvodce ukazuje aktuální kapitolu, místo, smysl práce a konkrétní další opravu nebo cestu. CONTINUE při návratu otevře aktuální úkol; pokud hráč skončil v nedokončené volitelné expedici, pokračuje v ní. Dokončená místa a návraty mají vedlejší ovládání. Zpět používá historii míst v aktuální relaci, po obnovení hierarchický návrat. Kapitoly umožňují návštěvy, replay oprav i přehrání odemčených příběhových sekvencí.

Čtyři nové komiksy propojují přípravu návratové trasy, přílet posádky, přivítání v Útočišti a závěrečné odhalení Archivu. Přivítání a navigátor mají nové WebP ilustrace. Starší sekvence lze obnovit i po zmeškaném prvním vstupu, ale automaticky se otevírají pouze v odpovídající fázi příběhu. Historické návštěvy nevracejí hráče do starých problémů.

Zhlédnutí nebo přeskočení komiksu se pamatuje pro prohlížeč, profil a revizi restartu. Jde o místní prezentační preference, nikoli nové cloudové pole; na novém zařízení lze komiks vidět znovu. Replay nemění opravy, hvězdy ani energii. Po levelu187 je explicitně uveden konec vydaného obsahu a budoucí síť majáků.

Opravové bubliny, komiksy a potvrzení příletu se zobrazují portálem do body, takže se nezmenšují spolu s portrétovou scénou. Přizpůsobení scén odečítá výšku průvodce. EN/CZ překlady zahrnují nové texty.

## Ověření

188 testů prošlo; čistý sestavený web prošel Vite buildem. Izolovaný mobilní průchod v EN/CZ ověřil32 oprav od návratového koridoru po konec Archivu, čtyři nové komiksy, zapamatování přes reload, skutečný návrat a replay z kapitol. Další kontrola pokrývá první vstup na320px, pokračování kokpitu, instalaci skeneru/výběr expedice a přílet do Elysia. Dokončení oprav v browseru používá vývojový náhled, nikoli ruční hraní všech desek; externí požadavky jsou blokované.

SQL031 uživatel potvrdil jako hotovou na živém Supabase. Tato UX úprava nevyžaduje další SQL. Nasazení Archivu a průvodce je autorizované na webové větvi codex/cockpit-stage.
