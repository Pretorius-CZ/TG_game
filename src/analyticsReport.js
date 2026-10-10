// Aggregate pseudonymous browser identities, never infer people from attempts.
export const campaignKey=row=>JSON.stringify([row.source||'unknown',row.medium||'unknown',row.campaign||'unknown']);
export function campaignSelection(attempts,visits,key=''){
 const selected=key?visits.filter(row=>campaignKey(row)===key):visits;
 const links=new Set(selected.flatMap(visit=>visit.reporter?Object.keys(visit.attempts||{}).map(id=>JSON.stringify([visit.reporter,id])):[]));
 const linked=attempts.filter(row=>row.reporter&&row.attemptId&&links.has(JSON.stringify([row.reporter,row.attemptId])));
 return {visits:selected,attempts:key?linked:attempts,unlinked:attempts.length-linked.length};
}
export function excludeTesters(rows,testers,include=false){
 const ids=new Set(testers);return include?rows:rows.filter(row=>!ids.has(row.reporter));
}
export function visitGroups(visits,keys=['source','medium','campaign']){
 const groups=new Map();
 for(const visit of visits){
  const values=keys.map(key=>visit[key]||'unknown'),id=JSON.stringify(values);
  if(!groups.has(id))groups.set(id,{...Object.fromEntries(keys.map((key,i)=>[key,values[i]])),visits:0,devices:new Set(),started:0,won:0,continued:0,attempts:new Set()});
  const group=groups.get(id),attempts=Object.values(visit.attempts||{});
  group.visits++;if(visit.reporter)group.devices.add(visit.reporter);
  group.started+=Number(attempts.length>0);group.won+=Number(attempts.some(a=>a.outcome==='won'));
  group.continued+=Number(new Set(attempts.map(a=>a.level)).size>1);for(const id of Object.keys(visit.attempts||{}))group.attempts.add(id);
 }
 return [...groups.values()].map(g=>({...g,devices:g.devices.size,attempts:g.attempts.size})).sort((a,b)=>b.visits-a.visits);
}
export function onboardingReport(visits,catalog,since=null,history=visits){
 const devices=new Map(),firstSeen=new Map();
 for(const visit of history){
  const time=new Date(visit.recordedAt).getTime();
  if(visit.reporter&&Number.isFinite(time))firstSeen.set(visit.reporter,Math.min(firstSeen.get(visit.reporter)??Infinity,time));
 }
 for(const visit of visits){
  if(!visit.reporter)continue;
  if(!devices.has(visit.reporter))devices.set(visit.reporter,new Map());
  const time=new Date(visit.recordedAt).getTime();
  if(Number.isFinite(time))firstSeen.set(visit.reporter,Math.min(firstSeen.get(visit.reporter)??Infinity,time));
  const levels=devices.get(visit.reporter);
  for(const attempt of Object.values(visit.attempts||{}))levels.set(attempt.level,(levels.get(attempt.level)||false)||attempt.outcome==='won');
 }
 // A recorded first-level start anchors this cohort. Mid-game arrivals are excluded.
 const eligible=[...devices].filter(([id])=>!since||(firstSeen.has(id)&&firstSeen.get(id)>=new Date(since).getTime())).map(([,levels])=>levels);
 const cohort=eligible.filter(levels=>levels.has(catalog[0]?.id));
 return {devices:devices.size,cohort:cohort.length,older:devices.size-eligible.length,unanchored:eligible.length-cohort.length,levels:catalog.slice(0,10).map((level,index)=>{
  const started=cohort.filter(levels=>levels.has(level.id));
  const next=catalog[index+1]?.id;
  const continued=next?started.filter(levels=>levels.has(next)).length:null;
  return {...level,started:started.length,won:started.filter(levels=>levels.get(level.id)).length,continued,pending:continued==null?null:started.length-continued};
 })};
}
export function deviceDirectory(visits,attempts,testers){
 const devices=new Map(),marked=new Set(testers);
 const get=id=>{if(!devices.has(id))devices.set(id,{id,visits:0,attempts:0,lastAt:0,tester:marked.has(id)});return devices.get(id);};
 for(const id of testers)get(id);
 for(const row of visits){if(!row.reporter)continue;const device=get(row.reporter);device.visits++;device.lastAt=Math.max(device.lastAt,new Date(row.recordedAt).getTime()||0);}
 for(const row of attempts){if(!row.reporter)continue;const device=get(row.reporter);device.attempts++;device.lastAt=Math.max(device.lastAt,new Date(row.at).getTime()||0);}
 return [...devices.values()].sort((a,b)=>b.lastAt-a.lastAt||a.id.localeCompare(b.id));
}
export function nearMiss(row){
 if(!['failed','exhausted'].includes(row.outcome))return null;
 const config=row.configuration;
 if(!Array.isArray(config?.goals)||!config.goals.length||!Array.isArray(row.counts))return null;
 const fractions=[];
 for(const [index,goal] of config.goals.entries()){
  if(!Number.isFinite(goal.target)||goal.target<=0||!Number.isFinite(row.counts[index]))return null;
  fractions.push(Math.max(0,goal.target-row.counts[index])/goal.target);
 }
 if(!Array.isArray(config.ice)||!Array.isArray(config.resonators))return null;
 if(config.ice.length){if(!Number.isFinite(row.remainingCovers))return null;fractions.push(row.remainingCovers/config.ice.length);}
 for(const [index,ring] of config.resonators.entries()){
  if(!Number.isFinite(ring.target)||ring.target<=0||!Number.isFinite(row.resonance?.[index]))return null;
  fractions.push(Math.max(0,ring.target-row.resonance[index])/ring.target);
 }
 return fractions.some(value=>value>0)&&fractions.every(value=>value<=0.1);
}
