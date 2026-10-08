# Země návštěvníků

Spustit celý `supabase/027_country_tracking.sql` v SQL Editoru. Obsahuje
definice026 a vyžaduje existující analytiku016; zachovává návštěvy i postup.
Poté nasadit web. Živé provedení027 zatím není potvrzené.

Balance obsahuje samostatnou tabulku Země návštěvníků, filtr země a
kampaně/zdroje. Celé období, návštěvy, zařízení, spuštění minihry, alespoň
jedna výhra, spuštění dvou různých levelů a pokusy. Zařízení se počítají
uvnitř každé kombinace země a kampaně; jejich součet není počet osob.
Chybějící migrace neblokuje původní přehled kampaní.

Zdroj: https://country.is/ — veřejná HTTPS služba bez klíče, zdarma i pro
komerční použití dle dokumentace ověřené2026-10-06. Nejde o region serveru
Supabase ani jazyk prohlížeče. Původně zvažovaná Edge Function není potřebná.
Browser požádá api.country.is o zemi vlastního připojení, při
načtení stránky, pokud současná relace nemá známou zemi; po výpadku
opakuje nejdříve za minutu při viditelné hře. Limit4s,
bez cookies a refereru. IP je síťově viditelná poskytovateli a jeho
infrastruktuře; aplikace z odpovědi ponechá pouze kód země.
Celou odpověď ani IP neukládá místně ani do databáze. Poskytovatel uvádí,
že požadavky neloguje. Nežádat GPS, město ani souřadnice.

Známá země patří relaci a přežije refresh a přihlášení. Starší offline
relace nedostávají dnešní polohu zpětně. Výpadek, blokátor nebo neznámá
poloha jsou Neznámá; hraní a měření kampaně na geolokaci nečekají.
SQL přijímá jen dvoupísmenný kód, nikoli další geografická data; aktualizace
ze staršího klienta již známou zemi nemaže. Čtení agregace jen správci.
Je to orientační analytika (údaj posílá klient), nikoli důkaz skutečné
polohy; VPN/proxy a klientská manipulace ji mohou zkreslit.

2026-10-06: diagnostika aktuálního prohlížeče na balance: známá/nedostupná země, fronta návštěv a poslední chyba odeslání. Pokusy také ukazují konkrétní chybu RPC a mají8s timeout.
