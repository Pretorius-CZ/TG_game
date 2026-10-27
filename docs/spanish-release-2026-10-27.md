# Španělština — zpřístupnění k online testu, 27. 10. 2026

Uživatel výslovně požádal kompletní španělštinu pushnout. ES se proto
zpřístupňuje ve veřejném registru a přepínači jazyků; PT-BR zůstává
draft. Přímý vstup je `https://game.playbeyondthesignal.com/?lang=es`.
Vývojový parametr previewLanguage není pro online test potřeba.

Rozsah je všech 200 úrovní/deset kapitol, deníky, závěr, nápovědy,
ovládání, účet, reklamy a samostatný přenos postupu. ES je také volba
desky ve slepém testu; jeho organizační rozhraní zůstává české.
ES web má PLAY do španělské hry a názvy Capítulos/Ajustes del juego
v návodech a ochraně soukromí odpovídají skutečnému UI. Zpřesněn
název kapitoly La respuesta v existující španělské aktualitě.

Ověření před pushem: 296 native unit testů, audit 2481/2481 bez chyb,
produkční build a přímý veřejný vstup ES s persistencí volby jazyka
a zachováním postupu. Španělský přenos zachovává postup, energii,
pomůcky a veřejnou/preview volbu jazyka. Slepý test otevírá ES desku
bez dotčení běžného profilu. Produkční URL nesmí zapnout PT-BR.
Předchozí úplný mobilní audit 36 oblastí a příběhů je popsaný
v `spanish-localization-complete-2026-10-27.md`.

Webová větev má 2475 ID; šest dalších nativních auth ID na ni není
přenášeno. Game hosting musí nasadit webový commit, nikoli Android
commit. Nainstalovaná APK se pushem sama neaktualizuje.

Herní pravidla, obtížnost, limity, CSS, pozice úkolů, save model a
Supabase schéma se nemění. Úplný externí ES robotický a mobilní
průchod následuje po tomto zpřístupnění.
