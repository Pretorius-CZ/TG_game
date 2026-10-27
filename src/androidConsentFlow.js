export async function requestAndroidConsent(admob,requiredStatus){
 let info=await admob.requestConsentInfo();
 if(info.isConsentFormAvailable&&info.status===requiredStatus)info=await admob.showConsentForm();
 return info;
}

export async function openAndroidPrivacy(admob,requiredStatus){
 const info=await admob.requestConsentInfo();
 // A new installation needs the initial form before it can reopen privacy options.
 if(info.isConsentFormAvailable&&info.status===requiredStatus){
  await admob.showConsentForm();
  return;
 }
 await admob.showPrivacyOptionsForm();
}
