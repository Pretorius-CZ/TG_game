# Brazilská portugalština — kompletní hra

Na žádost uživatele dokončen celý PT-BR překlad najednou: všech 200 úrovní,
10 kapitol, příběhové přechody, deníky, ovládání, cíle, nápovědy, reklamní
stavy, souhlas, účet, Android hlášky a přenos postupu.

## Rozsah

- Herní katalog, runtime zprávy a webový katalog se načítají společně.
- 2484/2484 zpráv v Android zdroji, bez chyb ID, parametrů a plurálů.
- Přenos má všech 31 textových větví v PT-BR včetně shrnutí a chyb.
  Kontroly původu, nonce, slučování i zálohy zůstávají stejné.
- Volba Português (Brasil), URL `?lang=pt-BR`, PT-BR ve slepém testu.
  `pt` míří na brazilskou edici; `pt-PT` se nepřesměrovává na neexistující
  evropskou portugalštinu.
- Osm PT-BR webových stránek vede do portugalské hry. Capítulos,
  Configurações do jogo i názvy voleb statistik odpovídají rozhraní.
- Zachována ID, uložený postup, pravidla, tahy, CSS a pozice úkolů.

## Terminologie

Brazilské výrazy: você, celular, tela, arquivo, configurações, jogada,
peça, cobertura protetora, ressonador. Pomůcky Laser, Misturar, Trocar,
Feixe, EMP; Desfazer je krok zpět. Pulse a Nova zůstávají názvy náloží.
Haven, Aster Veil, Elysium a Kepler Reach jsou vlastní jména.
Música ligada/desligada; Efeitos sonoros ligados/desligados.
Exterior, Material, Laser a EMP jsou správné i při shodě s angličtinou.

## Ověření

Unit audit prochází všech 200 úrovní, deníky a příběhy, zachování čísel
a dynamických cílů i po změně hodnot (+7), souřadnice a brazilské plurály.
Native soubor: 297 unit testů.

Prohlížeč: všech 36 expedičních oblastí na 320/430 px, původní kotvy,
názvy, hvězdy, překryvy a klikatelnost; všechny příběhové sekvence;
nápovědy a změna jazyka během hry na 320/430/1024 px; přenos mezi dvěma
původy zachovává postup, energii, zásobu i jazyk. Web i Android build.

Externí úplný robotický průchod desktop/Pixel/iPhone následuje po nasazení.
Kontrola dat a zobrazení není vydávána za odehraných 200 reálných pokusů.
