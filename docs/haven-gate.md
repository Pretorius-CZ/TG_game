# Haven a cesta mezi soustavami

Implementace 2026-09-24. Haven se odemkne po dokončení Icebound Relay i
Drifting Archive (obě 6/6, nainstalovaný skener). Z mapy první soustavy
vede tlačítko Restore Haven. Stanice je další samostatná scéna na výšku.

## Šest oprav

| Krok | Oprava | Zásilka použitá při dokončení |
| --- | --- | --- |
| 1 | Outer dock | 1 materiál z archivu |
| 2 | Station power | 1 energie z ledové stanice |
| 3 | Gate alignment | žádná další |
| 4 | Energy coupling | žádná další |
| 5 | Destination coordinates | 2 datové archivy |
| 6 | Stabilize the jump gate | žádná další; HARD |

Každý krok má bublinu, minihru, obrazovou proměnu, vlastní deník a replay.
Prvních pět desek je 7×7, poslední 7×8; šest typů kamenů a boostery.
Kryty od třetího kroku (4), finále 8. Limity 24/25/28/28/29/34 jsou
výchozí návrh, ne výsledek kalibrace obtížnosti na hráčích.

Zásilky se odvozují z dokončených úkolů: replay nic znovu nespotřebuje.
Energie zásilky je oddělená od pěti energetických článků pro pokusy.
Po oživení stanice bránu napájí její reaktor. Čerpání ze slunce není potřeba.

## Průlet a návrat

Po šestém kroku se otevře světelný portál a tlačítko Jump to Aster Veil.
Průlet trvá přibližně 7 sekund, lze jej přeskočit nebo zrušit; respektuje
omezené animace. Dokončení zapíše jumpDone, zpřístupní deník příletu
 a přepne na mapu Aster Veil. Přerušení nic nespotřebuje.

Mapa má návratovou bránu do Haven a tři náznaky dalšího obsahu: Survey
buoy, Shattered moon a Verdant world. Tyto tři mise jsou výslovně
Coming next, zatím nehratelné. Návraty i další průlety jsou zdarma,
bez odebírání zásilek nebo herní energie.

Příběh: správce stanice udržoval útočiště v chodu; posádka výpravy
prošla bránou a nevrátila se. Záznamy z obou expedic rekonstruují cíl.
Hráč nyní může pokračovat a současně má bezpečnou cestu zpět.

## Ukládání a nasazení

Místní save obsahuje havenCompleted (0–6), jumpDone a scény haven/system2.
Validace vyžaduje dokončené předchozí expedice; sloučení zachová vyšší
postup, nový resetRevision naopak vymaže také stanici a průlet.

Pro cloud spustit **supabase/006_haven_gate.sql** v Supabase SQL Editoru.
Obsahuje rovněž změny 004/005, lze jej tedy spustit po 003 i pozdějších.
Starší SQL pak znovu nespouštět. Přímé zápisy nadále zakázané, RPC ověřuje
uživatele, používá zámek účtu a zachovává ochranu resetu.
Živé provedení 006 dosud není potvrzené. Při starém serveru klient nehlásí
nový postup jako cloudově uložený, místní kopii zachová.

## Soubory a grafika

Data src/haven.js, scény src/Exploration.jsx, průlet src/GateTransit.jsx.
Grafika public/scenes/haven-gate[-restored].png a optimalizované WebP.
Generováno imagegen: opuštěná orbitální stanice nad modrou planetou,
šest odlišných opravných zón, dominantní prstenec, žádné texty/UI.
Opravená varianta zachovává kompozici, rozsvěcí jednotlivé části;
portál je samostatný CSS efekt až po finále.

Ověření: 54 automatických testů a produkční build prošly. Izolovaný mobilní
průchod všemi šesti minihrami přes vývojové Complete level ověřil kryty,
deník, obrazové stavy a portál až po finále. Ověřeno zrušení, přeskočení,
automatický průlet i reduced-motion, návrat, reload a mapy 320/390 px.
Obtížnost skutečným hraním ani živý cloud SQL006 v tomto kroku ověřené nejsou.

2026-09-24: Průlet přepracován na perspektivní Canvas warp: 600 hvězd,
náběh pole, zrychlení do modrobílých stop, zpomalení a přílet. Bez SVG
lodičky. Canvas omezuje DPR na 2, při unmountu ruší RAF/observer;
reduced-motion používá statické pozadí a krátký přechod.
