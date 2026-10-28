import {Capacitor} from '@capacitor/core';
import {AdMob,AdmobConsentStatus,RewardAdPluginEvents} from '@capacitor-community/admob';
import {showRewarded} from './androidRewardFlow.js';
import adUnits from './androidAdUnits.json' with {type:'json'};
import {requestAndroidConsent,openAndroidPrivacy} from './androidConsentFlow.js';
import {onlineServicesAllowed} from './androidAudience.js';

// This initial Android build is deliberately test-only. Production IDs require a separate release review.
const testRewardId=adUnits.test.rewardedId;
let initialized=false;
export async function androidMovesAd(){
 if(!onlineServicesAllowed('android'))throw new Error('Local play: ads disabled');
 if(Capacitor.getPlatform()!=='android')throw new Error('Native Android required');
 const consent=await requestAndroidConsent(AdMob,AdmobConsentStatus.REQUIRED);
 if(!consent.canRequestAds)throw new Error('Ads unavailable');
 if(!initialized){await AdMob.initialize();initialized=true;}
 return showRewarded(AdMob,RewardAdPluginEvents,testRewardId);
}
export async function androidPrivacy(){
 if(!onlineServicesAllowed('android'))throw new Error('Local play: ads disabled');
 if(Capacitor.getPlatform()!=='android')throw new Error('Native Android required');
 await openAndroidPrivacy(AdMob,AdmobConsentStatus.REQUIRED);
}
