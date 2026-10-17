import {readFile,writeFile,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export async function prepareMainSite(directory,mode='game'){
 if(!['game','website'].includes(mode))throw Error('Main site mode must be game or website.');
 if(mode==='website'){
  // Keep the original origin and OAuth recovery path; never remove local player data.
  const game=await readFile(path.join(directory,'index.html'),'utf8');
  await writeFile(path.join(directory,'legacy-game.html'),game.replace('</head>','<meta name="robots" content="noindex,nofollow"/></head>'));
  await copyFile(path.join(directory,'welcome.html'),path.join(directory,'index.html'));
 }
 await writeFile(path.join(directory,'hosting-policy.json'),JSON.stringify({version:1,mode,gameOrigin:'https://game.playbeyondthesignal.com',transferPath:'/transfer.html'}));
 console.log(`Main domain prepared in ${mode} mode; original storage is untouched.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)await prepareMainSite(path.resolve('dist'),process.argv[2]||process.env.MAIN_SITE_MODE||'game');
