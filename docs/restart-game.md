# Restart hry (2026-09-22)

V Settings je Restart entire game, následně výslovné Yes, restart game nebo Cancel. Vymaže opravy, deník a dokončení odletu aktuálního profilu. Místní energie se doplní na 5; nastavení zvuku a přihlášení zůstávají. Ostatní účty a samostatná hra hosta nejsou mazány.

Host: okamžitý místní restart. Přihlášený účet: vyžaduje internet a úspěšnou odpověď reset_game_progress; teprve pak nahradí místní kopii. Při síťové chybě se místní data nemažou. Pokud se odpověď ztratí po serverovém potvrzení, další synchronizace převezme reset ze serveru.

Před použitím s účtem spustit supabase/003_restart_game.sql v Supabase SQL Editoru. Zahrnuje aktuální sync i reset funkci; nemaže data při instalaci. Každý reset zvyšuje resetRevision. Sync starších generací pouze vrací aktuální stav, nikdy neobnoví staré opravy. Zámek účtu serializuje zápisy. Opakování stejného reset požadavku s expected_revision nezpůsobí další reset. Převzetí nové generace z jiné karty/zařízení obnoví i herní UI, aby nezůstala rozpracovaná stará minihra.

Uživatel potvrdil úspěšné provedení supabase/003_restart_game.sql bez chyb. Živý cloudový restart a přenos resetu na druhé zařízení ještě nebyly samostatně ověřeny. Nikdy nespouštět starší migraci 001/002 po 003 (přepsala by synchronizační funkci). Po instalaci vyzkoušet restart na testovacím účtu a ověřit druhé zařízení. Energie zatím není cloudová.
