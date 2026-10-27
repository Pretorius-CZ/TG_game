# Španělština — první tři kapitoly, 27. 10. 2026

Na schválené pokračování FR → ES → PT-BR navazuje první etapa ES.
Rozsah je společné ovládání a první tři kapitoly, nikoli celá hra.
ES zůstává draft; veřejné menu má EN/CS/DE/FR. Žádné nasazení.

## Přeložený obsah

- Loď: všech 29 úrovní, místnosti, navigace, exteriér, předletová
  kontrola, deníky, odlet a jeho příběhový přechod.
- Kepler Reach: 24 úrovní, mina/repetidor/archivo/Haven, deníky,
  skener, brána a přílet do Aster Veil.
- Aster Veil: 16 úrovní, boya/luna fracturada/mundo verde, deníky,
  porovnání záznamů, trasa a příběhová aproximace k Elysium.
- Společné ovládání, nastavení, účet, lokální/cloudové ukládání,
  energie, cíle, názvy kamenů, statistiky a souhlasy, pomůcky,
  nálože, nápovědy, Deshacer (Undo), reklamní chyby a Android hlášky.

Celkem 69 úrovní. ES má 1038 game ID a všech 226 runtime zpráv;
se samostatným webovým katalogem audit hlásí 1428/2481 zpráv
v Android větvi. Zbývajících 1053 chybějících ID jsou nedokončené
kapitoly a další varianty textů, nikoli opravené nebo potlačené chyby.
ES adaptér slučuje game/web/runtime stejně jako FR.

Neutrální španělština, oslovení tú v ovládání; pilotův deník v první
osobě. Tah = movimiento, dlaždice = ficha, ochranný kryt = cubierta
protectora, rezonátor = resonador. Pulse/Nova/EMP a vlastní názvy
Haven/Kepler Reach/Aster Veil/Elysium zůstávají. Krátké názvy Cambiar,
Riego a Luz del vivero se vejdou do původního mobilního rozložení;
podrobnosti zůstávají v zadání a nápovědě.

## Ověření

- 294 unit testů prošlo. Audit textových polí oprav, deníků a přechodů
  prvních tří kapitol bez chybějících překladů; zachovaná čísla.
- Cíle všech 69 úrovní zachovají i uměle změněné počty. Runtime
  ověřuje parametry, španělská množná čísla a přístupné souřadnice.
- 18 Chromium scénářů: sedm oblastí kapitol 2/3 na 320/430 px,
  jména, hvězdy, klikatelnost, opakování a okraje popisků; všechny
  nápovědy na 320/430/1024; úvod, nastavení a první oprava.
- Dva další hromadné scénáře sedmi oblastí na 320/430: původní x/y,
  žádné překryvy nebo zakryté středy popisků. Rozměry a souřadnice
  se ověřují proti konfiguraci oprav, nikoli proti náhradní mřížce.
- Tři příběhové scénáře: izolovaný náhled příletů Aster Veil/Elysium,
  odlet a přechod na první desku expedice na 320/430. Běžné kontrolní
  hodnoty postupu, energie, pomůcek, jazyka a statistik zachované.
- Sedm Android-mode scénářů ovládání/příběhu prošlo. Jde o Chromium
  s Android adaptérem, nikoli nainstalovanou APK na fyzickém telefonu.
- Lokalizační audit a produkční build prošly. Produkční test potvrzuje,
  že ani preview URL nepovolí nedokončenou ES běžným hráčům.

Neměnily se herní komponenty, CSS, souřadnice, ID úrovní, limity,
balanc, pravidla, save model ani Supabase. Produkční změny jsou pouze
ES katalogy a jejich adaptér. Web ES nadále správně otevírá EN hru.

## Náhled a pokračování

První kapitola: `/?previewLanguage=es`.
Izolovaný náhled: `/tests/browser/localization-preview.html?previewLanguage=es`.
V něm používat kapitoly 2–3; další kapitoly mohou mít anglické fallbacky.
Organizační panel náhledu je česky a není součástí hráčského UI.

Příště pokračovat kapitolami 4–6 (nebo podle dalšího zadání). Před
veřejným vydáním dokončit 200 úrovní, samostatný přenos postupu,
navazující názvy ovládání v návodech a právních stránkách, úplný audit
a externí robotický/mobilní průchod. Dosavadní kontroly neznamenají,
že člověk či robot již všech 69 úrovní skutečně odehrál.
