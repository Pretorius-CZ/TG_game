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

## 9. Assety (obrázky)

- **Rozhodnuto (2026-08-30):** herní obrázky (dlaždice, později
  pozadí/ikony) žijí v `Images/` v kořeni repa, mimo `/src` (tam se
  přesunou/zoptimalizují až při zakládání app scaffoldu). Struktura:
  - `Images/tiles/` — schválené finální assety (dlaždice, speciální
    dlaždice, překážky), trackované v gitu
  - `Images/vfx/` — procedurální (ne-AI) VFX částice pro efekty
    speciálních dlaždic, trackované v gitu
  - `Images/pozadi/` — 12 hand-made atmosférických pozadí (jedno na
    soustavu), trackované v gitu; procedurální per-level variace
    (tint/pan/zoom) přijde až v kódu
  - `Images/raw-ai-generations/` — syrové/zamítnuté AI výstupy,
    negitované (`.gitignore`)
  - Detaily a workflow viz `Images/README.md`.
- **TODO:** krok pro zmenšení/kompresi zdrojových PNG (dnes 1024–2048 px)
  na reálnou velikost použitou ve hře — řešit při zakládání build
  pipeline, ne teď.
- **TODO:** pokud `Images/tiles/` časem výrazně nabobtná (desítky/stovky
  MB), zvážit Git LFS — zatím zbytečné.

## 10. Aktuální architektonický směr — 2026-09-10

Tato sekce má přednost před staršími předpoklady výše. Herní design
je nově oprava lodi bez měny, viz `game-design.md`.

- React + Vite zůstává webovou aplikací. CSS / Web Animations API
  animují vrstvy scény i dlaždice; herní logiku a sekvenci řídí JavaScript.
- Postup ukládat externě; preferována Supabase (PostgreSQL).
  Placený tarif je přijatelný, konkrétní tarif ani projekt nejsou založené.
- Návrh dat: hráč, dokončené levely, aktivní kapitola a dokončené opravy.
  Bez zůstatků měny, inventáře surovin a kosmetických variant.
- Backend ověří Telegram `initData` a naváže identitu na hráče.
  Konkrétní propojení se Supabase autentizací je implementační úkol.
- Přístup chránit oprávněními / RLS. Privilegované klíče pouze na serveru.
  RLS samo neověřuje legitimitu herní výhry.
- Dokončení levelu ukládat idempotentně: opakovaný požadavek nesmí
  přidat druhou odměnu. Rozsah serverového ověřování výsledků doladit.
- Lokální kopie a opakování požadavků mohou pomoci při výpadku sítě;
  úplný offline režim zatím není slíbený.
- Kapitoly a levely definovat daty, ukládaný stav verzovat pro budoucí rozšíření.
- Telegram adaptér zachovat oddělený od herního jádra.
- Hosting, konkrétní SDK, autentizace a CI/CD zůstávají otevřené.

Technické reference:
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API
- https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
- https://supabase.com/docs/guides/database/postgres/row-level-security
