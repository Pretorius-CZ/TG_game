# Lokalizace hry a webu

V nastavení hry je společný výběr EN / CS. Při první návštěvě se použije
podporovaný jazyk prohlížeče, jinak angličtina. Volba se ukládá do localStorage pod `to-the-stars-language`,
nezávisle na účtu a herním postupu. Změna se projeví i v dalších otevřených
kartách. Do Supabase se jazyk neposílá; není potřeba migrace databáze.

Přeloženo je rozhraní, opravy, cíle, příběhové bubliny, deník, odlet,
expedice, Haven a aktuální přílet do Aster Veil. Texty v obrazových podkladech
se nemění. Vlastní názvy soustav a stanice zůstávají zachované.

`src/i18n/Language.jsx` poskytuje React kontext; změna jazyka nepřemontuje
minihru. Deska, tahy, použitá nápověda i opravy zůstávají zachované.
`src/i18n/catalogs/en.json` a `cs.json` obsahují zprávy se stálými ID.
Webové texty jsou zvlášť v `src/i18n/catalogs/web/`.
Nově migrované ovládání a parametrické zprávy patří do
`src/i18n/catalogs/runtime/`. Německá první kapitola má pracovní překlad;
vývojový náhled se otevře přes `?previewLanguage=de` pouze v lokálním dev
serveru. Tento parametr se v produkčním webu ani APK neuplatní.
`src/i18n/translate.js` překládá také proměnné počty a souřadnice, takže
změna limitu tahů nevyžaduje přepis překladu. Anglická data zůstávají
zdrojem pravdy pro konfiguraci hry; identifikátory úkolů se nepřekládají.

Nový obsah vykreslovat přes `msg('namespace.key', parameters)` z `useLanguage()`
a doplnit katalogy. Starší `t()` je zachovaný kompatibilní most.
Neznámý původní text zůstane anglicky a objeví se v exportovaném
`missingTranslations` pro vývojovou kontrolu. Test `tests/i18n.test.js`
kontroluje pokrytí oprav a deníku napříč kapitolami i dynamické cíle.

Schválené rozšíření DE/FR/ES/PT-BR a přesný seznam zbývajících prací:
[postup lokalizace](localization-rollout.md). Nové jazyky zatím nejsou
veřejně dostupné; kontrola úplnosti je součástí `npm run build`.

Mobilní scény mají omezenou šířku na dostupný displej. Na úzkých telefonech
jsou horní ikony a ukazatel energie kompaktnější, aby se nepřekrýval deník.
