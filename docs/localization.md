# Jazyky EN / CZ

V nastavení hry je přepínač EN · English / CZ · Čeština. Výchozí jazyk je
angličtina. Volba se ukládá do localStorage pod `to-the-stars-language`,
nezávisle na účtu a herním postupu. Změna se projeví i v dalších otevřených
kartách. Do Supabase se jazyk neposílá; není potřeba migrace databáze.

Přeloženo je rozhraní, opravy, cíle, příběhové bubliny, deník, odlet,
expedice, Haven a aktuální přílet do Aster Veil. Texty v obrazových podkladech
se nemění. Vlastní názvy soustav a stanice zůstávají zachované.

`src/i18n/Language.jsx` poskytuje React kontext; změna jazyka nepřemontuje
minihru. Deska, tahy, použitá nápověda i opravy zůstávají zachované.
`src/i18n/cs.json` obsahuje překlady podle anglického zdrojového textu.
`src/i18n/translate.js` překládá také proměnné počty a souřadnice, takže
změna limitu tahů nevyžaduje přepis překladu. Anglická data zůstávají
zdrojem pravdy pro konfiguraci hry; identifikátory úkolů se nepřekládají.

Při přidání obsahu vykreslit text přes `t()` z `useLanguage()` a doplnit
český katalog. Neznámý text zůstane anglicky a objeví se v exportovaném
`missingTranslations` pro vývojovou kontrolu. Test `tests/i18n.test.js`
kontroluje pokrytí oprav a deníku napříč kapitolami i dynamické cíle.

Mobilní scény mají omezenou šířku na dostupný displej. Na úzkých telefonech
jsou horní ikony a ukazatel energie kompaktnější, aby se nepřekrýval deník.
