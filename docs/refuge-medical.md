# Útočiště — ošetřovna, levely 151–155

Navazuje na obytný blok 146–150. Otevře se až po jeho pěti opravách.
Dok, obytný blok a ošetřovna tvoří dokončenou kapitolu Útočiště (15 úkolů).
Stávající postup se zachovává; nové pole má výchozí hodnotu nula.

| Level | Úkol | Deska | Tahy | Mechaniky |
| --- | --- | --- | ---: | --- |
| 151 | Sterilní okruh | 7×8 | 28 | filtry + energie, 4 kryty |
| 152 | Zdravotnické zásoby | 7×8, výřezy | 29 | kapsle + chlazení, 4 kryty |
| 153 | Diagnostické pracoviště | 8×8 | 31 | hranoly + energie, 1 rezonátor |
| 154 | Regenerační kultura | 8×8 | 30 | semena + chlazení, 6 krytů |
| 155 | Připravenost Útočiště | 8×8 | 35 | tři sběrné cíle, 1 rezonátor |

Používá šest dlaždic Útočiště; další kompletní výměna po pěti levelech
by nedávala smysl. Semena propojují zahradu se zdravotnickou kulturou.
Pojistka barev v4 platí i zde. Dávkování krytů kolem rezonátorů využívá
společnou funkci zajišťující rozestupy.

Pět samostatných zápisů EN/CZ postupně vysvětluje přípravy pro návrat
výpravy. Poslední zpráva potvrzuje přijetí majáku, ale návratový koridor
je zablokovaný; záchranná loď posílá nové souřadnice. Obnova Útočiště
je uzavřená, další cesta je příběhový směr, nikoli prázdná hratelná lokace.

## Ukládání a měření

`refugeMedicalCompleted` 0–5 je zapojené do místního ukládání,
slučování, resetu, hvězd, kapitol, deníku a katalogu statistik.
Replay nevytváří další postup. Cloudová kontrola odmítne starou odpověď,
která by nový postup zahodila.

Pro cloudové ukládání je připravena kumulativní migrace
`supabase/025_refuge_medical.sql` (včetně SQL024). Nasazení na živý
server je nutné provést samostatně; v této práci nebylo provedeno.

## Grafika

Vestavěný imagegen, poškozená scéna a editace jejího opraveného stavu.
Runtime soubory `public/scenes/refuge-medical.webp` a
`public/scenes/refuge-medical-restored.webp`. Celá místnost na výšku,
klidný strop pro ovládání, dvě horní skříně, diagnostika vlevo, lůžko
vpravo a nouzová baterie na podlaze; bez textů a postav.
Pět dílčích odhalení používá masky kolem opravovaných zařízení.

Použitý základní prompt: realistická filmová sci-fi ošetřovna malé
výpravy, portrét 9:16, opotřebené ocelové panely a bronzové rámy,
tyrkysová/jantarová paleta, kruhové okno do zelené krajiny; horní
čtvrtina klidná, zanedbané vypnuté zařízení, žádné UI či nápisy.
Editační prompt zachovává kameru a polohy nábytku a obnovuje skříně,
diagnostickou obrazovku, lůžko s lampou, kulturu a podlahovou baterii;
uklízí nečistoty a přidává provozní osvětlení.

Ověření: 153 unit testů a produkční build prošly. Izolovaný vývojový
průchod všech pěti oprav (přes Complete level), reload, replay, návrat
a kontrola nepřekrývajících se hotspotů na 320/390/540 px prošly.
Nejde o simulaci lidské obtížnosti ani potvrzení živého SQL nasazení.
