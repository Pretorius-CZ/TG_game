# Herní design — oprava lodi a cesta ke hvězdám

> Aktuální schválený směr k 2026-09-10, větev `codex/game-adjustments`.
> Předchozí návrh je archivován v `game-design-simple-path.md` a na větvi
> `simple-path`. Komplexní ekonomická verze zůstává na `main`.
> Starší rozhodnutí platí pouze tam, kde neodporují tomuto dokumentu.

## 1. Koncept

Sci-fi swap match-3 pro Telegram Mini App. Hráč dokončováním levelů
postupně opravuje poškozenou loď. Dokončení první kapitoly umožní odlet
ke hvězdám a pokračování v dalších kapitolách.

Cílem je pocit obnovy a viditelného postupu ve stylu Gardenscapes,
ale s jednoduchým provedením bez ekonomiky a správy surovin.

## 2. Schválené principy

- Hra zůstává webovou aplikací: React + Vite, HTML, CSS a JavaScript.
- Animace jsou součástí webového provedení, zejména pohyb dlaždic,
  efekty kombinací a proměny opravované lodi.
- Postup se ukládá externě do databáze. Preferované řešení je Supabase;
  placený tarif je přijatelný, konkrétní tarif dosud není vybraný.
- První kapitola je oprava lodi, po ní se hráč vydá ke hvězdám.
- Žádná herní měna: odpadají Mince, Kredity, suroviny i obchod.
- Opravy jsou přímou odměnou za dokončené match-3 levely.
- Vzhledové varianty oprav a dekorování se zatím neřeší.

## 3. Základní herní smyčka

1. Hráč vidí loď a aktuální opravu.
2. Odehraje další match-3 level.
3. První výhra v tomto levelu posune opravu, bez získávání a utrácení měny.
4. Po dosažení potřebného postupu se opravovaný objekt viditelně změní.
5. Následuje další oprava; dokončení kapitoly vede k odletu.

Návrh provedení: ukazatel „Napájení: 2/3“ a tlačítko „Opravit“ při
splnění podmínky. Přesný počet výher a ruční potvrzení opravy doladit
na prototypu. Opakované hraní již dokončeného levelu nepřidává další
postup opravy. První viditelnou odměnu navrhujeme už po první výhře.

## 4. První kapitola

Pracovní příklad etap, nikoli finální seznam ani závazný rozsah:

| Etapa | Viditelná odměna |
|---|---|
| Napájení | Nouzová světla se rozsvítí |
| Trup | Zmizí poškození a úniky |
| Kabina | Zapnou se displeje |
| Komunikace | Loď zachytí signál |
| Pohon | Zažehnou se motory |
| Závěr | Loď odstartuje ke hvězdám |

Větší opravy lze rozdělit na menší viditelné změny. Přesný příběh,
počet etap a levelů zůstávají otevřené. Původní struktura 60 planet /
12 soustav ani vyjednávání s aliancí nejsou závazkem nové verze.

## 5. Vizuál a animace

Portrétové webové rozhraní. Scéna lodi složená z pozadí a vrstev:
trup, opravované části, světla, motory. Poškozená vrstva se může
vyměnit nebo prolnout s opravenou. Není potřeba 3D ani animovaná postava.

Deska potřebuje čitelnou animaci výměny, pádu, zániku a speciálních
kombinací. CSS a Web Animations API řídí vzhled; JavaScript řídí
herní stav a pořadí efektů. Výkon ověřit na mobilu uvnitř Telegramu.
Dosavadní dlaždice, překážky a efekty v `Images/` lze znovu využít;
loď a její vrstvy bude potřeba připravit. Pozadí soustav jsou podklady
pro budoucí obsah, neurčují povinný počet kapitol.

## 6. Rozšiřování

Kapitola je sada dat: scéna, opravované objekty, úkoly, požadavky na
postup, levely a krátký příběh. Další kapitoly používají stejné systémy.
Stanice, základna nebo jiná destinace jsou návrhy, zatím ne schválený obsah.

Levely oddělit od logiky oprav. Generátor může pomáhat s tvorbou,
ale platný tah negarantuje dohratelnost ani zábavnost. Nový obsah
vyžaduje kontrolu obtížnosti a hraní prototypu.

## 7. První prototyp — návrh rozsahu

Jedna loď, přibližně 12–15 levelů, pět oprav, malý výběr speciálních
dlaždic a překážek, ukládání postupu. Počet je návrh pro ověření
základní smyčky, nikoli schválený rozsah vydání.

Ověřit čitelnost, ovládání na telefonu, tempo oprav a chuť pokračovat.

## 8. Otevřené otázky

- Konkrétní vzhled lodi, příběh a pořadí oprav.
- Počet levelů a výher na jednotlivé etapy.
- Detailní pravidla desky, cíle a obtížnost levelů.
- Životy, boostery a jejich získávání bez měny; monetizace je otevřená.
- Hosting, Supabase tarif, přihlášení a ověřování výsledků na serveru.
- Rozsah prvního vydání a obsah dalších kapitol.

Staré ceny, dropy Mincí, obchody, nákupy měny za Stars a pevné počty
boss levelů se do nové verze automaticky nepřenášejí.

## 2026-09-10 — Vstup z exteriéru do kokpitu, portrétový prototyp

Schváleno: první kapitola má venkovní scénu poškozené lodi a jeden
interiér (kokpit). Klepnutím na loď se vstupuje dovnitř; přechod tvoří
přiblížení, zatmavení a odhalení interiéru. Z budoucího match-3 levelu
se hráč vrací přímo do kokpitu, nemusí znovu procházet exteriérem.
Hra zůstává na výšku pro telefon; orientace se nemění.

Implementováno: React/Vite prototyp obou scén, navigace, dialog první
opravy a výslovně označená dočasná ukázka rozsvícení. Dvojice portrétových
AI ilustrací v `public/scenes/`; původní široké koncepty jsou tam také.
Zatím monolitické obrázky s CSS efektem, ne finální samostatné vrstvy.
Match-3, Telegram a Supabase nejsou implementované; stav jen v paměti.
Pracovní název „Ke hvězdám“, pět oprav a text příběhu nejsou finální obsah.

Budoucí Android: zachovat platformně nezávislé jádro a interní identitu
hráče oddělenou od Telegram ID. Capacitor je doporučená cesta pro pozdější
ověření, nikoli aktuálně přidaná závislost nebo hotový Android port.

## 2026-09-10 — První hratelná výuková minihra

Implementován anglický tutoriál nad kokpitem: deska 6 × 6, čtyři typy
odlišené barvou i tvarem, cíl 18 spojených kamenů, bez boosterů, bez
limitu tahů a času. Platí vodorovné/svislé spojení 3+, sousední výměna
klepnutím nebo tažením, návrat neplatné výměny, kaskády a doplnění.
První pár je zvýrazněný, další nápověda tlačítkem. Pokud není platný
tah, vznikne nová deska při zachování nasbíraného postupu.

Po skutečném splnění cíle tlačítko Restore power zavře level a rozsvítí
kokpit. Odchod před dokončením opravu nedá; opakování již dokončené
lekce nepřidává další opravu. Zatím pouze stav v paměti, bez Supabase.
Napájení je stále jednoduchý CSS efekt; výraznější grafické proměny
po opravách jsou další návrhový úkol.

Veškeré hráčské texty jsou anglicky; dokumentace a diskuze česky.
Pravidla jsou oddělena v src/match3.js. Podporují proměnlivé rozměry
a masku polí; díry oddělují gravitační úseky. Aktuální UI používá
jediný plný obdélníkový tutoriál, nové tvary nejsou ještě herním obsahem.
Čísla 6 × 6 a 18 jsou testovací nastavení, ne finální balancing.

Kontroly: node --test tests/match3.test.js; npm run build; prohlížečový
průchod od vstupu do lodi přes reálné výměny až po opravu, replay a
odchod. Testováno na mobilních šířkách 320, 390 a 430 px.

## 2026-09-12 — První etapa kokpitu a vývojový checkpoint

Kokpit je pouze první etapa opravy celé lodi. Implementované pořadí:
1. Emergency lights — spojit 18 libovolných kamenů, rozsvícení stropních světel.
2. Window seals — spojit 12 modrých čtverců, zmizení prasklin a obnovení těsnění.
3. Flight computer — spojit 15 zelených kruhů, zapnutí centrálního displeje.
4. Ship diagnostics — spojit 30 libovolných kamenů, zapnutí bočních panelů.

Aktivní oprava má bod ve scéně; přehled Repairs ukazuje hotové, dostupné
a zamčené kroky. Odchod z levelu neodemyká opravu. Opakování hotové opravy
neposouvá pořadí. Dokončení kokpitu ukáže příští etapu pláště, zatím nehratelnou.
Plášť, obytné zázemí, jídlo, navigace, palivo a motory patří do dalších etap;
loď po kokpitu neodlétá. Veškeré změny jsou zatím vrstvy CSS/SVG nad ilustrací.
Hraní stále bez boosterů a limitů; stav pouze v paměti, Supabase chybí.
Pracovní checkpoint se ukládá na větev codex/cockpit-stage.
