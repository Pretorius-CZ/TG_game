// The debit is persisted before play starts. Refund rights live only in this
// document: reloading/closing it cannot turn an abandoned attempt into a refund.
export function createAttemptEnergy({spend,reward}){
 const refundable=new Set();
 const failed=new Set();
 return {
  reserve(id){
   if(refundable.has(id))return true;
   if(!spend())return false;
   refundable.add(id);return true;
  },
  settle(id,refund=false){
   if(!refundable.delete(id))return false;
   if(refund){failed.delete(id);reward();}else failed.add(id);
   return true;
  },
  resume(id){
   // Restore refund rights to an already debited failure, without another debit.
   if(!failed.delete(id))return false;
   refundable.add(id);return true;
  }
 };
}
