# Beyond the Signal — booster sound samples

All seven WAV effects are local, mono 22.05 kHz / 16-bit. Combined audio size approximately 150 KB. Short fades remove clicks; Pulse is 0.40 s with no prolonged tail.

Sources (retrieved 2026-10-02):
- Kenney, Sci-fi Sounds 1.0: https://kenney.nl/assets/sci-fi-sounds — CC0. Original license included as Kenney-License.txt.
- Spring Spring, Mechanical Explosion: https://opengameart.org/content/mechanical-explosion — CC0. Original file https://opengameart.org/sites/default/files/mechanical_explosion.wav . Copyright/attribution notice: Spring Spring. The source describes an explosion with clattering metal; it does not establish that it is a field recording of a real explosion.
- CC0 license: https://creativecommons.org/publicdomain/zero/1.0/

Derived layers, trimmed/resampled/mixed with short end fades:
- pulse: mechanical_explosion.wav + explosionCrunch_000 + lowFrequency_explosion_001
- laser: laserLarge_002 + impactMetal_004
- nova: laserLarge_004 + mechanical_explosion.wav + forceField_002
- emp: forceField_000 + lowFrequency_explosion_000 + impactMetal_002
- beam: laserLarge_000 + laserSmall_002
- tool-swap: doorOpen_000 + laserSmall_003
- shuffle: doorOpen_001 + doorClose_001 + doorOpen_002 + impactMetal_004

Kenney names above refer to original .ogg files. Transformations change duration/pitch and combine layers. These are authored sound-effect samples, not claimed to be recordings of real lasers or weapons. No purchase, subscription or attribution requirement; credits are retained voluntarily for provenance.

Versioned filenames prevent stale cached samples after an update. Loading is initiated with audio activation, only seven files are decoded. Existing synthesis is an offline/error fallback. Playback respects the existing sound setting, tab visibility and ad suspension; compressor and voice/rate limits control simultaneous chain effects.

## Explosion revision — 2026-10-06

Pulse and Nova now use pulse-v2.wav (0.72 s) and nova-v2.wav (1.00 s), mono PCM 32 kHz / 16-bit. Other effects retain v1. No Kenney electronic layers are mixed into these new explosions.

Source: Large explosion by SamsterBirdies, https://freesound.org/people/SamsterBirdies/sounds/592000/ — CC0 https://creativecommons.org/publicdomain/zero/1.0/ . Author describes a firecracker recorded in a garage with Tascam DR100MKIII microphones, downpitched, layered and lengthened. This is a designed effect based on a real recording, not a recording of a large bomb.

Public high-quality preview retrieved 2026-10-06: https://cdn.freesound.org/previews/592/592000_5487341-hq.mp3 . Local source docs/media/explosion-source-samster.mp3; rebuild with node scripts/create-explosion-samples.mjs. Changes: mono downmix, short excerpt, end fade, peak normalization to 0.9; Nova additionally plays source at 0.9 speed. No long tail or added oscillator. Files are bundled locally, not streamed from Freesound during play.
