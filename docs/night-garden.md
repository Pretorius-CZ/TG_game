# Noční zahrada: přistávací mýtina (levely 121–125)

První implementovaná dávka podle docs/progression-121-250.md. Není to celá dvacetilevelová kapitola: porost 126–130, kořenová komora 131–135 a srdce zahrady 136–140 zatím zůstávají plánem. Současný katalog nyní obsahuje 125 unikátních miniher.

## Návaznost a úkoly

Přístup po relayCompleted=4. Dokončení posledního úkolu stanice a její závěrečné tlačítko vedou do night-glade; vstup na mapě Elysia nabídne tuto lokaci po stanici. Návrat vede k retranslační stanici. Pět kroků je pevných, replay nepostupuje dál.

| Level | Úkol | Deska / tahy | Sada a cíle |
| --- | --- | --- | --- |
| 121 | Přistávací značky | 7×8 / 24 | Známá výzkumná sada; 24 modulů + 21 navigačních hranolů. |
| 122 | Průzkumná sonda | 7×8 / 25 | Nový světelný pyl místo vzorku; 27 pylu + 21 modulů. |
| 123 | Kořenová síť | 7×8 / 27 | Nové kořenové uzly místo slitin; 27 uzlů + 24 semen, 4 kryty. |
| 124 | Přechod přes potok | 8×8 / 29 | 27 chladicích náplní + 24 uzlů, 4 kryty a 1 rezonátor (3 impulzy). |
| 125 | Sladění mýtiny | 8×8 / 32 | 30 pylu + 27 semen, 6 krytů a 2 rezonátory (po 3 impulzech). |

Limity jsou výchozí obsahové konfigurace, ne ověřená lidská obtížnost. Cíle/ikony/popisy používají stejnou sadu. Kryty a nálože zachovávají dosavadní pravidla. Každý krok má EN/CZ úvodní bublinu, výsledek a zápis v deníku. Postupné měkké masky odkrývají světla v jedné souvislé scéně; po 5/5 se zobrazí celý oživený obraz.

## Interval obměny dlaždic

Současná výzkumná sada je stále relativně nová, proto ji první level ponechává. Druhý zavede jeden nový typ a třetí druhý. Pro zbytek Noční zahrady 126–140 ponechat těchto šest typů; pestrost tvořit lokacemi, cíli a deskami. Další obměnu plánovat až v Útočišti 141–160: nejprve předmět potřebný k zásobování, potom zdravotní materiál. Neměnit všechny dlaždice po pěti levelech. Identita barvy a siluety musí být čitelná na telefonu.

## Ukládání a nasazení

nightGladeCompleted 0–5 v lokálním postupu, slučování, resetu, deníku a analytickém katalogu. Přístup vyžaduje dokončenou stanici; staré uložené hry nejsou mazány. Cloud vyžaduje supabase/018_night_garden.sql (kumulativní migrace herního postupu po 015, nezasahuje do analytiky 016/017). Zatím na živém projektu nepotvrzeno. Bez migrace není cloudová synchronizace nových kroků označena za úspěšnou.

## Grafika a prompty

Vytvořeno vestavěným imagegen; výstupy zkopírovány a optimalizovány do projektu, originály zůstaly v generated_images. Scény jsou portrétové WebP, dlaždice PNG 256×256 se skutečnou alfa průhledností.

- public/scenes/night-glade.webp: noční mimozemská zahrada, stará kruhová přistávací terasa, poškozená sonda vlevo, spící maják vpravo, kamenný přechod přes potok a obří průsvitné listy; modrá/tyrkysová/fialová atmosféra, bez UI a textu, 9:16, klidná horní část pro titulek.
- public/scenes/night-glade-restored.webp: edit předchozího obrazu se zachováním kamery, rámování a objektů; zlaté světlo kruhových značek, opravená sonda s tyrkysovými čočkami, zlaté kořenové spoje majáku, tyrkysové značení přechodu a oživené žilkování listů. Bez rozdělených panelů.
- public/tiles/night-pollen.png: samostatný jantarově zlatý třílaločný průsvitný pylový lusk, viditelné svítící částice, výrazná silueta, painterly 3D, transparentní pozadí, bez podstavce/textu/rámečku, čitelný při 40 px.
- public/tiles/night-root.png: samostatný měděně oranžový uzel tří propletených kořenů kolem korálově červeného jádra, trojúhelníková větvená silueta, painterly 3D, transparentní pozadí, bez podstavce/textu/rámečku, odlišný od žlutého pylu a zelených semen.

## Ověření

Unit testy: návaznost, nepřeskočitelné úkoly, zachování replay/deníku, slučování a reset, 30 stabilních hratelných desek na každý úkol, kryty mimo zařízení, postupné sady a EN/CZ překlady. Produkční build prošel. Izolovaný mobilní prohlížeč ověřil přechod ze stanice, všech pět oprav přes vývojové dokončení, obnovu po reloadu, replay a skutečně načtené nové obrázky dlaždic. Lidská obtížnost a živá migrace zbývají k ověření.
