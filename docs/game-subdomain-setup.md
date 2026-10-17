# Souběžné nasazení hry — game.playbeyondthesignal.com

Hlavní web se při tomto kroku nemění. Zdroj zůstává v Pretorius-CZ/TG_game;
příprava je ve větvi codex/game-subdomain, produkce codex/cockpit-stage.
Nový veřejný repozitář Pretorius-CZ/TG_game-hosting
obsahuje pouze samostatný workflow a dokumentaci. Workflow stáhne vybraný
zdrojový commit, provede npm ci, unit testy, build a nasadí vlastní Pages.
Není potřeba další hosting ani nový token pro čtení veřejného zdroje.

## WEDOS

Uživatel potvrdil správu DNS u WEDOS a přidání nové subdomény. Správný záznam:

| Název | Typ | TTL | Data |
| --- | --- | --- | --- |
| game | CNAME | 300 | pretorius-cz.github.io |

Původní čtyři A záznamy hlavní domény a www CNAME se nemění. Hodnota CNAME
neobsahuje https, cestu repozitáře ani jméno původní domény. Nový hostname
je v Pages přiřazen repozitáři TG_game-hosting. Po vydání certifikátu
zapnout Enforce HTTPS; úspěšné HTTPS ověřit před zkouškou přenosu dat.

## GitHub

- Původní nastavení ověřeno přes API: TG_game má cname
  playbeyondthesignal.com, build_type workflow. Toto nastavení se nemění.
- Druhý web: https://github.com/Pretorius-CZ/TG_game-hosting.
- V Actions spustit Publish game subdomain a zadat přesný otestovaný SHA
  z TG_game. Workflow je ruční, aby šlo obě nasazení během ověřování řídit
  nezávisle. Push do zdrojové větve nadále aktualizuje původní web.
  Konkrétně automatické původní Pages reaguje jen na codex/cockpit-stage;
  přípravnou větev lze pushnout bez změny běžících QA testů staré adresy.
- Zdroj workflow je deployment/game-pages.yml; neinstalovat jej jako
  aktivní workflow do TG_game. Má i kontrolu názvu cílového repozitáře.
- Jednorázový idempotentní setup poskytuje scripts/setup-game-pages.mjs:
  bez --apply pouze kontrola, s --apply založení odděleného repozitáře,
  workflow a přiřazení hostname. Používá existující GitHub přihlášení,
  nic tajného nevypisuje a nemění DNS/původní Pages.

## Supabase — před zkouškou přihlášení na nové adrese

V Authentication / URL Configuration přidat přesnou Redirect URL
`https://game.playbeyondthesignal.com/`. Původní URL ponechat. Site URL
zatím zůstává na původní adrese, dokud se hráči nepřesunou. Používá se
stejný projekt a stávající SQL/RLS, není potřeba nová tabulka postupu.
PKCE přihlášení musí začít i skončit na témže originu. Google callback
do stejného Supabase projektu není třeba kvůli nové adrese automaticky
přepisovat; ověřit nastavení Google klienta podle jeho konkrétního režimu.

## Přenos a souběžné hraní

Nová adresa nabízí na úvodní obrazovce Recover original saved game /
Přenést původní postup. Odkaz otevře transfer.html. Stránku lze navštívit
i přímo. Původní adresa má také transfer.html pro odeslání a zálohu.
Pozor: původní adresa tuto stránku získá až nasazením přípravných změn
na její produkční větev. Dokud dobíhají staré iOS testy, nasazení původní
hry neprovádět. Nový web je do té doby zkušební; živý přenos ještě není
otevřený, místní cross-origin testy nepovažovat za živé ověření.
Pro tuto přechodnou fázi je otevření původního přenosového okna ve veřejném
buildu vypnuté a stránka pošle hráče pokračovat na původní web. Po ověření
staré transfer.html přes HTTPS nastavit v TG_game-hosting Actions variable
LEGACY_TRANSFER_READY=true a znovu nasadit. Výchozí hodnota je bezpečně
vypnutá; místní DEV testy mají přenos zapnutý.

1. Na nové adrese otevřít přenos a stisknout Open original saved game.
2. V původním okně potvrdit Send saved game.
3. Na nové adrese zkontrolovat počet položek a konflikty, potvrdit import.
4. Při blokovaném okně stáhnout zálohu na původní adrese a vybrat ji na nové.
5. Hráč s účtem se na nové adrese přihlásí stejným Google účtem. Místní
   kopie účtů jsou přenesené pod vlastními ID; nestávají se hostovským save.

Auth tokeny se nekopírují. Zápis má ověřovaný deník s obnovou po refreshi;
při přerušení hlavní hra přejde na obnovovací stránku před spuštěním
providerů. Stejný balíček se neimportuje opakovaně a nedoplňuje zásoby.
Existující data se standardně zachovají; jejich nahrazení vyžaduje
výslovné zaškrtnutí a nabídne se stažení dosavadní cílové zálohy.
Vyšší resetRevision účtu je chráněná i při zvoleném nahrazení.

Jde o kopii v jednom okamžiku. Místní data hosta/energie/pomůcek se mezi
oběma adresami dále živě nesynchronizují. Pro test pokračovat na jedné
adrese a před importem zavřít ostatní karty cílové hry. Cloud postupu účtu
funguje nadále jako nyní. Původní kopii nemažeme a veřejné hráče zatím
hromadně nepřesouváme.

## Ověření

Oprava nasazování po bílé stránce: kořen `/` vydával staré HTML, zatímco
`/index.html` a version.json byly nové. Staré JS/CSS soubory po nahrazení
artefaktu chyběly (404), proto se aplikace ani nespustila. Oba enginy to
reprodukovaly; přímé index.html přitom fungovalo. Samotné ověření TLS a
version.json tuto chybu neodhalí.

Workflow proto před publikací obnovuje chybějící immutable assets ze tří
posledních úspěšných artefaktů, maximální stáří sedm dnů. Aktuální soubory
nepřepisuje; starým zachovává mtime, aby se stáří při dalším nasazení
neprodlužovalo. Po publikaci vyžaduje skutečný start přes `/` i `/index.html`,
načtenou grafiku a otevření prvního úkolu, nikoli pouze HTTP200. Testovací
prohlížeč blokuje Supabase a geolokaci, takže nezapisuje analytiku.

Nasazení 2026-10-17: zdroj 5936553b9ce67726af6b9ab7d41fca1b73966445,
Actions v TG_game-hosting 39054875150 success. HTTP version.json ověřen
1792258927812-5936553b9ce6. Veřejný resolver 1.1.1.1 vrací správné CNAME.
Následně uživatel zapnul Enforce HTTPS. Nezávisle ověřeno přes API:
https_enforced=true, certifikát approved pro novou doménu, platnost do
2027-01-15. HTTP vrací 301 na HTTPS; HTTPS version.json i transfer.html
vracejí 200 s platným TLS. Původní čekání na certifikát je vyřešené.
Původní HTTPS stále vrací 1792252501390-9c75024f46d6 a jeho Pages cname je
playbeyondthesignal.com. Změny tedy neaktualizovaly původní běžící QA.
206 unit a 50 browser kontrol asset/layout/transfer prošlo. Produkční
vypnutý přenos navíc ověřen přes výsledné dist v Chromiu i WebKitu,
320 × 568 bez vodorovného přetečení. Fyzické Safari zatím neověřeno.

Unit testy pokrývají izolaci profilů, zakázané klíče, energii, pomůcky,
opakované importy, reset, přerušený zápis, rollback a původ zprávy.
Browser testy mezi 127.0.0.1 a localhost ověřují skutečný cross-origin popup,
zálohu souborem a obnovení před spuštěním hry v Chromiu a WebKitu.
Před otevřením nové adresy hráčům ověřit stejné scénáře přes obě HTTPS
domény a Google přihlášení, také na fyzickém Safari/iPadu.

Podklady: [GitHub: vlastní subdoména](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site),
[WEDOS: CNAME a název subdomény](https://help.wedos.cz/otazka/overeni-dns/9226/answer/9228/),
[Supabase: redirect URL](https://supabase.com/docs/guides/auth/redirect-urls).
