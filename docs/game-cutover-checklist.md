# Přechod na game. — provozní postup

2026-10-22: Přechod provedený. MAIN_SITE_MODE=website je trvalá GitHub
proměnná, ruční dispatch má také výchozí website. Root je veřejný web,
game je hra; obě adresy mají zdroj2d91eb8. Transfer/legacy zůstávají200,
hlavní nasazení39812552554 success. Živé přenosy oběma enginy potvrdily
původní data i zásoby a bezpečné opakování. Podrobnosti docs/welcome-page.md.

## Připravené souběžné období

Hra na obou HTTPS adresách používá stejnou Supabase databázi, účty a ID
levelů. Uživatel potvrdil přidání https://game.playbeyondthesignal.com/
do Supabase Redirect URLs. Staré URL a Site URL zůstávají povolené.
Přenosová stránka transfer.html je trvalá součást obou sestavení.

Hráč s původními místními daty má nejprve přejít na
https://game.playbeyondthesignal.com/transfer.html, otevřít původní kopii,
odeslat a potvrdit import. Poté pokračovat a případně se přihlásit stejným
Google účtem. Host se přihlašovat nemusí. Nový účet není potřeba.
Alternativou je JSON záloha z původní transfer.html a import na nové.

Původní data se nemažou. Přenášejí se levely, hvězdy, deník, scéna,
energie s časem obnovy, pomůcky, jazyk a návody. Místní kopie účtů jsou
oddělené a otevřou se pouze odpovídajícímu přihlášenému účtu.
Auth tokeny se nepřenášejí. Postup stejného účtu se sloučí s ochranou
resetRevision. Prázdný výchozí save na cíli už neblokuje převzetí hosta.
Spotřebovaná energie a pomůcky se opakovaným přenosem nedoplňují.

## Oprava druhé kolekce pomůcek

Pomůcky dosud nejsou cloudový inventář. Na nové adrese proto chybějící
zásoba přihlášeného účtu znamená nulu do přenosu nebo získání odměny,
nikoli novou kolekci. Existující uložená zásoba zůstává. Opravdový reset
celé hry výslovně zapíše novou počáteční zásobu pro novou resetRevision.
Původní export zahrne i dosud nevyužitou implicitní zásobu.
Tato změna není serverová ochrana proti úpravám localStorage ani živá
synchronizace inventáře mezi zařízeními. Neumožňuje slíbit sdílený počet
pomůcek při souběžném hraní na více originálních zařízeních.

Analytické fronty se nepřipojí k cizí reportovací identitě. BOT označení se
zachová i při existující cílové identitě; přenesené QA zařízení se nestane
lidským hráčem. Odkazy přenášejí jen podporované UTM, ne OAuth kódy.

## Přepnutí hlavní domény za několik dní

1. Ověřit svůj skutečný původní účet i hosta: postup, hvězdy, deník,
   energie a konkrétní zásobu pomůcek po přenosu a obnovení stránky.
2. Kontrola bez přepnutí: `node scripts/set-main-site-mode.mjs`.
3. Ve vybraný den: `node scripts/set-main-site-mode.mjs --mode=website --apply`.
   Skript nastaví trvalou GitHub variable MAIN_SITE_MODE=website a spustí
   původní Pages workflow. Díky proměnné pozdější push nevrátí hru na kořen.
4. Ověřit Actions, hlavní web a jeho odkazy. Nový návštěvník jde na game.;
   prohlížeč s původním save jde nejprve na přenos. UTM zůstanou zachované.
5. Nastavit Supabase Site URL na https://game.playbeyondthesignal.com/,
   staré Redirect URLs nadále ponechat pro doběhnutí starých přihlášení.

Příkaz --apply není součást běžného nasazení. Souběžné období skončilo
2026-10-22; kořen je nyní web. Zdroj prezentační stránky je welcome.html;
website režim ji umístí do index.html. Ponechá transfer.html a původní
legacy-game.html pro obnovu a dokončení OAuth callbacků na starém originu.
Obnovovací cestu držet dlouhodobě pro hosty, kteří přijdou po měsících.

## Nasazení dalších změn

Produkční zdroj je codex/cockpit-stage. Push publikuje hlavní doménu v
nastaveném režimu. Druhý repozitář TG_game-hosting publikuje ručně zvolený
zdrojový SHA workflowm Publish game subdomain. Nasadit oba ze stejného
otestovaného commitu. LEGACY_TRANSFER_READY=true v TG_game-hosting drží
živý přenos dostupný. Současná retence starších assetů a živá kontrola
startu brání opakování bílé stránky při starém HTML v cache.

Při technické chybě nevracet hráčům staré místní save přes novější na game.
Ponechat hru na game. a opravit web/hosting; rollback prezentačního webu
nenahrazuje přenos nových místních změn opačným směrem.
