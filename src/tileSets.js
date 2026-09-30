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
export const tileSetFor=repair=>repair.tileSet==='research'?research:repair.tileSet==='elysium'?elysium:repair.tileSet==='aster'?aster:standard;
