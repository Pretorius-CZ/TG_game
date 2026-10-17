import {execFileSync} from 'node:child_process';
import {readdir,mkdir,stat,copyFile,utimes} from 'node:fs/promises';
import {constants} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

// HTML can remain cached after a Pages deployment. Keep its immutable dependencies.
export async function retainAssets(previous,current,{now=Date.now(),maxAge=7*86400000}={}){
 let retained=0;await mkdir(current,{recursive:true});
 async function visit(from,to){
  for(const entry of await readdir(from,{withFileTypes:true})){
   const source=path.join(from,entry.name),destination=path.join(to,entry.name);
   if(entry.isDirectory()){await mkdir(destination,{recursive:true});await visit(source,destination);}
   else if(entry.isFile()){
    const info=await stat(source);if(now-info.mtimeMs>maxAge)continue;
    try{await copyFile(source,destination,constants.COPYFILE_EXCL);await utimes(destination,info.atime,info.mtime);retained++;}
    catch(error){if(error.code!=='EEXIST')throw error;}
   }
  }
 }
 await visit(previous,current);return retained;
}
async function run(){
 const repository=process.env.GITHUB_REPOSITORY;
 if(repository!=='Pretorius-CZ/TG_game-hosting')throw Error('Asset retention is configured only for the separate game hosting repository.');
 const gh=args=>execFileSync('gh',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']});
 const runs=JSON.parse(gh(['api',`repos/${repository}/actions/workflows/pages.yml/runs?status=success&per_page=3`])).workflow_runs;
 let total=0;
 for(const run of runs){
  if(!Number.isSafeInteger(run.id))throw Error('Unexpected workflow run ID');
  const artifacts=JSON.parse(gh(['api',`repos/${repository}/actions/runs/${run.id}/artifacts`])).artifacts;
  if(!artifacts.some(a=>a.name==='github-pages'&&!a.expired))continue;
  const directory=path.resolve('.local',`previous-game-${run.id}`);await mkdir(directory,{recursive:true});
  gh(['run','download',String(run.id),'--repo',repository,'--name','github-pages','--dir',directory]);
  const archive=path.join(directory,'artifact.tar');
  const entries=execFileSync('tar',['-tf',archive],{encoding:'utf8'}).split('\n').filter(Boolean);
  if(entries.some(name=>path.isAbsolute(name)||name.split('/').includes('..')))throw Error('Unsafe artifact paths');
  if(!entries.some(name=>name.startsWith('./assets/')))continue;
  execFileSync('tar',['-xf',archive,'--directory',directory,'--no-same-owner','--no-same-permissions','--wildcards','./assets/*'],{stdio:['ignore','pipe','pipe']});
  const count=await retainAssets(path.join(directory,'assets'),path.resolve('dist/assets'));
  total+=count;console.log(`Retained ${count} immutable assets from successful run ${run.id}.`);
 }
 console.log(`Asset retention complete: ${total} previous files; current files are unchanged.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)await run();
