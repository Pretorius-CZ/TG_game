import {test,expect} from '@playwright/test';

test('analytics failure preserves the attempt, redacts identity and retries once',async({page})=>{
 let fail=true;const requests=[];
 await page.route(/supabase\.co|api\.country\.is/,async route=>{
  if(route.request().url().includes('/rpc/record_balance_attempt')){
   requests.push(route.request().postDataJSON());
   return route.fulfill({status:fail?400:200,contentType:'application/json',body:fail?JSON.stringify({code:'22023',message:'Invalid test revision',details:'Diagnostic test',hint:'Retry the same attempt'}):'null'});
  }
  return route.fulfill({status:204,body:''});
 });
 await page.goto('/tests/browser/fixture.html');
 const failed=await page.evaluate(async()=>{
  (await import('/src/analyticsPrivacy.js')).setAnalyticsChoice('granted');
  const {enqueueAttempt,reporterIdentity,readQueue}=await import('/src/balanceOutbox.js');
  const {flushBalance,balanceCloudStatus}=await import('/src/balanceCloud.js');
  const identity=reporterIdentity();
  enqueueAttempt({attemptId:'qa-retry',level:1,at:Date.now()});
  await flushBalance();
  return {pending:readQueue().length,diagnostic:balanceCloudStatus.diagnostic,leaked:JSON.stringify(balanceCloudStatus).includes(identity.token)};
 });
 expect(failed.pending).toBe(1);expect(failed.leaked).toBe(false);
 expect(failed.diagnostic).toMatchObject({status:400,code:'22023',attemptId:'qa-retry'});
 fail=false;
 const pending=await page.evaluate(async()=>{
  await (await import('/src/balanceCloud.js')).flushBalance();
  return (await import('/src/balanceOutbox.js')).readQueue().length;
 });
 expect(pending).toBe(0);expect(requests).toHaveLength(2);
 expect(requests[1].incoming.attemptId).toBe(requests[0].incoming.attemptId);
 expect(requests[1].incoming_revision).toBe(requests[0].incoming_revision);
});
