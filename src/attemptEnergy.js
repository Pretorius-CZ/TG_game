// The debit is persisted before play starts. Refund rights live only in this
// document: reloading/closing it cannot turn an abandoned attempt into a refund.
export function createAttemptEnergy({spend,reward}){
 const refundable=new Set();
 return {
  reserve(id){
   if(refundable.has(id))return true;
   if(!spend())return false;
   refundable.add(id);return true;
  },
  settle(id,refund=false){
   if(!refundable.delete(id))return false;
   if(refund)reward();
   return true;
  }
 };
}
