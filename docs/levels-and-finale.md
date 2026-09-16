# Tahy, led a finální zkouška — 2026-09-15

Implementováno v src/levelRules.js a MiniGame.jsx.

- Každý level má limit tahů. Neplatná výměna nic nestojí; platná jeden tah.
  Kaskády jsou zdarma a dokončí se před vyhodnocením výhry/prohry.
  Výhra posledním tahem má přednost před vyčerpáním tahů.
- Běžné limity jsou výchozí pro ladění: libovolné kameny ceil(cíl/2)+10,
  barevné cíle ceil(cíl*1.5)+12. Přepsat lze polem moves v opravě.
- Po vyčerpání: Retry level resetuje pokus, Continue +5 moves zachová desku
  a cíl. Pokračování je nyní zdarma a takto označené; reklama není zapojená.
  Bez životů a čekání. Complete level zůstává v lokálním vývojovém náhledu.
- Led drží kámen na místě, brání výměně, spojení i průchodu gravitace.
  Sousední spojení (pouze čtyři směry) jej rozbije. Kámen zůstane a může
  být spojen následně. Rozbití ledu samo nezvyšuje počet sebraných kamenů.
- Galley / Cold storage zavádí 4 bloky ledu. Výhra vyžaduje cíl i všechen led.
- Po všech 25 opravách je v kokpitu Final challenge · HARD: 7 × 8, šest typů,
  osm bloků ledu, 70 kamenů, 18 tahů. Úspěch potvrdí dokončení startovní
  zkoušky. Samotná animace odletu stále zbývá; kapitola 2 ještě není hratelná.
- Při neexistenci platného tahu automaticky nová hratelná deska bez spotřeby
  tahu, zachování cíle a počtu/pozic nerozbitého ledu.

## Ovládání

Textová navigace pod scénou a spodní přehled připravenosti odstraněny.
Nahoře přímo ve scéně ikony Zpět, Mapa lodi a Deník. Mapa je modální dialog
s přehledem postupu; kliknutí na oblast ji otevře. Dveře ve scénách zůstávají.
Replay místnosti pod ikonou ↻ ve scéně. Zvukové ovládání je samostatné.

## Ladění a ověření

100 náhodných her na každý level, chamtivý automat vybírající okamžitě
nejlepší cíl/rozbití ledu: běžné levely 95–100 % výher bez prodloužení.
Finále s 18 tahy 79/100. Jde o kontrolu dosažitelnosti a počáteční ladění,
ne záruku výhry každé náhodné hry ani měření lidské obtížnosti.
20 unit testů; prohlížeč: všech 25 oprav přes mapu s testovacím dokončením,
odemčení finále, led, vyčerpání posledního tahu, +5 tahů a výhra posledním tahem.

## Ukládání

Na přání uživatele odloženo až po designu a herní logice. Supabase zatím
není napojená a postup stále není trvale uložený. Stávající účet lze použít;
každý projekt má vlastní Postgres databázi. Free má limit dvou aktivních
projektů dle https://supabase.com/docs/guides/platform/billing-faq

## 2026-09-15 — Životy a další ladění

Led až při třetí opravě: crew-bunk, galley-racks, engine-power,
airlock-hull-panels, nav-chart (4 bloky). Kokpit bez ledu. Galley cold
storage jej už nemá. Finále nadále osm bloků.

Maximálně 5 životů, srdce přímo ve scéně i minihře. Výhra neodebírá život.
Vyčerpání tahů odebere jeden; následný odchod jej neodebere podruhé.
Odchod po alespoň jednom platném tahu také jeden, před prvním tahem žádný.
Na nule nelze začít nový pokus, retry je zamčené. Výchozí návrh obnovy:
jeden život / 30 minut, max.5, odpočet viditelný. Životy a čas obnovy se
ukládají lokálně i přes refresh (opravy stále ne). Nákup/refill připraven
jako nedostupná možnost bez ceny a bez falešné platby; platební služba chybí.
Dev náhled má explicitní Preview refill a +5 moves; produkce ne.

Limity pevné podle levelu, ne podle nákupů. Simulace 100 her/level:
tutoriál 100 %, běžné 81–100 %, strojovna s barevnými cíli 87–92 %,
navigační mapa 88 %, finále 78 %. Automat hodnotí okamžitý zisk/led;
nejde o garantovanou lidskou úspěšnost. Čísla dál ladit hraním.
Ověřeno 22 unit testů, build, pět proher → 0 životů, zákaz retry na nule,
persistování životů přes refresh. Obnovu v čase ověřují unit testy.
Vizuální úprava: srdce nahrazena pěti cyan energetickými články v modulu ENERGY. Vyčerpané články jsou tmavé/šrafované, dostupné září. Počítadlo 0–5 a odpočet obnovy zachovány; v UI názvy energy/charge. Jde o stejný systém pokusů, ne další měnu.

## 2026-09-16 — Průhledné ochranné kryty místo ledu

Krytý kámen je vidět a účastní se řady alespoň tří stejných symbolů,
ale nelze s ním pohybovat. Spojení, které ho zahrnuje, odstraní kryt;
samotný kámen zůstane na místě a nezapočítá se do cíle. Další spojení
(včetně následné kaskády) jej už může sebrat. Pouhé sousední spojení
kryt nepoškodí. Kovový rámeček, průhledný prasklý panel a jantarová kontrolka
nahrazují sněhovou vločku. Interní názvy ice zůstávají pro kompatibilitu.

Počet tahů je výrazně nad deskou vedle energie; posledních pět je jantarových.
Kryty stále až ve třetích opravách, tutoriál bez nich. Nové limity:
ubikace 33, police 38, strojovna napájení 44, plášť 34, mapa 44.
Finále má osm krytů, 70 kamenů a 48 tahů (nahrazuje původních 18).
Simulace 100 her na level jednoduchým chamtivým automatem: třetí opravy
76–88 %, samostatná simulace finále 57 %. Jde o orientační HARD obtížnost,
nikoli lidskou úspěšnost nebo garanci řešení; dále ověřovat hraním.
