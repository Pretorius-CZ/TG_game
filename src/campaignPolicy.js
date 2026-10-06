export function campaignFromURL(url){
 const params=new URL(url).searchParams;
 const clean=key=>(params.get(key)||'').trim().replace(/[^a-zA-Z0-9_.-]/g,'').slice(0,80);
 return {source:clean('utm_source')||'direct',medium:clean('utm_medium')||'none',campaign:clean('utm_campaign')||'none'};
}
export function sameCampaign(a,b){return ['source','medium','campaign'].every(key=>a?.[key]===b?.[key]);}
export function reusableVisit(visit,campaign,now){return Boolean(visit?.id&&now-visit.lastAt<30*60*1000&&now>=visit.lastAt&&(campaign.source==='direct'||sameCampaign(visit,campaign)));}
