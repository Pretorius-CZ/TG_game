# Zhasínající svět — retranslační stanice

Implementováno lokálně 2026-09-30. Po dokončení Živé mapy (výzkum na
Elysiu 5/5) vede grafický vstup stanice do scény `fading-relay`.

| Úkol | Deska | Tahy | Rezonátory |
| --- | --- | --- | --- |
| Probuď signální rezonátor | 7×7 | 24 | 1×2 impulzy |
| Nasměruj anténu | 8×8 | 27 | 2×2 impulzy |
| Obnov přerušenou zprávu | 7×7 | 29 | 1×3 impulzy |
| Zajisti sestupový koridor — HARD | 8×8 | 32 | 2×3 impulzy |

Rezonátor je pevné zařízení v otvoru desky. Nabíjí jej přirozené spojení
na sousedním poli ve stejném řádku nebo sloupci. Jedna vlna spojení přidá
nejvýše jeden impulz každému sousedícímu zařízení. Diagonály ani přímý
zásah náloží či pomůckou jej nenabíjí; následné přirozené kaskády ano.
Výhra vyžaduje také nasbírat cílové dlaždice a rozbít případné kryty.
Nabití přežije promíchání a pokračování za +5 tahů; nový pokus je resetuje.

Použita sada výzkumných dlaždic, vlastní generovaná portrétová scéna,
postupné světelné proměny a čtyři dvojjazyčné zápisy deníku. Příběh
odhaluje lidský signál a cestu přes Noční zahradu k útočišti výpravy.
Noční zahrada a útočiště zatím nejsou hratelné. Po čtvrtém úkolu návrat
na Elysium; dokončené úkoly lze opakovat.

Postup `relayCompleted` (0–4) se ukládá místně. Pro cloud je připravena
kumulativní migrace `supabase/015_relay.sql`, zahrnující zahradu a výzkum
z migrací 013/014. Živé nasazení nebylo potvrzeno.

Ověření: 91 testů, produkční build, mobilní průchod všemi čtyřmi úkoly,
uložení/reload/replay, skutečné nabití sousedním spojením a zachování
náboje po reklamě za +5 tahů. Ovládání ověřeno také při 320×568.
Limity tahů jsou výchozí návrh pro další hráčské ladění.

Po zpětné vazbě: dvě zařízení používají plnou desku 8×8, rozestoupená diagonálně. Tahy a cíle zachovány. První úkol ukazuje vysvětlení, dostupné znovu přes ◎ ? u cíle. Sousední políčka nenabitých zařízení jsou zvýrazněna; nabití má impulz a +1 (900 ms, bez pohybu při reduced-motion).
