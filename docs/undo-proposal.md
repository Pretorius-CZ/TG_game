# Návrh: Krok zpět — 2026-10-23

Uživatel navrhl vrácení zbrklého tahu, případně za dobrovolnou reklamu.
Jde o námět k úvaze, nikoli o požadavek ihned implementovat nebo o schválení
konkrétního počtu použití a ceny. Navazuje na návrh obtížnosti a početního
inventáře v difficulty-and-helper-stock-next.md.

## Navržené hráčské chování

- Vrátit poslední platný běžný tah, včetně aktivace nálože za tah,
  až po dokončení všech kaskád a animací. Ne pouze poslední animaci.
- Obnovit desku, kryty, nabití rezonátorů, sběr cílů, počet tahů i nálože
  a případný kaskádový bonus do stavu před akcí. Obnova desky bez tahu
  vyvolaná tímto tahem patří do stejné vratné akce.
- Umožnit nápravu posledního tahu i na panelu vyčerpaných tahů, než hráč
  pokus opustí nebo zvolí restart. První verzi omezit na jediný krok,
  navrženě jedno použití na pokus; žádný řetěz návratů až na začátek.
- Návrh motivace: dobrovolná odměňovaná reklama. Zda nabídnout první
  použití zdarma, nebo zavést naspořitelné položky, zatím rozhodnout.
- Při nedostupné/nedokončené reklamě se stav ani právo na vrácení nemění.
  Dostupnost reklam řešit podle platformy, bez předstírání odměny.
- Zatím nevracet spotřebovanou skladovou pomůcku, reklamu, nákup či
  potvrzenou opravu. Zpětné vracení pomůcek by vyžadovalo samostatnou
  transakční logiku; UI musí jasně říct, jakou akci lze právě vrátit.

## Důležité hranice provedení

- Nevracet již uloženou výhru, hvězdy, příběhovou odměnu nebo cloudový
  postup. Dostupnost ukončit před potvrzenou výhrou; automatické uložení
  lepších replay hvězd zohlednit, aby nevznikl duplicitní výnos.
- Prosté obnovení kamenů nestačí. Vrátit také stav generátoru/doplňování
  a ochrany proti nedostatku barev, aby opakování stejného tahu ze stejného
  obnoveného stavu nedávalo další náhodný pokus o výhodnější kaskádu.
  Současná hra používá Math.random; deterministické opakování není hotové.
- Energie zůstává rezervovaná za rozehraný pokus; undo ji nerozmnožuje.
  Na panelu prohry bezpečně znovu aktivovat právě jednu refundovací
  možnost pokusu bez druhého čistého odečtu, podobně jako pokračování.
- Vratný snímek uchovávat jen pro konkrétní pokus; zneplatnit při retry,
  změně úrovně a účtu. Nepřebírat starý snímek po reloadu.
- Logovat použití undo samostatně do výsledku, odděleně od skladových
  pomůcek, bonusových tahů a běžného počtu tahů pro ladění obtížnosti.
  Zachovat i počet skutečně provedených akcí, který undo nesmaže.
- Nezaměňovat snímek pro undo s automatickým ukládáním rozehrané hry.

Před implementací stanovit přesné dostupné akce a počet použití. Pro
první variantu doporučeno malé jasné pravidlo, ne neomezené přetáčení
všech účinků a transakcí. Kód ani reklamní integrace zatím neměněné.
