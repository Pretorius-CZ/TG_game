// Test stock: one of each helper per profile and full-game reset.
export const freshStock=()=>[1,1,1,1,1];
export function stockKey(userId,revision=0){return `to-the-stars-helpers-v1:${userId||'guest'}:${revision}`;}
export function readStock(storage,key){
 const raw=storage.getItem(key);
 if(raw===null)return freshStock();
 try{const data=JSON.parse(raw);return Array.from({length:5},(_,i)=>data?.[i]===1?1:0);}catch{return [0,0,0,0,0];}
}
export function spendStock(storage,key,index){
 const stock=readStock(storage,key);
 if(!Number.isInteger(index)||index<0||index>=5||!stock[index])return false;
 stock[index]=0;
 storage.setItem(key,JSON.stringify(stock));
 return stock;
}
