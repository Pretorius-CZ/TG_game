# Audit distribučních podkladů

Generováno příkazem `node scripts/audit-assets.mjs`. Jde o obsah public, nikoli skutečný první síťový download. Vite jej celý kopíruje do buildu; prohlížeč obrázky stahuje až podle jejich použití.

Celkem: 213 souborů, 152.86 MiB.

| Typ | Velikost |
| --- | ---: |
| .png | 121.55 MiB |
| .webp | 31.13 MiB |
| .wav | 0.14 MiB |
| .html | 0.02 MiB |
| .md | 0.02 MiB |
| .txt | 0.00 MiB |

PNG se stejně pojmenovaným WebP: 41, PNG celkem 92.14 MiB. To jsou kandidáti k prověření, nikoli automaticky bezpečně odstranitelné soubory.

## Největší soubory

| Soubor | Velikost |
| --- | ---: |
| public/scenes/icebound-relay-source.png | 3.13 MiB |
| public/scenes/silent-mine-source.png | 3.12 MiB |
| public/scenes/drifting-archive-source.png | 3.01 MiB |
| public/scenes/silent-mine-restored-source.png | 2.93 MiB |
| public/scenes/icebound-relay-restored-source.png | 2.90 MiB |
| public/scenes/drifting-archive-restored-source.png | 2.85 MiB |
| public/scenes/haven-gate.png | 2.82 MiB |
| public/scenes/haven-gate-restored.png | 2.74 MiB |
| public/scenes/cockpit-1-lights.png | 2.58 MiB |
| public/scenes/airlock-3.png | 2.56 MiB |
| public/scenes/airlock-4.png | 2.56 MiB |
| public/scenes/engine-5.png | 2.50 MiB |
| public/scenes/cockpit-2-windows.png | 2.49 MiB |
| public/scenes/airlock-1.png | 2.46 MiB |
| public/scenes/fuel-depot-cutout.png | 2.44 MiB |
| public/scenes/fuel-depot.png | 2.43 MiB |
| public/scenes/fuel-depot-repaired.png | 2.41 MiB |
| public/scenes/cockpit-4-diagnostics.png | 2.40 MiB |
| public/scenes/airlock-2.png | 2.39 MiB |
| public/scenes/cockpit-3-computer.png | 2.38 MiB |

## Pořadí přípravy distribuce

1. Zachovat současný web a oddělit editační zdroje od runtime assetů podle skutečných referencí, včetně dynamických názvů.
2. Změřit čistý start a první kapitolu v síťovém panelu: přenesené bajty, čas do hratelnosti a načítání dalších kapitol.
3. Rozdělit obsah kapitol pomocí dynamických importů, další kapitolu přednačítat před přechodem. Obrázky komiksů načítat jen před jejich použitím.
4. Zavést společné herní jádro a adaptéry web/Telegram/Poki/CrazyGames; balance stránku dodávat pouze správci na webu.
5. Teprve pak zapojit skutečné rewarded SDK podle aktuálních pravidel platformy; odměnu udělit pouze po potvrzení dokončené reklamy.

Tento audit neprokazuje limit první hratelné verze a nemění reklamy ani herní assety.
