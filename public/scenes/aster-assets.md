# Aster Veil — grafické podklady

Vytvořeno nástrojem imagegen 2026-09-26. Styl: portrétová realisticky
malovaná sci-fi scéna, krémový průmyslový kov s oranžovými prvky,
modrofialová soustava, bez textů a UI. Horní prostor pro ovládání.

- `aster-buoy.webp`: poškozená bóje, spodní napájecí box, horní antény,
  centrální kruhový archiv. Zdroj `exec-0a922c75-f3e4-4a40-ab4a-ed1ceaf45671.png`.
- `aster-buoy-restored.webp`: edit stejného záběru, opravené panely,
  svítící napájení a kruhová hvězdná mapa. Zdroj `exec-73c2fbaa-ce28-4e47-a6d6-72dd017bbbf3.png`.
- `aster-verdant.webp`: opuštěná výzkumná stanice na zelené planetě,
  plošina, voda, solární zdroj, skleník, skener a kapsle s rostlinou.
  Zdroj `exec-2a4e9840-3200-45e7-981c-4e8500a99797.png`.
- `aster-verdant-restored.webp`: edit stejného záběru, opravené zařízení,
  voda v oběhu, světla plošiny, zdravé růžové rostliny a pěstební lampy.
  Zdroj `exec-978edd7f-9a83-4e71-87df-6c91481f4d5a.png`.
- `aster-fracture.webp`: vykopávky nad měděnou trhlinou měsíce, lávka,
  generátor, vrták, spektrometr, třídička a archivní sonda.
  Zdroj `exec-f895aa83-2573-44ef-940a-80e2042d3638.png`.
- `aster-fracture-restored.webp`: edit stejného záběru, bezpečné zařízení,
  osvětlené ovládání, modré cívky, svítící spektrometr a archiv sondy.
  Zdroj `exec-c1c07b64-a994-40c0-8c73-d90096dd4fcc.png`.

Dlaždice `../tiles/aster-ore.png` a `../tiles/aster-bio.png`: samostatné
objekty na průhledném pozadí. Ruda: hranatá tmavá hornina s měděnými
oranžovými žilkami. Jádro: růžové svítící semeno v trojici fialových
organických laloků. Siluety čitelné v 48 px, bez nápisu a rámečku.
Zdroje `exec-6f557b02-5f52-4a39-99dd-122640e19069.png` a
`exec-07bb54b8-b827-4b00-885b-e4df0f57a70b.png`.

Originály: `C:/Users/m/.codex/generated_images/01a08bcd-dbf0-78c0-b121-9ec9c111c417/`.
Ve hře jsou optimalizované kopie; průhlednost dlaždic je zachovaná.

## 2026-09-27 — Ikony mapy
Mapa Aster Veil používá tři transparentní ilustrované ikony 256×256:
map-aster-buoy.png (zmenšená podoba skutečné bóje), map-aster-moon.png
(krátery, nepravidelná trhlina a úlomky), map-aster-garden.png (oceány,
vegetace a oblačnost). Nahrazují jednoduché CSS tvary. Zdroje imagegen:
exec-28b28af1-5135-4d90-a392-2b951c15200e.png,
exec-a3f5966f-3197-44ac-8066-1b3ceb4d7605.png,
exec-2b77b5c9-213e-4975-a7e5-224c2382f5e1.png.
Průhlednost zachovaná. Ověřen build, šířky320/390 bez překryvu uzlů
s popisky a konzolí, načtení všech ikon a kliknutí do bóje.

## 2026-09-27 — Ikony Kepler Reach
Také kapitola2 používá čtyři transparentní malované mapové ikony:
map-kepler-origin (šedomodrý měsíc), mine (měděný těžební měsíc),
ice (ledový svět) a wreck (archivní loď). Vytvořeno imagegen, zdroje:
exec-354243b7-45b8-4920-85c1-fbfa7dd36745.png,
exec-6cb0a481-bd74-4f71-bebe-2fb62fa41627.png,
exec-b05d02f6-74f7-45e6-ba89-3466e5622e1c.png,
exec-d239f549-d1fb-40b1-89cd-56fa1e2100a6.png.
Rozměry256×256, ve hře86px/76px. Mapa má rezervu pro náklad/Haven.
Build a šířky320/390 před skenerem i po Haven bez překryvu ověřeny.
