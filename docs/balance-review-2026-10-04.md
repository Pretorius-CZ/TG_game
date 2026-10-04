# Kontrola obtížnosti a další postup — 2026-10-04

## Statistiky

Katalog má 145 levelů, řadí se podle kapitol a má pořadová čísla. Poslední pokusy jsou vidět samostatně podle času odehrání, nezávisle na filtrech. Přibyl filtr zaznamenané verze pravidel. Starší data bez verze se dají oddělit. Verze je značka telemetry, nikoli plný otisk každé historické konfigurace.

## Kokpit — kontrolní simulace

300 pokusů na každou opravu a variantu, deterministické počáteční seedy. Automat zná pouze okamžitý zisk, nepoužívá reklamy, nápovědu ani pomůcky. Další náhodný průběh se mezi variantami přirozeně liší.

| Level | Tahy | Rovnoměrné doplňování | Pojistka fair-v3 |
| --- | ---: | ---: | ---: |
| Světla | 14 | 224/300 (75 %) | 225/300 (75 %) |
| Okna | 16 | 263/300 (88 %) | 268/300 (89 %) |
| Počítač | 24 | 139/300 (46 %) | 150/300 (50 %) |
| Diagnostika | 24 | 98/300 (33 %) | 104/300 (35 %) |

Limity neměnit. Pojistka nedělá z těžkých oprav automatické výhry. Diagnostika zůstává kandidátem ke sledování frustrace. Simulace není lidská úspěšnost ani důkaz účinku malé procentní změny.

Reprodukce: `node scripts/audit-balance.mjs 300 --levels=lights,windows,computer,diagnostics` a totéž s `--fair`.

## Vyhodnocení dalších lidských pokusů

Ve statistikách zvolit `2026-10-04-fair-refill-v3`. Nejprve získat alespoň 20 dokončených pokusů na sledovaný level, rozlišit pomoc a odchody. Porovnat se starší konfigurací při stejných limitech, cílech a rozměrech; několik her jednoho zkušeného testera nepovažovat za reprezentativní vzorek. Zapisovat také konkrétní situace bez potřebné barvy. Platební stav ani zhlédnutí reklamy nesmějí měnit generování desky.

## Distribuce

První krok je reprodukovatelný audit podkladů v `distribution-assets-audit.md`. Další práce: změřit čistý síťový start, bezpečně oddělit zdrojové PNG od používaných assetů a rozdělit načítání kapitol. Současný audit neměří první hratelný download; platformní SDK ani skutečné reklamy nejsou tímto nasazené.


2026-10-04 — Na žádost uživatele ulehčen začátek: počítač 24 → 28 tahů, diagnostika 24 → 32. Cíle, kryty, rozměry i boosty zachované. Simulace fair-v3, 300 pokusů: počítač 206/300 (69 %, dříve 50 %), diagnostika 250/300 (83 %, dříve 35 %). Jde o automat, ne lidskou úspěšnost. Nahrazuje předchozí doporučení tyto limity zachovat. Změna lokální.
