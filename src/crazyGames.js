import {crazyGames} from './platform.js';
let sdk;
export async function initializeCrazyGames(){
 if(!crazyGames)return;
 sdk=window.CrazyGames?.SDK;
 if(!sdk)throw new Error('CrazyGames SDK did not load. Reload the preview.');
 await sdk.init();
}
export function reportGameplay(playing){
 if(!crazyGames||!sdk)return;
 try{playing?sdk.game.gameplayStart():sdk.game.gameplayStop();}catch(error){console.warn('CrazyGames gameplay event failed',error);}
}

export function crazyGamesLanguage(){try{return /^cs(?:[-_]|$)/i.test(sdk?.user?.systemInfo?.locale||'')?'cs':'en';}catch{return 'en';}}
