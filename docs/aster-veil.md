# Aster Veil — první výpravy (2026-09-26)

Po průletu branou je přístupná průzkumná bóje. Tři opravy zpřístupní
Zelený svět a Rozlámaný měsíc; obě šestilevelové výpravy lze dokončit
v libovolném pořadí. Uvnitř každé stanice je postup pevný.

| Místo | Opravy | Výsledek |
| --- | --- | --- |
| Bóje | Napájení, anténa, letový záznam | Trasy k oběma planetám |
| Zelený svět | Plošina, voda, napájení, záhony, skener, kapsle | Živý vzorek a biologický záznam |
| Rozlámaný měsíc | Lávka, generátor, vrták, spektrometr, třídička, sonda | Minerální vzorek a archiv |

Po dokončení obou planet mapa odhalí společný vzorec a další směr výpravy.
Další cíl zatím není hratelný. Návrat do Havenu je stále zdarma.
Nevzniká inventář, obchod ani nová měna; vzorky jsou příběhové milníky.

## Minihry a texty

15 úkolů a 15 zápisů deníku v EN/CZ. Desky 7×7, poslední úkol každého
místa 7×8, šest typů. Kryty od třetího úkolu, boosty podle stávajících
pravidel. Pracovní limity: bóje 22/24/26, planeta 23/24/25/26/28/30,
měsíc 24/25/27/28/29/31. Obtížnost dál doladit lidským hraním.

`src/aster.js` obsahuje místa, opravy, deník a masky proměn. Nové scény mají
poškozený a opravený obraz; každá oprava odhalí příslušné zařízení. Finální
stav zobrazí celý obnovený obraz. `Exploration.jsx` nově používá skutečný
počet úkolů destinace a správnou návratovou soustavu.

`src/tileSets.js` vybírá sadu podle opravy. Jen v Aster Veil nahrazuje typ3
asteroidu měděná mimozemská ruda a typ5 orbu růžové biologické jádro.
Typová ID, skórování a boosty se nemění. Ikony cílů, názvy a přístupné
popisky odpovídají tématu. Staré kapitoly používají původní kameny.

## Ukládání a nasazení

Nová pole: `buoyCompleted` (0–3), `verdantCompleted` (0–6),
`fractureCompleted` (0–6). Místní validace, sloučení starších záznamů,
čtený deník a reset jsou rozšířené. Staré uložené hry začínají nové úkoly
na nule; původní postup zůstává.

**Pro cloud spustit `supabase/008_aster_veil.sql` v SQL Editoru.** Obsahuje
předchozí definice synchronizace včetně pevného pořadí lodi. Server stále
vyžaduje přihlášení a vlastní save; reset používá společný zámek účtu.
Migrace není z této práce vzdáleně spuštěná. Dokud server nová pole
nepodporuje, klient ponechá místní postup a nehlásí cloudové uložení jako
úspěšné. SQL je připravené, živé přenesení nových úkolů mezi zařízeními
je nutné ověřit po nasazení.

## Grafika

Vestavěný imagegen vytvořil šest portrétových scén (tři poškozené a tři
opravené) a dvě transparentní ikony. Ve hře jsou WebP 768×1365 a PNG
192×192. Originály zůstaly v Codex generated_images; provoz používá pouze
kopie v public/scenes a public/tiles. Zdrojové prompty a soubory viz
public/scenes/aster-assets.md.

Ověření: jednotkové testy přístupu, obou pořadí planet, obnovení/resetu,
hratelných počátečních desek, tematických dlaždic a překladů. Mobilní
průchod všemi 15 opravami přes vývojové dokončení, načtení grafiky,
miniher a deníku, zachování postupu přes reload. Nejde o lidský test
vyváženosti všech levelů ani o ověření nasazené SQL migrace.
