# CrazyGames Basic

Build: npm run build:crazygames. Balíček releases/beyond-the-signal-crazygames-v0.1.0.zip; index.html v kořeni.

155 levelů, SDK v3 inicializované před aplikací a gameplayStart/Stop při hraní minihry. Basic nemá reklamy; dosavadní volitelné bonusy se poskytují zdarma se stejnými limity na pokus. Web a itch zůstávají ve vlastních režimech. LocalStorage ukládá postup, energii, hvězdy, pomůcky a preference. Vybrat Yes, using LocalStorage. Bez Google loginu, externích odkazů v Settings, Supabase analytiky/geolokace a webového auto-update. Muting přes SDK zatím není implementováno, políčko nechat prázdné.

ZIP 214 souborů, 152,88 MiB, rozbaleno154,49 MiB (limit250 MB /1500souborů). Se SDK platí limit prvního načtení50 MB, pro mobilní homepage20 MB. Browser test na390×844 se simulovaným SDK načetl první minihru za1,60 MiB lokálních souborů a vyvolal gameplayStart. Nezahrnuje velikost reálného SDK; přesné měření ověří QA v portálu.

160 unit testů a CrazyGames/web build prošly. Browser ověřil otevření první minihry bez vstupní boost nápovědy, žádné pageerror, bez externích požadavků kromě SDK a reload postupu. Přijetí a živé SDK nejsou zatím ověřené.

Zdroje: https://docs.crazygames.com/requirements/technical/ , https://docs.crazygames.com/sdk/intro/ , https://docs.crazygames.com/sdk/game/ .

## 0.1.1 — velikost minihry
MiniGame dialog vykreslen přes createPortal do body, oddělen od zoomu lodní scény. Při900×560 má dialog440×544 a zabírá výšku iframe bez scrollu; mobilní zobrazení ověřeno také390×844 a320×568. Uploadovat ZIP v0.1.1 namísto0.1.0.

2026-10-08 — CrazyGames0.1.2: první jazyk dle SDK.user.systemInfo.locale (cs → čeština, ostatní/chyba → EN), uložená ruční volba má přednost. Zkompaktněna minihra pro široké rámce do620px výšky; při821×462/800×450 mají dlaždice28,7/27px namísto13,3/11,5px, bez scrollu. Browser se simulovaným SDK ověřil EN/CZ/DE fallback a ruční EN přes reload. Reálné SDK/čitelnost na dalších zařízeních ověřuje portálové QA.
