# Kapitola 5 — Trhlina

Implementace 2026-09-28 navazuje na [návrh](rift-roadmap.md).
Po všech šesti sektorech Elysia je přímo na mapě tlačítko
„Investigate the echo / Prozkoumat ozvěnu“. Elysium zůstává dostupnou základnou.

## Hratelný obsah

Pevné pořadí tří výprav, každá se čtyřmi úkoly a čtyřmi zápisy deníku:

| Etapa | Úkoly v pořadí | Navržené tahy |
|---|---|---|
| Nemožná ozvěna | oddělení ozvěny, synchronizace hodin, zaměření zdroje, průzkumná trasa | 25 / 27 / 29 / 31 |
| Poslední stanoviště | anténa, záznamník, sonda, průletový štít | 27 / 29 / 31 / 33 |
| Pole stabilizátorů | blízká kotva, vzdálené majáky, zpáteční maják, HARD stabilizace | 29 / 31 / 33 / 35 |

Desky 7×7, druhá v každé etapě s vykrojenými rohy, čtvrtá 7 sloupců ×8 řádků.
Šest technických dlaždic Elysia, dva až tři barevné cíle, běžné boostery.
Kryty až od třetího úkolu (4), finální úkoly po6. Čísla jsou návrhy pro
testování, ne garance lidské úspěšnosti; starší obtížnost se nemění.

## Příběh a grafika

Ozvěna uvítací zprávy má neobvyklou časovou značku. Pilot nejprve ověří
přijímač a hodiny; nejde o potvrzení cestování časem. Záznamy a sonda
ukážou, že část původní výpravy prošla uměle stabilizovanou Trhlinou.
Černý gravitační objekt není cíl letu: bezpečná cesta vede samostatným
průchodem vedle něj. Zpáteční maják se zabezpečí ještě před průletem.

Tři nové portrétové scény a pohled na zahradní prstenec. V observatoři
a na plošině se aktivují zařízení postupným odhalením barev/světla nad
ztlumeným výchozím obrazem. Majáky mají vlastní generovaný neaktivní obraz:
lokální měkké masky zapnou kotvy, teprve4/4 odhalí celý stabilní průchod.
Žádné tvrdé obdélníkové přechody.

Po12úkolech se na mapě objeví průlet. Používá perspektivní Canvas warp
s vlastními texty a barevným laděním, podporuje přeskočení, zrušení
i omezené animace. Přílet přidá13.zápis a zobrazí obrovský zahradní prstenec.
Návraty a opakování jsou zdarma, bez opětovného přičítání postupu.

Prstenec je zatím závěrečný pohled, nikoli hratelná kapitola6.
Portálová pole a rezonátory z návrhu zůstávají na další práci;
nezměnilo se herní jádro ani se nepřidala nová ekonomika.

## Data a ukládání

- `src/rift.js`: úkoly, deník, EN/CZ páry, odemykání a dokončení průletu.
- `src/Rift.jsx`, `src/rift.css`: mapa a přílet; úkoly používají sdílené Exploration.
- Lokální postup: `riftEchoCompleted`, `riftPlatformCompleted`,
  `riftBeaconsCompleted` (0–4) a `riftCrossed` (0–1).
- Normalizace vynucuje dokončení Elysia a návaznost etap; reset i slučování
  zahrnují nová pole, staré uložené hry zůstávají kompatibilní.
- Pro cloud spustit `supabase/012_rift.sql`. Kumulativní po003–011,
  obsahuje také poslední sektory Elysia. Zachovává RLS, účetní zámek
  a resetRevision. Živé nasazení ani databázový běh zde nejsou ověřené.
- Klient rozpozná starší server, který nová pole neuloží, a nezobrazí
  falešný úspěch cloudového uložení.

## Ověření

74 automatických testů včetně nového řetězce odemykání, ukládání,
slučování, resetu, replay,13deníků a240 generovaných počátečních desek.
Izolovaný mobilní průchod všech12úkolů přes vývojové dokončení,
v prvním úkolu každé etapy i skutečný platný tah. Ověřeno obnovení,
příletový deník, návrat na Elysium, zrušení a přeskočení průletu.
Dále ověřeno rozložení320/390px bez překryvu nadpisu a ovládání, běžný
automatický průlet a čtyři obrazové stavy aktivace majáků.
Produkční build prošel; zůstává dosavadní upozornění na velikost JSbalíku.
Testy nepoužívají ani nemění skutečný postup uživatele.

Prompty a původ obrázků: [grafické podklady](../public/scenes/rift-assets.md).
