# Komiks u relé — sestup do Noční zahrady

Tři přeskočitelné ilustrace oddělují opravené relé od Noční zahrady:
obnovená lidská zpráva, sestup pod mraky a opuštěná přistávací mýtina.
Stáří zprávy zůstává nejisté; zahrada před opravami není rozsvícená.

Komiks se otevře při prvním vstupu do night-glade po relayCompleted=4,
pokud ještě není dokončen první úkol zahrady. Dokončení i přeskočení
ponechávají hráče v zahradě a nemění opravy. Přehrání je dostupné ze
závěrečného zápisu relé v lodním deníku a nemění scénu ani postup.

Zhlédnutí je místní prezentační preference oddělená podle účtu a
resetRevision. Při blokovaném úložišti funguje alespoň v dané relaci.
Před první opravou se na jiném zařízení může komiks zobrazit znovu;
po dokončení prvního úkolu ho potlačuje uložený herní postup.
Cloudové schéma ani počet levelů se nemění, SQL není potřeba.

Implementace: src/RelayStory.jsx, src/relayStory.js, src/storySeen.js.
Sdílený StoryComic podporuje posun, tlačítka, klávesnici a přeskočení.
Texty jsou EN/CZ, ilustrace nemají vložené nápisy.

Grafika vytvořena imagegen podle současného relé, lodi a night-glade.
Výstupy public/scenes/relay-comic-{message,descent,glade}.webp,
převod do WebP quality 85/method 6 bez dalších vizuálních úprav.

Ověření: 126 unit testů, produkční build, izolovaný mobilní průchod
320 × 568 přes všechny panely, návrat po reloadu, replay z deníku,
reset a české přeskočení; bez chyb JavaScriptu.
