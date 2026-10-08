export const legacyRules='__legacy__';
export function durationLabel(ms){
 if(!Number.isFinite(ms)||ms<0)return '—';
 const seconds=Math.round(ms/1000);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
}
export function assistanceLabel(row){
 const parts=[];
 if(Array.isArray(row.helpers)&&row.helpers.length){const counts=new Map();for(const name of row.helpers)counts.set(name,(counts.get(name)||0)+1);parts.push([...counts].map(([name,count])=>`${name} ×${count}`).join(', '));}
 if(row.hints)parts.push(`Nápověda ×${row.hints}`);
 if(row.extraMoves)parts.push('+5 tahů');
 return parts.join(' · ')||((row.helpers!=null&&row.hints!=null&&row.extraMoves!=null)?'Bez pomoci':'—');
}
export function missingObjectives(row){
 const goals=row.configuration?.goals;
 if(!Array.isArray(goals)||!Array.isArray(row.counts))return '—';
 const missing=goals.flatMap((goal,i)=>Number.isFinite(goal.target)&&Number.isFinite(row.counts[i])&&goal.target>row.counts[i]?[`${goal.label||'Kameny'}: ${goal.target-row.counts[i]}`]:[]);
 if(row.remainingCovers>0)missing.push(`Kryty: ${row.remainingCovers}`);
 const rings=row.configuration?.resonators;
 if(Array.isArray(rings)&&Array.isArray(row.resonance)){const left=rings.reduce((sum,r,i)=>sum+Math.max(0,r.target-(row.resonance[i]??0)),0);if(left)missing.push(`Nabití kruhů: ${left}`);}
 return missing.join(' · ')||'Splněno';
}
export function funnelPercent(count,total){return total>0?`${Math.round(count/total*100)} %`:'—';}
export function rulesVersion(row){return typeof row.build==='string'&&row.build?row.build:legacyRules;}
export function reportVersions(rows){return [...new Set(rows.map(rulesVersion))].sort().reverse();}
export function filterRules(rows,version){return version?rows.filter(r=>rulesVersion(r)===version):rows;}
export function latestAttempts(rows,limit=6){
 const timestamp=row=>row.at==null?NaN:new Date(row.at).getTime();
 return rows.filter(r=>Number.isFinite(timestamp(r))).slice().sort((a,b)=>timestamp(b)-timestamp(a)||String(b.attemptId??'').localeCompare(String(a.attemptId??''))).slice(0,limit);
}
