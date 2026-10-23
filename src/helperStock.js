// Test stock: one of each helper per profile and full-game reset.
export const freshStock=()=>[1,1,1,1,1];
export function stockKey(userId,revision=0){return `to-the-stars-helpers-v1:${userId||'guest'}:${revision}`;}
export function starterStockAllowed({hostname,userId,progress,native=false}={}){
 if(native&&userId)return false;
 if(hostname!=='game.playbeyondthesignal.com')return true;
 if(userId)return false;
 return !(progress?.resetRevision>0)&&!Object.entries(progress||{}).some(([key,value])=>(key==='completed'||key.endsWith('Completed')||key==='caretakerMet'||key==='riftCrossed')&&value>0);
}
export function readStock(storage,key,initial=freshStock()){
 const raw=storage.getItem(key);
 if(raw===null)return [...initial];
 try{const data=JSON.parse(raw);return Array.from({length:5},(_,i)=>data?.[i]===1?1:0);}catch{return [0,0,0,0,0];}
}
export function spendStock(storage,key,index,initial=freshStock()){
 const stock=readStock(storage,key,initial);
 if(!Number.isInteger(index)||index<0||index>=5||!stock[index])return false;
 stock[index]=0;
 storage.setItem(key,JSON.stringify(stock));
 return stock;
}

export function rewardStock(storage,key,index,initial=freshStock()){
 if(!Number.isInteger(index)||index<0||index>=5)return false;
 const stock=readStock(storage,key,initial);if(stock[index])return false;
 stock[index]=1;storage.setItem(key,JSON.stringify(stock));return stock;
}
