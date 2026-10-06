# První reklamní videa — 2026-10-05

Lokální návrhy pro porovnání před případnou reklamní kampaní. Nic nebylo
zveřejněno ani placeno. Videa jsou MP4/H.264 1080 × 1920, přibližně
15 sekund, s anglickými titulky a zvukem. Soubory v `docs/media`:

Hudební verze společného střihu: `beyond-the-signal-journey-music.mp4`,
19,5 sekundy, vlastní původní syntezátorový podklad 124 BPM s bicími,
basem, arpeggiem a závěrečným akordem. Bez externích hudebních vzorků.
Samostatně `beyond-the-signal-synthwave.wav` (stereo 48 kHz).
Obnova: `node scripts/create-promo-score.mjs`, následně
`node scripts/combine-promo-videos.mjs --music`. Herní zvuky zachovány,
společný mix přes kompresor. Dekódování finálního MP4 ověřilo stereo,
19,48 s audia, peak 0,725 a RMS 0,099; rozlišení 1080 × 1920.

- `beyond-the-signal-promo-vertical.mp4`: první varianta, kaskáda a nálož.
- `beyond-the-signal-laser-vertical.mp4`: původní dlaždice, laser a Pulse.
- `beyond-the-signal-station-vertical.mp4`: moduly Elysia, Beam a Pulse.
- `beyond-the-signal-garden-vertical.mp4`: organické dlaždice, kryty a EMP.
- `beyond-the-signal-video-variants.png`: společný náhled tří nových variant.
- `beyond-the-signal-journey-vertical.mp4`: společný chronologický střih,
  19,5 sekundy. Loď a původní dlaždice → oprava → Elysium → Noční
  zahrada → výzva k hraní. Pozdější kapitoly označené Later/Beyond,
  aby reklama neslibovala zahradu hned po spuštění. Vzniká přes
  `node scripts/combine-promo-videos.mjs`; ověřeno dekódování a snímky
  všech tří herních částí i závěru.

Každá nová varianta má také vlastní `-poster.png`. Závěr odkazuje na
playbeyondthesignal.com. Výchozí místní grafika a zvukové vzorky hry;
záběry jsou skutečné tahy a použití pomůcek, natočené v izolovaném
prohlížeči. Nastavení postupu slouží jen k otevření pozdějších úrovní,
nedotýká se postupu uživatele ani živých statistik (Supabase je blokována).
Tempo záběrů je upravené pro sedmisekundový herní segment.

Obnovitelné přes `node scripts/create-promo-video.mjs laser` (nebo
`station`, `garden`), vyžaduje již vytvořený dist-itch a místní Playwright
s Edge. Skript používá původní herní pravidla, hledá platná spojení
a nahrává skutečnou animaci. Kaskády mají doplněné krátké tóny,
pomůcky používají zvukové vzorky hry. Ověřena dekódovatelnost videí,
rozlišení, délka a obrazové náhledy. Žádný push nebyl požadován.
