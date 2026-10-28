export const audienceKey='beyond-signal-android-audience-v1';
const groups=new Set(['minor','adult','private']);
let localOnlyForThisSession=false;
export function forceLocalPlay(){localOnlyForThisSession=true;}
export function readAudience(storage=globalThis.localStorage){
 try{const value=JSON.parse(storage?.getItem(audienceKey));return value?.version===1&&groups.has(value.group)?value.group:null;}catch{return null;}
}
export function saveAudience(group,storage=globalThis.localStorage){
 if(!groups.has(group))throw Error('Invalid audience group');
 storage.setItem(audienceKey,JSON.stringify({version:1,group}));
}
// Unknown age and private play never authorize online services. Web behavior is unchanged.
export function onlineServicesAllowed(mode=import.meta.env?.MODE,storage=globalThis.localStorage){
 return mode!=='android'||(!localOnlyForThisSession&&readAudience(storage)==='adult');
}
