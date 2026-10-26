# Francouzština — etapa 1, 26. 10. 2026

Pozdější stav: dokončen pracovní překlad až do kapitoly 8. Aktuální
navázání a zbývající práce jsou v `french-localization-stage-2.md`.

Uživatel zadal postupovat po částech, nejprve tři kapitoly. Veřejně zůstává
EN/CS/DE; FR má stav draft a je dostupná pouze ve vývojovém náhledu.

## Rozsah

- Kapitola 1 Loď: 29 úrovní, místnosti, venkovní opravy, HARD příprava,
  deník, odlet a příběhový přechod.
- Kapitola 2 Kepler Reach: 24 úrovní, Mine/Ice/Wreck/Haven, jejich
  deníky, skener, brána a příchod do Aster Veil.
- Kapitola 3 Aster Veil: 16 úrovní, bouée/lune brisée/monde verdoyant,
  srovnání záznamů, trasa a příběh přiblížení k Elysium.
- Společné ovládání, nastavení, energie, cíle, názvy kamenů, souhlasy,
  nápovědy, nálože, pomůcky, Undo, reklamní chyby a Android hlášky.

Celkem 69 úrovní. Katalog FR obsahuje 974 herních a 226 runtime ID,
se samostatným webovým katalogem dohromady 1364/2481 dostupných zpráv
v Android větvi. Duplicity a společné zprávy neodpovídají procentu příběhu.
V rámci této etapy se neimplementuje změna veřejného přepínače nebo
přenosové stránky. Web FR nadále otevírá anglickou hru.

## Konvence překladu

Ovládání tyká hráči; pilotův deník používá první osobu, radiové zprávy
zachovávají formální oslovení. Vlastní jména Haven, Kepler Reach, Aster
Veil a Elysium zůstávají. Tah = coup, kryt = capot de protection,
rezonátor = résonateur. Pulse/Nova/EMP zůstávají názvy mechanik.

Adaptér fr.js skládá game/web/runtime stejně jako již hotová němčina.
Společné produkční komponenty, souřadnice, CSS, pravidla a levely nebyly
změněny. Překladové ID jsou zachované.

## Ověření

- Unit audit všech textových polí oprav, deníků a přechodů kapitol 1–3:
  bez chybějících překladů, čísla zachovaná.
- Cíle všech 69 úrovní, také s uměle změněnými počty: francouzská gramatika
  zachovává živé počty; čísla nejsou natvrdo přepsaná.
- Všech 226 runtime zpráv přeloženo; parametry a francouzská množná čísla
  kontroluje stejný lokalizační audit jako vydané jazyky.
- 18 Chromium scénářů: sedm oblastí kapitol 2/3 na 320 a 430px včetně
  názvů, hvězd, klikatelnosti a replay; nápovědy na 320/430/1024,
  změna FR/CS/EN při rozehrané desce a zachovaná preference CS;
  úvod, nastavení a první oprava.
- 288 unit testů a produkční build prošly.
- Čtyři další Android-mode scénáře ověřily FR úvod, nastavení, první opravu,
  nápovědy a přepínání jazyka během rozehrané minihry.
- Vývojový Android-mode náhled používá Chromium, nikoli fyzický telefon.

## Pokračování

Příště kapitoly 4–6: Elysium, Trhlina a Živá mapa. Potom 7–10, kontrola
zbývajících menu a textových větví, převod uložené hry a úplný audit.
Před veřejným vydáním FR: robotický průchod všech 200 levelů, mobilní
kontrola a připravený návrat do EN/CS/DE. Dosavadní 1117 chybějících ID
v auditu odpovídá záměrně nedokončenému zbytku hry, nikoli hotovému vydání.

Vývojový náhled: `/?previewLanguage=fr` na lokálním Vite serveru.
Produkční sestavení parametr ignoruje; FR není veřejně dostupná.
