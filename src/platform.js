export const crazyGames = import.meta.env.MODE === 'crazygames';
export const android = import.meta.env.MODE === 'android';
import {rewardAllowed} from './rewardPolicy.js';
import {onlineServicesAllowed} from './androidAudience.js';
export const rewardAvailable=kind=>onlineServicesAllowed(import.meta.env.MODE)&&rewardAllowed(import.meta.env.MODE,kind);
