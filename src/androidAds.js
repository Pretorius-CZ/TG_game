import {Capacitor} from '@capacitor/core';
import {AdMob,AdmobConsentStatus,RewardAdPluginEvents} from '@capacitor-community/admob';
import {showRewarded} from './androidRewardFlow.js';
import adUnits from './androidAdUnits.json' with {type:'json'};

// This initial Android build is deliberately test-only. Production IDs require a separate release review.
const testRewardId=adUnits.test.rewardedId;
let initialized=false;
export async function androidMovesAd(){
 if(Capacitor.getPlatform()!=='android')throw new Error('Native Android required');
 let consent=await AdMob.requestConsentInfo();
 if(consent.isConsentFormAvailable&&consent.status===AdmobConsentStatus.REQUIRED)consent=await AdMob.showConsentForm();
 if(!consent.canRequestAds)throw new Error('Ads unavailable');
 if(!initialized){await AdMob.initialize();initialized=true;}
 return showRewarded(AdMob,RewardAdPluginEvents,testRewardId);
}
export async function androidPrivacy(){
 if(Capacitor.getPlatform()!=='android')throw new Error('Native Android required');
 await AdMob.requestConsentInfo();
 await AdMob.showPrivacyOptionsForm();
}
