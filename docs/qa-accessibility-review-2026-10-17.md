# Přístupnost a vzhled — a11y-1.zip, 2026-10-17

Stav: report vyhodnocen, seznam oprav a potřebného ověření.
V tomto kroku nebyl měněn herní kód ani proveden push.

Následná implementace a regresní ověření:
[společné opravy](qa-complete-fixes-2026-10-17.md).

## Co report skutečně pokrývá

Souhrn ze17.10.2026 ve13:37 (Europe/Prague).
Dva strukturované výsledky: Desktop1920×1080/EN a iPhoneSE/EN.
Oba uvádějí devět skenovaných stavů: úvod, loď, deska, pravidla/pomůcky,
potvrzení odchodu, výhra, kapitoly, deník a nastavení.

14screenshotů:7prodesktop a7proSE, dohromady EN/CZ.
Pro češtinu chybí vlastní JSON výsledek. CS snímky končí na prvním
levelu s potvrzením odchodu; nejsou dokladem dokončeného českého auditu.
Pole keyboard je v obou EN reportech prázdné; chybí seznam kláves,
fokusových cest, dosažitelnosti ovládání a očekávaných výsledků.
Samotné prázdné pole nepotvrzuje kompletní obsluhu klávesnicí.

## Nálezy

| Pravidlo | Výskyty | Posouzení |
|---|---:|---|
|label-content-name-mismatch|38|Vážný nález pro názvy ovládání, opakované stejné prvky v několika stavech.|
|aria-prohibited-attr|4|Potvrzený problém s významem hvězd, opakovaný pro oba profily.|
|color-contrast|1|Close v nastaveníSE; potřebuje reprodukci a změření konkrétního barevného stavu.|
|page-has-heading-one|1|Struktura nadpisů při nastavenídesktopu; nižší priorita, prověřit stránku a skenovaný kontext.|

Nejde o44různých chyb layoutu.38výskytů názvů vzniká v každém profilu
6prvků×3stavy+1prvek na výhře. Report ukládá jen jeden příklad za
pravidlo/stav, takže úplný seznam šesti prvků zpětně neznáme.

### 1. Názvy nápovědy a pomůcek — priorita P1

Report přímo uvádí `.hint-control`: viditelné Hint a1/1, přístupný
název `Show a hint, 1 remaining`. Význam je podobný, ale nesouhlasí
celý viditelný popisek včetně počítadla. Zdroj v MiniGame.jsx odpovídá.

Opravit společné pojmenování ovládání: zahrnout viditelný název i stav,
případné delší vysvětlení dát do popisu. Zvlášť prověřit pět `.helper-tile`:
mají viditelný název+badge1/AD a aria-label typu `Laser · 1`, případně
0i při zobrazenémAD. Mohou vysvětlovat dalších pět nálezů, to ale report
kvůli zkráceným příkladům přímo nepotvrzuje.

Přijetí: celý seznam uzlů z auditu, EN/CZ, pomůcka skladem/prázdná,
reklama k dispozici/využitá, nápověda1/1/AD/0. Zachovat užitečnou
informaci pro čtečku; neřešit jen odstraněním názvů nebo vypnutím pravidla.

### 2. Hvězdy — priorita P1

Stars.jsx vrací span.rating-stars s aria-label, uvnitř jsou pouze
SVG se skrytím pro čtečku. Bez odpovídající role samotný span nenese
deklarovaný význam obrázku či výsledku. Oprava má dát celému hodnocení
smysluplnou roli a název (např. jednu pojmenovanou grafiku), dekorativní
SVG ponechat skrytá. Prověřit i hvězdy v hotspotech, kapitolách a deníku,
aby se neopakovalo zbytečné čtení nebo nezmizelo hodnocení tlačítka.

### 3. Kontrast Close — priorita P2

Jediný nález se týká button:nth-child(10) v nastaveníSE.
Příslušný screenshot ani poměr kontrastu, konkrétní barvy a stav prvku
ZIP neobsahuje. Account.jsx má poslední tlačítko Close bez vlastní třídy;
v style.css mu pravidlo account-panel button nastavuje jen margin,
další vzhled závisí na obecných/UA stylech a stavu.

Reprodukovat EN/CZ, změřit vypočtené barvy a při potvrzení dát Close
explicitní čitelné barvy a fokusový stav. Neměnit plošně celou paletu
na základě jediného stručného záznamu.

### 4. Nadpis nastavení — priorita P2

Jeden desktopový záznam hlásí absenci h1. Nastavení je sekce s h2;
zkontrolovat, zda na právě aktivní scéně existuje dostupný h1 a zda
auditor zkoumá celou stránku, či pouze aktivní panel.
Samotná existence h2 v panelu není důvod přepsat jej automaticky na h1.
Opravit hierarchii stránky podle skutečného kontextu.

## Vzhled a meze vizuálního hodnocení

Všech14snímků prošlo přehledovou vizuální kontrolou. Bez viditelného
zásadního rozbití rozvržení: deska i akce výhry se vejdou, delší nadpis
SE se zalomí, potvrzení odchodu záměrně překrývá desku a text je čitelný.
Přehled je v .local/a11y-review/overview.jpg, originály vedle.
Nastavení, kapitoly a deník jsou v reportu označené jako skenované,
ale jejich screenshoty v tomto ZIPu nejsou. Nelze zde vizuálně potvrdit
kontrast Close ani všechny stavy fokusů.

Další ověření: cílený audit všech dotčených uzlů, plný EN/CZ průchod
klávesnicí a následně čtečka obrazovky. Přístupnost celé match-3 nelze
prohlásit za hotovou jen podle absence dalších automatických nálezů.
