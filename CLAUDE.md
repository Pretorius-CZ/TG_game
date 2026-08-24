# CLAUDE.md — kontext projektu pro Claude Code

> Tento soubor čte Claude Code (CLI / VS Code extension) automaticky na začátku
> každé nové session v tomhle repozitáři. Slouží jako "krátkodobá paměť" mezi
> jednotlivými sezeními — místo abys mi pokaždé znovu vysvětloval, o co jde,
> najdu si to tady. Udržuj ho stručný a aktuální; detaily patří do `/docs`.

## Co je tenhle projekt

Telegram hra (Telegram Mini App) — webová aplikace běžící uvnitř Telegramu
přes Telegram Web App API.

**TODO:** až domluvíme herní koncept, doplň sem 2–3 věty: o jakou hru jde,
pro koho, jaký je hlavní herní smyčka (core loop).

## Tech stack

- Frontend: React + Vite
- Telegram integrace: `@telegram-apps/sdk` (nebo `twa-dev/sdk` — vybrat a doplnit)
- Backend: **TODO** — doplnit až padne rozhodnutí (Node/Express? Serverless?
  Potřeba backend vůbec, nebo stačí čistě klientská hra + Telegram
  autentizace?)
- Databáze: **TODO**
- Hosting: **TODO**

## Struktura repozitáře

```
/src            – zdrojový kód aplikace
/docs           – herní design, architektonická rozhodnutí, decision log
CLAUDE.md       – tento soubor
```

## Konvence

- Commit zprávy: **TODO** doplnit preferovaný styl (Conventional Commits apod.)
- Branch strategie: **TODO** (např. `main` + feature branches + PR)
- Jazyk kódu/komentářů: angličtina; herní design dokumenty a diskuze: čeština

## Aktuální stav / rozpracované věci

- [ ] Ujasnit herní koncept a core loop (viz `/docs/game-design.md`)
- [ ] Rozhodnout tech stack (backend, DB, hosting)
- [ ] Založit základní scaffold (Vite + React + Telegram SDK)
- [ ] Nastavit CI/CD

> Tuhle sekci aktualizuj po každé větší práci — je to nejrychlejší způsob,
> jak dát nové session (mně) vědět, kde jsme skončili.

## Odkazy

- Herní design: `/docs/game-design.md`
- Architektonická rozhodnutí: `/docs/architecture.md`
- Log rozhodnutí (chronologicky): `/docs/decisions-log.md`
