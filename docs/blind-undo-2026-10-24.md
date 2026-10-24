# Jeden krok zpět ve slepém testu

Na pokyn uživatele má každý pokus ve slepém testu jedno Undo zdarma,
bez reklamy. Tlačítko ukazuje1, před prvním platným tahem je zakázané.
Po doběhnutí platného tahu vrátí jedním klepnutím stav před tahem včetně
kaskád, počtů cílů, krytů, rezonátorů a deterministického generátoru.
Poté ukazuje0 a další použití v tomto pokusu není možné.

Skladová pomůcka stejně jako v běžné hře zneplatní předchozí snímek;
Undo nevrací použitou pomůcku. Po dalším normálním tahu lze dosud
nevyužité Undo použít. Po výhře a při technické chybě se Undo nenabízí.

Když dojdou tahy a Undo zůstává dostupné, pokus se ještě neodešle jako
hotový: výsledkový panel nabídne Undo a „Ohodnotit pokus“. Po použití
Undo se pokračuje na stejné desce. Pokud už Undo není dostupné, vyčerpání
tahů otevře hodnocení automaticky jako dosud. Nový pokus, včetně retry
stejné testové pozice, obnoví jednu možnost Undo.

Použití se ukládá v configuration.assistance.undoUses=1 a také undoUses
ve výsledku pokusu. Existující assistanceLabel jej v /balance umí vypsat.
Nejde o čistou výhru bez pomoci. Nové výsledky mají build
2026-10-24-blind-undo-v1, initialRules a uložené konfigurace/předešlé
výsledky starších průchodů zůstávají zachované. SQL migrace není potřeba.
Změna funguje i při pokračování staršího průchodu po načtení nové stránky.
Ukládání běžné hry, energie a zásob zůstává izolované od testu.

Ověření: 278 unit testů, 21 Chromium scénářů (6 slepý test +15 běžnéUndo),
Android build a debugAPK. Testy kontrolují poslední tah, přesné obnovení,
jedno použití, absenci reklamy, reset při retry, serverový payload,
původní pořadí a nedotčené běžné savy. Browserové testy používají izolovaná
data a mock backend; nepředstírají fyzický test na telefonu.
