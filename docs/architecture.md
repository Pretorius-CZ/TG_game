# Architektura

> Technická rozhodnutí a jejich zdůvodnění. Na rozdíl od `game-design.md`
> (co hra dělá) tenhle dokument popisuje, jak je postavená (technicky).

## 1. Přehled systému

**TODO** — diagram/popis: frontend (Telegram Mini App) ↔ backend ↔ DB ↔
Telegram Bot API.

## 2. Frontend

- React + Vite
- **TODO**: state management (Zustand/Redux/Context?), styling (Tailwind?),
  routing
- **Rozhodnuto (viz `game-design.md` sekce 1, `decisions-log.md`
  2026-08-26):** jádro hry (herní logika, stav, UI komponenty) by mělo
  být oddělené od Telegram-specifické vrstvy tenkým adaptérem —
  doporučeno: platformně-agnostické jádro + `TelegramAdapter` modul,
  který zapouzdřuje `@telegram-apps/sdk` (nebo alternativu), Stars
  platby a Telegram auth za společné rozhraní. Důvod: umožnit budoucí
  port na Google Play/App Store přes Capacitor (nebo podobný WebView
  wrapper) výměnou adaptéru, bez přepisu hry. Není součástí MVP scope,
  ale ovlivňuje strukturu kódu od začátku.
  - **TODO:** vybrat konkrétní tvar adaptérového rozhraní (platby,
    auth, storage, notifikace) — až se bude zakládat scaffold
  - **TODO:** ověřit, jestli Capacitor je opravdu nejlepší volba (vs.
    jiný WebView wrapper) — až bude port aktuální, ne teď

## 3. Telegram integrace

- **TODO**: `initData` validace na backendu (bezpečnost — nutné ověřovat
  podpis dat z Telegramu na serveru, nikdy nedůvěřovat jen klientovi)
- **TODO**: Bot setup, Web App tlačítko, deep linking

## 4. Backend

**TODO**

## 5. Datový model

**TODO**

## 6. Hosting / deployment / CI

**TODO**

## 7. Bezpečnost

- **TODO**: validace Telegram `initData` (podpis, expirace)
- **TODO**: ochrana proti cheatování na klientovi (pokud hra má
  competitive/leaderboard prvky, herní logika kritická pro skóre patří na
  server, ne na klienta)

## 8. Otevřené otázky

- Řešitelnost generovaných levelů (viz `game-design.md` sekce 8):
  procedurální generátor match-3 desek musí garantovat, že vygenerovaná
  deska má aspoň jeden platný tah a je teoreticky dohratelná — platí i
  pro těžší presety (Hard levely i povinné boss levely, viz GDD 5.8).
  Bez týhle kontroly riskujeme "mrtvé" levely (neřešitelné hned od
  začátku) — běžný, zdokumentovaný problém u match-3 generátorů. Řešit
  při implementaci generátoru, ne teď.
- Platformní portabilita — viz sekce 2 výše (adaptérová vrstva pro
  Telegram, budoucí Capacitor port).
- Tvar `TelegramAdapter` rozhraní (platby, auth, storage) — viz sekce 2.
