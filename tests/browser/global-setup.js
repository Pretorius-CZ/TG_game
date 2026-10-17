import {mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';

export default async function setup(config){
 const git=args=>{try{return execFileSync('git',args,{encoding:'utf8',stdio:['ignore','pipe','ignore'],windowsHide:true}).trim();}catch{return 'unavailable';}};
 await mkdir(config.projects[0].outputDir,{recursive:true});
 await writeFile(`${config.projects[0].outputDir}/run-environment.json`,JSON.stringify({
  startedAt:new Date().toISOString(),sourceRevision:git(['rev-parse','HEAD']),trackedChanges:git(['diff','--name-only']),
  node:process.version,platform:process.platform,workers:config.workers,
  projects:config.projects.map(p=>({name:p.name,engine:p.use.browserName,baseURL:p.use.baseURL,reducedMotion:p.use.reducedMotion})),
  note:'Engine/device emulation does not establish physical device performance. No reporter tokens or account data are recorded.'
 },null,2));
}
