import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {makeBoard,matches,swap,adjacent,refill,findMove} from '../../src/match3.js';
import {chargeRoute,routeComplete} from '../../src/experimental/networkRoute.js';
import {networkDraftLevels} from '../../src/experimental/networkChapter.js';
import './network-preview.css';

const sprites=['coupler','solar','lens','insulator','capsule','habitat'];
const colors=['#47d6ef','#f6c75f','#b78cf8','#b9c5ce','#ff897f','#87e9aa'];
function Preview(){
 const [index,setIndex]=useState(0),[attempt,setAttempt]=useState(0);
 return <main><h1>Nová síť · levely 201–210</h1><p>Pracovní náhled. Bez účtu, ukládání, energie, reklam a odesílání výsledků. Čísla nejsou finální obtížnost. Stávajících 200 levelů se nemění.</p>
 <label>Úkol <select value={index} onChange={e=>setIndex(Number(e.target.value))}>{networkDraftLevels.map((r,i)=><option key={r.id} value={i}>{r.number} · {r.csName}</option>)}</select></label>
 <button onClick={()=>setAttempt(n=>n+1)}>Nový pokus</button>
 <Puzzle key={`${index}-${attempt}`} repair={networkDraftLevels[index]} onNext={()=>setIndex(i=>Math.min(9,i+1))}/>
 <details><summary>Návrh nových dílků</summary><p>Signální spojka, solární destička, optická čočka, keramický izolátor, servisní kapsle a obytná patrona. Na desce je všech šest nových návrhů; před vydáním ještě doladíme jejich velikost a čitelnost.</p></details></main>;
}
function Puzzle({repair:r,onNext}){
 const [board,setBoard]=useState(()=>makeBoard(r.level)),[moves,setMoves]=useState(r.moves),[counts,setCounts]=useState([0,0]),[charges,setCharges]=useState([]),[selected,setSelected]=useState(null),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
 const won=routeComplete(r.nodes,charges)&&r.goals.every((g,i)=>counts[i]>=g.target),ended=won||moves===0;
 async function click(at){
  if(busy||ended||board[at]==null)return;
  if(selected==null){setSelected(at);return;}
  const from=selected;setSelected(null);
  if(!adjacent(from,at,r.level.cols)){setSelected(at);return;}
  let next=swap(board,from,at),hit=matches(next,r.level.cols);
  if(!hit.length){setNotice('Tento přesun nevytváří kombinaci. Tah se nespotřeboval.');return;}
  setBusy(true);setMoves(n=>n-1);setNotice('');
  let route=charges,totals=[...counts];
  try{
   for(let wave=0;hit.length;wave++){
    if(wave>=40)throw new Error('Kaskáda překročila bezpečný limit. Obnov pokus.');
    route=chargeRoute(r.nodes,route,hit,r.level.cols,next);
    totals=r.goals.map((g,i)=>Math.min(g.target,totals[i]+hit.filter(cell=>next[cell]===g.type).length));
    setBoard(next);setCharges(route);setCounts(totals);
    await new Promise(resolve=>setTimeout(resolve,160));
    next=refill(next,hit,r.level);hit=matches(next,r.level.cols);
   }
   if(!findMove(next,r.level.cols)){next=makeBoard(r.level);setNotice('Deska bez platného tahu byla obnovena bez dalšího odečtu.');}
   setBoard(next);
  }catch(error){setNotice(error.message);}finally{setBusy(false);}
 }
 const active=r.nodes.findIndex((n,i)=>(charges[i]??0)<n.target);
 return <section><h2>{r.number} · {r.csName}</h2><p>{r.csThought}</p><p><strong>Tahy: {moves}</strong> · {r.goals.map((g,i)=><span key={g.type} style={{color:colors[g.type]}}>● {counts[i]}/{g.target} </span>)}</p>
 {r.nodes.length>0&&<p>Uzly napájej v pořadí 1 → {r.nodes.length}. Kombinace vedle právě zářícího uzlu = 1 impulz. Další uzel přijímá až v následující vlně; kaskáda se počítá.</p>}
 <div className="route-board" aria-label="Herní deska">{board.map((value,at)=>{
  const node=r.nodes.findIndex(n=>n.at===at);
  return node>=0?<div key={at} className={`node ${node===active?'active':''}`} aria-label={`Uzel ${node+1}: ${charges[node]??0}/${r.nodes[node].target}`}><b>{node+1}</b><small>{charges[node]??0}/{r.nodes[node].target}</small></div>:<button key={at} disabled={busy||ended} aria-label={`Pole ${at+1}, typ ${value+1}`} aria-pressed={selected===at} className={selected===at?'selected':''} onClick={()=>click(at)}><img src={`/prototypes/network-tiles/${sprites[value]}.png`} alt=""/></button>;
 })}</div>
 <p role="status">{busy?'Probíhá kaskáda…':won?r.csResult:ended?'Tahů už není dost. Zkus nový pokus.':notice}</p>
 {won&&r.number<210&&<button onClick={onNext}>Další úkol →</button>}
 <p className="limitation">Tento prototyp ověřuje pořadí uzlů a příběh. Nálože, pomůcky, kryty a hvězdy zde zatím nejsou zapojené; není určený k měření finální obtížnosti.</p></section>;
}
createRoot(document.getElementById('root')).render(<Preview/>);
