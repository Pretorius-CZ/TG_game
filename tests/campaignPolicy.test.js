import test from 'node:test';
import assert from 'node:assert/strict';
import {campaignFromURL,reusableVisit} from '../src/campaignPolicy.js';
test('update cache parameter does not change advertising attribution',()=>{
 const a=campaignFromURL('https://example.com/?utm_source=reddit&utm_medium=paid_social&utm_campaign=launch_012&gameVersion=123-abc');
 assert.deepEqual(a,{source:'reddit',medium:'paid_social',campaign:'launch_012'});
});
test('reload and direct authentication return retain visit; new campaign and inactivity split it',()=>{
 const c={source:'reddit',medium:'paid_social',campaign:'launch_012'},visit={id:'v',lastAt:1000,...c};
 assert.equal(reusableVisit(visit,c,2000),true);
 assert.equal(reusableVisit(visit,{source:'direct'},2000),true);
 assert.equal(reusableVisit(visit,{...c,campaign:'other'},2000),false);
 assert.equal(reusableVisit(visit,c,1801000),false);
 assert.equal(reusableVisit(visit,c,999),false);
});
test('only bounded campaign labels are captured, no OAuth query values',()=>{
 assert.deepEqual(campaignFromURL('https://example.com/?code=secret&email=private&utm_source=%3Cscript%3E'),{source:'script',medium:'none',campaign:'none'});
 assert.equal(campaignFromURL('https://example.com/?utm_campaign='+ 'x'.repeat(100)).campaign.length,80);
});
