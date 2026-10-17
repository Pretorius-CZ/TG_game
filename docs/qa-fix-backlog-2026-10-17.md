# Seznam oprav po podrobném rozboru reportů — 2026-10-17

Stav: rozbor dokončen, následně implementována první sada oprav.
Aktuální stav jednotlivých bodů a ověření: [qa-fixes-2026-10-17.md](qa-fixes-2026-10-17.md).
Tento seznam je podklad k opravám, nikoli tvrzení, že každé hlášení bota je
chyba hry. Nahrazuje předběžné odhady z inventáře
[qa-device-review-2026-10-17.md](qa-device-review-2026-10-17.md).

## Co bylo skutečně zkontrolováno

- Všech devět dodaných ZIPů: osm nových EN běhů a starší Pixel7/CZ.
- Celé JSON reporty, výsledky a poznámky jednotlivých levelů, retry,
  závěrečné trasy, konzole, pageErrors, failedRequests a všechna automatická
  vizuální hlášení. Zkontrolováno i rozdělení screenshotů podle stavů.
- **Všech1367 screenshotů přehledově na60 kontaktních listech**, nikoli
  pouze snímky označené automatem. Podezřelé a reprezentativní případy
  navíc zvětšené: SE What lies ahead, iPad Bring it home / prohra,
  desktop Verify the reconstructed journey / konec, notebook první
  deska, Galaxy vyčerpání energie, landscape první deska / finále /
  prohra, iPhone15 úvod a závěrečný deník Pixelu.
- Porovnání s MiniGame.jsx, compactGame.css, style.css, useSceneFit.js,
  Exploration.jsx, JourneyGuide.jsx/CSS, Stars.jsx, Welcome.jsx/CSS,
  ShipLog.jsx, místními botími sondami a jejich ovládáním.

To není nové odehrání hry ani měření výkonu na fyzických telefonech.
Malé náhledy slouží k hledání rozvržení a odchylek, ne k potvrzení každého
řádku textu nebo stavu animace. Reporty neobsahují DOM snapshoty, Playwright
trace ani identifikaci verze použitého botího zdroje. Místní botí zdroje
se formátem a limity od dodaných reportů liší.

Pracovní podklady (původní ZIPy jsou v Downloads):
`C:/Users/preto/.codex/visualizations/2026/10/16/01a14548-408c-7f41-a4d0-21c89b0de166/qa-detailed/`.
Obsah: index.json, screens.json (každý snímek a jeho list), levels.csv
(každý zaznamenaný level a poznámky),60listů a evidence/ se zvětšenými
originály. Připravovací skript je vedle, `qa-review.ps1`.

## Výsledek průchodů

| Profil | Viewport CSS px | Výhry | Screenshoty | Závěr |
|---|---|---:|---:|---|
| Desktop | 1920×1080 |187|208|Konec hry,2hlášení překryvu |
| Firefox |1440×900|187|207|Konec hry,2hlášení překryvu |
| Notebook |1366×768|187|203|Konec hry,2hlášení překryvu |
| GalaxyS9+ |320×658|187|215|Konec hry,2hlášení překryvu |
| Telefon na šířku |863×360|187|211|Konec hry,malé cíle,2hlášení překryvu |
| iPhoneSE |320×568|49|54|Celkový limit testu5,5h |
| iPhone15ProMax |430×739|43|46|Celkový limit testu5,5h |
| iPadMini |768×1024|34|40|Celkový limit testu5,5h |
| Pixel7/CZ,starší běh |412×839|168|183|Bot skončil v otevřeném deníku |

Osm nových EN běhů: žádné zaznamenané console/pageErrors/failedRequests.
Starší Pixel:27HTTP400 pro record_balance_attempt, bez JS výjimek.
Číslo výher je postup botů s pomůckami, bonusovými tahy a retry;
nevyjadřuje lidskou obtížnost. Obrázkové pixely nejsou CSS pixely:
například1440pxširoký Galaxy screenshot představuje320CSSpx.

## A. Potvrzené problémy zobrazení / potřebné úpravy hry

### G01 · P1 · Malá deska na krátkém telefonu

**Důkaz:** SE snímek08 `deska-what-lies-ahead`, dvouřádkový nadpis,
tři cíle,7×8 deska. Kameny22×22CSSpx, u dalších konfigurací21×21.
Report obsahuje692výskytů,317seskupených záznamů,13postižených snímků.
Nejde o692samostatných chyb.

**Příčina doložená kódem:** deska je omezena zbývající výškou
`.puzzle-area`; nadpis má rezervu84px pro ikony, HUD a cíle nesmršťují,
prázdný `.helper-prompt` běžně zabírá24px. Dlouhý nadpis zvětší hlavičku
a zmenší desku i při volné šířce dialogu.

**Opravit:** společný výpočet/proporce prostoru tak, aby deska měla
prioritu před prázdnými mezerami. Zkompaktnit HUD, hlavičku a prostor
pomůcek podle dostupné výšky. Zachovat čitelnost titulku a celé počty cílů.
Nevynucovat vejití za cenu stále menších kamenů; delší doplňkové informace
mohou být posuvné podle dřívějšího zadání.

**Přijetí:** na320×568 má reprezentativní7×8/8×8 deska alespoň24CSSpx
na aktivní kámen (praktický minimální cíl, nikoli záruka pohodlí);
bez překryvů a bez vodorovného posunu, EN/CZ, dlouhý titulek,3–5cílů.
Běžná hra má zůstat viditelná najednou všude, kde je to reálně možné.

### G02 · P1 · Na šířku HUD vytlačí desku

**Důkaz:** všech187snímků desek na863×360 má varování; kameny9–14CSSpx.
Snímek02 první desky i208 finále ukazují malinkou desku vedle obrovských
horních panelů a spodních pomůcek.9774výskytů je opakování téhož problému.

**Opravit:** pro telefon na šířku připravit výzvu k otočení, zachovat
rozehranou desku a zabránit klikání do hry za výzvou. Nezaměňovat široký
desktopový viewport za otočený telefon. Alternativa je samostatný funkční
landscape layout; pouhé další zmenšení HUD nestačí. Volba konkrétního
řešení ještě nebyla implementovaná ani vyzkoušená.

**Přijetí:** otočení během pokusu zachová stav, tahy, energii i případnou
reklamní odměnu; návrat na výšku obnoví ovládání. Desktop1366×768 se
nezablokuje. Ověřit současně otevřené nativní dialogy a jejich top layer.

### G03 · P1 · Scénové ovládání se na šířku zmenší s obrázkem

**Důkaz:** konec landscape má navigaci13×13CSSpx a audio9×9px;
celá scéna je malý portrét uprostřed široké plochy.

**Příčina:** useSceneFit.js nastavuje `zoom` celé `.play-area`, tedy i
horní navigaci a energii/audio. MiniGame je portál mimo tento zoom,
takže G01 a G03 nejsou tatáž implementační chyba.

**Opravit:** zajistit použitelné minimum ovládání odděleně od ilustrace,
nebo tento telefonní stav pokrýt výzvou G02. Ověřit i krátká desktopová
okna/iframe, kde se výzva k otočení zobrazovat nemá.

**Přijetí:** aktivní navigační a audio cíle se neškálují na9–13px;
portrét, nízké okno i otočení mají dostupný návrat a nastavení.

### G04 · P2 · Pevný strop minihry nevyužije tablet a velký desktop

**Důkaz:** iPad a desktop mají malý herní panel s širokými nevyužitými
okraji; nejde o automatické hlášení, ale opakovanou vizuální slabinu
odpovídající zpětné vazbě uživatele. Desktop200 Verify the reconstructed
journey ukazuje i5cílů v úzkém panelu uprostřed1920×1080.

**Příčina:** `.mini-dialog[open]` má maximum440×760CSSpx, nezávisle
na vyšším rozlišení. Zvýšení jen šířky nepomůže deskám omezeným výškou.

**Opravit:** adaptivní maximum dialogu a desky podle skutečně dostupné
šířky i výšky, se zachovanými čtvercovými kameny a portrétovým charakterem.
Na1366×768 může být limit výšky legitimní; nepožadovat plošné roztahování.

**Přijetí:** porovnání stejné6×7,7×8 a8×8 desky na768×1024,
1366×768 a1920×1080; vyšší displej reálně zvětší herní plochu, bez
rozmazaných/protažených kamenů a bez skrytých pomůcek.

### G05 · P2 · Příliš vysoký výsledkový panel, hustý stav bez energie

**Důkaz:** iPad24 `dosly-tahy-a-beating-heart` i řada desktopových
výsledků mají většinu dialogu prázdnou. Galaxy174
`dosly-tahy-calibrate-the-diagnostic-stat` má naopak pod výsledkem
další velký panel Energy depleted, druhý ukazatel energie a obsah pod
spodním okrajem. Landscape159 neukazuje návrat bez posunu.

**Opravit:** zkompaktnit výsledkový stav a sjednotit informaci o energii;
prioritou jsou dostupné +5, Retry a návrat. Při dlouhém obsahu umožnit
zřejmý posun, zejména dobití/podporu. CSS už obsahuje height:auto pro
mini-result, takže před úpravou změřit skutečné computed dimensions;
nepřidávat slepě další stejnou deklaraci.

**Přijetí:** vyčerpání a0energie na320×568/658 i768×1024; žádný
nedosažitelný ovladač, návrat viditelný v běžném výsledku. Samotný přesah
dlouhého posuvného obsahu není chyba a report neprokazuje nefunkční scroll.

### G06 · P2 · Rezonátory přerůstají malé buňky

**Důkaz:** landscape208, finále Save the answer for the network: symboly
kruhů a0/4 se překrývají se sousedními kameny, zatímco buňky mají zhruba9px.
Zdroj má pro rezonátor font nejméně16px a čítač10px.

**Opravit:** spolu s minimální velikostí desky zkontrolovat vnitřní kresbu
rezonátorů, krytů a čítačů; neřešit to jen ještě menším písmem.

**Přijetí:** v každém podporovaném hratelném rozměru symbol/čítač zůstane
ve své buňce a okolní kameny lze číst/ovládat. Může se uzavřít spolu sG02.

## B. Nutné diagnostiky — příčina ještě není potvrzená

### I01 · P1 · iOS profily postupně ztrácejí výkon / čekají na akce

**Důkaz:** tři běhy skončily na celkových19800000ms=5,5h, bez pageErrors.
SE má poznámky u20levelů, ProMax12, iPad12; opakují se3s timeouty pomůcek
a někdy kamenů. První poznámky: SE What lies ahead, ProMax Someone is
listening, iPad již Holding steady / A spark of hope. iPad A message
beneath the loop vykazuje4599755ms (76,7min). Pozdější zaznamenané časy
často rostou. To není důkaz, že tento čas spotřeboval samotný engine hry.

**Prověřit/opravit podle výsledku:** izolovaný krátký WebKit průchod,
workers=1, měřit evaluate/locator.click/čekání na busy/screenshot zvlášť.
Zkusit pomůcky s návodem/bez a zvuk zapnutý/vypnutý, návrat z pozadí,
opakované otevírání miniher. Změřit dlouhé úlohy, počty DOM uzlů,
animací/listenerů, nikoli pouze prodloužit globální timeout.

**Přijetí:** opakovatelný krátký případ určí, kde vzniká nárůst času,
oprava projde stejným případem. Poslední levely nejsou označené za vadné:
screenshoty už ukazují další otevřené desky Close the circle /
A borrowed heartbeat / Bring it home.

### I02 · P2 · Dvě hlášení překryvu na konci nejsou identifikovaná

**Důkaz:** všech pět úplnýchENprůchodů, vždy dva výskyty, protože stejná
scéna byla auditována dvakrát. Čtyři hlásí section návratového koridoru,
Galaxy span.rating-stars. Název dotčeného button je prázdný.

**Důležitá korekce:** místní audit již obsahuje el.contains(top) a
top.contains(el). Pokud tento audit odpovídá vzdálenému běhu, obyčejný
potomek tlačítka s hvězdami by chybu nevyvolal. Dřívější odhad o potomkovi
proto není dostatečný důvod hlášení zahodit.

**Prověřit:** získat selector/outerHTML, rect, nejbližší skryté předky,
otevřený dialog/details, elementFromPoint a computed visibility. Kandidát
je obsah zavřeného JourneyGuide/details: auditor kontroluje jen rozměry
a vlastní opacity/visibility, nikoli celou viditelnost přes předky.
Jde o hypotézu, ne ověřenou příčinu. Ověřit zvlášť skutečný sousední hotspot.

**Přijetí:** konkrétně identifikovaný prvek; pokud je aktivní, opravit
vrstvy/pozici/přístupný název; pokud skrytý, opravit detektor a jeho regresi.
Nebrat jako opravu plošné vypnutí pointer-events na všech hvězdách/scéně.

### I03 · P2 · Úvod ProMax byl zachycen bez ilustrace

**Důkaz:** ProMax00 má logo a tlačítka na tmavé ploše, ostatní profily
již kresbu lodi. Report neuvádí neúspěšný request.

**Prověřit:** studená cache, načítání/decode obrázku a třída ready.
Welcome.jsx odhalí ilustraci až po onload pomocného Image; test čeká jen
na tlačítko a400ms. Pravděpodobná možnost je předčasný screenshot, nikoli
trvale chybějící obrázek. Uživatelskou chybu nepotvrzovat z jediného snímku.

**Přijetí:** screenshot po dekódování/ready; samostatně ověřit pomalou síť
a selhání obrázku se srozumitelným fallbackem.

### I04 · P2 · Starší400 při odesílání analytiky

**Důkaz:** Pixel/CZ27chyb, endpoint record_balance_attempt. Ostatních
osm reportů bez síťových chyb samo neprokazuje, že původní příčina zmizela.

**Prověřit:** tělo chybové odpovědi, revizi payloadu, reporter identitu,
čas/pokus, odpovídající serverové schema a limity. Neukládat tajný token
reportéra ani přihlašovací údaje do zveřejňovaného logu.

**Přijetí:** příčina vysvětlená serverovou odpovědí, následně ověřené
odeslání a retry stejného pokusu bez ztráty či duplikace.

## C. Opravy testování potřebné pro spolehlivé další výsledky

### T01 · P1 · Český bot se po168 ztratí v deníku

**Důkaz:** Pixel route: Nový zápis → Prohlédnout opravu → Všechny zápisy
→ Zpět; oba poslední screenshoty zůstaly v lodním deníku.168 bylo vyhrané.

**Opravit:** explicitní obsluha otevřeného deníku, výsledku a opravové
bubliny; pracovat v nejvyšším otevřeném dialogu. Po návratu vybrat skutečný
aktuální hotspot. Před hlášením chybějícího levelu přiložit stav navigace.

**Přijetí:** krátká cesta167→168→169 vCZ iEN, volitelné otevření/čtení
deníku ji nesmí přerušit. Neodemykat169 násilným zásahem do postupu.

### T02 · P1 · Reporty musí zachytit příčinu timeoutu a verzi testu

**Opravit:** přidat game build, commit bota, browser/engine verzi,
workers, viewport/DPR, start/end, poslední úspěšnou akci a úplný Playwright
call log/trace pro chybnou akci. Délky akcí oddělit od délky pokusu. Zavést
limit nepostupujícího pokusu s diagnostikou, nečekat5,5h na obecnou chybu.
Nedoložený commit nepředstírat, lokální config není důkaz vzdáleného běhu.

**Přijetí:** selhání je dohledatelné na konkrétní akci a zástavě stavu;
podobný běh může být krátký a reprodukovatelný.

### T03 · P2 · Počítání a seskupování vizuálních nálezů ztrácí místa

**Důkaz v místním kódu:** dedupe klíč je kind|el, nikoli screen;
uchová první detail a zvýší count. Proto692/9774 nejsou počty obrazovek,
stejný typ kamene na stejném řádku se může sloučit přes různé levely.

**Opravit:** u společné příčiny uchovat seznam všech obrazovek/levelů,
rozmezí velikostí a počty postižených scén; oddělit počet výskytů,
unikátních prvků a snímků. Evidovat stabilní selector a přístupný název.

**Přijetí:** z reportu lze vybrat libovolný konkrétní postižený level;
dvě totožné koncové kontroly nezaloží dvě nezávislé chyby.

### T04 · P2 · Test nemá potvrzovat pomoc jen pokusem o kliknutí

**Důkaz v místních zdrojích:** pomocník se zapisuje po kliknutí na cíl,
které může být force:true a jehož výjimka se ignoruje. waitIdle pohltí
timeout; nový formát dodaných reportů nemusí používat stejný kód.

**Opravit:** ověřit skutečnou spotřebu/změnu stavu, otevřené návody,
busy a účinek. Force click není náhrada reálné dotykové dostupnosti.
Neúspěšnou akci zapsat jako neúspěšnou, ne jako použitou pomoc.

**Přijetí:** zakrytý/nefunkční helper vyvolá jasný nález; úspěšné použití
má doloženou změnu. Vzdálený zdroj porovnat před změnou používaného bota.

### T05 · P2 · Screenshotové pokrytí není celá UI hra

**Důkaz:** nové reporty mají 1064 snímků začátků desek, 69 vyčerpání a 25 proher,
8 úvodů a 8 vstupů do lodi, 5 konců a 5 opakovaných konců (celkem 1184).
Automatické snímky výher, komiksů, návodů, reklamních dialogů a všech
místností nejsou systematicky zachycené. Počet snímků není pokrytí stavů.

**Opravit:** cílené checkpointy výhra / quit /0energie /+5 / tutorial /
reklama / rezonátorová pomoc / otevřený průvodce / deník / kapitoly a
otáčení během každého dialogu; EN/CZ a reduced-motion i běžné animace.

**Přijetí:** malá deterministická matice dotčených UI stavů. Nevyžadovat
znovu všech187levelů při každé změně CSS; úplné průchody až na závěr.

### T06 · P2 · Konec běhu musí mít ověřený důvod

**Důkaz:** úspěšné běhy po187 skončily na historické scéně návratového
koridoru, route končí Visit the previous area. To samo je platná návštěva,
ne chyba příběhu; není to však screenshot vlastního zakončení Archivu.

**Opravit:** zaznamenat dokončení187 a závěrečný příběhový milník ještě
před libovolným návratem. Rozlišit konec obsahu, prohru, timeout a selhání
navigace. Přiložit snímek skutečného závěru i následné scény.

**Přijetí:** úspěšný závěr doložen stavem, nikoli jen nemožností najít
další tlačítko. Pokud návratový přehled zkresluje závěr, řešit bota dříve
než automaticky měnit navigaci hry.

## Co z těchto dat nepatří do seznamu potvrzených chyb hry

- Prohra nebo retry samo o sobě. Opakované Calibrate the diagnostic station,
  Open the stream crossing a Open the boarding hatch nejsou důvod ihned
  měnit tahy; zatím jde o jednotlivé asistované automatické průchody.
- Zastavení iOS právě na posledním číslu levelu; další deska už byla otevřená.
-27unikátních chyb hry podle27stejnýchHTTP400, ani9774samostatnýchUIchyb.
- Překrytí hvězdami jako automaticky neškodný potomek: vizI02.
- Spolehlivě ověřená cloudová synchronizace, mobilní Safari na fyzickém
  zařízení nebo běžné animace. Dodané reporty takové pokrytí nedokládají.

## Doporučené pořadí realizace

1. Krátká diagnostika I01+T02 a identifikace I02, aby další testy byly použitelné.
2. Společná oprava velikostí G01/G04, současně minimální kresba G06.
3. Telefon na šířku a scénové ovládání G02/G03, výsledkové stavy G05.
4. Dokončit testovací navigaci T01/T04/T06 a reportování T03/T05.
5. Dořešit I03/I04 podle diagnostiky; cílené regresní kontroly a nakonec
   úplné průchody. Obtížnost a nový obsah tímto zadáním neměnit.

Každá položka se uzavírá až ověřením svého konkrétního případu, nikoli
jen úspěšným buildem. Původní důkazy a kritéria níže zůstávají zachované;
implementaci a zbývající nejistoty eviduje navazující dokument oprav.
