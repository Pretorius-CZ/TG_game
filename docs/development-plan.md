# Beyond the Signal — dlouhodobý plán vývoje

Pracovní plán k 1. 10. 2026. Časové termíny doplníme podle výsledků testování;
každou etapu uzavírá ověřený výsledek. Návrhy nových funkcí nejsou automaticky
schválenou implementací. Hlavní směr: mobilní portrétová match-3 hra, opravy
mění prostředí, krátký příběh vede dál. Výchozí EN, CZ jako volba, texty v
obrázcích se nepřekládají. Jedno herní jádro pro více distribučních kanálů.

## Výchozí obsah

120 jedinečných miniher, podle katalogu `src/levelCatalog.js`:

| Část | Levely |
| --- | ---: |
| Kapitola 1: oprava lodi včetně HARD finále | 29 |
| Kapitola 2: důl, ledová stanice, archiv, Haven | 24 |
| Kapitola 3: Aster Veil a přístupová trasa Elysium | 16 |
| Kapitola 4: šest sektorů Elysia | 24 |
| Kapitola 5: Trhlina, tři lokace | 12 |
| Kapitola 6: zahrada za Trhlinou | 6 |
| Návrat na Elysium: výzkum | 5 |
| Kapitola 7: retranslační stanice | 4 |
| Celkem | 120 |

Animace, instalace skeneru a mapové přechody nejsou další match-3 levely.
Noční zahrada a útočiště výpravy jsou plánované pokračování.

## Etapa A — stabilní testovací verze

Nejvyšší priorita: všechny podstatné ovladače dostupné na telefonu,
jednotné poměry grafiky, žádné spodní překryvy hotspotů. Výhra až po
kaskádách; pokračování zachová desku; kryty a rezonátory se chovají čitelně.
Prověřit restart, účty, obnovu na druhém zařízení, energii a zásobu pomůcek.
Dokončit nasazení SQL015 a ověřit nový postup v cloudu.

Ověřovat 320×568, 390×844 a běžný desktop, EN/CZ a omezené animace.
Dokončeno, když projde celá cesta bez blokující chyby a opravy mají
viditelnou odezvu. Další obsah přidávat až po uzavření závažných chyb.

## Etapa B — měření a ladění obtížnosti

Nástroj `balance.html` zobrazuje katalog, úspěšnost, hry bez pomoci,
použití nápovědy/pomůcek/+5, zbývající tahy při výhře, odchody a chyby.
Záznamy jsou místní; testeři posílají export JSON, který lze sloučit.
Nevyžaduje čtení osobních údajů ani přístup k jejich účtu. Pozdější
centrální analytika je samostatný krok, nikoli součást této verze.

Pokus má jedinečné ID. Vyčerpání tahů se zapíše hned; pokračování
aktualizuje stejný pokus. Nové záznamy zachycují i konfiguraci cílů,
krytů, rezonátorů, rozměry a limit tahů. Nemíchat výsledky různých verzí
levelu. Panel výchozím filtrem odděluje aktuální tahy/rozměry/počet typů;
změny cílů je zatím nutné porovnat ze surového exportu.

Pracovní cíle, nikoli garance: úvodní výuka přibližně 85–95 % výher bez
pomoci; běžné úkoly 60–80 %; obtížné milníky 40–60 %. Ne každý level musí
mít stejnou úspěšnost. První rozhodnutí po alespoň 20 pokusech, větší
změny ideálně po 50+ pokusech od více lidí. Oddělit nové hráče a zkušené
replay testery; současný lokální přehled tuto skupinu automaticky nepozná.

Měnit jednu věc najednou: tahy obvykle o 1–2, potom znovu sběr dat.
Sledovat zvlášť časté odchody, technické obnovy a téměř splněné cíle.
Nezvyšovat náročnost jen proto, aby hráč musel sledovat reklamu;
pomoc má řešit blízký neúspěch, nikoli povinnou překážku.

### Velikost desky

Větší deska přidává platné tahy, kaskády a příležitosti vytvořit nálože;
může proto zjednodušit stejné cíle při stejném limitu. Sama o sobě není
nástroj zvyšování obtížnosti. Širší deska zároveň zmenší kameny na telefonu.
Základ 7×7, 7×8 pro delší úkoly, 8×8 pro dvě zařízení nebo složitější
prostor. Vyšší rozměry až po ověření dotykové čitelnosti. Obměňovat masky,
cíle a překážky; bez souběžného plošného zvětšení a snížení tahů.

## Etapa C — prezentace a první veřejné testování

Doladit Beyond the Signal menu, přeskočitelné intro, první výuku a
vysvětlení náloží, krytů, rezonátorů a reklamních odměn. Zkrátit texty na
herních plochách; příběh v bublinách/deníku. Rozdělit zvuky sběru,
Pulse/Nova a zařízení, upravit hlasitost na telefonu. Doplnit kontrolu
překladu a délky textů. Připravit jednoduchý formulář hlášení chyby s
ID levelu a verzí hry.

Dokončeno: tester bez vysvětlování zvládne začátek, rozumí prohře i
možnostem pokračování, umí uložit postup a znovu začít.

## Etapa D — distribuce a skutečné reklamy

Jeden repozitář, tři cílové buildy: Poki, CrazyGames, Telegram. Oddělit
platformní SDK, účet, reklamy a lifecycle od pravidel hry. Před integrací
ověřit aktuální požadavky každé platformy. Simulovanou reklamu v produkci
nahradit skutečným rewarded flow; odměna pouze po potvrzení dokončení,
zrušení bez odměny. +5 jednou za pokus, +1 energie při nule, jeden vybraný
booster se společným limitem, jedna další nápověda.

Optimalizovat první načtení: odstranit nepoužívané PNG z distribučního
balíčku, zachovat zdroje v projektu; načítat další kapitoly a grafiky na
vyžádání. Měřit počáteční přenos, dobu do Play, paměť a výkon na slabším
telefonu. Konkrétní limity převzít z aktuální platformní dokumentace.
Před ostrým vydáním ověřit přihlášení, reset, výpadek sítě a pravidla
soukromí podle skutečně sbíraných dat.

## Etapa E — dokončení Zhasínajícího světa

Po retranslační stanici: Noční zahrada (pracovně 6 úkolů) a útočiště výpravy
(pracovně 5). Obnovit zavlažovací světla, bezpečnou cestu a obytný modul;
výprava zanechává jasnější lidské stopy. Závěr vyřeší otázku, kdo vysílá,
a otevře další výpravu. Nové dlaždice zavádět po sadách s dobře odlišitelnými
barvami a siluetami; opakovat starší mechaniky v nových kombinacích.
Každá lokace: mapa/vstup, proměny grafiky, levely, bubliny, deník EN/CZ,
ukládání, replay a mobilní ověření. Rozsah je návrh pro schválení.

## Etapa F — průběžné rozšiřování

Obsah vydávat v menších balíčcích přibližně 6–12 levelů s jedním vizuálním
tématem. Kapitoly oddělit datově, aby přidání obsahu neměnilo jádro.
Vést stabilní ID, migrace uloženého postupu a historii změn obtížnosti.
Po každém vydání vyhodnotit dokončování, pomoc a hlášené chyby, pak další
balíček. Další jazyky podle publika; Android obal až po ověření webové
verze. Denní výzvy či dlouhodobé události až po stabilizaci základní hry.

## Pořadí nejbližší práce

1. Mobilní kontrola první kapitoly a obrazových vrstev; uživatelův screenshot
   porovnat s konkrétní scénou, až bude přiložen.
2. Nasadit a ověřit SQL015, publikovat schválenou testovací verzi.
3. Sbírat exporty pokusů, zhodnotit první kapitolu a rezonátory.
4. Po zpětné vazbě jemně upravit tahy a onboarding.
5. Dokončit Noční zahradu a útočiště; poté platformní testovací buildy.

Tento dokument průběžně upravovat podle rozhodnutí; výsledky jednotlivých
změn zapisovat do `docs/decisions-log.md`.
