# Mobilní pomůcky — grafický návrh

2026-09-28: interaktivní prototyp `public/prototypes/boosters.html`,
přehled tří stavů `boosters-board.html` a snímek `boosters-overview.png`.
Jde pouze o design, bez změny skutečné minihry, ukládání, reklam či plateb.

Uživatel kladně hodnotí nové cíle: ikona sbíraného předmětu, živé číslo
a krátká lišta vedle sebe. Chce zachovat tuto podobu při zapojení do hry.

Uživatel odmítl schování pomůcek v kufříku. Aktuální návrh:

- Pět stále viditelných dlaždiček pod deskou: Laser, Míchat, Výměna,
  Paprsek, EMP. Ikona, krátký název a vlastní počet nebo značka reklamy.
- Nápověda nahoře označená **Hint**, nikoli pouze otazníkem.
- Kliknutí na dlaždici otevře krátký detail jediné pomůcky s potvrzením.
  Po potvrzení se detail zavře a hráč označí cíl na celé desce.
- Výzva k označení cíle nahrazuje běžný řádek instrukce; deska při
  přechodu do zaměření nemění rozměry ani polohu.
- Na malém telefonu kompaktnější hlavička; otestováno320×568 a390×844,
  celá ukázková deska7×8 i všech5pomůcek bez posouvání stránky.

Zobrazené zásoby a limit2pomůcek jsou ukázkový návrh pravidel.
Reklama je v prototypu nedostupná a jako odměna se nesimuluje.
Napojení do skutečného MiniGame a implementace účinků jsou další práce.

## Zapojení do hry — 2026-09-28
Pět pomůcek je nyní přímo v MiniGame pod deskou. Testovací zásoba je
1 kus každé pomůcky na pokus (retry/nový level ji obnoví), bez reklam,
plateb a bez odečtu tahu. +5 tahů zásobu neobnovuje. Laser zasáhne jedno
pole, promíchání zachová kameny a kryty, výměna prohodí dvě sousední
odkryté dlaždice i bez shody, paprsek zasáhne řádek a EMP oblast 3×3.
Zásah krytu jej pouze odstraní; krytý kámen se nesbírá. Zasažené nálože
řetězí výbuchy. Kaskády, cíle a výhra používají společné vyhodnocení.
Ikony jsou prozatímní. Zásoba není účtový inventář a neukládá se do cloudu.
Ověřeno použití všech pěti bez odečtu tahu a mobilní rozložení 320×568.

### Trvalá spotřeba (nahrazuje zásobu na pokus)
Zásoba 1 kusu od každého typu je společná napříč levely a retry ji
neobnovuje. Ukládá se do localStorage odděleně pro hosta a jednotlivé
účty; nový plný reset hry má novou zásobu. Spotřeba se zapíše před účinkem,
Web Locks brání dvojí spotřebě ve více kartách. Zrušení cílení nic neodebere.
Cloudový inventář a přenos mezi zařízeními zatím nejsou implementované.
