# Oddělení hráčů a botů v balance — 2026-10-16

Společný přepínač **Hráči / Boti / Všichni**, výchozí Hráči. Volba se
pamatuje v prohlížeči; při změně se vyčistí konkrétní filtr kampaně.
Platí pro návštěvy, země, zařízení, úvodní průchod, poslední pokusy,
obtížnost, export, živou aktivitu a návraty. Kampaně/dny/verze nadále
mají svůj původní rozsah. Živá aktivita a návraty jsou přes všechny kampaně,
ale respektují provoz i přepínač interních testerů.

Bot = zařízení se zaznamenanou návštěvou se **současným** označením
`utm_source=automated_test` a `utm_medium=bot`. Kampaň může být `qa_01`
i jakákoli další. Celá historie takového reporter ID se klasifikuje jako
bot, včetně přímých návratů a pokusů bez vazby na návštěvu. To znamená,
že při použití botího odkazu v běžném hráčském prohlížeči bude mezi boty
patřit i tento prohlížeč. Boti mají používat samostatné profily.
Nejde o automatickou detekci lidí; neoznačené boty zpětně nepoznáme.
Interní lidské testery nadále spravujeme samostatně.

## Nasazení

1. V Supabase SQL Editoru spustit `supabase/032_bot_traffic.sql` po 028 a 017.
   Migrace přidává čtecí RPC `read_traffic_overview` a částečný index,
   nemění herní postup ani uložené pokusy. Přístup zůstává pouze správcům.
2. Nasadit web. Bez nové migrace dashboard zobrazí chybu; nevydává původní
   smíšené serverové součty za rozdělené.
3. V živém přehledu ověřit qa_01 v Boti, ostatní kampaně v Hráči,
   součet obou ve Všichni a kombinaci s vynecháním interních testerů.

Čtecí RPC vrací všechny tři skupiny se zahrnutými i vynechanými testery.
Přepínání je okamžité bez závodu síťových odpovědí. Návraty zachovávají
původní první návštěvu a podmínku uplynutí celého UTC období. Identita botů
vychází z celé serverové historie, ne jen z načtené stránky návštěv.

Export obsahuje výběr provozu a seznam známých botích reporter ID, aby
import nezaměnil botí pokusy za hráče. Import nemění serverové zařazení.
Místní data bez načteného adresáře zařízení lze zobrazit přes Všichni;
neprokazatelné rozdělení se nezobrazuje jako hotové.

Ověřeno unit testy klasifikace a sdílených agregací a produkčním buildem.
SQL032 byla podle potvrzení uživatele spuštěna na živém serveru.

Uživatel 2026-10-16 potvrdil úspěšné provedení SQL032 na živém Supabase.
191 unit testů a produkční build prošly. Vizuální kontrola místního náhledu
skončila timeoutem integrovaného browseru; následovalo ověření veřejné verze a bundle.

## Stav po nasazení


2026-10-16 — Rozdělení analytiky Hráči/Boti/Všichni nasazeno na produkční web, commit b8e6788, GitHub Pages běh38927923908 úspěšný. Veřejná verze a nový balance bundle ověřené; uživatel potvrdil viditelnost přepínače. SQL032 podle jeho potvrzení nasazená. Nahrazuje starší stav pouze lokálních změn. Správnost živých součtů všech skupin dosud samostatně neověřená.

Veřejný version.json:1792166185372-b8e6788a2e12. Přepínač respektují všechny statistické přehledy i export. Interní testeři zůstávají samostatný filtr.
