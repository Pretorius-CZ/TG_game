# Odpověď — dokončení příběhového oblouku na levelu 200

Připravené místně 18.10.2026. Uživatel schválil mezník level200 a zahájení implementace. Nová kapitola10 obsahuje přesně13 levelů188–200, navazuje na Archiv187. Produkce zůstává187 do provedení SQL034 a nasazení.

## Příběh

Zachráněná výprava už je doma v Útočišti. Archiv doložil lidský původ volání a jeho cestu starší záchrannou sítí. Hlavní stanici chybí ověřená zpráva o návratu, protože tři spojení byla přerušená. Žádný nový nepřítel, časový paradox ani nové pohřešované osoby.

1. **Sluneční maják188–190:** přehřátí vysílače; oddělit příjem a vysílání, ověřit směr čerstvým měřením. Přijetí dobré zprávy samo není doručení.
2. **Unášený retranslátor191–193:** poloha neodpovídá starému záznamu. Uchovat původní lidské volání, opravit časové hlavičky a smyčku. Starý paket není nová nouze.
3. **Zahradní maják194–196:** správce pomůže s místním zařízením, neumí sám opravit vzdálenou síť. Ověřit obousměrný kanál a trasu s Havenem, Elysiem a Útočištěm.
4. **Hlavní záchranná stanice197–200:** obnovit přijímací sál, propojit přijímač, porovnat záznamy a odeslat potvrzený návrat celé výpravy.

Level200 je Doruč odpověď. Operátor potvrdí zprávu; navigátor řekne „Jsme doma.“ Staré nouzové volání se uzavře, jeho historie zůstane zachovaná. Síť potvrdí bezpečnou cestu. Neprohlašujeme celou rozsáhlou síť za opravenou, ale tento záchranný příběh je uzavřený. Děkovný závěr a volné návraty/replay; žádný povinný cliffhanger.

Tři předěly: odlet za odpovědí3panely, přílet ke stanici3panely, potvrzené doručení4panely. EN/CZ, přeskočení a replay z kapitol, zhlédnutí pro profil/reset. Ukládání postupu na čtení nezávisí.

## Hratelnost

Známé nálože, kryty a rezonátory; nepřidáváme novou mechaniku ani ekonomiku. Čtyři nové oblasti mají3/3/3/4 oprav a13 deníků. Všechny původní167 položky katalogu ověřuje historický hash; dalších20 definic oprav Archivu porovnaných proti publikovanému HEAD shodných.

|Level|ID|Tahy|Výhry cíleného automatu|
|---|---|---:|---:|
|188|signal-solar-cooling|24|75 %|
|189|signal-solar-power|22|85 %|
|190|signal-solar-bearing|25|85 %|
|191|signal-orbit-alignment|25|79 %|
|192|signal-orbit-buffer|25|79 %|
|193|signal-orbit-clock|29|76 %|
|194|signal-garden-receiver|25|79 %|
|195|signal-garden-prism|25|83 %|
|196|signal-garden-handover|29|68 %|
|197|signal-station-arrival|23|94 %|
|198|signal-station-receiver|28|66 %|
|199|signal-station-verification|30|76 %|
|200|signal-station-answer|26|94 %|

100 her/level, bez pomůcek a reklamních pokračování. Nejde o odhad garantované lidské úspěšnosti. Poslední level je záměrně přívětivější než předchozí dvě opravy, aby závěrečná odměna nebyla zamčená za náhlým skokem obtížnosti. Výsledky: signal-balance-2026-10-18.json; skript scripts/balance-signal.mjs.

## Ukládání a nasazení

Nová pole signalSolarCompleted0–3, signalOrbitCompleted0–3, signalGardenCompleted0–3, signalStationCompleted0–4. Odemčení vyžaduje archiveCoreCompleted5 a postupné dokončení předchozích spojení. Normalizace/merge/reset/hvězdy/deník/scény rozšířené; starý postup se nemaže. SQL034 zachovává vyšší postup i při přihlášení staršího klienta, resetRevision chrání před obnovením po resetu. Objekty resetu rozdělené kvůli limitu100 parametrů PostgreSQL.

**Před zveřejněním spustit celý supabase/034_signal_answer.sql v Supabase SQL Editoru.** Herní migrace navazuje031, na analytické032/033 nesahá. Generátor scripts/generate-signal-migration.mjs. Izolované ověření přes scripts/check-signal-migration.mjs (PGlite z .local/sql-check podle analytics-privacy.md). Testuje přechod187→200, hvězdy, starého klienta, reset a předpoklady; živý Supabase přenos musí následovat po uživatelském provedení SQL.

## Grafika a prompty

Vestavěný image_gen podle skillu imagegen. Čtyři nové PNG originály vznikly v Codex generated_images; finální herní WebP v projektu:
- public/scenes/signal-solar.webp — 768×1152,108998B.
- public/scenes/signal-orbit.webp — 768×1152,129212B.
- public/scenes/signal-garden.webp — 768×1152,188702B.
- public/scenes/signal-station.webp — 768×1152,154360B.

SVG/CSS jen ukazuje skutečně dokončené systémy a obnovenou trasu přes rasterové scény místností. Bez zbytečného neustálého efektu při reduced-motion. Není to náhradní obraz scény.

Specifikace promptů: jedna soudržná scéna2:3, malířská filmová realistická sci-fi herní grafika, funkční zařízení, tmavé námořnické stíny, střídmé praktické světlo, odlišná neaktivní zařízení pro hotspoty, klidný horní prostor, žádný text/UI/loga/panely/lidé. Sluneční přístřešek na pustém měsíci: okno s anténou a sluncem, chlazení vlevo, napájení vpravo, ruční konzole uprostřed. Orbitální servisní kabina u modrého plynného obra: nakloněné okno, anténa a vzdálené trosky, ovládací kola/paměťová konzole/časový přijímač. Zahradní observatoř: organické rozvody chrání oddělené zařízení, přijímač/hranol/vysílač, fialová a mátová bioluminiscence, žádné monstrum. Centrální stanice: vysoký přijímací sál s oknem do vesmíru na vzdálený prstenec, příletové ovládání/přijímač/ověřovací stůl/kruhová přenosová konzole, zlaté a modré světlo, klidný přílet.

Závěrečné předěly znovu používají schválené obrazy posádky a opravené lodi departure-flight; nevracejí hráče k obrázku havarované lodi.

## Ověření dokončené implementace

237unit/build/diffcheck prošlo. Původní katalog187 ověřen proti publikovanému základu hashem cd3c869d8eb22ac0d6e691bdd824a0eda0c9adb38f8487cb9ea613b3e3cfadc3. Čtyři mobilní průchody Chromium/WebKit EN/CZ:13oprav přes preview, skutečné klikání na každý hotspot v mezích displeje, tři předěly, finále200, replay bez navýšení postupu, reload. Další dvě kontroly vykreslily všech13skutečných desek a provedly jeden platný tah na každé. Nejde o ruční odehrání všech13her; jejich obtížnost zkoumá popsaná simulace. Obraz závěru320px/WebKit zkontrolovaný, bez překrytých oprav. SíťSupabase byla vUItestech blokovaná; žádné testovací zápisy doživé databáze. SQLověřeno izolovanýmPostgreSQL, uživatelské živé provedení a následnénasazení zbývá.

2026-10-18 — Uživatel potvrdil nasazení SQL034 a výslovně zadal push. Předchozí poznámky o čekání na SQL již neplatí. Připravuje se zveřejnění levelů188–200 na obou doménách; živý přenos nového postupu mezi účty/zařízeními zatím nebyl samostatně ověřen.
