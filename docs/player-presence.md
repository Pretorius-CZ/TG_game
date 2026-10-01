# Živá aktivita testerů a přizpůsobení scén

## Nasazení
Spusť v Supabase SQL Editoru supabase/017_player_presence.sql (vyžaduje již nasazenou 016). Potom nasadit frontend. Stávající balance_admins platí i pro nové statistiky, žádná změna přihlašování.

Hra posílá pseudonymní odezvu každých 45 sekund, pouze je-li karta viditelná a zařízení online. Účet není nutný. Dashboard sám odezvu neposílá, jeho otevření nenavyšuje počet hráčů. Používá se dosavadní náhodná identita analytiky; neposílá se e-mail ani jméno.

Dashboard čte souhrn každých 30 sekund (jen viditelná karta). Aktivní nyní = odezva v posledních dvou minutách. Aktivní dnes = zařízení s odezvou od půlnoci UTC. Zařízení celkem zahrnuje i starší reportéry výsledků. Pokusy dnes = záznamy založené dnes UTC, pokračování stejného pokusu nezvyšuje počet. Nejde o unikátní lidské osoby: jiný prohlížeč, nové zařízení či smazané úložiště vytvoří jinou identitu. Viditelná hra zahrnuje menu a pohled na kapitolu. Po zavření může hráč zůstat v počtu nejvýše dvě minuty. Při chybě API se zobrazí nedostupnost, nikoli falešná nula. Přehled čte jen správce přes RPC; přímý přístup do tabulek zůstává zakázaný RLS migrací 016. Klientská telemetrie není nástroj ochrany proti botům.

## Mobilní výška
useSceneFit sleduje visualViewport, změny velikosti a aktuální scénu. Zachovává celou grafiku i její proporce a zmenší pouze scénu podle zbývajícího prostoru pod hlavičkou a nad uložením. Dialogy miniher se nemění. Na extrémně malém displeji se současně zmenší scéna i její popisky; další reálné testy čitelnosti jsou vhodné.

Ověřeno v izolovaném prohlížeči šest portrétových scén při 393×650 a při 320×568, bez svislého přesahu; zachován poměr 9:16. Build prošel. SQL na živém projektu musí provést uživatel, živé počty před tím nejsou dostupné.
