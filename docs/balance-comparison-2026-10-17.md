# Porovnání balanc-1 a balanc-2 — 2026-10-17

## Podklady a kontrola verze

Přečteny oba ZIPy z Downloads: strukturovaný JSON všech187levelů,
souhrny a metodické popisky HTML. Oba běhy mají200her/profil/level,
cíl75 %. První běh10:38UTC, druhý11:10UTC.
Čísla, ID a limity druhého reportu odpovídají současnému levelCatalog.
U168nezměněných levelů jsou celé výsledkové objekty identické;
výsledky se liší přesně u19levelů schválené úpravy. Všech19se zlepšilo
v úspěšnosti obou profilů. Není to nezávislý doklad lidské úspěšnosti.

Report neobsahuje zdroj simulátoru, seedy, konfigurace krytů a kruhů
ani průběhy jednotlivých pokusů. Limity jsou ověřitelné přímo,
provedení konkrétních krytů nezávisle z JSONu ověřit nelze.

## Výsledek

| Levely | Běžný profil před → po | Zkušený profil před → po |
|---|---:|---:|
|1–100|80,3 →80,3 %|93,2 →93,2 %|
|101–120|66,0 →66,0 %|87,0 →87,0 %|
|121–140|57,7 →60,0 %|80,5 →82,4 %|
|141–160|51,7 →70,1 %|77,4 →88,4 %|
|161–187|62,6 →62,6 %|82,6 →82,6 %|

Hlavní obtížný úsek se výrazně zlepšil.8z20levelů141–160 nyní
dosahuje alespoň75 % casual; pod60 % zůstávají pouze149a154.
Počet levelů s doporučením přidat alespoň3tahy klesl73→63,
počet levelů s casual.stuck>10 % klesl17→12.

| Level | Tahy před → po | Casual před → po | Skilled před → po | Stuck před → po |
|---:|---:|---:|---:|---:|
|138|29→35|32→77 %|54,5→92,5 %|12→1,5 %|
|148|30→38|44→62 %|65,5→79 %|20→14,5 %|
|149|29→37|31,5→57,5 %|52→80 %|19→17 %|
|153|31→39|48→66 %|73→84,5 %|15→11,5 %|
|154|30→36|38→58 %|60,5→77 %|27→18 %|

138je dobrý kandidát k ponechání současné konfigurace. Medián tahů
k dokončení klesl35→29 a75.percentil48→34. U149medián34→33,
u15435→33; dlouhý konec rozdělení se ale nevyřešil. U148a153se
měnily pouze tahy a mediány i75.percentily zůstaly stejné.

## Interpretace stuck

Stuck klesá i u levelů se změněným samotným limitem, např.144:
13→8,5 %. Nemůžeme to proto prezentovat jako počet opravených
neřešitelných desek. Může se měnit i délka prodlouženého testu.
Bez definice simulátoru nerozlišujeme vyčerpání jeho horizontu,
slabou strategii, dlouhé čekání na cíl a skutečný technický problém.

Současný seznam nad10 %:53,67,120,125,134,148,149,153,154,
164,174,177. Z této kategorie vypadly138,144,150,155a158.

## Doporučení dalšího kroku

Upřesnění uživatele po reportu: hra nemá být triviální ani frustrující.
75 % není povinná jednotná úspěšnost každého levelu. Průměr70,1 %
v pozdním úseku může být vhodný; nejde o důvod pokračovat v plošném
zvyšování limitů. Zachovat obtížné špičky a prostor pro lepší strategii,
sledovat jejich návaznost a prohry kvůli dlouhému čekání na cíl.
Číselné varianty níže jsou možnosti izolovaného testu, nikoli schválené
další změkčení. Přednostně diagnostikovat149a154;148/153neladit jen
proto, že nedosahují75 %. Lidskou frustraci samotná simulace neměří.

Ponechat zlepšené oblasti a další zásah soustředit na148/149/153/154.
Nevyvozovat nutnost limitů52–58 pouze z horního konce simulace.

1. **149a154:** oba mají nyní čtyři kryty, dva barevné cíle a žádný
   rezonátor. Doplňovat u proher chybějící barvy a konkrétní kryty.
   Pokud zůstávají barvy, porovnat variantu149:33kapslí→27
   (24energie zachovat),154:30semen+27chladiva→24+24.
   Jestli místo toho zůstávají kryty, barvy nesnižovat jako údajnou
   opravu prokázané příčiny; testovat rozložení krytů zvlášť.
2. **148a153:** mají po jednom rezonátoru s cílem3. Pokud prohrám
   dominuje nedostatečné nabití, porovnat samostatnou variantu3→2
   při současných tazích a ostatních cílech. Bez zbytkových cílů jde
   o hypotézu, nikoli potvrzenou diagnózu.
3. Přidat do reportu skutečně použitou konfiguraci, verzi hry/pravidel,
   seedy, definici stuck a souhrn zbytkových cílů. Obě předchozí sady
   měnily zároveň limit a někde kryty, proto jejich jednotlivý přínos
   nelze přesně oddělit. Varianty dále porovnávat samostatně.

Další výrazná překážka mimo tento zásah je161 (32,5 %),167(26,5 %)
a187(30 %); evidovat jako další dávku, nepřidávat teď změny do všech
zbývajících levelů současně. Živá data skutečných hráčů zde neověřena.

V tomto kroku byl zpracován report a doporučení. Herní konfigurace
zůstává na zveřejněné variantě `2026-10-17-refuge-balance-v1`.
