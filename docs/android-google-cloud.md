# Google účet a cloudové ukládání v Androidu

Implementace 23. 10. 2026 na `codex/android-current`. APK připravené
pro aktualizaci přes Run; **skutečné Google přihlášení na POCO ještě není
fyzicky potvrzené**. Automatické kontroly používají náhradu Googlu a
nativních pluginů, nikoli uživatelův účet nebo produkční cloudové zápisy.

## Co se synchronizuje

Používá se dosavadní Supabase Google provider a stejná identita jako na
webu. Existující `sync_game_progress` a ukládání po účtech přenášejí opravy,
hvězdy, odlet, kapitoly a čtený deník. Nové SQL není potřeba.

Host se automaticky neslučuje s Google účtem. Jeho uložený postup zůstává
v původním profilu; po přihlášení je k dispozici výslovné převzetí hosta.
Odhlášení se vrací k místnímu hostovi. Energie a pomůcky zůstávají místní;
zásoby pomůcek mají samostatné klíče jednotlivých profilů a nejsou cloudový
inventář. První přihlášení na Androidu nevytváří novou startovní kolekci
pomůcek (ochrana obdobná nové webové doméně), existující uložené zásoby
se nemažou. Ruční reset celé hry zachovává své dosavadní pravidlo zásob.

## Přihlášení a návrat

- Oficiální pluginy `@capacitor/app`8.1.2 a `@capacitor/browser`8.0.5.
  Google se otevře v systémové kartě, nikoli v herním WebView.
- Supabase PKCE s `skipBrowserRedirect:true`; ověřovací klíč i relaci
  spravuje SDK v místním úložišti aplikace. Callback přijímá jen `code`,
  nikoli access/refresh tokeny v URL.
- Návraty přesně dle balíčku:
  `com.playbeyondthesignal.game.preview://auth/callback` a
  `com.playbeyondthesignal.game://auth/callback`.
  Manifest používá `${applicationId}`, takže debug a budoucí release
  nemohou otevřít nesprávnou variantu aplikace.
- `appUrlOpen` i `getLaunchUrl` pro spuštěnou i ukončenou aplikaci.
  Jednorázový čekající záznam bez tokenů, platnost10minut; kód se mění
  za relaci pouze při dříve zahájeném přihlášení. Cizí schéma/host/cesta,
  URL s fragmentem/tokeny a více kódy se ignorují; návrat se nesmí logovat.
- Opakovaná událost nevymění stejný kód dvakrát. Odhlášení zruší čekající
  přihlášení a počká na případnou probíhající výměnu, než SDK odhlásí.
- Zavření, odmítnutí nebo chyba nepřepisují hosta. UI EN/CS vysvětluje
  čekání/chybu a umožňuje další pokus.

Uživatel 23.10.2026 potvrdil přidání obou přesných adres do Supabase →
Authentication → URL Configuration → Redirect URLs. Původní webové
adresy a Site URL se měnit nemají. Google provider nadále vrací na
Supabase HTTPS callback; do Google Console se nepřidává aplikací používané
vlastní schéma jako webové redirect URI.

## Ověření

- 275unit testů: nové PKCE řízení, přesné callbacky, duplicitní události,
  cold start, vypršení, zrušení, chyba, retry, odhlášení během výměny;
  stávající ukládání, účty, hvězdy a zásoby.
- 4Chromium integrační scénáře Android režimu, skutečné Supabase JS SDK
  a řízení PKCE, mockované pluginy a backend: cloudové načtení, explicitní
  import hosta, obnovení relace po reloadu, odhlášení, zachování hosta a
  zásob, zrušení/odmítnutí a české hlášky.
- 9Chromium regresí nad produkčním Android sestavením: replay všech7
  segmentů před odletem, zamčené budoucí části a historický částečný postup.
- APK build prošel; sloučený debug manifest má správné preview schéma
  a seznam pluginů v APK obsahuje App/Browser/AdMob.

Přidání URL potvrzuje uživatel, nikoli automatická kontrola administračního
účtu. Živý Google průchod a přenos mezi telefonem/webem jsou dalším
fyzickým testem. Webová produkce se touto nativní funkcí nemění.
Testovací AdMob ID zůstala stejná; ostré reklamy a Play vydání se nezapínají.

## Fyzický test

1. Aktualizovat stejnou instalaci přes Android Studio Run, bez odinstalace
   a bez mazání dat. V Nastavení zvolit Pokračovat přes Google.
2. Použít stejný účet jako na webu. Ověřit automatický návrat do aplikace
   a stav „Postup uložen online“. Dát synchronizaci několik sekund.
3. Ověřit správný postup; případně výslovně převzít pokročilejšího hosta.
4. Dokončit level v APK a ověřit jej po obnovení webové hry na stejném
   účtu, pak opačný směr. Zkontrolovat i hvězdy a čtený deník.
5. Úplně zavřít/otevřít APK: relace i postup se mají obnovit. Odhlášení
   musí vrátit původního hosta. Nemačkat reset kvůli testování přihlášení.

Podklady ověřené při implementaci:
- https://capacitorjs.com/docs/apis/app
- https://capacitorjs.com/docs/apis/browser
- https://supabase.com/docs/guides/auth/native-mobile-deep-linking
- https://supabase.com/docs/reference/javascript/auth-exchangecodeforsession

## Potvrzení uživatele — 23. 10. 2026

Po aktualizaci a návodu k přihlášení uživatel potvrdil „funguje“.
Google přihlášení v Android aplikaci je tedy fyzicky potvrzené uživatelem.
Toto potvrzení aktualizuje výše uvedený stav čekajícího Google průchodu.
Samostatný obousměrný přenos nově dokončeného levelu, hvězd a deníku
telefon ↔ web nebyl v této zprávě výslovně popsán; nezaměňovat jej za
samostatně ověřený synchronizační test.
