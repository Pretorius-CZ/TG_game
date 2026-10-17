// Explicit one-time setup. Credentials are never printed, written to disk, or included in URLs.
import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
const owner='Pretorius-CZ',repo='TG_game-hosting',domain='game.playbeyondthesignal.com';
const apply=process.argv.includes('--apply');
let token=process.env.GH_TOKEN||process.env.GITHUB_TOKEN;
if(!token){
 const raw=execFileSync('git',['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',env:{...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'never'},stdio:['pipe','pipe','pipe']});
 token=raw.split('\n').find(line=>line.startsWith('password='))?.slice(9).trim();
}
if(!token)throw Error('No existing GitHub authentication is available.');
async function api(path,method='GET',body,allowed=[]){
 const response=await fetch(`https://api.github.com${path}`,{method,headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'beyond-signal-game-hosting',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
 const data=response.status===204?null:await response.json();
 if(!response.ok&&!allowed.includes(response.status))throw Error(`${method} ${path}: ${response.status} ${data?.message||''}`);
 return {status:response.status,data};
}
const user=(await api('/user')).data;
if(user.login.toLowerCase()!==owner.toLowerCase())throw Error('GitHub account does not match the intended owner.');
const root=(await api(`/repos/${owner}/TG_game/pages`)).data;
if(root.cname!=='playbeyondthesignal.com')throw Error('Main-domain Pages settings changed; inspect before proceeding.');
let hosting=await api(`/repos/${owner}/${repo}`,'GET',undefined,[404]);
console.log(JSON.stringify({owner,repository:repo,domain,apply,repositoryExists:hosting.status===200,mainDomain:root.cname}));
if(!apply){console.log('Read-only check complete. Use --apply to create/configure only the separate hosting repository.');process.exit(0);}
if(hosting.status===404)hosting=await api('/user/repos','POST',{name:repo,description:'Separate deployment for game.playbeyondthesignal.com; source remains in TG_game.',private:false,auto_init:true});
if(hosting.data.fork||hosting.data.archived)throw Error('Unexpected hosting repository state.');
const branch=hosting.data.default_branch;
const files={
 '.github/workflows/pages.yml':await readFile(new URL('../deployment/game-pages.yml',import.meta.url),'utf8'),
 'HOSTING.md':'# Beyond the Signal — game hosting\n\nPublishes game.playbeyondthesignal.com independently of the original website.\nSource: https://github.com/Pretorius-CZ/TG_game\n\nRun **Publish game subdomain** in Actions and select the tested source commit.\nThis repository does not contain player saves or credentials.\n'
};
for(const [path,content] of Object.entries(files)){
 const existing=await api(`/repos/${owner}/${repo}/contents/${path}`,'GET',undefined,[404]);
 if(existing.status===200){
  const previous=Buffer.from(existing.data.content,'base64').toString('utf8');
  if(previous===content)continue;
  throw Error(`Existing ${path} differs. Review it instead of overwriting.`);
 }
 await api(`/repos/${owner}/${repo}/contents/${path}`,'PUT',{message:'Configure isolated game subdomain deployment',content:Buffer.from(content).toString('base64'),branch});
}
const pages=await api(`/repos/${owner}/${repo}/pages`,'GET',undefined,[404]);
if(pages.status===404)await api(`/repos/${owner}/${repo}/pages`,'POST',{build_type:'workflow'});
else if(pages.data.cname&&pages.data.cname!==domain)throw Error('Hosting repository already has another custom domain.');
await api(`/repos/${owner}/${repo}/pages`,'PUT',{build_type:'workflow',cname:domain});
const result=(await api(`/repos/${owner}/${repo}/pages`)).data;
console.log(JSON.stringify({repository:`https://github.com/${owner}/${repo}`,url:result.html_url,cname:result.cname,https:result.https_enforced,certificate:result.https_certificate?.state}));
// Never modify the existing game's Pages settings or DNS here.
