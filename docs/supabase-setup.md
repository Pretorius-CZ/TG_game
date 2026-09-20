# Supabase: přihlášení a cloudové opravy

Projekt: https://pogyrdsuoqpnzsdeuqpk.supabase.co

## Nastavení správcem
1. V Supabase otevřít SQL Editor a spustit celý soubor `supabase/001_game_progress.sql`.
2. Authentication → URL Configuration: Site URL `https://pretorius-cz.github.io/TG_game/`.
   Povolit redirect URL `https://pretorius-cz.github.io/TG_game/` a `http://127.0.0.1:5173/`.
3. V Google Cloud vytvořit OAuth klienta typu Web application. Nastavit consent screen a testovací uživatele, pokud je aplikace v testovacím režimu.
   Authorized redirect URI: `https://pogyrdsuoqpnzsdeuqpk.supabase.co/auth/v1/callback`.
4. V Supabase Authentication → Sign In / Providers → Google zapnout poskytovatele a vložit Google Client ID a Client Secret.
   Secret zůstává v Supabase, nepatří do kódu ani chatu.
5. Ověřit přihlášení, import hosta, opravu, odhlášení a další zařízení. Teprve pak publikovat testerům.

Návod poskytovatele: https://supabase.com/docs/guides/auth/social-login/auth-google

## Chování
- Save online → Google. Bez účtu zůstává původní místní hra.
- Účty mají oddělené místní kopie. Import hosta je výslovné tlačítko; další účet jeho data automaticky nedostává.
- Cloud synchronizuje opravy, přečtený deník, scénu a finále po přihlášení, krátce po změně postupu a každých 15 sekund. Offline hra ukládá místně a zkouší přenos znovu.
- Server slučuje počty oprav maximem, deník sjednocením. Starší karta ani souběžné zařízení nevrátí opravy zpět.
- Energie, zvuk a rozehraná deska nejsou součástí cloudového uložení. Energie nadále místní a sdílená mezi účty na zařízení.
- RLS dovoluje číst jen vlastní řádek. Zápisy pouze přes funkci s identitou auth.uid(); klient nemůže zadat cizí ID.
- Toto není ochrana proti podvádění; postup pochází od klienta. Reklamní/platební odměny později potřebují ověření backendem.
- Veřejná URL/klíč jsou ve src/supabase.js; lze přepsat VITE_SUPABASE_URL a VITE_SUPABASE_PUBLISHABLE_KEY. Žádné administrátorské klíče.

Ověřeno uživatelem 2026-09-20: přihlášení Googlem v anonymním okně, dokončení levelu, potvrzení uložení a načtení stejného postupu po přihlášení v jiném prohlížeči. Při konfiguraci vkládat URL bez zpětných apostrofů či uvozovek.


