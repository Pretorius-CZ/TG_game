// PKCE verifier/session storage belongs to Supabase. This marker contains no tokens.
export const androidAuthPendingKey='beyond-signal-android-login-v1';
const packages=['com.playbeyondthesignal.game','com.playbeyondthesignal.game.preview'];
const timeout=10*60*1000;
export function androidAuthRedirect(id){
 if(!packages.includes(id))throw Error('Unsupported Android application');
 return `${id}://auth/callback`;
}
export function androidAuthCallback(raw,redirect){
 try{
  const url=new URL(raw),expected=new URL(redirect);
  if(url.protocol!==expected.protocol||url.host!==expected.host||url.pathname!==expected.pathname||url.username||url.password||url.hash)return null;
  if(url.searchParams.has('error'))return {error:true};
  const codes=url.searchParams.getAll('code');
  if(codes.length!==1||!codes[0]||codes[0].length>4096||url.searchParams.has('access_token')||url.searchParams.has('refresh_token'))return null;
  return {code:codes[0]};
 }catch{return null;}
}
export function createAndroidAuthFlow({auth,app,browser,storage,authOrigin,now=Date.now,onState=()=>{}}){
 let redirect,ready,disposed=false,busy=false,exchanging=false,exchangeDone=null;
 const listeners=[];
 const clear=()=>{storage.removeItem(androidAuthPendingKey);busy=false;};
 const state=value=>{if(!disposed)onState(value);};
 function pending(){
  try{const p=JSON.parse(storage.getItem(androidAuthPendingKey));return p?.redirect===redirect&&Number.isFinite(p.at)&&now()>=p.at&&now()-p.at<=timeout?p:null;}catch{return null;}
 }
 async function callback(raw){
  const result=androidAuthCallback(raw,redirect);
  if(!result||!pending()||exchanging||disposed)return false;
  exchanging=true;
  const task=(async()=>{try{
   // Consume before awaiting so appUrlOpen/getLaunchUrl cannot exchange twice.
   clear();state('busy');
   if(result.error)throw Error('OAuth declined');
   const {error}=await auth.exchangeCodeForSession(result.code);
   if(error)throw error;
   state('signed-in');
  }catch{state('failed');}
  finally{exchanging=false;try{await browser.close();}catch{/* Android custom tabs close on return. */}}})();
  exchangeDone=task;await task;if(exchangeDone===task)exchangeDone=null;
  return true;
 }
 async function initialize(){
  const info=await app.getInfo();redirect=androidAuthRedirect(info.id);
  const opened=await app.addListener('appUrlOpen',event=>{void callback(event.url);});listeners.push(opened);
  const finished=await browser.addListener('browserFinished',()=>{if(!exchanging&&pending()){busy=false;state('cancelled');}});listeners.push(finished);
  if(disposed){for(const l of listeners)await l.remove();return;}
  const launch=await app.getLaunchUrl();if(launch?.url)await callback(launch.url);
 }
 ready=initialize();
 return {
  ready,
  async cancel(){clear();if(exchangeDone)await exchangeDone;state('idle');},
  async start(){
   await ready;if(disposed||busy||exchanging)return;
   busy=true;state('busy');
   try{
    storage.setItem(androidAuthPendingKey,JSON.stringify({redirect,at:now()}));
    const {data,error}=await auth.signInWithOAuth({provider:'google',options:{redirectTo:redirect,skipBrowserRedirect:true,queryParams:{prompt:'select_account'}}});
    if(error)throw error;
    const url=new URL(data?.url);
    if(url.origin!==authOrigin||url.pathname!=='/auth/v1/authorize'||url.searchParams.get('provider')!=='google')throw Error('Unexpected OAuth endpoint');
    await browser.open({url:url.href});
   }catch{clear();state('failed');}
  },
  async dispose(){disposed=true;await ready.catch(()=>{});for(const l of listeners)await l.remove();},
 };
}
