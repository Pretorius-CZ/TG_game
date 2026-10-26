# Francouzština — zpřístupnění pro online test, 26. 10. 2026

Uživatel požádal francouzštinu pushnout, aby na ni mohl pustit robota.
FR proto přechází z lokálního draftu do veřejné volby jazyka. Přímý
vstup je `https://game.playbeyondthesignal.com/?lang=fr`; není potřeba
vývojový parametr `previewLanguage` ani místní testovací fixture.

Rozsah: 200 úrovní, deset kapitol, deníky, příběh, nápověda, ovládání,
nabídka účtu a samostatný přenos postupu. FR je také volba jazyka
desky ve slepém testu (jeho organizační rozhraní zůstává česky).
Francouzský web směruje PLAY do francouzské hry; názvy ovládacích
prvků v návodech a ochraně soukromí odpovídají francouzskému UI.

Před pushem: 291 unit testů prošlo, audit bez chyb (Android větev
2481/2481 ID; webová větev má o šest nativních auth ID méně).
Produkční test přímého FR vstupu, persistence jazyka a zachování
postupu prošel. Francouzská deska slepého testu a produkční zákaz
zapnutí nedokončené ES prošly. Přenos FR přes okno, záloha i chyba
importu ověřeny; preview ani přepnutí jazyka nemění desku nebo tahy.
Při závěrečné kontrole opraveny čtyři popisky pokračování v archivu
a k solárnímu majáku, které obsahovaly anglickou část názvu místa.

Předchozí kontrola 36 oblastí na 320/430 px a 13 příběhů je popsaná
v `french-localization-complete-2026-10-26.md`. Úplný externí robotický
průchod a fyzický mobilní test FR teprve následují. Zpřístupnění není
prohlášení, že tyto externí testy již proběhly.

Jazyk je shodně povolený ve webové i Android zdrojové větvi. Případná
již nainstalovaná APK se sama pushem neaktualizuje. Pravidla hry, CSS,
pozice úkolů, limity, uložený postup a Supabase schéma se nemění.
