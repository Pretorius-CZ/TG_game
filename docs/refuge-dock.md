# Útočiště výpravy — příletový dok (141–145)

První dávka kapitoly 9 navazuje na uložené setkání se správcem po 140. Do Útočiště lze odcestovat po dočtení i přeskočení komiksu; předtím je přechod zamčený. Útočiště je menší lidská základna na asteroidu pod zlatými ochrannými oblouky. Její obyvatelé odešli společně na záchrannou cestu, zásoby nechali i pro další příchozí. Obnovujeme bezpečný vstup a připravujeme jejich návrat.

| Level | Úkol | Deska | Tahy | Cíle a překážky |
| --- | --- | --- | --- | --- |
| 141 | Příletový maják | 7×8 | 25 | 27 hranolů + 24 modulů, 4 kryty |
| 142 | Vstupní filtry | 7×8, vykrojené rohy | 27 | 30 filtračních modulů + 24 náplní, 4 kryty |
| 143 | Zásoby doku | 7×8 | 28 | 30 zásobovacích kapslí + 24 modulů, 6 krytů |
| 144 | Vstupní lávka | 8×8 | 30 | 27 hranolů + 27 filtrů, 4 kryty, rezonátor na 3 impulzy |
| 145 | Přetlakový vstup · HARD | 8×8 | 34 | 30 filtrů + 30 náplní + 24 kapslí, 8 krytů, rezonátory na 3 a 4 impulzy |

Limity jsou návrhy pro testování, nikoli potvrzená lidská obtížnost. Levely 146–150 mají obnovit obytný blok, zatím nejsou vytvořené. Nová mechanika podlahových panelů z roadmapy zůstává návrhem a v této dávce není zapojená.

## Nová sada dlaždic

- 141 zachovává známou šestici Noční zahrady.
- 142 nahrazuje oranžové kořenové uzly trojlaločnými filtračními moduly (`refuge-filter`, typ 3); úvodní bublina změnu vysvětluje.
- 143 nahrazuje zlatý pyl zaoblenými šestihrannými zásobovacími kapslemi (`refuge-supply`, typ 4). Od tohoto levelu platí sada `refuge`.
- Chladicí náplně, energetické moduly, navigační hranoly a živá semena zůstávají známé. Semena dávají smysl jako zásoba pro pozdější skleník. Další případnou obměnu plánovat k odpovídajícím úkolům v obytném bloku/ošetřovně; neměnit celou sadu po pěti levelech.

Ikony cílů, desky, názvy i EN/CZ texty používají tutéž sadu. Typy zůstávají 0–5, pravidla spojování, náloží, pomůcek a jejich sdílených zásob beze změny. Nové PNG jsou 256×256 se skutečnou alfa průhledností.

## Grafika

Vytvořeno imagegen, originály ponechané v generated_images. Dvě portrétové WebP v public/scenes: refuge-dock a refuge-dock-restored. Výchozí prompt: expedicí postavený dok na malém asteroidu, bílé opotřebené panely/oranžové pruhy, ochranné zlaté oblouky a prosklené habitaty, tmavomodrá obloha s fialovou mlhovinou, oddělený maják, sání filtrů, žlutá zásobovací skříň, bezpečnostní lávka a kulatá přetlaková komora. Bez textu/UI, portrét 9:16, žádný rozdělený obraz.

Opravená varianta je edit stejné kompozice: jasný tyrkysový maják, nové filtrační lamely, zpřístupněné zásoby, opravené vodicí zábradlí a zelený rám vstupu s osvětlenou vnitřní chodbou. Teplá světla habitatů se globálně nemění. Místní měkké masky odhalují příslušný systém, po 5/5 celou opravenou scénu.

Prompty ikon: filtrační modul se třemi oranžovými pletenými vložkami kolem červeného jádra, zásobovací kapsle jako kompaktní zlatý šestihranný kontejner s tmavými svorkami; izolované na transparentním pozadí, bez textu/rámu/podstavce, čitelné na telefonu.

## Ukládání a návaznost

refugeDockCompleted 0–5 vyžaduje caretakerMet=1 a všechny předchozí etapy. Stav zahrnutý v lokálním ukládání, sloučení, resetu, deníku a analytickém katalogu. Celkem 145 unikátních miniher. Dok má EN/CZ úvody, výsledky a pět deníků. Replay nepostupuje dál. Návrat vede ke správci, mapa Elysia nabídne nejhlubší odemčený vstup.

Cloud potřebuje supabase/022_refuge_dock.sql, kumulativní herní migraci včetně 021/020/019/018; nenahrazuje analytiku 016/017. Živé provedení zatím nepotvrzené. Chybějící serverová podpora není hlášena jako úspěšná synchronizace.

## Ověření

115 unit testů prošlo: podmínka setkání včetně neúplné svatyně, pořadí úkolů, replay, merge/reload/reset, deník, překlady, 30 stabilních hratelných desek na úkol, platné kryty/rezonátory, postupné zavedení ikon a obsah migrace. Izolovaný mobilní prohlížeč ověřil zamčený přechod před přeskočením setkání, následný vstup do Útočiště, všech pět oprav přes vývojové dokončení, reload opravené scény, replay a skutečně načtené nové ikony. Deska s novou sadou ověřená na 320×568. Lidskou obtížnost je třeba měřit testováním a analytikou.
