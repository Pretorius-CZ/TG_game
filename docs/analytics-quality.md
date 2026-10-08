# Přesnost analytiky a vyhodnocení hráčů

Implementace 2026-10-08. Herní limity se nemění.

## Nasazení

1. V Supabase SQL Editoru spustit celý `supabase/028_analytics_quality.sql`.
   Navazuje na 016 a 027. Nemění postup ani nemaže analytická data.
   Opakované spuštění zachová začátek měření návratů.
2. Po nasazení webu obnovit `/balance.html` jako správce.
3. V části **Hráči a naše testování** označit známé testovací prohlížeče.
   Tlačítko „tento prohlížeč“ označí pouze aktuální identitu. Pro jiná zařízení
   použít ID uvedené u posledních pokusů. Žádná zařízení se neoznačují automaticky.

Migrace je připravená a ověřená v izolovaném PostgreSQL/PGlite, nikoli potvrzeně
spuštěná na živém Supabase. Před migrací přehled vysvětlí nedostupnost nové části
a zachová původní agregace za všechny testery. Záznamy hry fungují i se SQL027;
nová metadata tato verze serveru zahodí.

## Testeři a jmenovatele

Označení je v serverové tabulce `analytics_testers`, sdílené mezi správci,
vratné a platné zpětně. Upravovat i číst smí jen `balance_admins`.
Výchozí zobrazení vynechává testery z pokusů, návštěv, zemí, typu zařízení
a průchodu. Přepínač si pamatuje prohlížeč správce. Horní živé počítadlo
zůstává za všechny; návraty vždy vynechávají testery.
Anonymní identifikátor znamená prohlížeč, nikoli osobu. Vymazání storage
vytvoří novou identitu. Importované pokusy bez identity nelze vyřadit podle testera.
Nedoporučovat vyřazování jen podle úspěšnosti nebo počtu her.

Doporučení obtížnosti čeká na 20 dokončených pokusů a alespoň 5 známých
zařízení s dokončeným pokusem. Je to orientační pojistka, ne statistická
garance reprezentativnosti. Opakované pokusy zůstávají v úspěšnosti.

## Průchod prvních 10 levelů

Výchozí skupina zahrnuje zařízení s první přijatou návštěvou po začátku
nového měření, která mají zaznamenaný start levelu 1. Starší zařízení ani
příchody doprostřed hry se nevydávají za nové začátky. Lze přepnout na celou
historii, kde nelze odlišit první průchod od replaye či restartu.

Start, výhra a další level se počítají po zařízeních napříč návštěvami.
Deset retry jednoho zařízení je stále jedno zařízení. Další level je
existence záznamu následujícího levelu, nikoli časově ověřené pořadí událostí.
„Zatím bez dalšího“ není důkaz trvalého odchodu. Procenta uvádějí explicitní
jmenovatel. Data zahrnují všechny verze; spodní filtr období/verze filtruje
pouze tabulku obtížnosti.

## Prohry a zařízení

Těsná prohra: u každého cíle zbývá maximálně 10 % jednotek, alespoň něco
zbývá. Počítají se samostatně barvy, kryty i jednotlivé rezonátory.
Neúplná měření se vynechají ze jmenovatele, nikoli doplní nulou.
Výhra, odchod a technická chyba se mezi prohry nepočítají. `exhausted` se může
po pokračování aktualizovat na výhru.

Typ zařízení je pouze mobile/desktop/unknown odvozený místně z informací
prohlížeče. Mobil zahrnuje tablety, klasifikace není neomylná. Celý user-agent,
IP, jméno ani e-mail se tímto rozšířením neodesílá.

## Návštěvy a návraty

Viditelná hra obnovuje relaci každých 30 sekund. Po nejméně 30 minutách bez
obnovení založí další aktivita novou návštěvu i bez reloadu stránky.
Revize se zvyšuje při každém odesílaném obnovení. Pokus pokračující po pauze
může být přítomen ve dvou relacích; v rámci kampaně se jeho UUID započítá jen
jednou. Kampaň je UTM štítek, ne potvrzení skutečného placeného kliknutí.

`analytics_activity_days` ukládá jednu dvojici zařízení × UTC den.
Server přijme aktivní den pouze z viditelné hry s časem do 5 minut před
serverovým časem nebo nejvýše minutu napřed. Starý offline upload tak sám
nevytvoří dnešní návrat. Odchylka hodin nebo blokované připojení může měření
podhodnotit. Čas klienta není nezávislým důkazem hraní.

Skupina pro návraty vzniká první serverem přijatou návštěvou po nasazení
028; existující zařízení se vynechají. Návrat je zachycená viditelná hra,
ne nutně odehraný level. D1 = aktivita v následujícím UTC dni, vyhodnocená až
po jeho skončení. Týden = jakákoli aktivita v UTC dnech 1–7, vyhodnocená až
po skončení dne 7. Nedozrálé skupiny ukazují čekání, nikoli nulovou úspěšnost.
Historické návraty se nevymýšlejí ani nezpětně nedopočítávají.

## Ověření a omezení

`npm test`, `npm run build`. Modelové testy ověřují skupiny, oddělení testerů,
opakované návštěvy/pokusy, neúplné cíle a obnovu relace.

SQL lze opakovat bez připojení k produkci:

```powershell
npm install --prefix .local/analytics-sql --no-audit --no-fund --ignore-scripts @electric-sql/pglite
node scripts/test-analytics-sql.mjs
```

Test ověřuje migrace, oprávnění, vlastnictví identity, idempotenci, zachování
země a pokusů, stránkování, vratné označení testerů, UTC zralost skupin a
opožděné uploady. Ověřeno s PGlite 0.5.8.
Prohlížečový test se simulovanými RPC ověřil přepínač, zpětné vyřazení z více
tabulek, mobilní šířku 390 px a použitelný přehled před SQL migrací.

Čtení návštěv je stránkované po 1000, bezpečnostní limit 100 000 zastaví
načtení s chybou místo zobrazení neúplného součtu. Při dalším růstu bude vhodné
přesunout podrobné agregace na server. CrazyGames edice vlastní Supabase
analytiku stále nezapíná.
