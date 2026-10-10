export const crazyGames = import.meta.env.MODE === 'crazygames';

export const android = import.meta.env.MODE === 'android';
import {rewardAllowed} from './rewardPolicy.js';
export const rewardAvailable = kind => rewardAllowed(import.meta.env.MODE,kind);
