import React,{useState} from 'react';
import {reporterIdentity} from './balanceOutbox.js';
import {deviceDirectory,onboardingReport,visitGroups} from './analyticsReport.js';
import {funnelPercent} from './balanceReport.js';
import {levelCatalog} from './levelCatalog.js';

export function AnalyticsControls({data,error,includeTesters,setIncludeTesters,attempts,onMark,busy}){
 const [selected,setSelected]=useState('');
 const own=reporterIdentity()?.id;
 const devices=deviceDirectory(data?.visits||[],attempts,data?.testers||[]);
 const selectedDevice=devices.find(d=>d.id===selected);
 return <section className="recent-attempts" aria-label="Kvalita měření">
  <h2>Hráči a naše testování</h2>
  <p>Označení testerů je společné pro správce a platí zpětně. Data zůstávají uložená. Jeden člověk může mít více zařízení; každé označ zvlášť. Zařízení bez identifikátoru nelze spolehlivě přiřadit.</p>
  {error&&<p role="alert">{error}</p>}
  {!data?<p>Rozšířená analytika čeká na načtení. Vyžaduje migraci 028 a přihlášení správce. Dosavadní přehled níže zatím zahrnuje všechny testery.</p>:<>
   <div className="controls"><label><input type="checkbox" checked={includeTesters} onChange={e=>setIncludeTesters(e.target.checked)}/> Zahrnout označené testery</label><span>{data.testers.length} označených zařízení · {includeTesters?'Zobrazuji všechny':'Testery vynechávám z návštěv, zemí, pokusů a průchodu levely'}.</span></div>
   <div className="controls"><button disabled={busy||!devices.some(d=>d.id===own)} onClick={()=>onMark(own,!data.testers.includes(own))}>{data.testers.includes(own)?'Zrušit označení tohoto prohlížeče':'Označit tento prohlížeč jako tester'}</button>
   <label>Zařízení <select aria-label="Zařízení testera" value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Vyber podle ID z pokusu</option>{devices.map(d=><option key={d.id} value={d.id}>{d.id.slice(0,8)} · {d.attempts} pokusů · {d.visits} návštěv{d.id===own?' · tento prohlížeč':''}{d.tester?' · TESTER':''}</option>)}</select></label>
   <button disabled={busy||!selectedDevice} onClick={()=>onMark(selected,!selectedDevice.tester)}>{selectedDevice?.tester?'Zrušit označení testera':'Označit vybrané zařízení jako tester'}</button></div>
   <p>Označ pouze známé testovací zařízení. Samotný vysoký počet výher není důvod k vyřazení hráče. Horní živé počítadlo aktivity zůstává za všechna zařízení.</p>
  </>}
 </section>;
}

export function AnalyticsInsights({data,visits}){
 const [cohortMode,setCohortMode]=useState('new');
 if(!data)return null;
 const report=onboardingReport(visits,levelCatalog,cohortMode==='new'?data.startedAt:null),devices=visitGroups(visits,['device']);
 const sum=key=>data.retention.reduce((n,row)=>n+Number(row[key]||0),0);
 return <>
  <section className="recent-attempts" aria-label="Průchod úvodem"><h2>Průchod prvních 10 levelů</h2>
   <div className="controls"><label>Skupina <select aria-label="Skupina úvodního průchodu" value={cohortMode} onChange={e=>setCohortMode(e.target.value)}><option value="new">Nová zařízení od zapnutí měření</option><option value="all">Celá historie (včetně replayů)</option></select></label></div>
   <p>{report.cohort} zařízení se zaznamenaným spuštěním prvního levelu. Zbývajících {report.unanchored} zařízení v této skupině nemá zachycený začátek hry (mohou již mít postup nebo hru nespustila). {cohortMode==='new'&&<>Vynecháno {report.older} dříve zaznamenaných zařízení nebo zařízení bez data první návštěvy. </>}Opakování levelu zařízení nepřičítá. Všechny verze; platí přepínač testerů.</p>
   <p>„Další level“ znamená, že jsme u stejného zařízení zaznamenali i následující level. Neurčuje pořadí událostí ani trvalý odchod; hráč může pokračovat později. Historická data nedokážou odlišit nový začátek od replaye prvního levelu.</p>
   <div className="recent-wrap"><table><thead><tr>{['Level','Začali','Z úvodní skupiny','Vyhráli','Další level','Zatím bez dalšího'].map(label=><th key={label}>{label}</th>)}</tr></thead><tbody>{report.levels.map(row=><tr key={row.id}><td>{row.number}. {row.name}</td><td>{row.started}</td><td>{funnelPercent(row.started,report.cohort)}</td><td>{row.won}<small>{funnelPercent(row.won,row.started)} ze začínajících</small></td><td>{row.continued??'—'}</td><td>{row.pending??'—'}</td></tr>)}</tbody></table></div>
  </section>
  <section className="recent-attempts" aria-label="Typ zařízení"><h2>Mobil a desktop</h2><p>Hrubý typ prohlížeče, bez ukládání celého user-agentu. Mobil zahrnuje tablet. Starší a nerozpoznaná data jsou Neznámá; typ může prohlížeč hlásit nepřesně.</p><div className="recent-wrap"><table><thead><tr><th>Typ</th><th>Návštěvy</th><th>Zařízení</th><th>Spustili minihru</th><th>Vyhráli</th></tr></thead><tbody>{devices.map(row=><tr key={row.device}><td>{{mobile:'Mobil / tablet',desktop:'Desktop',unknown:'Neznámá'}[row.device]||'Neznámá'}</td><td>{row.visits}</td><td>{row.devices}</td><td>{row.started} ({funnelPercent(row.started,row.visits)})</td><td>{row.won} ({funnelPercent(row.won,row.started)} ze spuštěných)</td></tr>)}</tbody></table></div></section>
  <section className="recent-attempts" aria-label="Návraty hráčů"><h2>Návraty nově zaznamenaných zařízení</h2>
   <p>Měření od {new Date(data.startedAt).toLocaleString('cs-CZ',{timeZone:'Europe/Prague'})}. Skupina vzniká první přijatou návštěvou zařízení po tomto okamžiku. Starší zařízení a označení testeři jsou vždy vynecháni. Dny jsou UTC; výsledek vyhodnocujeme až po skončení celého sledovaného období.</p>
   <p>Návrat další den: {sum('returned_d1')} / {sum('eligible_d1')} ({funnelPercent(sum('returned_d1'),sum('eligible_d1'))}). Návrat během dnů 1–7: {sum('returned_week')} / {sum('eligible_week')} ({funnelPercent(sum('returned_week'),sum('eligible_week'))}). Návrat znamená zachycenou viditelnou hru, ne nutně odehraný level.</p>
   <div className="recent-wrap"><table><thead><tr><th>První den (UTC)</th><th>Nová zařízení</th><th>Další den</th><th>Během dnů 1–7</th></tr></thead><tbody>{data.retention.map(row=><tr key={row.day}><td>{row.day}</td><td>{row.devices}</td><td>{row.eligible_d1?`${row.returned_d1} / ${row.eligible_d1} (${funnelPercent(row.returned_d1,row.eligible_d1)})`:'Čeká na celý další den'}</td><td>{row.eligible_week?`${row.returned_week} / ${row.eligible_week} (${funnelPercent(row.returned_week,row.eligible_week)})`:'Čeká na celý týden'}</td></tr>)}</tbody></table></div>
   {!data.retention.length&&<p>Zatím žádná nová zařízení od zapnutí tohoto měření. Historické návraty zpětně nedopočítáváme.</p>}
  </section>
 </>;
}
