# Webové reklamy — příprava 2026-10-18

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
