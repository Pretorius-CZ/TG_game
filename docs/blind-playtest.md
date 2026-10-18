# Slepý lidský playtest všech levelů

2026-10-18. Zadání: osobně postupně projít všech200levelů v jednou vylosovaném pořadí a hodnotit obtížnost, bez zásahu do běžné hry.

Odkaz: https://game.playbeyondthesignal.com/playtest.html?run=blind-200-v1

Samostatný Vite vstup. Žádný AccountProvider, App, cloudové save RPC, kampaň, presence, country ani reklamy. Supabase klient na této cestě nečte ani neobnovuje uložené přihlášení. AccountContext je host. Stars mají výchozí noop. Jazyk, tutoriály, zásoba pomůcek, pořadí, výsledky a odesílací fronta mají vlastní namespace; běžné klíče se nepřepisují. Energie practice je bez omezení a nic neukládá.

Při zahájení explicitní povolení sběru testovacích dat. Běžná volba analytiky se nemění. Jedna pomůcka každého typu a jedna nápověda na pokus, žádné reklamní doplnění ani bonusové tahy. Výsledky proto porovnávat s lidskými pokusy se stejnou pomocí, ne automaticky se simulací bez pomůcek.

Fisher–Yates přes crypto random, všech200unikátníchID. Pořadí a plné konfigurace oprav včetně limitů se připnou k průchodu; nová změna katalogu je nepřepíše. Herní algoritmus může budoucí nasazení změnit: zaznamenává se aktuální verze pravidel i initialRules průchodu, nikoli nepravdivý slib zmrazeného algoritmu. Viditelný název TestN/200, bez názvu kapitoly a HARD. Cíle/deska/mechaniky zůstávají skutečné. Nejde o záruku, že známou desku hráč nepozná.

Po výhře, vyčerpání tahů, odchodu či chybě hodnocení Lehké/Akorát/Těžké, poznámka max500znaků. Lze opakovat stejnou pozici, přejít dále i po prohře nebo uložit a pokračovat později. Ukládá se snapshot pro případ obnovení, nikoli rozehraná deska; obnovení vede k hodnocení přerušeného pokusu. Výhra dosažená před obnovením je v snapshotu výhra. Délka znamená uplynulý čas od otevření pokusu, zahrnuje čekání a neaktivní kartu.

Výsledky zahrnují cíl/skutečnépočty/kryty/kruhy, tahy, čas, pomoc, vytvořené nálože, přímé odpaly a platné posuny. Výbuchy řetězem se nepočítají jako přímé klepnutí. Běžná telemetrie MiniGame v playtestu vypnutá, výsledky předává kontextu. Žádné dev Complete level v testu.

Data: beyond-signal-blind-test-v1:<run>, vlastní náhodná reportovací capability. Rating reviduje tentýž attemptId, fronta ponechává vyšší revizi při doběhu staršího requestu. Offline retry15s/online, chyba odeslání nebrání hraní. Pozastavení odesílání zachová místní frontu pro výslovné obnovení. Konflikt revizí zastaví zápis, Web Locks chrání dvě otevřené karty. Chyba místního zápisu zastaví přechod, není vydávaná za úspěch. Bez podpory Web Locks zůstává kontrola revizí.

Používá již existující record_balance_attempt a celý whitelistovaný objekt configuration.playtest. Žádné nové SQL. Backend má limit300novýchpokusů/identitu/den; při jeho dosažení fronta čeká, nic se nezahazuje. Metadata a hodnocení pod configuration.playtest, současná90denníserverováretence. Místní průchod se nesmaže retencí a zůstává do vymazání prohlížeče. Export je {attempts,...} pro existující import /balance, neobsahuje capability token ani reporter. Kontakt pro výmaz podle IDsession uveden v privacy.

/balance má oddělený Slepý lidský playtest, výběr průchodu a vlastní export. Označené pokusy nepatří do tabulek běžných hráčů/botů ani jejich exportu. Serverové celkové počty reportovacích zařízení mohou obsahovat testovací identitu; přehled na tuto mez upozorňuje. Test nemá kampaň ani návštěvní/retention záznamy. Přístup ke společným výsledkům stále jen správce.

Ověření: unit testy pořadí, připnutí konfigurací, validace, revizí a exportu bez tajemství; browser Chromium/WebKit320×568 pro výhru, hodnocení, další pozici, reload, izolaci normálních klíčů, offline quit/retry, druhou kartu, exhaustion, pauzu a poslední200. Živý izolovaný backend record_balance_attempt204 + okamžitý delete_browser_analytics204. Žádný skutečný uživatelský účet ani postup v testech. Fyzické zařízení a osobní zkušenost dodá uživatel po nasazení.
