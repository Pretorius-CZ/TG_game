# Beyond the Signal — titulní obrazovka

Uživatel schválil název Beyond the Signal. Primární texty a vývoj EN,
v menu přepínání jazyka; lokalizační strukturu zachovat rozšiřitelnou.
Aktuální krok: tři vizuální návrhy, nikoli změna běžícího menu hry.

- A: loď po havárii, návaznost na první kapitolu. Doporučená výchozí varianta.
- B: let za signálem, důraz na objevování a budoucí kapitoly.
- C: pohled z kokpitu, osobnější a tajemnější atmosféra.

Společné menu: PLAY pro novou hru, CONTINUE po rozehrání, Chapters,
nastavení a volba EN/CZ. Před odemčením kapitol lze Chapters skrýt.
Obrázky jsou koncepty s naznačeným UI. Při implementaci použít čisté
pozadí a skutečná HTML tlačítka/texty, nikoli text vypálený v obrázku.

Další kroky: zvolený výtvarný směr → samostatné pozadí a logo → funkční
menu → krátké přeskočitelné intro se třemi scénami → přechod do exteriéru.
Intro přehrát automaticky jen poprvé, s možností zopakovat v nastavení.
Dosavadní postup hráče zachovat. Název právně ani obchodně neověřen.

Generováno vestavěným imagegen, reference public/scenes/exterior-portrait.webp.

## Generační zadání
Use case: ui-mockup. One portrait 9:16 mobile game title screen for
BEYOND THE SIGNAL. Reference: exterior-portrait.webp for ship identity
and painterly cinematic style. Compact white/orange utility spaceship,
rounded cockpit, paired cylindrical engines. Navy/teal/amber palette.
Title BEYOND / THE SIGNAL in upper 20%; bottom 25% restrained navy
gradient, warm gold PLAY, quiet Chapters, settings gear and globe EN.
No phone frame, currency, store or match board.
A: damaged ship on alien rocky terrain, huge blue planet, warm hatch,
cyan plants, hopeful mood and clear continuity with first chapter.
B: same ship in flight toward distant golden signal above blue planetary
horizon, delicate cyan radio ripples, purple-blue nebula, exploration.
C: dim cockpit with planet through curved windows, amber instruments,
turquoise signal waveform, empty pilot chair, intimate mystery.

Finální návrhy: title-a-crash.png, title-b-signal.png, title-c-cockpit.png.

Varianta B v2: na přání uživatele odstraněna vysoká ploutev na levém zadním motoru. Soubor title-b-signal-v2.png, vestavěný imagegen, reference title-b-signal.png. Prompt: Remove only the tall triangular white/orange fin on the left rear engine; restore smooth cylindrical cowling and background. Preserve composition, remaining ship features, lighting, typography and UI.

## Schválený směr a první scéna intra
Titulní obrazovka: varianta B v2 bez vysoké ploutve na zadním motoru.
První spuštění PLAY → přeskočitelné intro → exteriér po havárii.
Další spuštění CONTINUE → uložený postup bez opakování intra.

Scéna 1 — The signal: nepoškozená loď míří kolem neznámé modré planety,
v dálce zachytí slabý signál. Ještě žádná havárie ani výstražný režim.
EN: “That signal should not exist. It belonged to an expedition that never returned.”
CZ: „Ten signál neměl existovat. Patřil výpravě, která se nikdy nevrátila.“
Titulky a Skip budou HTML, nikoli součást obrázku. Klepnutí posune scénu,
Skip přeskočí celé intro. Zatím vzniká ilustrace, funkční intro není zapojené.

Generační zadání (imagegen, reference title-b-signal-v2.png):
Portrait 9:16 first intro story scene. Strict ship identity: compact white/orange
utility ship, rounded cockpit, two cylindrical engines, no tall left rear fin.
Undamaged ship, rear three-quarter view lower-middle left, nose upper-right,
unknown blue planet arc and navy/purple starfield. Tiny distant amber beacon
with subtle cyan radio ripples, no portal. Quiet wonder before the crash.
Clean illustration without any text/UI/logo. Bottom 22% naturally dark for
HTML subtitles, quiet upper-right for Skip. No people, stations or other ships.

Výstup první scény: intro-01-signal.png. Ilustrace vytvořena a zkontrolována, zatím bez zapojení do hry.

## Scéna 2 — Emergency descent
Výstup: intro-02-emergency.png, vestavěný imagegen. Reference:
intro-01-signal.png (svět a styl), title-c-cockpit.png (architektura kokpitu).
EN: “Then the emergency system took control.”
CZ: „Pak převzal řízení nouzový systém.“
Prompt: Portrait 9:16 cinematic painterly cockpit during emergency descent.
Tilted blue alien mountain horizon through broad curved windows, red/amber
warning lamps, restrained sparks, cyan autopilot landing trajectory without
readable text. Empty seat, worn ivory/orange utility cockpit. No crash yet,
no fireball. Dark bottom 22% for HTML subtitles, quiet upper-right for Skip.
No logo, buttons, typography or UI overlays. Preserve reference art style.
Ilustrace zatím nezapojená do hry; titulky a přeskočení budou samostatné UI.

## Scéna 3 — Still here
Výstup: intro-03-aftermath.png. Vestavěný imagegen, reference
public/scenes/exterior-portrait.webp pro návaznost na hratelný exteriér.
EN: “I'm alive. The ship is barely holding together. And the signal is still there.”
CZ: „Jsem naživu. Loď sotva drží pohromadě. A signál pořád vysílá.“
Prompt: Third intro scene, portrait 9:16, quiet aftermath of emergency landing.
Same damaged ivory/orange utility ship belly-down on alien rocky terrain,
rounded cockpit left, paired engines right and off, torn hull below cockpit.
Warm open hatch, faint settling dust, blue mountains, huge blue planet and
small moons, navy stars and cyan plants. No people, explosion or landing gear.
Dark bottom 22% for subtitles, quiet upper-right for Skip. Clean painterly
illustration without text or interface, continuous with reference game scene.
Všechny tři ilustrace jsou připravené; funkční intro a menu zatím nezapojené.

## Kontinuita lodi — horní křídlo
Uživatel potvrdil zachování horního křídla ve scéně 3 a ve hře.
První scéna nově intro-01-signal-v2.png: přidaná horní ploutev na trupu,
ne na motoru. Nahrazuje intro-01-signal.png pro budoucí implementaci.
Vestavěný imagegen; edit target intro-01-signal.png, reference intro-03-aftermath.png.
Prompt: Add the same modest swept-back ivory/orange dorsal fin to upper rear
main hull between engine nacelles, perspective-correct. Not on left engine.
Preserve antenna, ship geometry, position, sky, planet, signal and subtitle space.
Titulní koncept B v2 zatím stále bez ploutve; při finální výrobě pozadí
sjednotit také podle schválené konstrukce lodi.

## Implementace úvodu
Welcome.jsx / Welcome.css: titulní obrazovka podle schválené letové varianty,
čisté pozadí scene1 v2 s jednotným křídlem a samostatné HTML logo/ovládání.
Tři WebP ilustrace public/intro, titulky EN/CZ přes společný katalog.
Každá scéna 7 sekund po načtení, skrytá karta čas pozastaví; Next,
Begin repairs a Skip intro. Omezený pohyb vypíná animovaný zoom.
PLAY při prvním spuštění, CONTINUE u postupu nebo již zhlédnutého intra.
Zhlédnutí uloženo místně podle profilu a resetRevision; cloudové opravy
stačí k nabídnutí Continue i na dalším zařízení. Přehrání úvodu nemění postup.
Nastavení účtu, jazyk a zvuk z titulní obrazovky. Chapters otevře dostupnou
mapu, kliknutí na značku v herní hlavičce vrací na menu.
Původní poznámky „nezapojeno“ výše již neplatí. Bez pushe.
