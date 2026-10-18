export function mockSDK(outcome,{consent='not-required'}={}){return `(()=>{
 const callbacks=[];
 const data=choice=>({cmpStatus:'loaded',eventStatus:choice==='prompt'?'cmpuishown':'useractioncomplete',gdprApplies:choice!=='not-required',tcString:choice==='prompt'?'':'cmp-test-choice',purpose:{consents:{1:choice==='granted'}},vendor:{consents:{755:choice==='granted'}}});
 let current=${JSON.stringify(consent)};
 window.mockConsent=choice=>{current=choice;for(const cb of callbacks)cb(data(choice),true);};
 function prompt(){
  window.mockConsent('prompt');const panel=document.createElement('div');panel.id='google-cmp-test';panel.style='position:fixed;inset:10%;z-index:999999;background:white;color:black;padding:20px';
  for(const choice of ['granted','denied']){const b=document.createElement('button');b.textContent=choice==='granted'?'Accept CMP':'Reject CMP';b.onclick=()=>{panel.remove();window.mockConsent(choice);};panel.append(b);}document.body.append(panel);
 }
 window.googlefc=window.googlefc||{};const fc=window.googlefc,queue=fc.callbackQueue||[];
 window.__tcfapi=(action,version,callback)=>{callbacks.push(callback);callback(data(current),true);};
 fc.showRevocationMessage=prompt;fc.callbackQueue=queue;
 queue.push=c=>c.CONSENT_API_READY?.();for(const c of [...queue])c.CONSENT_API_READY?.();
 if(current==='prompt')prompt();
 const q=window.adsbygoogle;
 function process(c){
  if(c.onReady){queueMicrotask(c.onReady);return;}
  if(c.type!=='reward')return;
  window.mockPlacement=c;window.mockCalls=(window.mockCalls||0)+1;
  if(${JSON.stringify(outcome)}==='no-fill'){c.adBreakDone({breakStatus:'noAdPreloaded'});return;}
  c.beforeReward(()=>{
   c.beforeAd();const button=document.createElement('button');button.id='google-test-finish';button.textContent='Finish Google mock';
   button.style='position:fixed;inset:20%;z-index:999999;background:white;color:black';document.body.append(button);
   button.onclick=()=>{button.remove();if(${JSON.stringify(outcome)}==='dismissed')c.adDismissed();else {c.adViewed();c.adViewed();}c.afterAd();c.adBreakDone({breakStatus:'viewed'});};
  });
 }
 q.push=process;for(const c of [...q])process(c);
})();`;}
