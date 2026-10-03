# Předěl po prvním odletu

2026-10-03: po stávající odletové animaci následuje komiks se třemi obrazy: opuštění místa havárie, zachycení signálu v prostoru a první pohled na Kepler Reach. Texty EN/CZ jsou oddělené od ilustrací. Ovládání odpovídá komiksu příletu k Elysiu: tlačítka, tečky, posun prstem, šipky a přeskočení/Escape.

Dokončení animace nebo její přeskočení nejprve uloží existující launchDone a scénu system, potom otevře komiks. Přerušení prohlížečem během komiksu tak neztratí odlet. Dočtení i přeskočení komiksu ponechá hráče na mapě Kepler Reach. Zpět z původní animace stále ruší odlet. Deník u zápisu A ship that flies again nabízí přehrání komiksu; replay nemění postup, scénu ani energii. Již hotový odlet se automaticky nepřehrává. Nová SQL migrace není potřeba.

Pro další kapitoly používat stejný krátký předěl u významného příběhového milníku: nové místo, odhalení nebo otázka. Tento krok zavádí předěl první kapitoly; nepřidává další levely.

## Ilustrace a prompty

Použit vestavěný imagegen s předlohami public/scenes/departure-flight.webp a public/intro/signal.webp. Převod do WebP bez ořezu; obrázky se zobrazují celé. Výstupy:
- public/scenes/departure-comic-surface.webp
- public/scenes/departure-comic-signal.webp
- public/scenes/departure-comic-worlds.webp

+### Panel 1

Use case illustration-story. ONE portrait 9:16 cinematic painted sci-fi comic illustration for Beyond the Signal game. No text, borders, panels, UI or logos. References lock the SAME small off-white/orange supply ship: rounded cockpit, two large cylindrical rear engine pods, single dorsal rear tail fin and small lower stabilizers, worn panels, retracted landing legs and stowed antenna. No extra wing or third engine. Rich detailed painterly blue/violet space art, adventurous and hopeful, ship intact after repairs. Place main subjects in top 60 percent; bottom 35 percent dark quiet space for separate caption. Panel 1: Leaving the crash landing site behind. Repaired ship viewed three-quarter from front, climbing away above rugged blue-purple alien mountains. Bright BLUE twin engine trails. Very small abandoned fuel depot below shows former landing place, no second ship or debris. Planets and violet stars overhead. Keep ship and crash site both clear in upper two thirds.

### Panel 2

Use case illustration-story. ONE portrait 9:16 cinematic painted sci-fi comic illustration for Beyond the Signal game. No text, borders, panels, UI or logos. References lock the SAME small off-white/orange supply ship: rounded cockpit, two large cylindrical rear engine pods, single dorsal rear tail fin and small lower stabilizers, worn panels, retracted landing legs and stowed antenna. No extra wing or third engine. Rich detailed painterly blue/violet space art, adventurous and hopeful, ship intact after repairs. Place main subjects in top 60 percent; bottom 35 percent dark quiet space for separate caption. Panel 2: In orbit at last. Rear three-quarter view of same supply ship against black violet starfield, twin engines glowing BLUE, curved blue atmospheric limb of the rocky moon receding behind. One faint warm point of light far ahead suggests the persistent signal, no drawn radio rings or interface. Ship centered in upper half, quiet relief and new direction.

### Panel 3

Use case illustration-story. ONE portrait 9:16 cinematic painted sci-fi comic illustration for Beyond the Signal game. No text, borders, panels, UI or logos. References lock the SAME small off-white/orange supply ship: rounded cockpit, two large cylindrical rear engine pods, single dorsal rear tail fin and small lower stabilizers, worn panels, retracted landing legs and stowed antenna. No extra wing or third engine. Rich detailed painterly blue/violet space art, adventurous and hopeful, ship intact after repairs. Place main subjects in top 60 percent; bottom 35 percent dark quiet space for separate caption. Panel 3: Kepler Reach revealed, realistic perspective view of part of a fictional planetary system, NOT a map or chart. Tiny same supply ship near upper middle heading toward distant worlds. A huge blue-purple gas planet and rocky copper mining moon, farther small pale ice world with thin blue rim. Asteroid belt fragments frame the scene. Show worlds separated naturally in deep space, no station, no orbit diagrams, no writing. Sense of a new journey and mysterious distant light. Bottom third dark open starfield.

