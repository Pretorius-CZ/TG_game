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

-
