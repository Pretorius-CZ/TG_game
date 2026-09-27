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
export const tileSetFor=repair=>repair.tileSet==='elysium'?elysium:repair.tileSet==='aster'?aster:standard;
