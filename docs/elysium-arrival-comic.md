# Přílet k Elysiu — komiks

Implementováno 2026-10-03. Původní osmivteřinový přílet nahradil třípanelový komiks po dokončení příletové trasy. Panely: prachový závoj → odhalení města → naváděcí světlo doku. Ovládání: Další, tečky, vodorovný posun prstem, šipky klávesnice, Přeskočit příběh / Escape. Texty EN/CZ jsou mimo ilustrace.

Dokončení i přeskočení ukládá existující `elysiumArrival=1` a vstup do Elysia. Nová SQL migrace není potřeba. Již příchozí hráči komiks automaticky neuvidí; zápis „Not a base. A city.“ v deníku nabízí přehrání. Replay nemění postup, scénu ani energii. Chybějící obrázek nezablokuje dokončení. Obrázky se zobrazují celé, bez ořezu. Komiks sdílí komponentu StoryComic s pozdějším setkáním se správcem.

## Grafické podklady

Vestavěný imagegen; předlohy `public/scenes/elysium.webp` a `public/intro/signal.webp`. Výstupy převedené bez obrazových úprav do WebP, celkem přibližně 0,80 MB:
- `public/scenes/elysium-arrival-dust.webp`
- `public/scenes/elysium-arrival-city.webp`
- `public/scenes/elysium-arrival-dock.webp`

Společný prompt:
> Use case illustration-story. Create ONE portrait 9:16 cinematic painted sci-fi comic illustration, no panels within image, no text or UI. Reference 1 locks Elysium station architecture: industrial toroidal ring, tall slim central mast, stacked habitat towers left, geodesic dome right, cantilever hangar lower left, cylindrical utility tanks lower right; off-white orange worn metal, dark dormant station. Reference 2 locks small white/orange supply ship design, twin cylindrical rear engines and dorsal tail fin, never add wings. Match rich blue/violet painted game art. Main narrative in top 65 percent, bottom 35 percent quiet dark space for separate captions.

Doplňky pro jednotlivé panely:
1. Panel 1: Rear three-quarter view of the small ship entering wisps of violet cosmic dust at upper middle. Far ahead a barely discernible enormous station silhouette within dust, faint amber beacon. Deep space, no planet ground, atmospheric mystery.
2. Panel 2: Awe-inspiring wide reveal of the entire enormous Elysium, same distinctive architecture, fully within top two thirds, a tiny supply ship approaching its lower-left dock. Violet dust parts around it. Station is dormant, very few lights, colossal scale. No chopped mast.
3. Panel 3: Close cinematic oblique view of Elysium's huge dark industrial dock, same off-white orange hangar architecture. Small supply ship hovering at entrance, one warm amber guidance beacon has just illuminated the landing entrance and ship. Vast silent station looms behind, violet space. Ship fully visible in upper middle.

Ověření: 120 testů a produkční build. Izolovaný mobilní průchod kontroluje přílet, tři panely na 320×568, uložení, reload a přehrání z deníku.
