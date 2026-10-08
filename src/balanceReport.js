export const legacyRules='__legacy__';
export function rulesVersion(row){return typeof row.build==='string'&&row.build?row.build:legacyRules;}
export function reportVersions(rows){return [...new Set(rows.map(rulesVersion))].sort().reverse();}
export function filterRules(rows,version){return version?rows.filter(r=>rulesVersion(r)===version):rows;}
export function latestAttempts(rows,limit=6){
 const timestamp=row=>row.at==null?NaN:new Date(row.at).getTime();
 return rows.filter(r=>Number.isFinite(timestamp(r))).slice().sort((a,b)=>timestamp(b)-timestamp(a)||String(b.attemptId??'').localeCompare(String(a.attemptId??''))).slice(0,limit);
}
