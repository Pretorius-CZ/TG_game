# Chodba — grafický návrh

Vytvořeno vestavěným imagegen. Soubor: public/scenes/corridor-concept.png.
Portrétová chodba: Crew Quarters vlevo, Galley vpravo, Engine Room na konci.
Komora vede přímo do kokpitu a do této chodby. Zatím pouze grafický návrh,
nikoli zapojená scéna. Barvy rámů odlišují místnosti, ne stav odemčení.

Prompt: One portrait 9:16 concept image of the interior corridor of a small
sci-fi supply spaceship for a phone game. View from the airlock looking inward.
Warm hopeful cinematic painterly 3D realism, worn ivory panels, orange trim,
blue-gray shadows, warm ceiling lights. Compact human-scale utilitarian shuttle.
Three clearly visible closed entrances with large legible English labels:
LEFT CREW QUARTERS with bed pictogram and cyan accent; RIGHT GALLEY with cup
pictogram and amber accent; END ENGINE ROOM with gear pictogram and muted red
accent. Angled readable doors, restrained pipes, light crash wear, clean floor.
No people, additional doors, cockpit, exterior door, UI, arrows or collage.
Entrances in central 70 percent, uncluttered floor bottom 15 percent.

Chodba je zapojená: z komory Explore corridor, zpět Back to airlock. Výchozí grafika corridor-dark.webp má vypnutá stropní světla i rámy. CorridorArt.jsx a corridor.js připravují nezávislé rozsvícení rámů dle dokončených ID crew-quarters, galley, engine-room; hlavní světla až po všech třech. Jejich opravy dosud nejsou hratelné, proto chodba zůstává tmavá. Kokpit ji nerozsvěcí. Vstup z komory je zatím tlačítko; nový průchod není zakreslen do grafiky komory. Ověřen build, 10 testů, průchod komora–chodba–komora–kokpit.

Tmavá varianta vytvořena vestavěným imagegen úpravou corridor-concept.png. Prompt: Preserve exact portrait composition, camera, all door positions, English labels, icons and geometry. Turn OFF all ceiling lights, floor lights and colored door strips, replace strips with dark unlit gray glass, remove cast glow and reflections. Only faint cool blue indirect emergency illumination from behind camera, dark but legible. No other changes. Zdroj: public/scenes/corridor-dark.png. Herní varianty WebP; částečné rozsvícení rámů tvoří samostatná SVG vrstva.

Oprava grafického vstupu: komora používá airlock-corridor-door.webp (zdroj PNG stejného názvu). Vpravo je skutečný otevřený průchod CORRIDOR s klikací značkou Enter corridor, vlevo COCKPIT. Dostupný před i po dokončení kokpitu. Starší poznámka o chybějícím zakresleném vstupu již neplatí. Mobilní kliknutí a návrat ověřeny; build prošel.

Imagegen edit prompt pro komoru: Add a clearly visible open corridor doorway on the right wall, move service arm and console lower into foreground. Show dark unpowered corridor through doorway. Add CORRIDOR above right entrance and COCKPIT above left. Preserve central exterior hatch, portrait camera, worn ivory panels, orange trim and amber emergency lights. No UI or people. Výchozí reference airlock-0-damaged.webp; vytvořeno vestavěným imagegen.
