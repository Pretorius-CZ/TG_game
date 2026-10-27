# AdMob — nastavení aplikace

## 2026-10-27: účet a reklamní jednotka

Uživatel doložil schválení účtu AdMob, přidal Android aplikaci Beyond the
Signal jako dosud nezveřejněnou v obchodě a vytvořil rewarded jednotku.

- App ID: `ca-app-pub-4627613906098117~2888641260`
- Rewarded unit ID: `ca-app-pub-4627613906098117/5323232914`
- Název jednotky: Rewarded – game rewards
- Odměna v konzoli: 1 Game reward; konkrétní výhodu uděluje zvolená nabídka hry.

Tyto identifikátory jsou veřejná konfigurace, nikoli přihlašovací údaje.
Společný zdroj: `src/androidAdUnits.json`. Gradle čte App ID ze stejného
souboru jako herní adaptér. Debug nyní používá vlastní App ID pro načtení
zveřejněné UMP zprávy, ale stále jen demo rewarded ID.
Release manifest má vlastní App ID; release sestavení je nadále blokované
stávající pojistkou. Adaptér zatím vybírá pouze testovací rewarded ID.
Samotné uložení produkčních ID nespouští ostré reklamy ani neuvolňuje release.

## Další kroky

1. V AdMob Ochrana soukromí a zprávy → Evropské předpisy připravit zprávu
   přiřazenou k této aplikaci. Zkontrolovat případnou automaticky vytvořenou
   zprávu, než vznikne duplicitní. Politika soukromí: hlavní doména /privacy.html.
2. Zprávu, volby odmítnutí a opětovné otevření ověřit s UMP na testovacím
   zařízení a vlastním App ID; současný demo profil toto ověření nenahrazuje.
3. Připravit app-ads.txt, vývojářský web a propojení s veřejným záznamem
   aplikace v podporovaném obchodě. Schválený účet není schválená aplikace.
4. Připravit podpis a AAB. Produkční ID aktivovat výslovným release nastavením
   až společně s dokončenými souhlasy a QA; běžný debug musí zůstat testovací.

Google Play registrace nyní čeká na podporu kvůli odmítání úplné adresy
existujícího osobního platebního profilu. Nedělat nové účty ani mazat profil
jen kvůli obejití této chyby.

Zdroje:
- https://support.google.com/admob/answer/10113207
- https://support.google.com/admob/answer/10564477
- https://support.google.com/admob/answer/14538460

Ověření přípravy: čtyři Android reward testy prošly. npm run android:apk dokončilo Gradle assembleDebug (BUILD SUCCESSFUL, 185 úloh); APK 49 689 612 B. Sloučený debug manifest potvrzuje oficiální demo App ID. Nový APK nebyl instalován na telefon. Release guard zachovaný.


## Zveřejněná evropská zpráva a testovací APK

Uživatel doložil stav Zveřejněno u zprávy Beyond the Signal – Android EU consent, přiřazené ke hře, angličtina + 5 dalších jazyků. Cílení EHP, UK, Švýcarsko; souhlas, odmítnutí i správa možností.

Nové debug APK používá vlastní App ID, takže žádá o tuto zprávu; rewarded jednotka zůstává výhradně demo. Nastavení Soukromí reklam nyní při první návštěvě otevře úvodní formulář, při existující volbě znovu otevře privacy options. Selhání se propaguje bez předstírání souhlasu. Šest cílených testů a Gradle assembleDebug prošly; vlastní App ID ověřeno v merged manifestu. Fyzické zobrazení nové zprávy dosud neověřeno, APK se na telefonu samo neaktualizovalo. Release guard zachovaný.

## Fyzické ověření uživatelem

Uživatel potvrdil, že se nový formulář na telefonu zobrazil a odsouhlasil jej. Testovací reklamu spustil před touto volbou i po ní. To potvrzuje zobrazení vlastního formuláře a funkčnost demo reklamy po souhlasu; samo to nepotvrzuje stav UMP před prvním spuštěním reklamy. Předchozí uložený stav ani časování nebyly zaznamenány. Čistý test prvního souhlasu, odmítnutí a znovuotevření voleb ještě samostatně ověřit. Nemazat postup ani neodinstalovávat aplikaci kvůli resetu souhlasů.

Uživatel následně zvolil Nesouhlasím: běžná hra zůstala dostupná a demo reklama se opět spustila. Tím je potvrzeno i znovuotevření voleb a dostupnost hry po odmítnutí. Spuštění demo reklamy samo neurčuje typ zpracování skutečné reklamní poptávky; před ostrým nasazením ověřit TCF/serving restriction testovacím zařízením a diagnostikou SDK. Google podporuje limited ads za příslušných podmínek i při odmítnutí personalizace: https://support.google.com/admob/answer/10105530 .

app-ads.txt je nyní zveřejněný a ověřený HTTP200 text/plain na hlavní doméně. Detaily docs/app-ads-setup.md; propojení na obchod a stav ověření v AdMob zatím nepotvrzené, čeká na vyřešení Play registrace.
