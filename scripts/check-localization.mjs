import {readFileSync,readdirSync,writeFileSync,existsSync} from 'node:fs';
import {parseSync} from 'rolldown/utils';
import {locales,releasedLocales} from '../src/i18n/locales.js';
import {englishMessages,catalogProblems} from '../src/i18n/messages.js';
import {updates} from '../src/welcomeUpdates.js';

const failures=[],legacySites=[],sourceIds=new Map(Object.entries(englishMessages).filter(([,value])=>typeof value==='string').map(([id,value])=>[value.trim(),id]));
function walk(node,visit){if(!node||typeof node!=='object')return;visit(node);for(const value of Object.values(node)){if(Array.isArray(value))value.forEach(child=>walk(child,visit));else if(value&&typeof value==='object')walk(value,visit);}}
for(const file of readdirSync('src',{recursive:true}).filter(file=>/\.(jsx|js)$/.test(file))){
 const path='src/'+file.replaceAll('\\','/'),source=readFileSync(path,'utf8'),parsed=parseSync(path,source);
 if(parsed.errors.length){failures.push(path+': cannot parse source');continue;}
 walk(parsed.program,node=>{
  const line=()=>source.slice(0,node.start).split('\n').length;
  if(node.type==='CallExpression'&&node.callee.type==='Identifier'&&['msg','message'].includes(node.callee.name)&&node.arguments[0]?.type==='Literal'&&typeof node.arguments[0].value==='string'&&!Object.hasOwn(englishMessages,node.arguments[0].value))failures.push(`${path}:${line()}: unknown message ${node.arguments[0].value}`);
  if(node.type==='ConditionalExpression'&&(/\b(language|lang)\s*===?\s*['"]cs['"]/.test(source.slice(node.test.start,node.test.end))||/^(cs|czech)$/.test(source.slice(node.test.start,node.test.end))))legacySites.push({path,line:line(),kind:'bilingual branch'});
  if(node.type==='MemberExpression'&&node.computed&&node.property.type==='ConditionalExpression'&&/['"]cs['"]/.test(source.slice(node.property.start,node.property.end)))legacySites.push({path,line:line(),kind:'bilingual data lookup'});
  if(node.type==='CallExpression'&&node.callee.type==='Identifier'&&node.callee.name==='t'&&node.arguments[0]?.type==='Literal'){
   const value=node.arguments[0].value;
   if(typeof value==='string'&&/[a-z]{2}/i.test(value)&&!sourceIds.has(value.trim())&&!['Haven','Aster Veil','Kepler Reach','ASTER VEIL','KEPLER REACH','Pulse','Nova','EMP'].includes(value.trim()))failures.push(`${path}:${line()}: unregistered t() source ${JSON.stringify(value)}`);
  }
 });
}
for(const match of readFileSync('welcome.html','utf8').matchAll(/data-(?:text|alt|label)="([^"]+)"/g))if(!Object.hasOwn(englishMessages,'web.'+match[1]))failures.push('welcome.html: missing web.'+match[1]);
for(const update of updates)for(const field of ['tag','title','body'])if(!englishMessages[`news.${update.id}.${field}`])failures.push(`News ${update.id}.${field}: missing source`);
const coverage=[];
for(const locale of locales){
 const webPath=new URL(`../src/i18n/catalogs/web/${locale.code}.json`,import.meta.url);
 const catalog={...JSON.parse(readFileSync(new URL(`../src/i18n/catalogs/${locale.code}.json`,import.meta.url),'utf8')),...(existsSync(webPath)?JSON.parse(readFileSync(webPath,'utf8')):{})};
 const problems=catalogProblems(locale.code,catalog);
 const missing=problems.filter(problem=>problem.endsWith(': missing translation'));
 coverage.push({code:locale.code,status:locale.status,total:Object.keys(englishMessages).length,translated:Object.keys(englishMessages).length-missing.length,problems:problems.length});
 if(locale.status==='released')failures.push(...problems.map(problem=>`${locale.code}: ${problem}`));
 else failures.push(...problems.filter(problem=>!problem.endsWith(': missing translation')).map(problem=>`${locale.code}: ${problem}`));
}
// Existing EN/CZ paths still contain dynamic grammar and bilingual story arrays.
// Do not enable another language just by changing its registry status.
if(releasedLocales.some(locale=>!['en','cs'].includes(locale.code)))failures.push('Additional language release requires migration of dynamic objectives, bilingual story data, consent/transfer/legal copy and the remaining branches. See docs/localization-rollout.md.');
for(const locale of releasedLocales)for(const file of ['privacy.html','contact.html'])if(!readFileSync(file,'utf8').includes(`data-copy="${locale.code}"`))failures.push(`${file}: missing ${locale.code} copy`);
const report={coverage,legacySites,failures};
if(process.argv.includes('--report')){
 writeFileSync('docs/localization-audit.json',JSON.stringify(report,null,2)+'\n');
 console.log('Wrote docs/localization-audit.json');
}
console.table(coverage);console.log(`Remaining bilingual branches/lookups: ${legacySites.length}`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log('Localization checks passed; draft languages remain hidden.');
