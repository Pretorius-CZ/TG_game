# Noční zahrada — Svatyně a komiksové setkání (136–140)

Závěrečná pětice Noční zahrady navazuje po kořenové komoře 135. Správce je starý průzkumný automat, který přežil díky živým kořenům. Výprava zde odpočívala a dobrovolně pokračovala do Útočiště. Setkání předává souřadnice a požadavek obnovit komunikaci; obsah Útočiště od 141 zatím není vytvořený.

| Level | Úkol | Deska | Tahy | Cíle a překážky |
| --- | --- | --- | --- | --- |
| 136 | Zpáteční maják | 7×8 | 25 | 27 hranolů + 24 modulů, 4 kryty |
| 137 | Úkryt návštěvníků | 7×8, vykrojené rohy | 27 | 27 náplní + 27 semen, 4 kryty |
| 138 | Společný jazyk | 7×8 | 29 | 30 pylu + 24 uzlů, 6 krytů, rezonátor na 3 impulzy |
| 139 | Paměť správce | 8×8 | 30 | 30 uzlů + 27 modulů, 4 kryty, rezonátor na 3 impulzy |
| 140 | Souřadnice Útočiště · HARD | 8×8 | 34 | 30 hranolů + 27 pylu + 24 semen, 8 krytů, rezonátory na 3 a 4 impulzy |

Všech pět zachovává sadu `night`; další obměna má přijít v Útočišti. Tahy jsou návrhem pro lidské testování. Celkový katalog obsahuje 140 jedinečných miniher.

## Tři komiksové panely

1. Za živými dveřmi — pilot najde automat prorostlý zahradou.
2. Výprava žije — holografická vzpomínka ukáže odpočívající tým a vysvětlí jeho další cestu.
3. Nový směr — správce předá souřadnice Útočiště.

Po potvrzení poslední opravy 140 se sekvence otevře automaticky. Pokud se hra zavře před dokončením nebo přeskočením, při dalším vstupu do hotové svatyně nabídne setkání znovu. Po dokončení se automaticky neopakuje.

Jeden portrétový panel na displej. Ovládání: Další, posun prstem doleva/doprava, tři body pro volbu panelu, šipky na klávesnici. Přeskočit je vždy nahoře; Escape také přeskočí a uloží stejné setkání. Žádný automatický časovač ani spotřeba energie/tahů/pomůcek. Chybějící obrázek neblokuje text ani přeskočení.

EN/CZ titulky a věty jsou samostatné UI; ilustrace neobsahují text. Nativní modal drží fokus, jednotlivé panely přesunou fokus na Další. Na malém displeji mají ovládací prvky minimálně 44 px. Poměr stran obrázků je zachován přes object-fit:contain.

Po uložení je v deníku položka Pozvání správce s tlačítkem Přehrát setkání. Replay se vždy otevře od prvního panelu a nezdvojuje postup.

## Grafika

Čtyři nové optimalizované WebP v public/scenes; originály zachované v generated_images:

- caretaker-arrival.webp: svatyně pod kořeny, pilot v bílo-oranžovém skafandru zleva zezadu, bronzový automat s jedním kruhovým okem a kořenovým srdcem uprostřed; lidské zásoby, maják, semenný úkryt, překladový kruh a projektor. Použito také jako výchozí prostředí pěti oprav.
- caretaker-memory.webp: edit stejné kamery a kompozice; obnovené světlo majáku, semenného úkrytu, kruhu, srdce a projektoru. Malý hologram čtyř odpočívajících členů výpravy nad stolem. Opravená scéna svatyně s místními měkkými maskami; pro komiks je použit samostatný bližší záběr, aby UI nezakrývalo výpravu.
- caretaker-expedition.webp: samostatný druhý komiksový panel s velkým hologramem odpočívající výpravy v horní polovině, správcem vpravo a pilotem zleva. Dolní část je klidná pro titulek a ovládání.
- caretaker-route.webp: bližší pohled na stejného pilota a správce; předání světelného hranolu, nad rukama trasa ke vzdálenému Útočišti. Jiná kompozice, bez recyklování průletu.

## Ukládání a ověření

nightSanctuaryCompleted 0–5 vyžaduje nightRootCompleted=5. caretakerMet 0–1 vyžaduje svatyni 5/5. Obě pole zahrnují místní uložení, sloučení, reset a cloudovou kontrolu. Stejná dokončovací funkce obsluhuje dočtení i přeskočení. Automatická aktualizace hry čeká po dobu otevřeného komiksu.

Supabase potřebuje supabase/021_caretaker.sql, kumulativní migraci včetně 020/019/018. Analytiku 016/017 nenahrazuje. Živé spuštění není potvrzené. Při chybějící serverové podpoře nových polí není synchronizace vydávána za úspěšnou.

112 unit testů prošlo: odemčení, pořadí, replay, reset, sloučení a reload, deník, překlady, platné kryty/rezonátory, 30 stabilních hratelných desek na každý nový úkol a obsah migrace. Izolovaný mobilní prohlížeč ověřil všech pět oprav přes vývojové dokončení, automatické setkání, tlačítka, swipe, přeskočení a jeho persistenci, reload bez opakování, replay z deníku a nulovou spotřebu energie. EN/CZ panely ověřené na 320×568; EN také 390×720. Lidská obtížnost zbývá k vyhodnocení.
