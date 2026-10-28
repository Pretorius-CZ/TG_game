# Odstranění účtu — žádost a postup správce

Připraveno 28. 10. 2026. Tato cesta je ručně vyřizovaná žádost, nikoli automatické smazání. Odkaz z Nastavení přihlášeného hráče otevře veřejnou kontaktní stránku v jeho jazyce přímo na #delete-account. Tlačítko na stránce otevírá návrh e-mailu na flambiz.cz@gmail.com, nic neposílá automaticky. Účet, e-mail ani token hráče se nevkládají do URL.

Webový zdroj pro Play Console: https://playbeyondthesignal.com/contact.html#delete-account . Použít až po nasazení a ověření stránky. Stránka existuje ve všech šesti jazycích a funguje bez přihlášení i bez instalované aplikace. Žádost lze napsat přímo i bez nastaveného poštovního programu.

## Vyřízení správcem

1. Přijmout žádost a ověřit, že žadatel ovládá adresu propojenou s účtem. Nespoléhat na samotný obsah pole From nebo na přeposlaný screenshot; podle potřeby potvrdit žádost samostatnou zprávou na již známý e-mail účtu. Nikdy nežádat heslo, OAuth odkaz nebo token.
2. V Supabase → Authentication → Users ověřit správný účet podle potvrzeného e-mailu a zaznamenat jeho ID pro kontrolu. Nemaž účet podle herní přezdívky. Ověřit aktuální schéma a závislosti před ostrou operací. U případných Storage objektů nejprve prověřit jejich vlastníka.
3. Po ověření použít odstranění Auth uživatele v Supabase. Zkontrolovat smazání jeho cloudového řádku game_progress; migrace 001 má FK user_id → auth.users ON DELETE CASCADE. Stejný cascade má případný balance_admins řádek. Samotný reset_game_progress ani odhlášení účet neodstraní.
4. Prověřit, že účet a cloudový save zmizely. Staré přístupové JWT mohou doběhnout do expirace; smazání Auth účtu ruší relace/refresh, není okamžitým zneplatněním každého vydaného tokenu. FK brání obnově game_progress pod už neexistujícím Auth ID. Přihlášení později může založit nový účet; nevydávat starý cache za obnovený cloudový save.
5. Dobrovolná analytika není připojená k Google e-mailu. Nelze podle něj bez dalšího zjistit všechny náhodné identifikátory. Pomoci žadateli použít Nastavení → Vypnout a smazat moje statistiky na každém zařízení/adrese, nebo dohledat bezpečně identifikované záznamy ze žádosti. Nežádat soukromé reporting tokeny e-mailem. Bezpečnostní revokace a logy/zálohy mají vlastní účel a retenci popsanou v soukromí.
6. Potvrdit vyřízení, skutečný rozsah a případná omezení. Vzdálené smazání Auth účtu nevymaže lokální kopie na jiných zařízeních, energii a zásoby; na to stránka výslovně upozorňuje. Nezamlčet legitimní uchovávaná data.

Tento postup nikdy automaticky nespouštět proti účtu hráče v rámci testů. E2E ověřit na zvlášť založeném testovacím účtu se souhlasem vlastníka; dosud neprovedeno. Podklady nejsou tvrzením, že jsme dokončili Families ani celý Data safety formulář.

Oficiální zdroje: [Google Play — account deletion](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en), [Supabase — deleting users](https://supabase.com/docs/guides/auth/managing-user-data).
