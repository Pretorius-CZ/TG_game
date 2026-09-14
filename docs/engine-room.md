# Engine Room — strojovna

Implementace 2026-09-14: samostatná místnost přístupná po čtyřech opravách
kokpitu. Ubikace ani kuchyňka nejsou podmínkou. Vstup prostředními dveřmi
chodby, návrat do chodby. Pět postupných oprav, samostatný čítač a pět
osobních zápisů do společného lodního deníku.

| Oprava | Cíl | Tvar |
|---|---|---|
| Cooling circuit | 20 komet | Plná deska |
| Fuel system | 20 palivových článků | Vykrojené rohy |
| Main power | 22 krystalů | Plná deska |
| Engine assembly | 22 červených orbů | Vykrojené rohy |
| Systems test | 54 všech | Plná deska |

Všechny desky mají 7 sloupců × 8 řádků a 6 typů kamenů. Bez nových překážek,
boosterů, limitu tahů a spotřeby surovin. Texty a konfigurace: engineRepairs.js.
Sdílený průběh CrewQuarters.jsx nyní podporuje libovolný počet kroků místnosti.

## Výsledek a omezení

Po pěti opravách se rozsvítí červený rám strojovny. Strop chodby a finální
osvětlené pozadí se zapnou pouze při dokončených ubikacích, kuchyňce i strojovně,
v libovolném pořadí. Replay neuděluje další postup ani zápisy.

Poslední krok je lokální Systems test, nikoli celková předletová kontrola.
Strojovna sama neodemkne odlet. Plášť a navigace stále čekají na implementaci.
Externí trysky zatím nemají novou grafickou variantu; čtvrtá oprava vizuálně
obnovuje vnitřní pohonnou sestavu. Exteriér dál neukazuje zážeh ani vzlet.
Příběh nepředpokládá pořadí ostatních místností nebo přijatou živou odpověď.
Postup je zachován při navigaci, stále se resetuje obnovením stránky.

## Obrazové podklady a prompty

Vestavěný imagegen. public/scenes/engine-0.png až engine-5.png a optimalizované
WebP. Zdrojová grafika má portrétový formát 9:16. Základní zadání:

Portrait mobile repair game background of a compact damaged supply-shuttle
engine room. Painterly cinematic 3D realism, worn ivory metal and orange trim,
cool shadows and dim amber light. Upper left broken cooling pipes and reservoir,
upper right disconnected fuel lines and reserve tank, central dark broken
vertical power core, lower left damaged drive coupling, lower right shattered
console. No people, text, flames or weapons. Quiet ceiling and floor for UI.

Kumulativní editace se zachováním kamery, geometrie, výřezu a předchozích oprav:
1. Restore only upper left cooling: intact silver pipes and blue coolant reservoir.
2. Restore only upper right fuel: securely connect all hoses to reserve cylinder,
   intact couplings and orange gauge.
3. Restore central core with intact glass, bright contained cyan energy and rings.
4. Restore lower left drive with closed ivory/orange housing and amber standby ring.
5. Restore lower right console, bright system diagrams, closed panels and tidy
   wiring, warm white overhead work lights. No launch.

Poškozený soubor reference při jedné editaci vyžadoval opakování přes poslední
obrázek v konverzaci; výsledné pracovní PNG byly úspěšně převedeny na WebP.
