import {asterComplete} from './aster.js';

export const elysiumArrivalPanels=[
 {image:'elysium-arrival-dust',title:'Beyond the dust',caption:'The recovered coordinates lead into a cloud of dust. Somewhere ahead, the signal is still calling.'},
 {image:'elysium-arrival-city',title:'Not a base. A city.',caption:'Elysium emerges from the darkness. Our ship is a speck beside its immense ring. The station is silent.'},
 {image:'elysium-arrival-dock',title:'One light answers',caption:'A single guidance beacon wakes at the dock. Someone left a way in. We follow its light.'},
];

// Completing or skipping the comic grants the same existing arrival milestone.
export function completeElysiumArrival(progress){
 return asterComplete(progress)&&progress.elysiumRouteCompleted===1
  ?{...progress,elysiumArrival:1,scene:'elysium'}:progress;
}

export const elysiumArrivalTranslations={
 'Approaching Elysium':'Přílet k Elysiu',
 'CHAPTER 04 / ELYSIUM':'KAPITOLA 04 / ELYSIUM',
 'Beyond the dust':'Za prachovým závojem',
 'The recovered coordinates lead into a cloud of dust. Somewhere ahead, the signal is still calling.':'Obnovené souřadnice vedou do prachového oblaku. Někde před námi se stále ozývá signál.',
 'Not a base. A city.':'To není základna. Je to město.',
 'Elysium emerges from the darkness. Our ship is a speck beside its immense ring. The station is silent.':'Elysium se vynořuje ze tmy. Vedle obrovského prstence je naše loď jen tečkou. Stanice mlčí.',
 'One light answers':'Jedno světlo odpovídá',
 'A single guidance beacon wakes at the dock. Someone left a way in. We follow its light.':'V doku se rozsvítí jediný naváděcí maják. Někdo tu nechal cestu dovnitř. Sledujeme jeho světlo.',
 'Enter Elysium':'Vstoupit do Elysia',
 'Replay the arrival':'Přehrát přílet',
};
