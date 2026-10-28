"""Export the approved logo without repainting it or changing its proportions."""
from pathlib import Path
from PIL import Image, ImageOps

source = Path('Images/logo_game.jpg')
art = ImageOps.exif_transpose(Image.open(source)).convert('RGBA')
background = art.getpixel((0, 0))
square = Image.new('RGBA', (max(art.size), max(art.size)), background)
square.alpha_composite(art, ((square.width-art.width)//2, (square.height-art.height)//2))
out = Path('releases/google-play/icon-assets')
out.mkdir(parents=True, exist_ok=True)
square.resize((512, 512), Image.Resampling.LANCZOS).save(out/'icon-512.png')

for density, size, adaptive in [('mdpi',48,108),('hdpi',72,162),('xhdpi',96,216),('xxhdpi',144,324),('xxxhdpi',192,432)]:
    folder = Path('android/app/src/main/res')/('mipmap-'+density)
    folder.mkdir(parents=True, exist_ok=True)
    legacy = square.resize((size, size), Image.Resampling.LANCZOS)
    legacy.save(folder/'ic_launcher.png')
    legacy.save(folder/'ic_launcher_round.png')
    # The circular artwork occupies about 85% of the JPEG. Scaling to 70% of
    # the adaptive layer keeps its rim inside Android's 66/108 safe circle.
    foreground = Image.new('RGBA', (adaptive, adaptive))
    mark_size = round(adaptive*.70)
    mark = square.resize((mark_size, mark_size), Image.Resampling.LANCZOS)
    foreground.alpha_composite(mark, ((adaptive-mark_size)//2, (adaptive-mark_size)//2))
    foreground.save(folder/'ic_launcher_foreground.png')

color = '#%02X%02X%02X' % background[:3]
Path('android/app/src/main/res/values/ic_launcher_background.xml').write_text(
    '<?xml version="1.0" encoding="utf-8"?>\n<resources><color name="ic_launcher_background">'+color+'</color></resources>\n', encoding='utf-8')
print('Android launcher icons and 512px store icon exported from Images/logo_game.jpg.')
