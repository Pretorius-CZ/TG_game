// Short stops deliberately alternate interiors, gardens and beacon fieldwork.
const rows=[
 ['water-recovery','Restore the water recovery loop','Obnov okruh recyklace vody','Connect the filters before filling the crew tanks.','Než naplníme nádrže posádky, připojíme filtry.','Clean water now returns to the reserve instead of leaving with waste heat.','Čistá voda se vrací do zásoby místo odtoku s odpadním teplem.',27,[4,5],24,[],4,'corners'],
 ['water-reserve','Test the reserve feed','Ověř přívod ze zásoby','Switch between the two pumps without interrupting the drinking-water line.','Přepni mezi čerpadly bez přerušení přívodu pitné vody.','The reserve can supply the living module during filter maintenance.','Zásoba napájí obytný modul i při údržbě filtrů.',25,[0,4],24,[2,2],0,'wide'],
 ['habitat-pressure','Seal the habitat module','Utěsni obytný modul','Check the new seals before opening the sleeping compartment.','Než otevřeme spací oddíl, zkontrolujeme nová těsnění.','The habitat holds pressure independently of the workshop.','Obytný modul drží tlak nezávisle na dílně.',28,[3,5],24,[],4,'narrow'],
 ['habitat-bunks','Prepare the quiet bunks','Připrav klidná lůžka','Keep the sleeping circuit separate from noisy maintenance equipment.','Odděl napájení lůžek od hlučného servisního vybavení.','A crew on a long watch will have somewhere quiet to rest.','Posádka na dlouhé službě získává klidné místo k odpočinku.',27,[2,5],24,[2],4,'waist'],
 ['habitat-ready','Approve the crew module · HARD','Schval obytný modul · TĚŽKÉ','Run the air, water and reserve checks before marking the module ready.','Než modul označíme za připravený, ověříme vzduch, vodu a zálohu.','The living module is ready; the next delivery is for the nursery.','Obytný modul je připravený. Další zásilka míří do pěstírny.',28,[1,4],27,[2,2],4,'corners'],
 ['nursery-water','Feed the seedling cabinets','Zavlaž sadbové skříně','Give the young plants a gentle, even supply of recovered water.','Zajisti mladým rostlinám jemný a rovnoměrný přívod recyklované vody.','The first seedlings settle into their new nursery.','První sazenice se ujímají v nové pěstírně.',26,[4],33,[],4,'wide'],
 ['nursery-light','Balance the nursery lights','Vyvaž světla pěstírny','Light the cabinets in sequence so the supply stays stable.','Rozsviť skříně postupně, aby napájení zůstalo stabilní.','The caretaker confirms that the seedlings can move to the courtyard.','Správce potvrzuje, že sazenice mohou do dvora.',27,[0,2],24,[2,2],0,'narrow'],
 ['courtyard-beds','Connect the planting beds','Propoj záhony ve dvoře','Open the irrigation channels around the new walking path.','Otevři zavlažovací kanály kolem nové pěšiny.','Water reaches the beds without crossing the pedestrian walkway.','Voda proudí do záhonů mimo pěší trasu.',27,[4,5],27,[],6,'steps'],
 ['courtyard-canopy','Adjust the glass canopy','Seřiď skleněnou klenbu','Balance sunlight and shade before the plants leave their cabinets.','Než rostliny opustí skříně, vyvaž světlo a stín.','The courtyard now has a steady day cycle beneath its glass dome.','Dvůr pod skleněnou klenbou získává stálý denní rytmus.',25,[1,2],24,[2,2],0,'waist'],
 ['courtyard-ready','Open the living courtyard · HARD','Otevři živý dvůr · TĚŽKÉ','Complete the shared lighting and water checks before opening the path.','Před otevřením pěšiny dokonči společnou kontrolu světla a vody.','The station has a place to pause. Our next stop lies beyond its windows.','Stanice má místo k zastavení. Další zastávka leží za jejími okny.',25,[0,4,5],24,[3,3,2],0,'wide'],
 ['near-dock-clamps','Secure the beacon landing dock','Zajisti dok blízkého majáku','Anchor the supply cradle before unloading the replacement modules.','Než vyložíme náhradní moduly, ukotvíme zásobovací plošinu.','The dock can receive small service craft without blocking the beacon.','Dok přijme malé servisní lodě bez zablokování majáku.',27,[3,5],27,[],4,'corners'],
 ['near-dock-power','Power the dock service line','Napájej servisní linku doku','Bring the dock online while the beacon keeps its separate supply.','Zapni dok a ponech majáku vlastní napájení.','We can service the dock without silencing the route marker above it.','Údržba doku neumlčí směrový bod nad ním.',26,[0,1],27,[2,3],0,'steps'],
 ['near-mast-segments','Assemble the beacon mast','Sestav stožár majáku','Join the prefabricated mast sections above the landing platform.','Propoj připravené části stožáru nad přistávací plošinou.','The new mast clears the nearby rock and points toward the next station.','Nový stožár přesahuje okolní skálu a míří k další stanici.',27,[0,2],24,[],4,'narrow'],
 ['near-mast-optics','Focus the outbound lens','Zaostři výstupní čočku','Align the optical path without disturbing the working return beam.','Srovnej optickou trasu bez narušení funkčního zpátečního paprsku.','A narrow test beam reaches the far anchorage.','Úzký zkušební paprsek dosahuje vzdáleného kotviště.',29,[1,2],27,[2,2],4,'waist'],
 ['near-mast-link','Confirm the first branch · HARD','Potvrď první odbočku · TĚŽKÉ','Pass the check signal through the mast and confirm its return.','Proveď kontrolní signál stožárem a potvrď jeho návrat.','The near beacon is live. We can follow its new branch to the far marker.','Blízký maják vysílá. Nová odbočka nás dovede ke vzdálené značce.',26,[0,3],30,[2,2,2],0,'corners'],
 ['far-approach-scan','Survey the far approach','Zaměř vzdálený přílet','Mark a clear path around the moon before approaching the old service tower.','Než přiletíme ke staré servisní věži, vyznač čistou cestu kolem měsíce.','The approach avoids the tower debris and leaves room for the return turn.','Přílet míjí úlomky věže a nechává místo pro zpáteční oblouk.',27,[1,3],24,[],4,'steps'],
 ['far-approach-guides','Restore the approach guides','Obnov příletové značky','Light the two approach markers in order from open space toward the tower.','Rozsviť obě příletové značky od volného prostoru směrem k věži.','A service ship can now find the tower without relying on stored coordinates.','Servisní loď najde věž i bez uložených souřadnic.',26,[0,2],27,[2,2],0,'wide'],
 ['far-core-cooling','Restart the beacon cooling','Obnov chlazení majáku','Clear the covered cooling controls before restoring the transmitter.','Před obnovou vysílače uvolni zakryté ovládání chlazení.','The transmitter can run continuously instead of shutting down between calls.','Vysílač může pracovat trvale místo vypínání mezi zprávami.',29,[3,4],27,[],6,'narrow'],
 ['far-core-memory','Separate the live channel','Odděl živý kanál','Keep the live route distinct from the maintenance tower records.','Odděl živou trasu od záznamů servisní věže.','The archive stays intact while the new channel carries current traffic.','Archiv zůstává zachovaný a nový kanál přenáší aktuální provoz.',30,[2,5],27,[2,3],4,'waist'],
 ['far-core-link','Link the far beacon · HARD','Propoj vzdálený maják · TĚŽKÉ','Finish the return-route checks and hand the working link to the operator.','Dokonči kontrolu zpáteční trasy a předej funkční spoj operátorovi.','Both beacons answer live. The network is ready for its next scheduled delivery.','Oba majáky živě odpovídají. Síť je připravená na další plánovanou dodávku.',27,[0,1,4],24,[2,2,2],4,'wide'],
];
export const networkStopDefinitions=[
 ['network-water','networkWaterCompleted','The water workshop',2,[[21,52],[78,65]],'The reserve feed is stable. Continue to the crew habitat.'],
 ['network-quarters','networkQuartersCompleted','The crew habitat',3,[[50,55],[15,60],[83,50]],'The crew habitat is ready. Deliver the next modules to the nursery.'],
 ['network-nursery','networkNurseryCompleted','The seedling nursery',2,[[21,52],[78,65]],'The seedlings are ready for the living courtyard.'],
 ['network-courtyard','networkCourtyardCompleted','The living courtyard',3,[[20,57],[82,38],[50,65]],'The courtyard is open. The next delivery leaves the station.'],
 ['network-beacon-dock','networkNearDockCompleted','The near beacon dock',2,[[21,52],[78,65]],'The service dock is secure. Continue up to the beacon mast.'],
 ['network-beacon-mast','networkNearMastCompleted','The near beacon mast',3,[[15,45],[82,51],[50,73]],'The first branch is live. Follow it to the far approach.'],
 ['network-far-approach','networkFarApproachCompleted','The far approach',2,[[21,52],[78,65]],'The approach is marked. Enter the service tower.'],
 ['network-far-core','networkFarCoreCompleted','The far beacon tower',3,[[18,53],[85,64],[50,69]],'Both beacons are linked. More deliveries and destinations are being prepared.'],
].map(([scene,key,title,total,positions,complete])=>({scene,key,title,total,positions,complete}));

export function makeNetworkContinuation(tileNames){
 return rows.map(([slug,name,csName,thought,csThought,result,csResult,moves,colors,target,requirements,coverCount,shape],i)=>{
  const cols=shape==='wide'?8:shape==='narrow'?6:7,rows=shape==='wide'?7:8;
  const open=at=>{const x=at%cols,y=Math.floor(at/cols);return !((shape==='corners'||shape==='narrow')&&(x===0||x===cols-1)&&(y===0||y===rows-1)||shape==='waist'&&[3,4].includes(y)&&(x===0||x===cols-1)||shape==='steps'&&(y<2&&x<2||y>=rows-2&&x>=cols-2));};
  const nodePositions=[2*cols+2,4*cols+cols-3,6*cols+2];
  const routeTargets=shape==='narrow'&&requirements.length?[2]:requirements.slice(0,2).map((n,j)=>name.includes('HARD')?Math.min(n,2):Math.min(n,j===i%2?1:2));
  const nodes=routeTargets.map((target,n)=>({at:nodePositions[n],target}));
  const mask=Array.from({length:cols*rows},(_,at)=>open(at)&&!nodes.some(n=>n.at===at));
  const candidates=Array.from({length:cols*rows},(_,at)=>at).filter(at=>mask[at]&&at%cols>0&&at%cols<cols-1);
  const coverLimit=nodes.length>=2?Math.min(3,coverCount):coverCount;
  const distance=(a,b)=>Math.max(Math.abs(a%cols-b%cols),Math.abs(Math.floor(a/cols)-Math.floor(b/cols)));
  const preferred=Array.from({length:coverLimit},(_,n)=>candidates[Math.floor((n+.5)*candidates.length/coverLimit)]);
  const ice=[];
  for(const at of [...new Set([...preferred,...candidates])]){
   if(ice.length===coverLimit)break;
   if(nodes.every(node=>distance(at,node.at)>1)&&ice.every(other=>distance(at,other)>1))ice.push(at);
  }
  if(ice.length!==coverLimit)throw Error('Not enough separated cover cells: '+slug);
  return {id:'network-'+slug,number:211+i,name,csName,thought,csThought,result,csResult,moves,nodes,ice,hard:name.includes('HARD'),goals:colors.map(type=>({type,target,label:tileNames[type]})),level:{cols,rows,types:6,mask}};
 });
}
