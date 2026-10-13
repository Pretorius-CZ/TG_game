# Kontextové vysvětlení mechanik

MiniGame představí relevantní nálože Pulse/Nova, ochranné kryty, rezonátory a společné zásoby pomůcek. EN/CZ texty jsou v src/tutorials.js. Každá bublina má jedno potvrzení, blokuje akce na desce a drží klávesnicový fokus. Neodebírá tahy, energii ani zásoby. Ikona ⓘ v hlavičce znovu otevře relevantní vysvětlení. Dosavadní tlačítko pro pomoc s rezonátory zůstává dostupné; automatická první rezonátorová bublina je nahrazena novým systémem.

Přečtené mechaniky se ukládají odděleně pro hosta a přihlášené profily do localStorage (beyond-signal-tutorials-v1). Nejsou zatím synchronizované do Supabase a na novém zařízení se představí znovu. Uložení selhávajícího prohlížeče neblokuje potvrzení bubliny. Nejde o zprávy o novinkách po aktualizaci ani o vynucený ukázkový tah.

Ověření: relevance témat a poškozené úložiště v unit testech; izolovaný prohlížeč 320×568 ověřil viditelnost tlačítka, fokus a potvrzení českého vysvětlení pomůcek.


## 2026-10-08 — Boosty až po použití
Automatické nálože/pomůcky se při vstupu do levelu nezobrazují. Každá z pěti pomůcek (Laser/Míchání/Výměna/Paprsek/EMP) a obou náloží(Pulse/Nova) má samostatné EN/CZ vysvětlení až po prvním úspěšném použití a všech animacích/kaskádách. Pouhé vytvoření nálože, výběr či zrušení cíle, doplnění pomůcky reklamou a neúspěšná akce nápovědu nespouštějí. Řetězem odpálená nálož se počítá jako použitá. Potvrzená nápověda se pamatuje po profilu jako dosud; v aktuální minihře i při blokovaném storage. Kryty/rezonátory zůstávají při setkání; ruční ⓘ zachovává dosavadní obecný přehled. Nápověda sama nic nespotřebuje.

## 2026-10-13 — Připomínky Bounty: MAGG, SoloRaven a Brave tester

Nahrazuje předchozí pravidlo vysvětlovat boosty až po spotřebování.
- První výběr Laser/Shuffle/Swap/Beam/EMP ukáže vysvětlení a nic neprovede.
  Po zavření hráč vybere pomůcku znovu; žádné automatické odpálení ani spotřeba.
- Pulse/Nova se vysvětlí po vytvoření a doběhnutí kaskád. Pokud hráč narazí
  na dosud nevysvětlenou nálož, první pokus o aktivaci jen otevře nápovědu.
- Stav potvrzených témat zůstává místní po profilu, nepřenáší se automaticky
  mezi zařízeními. Staré potvrzení témat je respektované. Přehled ⓘ dovoluje
  kdykoli vybrat konkrétní pomůcku a znovu přečíst její účinek.
- Obrázky ukazují čtyři/pět v řadě, pět kamenů do T/L, zásah Pulse3×3 a
  řádek/sloupec Nova. Výslovně: nálož se nepřesouvá, odpaluje se klepnutím za tah.
- U výhry: tři hvězdy jsou dobrovolné, stačí vyhrát. Replay přes ☰ Kapitoly,
  návštěvu místnosti a dokončenou opravu ✓. Pravidla hvězd ani obtížnost beze změny.
- Pulse/Nova/EMP: vzorky mají nižší zisk,45ms nástup a low-pass2600Hz;
  syntetická záloha nižší zisk a35ms nástup. Hudba a běžná spojení zachované.

Ověření:180 unit testů a build; izolovaný browser EN/CZ320×568 ověřil první
výběr všech pěti pomůcek bez spotřeby/tahu, následné Míchání bez tahu, vznik
nálože s nápovědou, přehled bez horizontálního přetékání a výherní vysvětlení.
Offline render vzorků: RMS Pulse0,140→0,092, Nova0,165→0,105, EMP0,136→0,087
(před společným efektním mixem). Jde o měření, nikoli osobní poslech testerů.
Produkční analytika při browser testu blokovaná. Žádná SQL migrace.
