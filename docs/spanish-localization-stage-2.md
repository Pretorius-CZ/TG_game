# Španělština — kapitoly 4–6, 27. 10. 2026

Pokračování první etapy podle dalšího zadání uživatele. ES zůstává
draft; veřejné EN/CS/DE/FR menu ani webové odkazy se nemění.

## Doplněný obsah

- Elysium: 24 úrovní v šesti sektorech, názvy oprav, myšlenky,
  výsledky, deníky, mapové názvy a příběh dalšího odletu.
- Fisura (Trhlina): 12 úrovní, izolace echa, plošina, stabilizační
  balizy, příběh a průlet, bezpečný návrat a první dojem z druhé strany.
- Živá mapa: 15 úrovní (živý anillo, výzkum Elysium, tichý repetidor),
  deníky, rezonátory, návrat k výzkumu a sestup do noční zahrady.

Přibylo 51 úrovní, celkem 120/200 v kapitolách 1–6. ES katalog má
1359 game ID a všech 226 runtime ID; včetně webu audit hlásí
1749/2481 zpráv v Android větvi, zbývá 732 nepřeložených ID. Jsou
mezi nimi i historické varianty dynamických cílů, nejde o počet úrovní.
Nemění se anglické zdrojové texty ani funkční údaje úrovní.

Překlad pokračuje v neutrální španělštině s tykáním v ovládání,
první osobou v denících a ustálenými termíny ficha/movimiento/
cubierta protectora/resonador. Pulse/Nova/EMP a vlastní jména se
nemění. Každá samostatná kombinace u rezonátoru přidává impulz,
i když se odehraje ve stejné vlně; popis odpovídá současným pravidlům.

## Ověření

- 295 unit testů prošlo. Nový audit kapitol 4–6 kontroluje textová
  pole, deníky, příběhové panely a zachování čísel. Žádný chybějící
  překlad v tomto rozsahu; všech 51 nových cílů otestováno i se
  změněnými počty. Dřívější audit 69 úrovní zůstává zelený.
- Dva hromadné Chromium scénáře prošly 19 expedičních oblastí
  kapitol 2–6 na 320 a 430 px (38 kombinací). Původní x/y podle
  dat, názvy, hvězdy, překryvy, nezakryté středy a okraje popisků.
- Izolovaný náhled prošel všech šest příběhových sekvencí jump,
  arrival, echo, rift, research a relay, všechny panely a pokračování.
  Běžný postup, energie, pomůcky, jazyk a statistiky zůstaly zachované.
- Samostatný scénář provedl první průlet Trhlinou: příběh, transit,
  skutečný příchod do beyond-rift, riftCrossed=1 a zachované opravy
  i hvězdy. Výchozí stav odpovídá dokončeným prvním pěti kapitolám.
- Regresní odlet lodi a vstup na první desku expedice prošly na
  320/430. Celkem čtyři příběhové scénáře.
- Android-mode: 19 oblastí na 320 px, šest příběhových sekvencí
  a průlet Trhlinou prošly ve třech scénářích. Jde o Chromium s
  Android adaptérem, nikoli fyzický telefon ani aktualizovanou APK.
- Lokalizační audit bez jiných problémů než očekávané chybějící
  položky draftu; webový i Android produkční build prošly.

Produkční změna je výhradně rozšíření ES katalogu. Žádné CSS,
souřadnice, komponenty hry, pravidla, limity, balanc, ukládání ani SQL.
Nová APK ani veřejné nasazení se v této etapě neprováděly.

## Pokračování

Lokální náhled stále používá
`/tests/browser/localization-preview.html?previewLanguage=es`.
Nyní jsou přeložené kapitoly 1–6; další mohou mít anglické fallbacky.
Organizační panel náhledu zůstává český, není součástí hráčského UI.

Další práce: kapitoly 7–8 (Noční zahrada a Útočiště, dalších 47 úrovní),
potom Archiv/Odpověď, samostatný přenos postupu a finální audit před
online testem a veřejným vydáním. Kontroly této etapy nenahrazují
skutečně odehraný robotický průchod ani redakci rodilým mluvčím.
