const standard={
 names:['Fuel cell','Energy crystal','Blue comet','Asteroid','Star','Energy orb'],
 sprites:['fuel','crystal','comet','asteroid','star','orb'],
};
const aster={
 names:['Fuel cell','Energy crystal','Blue comet','Alien ore','Star','Biological core'],
 sprites:['fuel','crystal','comet','aster-ore','star','aster-bio'],
};
const elysium={
 names:['Coolant charge','Energy module','Data chip','Alloy component','Light cell','Biocapsule'],
 sprites:['elysium-coolant','elysium-power','elysium-chip','elysium-alloy','elysium-light','elysium-bio'],
};
const research={names:['Coolant charge','Energy module','Navigation prism','Alloy component','Research sample','Living seed'],sprites:['elysium-coolant','elysium-power','research-chart','elysium-alloy','research-sample','research-seed']};
const night={names:['Coolant charge','Energy module','Navigation prism','Root node','Luminous pollen','Living seed'],sprites:['elysium-coolant','elysium-power','research-chart','night-root','night-pollen','research-seed']};
const nightPollen={...research,names:research.names.map((name,i)=>i===4?'Luminous pollen':name),sprites:research.sprites.map((sprite,i)=>i===4?'night-pollen':sprite)};
const refugeFilter={...night,names:night.names.map((name,i)=>i===3?'Air filter module':name),sprites:night.sprites.map((sprite,i)=>i===3?'refuge-filter':sprite)};
const refuge={...refugeFilter,names:refugeFilter.names.map((name,i)=>i===4?'Supply capsule':name),sprites:refugeFilter.sprites.map((sprite,i)=>i===4?'refuge-supply':sprite)};
export const tileSetFor=repair=>repair.tileSet==='refuge'?refuge:repair.tileSet==='refuge-filter'?refugeFilter:repair.tileSet==='night-pollen'?nightPollen:repair.tileSet==='night'?night:repair.tileSet==='research'?research:repair.tileSet==='elysium'?elysium:repair.tileSet==='aster'?aster:standard;
