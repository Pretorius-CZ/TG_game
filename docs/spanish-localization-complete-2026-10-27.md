# Španělština — úplný překlad, 27. 10. 2026

Dokončení po etapách kapitol 1–3 a 4–6. Doplněny kapitoly 7–10:
Noční zahrada (20 úrovní), Útočiště a návrat (27), Archiv ozvěn (20)
a Odpověď (13), včetně deníků, příběhových panelů a závěru úrovně 200.
Přibylo zbývajících 80 úrovní; celkem 200/200, deset kapitol.

Katalog ES: 2091 game ID + 226 runtime zpráv a samostatný webový
katalog, dohromady 2481/2481 zpráv v Android větvi. Audit bez chyb.
Historické varianty číselných zadání jsou přeložené také; 107 položek
využilo již existující španělskou gramatiku cílů. Číselné cíle a jejich
konfigurace se nemění. Průchody/navigační popisky mají úplné názvy,
včetně čtyř pokračování v archivu, nikoli anglické zbytky za prefixem.

Přeložená samostatná stránka přenosu postupu: export, import, konflikty,
ověření, přerušený přenos, chyby i okno původní adresy. Vývojový
parametr previewLanguage=es se předává do tohoto okna. Původy,
nonce, validace záloh a pravidla slučování zůstávají původní. Draft
nepřepisuje uloženou veřejnou volbu jazyka.

## Ověření

- 296 unit testů prošlo. Úplný audit textových polí všech kapitol,
  deníků a přechodů; bez chybějících překladů a se zachovanými čísly.
  Cíle všech 200 úrovní se kontrolují i s uměle změněnými počty.
  Vlastní název Kepler Reach záměrně zůstává stejný a nemá samostatné
  zdrojové ID; není vydáván za přeložený výraz.
- 36 expedičních oblastí na 320/430 px, celkem 72 kombinací ve dvou
  hromadných Chromium scénářích. Původní x/y podle dat, čitelné názvy,
  hvězdy, žádné překryvy popisků, ořez mimo šířku či zakryté středy.
- 14 příběhových sekvencí v izolovaném náhledu, všechny panely až do
  závěru úrovně 200. Běžné kontrolní hodnoty postupu, energie, pomůcek,
  jazyka a statistik zachované.
- Regresní odlet a vstup do prvního expedičního puzlu na 320/430;
  skutečný průlet Trhlinou se zachováním hotových oprav a hvězd.
- ES přenos přes skutečné okno mezi dvěma místními původy: postup,
  energie 2/5, zásoby [0,1,0,0,1] a česká preference zachované,
  španělská chyba neplatné zálohy. FR (veřejná volba i náhled) a DE
  přenos prošly jako regrese společné stránky.
- Celkem deset závěrečných Chromium scénářů prošlo. Android-mode
  ověřil 36 oblastí na 320, 14 příběhů a průlet Trhlinou ve třech
  dalších scénářích. Jde o Chromium s Android adaptérem, nikoli APK
  nainstalovanou na fyzickém telefonu nebo Safari.
- Webový i Android produkční build a ochrana proti zapnutí ES draftu
  produkčním preview URL prošly.

## Stav a nasazení

ES je stále draft, veřejné menu EN/CS/DE/FR. Změny jsou místní; nová
APK ani veřejné nasazení se neprováděly. Změny v produkčním kódu jsou
ES katalog a doplnění ES textů přenosové stránky. Žádné CSS, pozice,
herní komponenty, pravidla, limity, balanc, uložená data ani SQL.

Izolovaný náhled:
`/tests/browser/localization-preview.html?previewLanguage=es`.
Celá první kapitola: `/?previewLanguage=es`.

Před online testem zpřístupnit ES v registru jazyků a releasové pojistce,
v testových očekáváních a slepém testu. V ES webových/právních textech
nahradit odkazy na anglické ovládání skutečnými ES názvy a změnit
informaci o anglické hře; nynější veřejný ES web stále otevírá EN a
jeho text tomu odpovídá. Přenést do webové větve, auditovat jejích
2475 ID (o šest nativních auth zpráv méně), pushnout obě větve a
nasadit game hosting z webového commitu. Ověřit živé ?lang=es.

Po nasazení úplný externí robotický/mobilní průchod. Současné testy
neznamenají, že byly všechny úrovně skutečně odehrány, a nenahrazují
jazykovou redakci rodilým mluvčím. Další plánovaný jazyk je PT-BR.
