# Měření reklamních návštěv

Spustit celý `supabase/026_campaign_tracking.sql` v Supabase SQL Editoru
(vyžaduje existující analytiku 016). Nemění postup ani přihlášení.
Poté nasadit web a otevřít reklamní URL:
`https://playbeyondthesignal.com/?utm_source=reddit&utm_medium=paid_social&utm_campaign=launch_012`.
Správce v balance.html uvidí sekci Návštěvy a reklamní kampaně.

Relace je místně zachována při refreshi, aktualizaci a přihlášení.
Nová po 30 minutách neaktivity nebo jiné výslovné kampani.
Přímý návrat v aktuální relaci přebírá původní zdroj. Zařízení znamená
pseudonymní prohlížeč, nikoli osobu. Přenos mezi zařízeními není sledován.
Spuštění znamená otevření minihry s energií; výhra alespoň jeden vyhraný
level v relaci, pokračování alespoň dva různé spuštěné levely.
Retry je nový pokus; +5 tahů a aktualizace výsledku tentýž pokus nepřičítají.
Neukládá se úplná adresa, referer, e-mail ani OAuth parametry.

Samostatná místní fronta nejvýše 100 relací zachová neodeslaná data;
opakované odeslání používá UUID a rostoucí revizi. SQL ověřuje soukromý
token existující identity analytiky, omezuje payload a nové relace na
300 denně na zařízení. Tabulka nepřístupná přímo, agregace jen správci.
Blokovaný storage/síť nebo zavření před odesláním mohou způsobit podměření.
Historické návštěvy ani původ reklamních kliknutí zpětně rekonstruovat nejdou.

`gameVersion` slouží k obejití starého HTML při automatickém obnovení.
Po načtení se odstraní pomocí history.replaceState bez dalšího reloadu;
UTM, ostatní parametry a fragment zůstanou zachované.

2026-10-06: uživatel potvrdil provedení SQL026 v Supabase.
