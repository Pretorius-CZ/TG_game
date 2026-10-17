# Energie rozehraného pokusu a obnovení stránky — 2026-10-17

## Důkaz a příčina

`chaos-2.zip`:32 scénářů na desktopu, Pixel7, iPadu Mini a iPhonuSE.
Všechny čtyři reporty uvádějí refresh po tahu s energií5→5.
Potvrzeno v kódu: stav `spent` i počet tahů žily pouze v komponentě;
odečet nastával až při prohře nebo potvrzeném odchodu. Nový dokument
po refreshi už o rozehraném pokusu nevěděl.

## Oprava

První platný tah okamžitě rezervuje jeden místní energetický článek.
Zápis proběhne před první animací a prvním await. Další tahy téhož
pokusu nic dalšího nestrhnou. Práva na vrácení drží konkrétní pokus
v aktuálním dokumentu; refresh nebo zavření stránky je nepřenáší.
Oprava nepotřebuje beforeunload, síťový požadavek ani SQL.

- Výhra po doběhnutí kaskád vrátí rezervaci právě jednou, ještě před
  potvrzením výsledku. Výhra tedy nemá čistý energetický náklad.
- Technická chyba s bezpečnou obnovou rezervaci také vrátí právě jednou.
- Prohra, potvrzený odchod a refresh rozehraného pokusu ponechají
  jediný již uložený odečet. Opakovaný refresh bez dalšího hraní nic
  dalšího neodečítá.
- Pouhé otevření, neplatná výměna a samotná pomůcka nejsou placený tah.
  Odchod či refresh před prvním platným tahem zůstává zdarma.
- Pokračování přes +5tahů znovu zpřístupní vrácení za případnou výhru;
  počet energie se tím čistě nemění. Funguje i při posledním článku.
- Retry je nový pokus; otevření samotné nic nestojí, jeho první platný
  tah rezervuje další článek. Vývojové Complete level rezervaci vrátí.

**Viditelná změna:** počet energie klesne už při prvním platném tahu
a výhra jej vrátí. Od této rezervace také běží dosavadní obnova
10/30min. Minihra zůstává hratelná i po rezervování posledního článku.
Nápověda energetického panelu pravidlo vysvětluje v EN/CZ.
Uložený postup, počty tahů, limity energie a intervaly obnovy se nemění.
Energie je nadále místní stav; tato oprava není serverová anti-cheat služba.

## Ověření

196 unit testů včetně opakovaného settle, nové instance po refreshi,
posledního článku, pokračování a oddělených pokusů.16 cílených browser
kontrol Chromium/WebKit: refresh po tahu i během animace, opakované
refreshování, bezplatný neplatný tah a pomůcka, výhra, prohra, odchod,
+5tahů/retry, simulovaná technická chyba. Všechny prošly.

Další nález ZIPu: při otočeníSE auditor počítá záměrně zakryté prvky
za modální výzvou k otočení. Nativní dialogy v DOM pořadí nejsou nutně
v pořadí top layer; auditor musí vybrat skutečně vrchní dialog.
Hlášení vodorovného posunu v tomto scénáři potřebuje samostatnou
kontrolu viewportu; neslučovat ho automaticky s energetickým exploitem.
