# Dobrovolné statistiky — 2026-10-18

Uživatel doložil úspěšné spuštění SQL033 výsledkem schedule=1. Migrace a
naplánování jsou podle jeho výsledku hotové; skutečný běh denního úklidu
ještě nebyl potvrzený z cron.job_run_details. Frontend nyní připraven k nasazení.

## Chování hráče

V nastavení hry je samostatné Povolit / Nepovolit statistiky. Výchozí stav
je vypnuto, také pro staré instalace a BOT návštěvy. Reklamní CMP je oddělená.
Bez souhlasu se neukládají výsledky pokusů, návštěvy, aktivita ani nespouští
country.is. Google přihlášení a cloudový postup nejsou tímto vypnuté.
Statické informační stránky vlastní herní analytiku nespouštějí.

Zapnutí smaže staré místní fronty a začne nová návštěva; historie před volbou
se neodesílá, ani když se později importuje stará záloha. Vypnutí ruší aktivní
požadavky, maže místní historii/fronty a promítne se do dalších karet stejného
originu. Již doručené požadavky nelze odvoláním HTTP vzít zpět. Vypnutí samo
nemazalo dřívější serverové záznamy; k tomu slouží samostatné tlačítko výmazu.

Volba, identita i případná čekající žádost o výmaz patří prohlížeči a originu,
nikoli Google účtu. Původní doménu a game, další zařízení a prohlížeče je nutné
řešit samostatně. Vymazáním celého browser storage lze ztratit klíč k dohledání
starých statistik; pro další žádosti je dostupný kontakt správce.

Výmaz vyžaduje dosavadní náhodné ID a tajný klíč, nikdy e-mail. Nejprve vypne
sběr a uloží čekající žádost, potom volá delete_browser_analytics. Při chybě
nehlásí úspěch; nabídne retry a zkusí jej při dalším otevření/online. Nedotkne
se postupu, hvězd, deníku, energie, pomůcek, přihlášení ani jiného reportéra.
Nové výslovné zapnutí po žádosti používá novou identitu.

SQL zachová jen minimální zneplatněný reportér + hash klíče a datum zneplatnění,
aby stará/offline karta nemohla smazaná data znovu vytvořit. Tento bezpečnostní
záznam nemá herní historii ani aktivitu a není zahrnutý do počtu hráčů. Nejde
o anonymní statistický agregát. Omezení je výslovně popsáno v privacy.

## Uchování

- Místní historie: nejvýše 2 000 pokusů, 90 dní; fyzický úklid při dalším
  otevření hry. Browser během zavřené stránky JavaScript nespouští.
- Server: pokusy a návštěvy 90 dní od prvního vložení, bez prodlužování při
  aktualizaci; aktivní dny 90 dní. Úklid denně v 03:17 UTC, tedy nejvýše
  jeden den navíc. Reportovací identity po 90 dnech neaktivity, pokud již
  nemají uchovávané závislosti. Výše popsaná ochrana výmazu zůstává.
- Platí pro vlastní produkční analytické tabulky, ne automaticky pro provozní
  logy a zálohy poskytovatelů. Game progress/auth tabulky jsou oddělené.
- Panel /balance po nasazení měří jen dobrovolně zapojené prohlížeče, nikoli
  všechny návštěvníky. Souhlas neudělovat automaticky ani pro botí UTM.
  Pro QA výslovně zapnout statistiky v testovacím profilu; BOT filtr zůstává.

## Nasazení v Supabase

1. SQL Editor otevřít jako vlastník projektu. SQL033 nyní nejprve provede
   create extension if not exists pg_cron with schema pg_catalog.
   Pokud instalaci nepovolí oprávnění projektu, povolit pg_cron přes
   Integrations → Cron a teprve potom celý soubor zopakovat.
2. SQL Editor: spustit celý supabase/033_analytics_privacy.sql. Potřebuje
   dosavadní analytické migrace 016,017,027,028,032. Transakce selže celá,
   pokud Cron není dostupný; nezůstane falešný stav s nenaplánovaným úklidem.
3. Ověřit naplánování:

```sql
select jobid, jobname, schedule, command, active
from cron.job where jobname='purge-game-analytics';
```

4. Až po úspěchu migrace nasadit frontend a novou privacy stránku.
5. Pro okamžitou kontrolu úklidu lze v SQL Editoru spustit následující příkaz.
   Trvale odstraní starší analytické záznamy podle výše uvedených pravidel:

```sql
select public.purge_expired_analytics();
```

6. Po prvním plánovaném běhu zkontrolovat skutečné provedení:

```sql
select status, return_message, start_time, end_time
from cron.job_run_details
where jobid=(select jobid from cron.job where jobname='purge-game-analytics')
order by start_time desc limit 5;
```

Plánování není důkaz úspěšného běhu. Nepotvrzovat živou retenci bez kontroly.
SQL lze opakovat (stejný pojmenovaný Cron job); tabulky postupu nemění.
Staré verze klienta ještě nemají novou volbu souhlasu; frontend nasadit na obě
domény spolu, staré požadavky zneplatněného reportéra blokuje SQL i po výmazu.

## Ověření

235 unit testů a šest cílených browser scénářů Chromium/WebKit prošlo:
výchozí nulový sběr, opt-in, vypnutí, oddělený výmaz, offline/503 retry,
odvolání ve druhé kartě. SQL033 provedené v izolovaném PostgreSQL/PGlite:
token ochrana, výmaz jen vlastní identity, idempotence, zákaz opětovného
zápisu/presence po výmazu, 90denní purge, zákaz veřejného volání purge.
Cron je v tomto SQL testu stub, skutečný Supabase scheduler tím není ověřený.
Dále prošlo osm herních a osm settings a11y kontrol Chromium/WebKit EN/CZ
320/1920px a dvě kontroly RPC retry. První WebKit settings běh odhalil
slabý kontrast nových tlačítek; po explicitním pozadí všech osm settings
případů prošlo. Opakované dokončení pending výmazu také prošlo v obou enginech.

Zdroje: https://supabase.com/docs/guides/cron,
https://supabase.com/docs/guides/cron/install,
https://supabase.com/docs/guides/cron/quickstart,
https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data_en

SQL test lze zopakovat z kořene projektu (závislost jen v ignorované .local):

```powershell
npm install --prefix .local/sql-check --no-package-lock --no-audit --no-fund @electric-sql/pglite
node scripts/check-analytics-privacy-sql.mjs
```
