export function campaignFromURL(url){
 const params=new URL(url).searchParams;
 const clean=key=>(params.get(key)||'').trim().replace(/[^a-zA-Z0-9_.-]/g,'').slice(0,80);
 return {source:clean('utm_source')||'direct',medium:clean('utm_medium')||'none',campaign:clean('utm_campaign')||'none'};
}
export function sameCampaign(a,b){return ['source','medium','campaign'].every(key=>a?.[key]===b?.[key]);}
export function reusableVisit(visit,campaign,now){return Boolean(visit?.id&&now-visit.lastAt<30*60*1000&&now>=visit.lastAt&&(campaign.source==='direct'||sameCampaign(visit,campaign)));}
export function visitForActivity(previous,campaign,now,newId,device='unknown'){
 if(reusableVisit(previous,campaign,now))return {...previous,device:previous.device||device,attempts:{...previous.attempts}};
 return {id:newId(),...campaign,at:now,lastAt:now,revision:0,attempts:{},device};
}
export function deviceCategory(nav){
 const agent=nav?.userAgent||'';
 if(nav?.userAgentData?.mobile||/Mobi|Android|iPad|iPhone|iPod/i.test(agent)||(/Macintosh/i.test(agent)&&nav.maxTouchPoints>1))return 'mobile';
 if(/Windows|Macintosh|Linux|CrOS/i.test(agent))return 'desktop';
 return 'unknown';
}
export function mergeVisitAttempts(previous={},incoming={}){
 const merged={...previous};
 for(const [id,next] of Object.entries(incoming)){
  const old=previous[id];
  // A delayed tab snapshot must not turn a finished attempt back into a start.
  if(old?.outcome==='won'||(next.outcome==='started'&&old?.outcome&&old.outcome!=='started')||(next.outcome==='exhausted'&&['failed','quit','fault'].includes(old?.outcome)))continue;
  merged[id]=next;
 }
 return merged;
}
