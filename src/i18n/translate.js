import catalog from './cs.json' with {type:'json'};
export const LANGUAGE_KEY='to-the-stars-language';
export const validLanguage=value=>value==='cs'?'cs':'en';
const folded=new Map(Object.entries(catalog).map(([a,b])=>[a.toLowerCase(),b]));
const tokens={ 'fuel cells':'palivových článků','energy crystals':'energetických krystalů','blue comets':'modrých komet','red energy orbs':'červených energetických koulí','energy orbs':'energetických koulí',crystals:'krystalů',comets:'komet',asteroids:'asteroidů',stars:'hvězd',pieces:'kamenů' };
const sourceNames={'After landing':'Po přistání','Before landing':'Před přistáním','During landing':'Během přistání',recovered:'obnoveno','signal acquired':'signál zachycen',Survey:'Průzkum',Restoration:'Obnova',Arrival:'Přílet','Two bearings':'Dva směry','One destination':'Jeden cíl'};
export const missingTranslations=new Set();
export function translate(value,language='en'){
 if(language!=='cs'||typeof value!=='string'||!value.trim())return value;
 const key=value.trim();
 let result=catalog[key];
 const apply=s=>value.slice(0,value.indexOf(key))+s+value.slice(value.indexOf(key)+key.length);
 if(result!==undefined)return apply(result);
 const lower=folded.get(key.toLowerCase());if(lower!==undefined)return apply(key===key.toUpperCase()?lower.toLocaleUpperCase('cs'):lower);
 const tr=s=>translate(s,'cs');
 // Objectives keep their live numeric values, including future balance edits.
 if(/^(Match|Collect|Break) /.test(key)){
  const quantities=[...key.matchAll(/(\d+) (?:any )?(fuel cells|energy crystals|blue comets|red energy orbs|energy orbs|crystals|comets|asteroids|stars|pieces)/g)];
  if(quantities.length){let out='Nasbírej '+quantities.map(m=>m[1]+' '+tokens[m[2]]).join(' a ')+'.';
   const covers=key.match(/(?:all |release all |Break all )(\d+) protective covers/);if(covers)out+=' Rozbij všechny ochranné kryty ('+covers[1]+').';else if(/covers?|cover\./.test(key))out+=' Rozbij všechny ochranné kryty.';
   const moves=key.match(/in (\d+) moves/);if(moves)out+=' Limit: '+moves[1]+' tahů.';
   if(key.includes('Red energy orbs now'))out+=' Na desce jsou nyní také červené energetické koule.';
   return apply(out);
  }
 }
 let m;
 if((m=key.match(/^Show a hint, (\d+) remaining$/)))return apply('Nápověda, zbývá '+m[1]);
 if((m=key.match(/^(\d+) moves left$/)))return apply('Zbývající tahy: '+m[1]);
 if((m=key.match(/^(\d+) of 5 energy charges(?:, next charge in (.+))?$/)))return apply(m[1]+' z 5 článků energie'+(m[2]?', další za '+m[2]:''));
 if((m=key.match(/^RECHARGE (.+)$/)))return apply('OBNOVA '+m[1]);
 if((m=key.match(/^(?:Covered )?(.+), row (\d+), column (\d+)$/)))return apply((key.startsWith('Covered ')?'Pod krytem: ':'')+tr(m[1])+', řádek '+m[2]+', sloupec '+m[3]);
 if((m=key.match(/^(\d+) covers left\. /)))return apply('Zbývající kryty: '+m[1]+'. Spoj 3 stejné kameny včetně krytého. Kryt praskne a kámen lze sebrat dalším spojením.');
 if((m=key.match(/^· (\d+) protective covers$/)))return apply('· ochranné kryty: '+m[1]);
 if((m=key.match(/^Continue to (.+)$/)))return apply('Pokračovat: '+tr(m[1]));
 if((m=key.match(/^Next: (.+) · Follow the marked door\.$/)))return apply('Dále: '+tr(m[1])+' · Pokračuj označenými dveřmi.');
 if((m=key.match(/^Next: (.+)\. Follow the marked door\.$/)))return apply('Dále: '+tr(m[1])+'. Pokračuj označenými dveřmi.');
 if((m=key.match(/^Inspect (.+?)( — repair fuel system in engine room first)?$/)))return apply('Prohlédnout: '+tr(m[1])+(m[2]?' — nejdřív oprav palivový systém ve strojovně':''));
 if((m=key.match(/^Requires (.+)$/)))return apply('Vyžaduje: '+tr(m[1]));
 if((m=key.match(/^First restore (.+)\.$/)))return apply('Nejdřív oprav: '+tr(m[1])+'.');
 if((m=key.match(/^(\d+)\/4 systems online · Tap the highlighted device\.$/)))return apply(m[1]+'/4 systémů v provozu · Klepni na označené zařízení.');
 if((m=key.match(/^(\d+)\/6 tasks · Follow the signal into the outpost\.$/)))return apply(m[1]+'/6 úkolů · Sleduj signál do stanice.');
 if((m=key.match(/^Explore · (.+)$/)))return apply('Prozkoumat · '+m[1]);
 if((m=key.match(/^Restore Haven · (.+)$/)))return apply('Obnovit Haven · '+m[1]);
 if((m=key.match(/^TAP TO CONNECT · (.+)$/)))return apply('KLEPNI PRO SPOJENÍ · '+m[1]);
 if(key.startsWith('CHAPTER '))return apply(key.replace(/^CHAPTER (\d+)/,'KAPITOLA $1').replace(/STAGE 01 — COCKPIT/,'KOKPIT').split(' / ').map((x,i)=>i?tr(x):x).join(' / '));
 if(key==='/ REPAIR LESSON')return apply('/ OPRAVA');
 if(key.includes(' / ')||/^(.*) \/ (Survey|Restoration) \d+$/.test(key))return apply(key.split(' / ').map(x=>sourceNames[x]??x.replace(/^(Survey|Restoration) (\d+)$/,(_,a,n)=>sourceNames[a]+' '+n)).map(x=>catalog[x]??x.replace(/^(.+) (\d+)$/,(_,a,n)=>(catalog[a]??a)+' '+n)).join(' / '));
 if((m=key.match(/^(✓ |↻ )(.+)$/)))return apply(m[1]+tr(m[2]));
 if((m=key.match(/^(.+?)( ↻| →| ↗|\.)$/))){const translated=tr(m[1]);if(translated!==m[1])return apply(translated+m[2]);}
 // Proper names, counts and punctuation intentionally remain unchanged.
 if(!/^[\d\s/·:×?→↗↻✓✦▤▦◎ϟ◇▣⟶—+.-]*$/.test(key)&&!['TO THE STARS','Haven','Kepler Reach','Aster Veil','KEPLER REACH','ASTER VEIL','Pulse','Nova','English','Čeština','EN','CZ','PILOT'].includes(key)&&!key.includes('@'))missingTranslations.add(key);
 return value;
}
