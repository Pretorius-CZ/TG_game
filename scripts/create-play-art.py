from PIL import Image,ImageDraw,ImageFont,ImageOps
from pathlib import Path
out=Path('releases/google-play/internal-1/store-assets');out.mkdir(parents=True,exist_ok=True)
S=1536
im=Image.new('RGBA',(S,S),(9,24,34,255));d=ImageDraw.Draw(im)
for r in range(780,0,-3):
 t=1-r/780;d.ellipse((768-r,768-r,768+r,768+r),fill=(int(9+9*t),int(24+25*t),int(34+25*t),255))
# Signal arcs and a four-point star matching the approved brand mark.
for r in (380,510): d.arc((768-r,768-r,768+r,768+r),108,252,fill='#69c7d0',width=33)
p=[(800,270),(855,663),(1260,770),(855,862),(800,1270),(735,862),(350,770),(735,663)]
d.polygon(p,fill='#e7bb77');d.polygon([(800,270),(800,770),(350,770),(735,663)],fill='#f6d696')
icon=im.resize((512,512),Image.Resampling.LANCZOS);icon.save(out/'icon-512.png')
# Adaptive foreground reserves the Android safe zone; opaque background is separate.
mark=Image.new('RGBA',(S,S));md=ImageDraw.Draw(mark)
for r in (380,510):md.arc((768-r,768-r,768+r,768+r),108,252,fill='#69c7d0',width=33)
md.polygon(p,fill='#e7bb77');md.polygon([(800,270),(800,770),(350,770),(735,663)],fill='#f6d696')
for name,size,fore in [('mdpi',48,108),('hdpi',72,162),('xhdpi',96,216),('xxhdpi',144,324),('xxxhdpi',192,432)]:
 folder=Path('android/app/src/main/res')/('mipmap-'+name)
 for n in ['ic_launcher.png','ic_launcher_round.png']: im.resize((size,size),Image.Resampling.LANCZOS).save(folder/n)
 canvas=Image.new('RGBA',(fore,fore));m=mark.resize((round(fore*.66),round(fore*.66)),Image.Resampling.LANCZOS);canvas.alpha_composite(m,((fore-m.width)//2,(fore-m.height)//2));canvas.save(folder/'ic_launcher_foreground.png')
Path('android/app/src/main/res/values/ic_launcher_background.xml').write_text('<?xml version="1.0" encoding="utf-8"?>\n<resources><color name="ic_launcher_background">#091822</color></resources>\n')
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
