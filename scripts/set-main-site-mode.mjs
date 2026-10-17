// Future cutover is explicit. Ordinary source pushes preserve the configured mode.
import {execFileSync} from 'node:child_process';
const mode=process.argv.find(x=>x.startsWith('--mode='))?.slice(7)||'website',apply=process.argv.includes('--apply');
if(!['game','website'].includes(mode))throw Error('Use --mode=game or --mode=website.');
const owner='Pretorius-CZ',repo='TG_game',base=`/repos/${owner}/${repo}`;
const headers={'User-Agent':'beyond-signal-site-cutover',Accept:'application/vnd.github+json','Content-Type':'application/json'};
let token=process.env.GH_TOKEN||process.env.GITHUB_TOKEN;
if(!token){const raw=execFileSync('git',['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',env:{...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'never'},stdio:['pipe','pipe','pipe']});token=raw.split('\n').find(x=>x.startsWith('password='))?.slice(9).trim();}
if(!token)throw Error('Existing GitHub authentication is required.');
async function api(route,method='GET',data,allowed=[]){const r=await fetch('https://api.github.com'+route,{method,headers:{...headers,Authorization:`Bearer ${token}`},body:data?JSON.stringify(data):undefined});const body=r.status===204?null:await r.json();if(!r.ok&&!allowed.includes(r.status))throw Error(`${r.status}: ${body?.message}`);return {status:r.status,body};}
const root=(await api(base+'/pages')).body;if(root.cname!=='playbeyondthesignal.com'||!root.https_enforced)throw Error('Unexpected main-domain configuration');
const target=await fetch('https://game.playbeyondthesignal.com/migration-policy.json');if(!target.ok||(await target.json()).transferReady!==true)throw Error('Live save transfer on the game subdomain is not ready.');
const source=await fetch('https://playbeyondthesignal.com/transfer.html');if(!source.ok||!(await source.text()).includes('id="transfer"'))throw Error('Original save recovery endpoint is missing.');
console.log(JSON.stringify({mode,apply,root:root.html_url,transferReady:true}));
if(apply){
 const existing=await api(base+'/actions/variables/MAIN_SITE_MODE','GET',undefined,[404]);
 await api(base+'/actions/variables'+(existing.status===404?'':'/MAIN_SITE_MODE'),existing.status===404?'POST':'PATCH',{name:'MAIN_SITE_MODE',value:mode});
 await api(base+'/actions/workflows/pages.yml/dispatches','POST',{ref:'codex/cockpit-stage',inputs:{site_mode:mode}});
 console.log('Main-domain deployment requested. Verify its completion and the live pages before announcing cutover.');
}else console.log('Read-only readiness check passed. Add --apply only when it is time to switch the main website.');
