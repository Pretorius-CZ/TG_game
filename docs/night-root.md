# Noční zahrada — Kořenová komora (131–135)

Třetí dávka kapitoly 8 navazuje po dokončení porostu 130. Pod živými kořeny zůstaly přístroje výpravy. Obnovíme bezpečné prostředí, přečteme její záznamy a navážeme hlasový kontakt se správcem. Výprava následovala průvodce dobrovolně; dveře umožňují návrat a kontakt neznamená past. Setkání se správcem 136–140 zůstává další plánovanou dávkou.

| Level | Úkol | Deska | Tahy | Cíle a překážky |
| --- | --- | --- | --- | --- |
| 131 | Dýchací průduchy | 7×8 | 25 | 27 chladicích náplní + 24 uzlů, 4 kryty |
| 132 | Záznam výpravy | 7×8, vykrojené rohy | 27 | 30 hranolů + 24 modulů, 4 kryty |
| 133 | Semenná komora | 7×8 | 28 | 30 semen + 24 náplní, 6 krytů |
| 134 | Kanál správce | 8×8 | 30 | 30 uzlů + 27 pylu, 4 kryty, rezonátor na 3 impulzy |
| 135 | Práh svatyně · HARD | 8×8 | 33 | 27 hranolů + 27 pylu + 24 semen, 8 krytů, rezonátory na 3 a 4 impulzy |

Stejná sada `night` zachovává šest známých typů; obměna dlaždic zůstává až pro Útočiště od 141. Limity jsou návrhy pro testery, nikoli garantovaná obtížnost. Nálože a pomůcky mají dosavadní pravidla.

## Prostředí a návaznost

Dvě nové portrétové WebP scény `night-root.webp` a `night-root-restored.webp`. Prompt výchozího obrazu: podzemní klenba z obrovských kořenů, opuštěné přístroje výpravy, bronzový průduch vlevo dole, konzole vpravo, skleněná semenná komora vlevo, kořenový kruh uprostřed a uzavřené oválné dveře vpravo vzadu. Modrá/fialová/tyrkysová atmosféra, jeden souvislý obraz, žádný text/UI. Opravená varianta je edit téže kompozice: otevřený průduch, funkční obrazovka, zdravá svítící semena, nabitý kruh a pootevřené dveře s teplým světlem. Originály zachované v generated_images; projekt používá optimalizované WebP.

Opravy odkrývají měkké místní masky bez ostrého rozdělení scény. Pět úkolů má EN/CZ bubliny, výsledky a deník. Porost po 5/5 přejde do komory; návrat vede do porostu. Elysium nabízí nejhlubší odemčený vstup. Replay nepřidává postup.

## Ukládání a kontrola

`nightRootCompleted` 0–5 je zahrnutý v lokálním postupu, slučování, resetu, deníku a analytickém katalogu. Vyžaduje porost 5/5 a všechny jeho předchozí podmínky. Celkem 135 jedinečných levelů.

Cloud potřebuje `supabase/020_night_root.sql`, kumulativní herní migraci včetně 018/019. Analytiku 016/017 nenahrazuje. Živé nasazení nepotvrzené; bez podpory nového pole hra nehlásí úspěšnou cloudovou synchronizaci.

Unit testy kontrolují pořadí, replay, reset, sloučení, odemknuté zápisy, EN/CZ, 30 stabilních hratelných desek na každý úkol a obsah migrace. Mobilní kontrola používá izolovaný profil a vývojové dokončení; neslouží jako měření lidské obtížnosti.

Ověřeno: 108 unit testů a produkční build prošly. Izolovaný mobilní náhled390×720 prošel vstup z porostu, všech pět oprav, reload obnovené scény, replay a načtení dlaždic bez chyb JavaScriptu.
