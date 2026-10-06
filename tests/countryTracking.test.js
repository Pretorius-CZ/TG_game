import test from 'node:test';
import assert from 'node:assert/strict';
import {lookupCountry,normalizeCountry,countryName} from '../src/countryTracking.js';
test('country lookup retains only the country, not returned IP or other location data',async()=>{
 let options;
 const result=await lookupCountry(async(url,config)=>{assert.equal(url,'https://api.country.is/');options=config;return {ok:true,json:async()=>({country:'gb',ip:'192.0.2.1',city:'London'})};});
 assert.equal(result,'GB');assert.equal(options.credentials,'omit');assert.equal(options.referrerPolicy,'no-referrer');
});
test('network, rate limit, invalid JSON and unknown codes safely yield unknown',async()=>{
 for(const fetcher of [async()=>{throw Error('offline');},async()=>({ok:false}),async()=>({ok:true,json:async()=>{throw Error();}}),async()=>({ok:true,json:async()=>({country:'XX'})})])assert.equal(await lookupCountry(fetcher),null);
 for(const code of ['unknown','ZZ','EU',null,123,'<GB>'])assert.equal(normalizeCountry(code),null);
 assert.equal(normalizeCountry(' cz '),'CZ');assert.equal(countryName('unknown'),'Neznámá');assert.equal(countryName('CZ'),'Česko');
});
