# Hodnocení levelů hvězdami

Implementace 2026-10-05, společná pro všech 150 miniher.

- 1 hvězda: dokončení.
- 2 hvězdy: zbývá alespoň ceil(15 % původního limitu).
- 3 hvězdy: zbývá alespoň ceil(30 % původního limitu).
- Původní limit a skutečně spotřebované tahy určují hodnocení. +5 tahů nezvyšuje počet zbývajících tahů pro hodnocení. Výhra po spotřebování původního limitu je za jednu hvězdu. Pomůcky a nápověda hvězdy nesnižují.

Hvězdy se zobrazí na výsledku minihry a pod názvem dokončeného zařízení. Nabídka kapitol má součet získaných hvězd a maximální počet; zvlášť zůstává počet dokončených úkolů. Hvězdy neblokují postup.

Přístupová trasa Elysium a odletový test mají tlačítka pro opakování v rozbalené nabídce příslušné kapitoly. Ostatní levely se opakují kliknutím na hotové zařízení.

## Ukládání

Pole `stars` v herním postupu mapuje stabilní ID levelu na 1–3. Záznam se přidá při potvrzení skutečné výhry. Místní normalizace přidělí všem dokončeným starým levelům jednu hvězdu, odstraní neznámé/neodemčené výsledky a omezí hodnoty. Horší replay nesnižuje výsledek. Sloučení stejné generace bere maximum; resetRevision chrání nový restart proti starému zařízení. Preference a účty používají dosavadní oddělené ukládání. Změna limitu již získané hvězdy nesnižuje.

Cloud vyžaduje spuštění `supabase/024_star_ratings.sql`, kumulativní migrace včetně 023. Server atomicky slučuje nejlepší hodnocení pouze pro dokončené známé levely, doplní jednu hvězdu starým levelům a resetuje mapu při restartu. SQL nebylo v živé databázi spuštěno ani ověřeno. Bez migrace se místní lepší hodnocení neztratí; klient upozorní stavem nesynchronizovaného postupu.

Při přidání dalších levelů rozšířit serverový seznam (ID, klíč postupu, pořadí opravy) v další migraci. Frontend používá společný katalog; test kontroluje shodu všech 150 ID se SQL.

## Ověření

147 unit testů a produkční build. Pravidla zaokrouhlení, pokračování nad původní limit, migrace starého postupu, maximum v obou směrech merge, reset a úplnost 150 levelů. Izolovaný prohlížeč 390×780: skutečný match → tři hvězdy → potvrzení a aktualizace nejlepšího výsledku; hotové hotspoty, součty kapitol a replay odletového testu. Živý přenos mezi dvěma účty/zařízeními čeká na SQL.
