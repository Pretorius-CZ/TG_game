import {App} from '@capacitor/app';
import {Browser} from '@capacitor/browser';
import {Capacitor} from '@capacitor/core';
import {supabase,supabaseUrl} from './supabase.js';
import {createAndroidAuthFlow} from './androidAuthFlow.js';
export function androidAuth(onState){
 if(Capacitor.getPlatform()!=='android')throw Error('Native Android required');
 return createAndroidAuthFlow({auth:supabase.auth,app:App,browser:Browser,storage:localStorage,authOrigin:new URL(supabaseUrl).origin,onState});
}
