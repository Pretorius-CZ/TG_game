# Příletový dok — kapitola 11 / Vítejte doma

Lokální obsah na webové větvi, 14. 10. 2026. Šest nových levelů 162–167 po Návratovém koridoru6/6. Dosavadních 161 levelů zachovává ID, pořadí i parametry.

## Příběh

Záchranná loď prošla koridorem, nyní se připojí k Útočišti. Ošetřovna i pokoje jsou už připravené: opravujeme jen nástupní most. Poslední průlez otevře přístup zachráněné posádce, která je v bezpečí. Zdroj signálu se nepřepisuje a žádný nový nepřítel nepřibývá.

## Levely

| Level | Úkol | Tahy | Cíle | Kryty / rezonátory | Simulace |
|---|---|---:|---|---|---:|
|162|Převzetí lodi|25|24 hranolů,21 energií|bez překážek|97%|
|163|Dokovací svorky|29|27 energií,21 hranolů|2 regulátory×3|97%|
|164|Napájení mostu|28|30 energií,21 kapslí|4 kryty|70%|
|165|Vyrovnání tlaku|32|24 filtrů,24 chladiv|4 kryty,2 regulátory×3|60%|
|166|Vzduchové filtry|30|30 filtrů,24 kapslí|6 krytů|77%|
|167|Vstupní průlez HARD|27|24 hranolů,24 energií,24 filtrů|3 kryty,2 regulátory×4|57%|

Simulace30 pokusů/level cíleným automatem, bez pomůcek a bonusových tahů. První náhled obtížnosti, nikoli předpověď lidské úspěšnosti. `node scripts/balance-refuge-arrival.mjs 30`.

Nezavádíme nové pravidlo jádra: párové regulátory znázorňují bezpečnost dokování, opakované využití známé mechaniky s jiným uspořádáním. Pět běžných úkolů a finále tvoří vlnu obtížnosti.

## Scéna a texty

Vlastní portrétová galerie s výhledem na připojenou loď, šest zařízení v pevných místech. Dva imagegen stavy WebP, postupné lokální odhalování změn; celý otevřený průlez a cestující se zobrazí po dokončení. Všechny bubliny, cíle, výsledky a šest zápisů jsou EN/CZ v src/refugeArrival.js.

## Ukládání a produkce

`refugeArrivalCompleted`0–6: normalizace, předpoklady, sloučení, reset, deník, hvězdy, kapitoly a analytický katalog. Kapitola11 má přímý vstup po dokončení koridoru, návrat do koridoru a replay zařízení. Herní cloud nesmí nový postup tiše zahodit.

Nejdřív spustit `supabase/030_refuge_arrival.sql` v Supabase SQL Editoru; kumulativní migrace rozšíří scény, limit hodnocení167, reset a předpoklady. Analytická SQL026–028 zůstává zachovaná. Migrace dosud není živě nasazená. Produkční push až po potvrzení jejího provedení.

## Ověření

183 unit testů prošlo: přístupnost kapitoly, zákaz přeskočení, replay, uložení/sloučení/reset, hvězdy, překlady a platné otevírací desky. Build prošel, velikost JS má dosavadní upozornění. Browser ověření používá pouze lokální prostředí a vývojové dokončení; osobní hraní a cloud mezi skutečnými zařízeními zůstávají pro následné ověření.

Aktualizace 14.10.2026: uživatel potvrdil dokončení SQL030. Dřívější stav čekání na migraci je překonaný; následuje autorizovaný produkční push. Živý cloud mezi zařízeními ještě samostatně neověřen.
