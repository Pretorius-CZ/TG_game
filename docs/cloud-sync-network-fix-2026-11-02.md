# Cloud po levelu 200 — oprava 2026-11-02

Uživatel nahlásil nepřenesený postup mezi PC a mobilním webem. Databázová
migrace SQL035 přidala nové skupiny a ID hvězd, ale ponechala ochranný limit
200 klíčů v `incoming.stars`. `normalizeProgress` přidává hodnocení každému
dokončenému levelu, takže od první nové výhry (201) server odmítl celý RPC
chybou `Too many star ratings`. Zápis se neprovedl; místní postup zůstal.
Samotné úspěšné spuštění CREATE FUNCTION tuto chybu neodhalilo.

## Oprava

- SQL035 je opravený pro další instalace (limit 210).
- Na už nasazené SQL035 spustit **supabase/036_network_cloud_star_limit.sql**.
  Opraví pouze známou podmínku existující funkce, odmítne neznámou definici,
  lze spustit opakovaně. Zachovává tabulku, uložené hry, vlastníka i GRANT.
- Klient pravidelně opakuje sync; po nasazení SQL036 má své místní novější
  opravy odeslat sám. Případně znovu načíst stránku, bez mazání úložiště.
- Oba weby musí používat stejný Google účet ve hře. Přihlášení prohlížeče
  nebo Google Play samo o sobě není přihlášení ke cloudovému účtu hry.

Živé nasazení SQL036 v okamžiku přípravy čeká na potvrzení uživatele.
Po potvrzení prověřit „Postup uložen online“ na zdrojovém zařízení a poté
stejný počet oprav/hvězd na druhém zařízení. Aktuálně navštívená místnost
se mezi zařízeními nepřepíná násilně; dosažený postup lze ověřit v Kapitolách.
Energie, zásoba pomůcek ani rozehraná minihra se dosud nesynchronizují.

## Ověření

Nový test tests/cloudProgressSql.test.js spouští skutečné PostgreSQL funkce
v PGlite (pouze dev závislost, nepřidává se do hry). Reprodukuje původní
odmítnutí u 201, ověřuje nezměněný poslední serverový save, dvojí aplikaci
SQL036, přenos na druhé simulované zařízení, všech 210 hvězd, zápis staršího
klienta bez nových polí a RLS oddělení dalšího účtu. Nadlimitní vstup zůstává
odmítnutý. Všechny kontroly běží lokálně bez přístupu k produkčním účtům.
309 unit testů a produkční build prošly. Samotný test není potvrzením
živého nasazení SQL036 nebo přenosu na skutečné uživatelovo zařízení.
