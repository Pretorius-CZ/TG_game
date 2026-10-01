# Společná analytika testerů v Supabase

Implementace 1. 10. 2026; připraveno lokálně, server zatím nenastaven.

## Aktivace

1. V Supabase SQL Editoru spustit `supabase/016_balance_analytics.sql`.
   Tato migrace je samostatná, nemění postup hry ani předchozí funkce.
2. Přidělit správu vlastnímu Google účtu pomocí následujícího SQL.
   Nahradit e-mail vlastním účtem, kterým se přihlašuješ do hry:

```sql
insert into public.balance_admins(user_id)
select id from auth.users where lower(email)=lower('TVUJ_GOOGLE_EMAIL')
on conflict(user_id) do nothing;
```

Pokud dotaz vloží 0 řádků, účet ještě není v Authentication Users nebo
nesouhlasí e-mail. Nejde o Google Cloud klient ani účet správce Supabase.
3. Publikovat build, který obsahuje odesílání; starší verze hry ho nemá.
4. Odehrát pokus jako host, přihlásit se účtem správce a otevřít
   Nastavení → Přehled testování obtížnosti → Načíst všechny testery ze Supabase.
5. Ověřit růst záznamů v `balance_attempts` také z dalšího zařízení.
   Neprivilegovaný účet nesmí společný přehled načíst.

## Co se ukládá

Náhodné ID prohlížeče a pokusu, ID levelu, výsledek, limit a spotřeba tahů,
zbývající tahy, použitá nápověda/pomůcky/+5, konfigurace cílů a desky,
stav krytů/rezonátorů, verze buildu a doba od začátku pokusu. Doba zahrnuje
čekání, skrytou kartu a reklamu; není čistým herním časem. Jméno, e-mail,
obsah deníku a herní účet se do analytiky neposílají. Náhodné ID odlišuje
prohlížeče, nikoli spolehlivě jednotlivé lidi; vymazání dat změní ID.

Záznam po vyčerpání tahů se při pokračování aktualizuje pod stejným ID.
Monotónní revize brání přepsání nového výsledku starým požadavkem.
Fronta se ukládá místně, odesílá po záznamu, při návratu online/do okna
nebo každých 30 sekund. Chyba serveru frontu nevymaže a neblokuje hraní.
Nejvýše 2000 čekajících záznamů; při překročení se nejstarší zahodí.
Všechny dosavadní místní pokusy se při prvním spuštění nového buildu
odešlou také; chybějící ID dostanou stabilní náhradu; chybějící konfiguraci zpětně nezískáme.
Pokusy nikdy nezaznamenané ve starších verzích nelze rekonstruovat.

## Přístup

Tabulky mají RLS a žádná přímá klientská práva. Omezená zapisovací RPC
je dostupná hostům i přihlášeným. Tajný náhodný token prohlížeče umožňuje
aktualizovat jen jeho pokusy; neposílá se v exportu ani správci v reportu.
Čtení kontroluje `auth.uid()` v `balance_admins`, vrací jen herní payload
a náhodné ID reportéra. Nikdo se nemůže sám přidat mezi správce.
Zápis omezuje velikost payloadu, základní formát a 300 nových pokusů za
den na reportéra. Klientská analytika není autoritativní podklad pro platby;
výsledky jsou hlášené prohlížečem. Při veřejné distribuci přehodnotit
retenci, zátěž a platformní požadavky na analytiku.

## Vyhodnocení

Panel odděluje pomoc, odchody a technické chyby. Aktuální tahy/rozměry
jsou výchozí filtr; pro změnu cílů použít konfiguraci v exportu. Doporučení
začíná od 20 pokusů, vyhodnocovat více lidí a verze, nejen počet her.
Katalog má 120 levelů. Dočasné vývojové Complete level nezapisuje výhru.

## Ověření a praktické limity

Fronta a aktualizace po pokračování ověřeny automatickými testy.
Browser test používá simulovanou odpověď RPC, ne živou databázi.
Živý SQL zápis, role a načtení dat se ověří až po provedení migrace.
Společný přehled nenačítá více než 100000 řádků; větší export přes SQL Editor.

Oficiální zdroje: [database functions](https://supabase.com/docs/guides/database/functions)
a [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).
