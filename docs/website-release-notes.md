# Novinky webu při vydání větší změny

Od 23. 10. 2026 zahrnout informační web do většího vydání hry. Drobné
technické opravy nesmějí vytvářet proud bezvýznamných oznámení; nové kapitoly,
výrazné změny obtížnosti, nové ovládání, platformy a nové jazyky popsat.

## Společný zdroj

Pořadí a datum: `src/welcomeUpdates.js`. Texty:
`src/i18n/catalogs/web/{en,cs,de,fr,es,pt-BR}.json`, stabilní klíče
`news.<id>.tag/title/body`. Jeden záznam se objeví na úvodní stránce i
v Novinkách ve všech šesti jazycích; negenerovat zvláštní ručně udržované kopie.

1. Při přípravě vydání posoudit, zda změna něco znamená pro hráče.
2. Pro vydanou změnu popsat dostupné chování a případnou nutnou aktualizaci.
   Nezveřejňovat větu „hotovo“ dřív, než je změna dostupná v uvedené verzi.
3. Připravovanou funkci označit `PŘIPRAVUJEME` / odpovídající překlad.
   Nezaměňovat interní APK test s veřejným vydáním a nedávat nefunkční
   tlačítko Download ani neexistující odkaz Google Play. Datum vydání neslibovat.
4. Doplnit současně všech šest webových jazyků a spustit `npm run site:generate`.
5. Kontroly `site:check` a `i18n:check` jsou součástí sestavení; ověřit
   Novinky na mobilu a bez JS. Při pouhé změně textů stačí cílené kontroly,
   není nutné opakovat všechny herní simulace.
6. Publikovat web a ověřit konkrétní novinky na živé stránce. Změna webu
   nevyžaduje novou instalaci APK; synchronizovat zdroje větví, aby další
   Android práce nevrátila staré webové texty.

## Vydání 23. 10. 2026

- `challenge-and-replay`: 33 cílených snížení limitů od20, replay hotových
  částí před odletem, dvoukrokové Undo, zachovaný postup a hvězdy.
- `android-preview`: interní testování Android aplikace na skutečném
  telefonu. Výslovně není veřejně ke stažení ani vydaná na Google Play.
- Úvod Novinek nově rozlišuje vydané aktualizace a označené zprávy z vývoje.

## Návaznost na jazyky

Web je vydaný v EN/CS/DE/FR/ES/PT-BR. Hra v EN/CS; ostatní webové edice
zatím odkazují do anglické hry. Toto rozlišení zachovat i v novinkách.
Pokračování herní lokalizace: sdílené UI a parametrické cíle, potom příběh,
deník a všechny úrovně; následně jazyková a mobilní kontrola před zveřejněním
dalšího jazyka. Konkrétní práce v `localization-rollout.md` a aktuální audit
`npm run i18n:report`. Pouhé odkrytí rozpracovaného jazyka není dokončený překlad.
