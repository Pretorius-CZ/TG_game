# Kontextové vysvětlení mechanik

MiniGame představí relevantní nálože Pulse/Nova, ochranné kryty, rezonátory a společné zásoby pomůcek. EN/CZ texty jsou v src/tutorials.js. Každá bublina má jedno potvrzení, blokuje akce na desce a drží klávesnicový fokus. Neodebírá tahy, energii ani zásoby. Ikona ⓘ v hlavičce znovu otevře relevantní vysvětlení. Dosavadní tlačítko pro pomoc s rezonátory zůstává dostupné; automatická první rezonátorová bublina je nahrazena novým systémem.

Přečtené mechaniky se ukládají odděleně pro hosta a přihlášené profily do localStorage (beyond-signal-tutorials-v1). Nejsou zatím synchronizované do Supabase a na novém zařízení se představí znovu. Uložení selhávajícího prohlížeče neblokuje potvrzení bubliny. Nejde o zprávy o novinkách po aktualizaci ani o vynucený ukázkový tah.

Ověření: relevance témat a poškozené úložiště v unit testech; izolovaný prohlížeč 320×568 ověřil viditelnost tlačítka, fokus a potvrzení českého vysvětlení pomůcek.
