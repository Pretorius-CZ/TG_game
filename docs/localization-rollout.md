# Rozšíření jazyků — stav a postup 2026-10-22

Schválený první rozsah: EN, CS, DE, FR, ES a brazilská portugalština PT-BR
pro hru i informační web. Další výhled: PL, IT, JA, KO; později ZH-Hans,
TR, ID, RU, UK a AR podle publika. Jde o pořadí práce, nikoli o již vydané jazyky.

## Hotová technická první etapa

- Společný registr `src/i18n/locales.js`, veřejný stav `released` versus
  rozpracovaný `draft`. Veřejně zůstávají EN/CS. Čtyři nové katalogy obsahují
  první návrhy základních ovládacích textů, nikoli hotový překlad hry.
- Katalogy v `src/i18n/catalogs/` používají stálé identifikátory. Web a
  novinky mají vlastní soubory `catalogs/web/`; samostatný web nestahuje
  texty celé hry. Novinky mají stálé ID, pořadí vydání nemění klíče překladů.
- Kontext nabízí `msg('common.movesLeft', {count})`. Formátování podporuje
  pojmenované proměnné a množná čísla přes `Intl.PluralRules`. Výsledek je
  obyčejný text, vykreslovat přes React/textContent, nikdy jako HTML.
- Původní `t('English source')` zůstává kompatibilní pro dosavadní EN/CS
  a dynamické cíle. Klíče `legacy.0001` atd. jsou zachované migrační ID;
  nepřečíslovat ani znovu negenerovat podle pořadí vět. Nové texty dostávají
  významové ID jako `help.resonators.body`, ne anglickou větu jako klíč.
- První návštěva respektuje jazyky prohlížeče, uložená volba má přednost.
  Nepodporovaný jazyk skončí v angličtině; rozpracované edice se samy
  nezapnou. Playtest zachovává výslovný vlastní výchozí jazyk i klíč.
- Odkaz PLAY přenáší zvolený jazyk přes `lang`, protože hlavní doména a
  game mají oddělené úložiště. Výslovná platná volba v odkazu má přednost;
  ruční přepnutí aktualizuje také tento parametr, aby refresh nevracel
  starý jazyk. Přihlašovací kódy ani jiné libovolné parametry se nepřenášejí.
- Nastavení a úvod hry používají výběr z registru, s názvy jazyků v jejich
  vlastní podobě. První souhlas se statistikami má přepínač z téhož seznamu.
- `npm run i18n:check` kontroluje ID, povinné překlady, proměnné, množná
  čísla, zprávy webu i novinky. Spouští se před běžným produkčním buildem.
  `npm run i18n:report` aktualizuje pracovní přehled `localization-audit.json`.

První převod zaregistroval 2 131 položek; aktuální počty uvádí audit JSON.
To není počet všech textů
v produktu: část dynamických textů a vložené dvojjazyčné struktury stále
potřebují převést. První audit našel 117 větvení/výběrů EN/CS s cestou a řádkem;
jde o pracovní seznam, nikoli úplný důkaz pokrytí každého viditelného textu.

## Zbývající práce před vydáním DE/FR/ES/PT-BR

1. Převést přímé podmínky EN/CS v komponentách do kontextových ID; neztratit
   odlišné významy stejného anglického slova. První na řadě: úvod, nastavení,
   analytické a reklamní volby, chyby, převod uložené hry a orientace telefonu.
2. Převést příběhová pole `en/cs`, dvojice polí v průvodci/rekapitulaci,
   výukové popisky a přístupné názvy včetně hlášení počtu hvězd. Nestačí
   doplnit překlad anglické věty, pokud komponenta vybírá pevné pole `cs`.
3. Nahradit české regulární výrazy pro dynamické cíle parametrickými
   zprávami odvozenými ze skutečných goals. Slova pro barvy, kryty, tahy
   a rezonátory musejí mít vhodné gramatické tvary v každém jazyce.
4. Doplnit DE/FR/ES/PT-BR v katalozích: všechny kapitoly 1–200, deník,
   přechody, nápovědy, UI, chybové a přístupné popisky. Vytvořit i webové
   katalogy čtyř jazyků, návody, nové i historické novinky a metadata.
5. Přeložit kontakt a informace o soukromí v HTML, přenos uložené hry a
   ostatní veřejné vstupy. Administrační `/balance` může zůstat české;
   slepý playtest je samostatný testovací nástroj, jeho rozsah uvést výslovně.
6. Jazykově zkontrolovat návrhy a slovník. Nepublikovat automatický první
   překlad jako jazykově ověřený text. Zkontrolovat názvy v rastrových obrázcích.
7. UI kontrola každého jazyka: 320×568, běžný telefon, tablet a desktop;
   dlouhá němčina, akcenty, řádky tlačítek, dialogy, nápovědy a změna jazyka
   během pokusu. Později JA/KO/ZH ověřit písma a zalamování, AR také RTL.
8. Teprve potom nahradit dočasnou pojistku EN/CS v kontrolním skriptu
   skutečnými kontrolami pokrytí nové edice a změnit její stav na `released`.
   Pouhá úprava registru dnes správně neprojde buildem.

## Překladatelská pravidla

- Styl: krátké, srozumitelné pokyny, žádný technický slovník bez vysvětlení.
  Pilot mluví stručně a lidsky; základ příběhu a jeho fakta se nemění.
- Pulse, Nova, EMP, Beyond the Signal, Haven, Kepler Reach a Aster Veil
  zatím zachovat jako vlastní názvy. Terminologii pomůcek domluvit před
  hromadným překladem. Rozlišovat nálož na desce a spotřební pomůcku.
- Proměnné `{count}`, `{total}` apod. nepřekládat ani neodstraňovat. Každá
  větev množného čísla musí zachovat všechny proměnné dané zprávy.
- Neměnit herní ID, pořadí levelů, cíle, počty tahů ani uložený postup.
  Jazykové katalogy jsou obsah prezentace; nepatří do konfigurace obtížnosti.
- Španělština pro první vydání neutrální, připravená na pozdější regiony.
  Portugalština výslovně `pt-BR`; `pt-PT` není totéž. Bez vlajek jako jazyků.

První etapa je lokální, bez pushe, nasazení či změny hlavní domény.
