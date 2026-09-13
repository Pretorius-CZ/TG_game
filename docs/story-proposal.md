# Lodní deník — schválená příběhová logika

> Příběhová logika schválena uživatelem 2026-09-12. Další úpravy pouze kosmetické.
> Deník je implementovaný pro čtyři opravy kokpitu (ověřeno 2026-09-13). Název souboru zachován kvůli existujícím odkazům.
> Herní texty anglicky, pracovní vysvětlení česky.

## Premisa

Hráč je pilot malé zásobovací lodi. Po nouzovém přistání na neznámém
měsíci musí obnovit loď. Pamatuje si záblesk a výpadek přístrojů;
nezná příčinu havárie. Postupně zjistí, že loď sama odbočila kvůli
starému nouzovému majáku a nouzovým manévrem ho zachránila.
Maják používá identifikátor dávno ztracené průzkumné výpravy.
Někdo tam mohl přežít — motivací je zvědavost a pomoc, ne horor.

## Jak se příběh váže na opravy

Po opravě nejprve ukázat změnu scény. Vedle potvrzení opravy nabídnout
Recovered log / New log entry, maximálně 2–3 věty. Deník jde přeskočit
a později otevřít přes samostatné tlačítko Ship log. Žádné další měny,
rozhodovací větve, dabing ani povinné dlouhé dialogy.

První dva útržky jsou nové zápisy pilota, nikoli data obnovená z okna.
Po opravě počítače lze číst obnovené starší záznamy. Opravy tedy mají
příběhový důsledek, ale nepředstíráme, že každý fyzický díl obsahuje deník.
Každý fragment má identifikátor, zdroj, pořadí a podmínku odemčení;
opakování minihry jej neduplikuje. Čtení neovlivňuje postup oprav.

## Čtyři útržky pro kokpit — pracovní anglické texty

### 1. Emergency lights — nový zápis pilota

“Emergency lights are back. I can finally see where I landed.
This moon was never on our route.”

Funkce: hráč přežil, ale ocitl se jinde, než čekal.

### 2. Window seals — nový zápis pilota

“The glass is sealed. Beyond it, a line of lights crosses the far ridge.
I thought they were stars. Stars don't follow the ground.”

Funkce: venku je něco k objevení. Světla jsou v dálce; pokud tento
text používáme, doplnit je i do krajiny, ať příběh odpovídá grafice.

### 3. Flight computer — obnovený letový záznam

“COURSE CHANGE — DISTRESS BEACON DETECTED.
Origin: survey expedition. Status: missing for 27 years.”

Funkce: loď neodbočila náhodou. Číslo 27 je pracovní, ne pevný lore.

### 4. Ship diagnostics — obnovený záznam nouzového manévru

“Landing was deliberate. The ship diverted power from its engines
to keep the cockpit intact. The beacon's coordinates are still in memory.”

Funkce: loď se stává zachráncem a domovem, ne jen seznamem závad.
Je znám důvod odbočení, ale nikoli původce signálu. Diagnostika není
oprava navigace, komunikace ani motorů; loď stále nemůže odletět.

## Oblouk celé první kapitoly

- Kokpit: zjistit, že odbočení a nouzové přistání byly úmyslné.
- Plášť: stopa po vnějším energetickém jevu, ne důkaz útoku.
- Ubikace a zásoby: osobní zápisy a drobné lidské detaily původní mise.
- Komunikace/navigace: ověřit archivované souřadnice a přijmout první
  živou odpověď; není to jen dávno opakovaná nahrávka.
- Palivo/strojovna/motory: připravit skutečnou cestu za voláním.
- Finále: odlet s konkrétním cílem — najít zdroj signálu a pomoci.

Kapitola 1 musí odpovědět, proč jsme havarovali; do druhé nechá otevřenou
otázku, kdo vysílá. Neodkládat všechny odpovědi donekonečna.
Budoucí kapitola může mít nový lokální problém a další fragment většího
příběhu, bez větvení a bez nutnosti složité simulace posádky.

## Než to implementujeme

Schválen tón nadějné záhady, pilot zásobovací lodi a ztracená výprava.
Zachovat tuto logiku; doladit lze formulace, jména a drobné detaily.
Zkontrolovat příběhové detaily proti grafice a plánovaným etapám.
Zatím nezavádět amnézii, zradu AI, boj ani časové paradoxy.

Lodní deník: Ship log pod navigací, New log entry po opravě. Čtyři anglické
zápisy, zamčené budoucí útržky, nepřečtené značky a nepovinné čtení.
Data src/logEntries.js, UI src/ShipLog.jsx. Odemykání plyne z oprav; replay
zápisy neduplikuje. Čtení ani přeskočení nemění postup. Stav jen v paměti.
