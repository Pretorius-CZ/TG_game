# Log rozhodnutí

> Chronologický, append-only log. Když v diskuzi (tady v chatu, nebo ve
> VS Code) padne netriviální rozhodnutí, přidej sem záznam. Díky tomu jde
> zpětně dohledat *proč* je něco tak, jak je — ne jen *co* je aktuálně
> platné (to je v `game-design.md` / `architecture.md`).

Formát záznamu:

```
## YYYY-MM-DD — Krátký název rozhodnutí

**Rozhodnutí:** co bylo rozhodnuto
**Kontext/důvod:** proč, jaké byly alternativy
**Dopad:** co to mění v GDD/architektuře (odkaz na sekci)
```

---

## 2026-08-24 — Založení projektu

**Rozhodnutí:** Projekt bude Telegram Mini App postavená na React + Vite.
Zdroj pravdy = GitHub repo; teoretické/design diskuze probíhají v Cowork
chatu a jejich výstupy se průběžně zapisují sem a do `game-design.md` /
`architecture.md`. `CLAUDE.md` v rootu dává Claude Code (VS Code) kontext
na začátku každé session.

**Kontext/důvod:** Potřeba spolehlivé "paměti" napříč dlouhým projektem a
napříč nástroji (Cowork chat vs. VS Code) — chat historie sama o sobě není
spolehlivá (session může skončit, kontext je omezený). Git repo jako
jediný zdroj pravdy tohle řeší.

**Dopad:** Zakládá strukturu `/docs` a `CLAUDE.md`.
