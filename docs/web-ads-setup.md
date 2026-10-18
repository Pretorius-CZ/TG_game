# Webové reklamy — příprava 2026-10-18

## Aktuální pokračování: testovací H5 adaptér

Uživatel potvrdil uložení konceptu evropské CMP zprávy a snímkem doložil
odeslání žádosti H5 Games Ads. Ani jedno není potvrzením schváleného
ostrého provozu. Zpráva stále není zveřejněná/propojená.

Implementace src/webAdsPolicy.js, googleH5Ads.js, GoogleRewardAd.jsx:
- Výchozí režim simulation zachovává dosavadní chování veřejné hry.
- Odkaz `https://game.playbeyondthesignal.com/?ads_test=google` dovoluje
  ruční test Google SDK. Načítá se až po vyžádání odměny, povinně
  data-adbreak-test=on. Nejde o produkční monetizaci ani důkaz eligibility.
- VITE_WEB_ADS_MODE=disabled: dostupná zpráva bez SDK/bonusu. test:
  explicitní Google test. live: úmyslně zablokovaný do dalších kroků.
- Aktuální UTM automated_test/bot, uložená botí návštěva i přenesený BOT
  marker vynutí původní simulaci. itch/Telegram zachované, CrazyGames
  zachovává vlastní dosavadní bezplatnou cestu. Žádný query parametr
  nezapne placené reklamy. Změna buildového režimu vyžaduje nasazení.
- adViewed vytvoří oprávnění k odměně; afterAd/adBreakDone ukončí placement.
  Status viewed bez adViewed nestačí. Duplicity/pozdní callbacky se ignorují.
- Načtení SDK timeout15s, dostupnost placementu15s, zobrazení/čekání180s
  viditelné karty; skrytá karta tento watchdog nevyčerpává.
- Nativní dialogy se při beforeAd dočasně zavřou a při návratu obnoví,
  aktivní navrch; React/deska zůstávají připojené. Zvuk se pozastaví.
- No-fill, blokátor, zrušení a timeout nepřidají bonus. Chyba uložení
  nabídne retry samotného připsání, bez druhé reklamy. Limity odměn zůstávají.

Ověřeno: šest unit testů protokolu a režimů,14 browser scénářů Chromium/
WebKit s řízeným SDK (včetně +5 na stejném DOM/desce a zachované energie).
Nejde jen o mock: oficiální Google SDK v lokálním náhledu v obou enginech
zobrazilo Rewarded ad example, dokončilo odpočet a po zavření připsalo
právě1Laser/obnovilo desku, bez JS chyby. Jeden lokální page.goto timeout
při startu opakován úspěšně. H5 účet/ostrá reklama/CMP tím nejsou ověřené.
Fyzické telefony a změna reklamního souhlasu následují samostatně.

Další krok: propojit CMP a právo změnit volbu; ověřit nastavení Auto ads
v účtu (na hře je nepoužívat). Dokončit pravidla vlastní analytiky/retence
a teprve po schválení otevřít ostrý adaptér. Žádné bannery nenahrazují
odměňovanou reklamu, když video není dostupné.

## Ověřený stav

- Uživatelovy snímky: AdSense playbeyondthesignal.com stav Příprava,
  vlastnictví ověřeno, požádáno o kontrolu. Přístup H5 Games Ads nepotvrzený.
- Existující účet v sestavení: ca-pub-4627613906098117. ads.txt obsahuje
  google.com, pub-4627613906098117, DIRECT, f08c47fec0942fa0.
  Tento řádek autorizuje prodejce, nespouští reklamy ani nezaručuje schválení.
- Provozovatel/kontakt výslovně potvrzený uživatelem:
  Michal Malich, flambiz.cz@gmail.com.
- contact.html a privacy.html jsou skutečné EN/CZ stránky, samostatné od hry.
  Odkazy na webu i v nastavení hry. Žádné nové reklamní SDK ani CMP se nenačítá.
- Dosavadní RewardAd zůstává výslovně simulací. Na itch/CrazyGames/Telegram
  se odkazy na nedostupné lokální informační stránky nepřidávají.

## Další kroky v AdSense účtu

1. Weby → playbeyondthesignal.com: porovnat publisher ID s řádkem výše.
   Po dostupnosti /ads.txt znovu zkontrolovat stav ads.txt; stav se nemusí
   aktualizovat ihned. Web nemazat a nepřidávat znovu.
2. Ochrana soukromí a zprávy (Privacy & messaging) → Evropské předpisy
   (European regulations) → Vytvořit zprávu. Vybrat web; zahrnout herní
   subdoménu podle nabídky účtu. Jazyky EN a čeština. Povolit první volbu
   Nesouhlasím a možnost Spravovat; zkontrolovat obě jazykové verze.
   URL zásad https://playbeyondthesignal.com/privacy.html.
   V této fázi uložit návrh; zveřejnit a ověřit až společně s CMP integrací.
3. Samotná meta značka AdSense není JavaScript CMP. Před skutečnou reklamou
   dodat skutečný kód dle účtu, ověřit souhlas/odmítnutí/změnu volby na game,
   nevymýšlet vlastní tlačítko, které by pouze předstíralo platný TCF souhlas.
   Google dle své dokumentace pro zprávu vyžaduje reklamní kód na webu;
   ten zde záměrně zatím nepřidáváme bez řízení reklamního režimu.
4. Žádost H5 Games Ads: https://adsense.google.com/start/h5-game-ads-apply/
   Schválený AdSense je nutný k zobrazování herních reklam. Nepotvrzený
   přístup neobcházet standardním bannerem uvnitř odměnového okna.

## Podklady pro žádost H5

- Game website: https://game.playbeyondthesignal.com/
- Information website: https://playbeyondthesignal.com/welcome.html
  (při přepnutí hlavní domény použít kořenovou adresu).
- Publisher ID: pub-4627613906098117 — potvrdit v účtu.
- Name: Michal Malich. Contact: flambiz.cz@gmail.com.
- Description: Beyond the Signal is an original browser-based sci-fi
  match-3 adventure with 187 released levels, visual restoration and a
  continuing story. It supports English and Czech, mobile portrait play
  and desktop browsers. Optional rewarded placements are planned for
  five extra moves, energy, one selected tool and an additional hint.
- Návštěvnost vyplnit skutečnou hráčskou, bez automatických QA botů.
  Nezadávat smyšlené MAU, impresní odhady ani tvrzení o schváleném účtu.

## Následující implementace po nastavení účtu

Režimy disabled / test / live. Zachovat schválené odměny/limity, žádné nucené
reklamy. Bonus jen při adViewed, ne při adBreakDone; zrušení/no-fill/timeout
bez bonusu a bez změny desky. Zamknout duplicitní požadavky, pozastavit zvuk
a hru jen po dobu reklamy, obnovit při návratu z pozadí. QA trvale bez
ostrých reklam. Otestovat Google test mode, consent odmítnutí i změnu volby,
blokátor/offline a iPhone/Android. Zajistit přístup k nastavení souhlasu.

Před ostrým spuštěním dokončit pravidla uchování a mazání serverových
statistik a právní základ analytického ukládání, rozsah přenosů u skutečně
nastavených poskytovatelů a smluv. Dnes není automatické mazání statistik
ani analytický souhlas implementovaný; text privacy to nezastírá a není
prohlášením kompletní právní shody. Reklamní CMP sama neřeší dosavadní
vlastní analytiku. Nevytvářet tvrzení o již aktivních souhlasech či mazání.

Zdroje ověřené 2026-10-18:
- https://support.google.com/adsense/answer/12171612
- https://support.google.com/adsense/answer/10960768
- https://developers.google.com/ad-placement/docs/signup
- https://developers.google.com/ad-placement/docs/test
- https://developers.google.com/ad-placement/apis/adbreak
- https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng

## Vysvětlení nedostupné reklamy
Na podnět uživatele po blokování Brave Shields UI rozlišuje selhání načtení SDK (možné štíty/blokátor/ochrana/připojení, povolení reklam výslovně dobrovolné), offline signál prohlížeče, noAdPreloaded, frequencyCapped a timeout. SDK chybu nevydává za prokázaný blokátor. Neznámý důvod je výslovně neurčený. EN/CZ vždy uvádí nepřidělenou odměnu a zachovanou hru, žádná výzva k nebezpečnému reloadu rozehraného pokusu. Pravidla bonusů a výchozí simulace se nemění.

Ověření této úpravy: build/diff-check a6cílených prohlížečových kontrol Chromium/WebKit (EN blocked/no-fill, české vysvětlení320×568 bez scrollu a funkční návrat). Google dialog má kompaktní mezery a14px text, aby vysvětlení neodsunulo hlavní akci.
