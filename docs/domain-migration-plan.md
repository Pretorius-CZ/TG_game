# Přesun hry na game.playbeyondthesignal.com

Stav 2026-10-17: uživatel schválil souběžnou subdoménu `game.` a zahájení
práce. Připraven přenos přes ověřené spojení oken a souborovou zálohu,
206 unit testů prošlo. Samostatný repozitář TG_game-hosting a Pages s vlastní
doménou založeny. Uživatel přidal CNAME game u WEDOS. Hlavní web zůstává
samostatný; hráči se automaticky nepřesměrovávají. Pro aktuální postup
nasazení viz docs/game-subdomain-setup.md. Následující návrh úschovy je
budoucí možnost, nikoli již nasazený backend.

## Doporučení

Hru provozovat na `https://game.playbeyondthesignal.com/`, hlavní doménu
ponechat pro prezentační web a trvalou obnovu původních místních dat.
Zachovat tentýž Supabase projekt, tabulky, uživatelská ID a RPC.
Nejdřív připravit a otestovat přenos, potom měnit veřejné vstupy.
Samotný HTTP redirect ani změna DNS nepřenese localStorage.

## Co skutečně ukládáme

| Data | Současné místo | Přesun |
| --- | --- | --- |
| Host: levely, hvězdy, deník, kapitoly, scéna, resetRevision | `to-the-stars-progress-v1` v localStorage | Povinný místní přenos |
| Lokální kopie účtů, včetně neodeslaného postupu | stejný klíč + `:user:<id>` | Přenést odděleně, otevřít až správnému účtu |
| Postup přihlášeného účtu | Supabase a místní kopie | Stejný účet načte cloud; zachovat i neodeslané místní změny |
| Energie a čas obnovy | `to-the-stars-lives-v1` | Přenést count, nextAt i interval; nepřidávat pět nových článků |
| Pomůcky | `to-the-stars-helpers-v1:<profile>:<revision>` | Přenést relevantní profily a revize, neobnovit spotřebované zásoby |
| Jazyk, zvuk, viděné návody, úvod a příběhové prezentace | samostatné místní klíče | Přenést pomocí výslovného seznamu podporovaných klíčů |
| Relace Supabase a PKCE verifier | localStorage knihovny Auth | Nekopírovat; přihlásit se na nové adrese |
| Analytická identita, čekající výsledky a kampaně | balance/campaign klíče | Samostatný validovaný přenos nebo dokončení odesílání; zachovat ID/revize a BOT příznaky |
| Rozehraná deska | pouze paměť | Není uložena ani dnes; přenos zahájit mimo minihru |

Podklady: src/progressStorage.js, accountStorage.js, useProgressSave.js,
Lives.jsx, helperStock.js, Account.jsx, tutorials.js, storySeen.js,
balanceOutbox.js a campaignTracking.js. Inventář klíčů při implementaci
ověřit proti celému zdrojovému stromu, nikoli exportovat vše z localStorage.

## Jak má přenos fungovat pro hráče

1. Na původní doméně hráč zvolí pokračování na nové adrese. Dokončený
   level musí být uložen; přesun se nespouští uprostřed tahu nebo reklamy.
2. Původní stránka načte a validuje podporovaná místní data, připraví
   verzi balíčku a jedinečné ID přenosu. Zdrojová data nemaže.
3. Nová adresa převezme balíček ještě před spuštěním hry, autentizace
   a analytiky. Ověří verzi, velikost, typy a výsledné normalizované profily.
4. Nejprve uloží obnovovací balíček a stav importu, poté zapisuje jednotlivé
   položky. Po opětovném načtení zápisu potvrdí úspěch; rozpracovaný import
   lze bezpečně dokončit po refreshi. Při chybě nedovolí tichý start od nuly.
5. Hra ukáže potvrzení a pokračuje. U účtu případně požádá o nové Google
   přihlášení, přitom zachová původní hostovský profil odděleně.

Přímý návštěvník nové adresy má dostupné „Přenést postup z původní adresy“.
Přenos místních dat vyžaduje původní prohlížeč/profil; na jiném zařízení
je řešením cloud nebo ruční záloha. Anonymní režim po vymazání dat nelze
obnovit jen podle adresy webu. Neslibovat absolutní ochranu proti ztrátě
dat, která prohlížeč už odstranil.

## Technická varianta

Pro pozdější automatický přechod je možností krátký přechod mezi stránkami v hlavním okně přes
dočasný serverový balíček (např. malá Supabase Edge Function a neveřejná
tabulka). Nezávisí na popup okně ani přístupu iframe k původnímu úložišti.
Základní migrace nesmí být podmíněná přihlášením hosta.

- Nová stránka založí náhodný požadavek a do sessionStorage uloží jeho
  vazbu na aktuální přenos; pošle prohlížeč na přesnou původní adresu.
- Původní stránka vloží omezený datový balíček do úschovy a vrátí prohlížeč
  na pevně určenou novou adresu s krátkodobým náhodným předávacím kódem.
  Obsah uložené hry ani Auth tokeny nepřenášet v URL.
- Úschova vyžaduje dostatečně náhodné capability kódy, TTL např. 10 minut,
  omezení velikosti a frekvence, zákaz veřejného výpisu/čtení tabulky,
  omezení oprávnění funkcí a automatický úklid. CORS není autentizace.
- Příjemce ověří vazbu na původní požadavek. Kód nesmí dovolovat změnu
  cílové domény ani import dat cizím odkazem bez zahájeného přenosu.
- Vyřešit obnovení po ztracené odpovědi: nevratné zneplatnění kódu před
  trvalým uložením v cíli by mohlo přenos přerušit. Použít potvrzení
  převzetí a omezené opakované čtení pro stejný požadavek do TTL.
- Na přenosových stránkách nespouštět reklamy/analytiku, neposílat kódy
  do logů, použít no-store/referrer policy a vyčistit URL po převzetí.
- Záložní možnost: stažení a import validované zálohy místních dat bez
  přihlašovacích tokenů, když síť nebo úschova nefunguje.

Pro první souběžné nasazení je implementován přenos přes postMessage mezi
přesně ověřenými okny. Kontroluje origin, source i náhodný požadavek;
alternativou při blokovaném okně je export/import JSON souboru. Přenos
prošel Chromiem a WebKitem mezi dvěma skutečně oddělenými místními originy.
Fyzické Safari/iPad a skutečné domény ještě vyžadují ověření. Neprovádí se
automatický přenos nebo přesun všech hráčů.

## Sloučení a opakované návštěvy

- Každý přenos má trvalý záznam o dokončení na nové adrese. Stejný starý
  balíček nesmí podruhé obnovit spotřebované pomůcky nebo energii.
- Místní kopie účtů neslučovat do hosta ani do jiného přihlášeného účtu.
  Cloud synchronizovat pod ověřeným uživatelem jako nyní.
- Pro stejný profil respektovat resetRevision a existující mergeProgress;
  nepřebít novější reset historickou vyšší úrovní. Dvě nezávisle rozehrané
  hostovské historie nepovažovat automaticky za stejnou větev postupu jen
  proto, že obě mají číselnou resetRevision. Konflikt ukázat s možností
  zvolit uloženou hru a zachovat obě zálohy.
- Energie a pomůcky nejsou monotónní postup: nesčítat je ani nebrat maximum.
  Při existující hře na nové adrese chránit novější cílový stav; pro konflikt
  určit pravidlo zvlášť. Čas nextAt počítat z původního termínu.
- Migrace musí předcházet providerům hry: jinak prázdný start na nové
  adrese stihne založit energii, pomůcky či analytickou identitu před importem.
- Zachovat attemptId a revize čekajících reportů, nezapočítávat přenos jako
  nový herní pokus. UTM automated_test/bot/qa_01 a uložené rozlišení robotů
  nesmí přesun ztratit; technický migrační parametr není nová kampaň.

## Nasazení a hosting

Současný repozitář publikuje jeden artefakt na GitHub Pages z větve
codex/cockpit-stage. Samostatný hlavní web a hra potřebují oddělené
nasazení nebo vědomé směrování podle hostname. Pouhé přepnutí Pages
Custom domain může znemožnit obsluhu starého originu; před ním zajistit,
kdo bude dál obsluhovat kořen a obnovovací stránku pod původní doménou.

1. Připravit oba hostingové cíle a HTTPS. Hra na nové adrese zatím neveřejná
   pro hráče, s totožným backendem a stejnými ID levelů a účtů.
2. V Supabase povolit přesné návratové URL obou domén. OAuth zahájený
   na staré adrese se musí nejprve dokončit tam; PKCE verifier je místní.
   Nové přihlášení začíná a končí na nové. Google callback do stejného
   Supabase projektu obvykle zůstane stejný; ověřit skutečnou konfiguraci
   klienta, oprávněné originy/domény a text consent obrazovky.
3. Nasadit obnovovací cestu a změnu staré hry, která po přepnutí už
   nespouští nové pokusy na starém originu. Aktivním hráčům nabídnout
   přechod až v bezpečném bodě. Otestovat více otevřených karet.
4. Ověřit kopii na cíli, účet online/offline, přihlášení a opakovaný import.
5. Přepnout odkazy a hlavní web. Site URL v Supabase změnit na cílovou
   adresu, starou callback adresu ponechat pro doběhnutí přihlášení.
6. Původní obnovovací stránku držet dlouhodobě, ideálně trvale. Hráč může
   přijít po půl roce. Hlavní web může zůstat prezentační, ale potřebuje
   odkaz pro návrat hráčů a přístup k původnímu localStorage.

Přesměrování na úrovni serveru nesmí předběhnout načtení dat na starém
originu. Počet uběhlých týdnů není důkazem, že už hosté byli přeneseni.
Samostatně rozhodnout umístění balance.html; pro hru je přirozené
game.playbeyondthesignal.com/balance.html, historický odkaz může vést tam.
Prověřit relativní odkazy, welcome.html, návratové URL, veřejné herní odkazy,
zásady ochrany soukromí a reklamní konfiguraci při skutečné implementaci.

## Minimální přejímka před přesunem

Otestovat Chromium, Firefox a WebKit, zvlášť skutečné Safari iPhone/iPad:
host od začátku i po poslední kapitole; účet s cloudem i neodeslaným místním
levelem; host a více místních účtů vedle sebe; hvězdy, deník a scéna;
0 energie, běžící obnova a spotřebované pomůcky; restart hry a vyšší
resetRevision; dva otevřené taby; opakovaný/importovaný starý balíček;
přímý příchod na play; expirovaný kód; offline režim; odmítnutý zápis či
plné úložiště; refresh mezi jednotlivými zápisy; ztracené potvrzení;
rozběhnuté OAuth na původní doméně; BOT UTM a čekající analytické fronty.

Původní data ponechat, poskytovat zálohu a při neúspěchu zobrazit obnovu,
nikoli výsledek „úspěšně přeneseno“. Návrat hostingu zpět sám nepřenese
nové místní změny z play na kořen; případný rollback po otevření hry musí
počítat s opačným přenosem nebo s ponecháním hry na play během opravy.

## Ověřené podklady

- [MDN: localStorage je vázané na origin](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- [MDN: postMessage, kontrola origin/source](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).
- [Supabase: povolené redirect URL a Site URL](https://supabase.com/docs/guides/auth/redirect-urls).
- [Supabase: PKCE a místní verifier](https://supabase.com/docs/guides/auth/sessions/pkce-flow).
- [GitHub Pages: vlastní doména a DNS subdomény](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
