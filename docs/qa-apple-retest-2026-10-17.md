# Apple profily — opakované úplné průchody

Podklady: full-iPad-Mini-en- (1).zip a full-iPhone-15-Pro-Max-en- (1).zip
z Downloads, porovnány s odpovídajícími původními archivy bez (1).
Zpracovány celé JSON reporty. Nové archivy obsahují 206 a 203 PNG;
počty a automatické vizuální nálezy nejsou náhradou ručního prohlédnutí
každého obrázku. Tento rozbor se soustředí na dokončení a časy.

| Profil | Původní výhry | Nové různé výhry | Nejdelší nový level | Součet zaznamenaných časů levelů |
| --- | ---: | ---: | ---: | ---: |
| iPad Mini EN, 768 × 1024 | 34 | 187 | 107,4 s | 92 min 0,9 s |
| iPhone 15 Pro Max EN, 430 × 739 | 43 | 187 | 98,8 s | 80 min 6,3 s |

Oba původní běhy skončily limitem 5,5 hodiny. Oba nové JSON mají prázdné
notes, console, pageErrors, failedRequests i issues. Končí značkou bota
„konec hry“. V každém je 191 pokusů na 187 úspěšných levelů: čtyři opravy
potřebovaly druhý pokus. Bot používá pomůcky a reklamní pokračování;
187 výher není lidská 100% úspěšnost.

iPad opakoval levely35 Bring it home,97 Prepare the survey flight,
105 Stabilize the Rift HARD a161 Confirm the return window HARD.
iPhone opakoval116 Chart the rescue route HARD,135 Open the sanctuary
threshold HARD,139 Wake the caretaker memory a174 Rebuild the route index.

Mediány časů skupin1–49 /50–100 /101–150 /151–187:
iPad18,5 /24,6 /32,7 /31,9s; iPhone15,4 /20,0 /30,2 /29,7s.
Původní dramatické hodinové prodlužování se neopakovalo; pozdější čas se
stabilizuje. Různě těžké levely, počty tahů, reklamy a opakování brání
interpretovat tyto časy jako čistou prodlevu enginu nebo FPS.

Součty v tabulce nejsou celá délka běhu: chybí endedAt, navigace může být
mimo durationMs. Reporty stále neuvádějí engine/verzi prohlížeče, renderer
ani commit hry/bota. Názvy profilů neprokazují fyzický iPhone/iPad.

Spolu s novým SE187levelů to potvrzuje úplnou průchodnost všech tří nových
Apple profilů a neopakování původních časových selhání v těchto bězích.
Krátké dlouhé úlohy z perf-2 a malý cíl rezonátorové nápovědy na SE zůstávají
samostatné nálezy. Obtížnost podle těchto plných průchodů neměnit.
