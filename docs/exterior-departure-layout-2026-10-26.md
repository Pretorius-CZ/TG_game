# Exteriér před odletem — 26. 10. 2026

Podle snímku `Snímek obrazovky 2026-10-26 071727.png` se překrývaly
plášť, podvozek, vstup do lodi a závěrečná kontrola / odlet.

- Opravy exteriéru rozestoupené do levé a pravé části scény; názvy,
  hvězdy i replay zůstávají dostupné.
- Modrý vstup do interiéru má samostatný prostor uprostřed.
- Předletová kontrola HARD a následný Odlet používají velké zlaté
  tlačítko dole, nezakrývají opravy ani vstup.
- Exteriér má minimálně 660 CSS px; na krátkém telefonu se posouvá.
  Výjimka v useSceneFit zabraňuje zmenšení značek pod 44 px. Ostatní
  scény zachovávají dosavadní přizpůsobení.

Ověření: 285 unit testů; 15 průchodů navigací v EN/CS/DE včetně všech
oprav exteriéru, závěrečné kontroly a otevření odletu. Kontrola průniku
obdélníků zahrnuje také popisek vstupu do lodi. Android-mode kontroluje
stejných šest stavů před/po finále, včetně minimální velikosti značek.
APK sestavené; fyzická instalace přes Run v Android Studiu.

Změněné jsou souřadnice venkovních značek, jejich lokální styly,
prezentace tlačítka odletu a výjimka pro přizpůsobení exteriéru.
ID, cíle, tahy, match-3 pravidla, odměny a ukládání se nemění.

Dodatek: po splnění HARD přípravy zůstává pod scénou samostatné tlačítko
pro její opakování s hvězdami. Odlet je samostatný a hvězdy přípravy se
už nezobrazují jako hodnocení odletu. Ověřeno otevření a opuštění HARD
replay, zachované splnění a následné otevření odletu v EN/CS/DE.

Finální umístění podle následného upřesnění uživatele: HARD příprava
je standardní úkol přímo NAD lodí (před i po splnění), s fajfkou,
hvězdami a replay po splnění. Dole je pouze velké tlačítko Odletět,
které se objeví po HARD přípravě. Nahrazuje mezikrok s replay pod scénou.
Exteriér s touto značkou má min. 780px, aby se úkol nepřekrýval
s nadpisem ani s opravami. Šest webových a šest Android-mode stavů
ověřuje rozestupy, pozici nad opravami, spuštění, replay a odlet.
