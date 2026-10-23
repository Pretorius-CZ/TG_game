# Další ladění obtížnosti a zásob — 2026-10-23

## Aktuální zadání uživatele

Uživatel upřesnil, že osobní průchod všech 200 levelů přibližně se dvěma
výjimkami napoprvé zvládl i BEZ skladových pomůcek. Dostupnost pomůcek ve
slepém testu tedy jeho zkušenost s nízkou obtížností nevysvětluje.
Předchozí rozbor společných pěti průchodů není statistikou tohoto osobního
průchodu. Nezaměňovat dostupnost pomůcky a její skutečné použití.

Nový požadovaný směr: ztížit hru přibližně od levelu 20, HARD mají být
výrazně náročnější. Toto zadání nahrazuje dřívější odklad jakéhokoli
ladění obtížnosti; neznamená automatické převzetí konkrétních limitů
z botí simulace ani souhlas s plošným stejným procentem pro všech 200.

Uživatel chce naspořené pomůcky používat podle potřeby i opakovaně v jednom
pokusu, bez umělého limitu jednoho kusu stejného typu na level. Zmínil také
nákup pomůcek jako způsob překonání HARD úrovní. Konkrétní placené balíčky,
ceny ani platební integrace tím nejsou určené.

## Co dnes skutečně omezuje kód

`helperStock.js` není početní inventář: `readStock` uznává pouze přesnou
hodnotu 1, `spendStock` nastaví slot na 0 a `rewardStock` odmítne přidat
kus do neprázdného slotu. Hodnota 2 by se dnes načetla jako 0.
Není tedy pravda, že lze jen zvýšit počáteční zásobu bez dalších změn.

MiniGame již dovoluje použít několik různých pomůcek v jednom pokusu;
omezení není jeden libovolný booster za celou hru. Každý typ má ale jen
slot 0/1. Odděleně je dovoleno jediné reklamní doplnění pomůcky za pokus
(`adsUsed.helper`); to se nesmí zaměňovat za limit použití vlastního skladu.
Pulse/Nova na desce jsou jiný systém než skladové pomůcky.

## Navržené provedení

1. Nejdřív početní inventář a ověření opakovaného použití stejného typu.
   Zásoba N se odečítá po jednotlivých platných použitích. Pomůcky se
   aplikují postupně po dokončení animace, lze jich ale během pokusu použít
   tolik, kolik hráč vlastní. Bez spotřeby při zrušení nebo neplatném cíli.
   Zachovat staré 0/1 zásoby, oddělení účtů, reset a přenos mezi doménami;
   neobnovovat starter zásoby při aktualizaci. Reklamní frekvence samostatná.
2. Před placením navrhnout cloudové množství a serverové účtování,
   ověřování nákupů, duplicity odměn, souběh zařízení a refundy. Dnešní
   lokální inventář není dostatečný pro prodej. Navazuje na dřívější
   poznámku o malých balíčcích v roadmap-next.md.
3. Ladit obtížnost na variantě bez externích pomůcek; nálože vzniklé
   spojením a kaskádový bonus jsou součást běžných pravidel. Rozdělit
   běžné a HARD levely, nezačínat plošným krácením stejným procentem.
4. Zhruba prvních 20 levelů ponechat pro učení; dále vytvořit náročnější
   rytmus, HARD jako zřetelné vrcholy. Nezhoršovat dostupnost barev ani
   vyrábět blokované kryty. Konkrétní nové limity až po párování stejných
   seedů a cíleném hraní, nikoli mechanickém převzetí slabého simulátoru.
5. Evidovat novou verzi pravidel a variantu testu. Staré rozehrané slepé
   průchody drží své konfigurace; nepřepsat je změnou živého katalogu.

Produktové doporučení, nikoli už schválené platební pravidlo: HARD má
motivovat využít ušetřené nebo získané pomůcky a nákup může usnadnit postup,
ale zachovat vítěznou cestu i bez povinné platby a bez skrytého měnění
obtížnosti podle útraty. Monetizační parametry řešit zvlášť od chyb desky.

Stav tohoto zápisu: zadání a návrh postupu, kód obtížnosti ani inventáře
se tímto zápisem ještě nemění. Nákupy nejsou implementované.

## 2026-10-23 — Tabulka a konkrétní kandidáti limitů

Uživatel nyní požádal o rozbor tahů/obtížnosti od20 také podle Google Sheets.
Porovnání všech200řádků a návrh33cílených snížení jsou v
[difficulty-review-and-move-proposal-2026-10-23.md](difficulty-review-and-move-proposal-2026-10-23.md).
Tento rozbor postupuje nezávisle na početním inventáři; první testovací sada
má měnit jen limity, aby se dal vyhodnotit jejich účinek. Zatím nenastavuje
nové limity v herním kódu ani nemění zdrojový Sheet.
