const standard={
 names:['Fuel cell','Energy crystal','Blue comet','Asteroid','Star','Energy orb'],
 sprites:['fuel','crystal','comet','asteroid','star','orb'],
};
const aster={
 names:['Fuel cell','Energy crystal','Blue comet','Alien ore','Star','Biological core'],
 sprites:['fuel','crystal','comet','aster-ore','star','aster-bio'],
};
export const tileSetFor=repair=>repair.tileSet==='aster'?aster:standard;
