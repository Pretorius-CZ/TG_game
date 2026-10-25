# Názvy a hvězdy dokončených úrovní

Uživatel nahlásil v Android APK pouze fajfky bez názvů v Zahradním majáku.
Příčina v `signalNetwork.css`: hotovým značkám explicitně schované popisky
včetně hvězd; po dokončení poslední stanice se skrývaly celé značky.
Obnovení popisků navíc na malém telefonu ukázalo překryvy s dalšími názvy
a závěrečným panelem. Audit objevil překrývající se názvy i v dalších kapitolách.

## Oprava

- Všech36dokončených expedičních oblastí používá společný čitelný přehled
  opakování (`CompletedRepairs.jsx`, `completedRepairs.css`). Každé tlačítko
  má celý lokalizovaný název, skutečné uložené hvězdy a značku dokončení.
- Přehled má dva sloupce a měří místo mezi nadpisem a spodní navigací.
  Delší obsah na krátkém displeji může posouvat vnitřní přehled, nikoli
  překrýt ovládání. Uživatelé nemusí hádat význam nepojmenované fajfky.
- Klepnutí na daný název otevírá bublinu správné opravy a Replay lesson.
  Rozehrané oblasti nadále používají značky u zařízení na obrázku.
- Poslední kapitola již neschovává hotové názvy, hvězdy ani dostupnost
  opakování po levelu200. Závěrečné akce jsou vedle sebe místo vysokého
  panelu přes dolní úrovně. Názvy hotových značek se zobrazují i během
  postupného opravování oblasti.
- ID, cíle, limity, pravidla, uložené hvězdy, cloud a účty se nemění.

## Ověřování

Nový `tests/browser/completed-labels.spec.js` prochází všech36oblastí /170
jejich úrovní: přeložené názvy, hvězdy, šířku v displeji, překryvy a
skutečnou dostupnost ve vrstvě rozhraní (`elementFromPoint`). Měřené
obdélníky u posouvaného přehledu se převádějí zpět na souřadnice obsahu.
V poslední kapitole navíc otevírá všech13dokončených úrovní a ověřuje
správný název i nabídku opakování. Vstupní postup je syntetický a analytické
zápisy se blokují, nepoužívá se reálný účet.

Varianty: čeština320×568 /430×932, angličtina320×568 /1024×900.
Výstup auditu pro každou variantu obsahuje seznam překryvů a zakrytých názvů;
po opravě musí být oba prázdné. Snímky Zahradního majáku a finální stanice
se ukládají do lokálních výsledků a byly vizuálně zkontrolovány.

275unit testů a Android APK build prošly. Matice rozhraní a přenos společné
opravy na web jsou při vytvoření tohoto zápisu dokončovány. Nejde o změnu
Google přihlášení; jeho fyzickou funkčnost už uživatel před touto chybou
potvrdil, viz `android-google-cloud.md`.

## Dokončené kontroly Android zdroje

Matice4/4 prošla:144návštěv dokončených oblastí,680kontrol názvů/hvězd,
bez překryvů nebo zakrytých názvů.52otevření replay v poslední kapitole
ukázalo správný název a nabídku opakování. Samostatně prošla stejná kontrola
všech36oblastí nad produkčním Android sestavením (CS430×932).
Regrese3/3: průchod všemi13úkoly, příběhy a konec200 vEN/CS, reload a
legální tah na všech13deskách.275unit pass. APK49587796B sestaveno20:02.
Webový přenos a živá kontrola následují. Fyzický vzhled nové verze APK
musí uživatel ověřit po aktualizaci Run; původní Google přihlášení je potvrzené.

## Produkční vydání ověřeno

Webový zdroj d455d9f5b779, živé verze main1792778860956/game1792778865806.
OběCI nasazení40000704449/40000704734 skončila success. Také přímo na
produkční hře prošel celý audit36oblastí/170názvů vCS430×932 včetně13
replay tlačítek posledníkapitoly, bezpřekryvů nebo zakrytých názvů.
Web264unit/build pass. Společné opravené soubory jsou shodné s Android
zdrojem9851e86; nativníGoogleimplementace se do webu nepřenášela.
Telefon aktualizovat přesAndroidStudioRun nad stejnou instalací, bez
odinstalování. FinálníAPK49587796B20:02 zůstává připravené v build/outputs.

## 2026-10-25 — Nahrazeno původními značkami na pozadí

Na výslovný pokyn uživatele je dvousloupcový přehled odstraněn. Hotové
úkoly se opět zobrazují u zařízení na původních souřadnicích, stejně jako
v rozehrané oblasti. Čitelnost se řeší posunutím samotných popisků a
spodními akcemi pod obrazem. Aktuální stav a ověření:
`docs/completed-hotspots-2026-10-25.md`. Výše uvedená mřížka je historie.
