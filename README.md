# To the Stars — pracovní prototyp

React + Vite, webová hra na výšku. Název je pracovní. Hra anglicky,
dokumentace česky. Spuštění: `npm install`, potom `npm run dev`.
Kontroly: `npm run build`, `node --test tests/match3.test.js`.

## Co vyzkoušet

Vstup do lodi → Inspect repair → Play. Tutoriál: spoj 18 kamenů na
desce 6 × 6. Klepni postupně na dva sousední kameny nebo táhni prstem.
Spoj alespoň tři stejné do řady/sloupce. První tah je zvýrazněn;
Show a hint nabídne další. Bez boosterů a limitu času/tahů.
Po výhře Restore power rozsvítí kokpit. Lekci lze opakovat.
Při odchodu před výhrou nevznikne oprava. Stav přežije přepínání scén,
ale ne obnovení stránky. Supabase a Telegram přihlášení zatím chybí.

## Soubory

- `src/main.jsx`: exteriér, kokpit, oprava a návaznost na level.
- `src/MiniGame.jsx`: tutoriál a animace, modální deska nad kokpitem.
- `src/match3.js`: nezávislá pravidla; rozměry a masky pro budoucí levely.
- `tests/match3.test.js`: generování, spojení, gravitační úseky.
- `public/scenes/`: AI koncepty scén; aktivní jsou portrétové verze.
- `Images/`: původní podklady; tutoriál nyní používá vlastní jednoduché tvary.

Proměna opravy je zatím CSS rozsvícení, finální vrstvy scén chybí.
Detaily a plán: `docs/game-design.md`, `docs/architecture.md`.

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
