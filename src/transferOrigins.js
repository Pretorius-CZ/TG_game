export function transferOrigins(location,development=false){
 if(development&&['localhost','127.0.0.1'].includes(location.hostname))return {source:`http://127.0.0.1:${location.port}`,target:`http://localhost:${location.port}`};
 return {source:'https://playbeyondthesignal.com',target:'https://game.playbeyondthesignal.com'};
}
export function validTransferMessage(event,{origin,source,nonce},type){
 return event.origin===origin&&event.source===source&&typeof nonce==='string'&&nonce.length>=32&&event.data?.channel==='beyond-signal-transfer-v1'&&event.data?.nonce===nonce&&event.data?.type===type;
}
