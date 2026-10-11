import {spacedResonatorCovers} from './resonators.js';

export const returnCorridorTranslations={};
const text=(en,cs)=>(returnCorridorTranslations[en]=cs,en);
const title=text('The return corridor','Návratový koridor');
const labels=['Coolant charges','Energy modules','Navigation prisms','Air filter modules','Supply capsules','Living seeds'];
const csLabels=['chladicích náplní','energetických modulů','navigačních hranolů','filtračních modulů','zásobovacích kapslí','živých semen'];
const rows=[
 ['track',text('Recover the debris tracks','Obnov sledování trosek'),
  text('The rescue craft is holding outside the debris field. Restore the tracking console before we choose a route.','Záchranná loď čeká před polem trosek. Než vybereme trasu, obnovíme sledovací konzoli.'),
  text('The scanner separates drifting wreckage from the fixed service structures.','Skener rozlišuje unášené trosky od pevných servisních konstrukcí.'),
  text('A route, not a shortcut','Trasa, ne zkratka'),
  text('The new bearing leads to an old traffic station. Its last map is dangerously out of date: debris has drifted across the marked approach. The rescue pilot is waiting for a fresh survey.','Nové souřadnice vedou ke staré stanici řízení provozu. Její poslední mapa nebezpečně zastarala: trosky zasáhly vyznačený příletový směr. Pilot záchranné lodi čeká na nové měření.'),
  [[2,24],[1,24]],24,24,35],
 ['power',text('Isolate the damaged power bus','Odděl poškozenou napájecí větev'),
  text('A short circuit keeps shutting the station down. Isolate the damaged branch and restore power to the route controls.','Zkrat opakovaně vypíná stanici. Oddělíme poškozenou větev a obnovíme napájení řízení trasy.'),
  text('The control bus holds steady. The service mechanisms can move again.','Řídicí sběrnice má stabilní napájení. Servisní mechanismy lze znovu ovládat.'),
  text('An unfinished shutdown','Nedokončené vypnutí'),
  text('The station was shutting down when a broken cargo frame struck its outer rail. The automatic barrier stayed closed. Nobody sabotaged the corridor; nobody remained to clear it.','Při vypínání stanice narazil odlomený nákladový rám do vnější kolejnice. Automatická zábrana zůstala zavřená. Koridor nikdo nesabotoval; jen tu nezůstal nikdo, kdo by ho zprůchodnil.'),
  [[1,30],[0,21]],28,76,35],
 ['barrier',text('Retract the service barrier','Zasuň servisní zábranu'),
  text('Free the actuator safeguards and charge its regulator. Move the barrier into its recess, away from the drifting wreckage.','Uvolníme ochranné kryty pohonu a nabijeme jeho regulátor. Zábranu zasuneme do výklenku mimo dráhu trosek.'),
  text('The barrier is secured. A narrow passage opens beyond the station.','Zábrana je zajištěná. Za stanicí se otevírá úzký průchod.'),
  text('Enough room to pass','Dost místa k průletu'),
  text('The rescue craft reports an attached passenger module. A gap wide enough for our supply ship is not enough for them. I have added the module dimensions to the clearance check.','Záchranná loď hlásí připojený modul pro cestující. Průchod dost široký pro naši zásobovací loď jim nestačí. Do kontroly průletu jsem přidal rozměry modulu.'),
  [[3,24],[1,24]],30,24,59],
 ['beacons',text('Align the approach beacons','Srovnej příletové majáky'),
  text('Both beacon regulators must agree on the same path. Guide the rescue craft around the debris, not through it.','Oba regulátory majáků musí ukazovat stejnou trasu. Povedeme záchrannou loď kolem trosek, ne skrz ně.'),
  text('Two synchronized beacons mark the clear approach.','Dva sladěné majáky vyznačují volný příletový směr.'),
  text('Two lights in agreement','Dvě světla ve shodě'),
  text('The pilot can see both lights now. Their line passes clear of the wreckage and leaves room for the passenger module. We keep the craft waiting until the station can hold that line under load.','Pilot už vidí obě světla. Jejich spojnice míjí trosky a ponechává místo pro modul s cestujícími. Loď zatím čeká, než ověříme, že stanice udrží navádění i při zátěži.'),
  [[2,27],[4,21]],27,76,59],
 ['cooling',text('Stabilise the guidance cooling','Ustál chladicí okruh navádění'),
  text('The beacon amplifiers are heating up. Restore coolant flow before a long approach forces them offline.','Zesilovače majáků se přehřívají. Obnovíme proudění chladiva, aby se během dlouhého přiblížení nevypnuly.'),
  text('Cooling remains stable throughout the approach simulation.','Chlazení zůstává stabilní po celou simulaci příletu.'),
  text('No need to hurry','Není kam spěchat'),
  text('The crew asks whether they should accelerate. I send back the cooling test results and tell them to keep their planned speed. A safe route must stay safe for the entire crossing.','Posádka se ptá, zda má zrychlit. Posílám výsledky zkoušky chlazení a potvrzuji plánovanou rychlost. Bezpečná trasa musí vydržet po celou dobu průletu.'),
  [[0,33],[3,24]],31,24,78],
 ['clearance',text('Confirm the return window · HARD','Potvrď okno pro návrat · TĚŽKÉ'),
  text('Combine the live tracks, beacon timing and refuge readiness. Open the return window only when all three agree.','Spojíme aktuální dráhy trosek, časování majáků a připravenost Útočiště. Okno pro návrat otevřeme, až budou všechny tři podmínky splněné.'),
  text('The rescue craft clears the corridor. The refuge takes over its final approach.','Záchranná loď prolétla koridorem. Útočiště přebírá řízení závěrečného přiblížení.'),
  text('On the way home','Na cestě domů'),
  text('One by one, the rescue craft and its passenger module pass the last beacon. The pilot confirms everyone is aboard. I hand guidance over to the refuge and keep the corridor lit behind them. They are on the way home.','Záchranná loď a její modul postupně míjejí poslední maják. Pilot potvrzuje, že jsou všichni na palubě. Předávám navádění Útočišti a nechávám za nimi koridor rozsvícený. Jsou na cestě domů.'),
  [[2,27],[1,27],[4,24]],30,76,78],
];
const layouts=[
 {cols:7,rows:7,holes:[],covers:[],devices:[]},
 {cols:7,rows:8,holes:[0,6,49,55],covers:[9,12,37,40],devices:[]},
 {cols:7,rows:8,holes:[],covers:[8,12,43,47],devices:[{at:24,target:3}]},
 {cols:8,rows:8,holes:[0,7,56,63],covers:[],devices:[{at:26,target:3},{at:29,target:3}]},
 {cols:7,rows:8,holes:[0,1,5,6,49,50,54,55],covers:[16,18,30,32,44,46],devices:[]},
 {cols:8,rows:8,holes:[0,7,56,63],covers:[9,14,49],devices:[{at:26,target:4},{at:29,target:4}]},
];
const repairs=rows.map(([slug,name,thought,result,logTitle,logText,goals,moves,x,y],i)=>{
 const {cols,rows:height,holes,covers,devices:resonators}=layouts[i];
 const level={cols,rows:height,types:6,mask:Array.from({length:cols*height},(_,n)=>!holes.includes(n)&&!resonators.some(r=>r.at===n))};
 const ice=spacedResonatorCovers(covers,resonators,level);
 return {id:'return-corridor-'+slug,name,lesson:name,thought,result,room:title,action:text('Restore the return route','Obnov návratovou trasu'),icon:'⌁',x,y,moves,tileSet:'refuge',level,ice,resonators,
  goals:goals.map(([type,target])=>({type,target,label:labels[type]})),target:goals.reduce((n,g)=>n+g[1],0),targetType:null,
  objective:text('Collect '+goals.map(([type,n])=>n+' '+labels[type].toLowerCase()).join(', ')+'.'+(ice.length?' Break all protective covers.':'')+(resonators.length?' Charge every resonator.':''),'Nasbírej '+goals.map(([type,n])=>n+' '+csLabels[type]).join(', ')+'.'+(ice.length?' Rozbij všechny ochranné kryty.':'')+(resonators.length?' Nabij všechny rezonátory.':''))};
});
export const returnCorridor={title,key:'returnCorridorCompleted',system:'refuge-medical',chapter:text('CHAPTER 10 / THE WAY HOME','KAPITOLA 10 / CESTA DOMŮ'),hotspotOffset:0,image:'return-corridor',restoredImage:'return-corridor-restored',repairs,
 logs:rows.map((r,i)=>({id:repairs[i].id+'-log',repair:repairs[i].id,title:r[4],text:r[5],source:text('Return corridor log','Deník návratového koridoru'),time:title,unlockAt:156+i})),
 complete:text('The corridor is clear. The rescue craft is approaching the refuge.','Koridor je volný. Záchranná loď se blíží k Útočišti.'),nextLabel:text('Return to the refuge →','Zpět do Útočiště →'),
 clips:repairs.map(()=> 'inset(0)'),restorationMasks:repairs.map(r=>'radial-gradient(ellipse 34% 24% at '+r.x+'% '+r.y+'%, #000 35%, transparent 100%)')};
text('Open the return corridor →','Otevři návratový koridor →');
