import test from 'node:test';
import assert from 'node:assert/strict';
import {canUpdate,newVersion} from '../src/updatePolicy.js';
const ready={online:true,visible:true,blocked:false,local:'saved',cloud:null};
test('updates only after safe saved state',()=>{
 assert.equal(canUpdate(ready),true);
 for(const change of [{online:false},{visible:false},{blocked:true},{local:'unavailable'},{local:'unsupported'},{cloud:'syncing'},{cloud:'offline'}])assert.equal(canUpdate({...ready,...change}),false);
 assert.equal(canUpdate({...ready,cloud:'saved'}),true);
});
test('version endpoint rejects invalid responses and unchanged builds',()=>{
 assert.equal(newVersion({version:'123-abc'},'old'),true);
 for(const value of [null,{}, {version:'old'},{version:'<html>'},{version:42}])assert.equal(newVersion(value,'old'),false);
});
