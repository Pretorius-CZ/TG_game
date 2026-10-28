## Oprava rozložení archivu — 2026-10-28

Na telefonu se v Simulační komoře popisky dokončených úkolů odsouvaly
daleko od příslušných konzolí. Archiv sdílí třídu return-corridor-site,
jejíž karty o šířce 42 % přebily kompaktní popisky; při měnící se výšce
textu se posouval i střed značky uvnitř tlačítka.

Archiv nyní používá vlastní úzké popisky a značky s pevným středem podle
souřadnic zařízení. Horní dvojice popisků v Simulační komoře je nad
konzolemi, prostřední pod nimi a HARD úkol má popisek pod centrálním
zařízením. Souřadnice v archive.js ani pozadí se nemění. Změna platí
pro rozehrané i dokončené úkoly; ostatní kapitoly se nepřestavují.

Kontrola tests/browser/archive-layout.spec.js používá skutečnou hru
s .play-area, ne pouze lokalizační náhled. Ověřuje skutečné středy značek,
hranice scény, kolize popisků se značkami i navzájem a otevření replay
všech pěti úkolů. Obsahuje šest stavů Simulační komory a dokončené další
oblasti archivu, šest jazyků a šířky 320/393/430 px. Síťové ukládání
je v testu blokované, postup je pouze izolované QA zadání.

Ověření: 18 mobilních browser testů prošlo (6 jazyků × 3 šířky,
celkem 162 stavů scén), 302 unit testů a web/Android build prošly.
APK a podepsané AAB internal.4 obsahují opravené CSS; ZIP CRC a obsah
zabalených assets zkontrolované. Fyzické ověření nového APK uživatelem
ještě neproběhlo. Testy nemění reálné účty ani postup.
