# Jednoznačná návaznost oprav lodi — 2026-10-25

## Příčiny

Po dokončení vnitřních oprav hráč přešel k venkovnímu plášti. Vstup zpět
do hotového interiéru ale vypadal jako další cíl. Běžný horní návrat byl
před odletem skrytý, takže návrat ven z navštíveného interiéru nebyl jasný.
Vstupní značka navíc zůstávala viditelná i přes odměnový panel Podvozku.
Tlačítko „Pokračovat v opravách“ v první kapitole jen zavřelo tento panel;
nezobrazilo popis následujícího úkolu. Pozdější expedice jej naopak otevíraly.

## Změna

- Zpět je dostupné i před odletem uvnitř lodi. Pořád používá dosavadní
  historii/fallback a kontrolu odemčení, neobchází zamčené budoucí místnosti.
- Po opravě všech vnitřních oblastí ukazuje venkovní scéna „Interiér lodi
  opraven“ a konkrétní další venkovní úkol. Opravený interiér nezpůsobí
  předčasnou opravu pláště, motorových krytů nebo podvozku v grafice.
- Návratový vstup se označuje „Prohlédnout interiér“, má vlastní modrou
  navigační značku a popisek nad průlezem. Opravné hotspoty zůstávají na
  svých původních souřadnicích. Při potvrzení opravy je vstup skrytý.
- První vstupní stav se odvozuje od skutečně prázdného postupu, nikoli od
  samotného počtu venkovních oprav 0/4; zachováno i uzamčení venkovních úkolů.
- Je-li v místnosti připravená další oprava, výsledek uvádí její název a
  po potvrzení otevře její popis s tlačítkem Hrát. Platí i pro kokpit a jeho
  přechod k navigaci. Samotná další minihra se nespouští bez potvrzení.
  Podvozek tedy vede výslovně k Nouzovému palivovému depu.
- Zavírací tlačítko zůstává: hráč si může prohlédnout místnost nebo deník.
  Výslovné opakování hotových oprav a původní zamykání zůstávají zachované.

ID, tahy, cíle, hvězdy, energie, účty, SQL a balanc se nemění.
Tři nové parametrické texty jsou v runtime EN/CS/DE katalogu.

## Ověření

284 Android unit testů a kontrola lokalizace prošly. 18 webových scénářů:
oprava posledního vnitřního systému → venkovní plášť → prohlídka interiéru
→ Zpět ven bez Kapitol; Podvozek → popis depa → teprve potom minihra;
první nástup i návrat bez odemknutí budoucích oprav; kokpit → další oprava
či navigace; opakování všech sedmi částí lodi a starší částečný postup.
Nové scénáře EN430/CS320/DE320; všech 9 nových scénářů prošlo také v Android
režimu. Snímky venkovního stavu a Podvozku byly vizuálně zkontrolovány.
APK sestaveno: 49 600 038 B. Fyzický telefon se tímto automaticky neaktualizuje.
