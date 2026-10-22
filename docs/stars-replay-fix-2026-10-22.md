# Hvězdy při opakování levelu — 2026-10-22

Uživatel hlásil Kokpit se třemi hvězdami u všech oprav, ale se dvěma
chybějícími hvězdami v přehledu. Součet používá správná čtyři ID
lights/windows/computer/diagnostics; aktuální pořadí katalogu odpovídá scénám.

Reprodukována konkrétní chyba: uložené hodnocení 3/3/3/1 dává 10/12.
Opakování diagnostiky ukáže novou výhru za tři hvězdy i nejlepší výsledek
za tři, ale původně ukládalo až tlačítkem pokračování. Zavření výsledku
nebo reload ponechalo 10/12. Automatický test před opravou selhal právě
na očekávaném 12/12 proti skutečnému 10/12. To je prokázaný scénář;
bez původního problematického save nelze potvrdit, že vysvětluje všechny
okolnosti uživatelova hlášení.

MiniGame nově uloží lepší hodnocení již dokončeného levelu ihned při
ustálené výhře, po všech kaskádách. Horší pokus nejlepší výsledek nesníží.
První dokončení stále ukládá hvězdy spolu s potvrzením opravy; slepý test
automatické udělování nepoužívá. Obtížnost, limity a pravidla hvězd beze změny.

Staré nezapsané výsledky nelze rekonstruovat ze součtu. Není přidána
migrace, která by svévolně rozdávala tři hvězdy. Uložené výsledky zachovány.

Ověření: 259 unit testů; Chromium/WebKit reprodukce zavření a reloadu,
horšího výsledku, první výhry a izolace slepého testu. Android APK úspěšně
sestavené a synchronizované pro další Run. Oprava je místní ve větvi
codex/android-current, vhodná pro samostatné převzetí do webové větve;
produkční web/game nebyly tímto úkolem publikovány.
