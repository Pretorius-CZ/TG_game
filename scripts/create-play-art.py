from PIL import Image,ImageDraw,ImageFont,ImageOps
from pathlib import Path
from sys import argv
out=Path(argv[1] if len(argv)>1 else 'releases/google-play/store-kit-current/assets');out.mkdir(parents=True,exist_ok=True)
# Keep launcher exports in sync with the user's approved image.
import runpy
runpy.run_path(str(Path(__file__).with_name('create-android-icons.py')), run_name='__main__')
Image.open('releases/google-play/icon-assets/icon-512.png').save(out/'icon-512.png')
# Feature graphic uses existing approved in-game artwork.
bg=ImageOps.fit(Image.open('public/scenes/exterior-gear.webp').convert('RGB'),(1024,500),centering=(.5,.5)).convert('RGBA')
shade=Image.new('RGBA',bg.size);sd=ImageDraw.Draw(shade)
for x in range(1024):sd.line((x,0,x,500),fill=(5,14,24,max(15,int(235*(1-x/1100)))))
bg.alpha_composite(shade);bd=ImageDraw.Draw(bg)
font=lambda n:ImageFont.truetype('C:/Windows/Fonts/seguisb.ttf',n)
bd.text((55,110),'BEYOND',font=font(68),fill='#f0d09b');bd.text((58,190),'THE SIGNAL',font=font(43),fill='#f1f7f7')
bd.text((60,285),'Match. Repair. Explore.',font=font(25),fill='#b9e2e6')
bg.convert('RGB').save(out/'feature-1024x500.png')
print('Created store artwork and replaced default native launcher icons.')
