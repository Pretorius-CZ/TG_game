# Návrat na Elysium a Zhasínající svět

## Hratelná první etapa — 2026-09-30
Po zahradě 6/6 vede pokračování do nového výzkumného sektoru Elysia.
Na mapě stanice je samostatný klikací vstup. Původních šest sektorů
zůstává dokončených; výzkum nemění podmínky starších kapitol.

Pět miniher, každá s bublinou, výsledkem, deníkem EN/CZ a odhalením
příslušné části laboratoře:
1. Připojit semenný archiv — 23 tahů, 7×7.
2. Připravit komoru pro vzorek — 24 tahů, 7×7 s vykrojenými rohy.
3. Rozluštit živou mapu — 27 tahů, 7×7, čtyři kryty.
4. Vystopovat lidský signál — 29 tahů, 7×8, čtyři kryty.
5. Vytyčit záchrannou trasu — HARD, 32 tahů, 7×8, osm krytů.

Výzkum ukáže, že jas bodů mapy označuje stav vzdálených zahrad.
Pohasínající bod obsahuje volací znak ztracené výpravy.
Finále připraví trasu: retranslační stanice → noční zahrada → útočiště.
Tyto tři lokace ještě nejsou hratelné; výzkum je jejich příběhová příprava.

## Obměna dlaždic
Nová sada research zachovává šest typů. Chladicí náplň, energetický modul
a slitinový díl zůstávají. Nové generované PNG s průhledným pozadím:
- zlatý navigační hranol nahrazuje datový čip (typ 2),
- fialový výzkumný vzorek nahrazuje světelný článek (typ 4),
- zelené živé semeno nahrazuje biokapsli (typ 5).

Ikony cílů, názvy, bubliny a překlad souhlasí s novou sadou.
Jde o cíle miniher, nikoli novou ekonomiku, měnu nebo sklad.
Starší kapitoly dál používají původní grafiku.

## Grafika
Nová portrétová laboratoř public/scenes/elysium-research.webp, imagegen:
xenobotanická laboratoř Elysia, světlé industriální panely s oranžovými
pruhy, výhled na stanici, komora s rostlinou vlevo, holografický stůl,
analýza signálu vpravo a zlatá navigační čočka vzadu. Bez UI a textu.
Postupné měkké masky rozsvěcují ztlumený výchozí stav.

Dlaždice generované samostatně na průhledném pozadí, výrazná silueta,
bez rámu a textu; zelené semeno s lístky, fialová lahvička vzorku,
zlatý šestihranný hranol s orbitami. Herní PNG optimalizované na 192px.
Původní generované soubory:
- laboratoř exec-94f0c8ae-4937-4121-ad94-bb7424f72559.png
- semeno exec-0038ae80-a0c2-48a0-9db4-e0ccb21228ea.png
- vzorek exec-46427980-0144-426c-9280-2ebeddec52b1.png
- hranol exec-3287f658-dc3d-4c96-b206-832195686816.png

## Ukládání a ověření
researchCompleted 0–5 se odemyká až po gardenCompleted=6.
Save, merge, reset, replay i deník zapojené. Pro cloud spustit
supabase/014_research.sql (kumulativně zahrnuje i013 pro zahradu).
Živé nasazení SQL neprovedeno; klient ohlásí chybějící migraci.

Izolovaný mobilní průchod všech pěti úkolů: skutečný tah, vývojové
dokončení, návrat, reload a replay. Unit testy zahrnují 150 počátečních
desek, EN/CZ a návaznost uloženého postupu. Obtížnost je návrh k testování.

## Následující práce
Tři lokace po4–6 úkolech: opuštěná retranslační stanice, noční zahrada,
útočiště výpravy. Zachovat novou výzkumnou sadu a podle prostředí změnit
nejvýše další jeden nebo dva typy. Na konci skutečný kontakt s členem
výpravy, například portrét a krátký dialog.

Rezonátory (nabíjení zařízení sousedním spojením) zůstávají další
samostatný krok, dosud neimplementované. Nejprve jednoduché naučení,
potom kombinace s kryty. Portály zavést až později.
