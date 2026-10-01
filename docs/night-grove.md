# Noční zahrada — Světélkující porost (126–130)

Druhá dávka kapitoly 8 navazuje na dokončenou přistávací mýtinu (125). Hráč obnoví vodní kanály, přečte odpověď pylu a otevře sestup ke kořenové komoře. Výprava zahradu pozorovala šetrně; signál obsahuje její identifikátor a stopu ke správci pod porostem. Kořenová komora 131–135 zatím není implementovaná.

| Level | Úkol | Deska | Tahy | Cíle a překážky |
| --- | --- | --- | --- | --- |
| 126 | Terénní vzorkovač | 7×8 | 25 | 24 navigačních hranolů + 24 pylu |
| 127 | Vodní kanály | 7×8, vykrojené rohy | 27 | 30 chladicích náplní + 24 kořenových uzlů |
| 128 | Odpověď pylu | 7×8 | 28 | 30 pylu + 24 semen, 6 krytů |
| 129 | Rezonátor porostu | 8×8 | 30 | 27 modulů + 27 uzlů, 4 kryty, rezonátor na 3 impulzy |
| 130 | Kořenový průchod · HARD | 8×8 | 33 | 27 hranolů + 27 pylu + 21 uzlů, 8 krytů, rezonátory na 3 a 4 impulzy |

Všech pět používá stejnou sadu `night` jako konec mýtiny. Nové dlaždice nepřidáváme po každé dávce; další obměna zůstává plánovaná pro Útočiště od 141. Tahy jsou výchozí návrh k ověření testery, nikoli potvrzená lidská obtížnost.

## Grafika a návaznost

Dvě generované portrétové scény `public/scenes/night-grove.webp` a `night-grove-restored.webp`. Výchozí prompt: mimozemský noční porost s průsvitnými obřími listy, terasovým chodníkem, vzorkovačem vpravo dole, suchou nádrží vlevo, uzavřeným zlatým květem vpravo, kruhovým rezonátorem uprostřed a kořenovým obloukem vlevo v pozadí. Modrá, tyrkysová a fialová, bez UI/textu, portrét 9:16.

Opravený obraz je edit stejné kompozice: aktivní vzorkovač, proudící tyrkysová voda, otevřený pylový květ, světelný kruh a osvětlený sestup. Jednotlivé úkoly odkrývají měkké místní masky, po 5/5 se zobrazí celý opravený obraz. Originály zůstaly v generated_images; projekt používá optimalizované WebP.

Dokončení mýtiny nabídne vstup do porostu. Návrat vede do mýtiny; nejhlubší odemčený vstup nabízí také mapa Elysia. Každý úkol má EN/CZ bublinu, výsledek a deník. Replay nezdvojuje postup.

## Ukládání a ověření

`nightGroveCompleted` 0–5 je zahrnutý v místním ukládání, resetu, slučování, deníku a analytickém katalogu. Přístup vyžaduje mýtinu 5/5. Celkem je nyní 130 levelů.

Cloud vyžaduje `supabase/019_night_grove.sql`. Migrace zahrnuje herní změny z 018; analytiku 016/017 nenahrazuje. Živé provedení dosud nepotvrzeno. Při chybějící serverové podpoře aplikace nehlásí úspěšné cloudové uložení nových kroků.

105 unit testů prošlo. Kontroly pokrývají pořadí, validaci/reset/slučování, překlady a 30 stabilních hratelných desek na úkol. Izolovaný mobilní prohlížeč 390×720 ověřil přechod z mýtiny, všech pět úkolů přes vývojové dokončení, obnovení po reloadu, replay a načtené obrázky dlaždic. Lidská obtížnost zbývá k otestování.
