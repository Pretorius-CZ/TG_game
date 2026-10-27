# Vyhodnocení nemcina-4.zip — 26. 10. 2026

Zdroj: uživatelský report z 15:55, Desktop 1920×1080.

- Statický audit: 1117 zdrojových textů, 2472/2472 položek katalogu,
  bez chybějících překladů a bez dalších katalogových problémů.
- Web DE: 8/8 stránek prošlo.
- Průchod: 29 odehraných a vyhraných levelů první kapitoly. Ve hře
  0 nálezů angličtiny, 0 přetékání, 0 JS chyb podle reportu.
- Kontrola 2473 textů označila sedm německých odstavců. Nejde o celé
  anglické odstavce, nýbrž anglické názvy ovládání uvnitř německého textu.

Opraveno pouze DE:

- `web.guideStars`, `web.about.changes.extra`, `web.basics.stars.body`:
  Chapters → Kapitelübersicht.
- `web.legal.privacy.11`, `.17`, `.27`, `.35`: Settings → Einstellungen;
  citované volby nahrazeny skutečnými DE popisky „Statistiken erlauben“
  a „Statistiken ausschalten und löschen“.
- Regenerované DE index/about/how-to-play/privacy HTML.

Pravidla souhlasů a obsah zásad se nemění; jde o překlad názvů ovládání.
Herní pravidla, levely, pozice, styly a navigace se nemění.

Omezení reportu: levely 30–200 ani mobilní zobrazení nejsou tímto během
otestované. Snímky 59/60 ukazují výhru závěrečné kontroly a dokončenou
první kapitolu. Hláška „bot nenašel další level“ sama nedokazuje chybu hry.
Samostatný německý UI test úspěšně prošel odletem, příběhem, mapou,
vstupem do Tichého dolu až ke spuštěné desce prvního levelu kapitoly 2.
Robot potřebuje zvládnout tyto přechody, aby mohl ověřit zbývající obsah.

Ověření oprav: lokalizační audit, generátor webu a německý přechod mezi
kapitolami. Při dalším běhu ověřit také mobil a zbývajících 171 levelů.

## Následný report nemcina-5.zip — 18:04

Předchozí omezení na 29 levelů překonáno. Robot hlásí 200 odehraných
a 200 vyhraných levelů, poslední „Die Antwort überbringen · 200“.
Snímek `407-kapitoly.png` potvrzuje dokončení všech deseti kapitol
(29/29, 24/24, 16/16, 24/24, 12/12, 15/15, 20/20, 27/27, 20/20, 13/13).

- Katalog 2472/2472, bez chybějících položek a katalogových problémů.
- Kontrola 2473 německých textů: 0 označených jako cizojazyčné;
  všech sedm dřívějších nálezů odstraněno.
- Osm německých webových stránek prošlo.
- Průchod Desktop 1920×1080: 0 zbylé angličtiny, 0 přetékání,
  0 zaznamenaných JS chyb.

Z tohoto reportu neplyne další oprava. „Bot nenašel další level“ po
levelu 200 samo neznamená závadu; současný katalog má právě 200 levelů.
Test nepotvrzuje přirozenost všech formulací rodilému mluvčímu, mobilní
rozložení, nativní Android integrace ani vhodnou obtížnost pro člověka.
Zbývající cílená kontrola: DE na telefonu a případná jazyková redakce.
