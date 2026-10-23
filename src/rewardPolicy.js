export function rewardAllowed(mode,kind){
 return mode!=='android'||kind==='moves'||kind==='undo';
}
