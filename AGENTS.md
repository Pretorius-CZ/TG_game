# AGENTS.md — kontext projektu pro Codex

## Projekt a aktuální směr (2026-09-10)

Telegram Mini App: sci-fi swap match-3 s postupnou opravou lodi jako
první kapitolou. Po opravě loď odletí ke hvězdám. Opravy jsou přímá
odměna za dokončené levely, bez měny, surovin a obchodu. Kosmetické
varianty se zatím neřeší. Podrobnosti: `docs/game-design.md`.

## Pracovní prostředí a větve

- Pracovat ve stejné místní složce `telegram_hra`.
- GitHub remote: https://github.com/Pretorius-CZ/TG_game.git
- Aktuální větev: `codex/cockpit-stage`, vychází z `codex/game-adjustments` / `simple-path`.
- `simple-path`: starší návrh cesty planetami; `main`: komplexní ekonomická verze.
- Archiv předchozího designu: `docs/game-design-simple-path.md`.
- Nové větve standardně s prefixem `codex/`.

## Technologie

- React + Vite; webové animace přes CSS a JavaScript / Web Animations API.
- Herní jádro oddělené od Telegram integrace.
- Externí databáze pro postup; preferována Supabase, placený tarif je možný.
- Konkrétní tarif, hosting a Telegram SDK ještě nejsou vybrané.
- Přihlášení z Telegramu ověřovat na backendu.

## Struktura a konvence

- `docs/`: design, architektura a chronologický log rozhodnutí.
- `Images/`: schválené dlaždice, překážky, VFX a pozadí; viz `Images/README.md`.
- `src/`: React/Vite prototyp exteriéru a kokpitu; spuštění viz README.md.
- Kód a komentáře anglicky; dokumentace a diskuze česky.
- Styl commit zpráv zatím není pevně určený.

## Aktuální stav

- [x] Schválen nový koncept: oprava lodi, další kapitoly, bez měny.
- [x] Vytvořena a publikována větev `codex/game-adjustments`.
- [x] Existují grafické podklady pro match-3, nikoli hotová hra.
- [ ] Doladit opravy a rozsah první kapitoly; čísla v GDD jsou návrhy.
- [ ] Připravit vrstvy grafiky lodi.
- [x] Založit React/Vite aplikaci a interaktivní prototyp scén na výšku.
- [x] Implementovat výukové match-3 6 × 6 a propojit výhru s napájením.
- [ ] Nastavit Supabase, autentizaci a ukládání postupu.
- [ ] Zvolit hosting a nastavit CI/CD.

Po větší práci aktualizovat tento kontext; detaily patří do dokumentace.
Životy, boostery a monetizace jsou otevřené, nepřebírat automaticky
starou ekonomiku nebo rozsah 60 planet / 12 soustav.

První scény: klepnutí na loď otevře kokpit, návrat ven navigací.
Oprava se odemyká výhrou v tutoriálu, zatím bez trvalého ukládání. Finální vrstvy lodi chybí.
Na telefonu i desktopovém náhledu zachovat portrétový formát.

Herní UI anglicky, dokumentace a diskuze česky. Tutoriál bez boosterů
a limitu tahů; cíl 18 kamenů. Pravidla src/match3.js, testy tests/match3.test.js.

Aktuálně čtyři postupné opravy kokpitu: světla, okna, počítač, diagnostika.
Konfigurace src/repairs.js, cíle 18 všech / 12 modrých / 15 zelených / 30 všech.
Kokpit je pouze první etapa celé lodi; plášť a ostatní etapy zatím nehratelné.
