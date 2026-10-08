# Kontextové vysvětlení mechanik

MiniGame představí relevantní nálože Pulse/Nova, ochranné kryty, rezonátory a společné zásoby pomůcek. EN/CZ texty jsou v src/tutorials.js. Každá bublina má jedno potvrzení, blokuje akce na desce a drží klávesnicový fokus. Neodebírá tahy, energii ani zásoby. Ikona ⓘ v hlavičce znovu otevře relevantní vysvětlení. Dosavadní tlačítko pro pomoc s rezonátory zůstává dostupné; automatická první rezonátorová bublina je nahrazena novým systémem.

Přečtené mechaniky se ukládají odděleně pro hosta a přihlášené profily do localStorage (beyond-signal-tutorials-v1). Nejsou zatím synchronizované do Supabase a na novém zařízení se představí znovu. Uložení selhávajícího prohlížeče neblokuje potvrzení bubliny. Nejde o zprávy o novinkách po aktualizaci ani o vynucený ukázkový tah.

Ověření: relevance témat a poškozené úložiště v unit testech; izolovaný prohlížeč 320×568 ověřil viditelnost tlačítka, fokus a potvrzení českého vysvětlení pomůcek.


## 2026-10-08 — Boosty až po použití
Automatické nálože/pomůcky se při vstupu do levelu nezobrazují. Každá z pěti pomůcek (Laser/Míchání/Výměna/Paprsek/EMP) a obou náloží(Pulse/Nova) má samostatné EN/CZ vysvětlení až po prvním úspěšném použití a všech animacích/kaskádách. Pouhé vytvoření nálože, výběr či zrušení cíle, doplnění pomůcky reklamou a neúspěšná akce nápovědu nespouštějí. Řetězem odpálená nálož se počítá jako použitá. Potvrzená nápověda se pamatuje po profilu jako dosud; v aktuální minihře i při blokovaném storage. Kryty/rezonátory zůstávají při setkání; ruční ⓘ zachovává dosavadní obecný přehled. Nápověda sama nic nespotřebuje.
