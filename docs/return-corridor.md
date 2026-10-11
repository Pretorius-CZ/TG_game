# Návratový koridor — návrh a hratelný prototyp

Stav 11. 10. 2026. Prototyp vznikl na `codex/return-corridor`; na žádost uživatele je nyní
přeneseno do produkční webové větve `codex/cockpit-stage`. Nasazení čeká na SQL029. Android příprava zůstává
na `codex/google-play`.

## Návaznost a rozsah

Po levelu 155 je Útočiště připravené, ale záchranná loď hlásí neprůchodný
návratový koridor. Nové souřadnice vedou do opuštěné stanice řízení provozu.
Hráč opraví její sledování, napájení, zábranu, majáky a chlazení. Finále
ověří bezpečné okno a pustí loď s modulem pro cestující skrz koridor.

Závěr: loď prošla posledním majákem a Útočiště převzalo závěrečné navádění.
Přistání, setkání s posádkou ani další základna nejsou v této lokaci
implementované. Mohou tvořit další krátké příběhové zakončení.

Kapitola 10 / Cesta domů, šest nových levelů 156–161. Původních 155 levelů
zachovává své pořadí, ID a parametry. Otevře se po celé ošetřovně (5/5),
včetně kontroly všech předchozích podmínek. Přímý vstup z ošetřovny a z
přehledu kapitol. Návrat vede do ošetřovny. Žádná nová měna nebo obchod.

## Levely a návrhová obtížnost

| Level | Oprava | Deska | Tahy | Cíle a mechaniky | Výhry automatu |
| --- | --- | --- | ---: | --- | ---: |
| 156 | Sledování trosek | 7×7 | 24 | 24 hranolů + 24 energií; rozjezd bez překážek | 91 % |
| 157 | Napájecí větev | 7×8, výřezy | 28 | 30 energií + 21 chladiv; 4 kryty | 81 % |
| 158 | Servisní zábrana | 7×8 | 30 | 24 filtrů + 24 energií; 4 kryty, rezonátor 3 | 71 % |
| 159 | Příletové majáky | 8×8, výřezy | 27 | 27 hranolů + 21 kapslí; 2 rezonátory po 3 | 91 % |
| 160 | Chlazení navádění | 7×8, zúžené kraje | 31 | 33 chladiv + 24 filtrů; 6 krytů | 63 % |
| 161 | Okno pro návrat · HARD | 8×8, výřezy | 30 | 27 hranolů + 27 energií + 24 kapslí; 3 kryty, 2 rezonátory po 4 | 63 % |

Jde o návrh pro hráčské ověření, nikoli odhad skutečné lidské úspěšnosti.
Simulace 100 pokusů/level, deterministické seed 1701–1800, automat hodnotí
okamžitý zisk barev, krytů, náloží a nabití rezonátorů. Používá aktuální
počáteční desku a ochranu cílových barev; nemá pomůcky ani +5 tahů a nezná
budoucí kameny. Majáky představují odlehčení před dvěma náročnějšími úkoly.
Spuštění: `node scripts/balance-return-corridor.mjs 100`.

## Texty a grafika

Šest bublin, výsledků a deníků v EN/CZ přímo v `src/returnCorridor.js`.
Příběh vysvětluje mechanickou závadu a pohyb trosek, nezavádí nového nepřítele
ani nemění identitu zachraňované výpravy. Modul s cestujícími vysvětluje,
proč potřebujeme prověřit šířku průletu a stabilitu navádění.

Vlastní portrétová grafika 941×1672: poškozená a opravená řídicí stanice.
Runtime WebP dohromady přibližně 734 KiB. Šest lokálních masek odhaluje opravy;
po dokončení všech úkolů se odhalí celá opravená scéna včetně volné trasy.
Používá známé dlaždice Útočiště. Rozložení značek je samostatné pro tuto scénu.

Grafika vznikla vestavěným imagegen: opotřebená ocel/bronz, tyrkysová a jantar,
klidný horní prostor pro ovládání, šest konzolí a výhled na trosky u zelené
planety. Opravený stav zachovává kameru a zařízení, obnovuje obrazovky,
chlazení, naváděcí světla a zprůchodňuje střed výhledu.

## Ukládání a nasazení

`returnCorridorCompleted` 0–6: místní uložení, validace, sloučení, reset,
čtené zápisy, hvězdy, katalog statistik. Replay postup nenavyšuje.
Starý serverový formát nesmí tiše zahodit nový postup.

Připravená migrace `supabase/029_return_corridor.sql` rozšiřuje postup,
povolené scény, reset a hodnocení. Běží v transakci a opravuje také zastaralý limit 150 hodnocení na 161.
Je kumulativní vůči herní SQL025;
analytiku SQL026–028 nemění. Na živé databázi nebyla spuštěna a živý cloud
není ověřený. Před nasazením klienta je nutné nasadit tuto migraci a ověřit
přenos nového postupu mezi dvěma zařízeními.

## Ověření a další rozhodnutí

- 180 unit testů prošlo po integraci: odemykání, pořadí, replay, sloučení,
  reset, překlady, hvězdy a generování 40 platných desek/level.
- Produkční build prošel. Dosavadní upozornění na velikost JS balíku zůstává.
- Izolovaný EN/CZ průchod všemi šesti úkoly přes vývojové dokončení, replay
  a reload prošel. Není to ruční odehrání všech miniher.
- Síťové požadavky mimo lokální server byly v browser testu blokované;
  testovací průchod nezapisoval do produkčních statistik.
- Před zveřejněním: osobně odehrát nové levely, zhodnotit tempo příběhu,
  provést SQL029 a ověřit cloud. Teprve potom sloučit do webové větve.
