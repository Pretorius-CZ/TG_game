import React,{useEffect,useState} from 'react';
import {supabase} from './supabase.js';
import {countryName} from './countryTracking.js';
import {campaignDiagnostics} from './campaignTracking.js';
const campaignKey=row=>JSON.stringify([row.source,row.medium,row.campaign]);
export default function CountryStats({providedRows=null}){
 const [fetchedRows,setRows]=useState([]),[error,setError]=useState(''),[campaign,setCampaign]=useState('');
 const [diagnostics,setDiagnostics]=useState(campaignDiagnostics);
 useEffect(()=>{
 let stopped=false,running=false;
 async function refresh(){
 if(providedRows!==null||document.hidden||running)return;running=true;
 try{const {data,error}=await supabase.rpc('read_country_stats').abortSignal(AbortSignal.timeout(8000));if(error)throw error;if(!stopped){setRows(data||[]);setError('');}}
 catch{if(!stopped)setError('Země nelze načíst. Ověř přihlášení správce a migraci 027.');}finally{running=false;}
 }
 const local=()=>setDiagnostics(campaignDiagnostics());
 const tick=()=>{local();refresh();};
 refresh();const timer=setInterval(tick,30000);window.addEventListener('focus',tick);window.addEventListener('storage',local);window.addEventListener('campaign-status',local);
 return()=>{stopped=true;clearInterval(timer);window.removeEventListener('focus',tick);window.removeEventListener('storage',local);window.removeEventListener('campaign-status',local);};
 },[providedRows!==null]);
 const rows=providedRows??fetchedRows;
 const campaigns=[...new Map(rows.map(row=>[campaignKey(row),row])).entries()];
 const selected=rows.filter(row=>!campaign||campaignKey(row)===campaign);
 const countries=[...new Map(selected.map(row=>[row.country,countryName(row.country)])).entries()].sort((a,b)=>a[1].localeCompare(b[1],'cs'));
 const [country,setCountry]=useState('');
 const shown=selected.filter(row=>!country||row.country===country);
 return <section className="recent-attempts" aria-label="Země návštěvníků">
 <h2>Země návštěvníků</h2><p>Celé období od zapnutí měření. Přibližná země připojení podle IP, nikoli bydliště; VPN ji může změnit. IP adresy do analytiky neukládáme. Starší návštěvy a nedostupná poloha jsou Neznámá.</p>
 <p>Diagnostika tohoto prohlížeče: země {diagnostics.country?countryName(diagnostics.country):diagnostics.countryState==='loading'?'zjišťuje se':diagnostics.countryState==='unavailable'?'nedostupná (síť nebo blokátor)':'zatím nezjištěná'} · návštěvy čekající na odeslání: {diagnostics.pending}.</p>
 {diagnostics.sendError&&<p role="alert">Poslední chyba odeslání návštěvy: {diagnostics.sendError}</p>}
 <div className="controls"><label>Kampaň <select aria-label="Kampaň zemí" value={campaign} onChange={e=>{setCampaign(e.target.value);setCountry('');}}><option value="">Všechny kampaně a zdroje</option>{campaigns.map(([key,row])=><option key={key} value={key}>{row.source} · {row.medium} · {row.campaign}</option>)}</select></label>
 <label>Země <select aria-label="Země" value={country} onChange={e=>setCountry(e.target.value)}><option value="">Všechny země</option>{countries.map(([code,name])=><option key={code} value={code}>{name}</option>)}</select></label></div>
 {providedRows===null&&error&&<p role="alert">{error}</p>}
 <div className="recent-wrap"><table><thead><tr>{['Země','Zdroj / kampaň','Návštěvy','Zařízení','Spustili minihru','Vyhráli level','Hráli další level','Pokusy'].map(label=><th key={label}>{label}</th>)}</tr></thead>
 <tbody>{shown.map(row=><tr key={JSON.stringify([row.country,campaignKey(row)])}><td>{countryName(row.country)}<small>{row.country==='unknown'?'—':row.country}</small></td><td>{row.source} · {row.medium}<small>{row.campaign}</small></td><td>{row.visits}</td><td>{row.devices}</td><td>{row.started}</td><td>{row.won}</td><td>{row.continued}</td><td>{row.attempts}</td></tr>)}</tbody></table></div>
 {(providedRows!==null||!error)&&!shown.length&&<p>Zatím žádné návštěvy pro tento výběr.</p>}
 </section>;
}
