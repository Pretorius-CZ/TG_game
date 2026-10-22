import {crazyGames} from './platform.js';
import {validLanguage} from './i18n/locales.js';
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

export function crazyGamesLanguage(){try{return validLanguage(sdk?.user?.systemInfo?.locale);}catch{return 'en';}}
