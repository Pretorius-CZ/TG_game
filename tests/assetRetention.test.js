import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,stat,utimes,symlink,access,rm} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {retainAssets} from '../scripts/retain-game-assets.mjs';
test('cached HTML dependencies survive deployment without replacing the new bundle or following symlinks',async t=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'game-asset-retention-'));
 t.after(async()=>{if(path.basename(root).startsWith('game-asset-retention-'))await rm(root,{recursive:true,force:true});});
 const old=path.join(root,'old'),current=path.join(root,'current');await mkdir(old);await mkdir(current);
 await writeFile(path.join(old,'old.js'),'old dependency');await writeFile(path.join(old,'shared.js'),'stale');await writeFile(path.join(current,'shared.js'),'current');
 await writeFile(path.join(old,'expired.js'),'expired');const past=new Date(Date.now()-8*86400000);await utimes(path.join(old,'expired.js'),past,past);
 const earlier=new Date(Date.now()-86400000);await utimes(path.join(old,'old.js'),earlier,earlier);
 try{await symlink(path.join(old,'old.js'),path.join(old,'linked.js'));}catch(error){if(error.code!=='EPERM')throw error;}
 assert.equal(await retainAssets(old,current),1);
 assert.equal(await readFile(path.join(current,'old.js'),'utf8'),'old dependency');
 assert.equal(await readFile(path.join(current,'shared.js'),'utf8'),'current');
 await assert.rejects(access(path.join(current,'expired.js')));
 await assert.rejects(access(path.join(current,'linked.js')));
 assert.ok(Math.abs((await stat(path.join(current,'old.js'))).mtimeMs-earlier.getTime())<1000);
 assert.equal(await retainAssets(old,current),0);
});
