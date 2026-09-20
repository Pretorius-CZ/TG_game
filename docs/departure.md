# Odlet — kapitola 1

Po 28 opravách a finálním HARD levelu se v kokpitu objeví Launch. Sekvence má odpojení hadice, zážeh, prolínačku do letového záběru a let za signálem (cca 10,5 s). Je přeskočitelná, při omezených animacích trvá 1,4 s. Jde o animované obrazové záběry, nikoli 3D model lodi.

Dokončení launchDone vyžaduje finaleDone a všechny opravy. Uloží se až při konci/přeskočení. Zavření či přerušení před koncem ponechá možnost start znovu spustit; replay neopakuje odměny. Závěrečný deník má stabilní ID departure-log. Další kapitola zatím není hratelná, opravenou loď lze navštěvovat.

## Supabase — nutný krok před publikací
Spustit celý supabase/002_departure.sql v SQL Editoru existujícího projektu. Bez této aktualizace je dokončení odletu jen místní; stávající opravy se synchronizují dál. Migrace zachová existující řádky, pouze rozšíří synchronizační funkci. Po migraci ověřit dokončení a deník na druhém zařízení.

## Grafika
Vestavěný imagegen, reference public/scenes/exterior-gear.webp. Zdroj public/scenes/departure-flight.png, optimalizovaný public/scenes/departure-flight.webp.
Prompt: Create a polished portrait 9:16 game cinematic frame of THIS EXACT repaired white orange supply spaceship lifting off, same cockpit nose left and two engine pods on right, consistent painted realistic sci-fi game style and same planet and purple night sky. Ship airborne high above rocky landing site, nose angled slightly upward left, landing legs retracted, engines emit long brilliant cyan blue exhaust streaming down-right, atmospheric dust low below ship. Compact integrated communications antenna, sealed hatch, cockpit warm lit. Ship centered at 48% image height with generous starry sky above and dark landscape below for UI. No text no UI. Preserve recognizable ship design. Dramatic hopeful departure.

Stav 2026-09-20: uživatel potvrdil spuštění migrace 002 v Supabase. Samostatný test odletu mezi zařízeními zbývá.
