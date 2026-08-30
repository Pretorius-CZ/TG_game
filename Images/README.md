# Images/ — konvence pro herní assety

> Tenhle soubor je jen pro orientaci v této složce, není součástí `/docs`.

## Struktura

- **`tiles/`** — finální, do hry schválené obrázky (dnes: dlaždice pro
  match-3 desku, později i speciální/power dlaždice, překážky, ikony
  boosterů apod.). Tohle jsou "zdrojové" verze ve vysokém rozlišení
  (dnes 2048×2048 / 1024×1024, skutečná alfa průhlednost) — **trackované
  v gitu**.
- **`raw-ai-generations/`** — syrové výstupy z AI generátorů (ChatGPT,
  Gemini): zamítnuté pokusy, staré verze před přepracováním (např. starý
  plochý ledový úlomek), obrázky s "falešnou" checkerboard průhledností
  před ořezáním. Slouží jen jako pracovní/referenční archiv →
  **negitované** (viz `.gitignore` v kořeni repa), ať se historie repa
  zbytečně nenafukuje.
- **`vfx/`** — znovupoužitelné procedurální VFX částice (jiskra, rázová
  vlna, úlomek) pro efekty speciálních dlaždic. Na rozdíl od ostatních
  assetů nejsou generované AI, ale skriptem (Python/PIL) — neutrální
  bílé/šedé, myšlené na přebarvení a škálování v kódu (CSS filter/tint).
  Trackované v gitu.
- **`pozadi/`** — atmosférická pozadí za hrací deskou, jedno "hero"
  pozadí na soustavu (12 celkem, `pozadi_01_...` až `pozadi_12_...`).
  Portrétová orientace (~9:16), s vinětou zatmívající střed rámu (kam
  padne hrací deska). Berou se jako referenční verze doladěné až s
  reálnou deskou v kódu (viz `docs/decisions-log.md`). V kódu se budou
  procedurálně variovat (tint/pan/zoom) pro víc unikátních levelů z
  jedné hero verze. Trackované v gitu.

## Proč takhle

- Finální assety jsou málo objemné (řádově desítky MB i při docela
  velkém setu dlaždic) a mění se zřídka → běžný git bez LFS zatím
  stačí. Pokud by `tiles/` časem výrazně nabobtnalo (desítky/stovky MB —
  např. plná sada pozadí pro všech 12 zón + animace), zvážit Git LFS.
  Zatím řešit netřeba.
- Před nasazením do hry (React/Vite build) se tyhle zdrojové PNG budou
  muset zmenšit/komprimovat na reálnou velikost dlaždice na desce
  (řádově 128–256 px) — to je ale krok až při zakládání app scaffoldu,
  ne teď. Zdrojové vysoké rozlišení schválně necháváme, ať je z čeho
  exportovat.

## Postup při nové dlaždici

1. Vygeneruj v AI nástroji podle promptu (viz konverzace / budoucí
   `docs/asset-prompts.md`, pokud vznikne).
2. Ulož raw výstup do `raw-ai-generations/`.
3. Pošli Claude, ať ořeže pozadí (rembg) a zkontroluje čitelnost na
   mockupu desky.
4. Schválenou verzi ulož do `tiles/` pod jasným názvem
   (`dlazdice_<nazev>.png`).
