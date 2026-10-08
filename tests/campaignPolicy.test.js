import test from 'node:test';
import assert from 'node:assert/strict';
import {campaignFromURL,reusableVisit,visitForActivity,deviceCategory,mergeVisitAttempts} from '../src/campaignPolicy.js';
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
test('activity after a hidden half-hour starts a fresh visit even without a reload',()=>{
 const campaign={source:'facebook',medium:'paid_social',campaign:'launch'};
 const previous={id:'old',lastAt:1000,at:1000,revision:5,attempts:{a:{level:'one'}},...campaign};
 const reused=visitForActivity(previous,{source:'direct'},2000,()=>assert.fail('should reuse'),'mobile');
 assert.equal(reused.id,'old');assert.equal(reused.source,'facebook');assert.equal(reused.device,'mobile');
 const fresh=visitForActivity(previous,campaign,1801000,()=> 'new','desktop');
 assert.equal(fresh.id,'new');assert.deepEqual(fresh.attempts,{});assert.equal(fresh.revision,0);
 assert.equal(previous.revision,5);
});
test('device classification is coarse and distinguishes unknown from desktop',()=>{
 assert.equal(deviceCategory({userAgent:'Mozilla Android'}),'mobile');
 assert.equal(deviceCategory({userAgent:'Macintosh',maxTouchPoints:5}),'mobile');
 assert.equal(deviceCategory({userAgent:'Windows NT'}),'desktop');
 assert.equal(deviceCategory({userAgent:''}),'unknown');
});
test('stale tab cannot downgrade a won or exhausted attempt; continued win still replaces exhaustion',()=>{
 const previous={a:{outcome:'won'},b:{outcome:'exhausted'},c:{outcome:'failed'}};
 const merged=mergeVisitAttempts(previous,{a:{outcome:'started'},b:{outcome:'won'},c:{outcome:'exhausted'},d:{outcome:'started'}});
 assert.equal(merged.a.outcome,'won');assert.equal(merged.b.outcome,'won');assert.equal(merged.c.outcome,'failed');assert.equal(merged.d.outcome,'started');
 assert.equal(previous.b.outcome,'exhausted');
});
