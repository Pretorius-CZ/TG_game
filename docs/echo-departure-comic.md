# Elysium → Trhlina — komiks odletu

Tři panely: přijímače zachytí dvě kopie uvítací zprávy, loď se připravuje v doku a odlétá k průzkumu. Starší časová značka není vysvětlena ani vydávána za důkaz cestování časem. Ověření hodin, přijímače a zaměření zdroje zůstává v prvních úkolech Trhliny.

První vstup do rift nebo rift-echo po dokončení všech šesti sektorů Elysia, před první opravou riftEchoCompleted. Přímý vstup přes kapitoly je pokrytý. Po začátku oprav se komiks automaticky nevnucuje. Přeskočení a dokončení nemění postup ani scénu. Replay ze závěrečného zápisu observatoře elysium-observatory-beacon-log (Welcome home), bez nového odletu nebo změny postupu.

Zhlédnutí je místní prezentační preference oddělená podle účtu/resetRevision, stejně jako u relé a návratu k výzkumu. Na jiném zařízení se před první opravou může zobrazit znovu. Bez nové migrace SQL, oprav či dalších levelů. Texty EN/CZ, sdílený StoryComic.

Implementace src/EchoDepartureStory.jsx a src/echoDepartureStory.js.

## Grafika a prompty

Vestavěný imagegen; reference elysium-observatory-restored.webp, elysium-restored.webp a departure-flight.webp. Finální soubory public/scenes/echo-departure-signal.webp, echo-departure-dock.webp, echo-departure-flight.webp. WebP quality85/method6, bez ořezu nebo vizuálních úprav převodem.

1. Use case illustration-story. ONE portrait 9:16 cinematic detailed painterly sci-fi comic illustration for Beyond the Signal. No text, writing, labels, numbers, UI, frames or inset panels. Main narrative upper 60%; lower 35% dark quiet negative space for external captions. Off-white orange engineering, navy violet cosmos, cyan instruments, warm amber lamps. No people or alien creatures. Panel1 The message returns. Reference locks restored Elysium observatory: monumental long tilted telescope, blue holographic star globe, panoramic windows and warm metal architecture. Closer view of receiver console foreground with two translucent cyan waveform curves, one sharp and one faint delayed duplicate. Telescope and station ring behind, mysterious but scientific, no portal or black hole yet. No legible timestamp.

2. Use case illustration-story. ONE portrait 9:16 cinematic detailed painterly sci-fi comic illustration for Beyond the Signal. No text, writing, labels, numbers, UI, frames or inset panels. Main narrative upper 60%; lower 35% dark quiet negative space for external captions. Off-white orange engineering, navy violet cosmos, cyan instruments, warm amber lamps. No people or alien creatures. Panel2 A station worth returning to. Reference1 locks Elysium ring station, central tall mast, dome and dock. Reference2 locks small white-orange rounded twin cylindrical engine supply ship, dorsal rear fin, blue engine glow, antenna stowed. Close view of dock hangar with repaired ship waiting facing toward open starfield; small folded survey probe secured on transport trolley next to ship, amber hangar lights and cyan docking guidance. Preparations only, no launched probe or rescue scene.

3. Use case illustration-story. ONE portrait 9:16 cinematic detailed painterly sci-fi comic illustration for Beyond the Signal. No text, writing, labels, numbers, UI, frames or inset panels. Main narrative upper 60%; lower 35% dark quiet negative space for external captions. Off-white orange engineering, navy violet cosmos, cyan instruments, warm amber lamps. No people or alien creatures. Panel3 Follow the echo. Reference1 locks familiar white-orange supply ship, twin cylindrical engine pods with BLUE exhaust, dorsal rear fin and stowed antenna. Reference2 locks huge Elysium ring station, tall mast, side dome and docking arm. Ship flying away from the station toward dark uncharted starfield, three-quarter view. Station warm windows and tiny cyan communication beacon still behind ship. Violet nebula thins into deep navy ahead. NO active rift, no warp tunnel, no strange garden world or new destination shown.


Ověření: 131 unit testů a build prošly. Izolovaný mobilní průchod 320×568 ověřil všechny panely, finish, reload bez opakování, replay z deníku bez změny scény/postupu a české přeskočení po resetu. Bez chyb JavaScriptu.
