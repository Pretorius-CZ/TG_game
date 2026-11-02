# První služba: levely 231–250

Dokončení schváleného pokračování 201–250, 2. 11. 2026. Pilot zůstává
zásobovacím pilotem: nejde o nové hledání původní zachráněné výpravy.

| Levely | Pracovní oblast | Výsledek |
|---|---|---|
| 231–232 | Servis návštěvní zásobovací lodi | Oddělená závada a chlazený náhradní měnič. |
| 233–235 | Nákladový prostor | Zajištěné moduly a povolení k dalšímu letu. |
| 236–237 | Náhradní koridor | Zaměřená trasa a vnější navádění. |
| 238–240 | Příletové relé | Zpáteční kanál, časové okno, schválený náhradní přílet. |
| 241–242 | Přijímací dok | Světla a otestovaná kolébka. |
| 243–245 | Ovládání doku | Nezávislé napájení, přímé spojení, zakotvená zásobovací loď. |
| 246–247 | Příchodová galerie | Posádka i dodávka vstupují do funkční stanice. |
| 248–250 | První pracovní služba | Předání konzole, zálohy a hotové stanice novému operátorovi. |

Čtyři nové portrétní scény a čtyři opravené varianty. Dvě sousední pracovní
oblasti sdílejí prostředí, ale mají vlastní úkoly, deník, postup a replay.
Navazující oblast začíná již zapnutým obrazem místnosti; při přechodu
nezhasíná vybavení zprovozněné v předchozí oblasti.
Značky jsou umístěné u zařízení podle skutečné grafiky, nikoli v seznamu.
Čtyři dvoupanelové přechody a dvoupanelový závěr po 250. Závěr se automaticky
přehraje jednou pro profil/revizi a zůstává v nabídce příběhů pro replay.
Síť má všech 50 úkolů a přestává být v přehledu kapitol označená jako rozpracovaná.

## Obtížnost a zachování postupu

Kombinace desek 6×8 / 7×8 / 8×7, rohy, zúžení a stupně; šest dosavadních
síťových ikon. Nejvýše dva uzly, na úzké desce jeden, celkem čtyři impulzy.
Kryty nesmějí blokovat okolí uzlů. Původní konfigurace 1–230 se nemění.
HARD 235/240/245/250. Cílený robot bez pomůcek: 54/53/57/45 % výher při
100 pokusech. Několik běžných levelů bylo podle prvního průchodu zmírněno
(zejména 239, 244, 247, 248); nejde o předpověď lidské úspěšnosti.
Rozpočty ani cíle se neřídí nákupy nebo reklamami.

SQL038 uživatel potvrdil jako nasazené. Přidává osm počítadel a 20 hvězd,
limit 250 záznamů hvězd a 512 značek čtení. Starší klienti nová pole
nepřepisují, resetRevision a sdílený účetní zámek zůstávají. PostgreSQL test
odhalil chybu precedence v původním spojování readIds (`|| incoming->...`);
SQL038 závorkuje extrakci a značky přečteného deníku se opět přenášejí.
Historické migrace 035–037 se neupravují. Generátor SQL037 zůstává omezený
na původních deset zastávek, SQL038 zahrnuje všech 18 síťových oblastí.

Nové slepé běhy obsahují 250 úloh. Existující běhy 200/210/230 mají
zachovaný původní seznam a pravidla. Analytika: network-first-watch-v3.
Všech šest jazyků má úkoly, cíle, deník, přechody i závěr. Web dostává
novinku a aktuální počet 250, historické novinky zachovávají tehdejší počty.

## Kontroly a balení

316 unit testů v Android větvi: skutečný PostgreSQL přes PGlite, přenos
250 hvězd a čtení mezi zařízeními, starší klient, reset, brány scén, 400
generovaných desek s platným nezakrytým tahem, průchod celým příběhem.
Kontrola katalogů: 2735/2735 v šesti jazycích (web o 20 native zpráv méně).
Browser: všech 18 síťových scén na 320 px v šesti jazycích, průchod poslední
dvacítkou přes DEV výhry, komiksy, reload a 50/50; skutečné minihry různých
tvarů s platným tahem. DEV výhry ověřují navigaci, nikoli lidskou obtížnost.

Android verze 7: preview APK a podepsaný AAB v releases/google-play/internal-7.
Reklamy zůstávají testovací. Nahrání do Google Play je samostatný krok.

## Grafické podklady

Vestavěný imagegen: public/scenes/network-{freighter,detour-shelter,
receiving,first-watch}{,-restored}.png. Prompty: portrét 9:16, realisticky
malovaná sci-fi v námořnické modři, stříbru, jantaru a tyrkysu, horních
30 % klidných pro HUD, bez textu/UI/lidí. Nákladový servisní prostor,
asteroidové naváděcí stanoviště, přijímací dok a obytná příchodová galerie.
Opravené varianty editují přesně původní obraz; zachovávají kameru,
geometrii a umístění objektů, mění jen indikátory a zapnutí zařízení.
Originály zachované v .codex/generated_images, pracovní kopie v projektu.
