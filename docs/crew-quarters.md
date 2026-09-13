# Crew Quarters — hratelný prototyp

Čtyři postupné opravy podle roadmapy: ventilace, filtry, lůžko a obytný modul.
Poškozená grafika a čtyři kumulativní opravené stavy v public/scenes/crew-0…4.png
a optimalizovaných WebP. Anglické bubliny, cíle a osobní deník v src/crewRepairs.js.
UI místnosti src/CrewQuarters.jsx; sdílí MiniGame, RepairBubble a lodní archiv.

| Oprava | Cíl | Deska |
|---|---|---|
| Air circulation | 36 všech | 7 × 7 |
| Air filters | 18 komet | 7 × 7, vykrojené rohy |
| Bunk | 20 krystalů | 7 × 7 |
| Cabin systems | 48 všech | 7 × 7, vykrojené rohy |

Pět typů, bez boosterů a limitu tahů; povlaky z roadmapy zatím odložené.
Po čtvrté opravě rozsvítí tyrkysový rám dveří v chodbě. Ostatní rámy a hlavní
osvětlení zůstávají vypnuté. Opakování neudělí opravu ani zápis znovu.
Postup vlastní rodičovská aplikace: opuštění místnosti jej neztratí,
obnovení celé stránky jej stále resetuje. Trvalý save ještě není implementovaný.

## Dočasná návaznost prototypu

Vstup přes levé dveře chodby se odemkne po 4 opravách kokpitu. Opravy komory
stále nejsou hratelné, proto je prototyp dočasně přeskakuje. Finální pořadí
roadmapy zůstává kokpit → komora/plášť → ubikace. Galley a Engine Room zamčené.
Nejde o tvrzení, že plášť je již opravený nebo že loď může odletět.

## Grafika — vestavěný imagegen

Základní prompt: Portrait 9:16 mobile sci-fi repair game background, small crew
quarters inside utilitarian supply shuttle. Cinematic painterly 3D realism,
worn ivory metal and orange trim, cool shadows and dim amber emergency light.
Upper left broken fan and torn ventilation duct, upper right broken filter,
middle left collapsed bunk beds, middle right broken desk and open lockers,
debris and subtle haze. Round porthole onto rocky blue moon. No people or text,
quiet ceiling top 15 percent and floor bottom 20 percent for UI.

Každá editace použila předchozí obrázek jako referenci, zachovala kameru,
geometrii, výřez a již dokončené opravy:
1. Repair only upper left fan and duct, intact blades and protective grille,
   complete duct and tidy cables. Other damage and dim lighting unchanged.
2. Repair upper right filter, pale cyan pleats, intact casing and status light,
   clear dusty haze. Bunks, desk and lockers remain damaged.
3. Restore bunks as straight sturdy frames, cream pillows and teal blankets,
   remove debris beneath. Right desk and lockers remain damaged.
4. Restore straight desk, upright cup, stacked books and plant; repair and close
   lockers, remove remaining debris; bright warm cabin illumination.

Budoucí vnější okno ubikací není doplněné; odměna v navigaci je zatím tyrkysový
rám chodby. Příběh nepřidává posádku, ekonomiku ani nové vysvětlení havárie.
